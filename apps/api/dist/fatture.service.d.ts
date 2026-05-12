import { Fattura, StatoPagamento } from '@bresciani/db';
import { CreateFatturaDto, UpdateFatturaDto } from './fatture.dto';
import { PrismaService } from './prisma/prisma.service';
export declare class FattureService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByCommessa(commessaId: string): Promise<Fattura[]>;
    findOne(id: string): Promise<Fattura>;
    create(commessaId: string, dto: CreateFatturaDto): Promise<Fattura>;
    update(id: string, dto: UpdateFatturaDto): Promise<Fattura>;
    remove(id: string): Promise<void>;
    getSummary(commessaId: string): Promise<{
        totaleFatturato: number;
        totalePagato: number;
        totaleDaPagare: number;
        countPerStato: Record<StatoPagamento, number>;
    }>;
}
