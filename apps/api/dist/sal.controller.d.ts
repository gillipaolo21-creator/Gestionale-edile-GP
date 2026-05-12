import { Sal } from '@bresciani/db';
import { CreateSalDto, UpdateSalDto } from './sal.dto';
import { SalService } from './sal.service';
export declare class SalController {
    private readonly salService;
    constructor(salService: SalService);
    getByCommessa(commessaId: string): Promise<Sal[]>;
    getOne(salId: string): Promise<Sal>;
    create(commessaId: string, dto: CreateSalDto): Promise<Sal>;
    update(salId: string, dto: UpdateSalDto): Promise<Sal>;
    remove(salId: string): Promise<void>;
}
