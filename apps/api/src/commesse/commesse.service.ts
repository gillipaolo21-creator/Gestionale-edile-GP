import { Commessa, Prisma, StatoCommessa, TipoEntitaDocumento } from '@bresciani/db';
import { Injectable, InternalServerErrorException, Logger, NotFoundException, StreamableFile } from '@nestjs/common';
import { AuditService } from '../audit.service';
import { DocumentiService } from '../documenti/documenti.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppaltoVoceDto } from './dto/appalto-voce.dto';
import { AttivitaDto } from './dto/create-attivita.dto';
import { CreateCommessaDto } from './dto/create-commessa.dto';

@Injectable()
export class CommesseService {
  private readonly logger = new Logger(CommesseService.name);

  constructor(
    private prisma: PrismaService,
    private documentiService: DocumentiService,
    private auditService: AuditService,
  ) { }

  async findAll(page?: number, limit?: number, filters?: {
    stato?: string;
    responsabile?: string;
    anno?: string;
    citta?: string;
    search?: string;
  }): Promise<any> {
    const usePagination = page !== undefined && limit !== undefined;
    const skip = usePagination ? (page - 1) * limit : undefined;
    const take = usePagination ? limit : undefined;

    // Build Prisma where clause from filters
    const where: any = {};
    if (filters?.stato) where.stato = filters.stato;
    if (filters?.responsabile) where.responsabile = { contains: filters.responsabile, mode: 'insensitive' };
    if (filters?.citta) where.citta = { contains: filters.citta, mode: 'insensitive' };
    if (filters?.anno) {
      const y = parseInt(filters.anno, 10);
      if (!isNaN(y)) {
        where.dataInizio = { gte: new Date(`${y}-01-01`), lt: new Date(`${y + 1}-01-01`) };
      }
    }
    if (filters?.search) {
      where.OR = [
        { nomeCliente: { contains: filters.search, mode: 'insensitive' } },
        { nomeCantiere: { contains: filters.search, mode: 'insensitive' } },
        { codiceIdentificativo: { contains: filters.search, mode: 'insensitive' } },
        { indirizzo: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [total, commesse] = await Promise.all([
      usePagination ? this.prisma.commessa.count({ where }) : Promise.resolve(0),
      this.prisma.commessa.findMany({
        where,
        include: {
          fatture: true,
          sals: { orderBy: { progressivo: 'desc' }, take: 1 }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    // Conta documenti "Contratti Cliente" per ogni commessa (per calcolo stato)
    const commessaIds = commesse.map(c => c.id);
    const contractCounts = await this.prisma.documento.groupBy({
      by: ['entitaId'],
      where: {
        entitaTipo: TipoEntitaDocumento.COMMESSA,
        entitaId: { in: commessaIds },
        categoria: 'Contratti Cliente',
      },
      _count: true,
    });
    const contractMap = new Map(contractCounts.map(c => [c.entitaId, c._count]));

    // Calcola importoCalcolato = importoContratto + somma varianti (con segno)
    const docs = await this.prisma.documento.findMany({
      where: {
        entitaTipo: TipoEntitaDocumento.COMMESSA,
        entitaId: { in: commessaIds },
        categoria: { in: ['Contratti Cliente', 'Varianti'] },
      },
      select: { entitaId: true, categoria: true, datiEstrattiJson: true },
    });

    const importoMap = new Map<string, number>();
    for (const doc of docs) {
      const json = doc.datiEstrattiJson as Record<string, any> | null;
      if (!json) continue;
      const current = importoMap.get(doc.entitaId) || 0;
      if (json.importoContratto) {
        importoMap.set(doc.entitaId, current + Number(json.importoContratto));
      } else if (json.importoVariante) {
        const segno = json.segno === '-' ? -1 : 1;
        importoMap.set(doc.entitaId, current + segno * Number(json.importoVariante));
      }
    }

    const data = commesse.map(c => ({
      ...c,
      hasContrattoCliente: (contractMap.get(c.id) || 0) > 0,
      importoCalcolato: (importoMap.get(c.id) || 0).toString(),
    }));

    if (usePagination) {
      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }
    return data;
  }

  async getNextCode(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `${year}-COMM-`;
    const last = await this.prisma.commessa.findFirst({
      where: { codiceIdentificativo: { startsWith: prefix } },
      orderBy: { codiceIdentificativo: 'desc' },
      select: { codiceIdentificativo: true },
    });

    const lastNumber = last?.codiceIdentificativo?.replace(prefix, '') || '0';
    const next = (parseInt(lastNumber, 10) || 0) + 1;
    const padded = next.toString().padStart(3, '0');
    return `${prefix}${padded}`;
  }

  async create(dto: CreateCommessaDto): Promise<Commessa> {
    this.logger.debug(`Creazione Commessa DTO Ricevuto: ${JSON.stringify(dto)}`);

    try {
      const codice = dto.codiceIdentificativo || await this.getNextCode();
      const commessa = await this.prisma.$transaction(async (tx) => {
        const record = await tx.commessa.create({
          data: {
            codiceIdentificativo: codice,
            tipoLavori: dto.tipoLavori,
            nomeCantiere: dto.nomeCantiere,
            nomeCliente: dto.nomeCliente,
            indirizzo: dto.indirizzo,
            citta: dto.citta,
            cap: dto.cap,
            responsabile: dto.responsabile,
            budgetIniziale: new Prisma.Decimal(dto.budgetIniziale ?? 0),
            dataInizio: new Date(dto.dataInizio),
            stato: StatoCommessa.IN_PREVENTIVAZIONE,
          },
        });

        if (dto.attivita && dto.attivita.length > 0) {
          for (const foglio of dto.attivita) {
            await this.saveAttivitaRecursive(tx, record.id, foglio);
          }
        }

        return record;
      });

      // SOLID: Resilienza (Graceful Degradation).
      // Creiamo la cartella fisica. Se fallisce per permessi o lock OneDrive,
      // il DB mantiene il record e l'utente procede senza blocchi.
      try {
        await this.documentiService.createCommessaFolder(
          commessa.responsabile || 'N_D',
          {
            codiceIdentificativo: commessa.codiceIdentificativo,
            indirizzo: commessa.indirizzo,
            nomeCliente: commessa.nomeCliente,
          }
        );
      } catch (fsError) {
        this.logger.warn(`[I/O NON BLOCCANTE] Cartella non creata su Windows per la commessa ${commessa.id}. Sarà creata al primo upload.`);
      }

      return commessa;
    } catch (error: any) {
      this.logger.error('Errore Database durante la creazione della commessa:', error);
      throw new InternalServerErrorException(error.message || 'Errore durante la persistenza della commessa');
    }
  }

  // Metodo di supporto per passare info utente all'audit (chiamato dal controller)
  async auditLog(entry: { userId?: string; userEmail?: string; azione: string; entita: string; entitaId: string; dataNuova?: any }) {
    await this.auditService.log(entry);
  }

  private async saveAttivitaRecursive(
    tx: Prisma.TransactionClient,
    commessaId: string,
    dto: AttivitaDto,
    parentId: string | null = null,
  ): Promise<void> {
    const attivita = await tx.attivita.create({
      data: {
        commessaId,
        parentId,
        titolo: dto.titolo,
        descrizione: dto.descrizione,
        importoPrevisto: new Prisma.Decimal(dto.importoPrevisto),
        stato: dto.stato || 'PROGRAMMATA',
        responsabile: dto.responsabile,
        dataInizio: dto.dataInizio ? new Date(dto.dataInizio) : null,
        dataFine: dto.dataFine ? new Date(dto.dataFine) : null,
      },
    });

    if (dto.sottocategorie && dto.sottocategorie.length > 0) {
      for (const sub of dto.sottocategorie) {
        await this.saveAttivitaRecursive(tx, commessaId, sub, attivita.id);
      }
    }
  }

  async findOne(id: string): Promise<any> {
    const commessa = await this.prisma.commessa.findUnique({
      where: { id },
      include: {
        attivita: { orderBy: { createdAt: 'asc' } },
        sals: { orderBy: { progressivo: 'desc' } },
        fatture: true,
        appaltoVoci: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!commessa) throw new NotFoundException('Commessa non trovata');

    // Calcola importoCalcolato = importoContratto + somma varianti (con segno)
    const docs = await this.prisma.documento.findMany({
      where: {
        entitaTipo: TipoEntitaDocumento.COMMESSA,
        entitaId: id,
        categoria: { in: ['Contratti Cliente', 'Varianti'] },
      },
      select: { categoria: true, datiEstrattiJson: true },
    });

    let importoCalcolato = 0;
    for (const doc of docs) {
      const json = doc.datiEstrattiJson as Record<string, any> | null;
      if (!json) continue;
      if (json.importoContratto) {
        importoCalcolato += Number(json.importoContratto);
      } else if (json.importoVariante) {
        const segno = json.segno === '-' ? -1 : 1;
        importoCalcolato += segno * Number(json.importoVariante);
      }
    }

    return { ...commessa, importoCalcolato: importoCalcolato.toString() };
  }

  async updateDataInizioLavori(id: string, dataInizioLavori: string | null): Promise<Commessa> {
    const commessa = await this.prisma.commessa.findUnique({ where: { id } });
    if (!commessa) throw new NotFoundException('Commessa non trovata');

    const data: Prisma.CommessaUpdateInput = {
      dataInizioLavori: dataInizioLavori ? new Date(dataInizioLavori) : null,
    };

    // Auto-transition: setting dataInizioLavori moves the commessa to IN_CORSO
    if (dataInizioLavori && commessa.stato !== StatoCommessa.CHIUSO) {
      data.stato = StatoCommessa.IN_CORSO;
    }

    return this.prisma.commessa.update({ where: { id }, data });
  }

  async close(id: string): Promise<Commessa> {
    try {
      const commessa = await this.prisma.commessa.update({
        where: { id },
        data: { stato: StatoCommessa.CHIUSO },
      });
      this.logger.log(`Commessa ${id} chiusa con successo.`);
      return commessa;
    } catch (error) {
      this.logger.error(`Errore chiusura commessa ${id}:`, error);
      throw new InternalServerErrorException("Errore durante la chiusura della commessa.");
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Rimuovi documenti dal DB (i file su disco restano nella cartella)
        await tx.documento.deleteMany({
          where: { entitaTipo: TipoEntitaDocumento.COMMESSA, entitaId: id },
        });

        // Rimuovi fatture e SAL (hanno onDelete: Restrict)
        await tx.fattura.deleteMany({ where: { commessaId: id } });
        await tx.sal.deleteMany({ where: { commessaId: id } });

        // La commessa e le relazioni cascade (attivita, forniture, appaltoVoci) verranno eliminate
        await tx.commessa.delete({ where: { id } });
      });
      this.logger.log(`Commessa ${id} eliminata dal sistema. I file su disco sono stati mantenuti.`);
    } catch (error: any) {
      this.logger.error(`Errore eliminazione commessa ${id}:`, error);
      throw new InternalServerErrorException("Errore durante l'eliminazione della commessa.");
    }
  }

  async getDeleteInfo(id: string): Promise<{ hasDocuments: boolean; hasFilesOnDisk: boolean }> {
    const commessa = await this.prisma.commessa.findUnique({ where: { id } });
    if (!commessa) throw new NotFoundException('Commessa non trovata');

    const documento = await this.prisma.documento.findFirst({
      where: { entitaTipo: TipoEntitaDocumento.COMMESSA, entitaId: id },
      select: { id: true },
    });

    const hasFilesOnDisk = await this.documentiService.hasCommessaFiles({
      responsabile: commessa.responsabile,
      codiceIdentificativo: commessa.codiceIdentificativo,
      indirizzo: commessa.indirizzo,
      nomeCliente: commessa.nomeCliente,
    });

    return { hasDocuments: !!documento, hasFilesOnDisk };
  }

  async removeFromHome(id: string): Promise<void> {
    await this.remove(id);
  }

  async exportAppaltoVociExcel(commessaId: string): Promise<StreamableFile> {
    const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
    if (!commessa) throw new NotFoundException('Commessa non trovata');

    const voci = await this.getAppaltoVoci(commessaId);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const XLSX = require('xlsx') as typeof import('xlsx');

    const wsData = [
      ['Descrizione', 'U.M.', 'Quantità', 'Prezzo Unitario', 'Importo', 'Avanzamento %'],
      ...voci.map(v => [
        v.descrizione,
        v.unitaMisura,
        Number(v.quantita),
        Number(v.prezzoUnitario),
        Number(v.quantita) * Number(v.prezzoUnitario),
        Number(v.avanzamentoPercent),
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Appalto Voci');
    const buffer: Buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new StreamableFile(buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="appalto-voci-${commessa.codiceIdentificativo}.xlsx"`,
    });
  }

  async getAppaltoVoci(commessaId: string) {
    const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
    if (!commessa) throw new NotFoundException('Commessa non trovata');

    return this.prisma.appaltoVoce.findMany({
      where: { commessaId },
      orderBy: [{ parentId: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async setAppaltoVoci(commessaId: string, voci: AppaltoVoceDto[]) {
    const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
    if (!commessa) throw new NotFoundException('Commessa non trovata');

    await this.prisma.$transaction(async (tx) => {
      await tx.appaltoVoce.deleteMany({ where: { commessaId } });
      if (voci.length === 0) return;

      await tx.appaltoVoce.createMany({
        data: voci.map((voce) => ({
          commessaId,
          parentId: voce.parentId || null,
          descrizione: voce.descrizione,
          unitaMisura: voce.unitaMisura,
          quantita: new Prisma.Decimal(voce.quantita),
          prezzoUnitario: new Prisma.Decimal(voce.prezzoUnitario),
          avanzamentoPercent: new Prisma.Decimal(voce.avanzamentoPercent),
        })),
      });
    });

    return this.getAppaltoVoci(commessaId);
  }

  /**
   * Statistiche aggregate per la dashboard (P1.4 RoadMap).
   * Calcola totali reali da DB anziché valori hardcoded nel frontend.
   */
  async getStats(): Promise<{
    totaleCommesse: number;
    commessePerStato: Record<string, number>;
    totaleBudget: number;
    totaleImporti: number;
    avanzamentoMedio: number;
  }> {
    const commesse = await this.prisma.commessa.findMany({
      select: {
        stato: true,
        budgetIniziale: true,
        appaltoVoci: { select: { avanzamentoPercent: true, quantita: true, prezzoUnitario: true } },
      },
    });

    const commessePerStato: Record<string, number> = {};
    let totaleBudget = 0;
    let totaleAvanzamento = 0;
    let commesseCounted = 0;

    const commessaIds = await this.prisma.commessa.findMany({ select: { id: true } });
    const ids = commessaIds.map(c => c.id);

    // Somma importi dai documenti (contratti + varianti)
    const docs = await this.prisma.documento.findMany({
      where: {
        entitaTipo: 'COMMESSA',
        entitaId: { in: ids },
        categoria: { in: ['Contratti Cliente', 'Varianti'] },
      },
      select: { datiEstrattiJson: true, categoria: true },
    });

    let totaleImporti = 0;
    for (const doc of docs) {
      const json = doc.datiEstrattiJson as Record<string, any> | null;
      if (!json) continue;
      if (json.importoContratto) totaleImporti += Number(json.importoContratto);
      else if (json.importoVariante) {
        const segno = json.segno === '-' ? -1 : 1;
        totaleImporti += segno * Number(json.importoVariante);
      }
    }

    for (const commessa of commesse) {
      // Conta per stato
      commessePerStato[commessa.stato] = (commessePerStato[commessa.stato] ?? 0) + 1;
      // Budget totale
      totaleBudget += Number(commessa.budgetIniziale);
      // Avanzamento medio (media semplice su commesse con voci)
      if (commessa.appaltoVoci.length > 0) {
        const totImporto = commessa.appaltoVoci.reduce(
          (sum, v) => sum + Number(v.quantita) * Number(v.prezzoUnitario),
          0,
        );
        const totPesato = commessa.appaltoVoci.reduce(
          (sum, v) => sum + Number(v.avanzamentoPercent) * Number(v.quantita) * Number(v.prezzoUnitario),
          0,
        );
        if (totImporto > 0) {
          totaleAvanzamento += (totPesato / totImporto) * 100;
          commesseCounted++;
        }
      }
    }

    return {
      totaleCommesse: commesse.length,
      commessePerStato,
      totaleBudget,
      totaleImporti,
      avanzamentoMedio: commesseCounted > 0 ? Math.round(totaleAvanzamento / commesseCounted) : 0,
    };
  }
}
