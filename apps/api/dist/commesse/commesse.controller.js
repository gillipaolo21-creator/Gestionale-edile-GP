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
const common_1 = require("@nestjs/common");
const commesse_service_1 = require("./commesse.service");
const create_commessa_dto_1 = require("./dto/create-commessa.dto");
let CommesseController = class CommesseController {
    constructor(commesseService) {
        this.commesseService = commesseService;
    }
    async getAll() {
        return this.commesseService.findAll();
    }
    async getNextCode() {
        const codiceIdentificativo = await this.commesseService.getNextCode();
        return { codiceIdentificativo };
    }
    async getOne(id) {
        return this.commesseService.findOne(id);
    }
    async getAppaltoVoci(id) {
        return this.commesseService.getAppaltoVoci(id);
    }
    async getDeleteInfo(id) {
        return this.commesseService.getDeleteInfo(id);
    }
    async create(payload) {
        return this.commesseService.create(payload);
    }
    async setAppaltoVoci(id, payload) {
        return this.commesseService.setAppaltoVoci(id, payload);
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('next-code'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "getNextCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommesseController.prototype, "getOne", null);
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
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_commessa_dto_1.CreateCommessaDto]),
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
    (0, common_1.Controller)('commesse'),
    __metadata("design:paramtypes", [commesse_service_1.CommesseService])
], CommesseController);
//# sourceMappingURL=commesse.controller.js.map