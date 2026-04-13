import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { EntitaTargetImport, StatoJob, JobImportazione } from '@bresciani/db';

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
}