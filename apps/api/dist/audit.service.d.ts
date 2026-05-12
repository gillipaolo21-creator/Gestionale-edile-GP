import { PrismaService } from './prisma/prisma.service';
export interface AuditLogEntry {
    userId?: string;
    userEmail?: string;
    azione: string;
    entita: string;
    entitaId: string;
    dataPrecedente?: Record<string, unknown>;
    dataNuova?: Record<string, unknown>;
}
export declare class AuditService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    log(entry: AuditLogEntry): Promise<void>;
    findAll(filters?: {
        commessaId?: string;
        userId?: string;
    }, page?: number, limit?: number): Promise<{
        data: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
}
