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
import { AssegnazioneMezzo, Mezzo, ScadenzaMezzo, StatoMezzo, TipoMezzo } from '@strade-servizi/db';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import {
    CreateAssegnazioneMezzoDto,
    CreateMezzoDto,
    CreateScadenzaMezzoDto,
    UpdateMezzoDto,
} from './mezzi.dto';
import { MezziService } from './mezzi.service';

@ApiTags('mezzi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mezzi')
export class MezziController {
  constructor(private readonly mezziService: MezziService) {}

  @Get('scadenze/imminenti')
  async getScadenzeImminenti(): Promise<ScadenzaMezzo[]> {
    return this.mezziService.getScadenzeImminenti();
  }

  @Get()
  async findAll(
    @Query('stato') stato?: StatoMezzo,
    @Query('tipo') tipo?: TipoMezzo,
  ): Promise<Mezzo[]> {
    return this.mezziService.findAll({ stato, tipo });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<Mezzo & { assegnazioni: AssegnazioneMezzo[]; scadenze: ScadenzaMezzo[] }> {
    return this.mezziService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateMezzoDto): Promise<Mezzo> {
    return this.mezziService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMezzoDto): Promise<Mezzo> {
    return this.mezziService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.mezziService.remove(id);
  }

  @Post(':id/assegnazioni')
  async createAssegnazione(
    @Param('id') id: string,
    @Body() dto: CreateAssegnazioneMezzoDto,
  ): Promise<AssegnazioneMezzo> {
    return this.mezziService.createAssegnazione(id, dto);
  }

  @Get(':id/assegnazioni')
  async getAssegnazioni(@Param('id') id: string): Promise<AssegnazioneMezzo[]> {
    return this.mezziService.getAssegnazioni(id);
  }

  @Post(':id/scadenze')
  async createScadenza(
    @Param('id') id: string,
    @Body() dto: CreateScadenzaMezzoDto,
  ): Promise<ScadenzaMezzo> {
    return this.mezziService.createScadenza(id, dto);
  }
}
