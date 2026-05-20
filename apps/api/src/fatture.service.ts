import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Fattura, Prisma, StatoPagamento, TipoDocumentoFiscale } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
import { CreateFatturaDto, UpdateFatturaDto } from './fatture.dto';

@Injectable()
export class FattureService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { commessaId?: string; tipo?: TipoDocumentoFiscale }): Promise<Fattura[]> {
    return this.prisma.fattura.findMany({
      where: {
        ...(filters?.commessaId && { commessaId: filters.commessaId }),
        ...(filters?.tipo && { tipoDocumento: filters.tipo }),
      },
      include: { commessa: { select: { nomeCantiere: true, codiceIdentificativo: true } } },
      orderBy: { dataEmissione: 'desc' },
    });
  }

  async findOne(id: string): Promise<Fattura> {
    const fattura = await this.prisma.fattura.findUnique({ where: { id } });
    if (!fattura) throw new NotFoundException(`Fattura ${id} non trovata`);
    return fattura;
  }

  async create(dto: CreateFatturaDto): Promise<Fattura> {
    try {
      return await this.prisma.fattura.create({
        data: {
          tipoDocumento: dto.tipoDocumento,
          commessaId: dto.commessaId,
          salId: dto.salId,
          numero: dto.numero,
          fornitoreCliente: dto.fornitoreCliente,
          importoImponibile: dto.importoImponibile,
          iva: dto.iva ?? 0,
          dataEmissione: dto.dataEmissione ? new Date(dto.dataEmissione) : new Date(),
          dataScadenza: dto.dataScadenza ? new Date(dto.dataScadenza) : undefined,
          statoPagamento: dto.statoPagamento ?? StatoPagamento.DA_PAGARE,
          note: dto.note,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Fattura con lo stesso numero già esistente per questa commessa');
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateFatturaDto): Promise<Fattura> {
    await this.findOne(id);
    return this.prisma.fattura.update({
      where: { id },
      data: {
        ...dto,
        dataEmissione: dto.dataEmissione ? new Date(dto.dataEmissione) : undefined,
        dataScadenza: dto.dataScadenza ? new Date(dto.dataScadenza) : undefined,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.fattura.delete({ where: { id } });
  }

  async getScadenze(): Promise<Fattura[]> {
    const soglia = new Date();
    soglia.setDate(soglia.getDate() + 30);
    return this.prisma.fattura.findMany({
      where: {
        statoPagamento: { not: StatoPagamento.PAGATO },
        dataScadenza: { lte: soglia, gte: new Date() },
      },
      include: { commessa: { select: { nomeCantiere: true, codiceIdentificativo: true } } },
      orderBy: { dataScadenza: 'asc' },
    });
  }
}
