import { AttivitaDto } from './create-attivita.dto';
export declare class CreateCommessaDto {
    codiceIdentificativo?: string;
    tipoLavori: string;
    nomeCantiere: string;
    nomeCliente?: string;
    indirizzo?: string;
    citta?: string;
    cap?: string;
    responsabile?: string;
    budgetIniziale?: number;
    dataInizio: string;
    attivita?: AttivitaDto[];
}
