import { Commessa } from '@bresciani/db';
import { CommesseService } from './commesse.service';
import { AppaltoVoceDto } from './dto/appalto-voce.dto';
import { CreateCommessaDto } from './dto/create-commessa.dto';
export declare class CommesseController {
    private readonly commesseService;
    constructor(commesseService: CommesseService);
    getAll(): Promise<any[]>;
    getNextCode(): Promise<{
        codiceIdentificativo: string;
    }>;
    getOne(id: string): Promise<any>;
    getAppaltoVoci(id: string): Promise<any[]>;
    getDeleteInfo(id: string): Promise<{
        hasDocuments: boolean;
        hasFilesOnDisk: boolean;
    }>;
    create(payload: CreateCommessaDto): Promise<Commessa>;
    setAppaltoVoci(id: string, payload: AppaltoVoceDto[]): Promise<any[]>;
    updateDataInizioLavori(id: string, body: {
        dataInizioLavori: string | null;
    }): Promise<Commessa>;
    close(id: string): Promise<Commessa>;
    remove(id: string): Promise<void>;
    removeFromHome(id: string): Promise<void>;
}
