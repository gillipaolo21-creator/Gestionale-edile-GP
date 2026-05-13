import { Commessa, Prisma, StatoCommessa, TipoOpera } from '@strade-servizi/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommessaDto, UpdateCommessaDto } from './commesse.dto';

@Injectable()
export class CommesseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filters?: {
      stato?: StatoCommessa;
      tipoOpera?: TipoOpera;
      responsabile?: string;
      citta?: string;
      anno?: string;
      search?: string;
    },
    pagination?: { page: number; limit: number },
  ): Promise<{ data: Commessa[]; total: number; totalPages: number; page: number }> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.CommessaWhereInput = {};
    if (filters?.stato) where.stato = filters.stato;
    if (filters?.tipoOpera) where.tipoOpera = filters.tipoOpera;
    if (filters?.responsabile) where.responsabile = { contains: filters.responsabile };
    if (filters?.citta) where.citta = { contains: filters.citta };
    if (filters?.anno) {
      const y = Number.parseInt(filters.anno, 10);
      if (!Number.isNaN(y)) {
        where.dataInizio = { gte: new Date(`${y}-01-01`), lt: new Date(`${y + 1}-01-01`) };
      }
    }
    if (filters?.search) {
      where.OR = [
        { codiceIdentificativo: { contains: filters.search } },
        { nomeCantiere: { contains: filters.search } },
        { committente: { contains: filters.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.commessa.findMany({
        where,
        include: {
          sal: { orderBy: { progressivo: 'desc' }, take: 1 },
          fatture: { orderBy: { dataEmissione: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.commessa.count({ where }),
    ]);

    return { data: data as unknown as Commessa[], total, totalPages: Math.ceil(total / limit), page };
  }

  async findOne(id: string): Promise<any> {
    const commessa = await this.prisma.commessa.findUnique({
      where: { id },
      include: {
        sal: { orderBy: { progressivo: 'desc' } },
        fatture: { orderBy: { dataEmissione: 'desc' } },
        materiali: { orderBy: { dataConsegna: 'desc' } },
        presenze: { select: { oreOrdine: true, oreExtra: true } },
      },
    });
    if (!commessa) throw new NotFoundException(`Commessa ${id} non trovata`);

    const totaleOre = commessa.presenze.reduce(
      (sum: number, p: { oreOrdine: unknown; oreExtra: unknown }) =>
        sum + Number(p.oreOrdine) + Number(p.oreExtra ?? 0),
      0,
    );

    return { ...commessa, totaleOrePersonale: totaleOre };
  }

  async create(dto: CreateCommessaDto): Promise<Commessa> {
    return this.prisma.commessa.create({
      data: {
        codiceIdentificativo: dto.codiceIdentificativo,
        nomeCantiere: dto.nomeCantiere ?? dto.codiceIdentificativo,
        committente: dto.committente ?? dto.nomeCliente,
        tipoOpera: dto.tipoOpera ?? TipoOpera.ALTRO,
        indirizzo: dto.indirizzo,
        citta: dto.citta,
        cap: dto.cap,
        provincia: dto.provincia,
        gpsLat: dto.gpsLat,
        gpsLng: dto.gpsLng,
        responsabile: dto.responsabile,
        importoContratto: dto.importoContratto ?? 0,
        importoLavoriPropri: dto.importoLavoriPropri ?? 0,
        stato: dto.stato ?? StatoCommessa.IN_CORSO,
        dataInizio: dto.dataInizio ? new Date(dto.dataInizio) : undefined,
        dataFinePrevista: dto.dataFinePrevista ? new Date(dto.dataFinePrevista) : undefined,
        dataFineEffettiva: dto.dataFineEffettiva ? new Date(dto.dataFineEffettiva) : undefined,
        note: dto.note,
      },
    });
  }

  async update(id: string, dto: UpdateCommessaDto): Promise<Commessa> {
    await this.findOne(id);
    return this.prisma.commessa.update({
      where: { id },
      data: {
        ...dto,
        dataInizio: dto.dataInizio ? new Date(dto.dataInizio) : undefined,
        dataFinePrevista: dto.dataFinePrevista ? new Date(dto.dataFinePrevista) : undefined,
        dataFineEffettiva: dto.dataFineEffettiva ? new Date(dto.dataFineEffettiva) : undefined,
      },
    });
  }

  async chiudi(id: string): Promise<Commessa> {
    await this.findOne(id);
    return this.prisma.commessa.update({
      where: { id },
      data: { stato: StatoCommessa.CHIUSO, dataFineEffettiva: new Date() },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.commessa.delete({ where: { id } });
  }

  async getNextCode(): Promise<{ codiceIdentificativo: string }> {
    const year = new Date().getFullYear();
    const count = await this.prisma.commessa.count();
    const paddedCount = (count + 1).toString().padStart(3, '0');
    return { codiceIdentificativo: `${year}-COMM-${paddedCount}` };
  }

  async getDeleteInfo(id: string): Promise<{ hasDocuments: boolean; hasFilesOnDisk: boolean }> {
    const docCount = await this.prisma.documento.count({ where: { commessaId: id } });
    return { hasDocuments: docCount > 0, hasFilesOnDisk: docCount > 0 };
  }

  async getStats(): Promise<{
    totaleCommesse: number;
    commessePerStato: Record<string, number>;
    totaleImporti: number;
    totaleBudget: number;
    avanzamentoMedio: number;
  }> {
    const [commesse, sals] = await Promise.all([
      this.prisma.commessa.findMany({
        select: { stato: true, importoContratto: true, importoLavoriPropri: true },
      }),
      this.prisma.sal.findMany({
        where: { tipo: 'ATTIVO' },
        select: { percentualeCompletamento: true },
      }),
    ]);

    const commessePerStato: Record<string, number> = {};
    let totaleImporti = 0;
    let totaleBudget = 0;

    for (const c of commesse) {
      commessePerStato[c.stato] = (commessePerStato[c.stato] ?? 0) + 1;
      totaleImporti += Number(c.importoContratto ?? 0);
      totaleBudget += Number(c.importoLavoriPropri ?? 0);
    }

    const avanzamentoMedio =
      sals.length > 0
        ? sals.reduce((acc, s) => acc + Number(s.percentualeCompletamento ?? 0), 0) / sals.length
        : 0;

    return { totaleCommesse: commesse.length, commessePerStato, totaleImporti, totaleBudget, avanzamentoMedio };
  }
}

