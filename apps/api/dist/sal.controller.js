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
exports.SalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const sal_dto_1 = require("./sal.dto");
const sal_service_1 = require("./sal.service");
let SalController = class SalController {
    constructor(salService) {
        this.salService = salService;
    }
    async getByCommessa(commessaId) {
        return this.salService.findByCommessa(commessaId);
    }
    async getOne(salId) {
        return this.salService.findOne(salId);
    }
    async create(commessaId, dto) {
        return this.salService.create(commessaId, dto);
    }
    async update(salId, dto) {
        return this.salService.update(salId, dto);
    }
    async remove(salId) {
        return this.salService.remove(salId);
    }
};
exports.SalController = SalController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('commessaId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalController.prototype, "getByCommessa", null);
__decorate([
    (0, common_1.Get)(':salId'),
    __param(0, (0, common_1.Param)('salId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('commessaId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sal_dto_1.CreateSalDto]),
    __metadata("design:returntype", Promise)
], SalController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':salId'),
    __param(0, (0, common_1.Param)('salId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sal_dto_1.UpdateSalDto]),
    __metadata("design:returntype", Promise)
], SalController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':salId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('salId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalController.prototype, "remove", null);
exports.SalController = SalController = __decorate([
    (0, swagger_1.ApiTags)('sal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('commesse/:commessaId/sal'),
    __metadata("design:paramtypes", [sal_service_1.SalService])
], SalController);
//# sourceMappingURL=sal.controller.js.map