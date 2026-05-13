import { Module } from '@nestjs/common';
import { FattureService } from '../fatture.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SalService } from '../sal.service';
import { CommesseController } from './commesse.controller';
import { CommesseService } from './commesse.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommesseController],
  providers: [CommesseService, SalService, FattureService],
})
export class CommesseModule {}
