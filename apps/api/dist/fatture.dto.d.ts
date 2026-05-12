import { StatoPagamento, TipoDocumentoFiscale } from '@bresciani/db';
export declare class CreateFatturaDto {
    tipoDocumento: TipoDocumentoFiscale;
    salId?: string;
    importoImponibile: number;
    iva: number;
    dataScadenza: string;
    statoPagamento?: StatoPagamento;
}
export declare class UpdateFatturaDto {
    statoPagamento?: StatoPagamento;
    dataScadenza?: string;
    importoImponibile?: number;
    iva?: number;
}
