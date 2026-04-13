import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { EntitaTargetImport, JobImportazione } from '@bresciani/db';
export declare class JobsService {
    private readonly importQueue;
    private readonly prisma;
    private readonly logger;
    constructor(importQueue: Queue, prisma: PrismaService);
    enqueueImportJob(documentoId: string, target: EntitaTargetImport): Promise<JobImportazione>;
}
