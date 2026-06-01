import { Module } from '@nestjs/common';
import { SocietaController } from './societa.controller';
import { SocietaService } from './societa.service';

@Module({
  controllers: [SocietaController],
  providers: [SocietaService],
  exports: [SocietaService],
})
export class SocietaModule {}
