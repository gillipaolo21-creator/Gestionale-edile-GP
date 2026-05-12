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
exports.FattureController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const fatture_dto_1 = require("./fatture.dto");
const fatture_service_1 = require("./fatture.service");
let FattureController = class FattureController {
    constructor(fattureService) {
        this.fattureService = fattureService;
    }
    async getByCommessa(commessaId) {
        return this.fattureService.findByCommessa(commessaId);
    }
    async getSummary(commessaId) {
        return this.fattureService.getSummary(commessaId);
    }
    async getOne(fatturaId) {
        return this.fattureService.findOne(fatturaId);
    }
    async create(commessaId, dto) {
        return this.fattureService.create(commessaId, dto);
    }
    async update(fatturaId, dto) {
        return this.fattureService.update(fatturaId, dto);
    }
    async remove(fatturaId) {
        return this.fattureService.remove(fatturaId);
    }
};
exports.FattureController = FattureController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('commessaId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FattureController.prototype, "getByCommessa", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Param)('commessaId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FattureController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':fatturaId'),
    __param(0, (0, common_1.Param)('fatturaId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FattureController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('commessaId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fatture_dto_1.CreateFatturaDto]),
    __metadata("design:returntype", Promise)
], FattureController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':fatturaId'),
    __param(0, (0, common_1.Param)('fatturaId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fatture_dto_1.UpdateFatturaDto]),
    __metadata("design:returntype", Promise)
], FattureController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':fatturaId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('fatturaId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FattureController.prototype, "remove", null);
exports.FattureController = FattureController = __decorate([
    (0, swagger_1.ApiTags)('fatture'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('commesse/:commessaId/fatture'),
    __metadata("design:paramtypes", [fatture_service_1.FattureService])
], FattureController);
//# sourceMappingURL=fatture.controller.js.map