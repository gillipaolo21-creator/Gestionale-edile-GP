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
exports.FornitureMaterialiService = void 0;
const db_1 = require("@bresciani/db");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FornitureMaterialiService = class FornitureMaterialiService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listByCommessa(commessaId) {
        return this.prisma.fornituraMateriale.findMany({
            where: { commessaId },
            orderBy: { dataPreventivo: 'desc' },
        });
    }
    async create(commessaId, dto) {
        const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!commessa) {
            throw new common_1.NotFoundException('Commessa non trovata per la fornitura materiale.');
        }
        return this.prisma.fornituraMateriale.create({
            data: {
                commessaId,
                fornitoreNome: dto.fornitoreNome,
                importoFornitura: new db_1.Prisma.Decimal(dto.importoFornitura),
                descrizione: dto.descrizione,
                preventivoRiferimento: dto.preventivoRiferimento,
                dataPreventivo: new Date(dto.dataPreventivo),
            },
        });
    }
};
exports.FornitureMaterialiService = FornitureMaterialiService;
exports.FornitureMaterialiService = FornitureMaterialiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FornitureMaterialiService);
//# sourceMappingURL=forniture-materiali.service.js.map