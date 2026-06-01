import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_SOCIETA = [
  { codice: 'STRADESERVIZI', nome: 'Strade e Servizi' },
  { codice: 'BUILDTECH', nome: 'BuildTech' },
  { codice: 'LG', nome: 'LG' },
];

@Injectable()
export class SocietaService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    for (const societa of DEFAULT_SOCIETA) {
      await this.prisma.societa.upsert({
        where: { codice: societa.codice },
        update: { nome: societa.nome, attiva: true },
        create: { ...societa },
      });
    }
  }

  async findAll() {
    return this.prisma.societa.findMany({
      orderBy: { nome: 'asc' },
    });
  }
}
