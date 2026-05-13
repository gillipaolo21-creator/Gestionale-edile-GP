import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MaterialiController } from './materiali.controller';
import { MaterialiService } from './materiali.service';

@Module({
  imports: [PrismaModule],
  controllers: [MaterialiController],
  providers: [MaterialiService],
})
export class MaterialiModule {}
