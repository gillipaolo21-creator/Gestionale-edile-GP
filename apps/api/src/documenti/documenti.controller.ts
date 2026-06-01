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
    Patch,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Documento, TipoEntitaDocumento } from '@prisma/client';
import { Response } from 'express';
import { memoryStorage } from 'multer';
import * as path from 'node:path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentiService } from './documenti.service';
import { UploadDocumentoDto } from './dto/upload-documento.dto';

/** MIME type consentiti per l'upload documenti */
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream', // .dwg e altri file CAD
  'application/dxf',
  'application/x-dxf',
  'application/acad',
  'application/x-acad',
  'application/x-autocad',
  'image/vnd.dwg',
  'application/vnd.dwg',
  'application/x-dwg',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.docx',
  '.doc',
  '.xlsx',
  '.xls',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.txt',
  '.zip',
  '.dwg',
  '.dxf',
]);

const isAllowedUploadFile = (file: { mimetype?: string; originalname?: string }): boolean => {
  const mimeType = (file.mimetype || '').toLowerCase();
  const ext = path.extname(file.originalname || '').toLowerCase();
  return ALLOWED_MIME_TYPES.has(mimeType) || ALLOWED_EXTENSIONS.has(ext);
};

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB – limite esplicito documentale // NOSONAR:typescript:S5693

/**
 * Controller per la gestione dell'upload documentale.
 * Rispetta il principio SOLID di Single Responsibility: gestisce solo l'ingresso HTTP.
 */
@ApiTags('documenti')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documenti')
export class DocumentiController {
  constructor(private readonly documentiService: DocumentiService) { }

  @Get(':documentoId/preview')
  async preview(
    @Param('documentoId') documentoId: string,
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
    @Param('documentoId') documentoId: string,
  ): Promise<StreamableFile> {
    const { stream, filename, mimeType } = await this.documentiService.getFileStream(documentoId);

    return new StreamableFile(stream, {
      type: mimeType,
      disposition: `inline; filename="${encodeURIComponent(filename)}"`,
    });
  }

  @Get('commessa/:commessaId/export-zip')
  async exportZip(
    @Param('commessaId') commessaId: string,
    @Res() res: Response,
  ): Promise<void> {
    const { stream, filename } = await this.documentiService.exportCommessaZip(commessaId);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    stream.pipe(res);
  }

  @Get('pm-folders')
  async listPmFolders(): Promise<string[]> {
    return this.documentiService.listPmFolders();
  }

  @Get('pm-folders/:folder/files')
  async listPmFolderFiles(
    @Param('folder') folder: string,
  ): Promise<{ name: string; size: number }[]> {
    return this.documentiService.listFilesInPmFolder(folder);
  }

  @Post('pm-folders/:folder/import')
  @HttpCode(HttpStatus.OK)
  async importFromPmFolder(
    @Param('folder') folder: string,
    @Body() body: { commessaId: string; fileNames: string[]; categoria: string },
  ): Promise<Documento[]> {
    return this.documentiService.importFromPmFolder(folder, body.fileNames, body.commessaId, body.categoria);
  }

  @Get('pending')
  async getPending(): Promise<any[]> {
    return this.documentiService.findPending();
  }

  @Get(':entitaTipo/:entitaId')
  async getByEntity(
    @Param('entitaTipo', new ParseEnumPipe(TipoEntitaDocumento)) entitaTipo: TipoEntitaDocumento,
    @Param('entitaId') entitaId: string,
  ): Promise<Documento[]> {
    return this.documentiService.findByEntita(entitaTipo, entitaId);
  }

  @Patch(':documentoId/stato')
  async updateStato(
    @Param('documentoId') documentoId: string,
    @Body('stato') stato: string,
  ): Promise<Documento> {
    return this.documentiService.updateStato(documentoId, stato);
  }

  @Patch(':documentoId/metadata')
  async patchMetadata(
    @Param('documentoId') documentoId: string,
    @Body('datiEstrattiJson') datiEstrattiJson: string,
  ): Promise<Documento> {
    return this.documentiService.patchMetadata(documentoId, datiEstrattiJson);
  }

  @Patch(':documentoId/replace-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if (isAllowedUploadFile(file)) {
          cb(null, true);
        } else {
          const ext = path.extname(file.originalname || '').toLowerCase() || '(senza estensione)';
          cb(new BadRequestException(`Tipo file non consentito: ${file.mimetype || '(mime vuoto)'} (${ext})`), false);
        }
      },
    }),
  )
  async replaceFile(
    @Param('documentoId') documentoId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Documento> {
    if (!file) {
      throw new BadRequestException('Nessun file fornito nella richiesta');
    }
    return this.documentiService.replaceFile(documentoId, file);
  }

  @Delete(':documentoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('documentoId') documentoId: string,
  ): Promise<void> {
    return this.documentiService.deleteDocumento(documentoId);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if (isAllowedUploadFile(file)) {
          cb(null, true);
        } else {
          const ext = path.extname(file.originalname || '').toLowerCase() || '(senza estensione)';
          cb(new BadRequestException(`Tipo file non consentito: ${file.mimetype || '(mime vuoto)'} (${ext})`), false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UploadDocumentoDto,
  ): Promise<Documento> {
    if (!file) {
      throw new BadRequestException('Nessun file fornito nella richiesta');
    }

    // Protezione path traversal: sanitizza sottocategoria e categoria
    const safeSottocategoria = payload.sottocategoria
      ? payload.sottocategoria.replace(/[/\\.]/g, '_')
      : undefined;

    // Manteniamo solo un percorso relativo "pulito" per import cartelle.
    const safeRelativePath = payload.relativePath
      ? payload.relativePath.split('\\').join('/').replace(/^\/+/, '')
      : undefined;

    return this.documentiService.uploadAndSave(
      file,
      payload.entitaTipo,
      payload.entitaId,
      payload.categoria,
      safeSottocategoria,
      payload.datiEstrattiJson,
      safeRelativePath,
    );
  }
}
