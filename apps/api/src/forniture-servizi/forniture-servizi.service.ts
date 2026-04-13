import { FornituraServizio, Prisma } from '@bresciani/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFornituraServizioDto } from './dto/create-fornitura-servizio.dto';

@Injectable()
export class FornitureServiziService {
  constructor(private readonly prisma: PrismaService) { }

  async listByCommessa(commessaId: string): Promise<FornituraServizio[]> {
    return this.prisma.fornituraServizio.findMany({
      where: { commessaId },
      orderBy: { dataPreventivo: 'desc' },
    });
  }

  async create(commessaId: string, dto: CreateFornituraServizioDto): Promise<FornituraServizio> {
    const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
    if (!commessa) {
      throw new NotFoundException('Commessa non trovata per la fornitura servizio.');
    }

    return this.prisma.fornituraServizio.create({
      data: {
        commessaId,
        fornitoreNome: dto.fornitoreNome,
        importoFornitura: new Prisma.Decimal(dto.importoFornitura),
        descrizione: dto.descrizione,
        preventivoRiferimento: dto.preventivoRiferimento,
        dataPreventivo: new Date(dto.dataPreventivo),
      },
    });
  }
}
