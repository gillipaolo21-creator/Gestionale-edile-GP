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
import { DpiAssegnato, Personale, PresenzaGiornaliera, Qualifica, ScadenzaCorsoSicurezza } from '@prisma/client';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import {
    CreateCorsoSicurezzaDto,
    CreateDpiDto,
    CreatePersonaleDto,
    CreatePresenzaDto,
    UpdatePersonaleDto,
} from './personale.dto';
import { PersonaleService } from './personale.service';

@ApiTags('personale')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('personale')
export class PersonaleController {
  constructor(private readonly personaleService: PersonaleService) {}

  @Get()
  async findAll(
    @Query('attivo') attivo?: string,
    @Query('qualifica') qualifica?: Qualifica,
  ): Promise<Personale[]> {
    const attivoFilter = attivo !== undefined ? attivo === 'true' : undefined;
    return this.personaleService.findAll({ attivo: attivoFilter, qualifica });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<Personale & { scadenzeCorsi: ScadenzaCorsoSicurezza[]; dpiAssegnati: DpiAssegnato[] }> {
    return this.personaleService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreatePersonaleDto): Promise<Personale> {
    return this.personaleService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePersonaleDto): Promise<Personale> {
    return this.personaleService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.personaleService.remove(id);
  }

  @Post(':id/presenze')
  async createPresenza(
    @Param('id') id: string,
    @Body() dto: CreatePresenzaDto,
  ): Promise<PresenzaGiornaliera> {
    return this.personaleService.createPresenza(id, dto);
  }

  @Get(':id/presenze')
  async getPresenze(
    @Param('id') id: string,
    @Query('commessaId') commessaId?: string,
    @Query('dataFrom') dataFrom?: string,
    @Query('dataTo') dataTo?: string,
  ): Promise<PresenzaGiornaliera[]> {
    return this.personaleService.getPresenze(id, { commessaId, dataFrom, dataTo });
  }

  @Post(':id/corsi')
  async createCorso(
    @Param('id') id: string,
    @Body() dto: CreateCorsoSicurezzaDto,
  ): Promise<ScadenzaCorsoSicurezza> {
    return this.personaleService.createCorso(id, dto);
  }

  @Get(':id/corsi')
  async getCorsi(@Param('id') id: string): Promise<ScadenzaCorsoSicurezza[]> {
    return this.personaleService.getCorsi(id);
  }

  @Post(':id/dpi')
  async createDpi(@Param('id') id: string, @Body() dto: CreateDpiDto): Promise<DpiAssegnato> {
    return this.personaleService.createDpi(id, dto);
  }

  @Get(':id/dpi')
  async getDpi(@Param('id') id: string): Promise<DpiAssegnato[]> {
    return this.personaleService.getDpi(id);
  }
}
