import { Injectable, NotFoundException } from '@nestjs/common';
import { ContrattoSubappalto, Subappaltatore } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
import {
    CreateContrattoSubappaltoDto,
    CreateSubappaltatoreDto,
    UpdateContrattoSubappaltoDto,
    UpdateSubappaltatoreDto,
} from './subappaltatori.dto';

@Injectable()
export class SubappaltatoriService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { attivo?: boolean; specializzazione?: string }): Promise<Subappaltatore[]> {
    return this.prisma.subappaltatore.findMany({
      where: {
        ...(filters?.attivo !== undefined && { attivo: filters.attivo }),
        ...(filters?.specializzazione && {
          specializzazione: { contains: filters.specializzazione },
        }),
      },
      orderBy: { ragioneSociale: 'asc' },
    });
  }

  async findOne(id: string): Promise<Subappaltatore> {
    const sub = await this.prisma.subappaltatore.findUnique({ where: { id } });
    if (!sub) throw new NotFoundException(`Subappaltatore ${id} non trovato`);
    return sub;
  }

  async create(dto: CreateSubappaltatoreDto): Promise<Subappaltatore> {
    return this.prisma.subappaltatore.create({
      data: { ...dto, attivo: dto.attivo ?? true },
    });
  }

  async update(id: string, dto: UpdateSubappaltatoreDto): Promise<Subappaltatore> {
    await this.findOne(id);
    return this.prisma.subappaltatore.update({ where: { id }, data: dto });
  }

  async getContratti(subappaltatoreId: string): Promise<ContrattoSubappalto[]> {
    await this.findOne(subappaltatoreId);
    return this.prisma.contrattoSubappalto.findMany({
      where: { subappaltatoreId },
      include: { commessa: { select: { nomeCantiere: true, codiceIdentificativo: true } } },
      orderBy: { dataInizio: 'desc' },
    });
  }

  async createContratto(
    subappaltatoreId: string,
    dto: CreateContrattoSubappaltoDto,
  ): Promise<ContrattoSubappalto> {
    await this.findOne(subappaltatoreId);
    return this.prisma.contrattoSubappalto.create({
      data: {
        subappaltatoreId,
        commessaId: dto.commessaId,
        societaId: dto.societaId,
        descrizioneOpera: dto.descrizioneOpera,
        importoAffidato: dto.importoAffidato,
        dataInizio: dto.dataInizio ? new Date(dto.dataInizio) : undefined,
        dataFinePrevista: dto.dataFinePrevista ? new Date(dto.dataFinePrevista) : undefined,
        note: dto.note,
      },
    });
  }

  async updateContratto(contrattoId: string, dto: UpdateContrattoSubappaltoDto): Promise<ContrattoSubappalto> {
    const contratto = await this.prisma.contrattoSubappalto.findUnique({ where: { id: contrattoId } });
    if (!contratto) throw new NotFoundException(`Contratto ${contrattoId} non trovato`);
    return this.prisma.contrattoSubappalto.update({
      where: { id: contrattoId },
      data: {
        ...dto,
        dataInizio: dto.dataInizio ? new Date(dto.dataInizio) : undefined,
        dataFinePrevista: dto.dataFinePrevista ? new Date(dto.dataFinePrevista) : undefined,
      },
    });
  }
}
