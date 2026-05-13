import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SubappaltatoriController } from './subappaltatori.controller';
import { SubappaltatoriService } from './subappaltatori.service';

@Module({
  imports: [PrismaModule],
  controllers: [SubappaltatoriController],
  providers: [SubappaltatoriService],
})
export class SubappaltatoriModule {}
