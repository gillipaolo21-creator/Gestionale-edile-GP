import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MezziController } from './mezzi.controller';
import { MezziService } from './mezzi.service';

@Module({
  imports: [PrismaModule],
  controllers: [MezziController],
  providers: [MezziService],
})
export class MezziModule {}
