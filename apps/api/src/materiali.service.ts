import { Injectable, NotFoundException } from '@nestjs/common';
import { Materiale } from '@strade-servizi/db';
import { CreateMaterialeDto, UpdateMaterialeDto } from './materiali.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class MaterialiService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(commessaId: string): Promise<Materiale[]> {
    return this.prisma.materiale.findMany({
      where: { commessaId },
      orderBy: { dataConsegna: 'desc' },
    });
  }

  async findOne(id: string): Promise<Materiale> {
    const materiale = await this.prisma.materiale.findUnique({ where: { id } });
    if (!materiale) throw new NotFoundException(`Materiale ${id} non trovato`);
    return materiale;
  }

  async create(dto: CreateMaterialeDto): Promise<Materiale> {
    return this.prisma.materiale.create({
      data: {
        commessaId: dto.commessaId,
        fornitoreNome: dto.fornitoreNome ?? '',
        descrizione: dto.descrizione,
        unitaMisura: dto.unitaMisura ?? '',
        quantita: dto.quantita,
        prezzoUnitario: dto.prezzoUnitario,
        dataConsegna: dto.dataConsegna ? new Date(dto.dataConsegna) : undefined,
        ddt: dto.ddt,
        note: dto.note,
      },
    });
  }

  async update(id: string, dto: UpdateMaterialeDto): Promise<Materiale> {
    await this.findOne(id);
    return this.prisma.materiale.update({
      where: { id },
      data: {
        ...dto,
        dataConsegna: dto.dataConsegna ? new Date(dto.dataConsegna) : undefined,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.materiale.delete({ where: { id } });
  }

  async getTotalePerCommessa(commessaId: string): Promise<{ commessaId: string; totaleCosto: number }> {
    const materiali = await this.prisma.materiale.findMany({
      where: { commessaId },
      select: { quantita: true, prezzoUnitario: true },
    });
    const totaleCosto = materiali.reduce(
      (sum, m) => sum + Number(m.quantita) * Number(m.prezzoUnitario),
      0,
    );
    return { commessaId, totaleCosto };
  }
}
