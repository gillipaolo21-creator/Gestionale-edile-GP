import { Fattura } from '@bresciani/db';
import { CreateFatturaDto, UpdateFatturaDto } from './fatture.dto';
import { FattureService } from './fatture.service';
export declare class FattureController {
    private readonly fattureService;
    constructor(fattureService: FattureService);
    getByCommessa(commessaId: string): Promise<Fattura[]>;
    getSummary(commessaId: string): Promise<any>;
    getOne(fatturaId: string): Promise<Fattura>;
    create(commessaId: string, dto: CreateFatturaDto): Promise<Fattura>;
    update(fatturaId: string, dto: UpdateFatturaDto): Promise<Fattura>;
    remove(fatturaId: string): Promise<void>;
}
