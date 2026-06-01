import { Injectable, NotFoundException } from '@nestjs/common';
import { AssegnazioneMezzo, Mezzo, ScadenzaMezzo, StatoMezzo, TipoMezzo } from '@prisma/client';
import {
    CreateAssegnazioneMezzoDto,
    CreateMezzoDto,
    CreateScadenzaMezzoDto,
    UpdateMezzoDto,
} from './mezzi.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class MezziService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { stato?: StatoMezzo; tipo?: TipoMezzo }): Promise<Mezzo[]> {
    return this.prisma.mezzo.findMany({
      where: {
        ...(filters?.stato && { stato: filters.stato }),
        ...(filters?.tipo && { tipo: filters.tipo }),
      },
      orderBy: { codice: 'asc' },
    });
  }

  async findOne(id: string): Promise<Mezzo & { assegnazioni: AssegnazioneMezzo[]; scadenze: ScadenzaMezzo[] }> {
    const mezzo = await this.prisma.mezzo.findUnique({
      where: { id },
      include: { assegnazioni: true, scadenze: true },
    });
    if (!mezzo) throw new NotFoundException(`Mezzo ${id} non trovato`);
    return mezzo;
  }

  async create(dto: CreateMezzoDto): Promise<Mezzo> {
    return this.prisma.mezzo.create({
      data: {
        codice: dto.codice,
        descrizione: dto.descrizione,
        tipo: dto.tipo,
        targa: dto.targa,
        annoImmatricol: dto.annoImmatricol,
        costoOrario: dto.costoOrario,
        proprietario: dto.proprietario,
        stato: dto.stato ?? StatoMezzo.OPERATIVO,
        note: dto.note,
      },
    });
  }

  async update(id: string, dto: UpdateMezzoDto): Promise<Mezzo> {
    await this.findOne(id);
    return this.prisma.mezzo.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.mezzo.delete({ where: { id } });
  }

  async createAssegnazione(mezzoId: string, dto: CreateAssegnazioneMezzoDto): Promise<AssegnazioneMezzo> {
    await this.findOne(mezzoId);
    return this.prisma.assegnazioneMezzo.create({
      data: {
        mezzoId,
        commessaId: dto.commessaId,
        societaId: dto.societaId,
        dataInizio: new Date(dto.dataInizio),
        dataFine: dto.dataFine ? new Date(dto.dataFine) : undefined,
        oreImpiegate: dto.oreImpiegate,
        note: dto.note,
      },
    });
  }

  async getAssegnazioni(mezzoId: string): Promise<AssegnazioneMezzo[]> {
    await this.findOne(mezzoId);
    return this.prisma.assegnazioneMezzo.findMany({
      where: { mezzoId },
      include: { commessa: { select: { nomeCantiere: true, codiceIdentificativo: true } } },
      orderBy: { dataInizio: 'desc' },
    });
  }

  async createScadenza(mezzoId: string, dto: CreateScadenzaMezzoDto): Promise<ScadenzaMezzo> {
    await this.findOne(mezzoId);
    return this.prisma.scadenzaMezzo.create({
      data: {
        mezzoId,
        tipoScadenza: dto.tipoScadenza,
        scadenza: new Date(dto.scadenza),
        completata: dto.completata ?? false,
        note: dto.note,
      },
    });
  }

  async getScadenzeImminenti(): Promise<ScadenzaMezzo[]> {
    const soglia = new Date();
    soglia.setDate(soglia.getDate() + 30);
    return this.prisma.scadenzaMezzo.findMany({
      where: { completata: false, scadenza: { lte: soglia } },
      include: { mezzo: { select: { codice: true, descrizione: true, targa: true } } },
      orderBy: { scadenza: 'asc' },
    });
  }
}
