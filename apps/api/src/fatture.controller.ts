import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Fattura, TipoDocumentoFiscale } from '@strade-servizi/db';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateFatturaDto, UpdateFatturaDto } from './fatture.dto';
import { FattureService } from './fatture.service';

@ApiTags('fatture')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fatture')
export class FattureController {
  constructor(private readonly fattureService: FattureService) {}

  @Get('scadenze')
  async getScadenze(): Promise<Fattura[]> {
    return this.fattureService.getScadenze();
  }

  @Get()
  async findAll(
    @Query('commessaId') commessaId?: string,
    @Query('tipo') tipo?: TipoDocumentoFiscale,
  ): Promise<Fattura[]> {
    return this.fattureService.findAll({ commessaId, tipo });
  }

  @Post()
  async create(@Body() dto: CreateFatturaDto): Promise<Fattura> {
    return this.fattureService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFatturaDto): Promise<Fattura> {
    return this.fattureService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.fattureService.remove(id);
  }
}
