import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentoSicurezza } from '@strade-servizi/db';
import { PrismaService } from './prisma/prisma.service';
import { CreateDocumentoSicurezzaDto, UpdateDocumentoSicurezzaDto } from './sicurezza.dto';

@Injectable()
export class SicurezzaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(commessaId?: string): Promise<DocumentoSicurezza[]> {
    return this.prisma.documentoSicurezza.findMany({
      where: commessaId ? { commessaId } : undefined,
      orderBy: { scadenza: 'asc' },
    });
  }

  async findOne(id: string): Promise<DocumentoSicurezza> {
    const doc = await this.prisma.documentoSicurezza.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Documento sicurezza ${id} non trovato`);
    return doc;
  }

  async create(dto: CreateDocumentoSicurezzaDto): Promise<DocumentoSicurezza> {
    return this.prisma.documentoSicurezza.create({
      data: {
        commessaId: dto.commessaId,
        tipo: dto.tipo,
        titolo: dto.titolo,
        dataEmissione: dto.dataEmissione ? new Date(dto.dataEmissione) : undefined,
        scadenza: dto.scadenza ? new Date(dto.scadenza) : undefined,
        fileUrl: dto.fileUrl,
        note: dto.note,
      },
    });
  }

  async update(id: string, dto: UpdateDocumentoSicurezzaDto): Promise<DocumentoSicurezza> {
    await this.findOne(id);
    return this.prisma.documentoSicurezza.update({
      where: { id },
      data: {
        ...dto,
        dataEmissione: dto.dataEmissione ? new Date(dto.dataEmissione) : undefined,
        scadenza: dto.scadenza ? new Date(dto.scadenza) : undefined,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.documentoSicurezza.delete({ where: { id } });
  }

  async getScadenzeImminenti(): Promise<DocumentoSicurezza[]> {
    const soglia = new Date();
    soglia.setDate(soglia.getDate() + 60);
    return this.prisma.documentoSicurezza.findMany({
      where: { scadenza: { lte: soglia, gte: new Date() } },
      include: { commessa: { select: { nomeCantiere: true, codiceIdentificativo: true } } },
      orderBy: { scadenza: 'asc' },
    });
  }
}
