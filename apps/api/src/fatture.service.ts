import { Fattura, Prisma, StatoPagamento } from '@bresciani/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFatturaDto, UpdateFatturaDto } from './fatture.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class FattureService {
  constructor(private readonly prisma: PrismaService) {}

  async findByCommessa(commessaId: string): Promise<Fattura[]> {
    return this.prisma.fattura.findMany({
      where: { commessaId },
      include: { sal: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Fattura> {
    const fattura = await this.prisma.fattura.findUnique({
      where: { id },
      include: { sal: true, commessa: { select: { codiceIdentificativo: true, nomeCantiere: true } } },
    });
    if (!fattura) throw new NotFoundException(`Fattura ${id} non trovata`);
    return fattura;
  }

  async create(commessaId: string, dto: CreateFatturaDto): Promise<Fattura> {
    // Verifica che la commessa esista
    const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
    if (!commessa) throw new NotFoundException(`Commessa ${commessaId} non trovata`);

    return this.prisma.fattura.create({
      data: {
        tipoDocumento: dto.tipoDocumento,
        commessaId,
        salId: dto.salId ?? null,
        importoImponibile: new Prisma.Decimal(dto.importoImponibile),
        iva: new Prisma.Decimal(dto.iva),
        dataScadenza: new Date(dto.dataScadenza),
        statoPagamento: dto.statoPagamento ?? StatoPagamento.DA_PAGARE,
      },
      include: { sal: true },
    });
  }

  async update(id: string, dto: UpdateFatturaDto): Promise<Fattura> {
    await this.findOne(id);
    return this.prisma.fattura.update({
      where: { id },
      data: {
        ...(dto.statoPagamento && { statoPagamento: dto.statoPagamento }),
        ...(dto.dataScadenza && { dataScadenza: new Date(dto.dataScadenza) }),
        ...(dto.importoImponibile !== undefined && { importoImponibile: new Prisma.Decimal(dto.importoImponibile) }),
        ...(dto.iva !== undefined && { iva: new Prisma.Decimal(dto.iva) }),
      },
      include: { sal: true },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.fattura.delete({ where: { id } });
  }

  /** Sommario finanziario per una commessa */
  async getSummary(commessaId: string): Promise<{
    totaleFatturato: number;
    totalePagato: number;
    totaleDaPagare: number;
    countPerStato: Record<StatoPagamento, number>;
  }> {
    const fatture = await this.findByCommessa(commessaId);
    let totaleFatturato = 0;
    let totalePagato = 0;
    let totaleDaPagare = 0;
    const countPerStato: Record<StatoPagamento, number> = {
      DA_PAGARE: 0,
      PARZIALE: 0,
      PAGATO: 0,
    };

    for (const f of fatture) {
      const totale = Number(f.importoImponibile) + Number(f.iva);
      totaleFatturato += totale;
      countPerStato[f.statoPagamento]++;
      if (f.statoPagamento === StatoPagamento.PAGATO) totalePagato += totale;
      else totaleDaPagare += totale;
    }

    return { totaleFatturato, totalePagato, totaleDaPagare, countPerStato };
  }
}
