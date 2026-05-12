import { Module } from '@nestjs/common';
import { FornitureServiziController } from './forniture-servizi.controller';
import { FornitureServiziService } from './forniture-servizi.service';

@Module({
  controllers: [FornitureServiziController],
  providers: [FornitureServiziService],
})
export class FornitureServiziModule { }
