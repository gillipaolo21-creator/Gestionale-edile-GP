import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AuditModule } from './audit.module';
import { AuthModule } from './auth/auth.module';
import { CommesseModule } from './commesse/commesse.module';
import { DocumentiModule } from './documenti/documenti.module';
import { FattureModule } from './fatture.module';
import { FornitureMaterialiModule } from './forniture-materiali/forniture-materiali.module';
import { FornitureServiziModule } from './forniture-servizi/forniture-servizi.module';
import { JobsModule } from './jobs/jobs.module';
import { PrismaModule } from './prisma/prisma.module';
import { SalModule } from './sal.module';

@Module({
  imports: [
    PrismaModule,
    // Connessione globale al motore Redis (SOLID: configurazione centralizzata)
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    CommesseModule,
    JobsModule,
    DocumentiModule,
    FornitureMaterialiModule,
    FornitureServiziModule,
    FattureModule,
    SalModule,
    AuthModule,
    AuditModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
