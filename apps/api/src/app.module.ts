import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommesseModule } from './commesse/commesse.module';
import { DocumentiModule } from './documenti/documenti.module';
import { FattureModule } from './fatture.module';
import { JobsModule } from './jobs.module';
import { MaterialiModule } from './materiali.module';
import { MezziModule } from './mezzi.module';
import { PersonaleModule } from './personale.module';
import { PrismaModule } from './prisma/prisma.module';
import { SalModule } from './sal.module';
import { SicurezzaModule } from './sicurezza.module';
import { SubappaltatoriModule } from './subappaltatori.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CommesseModule,
    DocumentiModule,
    MaterialiModule,
    MezziModule,
    PersonaleModule,
    SalModule,
    FattureModule,
    SicurezzaModule,
    SubappaltatoriModule,
    JobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
