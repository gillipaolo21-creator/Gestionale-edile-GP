import { Commessa } from '@bresciani/db';
import {
    ApiBearerAuth,
    ApiTags,
} from '@nestjs/swagger';
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
    Put,
    Query,
    Request,
    StreamableFile,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CommesseService } from './commesse.service';
import { AppaltoVoceDto } from './dto/appalto-voce.dto';
import { CreateCommessaDto } from './dto/create-commessa.dto';

@ApiTags('commesse')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('commesse')
export class CommesseController {
  constructor(private readonly commesseService: CommesseService) { }

  @Get()
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('stato') stato?: string,
    @Query('responsabile') responsabile?: string,
    @Query('anno') anno?: string,
    @Query('citta') citta?: string,
    @Query('search') search?: string,
  ): Promise<any> {
    const pageNum = page ? Math.max(1, parseInt(page, 10)) : undefined;
    const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit, 10))) : undefined;
    const filters = { stato, responsabile, anno, citta, search };
    return this.commesseService.findAll(pageNum, limitNum, filters);
  }

  @Get('next-code')
  async getNextCode(): Promise<{ codiceIdentificativo: string }> {
    const codiceIdentificativo = await this.commesseService.getNextCode();
    return { codiceIdentificativo };
  }

  @Get('stats')
  async getStats(): Promise<any> {
    return this.commesseService.getStats();
  }

  @Get(':id/appalto-voci')
  async getAppaltoVoci(@Param('id', new ParseUUIDPipe()) id: string): Promise<any[]> {
    return this.commesseService.getAppaltoVoci(id);
  }

  @Get(':id/delete-info')
  async getDeleteInfo(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ hasDocuments: boolean; hasFilesOnDisk: boolean }> {
    return this.commesseService.getDeleteInfo(id);
  }

  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<any> {
    return this.commesseService.findOne(id);
  }

  @Post()
  async create(
    @Body() payload: CreateCommessaDto,
    @Request() req: { user: JwtPayload },
  ): Promise<Commessa> {
    if (!payload.responsabile) {
      payload.responsabile = req.user.email;
    }
    return this.commesseService.create(payload);
  }

  @Put(':id/appalto-voci')
  async setAppaltoVoci(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AppaltoVoceDto[],
  ): Promise<any[]> {
    return this.commesseService.setAppaltoVoci(id, payload);
  }

  @Get(':id/export/appalto-voci')
  async exportAppaltoVoci(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<StreamableFile> {
    return this.commesseService.exportAppaltoVociExcel(id);
  }

  /**
   * SOLID: Endpoint per la chiusura sicura della commessa (Status Change).
   * Previene la perdita di dati storici e documenti contabili.
   */
  @Patch(':id/data-inizio-lavori')
  async updateDataInizioLavori(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: { dataInizioLavori: string | null },
  ): Promise<Commessa> {
    return this.commesseService.updateDataInizioLavori(id, body.dataInizioLavori);
  }

  @Patch(':id/chiudi')
  async close(@Param('id', new ParseUUIDPipe()) id: string): Promise<Commessa> {
    return this.commesseService.close(id);
  }

  /**
   * Endpoint di eliminazione fisica (Mantenuto solo per emergenze DB / Admin)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commesseService.remove(id);
  }

  @Delete(':id/home')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromHome(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commesseService.removeFromHome(id);
  }
}
