import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@bresciani/db';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
