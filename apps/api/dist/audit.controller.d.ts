import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(commessaId?: string, userId?: string, page?: string, limit?: string): Promise<{
        data: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
}
