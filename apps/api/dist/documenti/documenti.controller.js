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
exports.DocumentiController = void 0;
const db_1 = require("@bresciani/db");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const documenti_service_1 = require("./documenti.service");
const upload_documento_dto_1 = require("./dto/upload-documento.dto");
const ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream',
]);
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
let DocumentiController = class DocumentiController {
    constructor(documentiService) {
        this.documentiService = documentiService;
    }
    async preview(documentoId, res) {
        try {
            const html = await this.documentiService.getPreviewHtml(documentoId);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(html);
        }
        catch {
            res.status(415).send('<p style="font-family:sans-serif;padding:24px;color:#666">Anteprima non disponibile per questo formato.</p>');
        }
    }
    async download(documentoId) {
        const { stream, filename, mimeType } = await this.documentiService.getFileStream(documentoId);
        return new common_1.StreamableFile(stream, {
            type: mimeType,
            disposition: `inline; filename="${encodeURIComponent(filename)}"`,
        });
    }
    async exportZip(commessaId, res) {
        const { stream, filename } = await this.documentiService.exportCommessaZip(commessaId);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
        stream.pipe(res);
    }
    async listPmFolders() {
        return this.documentiService.listPmFolders();
    }
    async getPending() {
        return this.documentiService.findPending();
    }
    async getByEntity(entitaTipo, entitaId) {
        return this.documentiService.findByEntita(entitaTipo, entitaId);
    }
    async updateStato(documentoId, stato) {
        return this.documentiService.updateStato(documentoId, stato);
    }
    async patchMetadata(documentoId, datiEstrattiJson) {
        return this.documentiService.patchMetadata(documentoId, datiEstrattiJson);
    }
    async delete(documentoId) {
        return this.documentiService.deleteDocumento(documentoId);
    }
    async uploadFile(file, payload) {
        if (!file) {
            throw new common_1.BadRequestException('Nessun file fornito nella richiesta');
        }
        const safeSottocategoria = payload.sottocategoria
            ? payload.sottocategoria.replace(/[/\\..]/g, '_')
            : undefined;
        return this.documentiService.uploadAndSave(file, payload.entitaTipo, payload.entitaId, payload.categoria, safeSottocategoria, payload.datiEstrattiJson);
    }
};
exports.DocumentiController = DocumentiController;
__decorate([
    (0, common_1.Get)(':documentoId/preview'),
    __param(0, (0, common_1.Param)('documentoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "preview", null);
__decorate([
    (0, common_1.Get)(':documentoId/download'),
    __param(0, (0, common_1.Param)('documentoId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "download", null);
__decorate([
    (0, common_1.Get)('commessa/:commessaId/export-zip'),
    __param(0, (0, common_1.Param)('commessaId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "exportZip", null);
__decorate([
    (0, common_1.Get)('pm-folders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "listPmFolders", null);
__decorate([
    (0, common_1.Get)('pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)(':entitaTipo/:entitaId'),
    __param(0, (0, common_1.Param)('entitaTipo', new common_1.ParseEnumPipe(db_1.TipoEntitaDocumento))),
    __param(1, (0, common_1.Param)('entitaId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "getByEntity", null);
__decorate([
    (0, common_1.Patch)(':documentoId/stato'),
    __param(0, (0, common_1.Param)('documentoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)('stato')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "updateStato", null);
__decorate([
    (0, common_1.Patch)(':documentoId/metadata'),
    __param(0, (0, common_1.Param)('documentoId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)('datiEstrattiJson')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "patchMetadata", null);
__decorate([
    (0, common_1.Delete)(':documentoId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('documentoId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: MAX_FILE_SIZE_BYTES },
        fileFilter: (_req, file, cb) => {
            if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException(`Tipo file non consentito: ${file.mimetype}`), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_documento_dto_1.UploadDocumentoDto]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "uploadFile", null);
exports.DocumentiController = DocumentiController = __decorate([
    (0, swagger_1.ApiTags)('documenti'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('documenti'),
    __metadata("design:paramtypes", [documenti_service_1.DocumentiService])
], DocumentiController);
//# sourceMappingURL=documenti.controller.js.map