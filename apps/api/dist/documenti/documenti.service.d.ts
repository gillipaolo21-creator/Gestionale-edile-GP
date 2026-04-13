import { Documento, TipoEntitaDocumento } from '@bresciani/db';
import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class DocumentiService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    private get storageBasePath();
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private sanitizeFilename;
    private formatPmFolder;
    private static readonly CATEGORIA_FOLDER_MAP;
    private normalizeCategoriaFolderName;
    private normalizeSottocategoriaFolderName;
    private resolveCommessaFolderName;
    private resolveCommessaFolderPath;
    private hasAnyFileRecursive;
    hasCommessaFiles(commessa: {
        responsabile?: string | null;
        codiceIdentificativo?: string | null;
        indirizzo?: string | null;
        nomeCliente?: string | null;
    }): Promise<boolean>;
    listPmFolders(): Promise<string[]>;
    createCommessaFolder(responsabile: string, commessa: {
        codiceIdentificativo?: string | null;
        indirizzo?: string | null;
        nomeCliente?: string | null;
    }): Promise<string>;
    uploadAndSave(file: Express.Multer.File, entitaTipo: TipoEntitaDocumento, entitaId: string, categoria?: string, sottocategoria?: string, datiEstrattiJsonRaw?: string): Promise<Documento>;
    patchMetadata(documentoId: string, datiEstrattiJsonRaw: string): Promise<Documento>;
    deleteDocumento(documentoId: string): Promise<void>;
    findByEntita(entitaTipo: TipoEntitaDocumento, entitaId: string): Promise<Documento[]>;
    findPending(): Promise<(Documento & {
        commessa?: {
            id: string;
            codiceIdentificativo: string;
            nomeCliente: string | null;
        };
    })[]>;
    getFileStream(documentoId: string): Promise<{
        stream: import("fs").ReadStream;
        filename: string;
        mimeType: string;
    }>;
    getPreviewHtml(documentoId: string): Promise<string>;
}
