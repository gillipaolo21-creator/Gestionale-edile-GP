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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommesseController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const commesse_service_1 = require("./commesse.service");
const create_commessa_dto_1 = require("./dto/create-commessa.dto");
let CommesseController = class CommesseController {
    constructor(commesseService) {
        this.commesseService = commesseService;
    }
    async getAll(page, limit, stato, responsabile, anno, citta, search) {
        const pageNum = page ? Math.max(1, parseInt(page, 10)) : undefined;
        const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit, 10))) : undefined;
        const filters = { stato, responsabile, anno, citta, search };
        return this.commesseService.findAll(pageNum, limitNum, filters);
    }
    async getNextCode() {
        const codiceIdentificativo = await this.commesseService.getNextCode();
        return { codiceIdentificativo };
    }
    async getStats() {
        return this.commesseService.getStats();
    }
    async getAppaltoVoci(id) {
        return this.commesseService.getAppaltoVoci(id);
    }
    async getDeleteInfo(id) {
        return this.commesseService.getDeleteInfo(id);
    }
    async getOne(id) {
        return this.commesseService.findOne(id);
    }
    async create(payload, req) {
        if (!payload.responsabile) {
            payload.responsabile = req.user.email;
        }
        return this.commesseService.create(payload);
    }
    async setAppaltoVoci(id, payload) {
        return this.commesseService.setAppaltoVoci(id, payload);
    }
    async exportAppaltoVoci(id) {
        return this.commesseService.exportAppaltoVociExcel(id);
    }
    async updateDataInizioLavori(id, body) {
        return this.commesseService.updateDataInizioLavori(id, body.dataInizioLavori);
    }
    async close(id) {
        return this.commesseService.close(id);
    }
    async remove(id) {
        await this.commesseService.remove(id);
    }
    async removeFromHome(id) {
        await this.commesseService.removeFromHome(id);
    }
};
exports.CommesseController = CommesseController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('stato')),
    __param(3, (0, common_1.Query)('responsabile')),
    __param(4, (0, common_1.Query)('anno')),
    __param(5, (0, common_1.Query)('citta')),
    __param(6, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('next-code'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "getNextCode", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id/appalto-voci'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "getAppaltoVoci", null);
__decorate([
    (0, common_1.Get)(':id/delete-info'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "getDeleteInfo", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_commessa_dto_1.CreateCommessaDto, Object]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/appalto-voci'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "setAppaltoVoci", null);
__decorate([
    (0, common_1.Get)(':id/export/appalto-voci'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "exportAppaltoVoci", null);
__decorate([
    (0, common_1.Patch)(':id/data-inizio-lavori'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "updateDataInizioLavori", null);
__decorate([
    (0, common_1.Patch)(':id/chiudi'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "close", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(':id/home'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "removeFromHome", null);
exports.CommesseController = CommesseController = __decorate([
    (0, swagger_1.ApiTags)('commesse'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('commesse'),
    __metadata("design:paramtypes", [commesse_service_1.CommesseService])
], CommesseController);
//# sourceMappingURL=commesse.controller.js.map