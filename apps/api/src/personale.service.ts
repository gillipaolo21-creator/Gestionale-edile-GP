import { Injectable, NotFoundException } from '@nestjs/common';
import {
    DpiAssegnato,
    Personale,
    PresenzaGiornaliera,
    Qualifica,
    ScadenzaCorsoSicurezza,
} from '@prisma/client';
import {
    CreateCorsoSicurezzaDto,
    CreateDpiDto,
    CreatePersonaleDto,
    CreatePresenzaDto,
    UpdatePersonaleDto,
} from './personale.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class PersonaleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { attivo?: boolean; qualifica?: Qualifica }): Promise<Personale[]> {
    return this.prisma.personale.findMany({
      where: {
        ...(filters?.attivo !== undefined && { attivo: filters.attivo }),
        ...(filters?.qualifica && { qualifica: filters.qualifica }),
      },
      orderBy: [{ cognome: 'asc' }, { nome: 'asc' }],
    });
  }

  async findOne(id: string): Promise<Personale & { scadenzeCorsi: ScadenzaCorsoSicurezza[]; dpiAssegnati: DpiAssegnato[] }> {
    const personale = await this.prisma.personale.findUnique({
      where: { id },
      include: { scadenzeCorsi: true, dpiAssegnati: true },
    });
    if (!personale) throw new NotFoundException(`Personale ${id} non trovato`);
    return personale;
  }

  async create(dto: CreatePersonaleDto): Promise<Personale> {
    return this.prisma.personale.create({
      data: {
        matricola: dto.matricola,
        nome: dto.nome,
        cognome: dto.cognome,
        qualifica: dto.qualifica,
        costoOrario: dto.costoOrario,
        telefono: dto.telefono,
        email: dto.email,
        codiceFiscale: dto.codiceFiscale,
        dataAssunzione: dto.dataAssunzione ? new Date(dto.dataAssunzione) : undefined,
        attivo: dto.attivo ?? true,
        note: dto.note,
      },
    });
  }

  async update(id: string, dto: UpdatePersonaleDto): Promise<Personale> {
    await this.findOne(id);
    return this.prisma.personale.update({
      where: { id },
      data: {
        ...dto,
        dataAssunzione: dto.dataAssunzione ? new Date(dto.dataAssunzione) : undefined,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.personale.delete({ where: { id } });
  }

  async createPresenza(personaleId: string, dto: CreatePresenzaDto): Promise<PresenzaGiornaliera> {
    await this.findOne(personaleId);
    return this.prisma.presenzaGiornaliera.create({
      data: {
        personaleId,
        commessaId: dto.commessaId,
        societaId: dto.societaId,
        data: new Date(dto.data),
        oreOrdine: dto.oreOrdine,
        oreExtra: dto.oreExtra ?? 0,
        note: dto.note,
      },
    });
  }

  async getPresenze(
    personaleId: string,
    filters?: { commessaId?: string; dataFrom?: string; dataTo?: string },
  ): Promise<PresenzaGiornaliera[]> {
    await this.findOne(personaleId);
    return this.prisma.presenzaGiornaliera.findMany({
      where: {
        personaleId,
        ...(filters?.commessaId && { commessaId: filters.commessaId }),
        ...(filters?.dataFrom || filters?.dataTo
          ? {
              data: {
                ...(filters.dataFrom && { gte: new Date(filters.dataFrom) }),
                ...(filters.dataTo && { lte: new Date(filters.dataTo) }),
              },
            }
          : {}),
      },
      include: { commessa: { select: { nomeCantiere: true, codiceIdentificativo: true } } },
      orderBy: { data: 'desc' },
    });
  }

  async createCorso(personaleId: string, dto: CreateCorsoSicurezzaDto): Promise<ScadenzaCorsoSicurezza> {
    await this.findOne(personaleId);
    return this.prisma.scadenzaCorsoSicurezza.create({
      data: {
        personaleId,
        tipoCorso: dto.tipoCorso,
        dataCorso: new Date(dto.dataCorso),
        scadenza: new Date(dto.scadenza),
        ente: dto.ente,
        note: dto.note,
      },
    });
  }

  async getCorsi(personaleId: string): Promise<ScadenzaCorsoSicurezza[]> {
    await this.findOne(personaleId);
    const soglia = new Date();
    soglia.setDate(soglia.getDate() + 30);
    const corsi = await this.prisma.scadenzaCorsoSicurezza.findMany({
      where: { personaleId },
      orderBy: { scadenza: 'asc' },
    });
    return corsi.map((c) => ({ ...c, inScadenza: c.scadenza <= soglia }));
  }

  async createDpi(personaleId: string, dto: CreateDpiDto): Promise<DpiAssegnato> {
    await this.findOne(personaleId);
    return this.prisma.dpiAssegnato.create({
      data: {
        personaleId,
        tipoDpi: dto.tipoDpi,
        dataConsegna: new Date(dto.dataConsegna),
        scadenza: dto.scadenza ? new Date(dto.scadenza) : undefined,
        note: dto.note,
      },
    });
  }

  async getDpi(personaleId: string): Promise<DpiAssegnato[]> {
    await this.findOne(personaleId);
    return this.prisma.dpiAssegnato.findMany({
      where: { personaleId },
      orderBy: { dataConsegna: 'desc' },
    });
  }
}
