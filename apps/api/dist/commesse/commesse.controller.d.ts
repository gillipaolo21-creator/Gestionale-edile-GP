import { Commessa } from '@bresciani/db';
import { StreamableFile } from '@nestjs/common';
import { JwtPayload } from '../auth/jwt.strategy';
import { CommesseService } from './commesse.service';
import { AppaltoVoceDto } from './dto/appalto-voce.dto';
import { CreateCommessaDto } from './dto/create-commessa.dto';
export declare class CommesseController {
    private readonly commesseService;
    constructor(commesseService: CommesseService);
    getAll(page?: string, limit?: string, stato?: string, responsabile?: string, anno?: string, citta?: string, search?: string): Promise<any>;
    getNextCode(): Promise<{
        codiceIdentificativo: string;
    }>;
    getStats(): Promise<any>;
    getAppaltoVoci(id: string): Promise<any[]>;
    getDeleteInfo(id: string): Promise<{
        hasDocuments: boolean;
        hasFilesOnDisk: boolean;
    }>;
    getOne(id: string): Promise<any>;
    create(payload: CreateCommessaDto, req: {
        user: JwtPayload;
    }): Promise<Commessa>;
    setAppaltoVoci(id: string, payload: AppaltoVoceDto[]): Promise<any[]>;
    exportAppaltoVoci(id: string): Promise<StreamableFile>;
    updateDataInizioLavori(id: string, body: {
        dataInizioLavori: string | null;
    }): Promise<Commessa>;
    close(id: string): Promise<Commessa>;
    remove(id: string): Promise<void>;
    removeFromHome(id: string): Promise<void>;
}
