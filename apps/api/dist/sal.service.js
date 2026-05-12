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
exports.SalService = void 0;
const db_1 = require("@bresciani/db");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
let SalService = class SalService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByCommessa(commessaId) {
        return this.prisma.sal.findMany({
            where: { commessaId },
            include: { fatture: true },
            orderBy: { progressivo: 'desc' },
        });
    }
    async findOne(id) {
        const sal = await this.prisma.sal.findUnique({
            where: { id },
            include: { fatture: true, commessa: { select: { codiceIdentificativo: true, nomeCantiere: true } } },
        });
        if (!sal)
            throw new common_1.NotFoundException(`SAL ${id} non trovato`);
        return sal;
    }
    async create(commessaId, dto) {
        const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!commessa)
            throw new common_1.NotFoundException(`Commessa ${commessaId} non trovata`);
        const ultimo = await this.prisma.sal.findFirst({
            where: { commessaId },
            orderBy: { progressivo: 'desc' },
            select: { progressivo: true },
        });
        const progressivo = (ultimo?.progressivo ?? 0) + 1;
        return this.prisma.sal.create({
            data: {
                commessaId,
                progressivo,
                dataCertificazione: new Date(dto.dataCertificazione),
                percentualeCompletamento: new db_1.Prisma.Decimal(dto.percentualeCompletamento),
                importoMaturato: new db_1.Prisma.Decimal(dto.importoMaturato),
                statoApprovazione: dto.statoApprovazione ?? db_1.StatoSAL.BOZZA,
            },
            include: { fatture: true },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.sal.update({
            where: { id },
            data: {
                ...(dto.statoApprovazione && { statoApprovazione: dto.statoApprovazione }),
                ...(dto.dataCertificazione && { dataCertificazione: new Date(dto.dataCertificazione) }),
                ...(dto.percentualeCompletamento !== undefined && {
                    percentualeCompletamento: new db_1.Prisma.Decimal(dto.percentualeCompletamento),
                }),
                ...(dto.importoMaturato !== undefined && {
                    importoMaturato: new db_1.Prisma.Decimal(dto.importoMaturato),
                }),
            },
            include: { fatture: true },
        });
    }
    async remove(id) {
        const sal = await this.findOne(id);
        const salWithFatture = sal;
        if (salWithFatture.fatture?.length > 0) {
            await this.prisma.fattura.deleteMany({ where: { salId: id } });
        }
        await this.prisma.sal.delete({ where: { id } });
    }
};
exports.SalService = SalService;
exports.SalService = SalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalService);
//# sourceMappingURL=sal.service.js.map