import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SocietaService } from './societa.service';

@ApiTags('societa')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('societa')
export class SocietaController {
  constructor(private readonly societaService: SocietaService) {}

  @Get()
  async findAll() {
    return this.societaService.findAll();
  }
}
