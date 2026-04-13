import { FornituraServizio } from '@bresciani/db';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFornituraServizioDto } from './dto/create-fornitura-servizio.dto';
export declare class FornitureServiziService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listByCommessa(commessaId: string): Promise<FornituraServizio[]>;
    create(commessaId: string, dto: CreateFornituraServizioDto): Promise<FornituraServizio>;
}
