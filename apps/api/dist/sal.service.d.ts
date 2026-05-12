import { Sal } from '@bresciani/db';
import { PrismaService } from './prisma/prisma.service';
import { CreateSalDto, UpdateSalDto } from './sal.dto';
export declare class SalService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByCommessa(commessaId: string): Promise<Sal[]>;
    findOne(id: string): Promise<Sal>;
    create(commessaId: string, dto: CreateSalDto): Promise<Sal>;
    update(id: string, dto: UpdateSalDto): Promise<Sal>;
    remove(id: string): Promise<void>;
}
