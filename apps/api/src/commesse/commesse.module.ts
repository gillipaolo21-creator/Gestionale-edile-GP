import { Module } from '@nestjs/common';
import { DocumentiModule } from '../documenti/documenti.module';
import { CommesseController } from './commesse.controller';
import { CommesseService } from './commesse.service';

@Module({
  // SOLID: Importiamo il modulo per rendere disponibile il DocumentiService
  imports: [DocumentiModule],
  controllers: [CommesseController],
  providers: [CommesseService],
})
export class CommesseModule { }
