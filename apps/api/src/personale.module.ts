import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PersonaleController } from './personale.controller';
import { PersonaleService } from './personale.service';

@Module({
  imports: [PrismaModule],
  controllers: [PersonaleController],
  providers: [PersonaleService],
})
export class PersonaleModule {}
