import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContrattoSubappalto, Subappaltatore } from '@prisma/client';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import {
    CreateContrattoSubappaltoDto,
    CreateSubappaltatoreDto,
    UpdateContrattoSubappaltoDto,
    UpdateSubappaltatoreDto,
} from './subappaltatori.dto';
import { SubappaltatoriService } from './subappaltatori.service';

@ApiTags('subappaltatori')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subappaltatori')
export class SubappaltatoriController {
  constructor(private readonly subappaltatoriService: SubappaltatoriService) {}

  @Get()
  async findAll(
    @Query('attivo') attivo?: string,
    @Query('specializzazione') specializzazione?: string,
  ): Promise<Subappaltatore[]> {
    const attivoFilter = attivo !== undefined ? attivo === 'true' : undefined;
    return this.subappaltatoriService.findAll({ attivo: attivoFilter, specializzazione });
  }

  @Post()
  async create(@Body() dto: CreateSubappaltatoreDto): Promise<Subappaltatore> {
    return this.subappaltatoriService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSubappaltatoreDto,
  ): Promise<Subappaltatore> {
    return this.subappaltatoriService.update(id, dto);
  }

  @Get(':id/contratti')
  async getContratti(@Param('id') id: string): Promise<ContrattoSubappalto[]> {
    return this.subappaltatoriService.getContratti(id);
  }

  @Post(':id/contratti')
  async createContratto(
    @Param('id') id: string,
    @Body() dto: CreateContrattoSubappaltoDto,
  ): Promise<ContrattoSubappalto> {
    return this.subappaltatoriService.createContratto(id, dto);
  }

  @Patch('contratti/:id')
  async updateContratto(
    @Param('id') id: string,
    @Body() dto: UpdateContrattoSubappaltoDto,
  ): Promise<ContrattoSubappalto> {
    return this.subappaltatoriService.updateContratto(id, dto);
  }
}
