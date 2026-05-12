import { Module } from '@nestjs/common';
import { FornitureMaterialiController } from './forniture-materiali.controller';
import { FornitureMaterialiService } from './forniture-materiali.service';

@Module({
  controllers: [FornitureMaterialiController],
  providers: [FornitureMaterialiService],
})
export class FornitureMaterialiModule { }
