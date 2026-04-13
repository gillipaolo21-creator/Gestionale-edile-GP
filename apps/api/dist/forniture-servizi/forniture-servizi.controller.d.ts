import { FornituraServizio } from '@bresciani/db';
import { CreateFornituraServizioDto } from './dto/create-fornitura-servizio.dto';
import { FornitureServiziService } from './forniture-servizi.service';
export declare class FornitureServiziController {
    private readonly fornitureServiziService;
    constructor(fornitureServiziService: FornitureServiziService);
    list(commessaId: string): Promise<FornituraServizio[]>;
    create(commessaId: string, payload: CreateFornituraServizioDto): Promise<FornituraServizio>;
}
