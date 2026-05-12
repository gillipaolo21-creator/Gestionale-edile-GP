import { Commessa, Prisma } from '@bresciani/db';
import { StreamableFile } from '@nestjs/common';
import { AuditService } from '../audit.service';
import { DocumentiService } from '../documenti/documenti.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppaltoVoceDto } from './dto/appalto-voce.dto';
import { CreateCommessaDto } from './dto/create-commessa.dto';
export declare class CommesseService {
    private prisma;
    private documentiService;
    private auditService;
    private readonly logger;
    constructor(prisma: PrismaService, documentiService: DocumentiService, auditService: AuditService);
    findAll(page?: number, limit?: number, filters?: {
        stato?: string;
        responsabile?: string;
        anno?: string;
        citta?: string;
        search?: string;
    }): Promise<any>;
    getNextCode(): Promise<string>;
    create(dto: CreateCommessaDto): Promise<Commessa>;
    auditLog(entry: {
        userId?: string;
        userEmail?: string;
        azione: string;
        entita: string;
        entitaId: string;
        dataNuova?: any;
    }): Promise<void>;
    private saveAttivitaRecursive;
    findOne(id: string): Promise<any>;
    updateDataInizioLavori(id: string, dataInizioLavori: string | null): Promise<Commessa>;
    close(id: string): Promise<Commessa>;
    remove(id: string): Promise<void>;
    getDeleteInfo(id: string): Promise<{
        hasDocuments: boolean;
        hasFilesOnDisk: boolean;
    }>;
    removeFromHome(id: string): Promise<void>;
    exportAppaltoVociExcel(commessaId: string): Promise<StreamableFile>;
    getAppaltoVoci(commessaId: string): Promise<{
        commessaId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        descrizione: string;
        unitaMisura: string;
        quantita: Prisma.Decimal;
        prezzoUnitario: Prisma.Decimal;
        avanzamentoPercent: Prisma.Decimal;
    }[]>;
    setAppaltoVoci(commessaId: string, voci: AppaltoVoceDto[]): Promise<{
        commessaId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        descrizione: string;
        unitaMisura: string;
        quantita: Prisma.Decimal;
        prezzoUnitario: Prisma.Decimal;
        avanzamentoPercent: Prisma.Decimal;
    }[]>;
    getStats(): Promise<{
        totaleCommesse: number;
        commessePerStato: Record<string, number>;
        totaleBudget: number;
        totaleImporti: number;
        avanzamentoMedio: number;
    }>;
}
