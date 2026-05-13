import { Module } from '@nestjs/common';
import { FattureController } from './fatture.controller';
import { FattureService } from './fatture.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FattureController],
  providers: [FattureService],
})
export class FattureModule {}
