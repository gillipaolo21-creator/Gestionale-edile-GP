"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FattureService = void 0;
const db_1 = require("@bresciani/db");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
let FattureService = class FattureService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByCommessa(commessaId) {
        return this.prisma.fattura.findMany({
            where: { commessaId },
            include: { sal: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const fattura = await this.prisma.fattura.findUnique({
            where: { id },
            include: { sal: true, commessa: { select: { codiceIdentificativo: true, nomeCantiere: true } } },
        });
        if (!fattura)
            throw new common_1.NotFoundException(`Fattura ${id} non trovata`);
        return fattura;
    }
    async create(commessaId, dto) {
        const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!commessa)
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        return this.prisma.fattura.create({
            data: {
                tipoDocumento: dto.tipoDocumento,
                commessaId,
                salId: dto.salId ?? null,
                importoImponibile: new db_1.Prisma.Decimal(dto.importoImponibile),
                iva: new db_1.Prisma.Decimal(dto.iva),
                dataScadenza: new Date(dto.dataScadenza),
                statoPagamento: dto.statoPagamento ?? db_1.StatoPagamento.DA_PAGARE,
            },
            include: { sal: true },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.fattura.update({
            where: { id },
            data: {
                ...(dto.statoPagamento && { statoPagamento: dto.statoPagamento }),
                ...(dto.dataScadenza && { dataScadenza: new Date(dto.dataScadenza) }),
                ...(dto.importoImponibile !== undefined && { importoImponibile: new db_1.Prisma.Decimal(dto.importoImponibile) }),
                ...(dto.iva !== undefined && { iva: new db_1.Prisma.Decimal(dto.iva) }),
            },
            include: { sal: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.fattura.delete({ where: { id } });
    }
    async getSummary(commessaId) {
        const fatture = await this.findByCommessa(commessaId);
        let totaleFatturato = 0;
        let totalePagato = 0;
        let totaleDaPagare = 0;
        const countPerStato = {
            DA_PAGARE: 0,
            PARZIALE: 0,
            PAGATO: 0,
        };
        for (const f of fatture) {
            const totale = Number(f.importoImponibile) + Number(f.iva);
            totaleFatturato += totale;
            countPerStato[f.statoPagamento]++;
            if (f.statoPagamento === db_1.StatoPagamento.PAGATO)
                totalePagato += totale;
            else
                totaleDaPagare += totale;
        }
        return { totaleFatturato, totalePagato, totaleDaPagare, countPerStato };
    }
};
exports.FattureService = FattureService;
exports.FattureService = FattureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FattureService);
//# sourceMappingURL=fatture.service.js.map