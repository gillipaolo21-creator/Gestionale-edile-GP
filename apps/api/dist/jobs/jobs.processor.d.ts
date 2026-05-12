import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
export declare class JobsProcessor extends WorkerHost {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private extractString;
    private extractNumber;
    process(job: Job<any, any, string>): Promise<void>;
    private parseComputoMetricoRow;
    private persistComputoMetricoVoce;
    private importComputoMetrico;
    private importFornitori;
    private importListinoPrezzi;
}
