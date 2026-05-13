import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SalController } from './sal.controller';
import { SalService } from './sal.service';

@Module({
  imports: [PrismaModule],
  controllers: [SalController],
  providers: [SalService],
})
export class SalModule {}
