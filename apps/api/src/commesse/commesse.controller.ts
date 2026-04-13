import { Commessa } from '@bresciani/db';
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
  Put
} from '@nestjs/common';
import { CommesseService } from './commesse.service';
import { AppaltoVoceDto } from './dto/appalto-voce.dto';
import { CreateCommessaDto } from './dto/create-commessa.dto';

@Controller('commesse')
export class CommesseController {
  constructor(private readonly commesseService: CommesseService) { }

  @Get()
  async getAll(): Promise<any[]> {
    return this.commesseService.findAll();
  }

  @Get('next-code')
  async getNextCode(): Promise<{ codiceIdentificativo: string }> {
    const codiceIdentificativo = await this.commesseService.getNextCode();
    return { codiceIdentificativo };
  }

  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<any> {
    return this.commesseService.findOne(id);
  }

  @Get(':id/appalto-voci')
  async getAppaltoVoci(@Param('id', new ParseUUIDPipe()) id: string): Promise<any[]> {
    return this.commesseService.getAppaltoVoci(id);
  }

  @Get(':id/delete-info')
  async getDeleteInfo(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ hasDocuments: boolean; hasFilesOnDisk: boolean }> {
    return this.commesseService.getDeleteInfo(id);
  }

  @Post()
  async create(@Body() payload: CreateCommessaDto): Promise<Commessa> {
    return this.commesseService.create(payload);
  }

  @Put(':id/appalto-voci')
  async setAppaltoVoci(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AppaltoVoceDto[],
  ): Promise<any[]> {
    return this.commesseService.setAppaltoVoci(id, payload);
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
