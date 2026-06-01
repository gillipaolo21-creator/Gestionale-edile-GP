import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CommesseModule } from './commesse/commesse.module';
import { DocumentiModule } from './documenti/documenti.module';
import { envValidationSchema } from './env.validation';
import { FattureModule } from './fatture.module';
import { JobsModule } from './jobs.module';
import { MaterialiModule } from './materiali.module';
import { MezziModule } from './mezzi.module';
import { PersonaleModule } from './personale.module';
import { PrismaModule } from './prisma/prisma.module';
import { SalModule } from './sal.module';
import { SicurezzaModule } from './sicurezza.module';
import { SocietaModule } from './societa/societa.module';
import { SubappaltatoriModule } from './subappaltatori.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
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
    SocietaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
