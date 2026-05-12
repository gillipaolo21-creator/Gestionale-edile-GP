import { Module } from '@nestjs/common';
import { AuditModule } from '../audit.module';
import { DocumentiModule } from '../documenti/documenti.module';
import { CommesseController } from './commesse.controller';
import { CommesseService } from './commesse.service';

@Module({
  imports: [DocumentiModule, AuditModule],
  controllers: [CommesseController],
  providers: [CommesseService],
})
export class CommesseModule { }
