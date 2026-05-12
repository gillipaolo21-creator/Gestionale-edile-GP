import { StatoAttivita } from '@bresciani/db';
export declare class AttivitaDto {
    titolo: string;
    descrizione?: string;
    importoPrevisto: number;
    dataInizio?: string;
    dataFine?: string;
    responsabile?: string;
    stato?: StatoAttivita;
    sottocategorie?: AttivitaDto[];
}
