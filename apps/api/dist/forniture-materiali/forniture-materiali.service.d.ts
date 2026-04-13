import { FornituraMateriale } from '@bresciani/db';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFornituraMaterialeDto } from './dto/create-fornitura-materiale.dto';
export declare class FornitureMaterialiService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCommessa(commessaId: string): Promise<FornituraMateriale[]>;
    create(commessaId: string, dto: CreateFornituraMaterialeDto): Promise<FornituraMateriale>;
}
