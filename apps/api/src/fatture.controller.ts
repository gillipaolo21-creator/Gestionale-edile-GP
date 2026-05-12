import { Fattura } from '@bresciani/db';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateFatturaDto, UpdateFatturaDto } from './fatture.dto';
import { FattureService } from './fatture.service';

@ApiTags('fatture')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('commesse/:commessaId/fatture')
export class FattureController {
  constructor(private readonly fattureService: FattureService) {}

  @Get()
  async getByCommessa(
    @Param('commessaId', new ParseUUIDPipe()) commessaId: string,
  ): Promise<Fattura[]> {
    return this.fattureService.findByCommessa(commessaId);
  }

  @Get('summary')
  async getSummary(
    @Param('commessaId', new ParseUUIDPipe()) commessaId: string,
  ): Promise<any> {
    return this.fattureService.getSummary(commessaId);
  }

  @Get(':fatturaId')
  async getOne(
    @Param('fatturaId', new ParseUUIDPipe()) fatturaId: string,
  ): Promise<Fattura> {
    return this.fattureService.findOne(fatturaId);
  }

  @Post()
  async create(
    @Param('commessaId', new ParseUUIDPipe()) commessaId: string,
    @Body() dto: CreateFatturaDto,
  ): Promise<Fattura> {
    return this.fattureService.create(commessaId, dto);
  }

  @Patch(':fatturaId')
  async update(
    @Param('fatturaId', new ParseUUIDPipe()) fatturaId: string,
    @Body() dto: UpdateFatturaDto,
  ): Promise<Fattura> {
    return this.fattureService.update(fatturaId, dto);
  }

  @Delete(':fatturaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('fatturaId', new ParseUUIDPipe()) fatturaId: string,
  ): Promise<void> {
    return this.fattureService.remove(fatturaId);
  }
}
