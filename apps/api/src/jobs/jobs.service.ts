import { EntitaTargetImport, JobImportazione, StatoJob } from '@bresciani/db';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Service per la gestione asincrona dei Job di importazione.
 * Rispetta il principio SOLID di Dependency Inversion iniettando la coda e il DB.
 */
@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectQueue('excel-import') private readonly importQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * FIX TS2742: L'annotazione esplicita ': Promise<JobImportazione>' è MANDATORIA.
   * Senza questa, il compilatore tenta di esportare tipi interni di PrismaClient
   * che rompono la portabilità del pacchetto nel monorepo.
   */
  async enqueueImportJob(
    documentoId: string,
    target: EntitaTargetImport
  ): Promise<JobImportazione> {
    try {
      // 1. Persistenza del Job su DB per tracciamento stato
      const jobRecord = await this.prisma.jobImportazione.create({
        data: {
          documentoId,
          entitaTarget: target,
          stato: StatoJob.IN_CODA,
        },
      });

      // 2. Accodamento su BullMQ per elaborazione asincrona (Redis)
      await this.importQueue.add(
        'process-excel',
        {
          jobId: jobRecord.id,
          documentoId,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      );

      this.logger.log(`Job importazione ${target} messo in coda con ID: ${jobRecord.id}`);

      return jobRecord;
    } catch (error) {
      this.logger.error(`Fallimento messa in coda Job per documento ${documentoId}`, error);
      throw error;
    }
  }

  async findOne(jobId: string): Promise<JobImportazione | null> {
    return this.prisma.jobImportazione.findUnique({
      where: { id: jobId },
      include: { documento: { select: { id: true, nomeFile: true } } },
    });
  }

  async findRecent(limit = 20): Promise<JobImportazione[]> {
    return this.prisma.jobImportazione.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { documento: { select: { id: true, nomeFile: true } } },
    });
  }
}
