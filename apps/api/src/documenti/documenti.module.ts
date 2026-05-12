import { Module } from '@nestjs/common';
import { DocumentiController } from './documenti.controller';
import { DocumentiService } from './documenti.service';

@Module({
  controllers: [DocumentiController],
  providers: [DocumentiService],
  // SOLID: Rendiamo il service disponibile all'esterno per evitare dipendenze circolari
  exports: [DocumentiService],
})
export class DocumentiModule { }
