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
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Commessa, StatoCommessa, TipoOpera } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFatturaNestedDto, UpdateFatturaDto } from '../fatture.dto';
import { FattureService } from '../fatture.service';
import { CreateSalNestedDto, UpdateSalDto } from '../sal.dto';
import { SalService } from '../sal.service';
import { CreateCommessaDto, ReplaceAppaltoVociDto, UpdateCommessaDto } from './commesse.dto';
import { CommesseService } from './commesse.service';

type PaginationQuery = { page?: string; limit?: string };

@ApiTags('commesse')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('commesse')
export class CommesseController {
  constructor(
    private readonly commesseService: CommesseService,
    private readonly salService: SalService,
    private readonly fattureService: FattureService,
  ) {}

  @Get('stats')
  async getStats() {
    return this.commesseService.getStats();
  }

  @Get('next-code')
  async getNextCode(): Promise<{ codiceIdentificativo: string }> {
    return this.commesseService.getNextCode();
  }

  @Get()
  async findAll(
    @Query('stato') stato?: StatoCommessa,
    @Query('tipoOpera') tipoOpera?: TipoOpera,
    @Query('responsabile') responsabile?: string,
    @Query('citta') citta?: string,
    @Query('anno') anno?: string,
    @Query('search') search?: string,
    @Query() { page, limit }: PaginationQuery = {},
  ) {
    return this.commesseService.findAll(
      { stato, tipoOpera, responsabile, citta, anno, search },
      { page: Number(page ?? 1), limit: Number(limit ?? 20) },
    );
  }

  @Get(':id/delete-info')
  async getDeleteInfo(@Param('id') id: string) {
    return this.commesseService.getDeleteInfo(id);
  }

  // ─── Nested SAL routes ────────────────────────────────────────────────────

  @Get(':id/sal')
  async getSal(
    @Param('id') id: string,
    @Query('tipo') tipo?: string,
  ) {
    return this.salService.findAll({ commessaId: id, tipo: tipo as any });
  }

  @Post(':id/sal')
  async createSal(@Param('id') commessaId: string, @Body() dto: CreateSalNestedDto) {
    return this.salService.create({ ...dto, commessaId });
  }

  @Patch(':id/sal/:salId')
  async updateSal(@Param('salId') salId: string, @Body() dto: UpdateSalDto) {
    return this.salService.update(salId, dto);
  }

  // ─── Nested Fatture routes ────────────────────────────────────────────────

  @Get(':id/fatture')
  async getFatture(@Param('id') id: string) {
    return this.fattureService.findAll({ commessaId: id });
  }

  @Post(':id/fatture')
  async createFattura(@Param('id') commessaId: string, @Body() dto: CreateFatturaNestedDto) {
    return this.fattureService.create({ ...dto, commessaId });
  }

  @Patch(':id/fatture/:fatturaId')
  async updateFattura(@Param('fatturaId') fatturaId: string, @Body() dto: UpdateFatturaDto) {
    return this.fattureService.update(fatturaId, dto);
  }

  // ─── Appalto Voci ─────────────────────────────────────────────────────────

  @Get(':id/appalto-voci')
  async getAppaltoVoci(@Param('id') id: string) {
    return this.commesseService.getAppaltoVoci(id);
  }

  @Put(':id/appalto-voci')
  async replaceAppaltoVoci(@Param('id') id: string, @Body() dto: ReplaceAppaltoVociDto) {
    return this.commesseService.replaceAppaltoVoci(id, dto.voci);
  }

  // ─── Single commessa CRUD ─────────────────────────────────────────────────

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.commesseService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateCommessaDto): Promise<Commessa> {
    return this.commesseService.create(dto);
  }

  @Patch(':id/chiudi')
  async chiudi(@Param('id') id: string): Promise<Commessa> {
    return this.commesseService.chiudi(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCommessaDto): Promise<Commessa> {
    return this.commesseService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.commesseService.remove(id);
  }
}

