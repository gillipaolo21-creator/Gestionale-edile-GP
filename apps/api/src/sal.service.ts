import { Prisma, Sal, StatoSAL } from '@bresciani/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateSalDto, UpdateSalDto } from './sal.dto';

@Injectable()
export class SalService {
  constructor(private readonly prisma: PrismaService) {}

  async findByCommessa(commessaId: string): Promise<Sal[]> {
    return this.prisma.sal.findMany({
      where: { commessaId },
      include: { fatture: true },
      orderBy: { progressivo: 'desc' },
    });
  }

  async findOne(id: string): Promise<Sal> {
    const sal = await this.prisma.sal.findUnique({
      where: { id },
      include: { fatture: true, commessa: { select: { codiceIdentificativo: true, nomeCantiere: true } } },
    });
    if (!sal) throw new NotFoundException(`SAL ${id} non trovato`);
    return sal;
  }

  async create(commessaId: string, dto: CreateSalDto): Promise<Sal> {
    const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
    if (!commessa) throw new NotFoundException(`Commessa ${commessaId} non trovata`);

    // Calcola il prossimo numero progressivo
    const ultimo = await this.prisma.sal.findFirst({
      where: { commessaId },
      orderBy: { progressivo: 'desc' },
      select: { progressivo: true },
    });
    const progressivo = (ultimo?.progressivo ?? 0) + 1;

    return this.prisma.sal.create({
      data: {
        commessaId,
        progressivo,
        dataCertificazione: new Date(dto.dataCertificazione),
        percentualeCompletamento: new Prisma.Decimal(dto.percentualeCompletamento),
        importoMaturato: new Prisma.Decimal(dto.importoMaturato),
        statoApprovazione: dto.statoApprovazione ?? StatoSAL.BOZZA,
      },
      include: { fatture: true },
    });
  }

  async update(id: string, dto: UpdateSalDto): Promise<Sal> {
    await this.findOne(id);
    return this.prisma.sal.update({
      where: { id },
      data: {
        ...(dto.statoApprovazione && { statoApprovazione: dto.statoApprovazione }),
        ...(dto.dataCertificazione && { dataCertificazione: new Date(dto.dataCertificazione) }),
        ...(dto.percentualeCompletamento !== undefined && {
          percentualeCompletamento: new Prisma.Decimal(dto.percentualeCompletamento),
        }),
        ...(dto.importoMaturato !== undefined && {
          importoMaturato: new Prisma.Decimal(dto.importoMaturato),
        }),
      },
      include: { fatture: true },
    });
  }

  async remove(id: string): Promise<void> {
    // Prima rimuove le fatture collegate (Restrict constraint)
    const sal = await this.findOne(id);
    const salWithFatture = sal as any;
    if (salWithFatture.fatture?.length > 0) {
      await this.prisma.fattura.deleteMany({ where: { salId: id } });
    }
    await this.prisma.sal.delete({ where: { id } });
  }
}
