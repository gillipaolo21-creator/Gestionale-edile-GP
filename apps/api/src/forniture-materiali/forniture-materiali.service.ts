import { FornituraMateriale, Prisma } from '@bresciani/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFornituraMaterialeDto } from './dto/create-fornitura-materiale.dto';

@Injectable()
export class FornitureMaterialiService {
  constructor(private readonly prisma: PrismaService) { }

  async listByCommessa(commessaId: string): Promise<FornituraMateriale[]> {
    return this.prisma.fornituraMateriale.findMany({
      where: { commessaId },
      orderBy: { dataPreventivo: 'desc' },
    });
  }

  async create(commessaId: string, dto: CreateFornituraMaterialeDto): Promise<FornituraMateriale> {
    const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
    if (!commessa) {
      throw new NotFoundException('Commessa non trovata per la fornitura materiale.');
    }

    return this.prisma.fornituraMateriale.create({
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
