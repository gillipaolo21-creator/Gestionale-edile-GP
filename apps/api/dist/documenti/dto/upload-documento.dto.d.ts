import { TipoEntitaDocumento } from '@bresciani/db';
export declare class UploadDocumentoDto {
    entitaTipo: TipoEntitaDocumento;
    entitaId: string;
    categoria?: string;
    sottocategoria?: string;
    datiEstrattiJson?: string;
}
