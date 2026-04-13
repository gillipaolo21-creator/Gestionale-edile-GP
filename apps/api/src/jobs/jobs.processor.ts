import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatoJob } from '@bresciani/db';

@Processor('excel-import')
export class JobsProcessor extends WorkerHost {
  private readonly logger = new Logger(JobsProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<void> {
    const { jobId, documentoId } = job.data;
    
    // Utilizziamo documentoId per evitare il warning TS6133 e migliorare il tracing
    this.logger.log(`Inizio elaborazione asincrona Job ID: ${jobId} per il documento: ${documentoId}`);

    try {
      await this.prisma.jobImportazione.update({
        where: { id: jobId },
        data: { stato: StatoJob.IN_ELABORAZIONE },
      });

      // Simulazione I/O pesante (es. parsing Excel) che non blocca il thread
      await new Promise(resolve => setTimeout(resolve, 3000));

      await this.prisma.jobImportazione.update({
        where: { id: jobId },
        data: { stato: StatoJob.COMPLETATO, totaleRecord: 100, recordProcessati: 100 },
      });

      this.logger.log(`Job ID: ${jobId} completato con successo.`);
    } catch (error) {
      this.logger.error(`Errore durante l'elaborazione del Job ${jobId}`, error);
      await this.prisma.jobImportazione.update({
        where: { id: jobId },
        data: { stato: StatoJob.FALLITO, erroriLog: { msg: 'Errore interno worker' } },
      });
      throw error;
    }
  }
}