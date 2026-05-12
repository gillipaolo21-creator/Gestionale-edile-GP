import { EntitaTargetImport, JobImportazione } from '@bresciani/db';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
export declare class JobsService {
    private readonly importQueue;
    private readonly prisma;
    private readonly logger;
    constructor(importQueue: Queue, prisma: PrismaService);
    enqueueImportJob(documentoId: string, target: EntitaTargetImport): Promise<JobImportazione>;
    findOne(jobId: string): Promise<JobImportazione | null>;
    findRecent(limit?: number): Promise<JobImportazione[]>;
}
