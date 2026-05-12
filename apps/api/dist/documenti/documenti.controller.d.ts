import { Documento, TipoEntitaDocumento } from '@bresciani/db';
import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { DocumentiService } from './documenti.service';
import { UploadDocumentoDto } from './dto/upload-documento.dto';
export declare class DocumentiController {
    private readonly documentiService;
    constructor(documentiService: DocumentiService);
    preview(documentoId: string, res: Response): Promise<void>;
    download(documentoId: string): Promise<StreamableFile>;
    exportZip(commessaId: string, res: Response): Promise<void>;
    listPmFolders(): Promise<string[]>;
    getPending(): Promise<any[]>;
    getByEntity(entitaTipo: TipoEntitaDocumento, entitaId: string): Promise<Documento[]>;
    updateStato(documentoId: string, stato: string): Promise<Documento>;
    patchMetadata(documentoId: string, datiEstrattiJson: string): Promise<Documento>;
    delete(documentoId: string): Promise<void>;
    uploadFile(file: Express.Multer.File, payload: UploadDocumentoDto): Promise<Documento>;
}
