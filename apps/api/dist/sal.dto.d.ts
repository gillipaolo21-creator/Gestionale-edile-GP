import { StatoSAL } from '@bresciani/db';
export declare class CreateSalDto {
    dataCertificazione: string;
    percentualeCompletamento: number;
    importoMaturato: number;
    statoApprovazione?: StatoSAL;
}
export declare class UpdateSalDto {
    statoApprovazione?: StatoSAL;
    percentualeCompletamento?: number;
    importoMaturato?: number;
    dataCertificazione?: string;
}
