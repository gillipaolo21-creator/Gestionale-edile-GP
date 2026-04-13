/// <reference types="multer" />
import { Documento, TipoEntitaDocumento } from '@bresciani/db';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DocumentiService } from './documenti.service';
import { UploadDocumentoDto } from './dto/upload-documento.dto';

/**
 * Controller per la gestione dell'upload documentale.
 * Rispetta il principio SOLID di Single Responsibility: gestisce solo l'ingresso HTTP.
 */
@Controller('documenti')
export class DocumentiController {
  constructor(private readonly documentiService: DocumentiService) { }

  @Get(':documentoId/preview')
  async preview(
    @Param('documentoId', new ParseUUIDPipe()) documentoId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const html = await this.documentiService.getPreviewHtml(documentoId);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch {
      res.status(415).send('<p style="font-family:sans-serif;padding:24px;color:#666">Anteprima non disponibile per questo formato.</p>');
    }
  }

  @Get(':documentoId/download')
  async download(
    @Param('documentoId', new ParseUUIDPipe()) documentoId: string,
  ): Promise<StreamableFile> {
    const { stream, filename, mimeType } = await this.documentiService.getFileStream(documentoId);

    return new StreamableFile(stream, {
      type: mimeType,
      disposition: `inline; filename="${encodeURIComponent(filename)}"`,
    });
  }

  @Get('pm-folders')
  async listPmFolders(): Promise<string[]> {
    return this.documentiService.listPmFolders();
  }

  @Get('pending')
  async getPending(): Promise<any[]> {
    return this.documentiService.findPending();
  }

  @Get(':entitaTipo/:entitaId')
  async getByEntity(
    @Param('entitaTipo', new ParseEnumPipe(TipoEntitaDocumento)) entitaTipo: TipoEntitaDocumento,
    @Param('entitaId', new ParseUUIDPipe()) entitaId: string,
  ): Promise<Documento[]> {
    return this.documentiService.findByEntita(entitaTipo, entitaId);
  }

  @Patch(':documentoId/metadata')
  async patchMetadata(
    @Param('documentoId', new ParseUUIDPipe()) documentoId: string,
    @Body('datiEstrattiJson') datiEstrattiJson: string,
  ): Promise<Documento> {
    return this.documentiService.patchMetadata(documentoId, datiEstrattiJson);
  }

  @Delete(':documentoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('documentoId', new ParseUUIDPipe()) documentoId: string,
  ): Promise<void> {
    return this.documentiService.deleteDocumento(documentoId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UploadDocumentoDto,
  ): Promise<Documento> {
    // Nota: L'annotazione esplicita ': Promise<Documento>' risolve l'errore TS2742
    // Impedisce a TS di cercare referenze interne a Prisma non portatili.
    if (!file) {
      throw new BadRequestException('Nessun file fornito nella richiesta');
    }

    return this.documentiService.uploadAndSave(
      file,
      payload.entitaTipo,
      payload.entitaId,
      payload.categoria,
      payload.sottocategoria,
      payload.datiEstrattiJson,
    );
  }
}
