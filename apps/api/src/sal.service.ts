import { Prisma, Sal, StatoSAL, TipoSAL } from '@prisma/client';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateSalDto, UpdateSalDto } from './sal.dto';

@Injectable()
export class SalService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { commessaId?: string; tipo?: TipoSAL }): Promise<Sal[]> {
    return this.prisma.sal.findMany({
      where: {
        ...(filters?.commessaId && { commessaId: filters.commessaId }),
        ...(filters?.tipo && { tipo: filters.tipo }),
      },
      include: { commessa: { select: { nomeCantiere: true, codiceIdentificativo: true } } },
      orderBy: [{ commessaId: 'asc' }, { progressivo: 'desc' }],
    });
  }

  async findOne(id: string): Promise<Sal> {
    const sal = await this.prisma.sal.findUnique({ where: { id } });
    if (!sal) throw new NotFoundException(`SAL ${id} non trovato`);
    return sal;
  }

  async create(dto: CreateSalDto): Promise<Sal> {
    const commessaId = dto.commessaId;
    const tipo = dto.tipo ?? TipoSAL.ATTIVO;

    try {
      return await this.prisma.$transaction(async (tx) => {
        // V2: verifica capienza contratto (solo per SAL ATTIVO)
        if (tipo === TipoSAL.ATTIVO) {
          const commessa = await tx.commessa.findUnique({
            where: { id: commessaId },
            select: { importoContratto: true },
          });
          if (!commessa) throw new NotFoundException(`Commessa ${commessaId} non trovata`);

          const totaleEsistente = await tx.sal.aggregate({
            where: { commessaId, tipo: TipoSAL.ATTIVO },
            _sum: { importoMaturato: true },
          });

          const maturato = Number(totaleEsistente._sum.importoMaturato ?? 0);
          const contratto = Number(commessa.importoContratto ?? 0);

          if (contratto > 0 && maturato + dto.importoMaturato > contratto) {
            throw new BadRequestException(
              `Importo maturato cumulato (${(maturato + dto.importoMaturato).toFixed(2)} €) supera l'importo contratto (${contratto.toFixed(2)} €)`,
            );
          }
        }

        let progressivo = dto.progressivo;
        if (progressivo === undefined) {
          const last = await tx.sal.findFirst({
            where: { commessaId, tipo },
            orderBy: { progressivo: 'desc' },
            select: { progressivo: true },
          });
          progressivo = (last?.progressivo ?? 0) + 1;
        }

        return tx.sal.create({
          data: {
            commessaId,
            contrattoSubappaltoId: dto.contrattoSubappaltoId,
            tipo,
            progressivo,
            dataCertificazione: dto.dataCertificazione ? new Date(dto.dataCertificazione) : new Date(),
            percentualeCompletamento: dto.percentualeCompletamento ?? 0,
            importoMaturato: dto.importoMaturato,
            importoRitenuta: dto.importoRitenuta,
            stato: dto.stato ?? StatoSAL.BOZZA,
            note: dto.note,
          },
        });
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('SAL con lo stesso progressivo già esistente per questa commessa e tipo');
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateSalDto): Promise<Sal> {
    await this.findOne(id);
    return this.prisma.sal.update({
      where: { id },
      data: {
        ...dto,
        dataCertificazione: dto.dataCertificazione ? new Date(dto.dataCertificazione) : undefined,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const sal = await this.findOne(id);
    if (sal.stato !== StatoSAL.BOZZA) {
      throw new BadRequestException('Solo i SAL in stato BOZZA possono essere eliminati');
    }
    await this.prisma.sal.delete({ where: { id } });
  }
}
