import { FornituraMateriale } from '@bresciani/db';
import { CreateFornituraMaterialeDto } from './dto/create-fornitura-materiale.dto';
import { FornitureMaterialiService } from './forniture-materiali.service';
export declare class FornitureMaterialiController {
    private readonly fornitureMaterialiService;
    constructor(fornitureMaterialiService: FornitureMaterialiService);
    list(commessaId: string): Promise<FornituraMateriale[]>;
    create(commessaId: string, payload: CreateFornituraMaterialeDto): Promise<FornituraMateriale>;
}
