import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SicurezzaController } from './sicurezza.controller';
import { SicurezzaService } from './sicurezza.service';

@Module({
  imports: [PrismaModule],
  controllers: [SicurezzaController],
  providers: [SicurezzaService],
})
export class SicurezzaModule {}
