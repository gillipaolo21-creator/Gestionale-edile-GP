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
var DocumentiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentiService = void 0;
const db_1 = require("@bresciani/db");
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const fs_1 = require("fs");
const fs = require("fs/promises");
const path = require("path");
const prisma_service_1 = require("../prisma/prisma.service");
let DocumentiService = DocumentiService_1 = class DocumentiService {
    get storageBasePath() {
        let envPath = process.env.STORAGE_BASE_PATH || 'C:\\Users\\Utente\\bresciani.group\\01.Operativo - Documenti\\Commesse';
        envPath = envPath.replace(/^["']|["']$/g, '');
        return path.normalize(envPath);
    }
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(DocumentiService_1.name);
    }
    async onModuleInit() {
        try {
            await fs.mkdir(this.storageBasePath, { recursive: true });
            this.logger.log(`[STORAGE I/O VERIFICATO] Radice operativa agganciata: ${this.storageBasePath}`);
        }
        catch (error) {
            this.logger.error(`[CRITICO] Impossibile accedere o creare la radice: ${this.storageBasePath}. Verifica permessi.`, error);
        }
    }
    sanitizeFilename(name) {
        return name.replace(/[/\\?%*:|"<>]/g, '-').trim();
    }
    formatPmFolder(responsabile) {
        if (!responsabile)
            return 'PM_NON_ASSEGNATO';
        return this.sanitizeFilename(responsabile).toUpperCase();
    }
    normalizeCategoriaFolderName(categoria) {
        if (!categoria)
            return null;
        const normalized = categoria.trim();
        if (!normalized)
            return null;
        const mapped = DocumentiService_1.CATEGORIA_FOLDER_MAP[normalized];
        if (mapped)
            return mapped;
        return this.sanitizeFilename(normalized);
    }
    normalizeSottocategoriaFolderName(sottocategoria) {
        if (!sottocategoria)
            return null;
        const normalized = sottocategoria.trim();
        if (!normalized)
            return null;
        return this.sanitizeFilename(normalized);
    }
    resolveCommessaFolderName(commessa) {
        const codice = (commessa.codiceIdentificativo || 'N_D').trim() || 'N_D';
        const indirizzo = (commessa.indirizzo || 'N_D').trim() || 'N_D';
        const cliente = (commessa.nomeCliente || 'N_D').trim() || 'N_D';
        return `${codice}_${indirizzo}_${cliente}`;
    }
    resolveCommessaFolderPath(commessa) {
        const pmFolder = this.formatPmFolder(commessa.responsabile);
        const commessaFolder = this.sanitizeFilename(this.resolveCommessaFolderName(commessa));
        return path.join(this.storageBasePath, pmFolder, commessaFolder);
    }
    async hasAnyFileRecursive(folderPath) {
        const entries = await fs.readdir(folderPath, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isFile())
                return true;
            if (entry.isDirectory()) {
                const nestedPath = path.join(folderPath, entry.name);
                if (await this.hasAnyFileRecursive(nestedPath))
                    return true;
            }
        }
        return false;
    }
    async hasCommessaFiles(commessa) {
        const basePath = this.resolveCommessaFolderPath(commessa);
        try {
            await fs.stat(basePath);
        }
        catch {
            return false;
        }
        try {
            return await this.hasAnyFileRecursive(basePath);
        }
        catch (error) {
            this.logger.warn(`[I/O WARNING] Verifica file commessa fallita: ${basePath}`, error);
            return false;
        }
    }
    async listPmFolders() {
        try {
            const entries = await fs.readdir(this.storageBasePath, { withFileTypes: true });
            return entries
                .filter(e => e.isDirectory())
                .map(e => e.name)
                .sort();
        }
        catch {
            return [];
        }
    }
    async createCommessaFolder(responsabile, commessa) {
        try {
            const pmFolder = this.formatPmFolder(responsabile);
            const folderName = this.resolveCommessaFolderName(commessa);
            const commessaFolder = this.sanitizeFilename(folderName);
            const fullPath = path.join(this.storageBasePath, pmFolder, commessaFolder);
            await fs.mkdir(fullPath, { recursive: true });
            const sottocartelle = [
                '01_Contratto Cliente',
                '02_Contratti Fornitori',
                '03_Documentazione progettuale',
                '04_Preventivi Fornitori',
                '05_Preventivi Bresciani',
            ];
            await Promise.all(sottocartelle.map(sub => fs.mkdir(path.join(fullPath, sub), { recursive: true })));
            await Promise.all([
                fs.mkdir(path.join(fullPath, '04_Preventivi Fornitori', '01_Forniture di materiale'), { recursive: true }),
                fs.mkdir(path.join(fullPath, '04_Preventivi Fornitori', '02_Subappalti'), { recursive: true }),
            ]);
            this.logger.log(`[DIRECTORY CREATA] ${fullPath} (con ${sottocartelle.length} sottocartelle)`);
            return fullPath;
        }
        catch (error) {
            this.logger.error(`[ERRORE I/O] Fallita creazione cartella commessa in: ${this.storageBasePath}`, error);
            throw new common_1.InternalServerErrorException('Errore sistema I/O. File locked da Windows?');
        }
    }
    async uploadAndSave(file, entitaTipo, entitaId, categoria, sottocategoria, datiEstrattiJsonRaw) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('File non valido o corrotto.');
        }
        let targetPath = this.storageBasePath;
        if (entitaTipo === 'COMMESSA') {
            const commessa = await this.prisma.commessa.findUnique({ where: { id: entitaId } });
            if (!commessa) {
                throw new common_1.NotFoundException('Commessa non trovata per il caricamento documentale.');
            }
            const categoriaFolder = this.normalizeCategoriaFolderName(categoria);
            if (!categoriaFolder) {
                throw new common_1.BadRequestException('Categoria obbligatoria per i documenti di commessa.');
            }
            const requiresSupplierFolder = categoria === 'Offerte forniture di materiali'
                || categoria === 'Offerte forniture di servizi';
            const sottocategoriaFolder = this.normalizeSottocategoriaFolderName(sottocategoria);
            if (requiresSupplierFolder && !sottocategoriaFolder) {
                throw new common_1.BadRequestException('Nome fornitore obbligatorio per le offerte materiali o servizi.');
            }
            const commessaFolderPath = this.resolveCommessaFolderPath(commessa);
            const isDocumentoOperativoFornitore = categoria === 'Documenti Fornitore Materiali' ||
                categoria === 'Documenti Fornitore Servizi';
            if (isDocumentoOperativoFornitore) {
                if (!sottocategoriaFolder) {
                    throw new common_1.BadRequestException('Ragione sociale fornitore obbligatoria per i documenti operativi.');
                }
                const tipoSub = categoria === 'Documenti Fornitore Materiali'
                    ? '01_Forniture di materiale'
                    : '02_Subappalti';
                targetPath = path.join(commessaFolderPath, '04_Preventivi Fornitori', tipoSub, sottocategoriaFolder);
            }
            else if (categoria === 'Contratti Cliente' && sottocategoria?.trim() === 'Variante') {
                const contrattoDir = path.join(commessaFolderPath, categoriaFolder);
                await fs.mkdir(contrattoDir, { recursive: true });
                let nextNum = 1;
                try {
                    const entries = await fs.readdir(contrattoDir, { withFileTypes: true });
                    const varianteFolders = entries.filter(e => e.isDirectory() && /^Variante\d{2}_/.test(e.name));
                    nextNum = varianteFolders.length + 1;
                }
                catch { }
                const now = new Date();
                const dd = String(now.getDate()).padStart(2, '0');
                const mm = String(now.getMonth() + 1).padStart(2, '0');
                const yyyy = now.getFullYear();
                const varianteFolder = `Variante${String(nextNum).padStart(2, '0')}_${dd}-${mm}-${yyyy}`;
                targetPath = path.join(contrattoDir, varianteFolder);
            }
            else {
                targetPath = path.join(commessaFolderPath, categoriaFolder, ...(sottocategoriaFolder ? [sottocategoriaFolder] : []));
            }
            await fs.mkdir(targetPath, { recursive: true });
            if (categoria === 'Contratti Fornitori' && sottocategoriaFolder) {
                const prevMateriali = path.join(commessaFolderPath, '04_Preventivi Fornitori', '01_Forniture di materiale', sottocategoriaFolder);
                const prevSubappalti = path.join(commessaFolderPath, '04_Preventivi Fornitori', '02_Subappalti', sottocategoriaFolder);
                try {
                    await Promise.all([
                        fs.mkdir(prevMateriali, { recursive: true }),
                        fs.mkdir(prevSubappalti, { recursive: true }),
                    ]);
                    this.logger.log(`[DIRECTORY FORNITORE PREVENTIVI CREATA] ${prevMateriali}, ${prevSubappalti}`);
                }
                catch (fsErr) {
                    this.logger.warn(`[I/O NON BLOCCANTE] Cartelle preventivi fornitore non create`, fsErr);
                }
            }
        }
        const hashSum = crypto.createHash('sha256');
        hashSum.update(file.buffer);
        const hashFile = hashSum.digest('hex');
        const fileName = `${Date.now()}-${this.sanitizeFilename(file.originalname)}`;
        const filePath = path.join(targetPath, fileName);
        try {
            await fs.writeFile(filePath, file.buffer);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Impossibile salvare il file fisicamente sul server.');
        }
        const storageUrl = `file://${filePath.replace(/\\/g, '/')}`;
        let datiEstrattiJson = db_1.Prisma.JsonNull;
        if (datiEstrattiJsonRaw) {
            try {
                datiEstrattiJson = JSON.parse(datiEstrattiJsonRaw);
            }
            catch {
            }
        }
        return this.prisma.documento.create({
            data: {
                entitaTipo,
                entitaId,
                nomeFile: file.originalname,
                storageUrl,
                hashFile,
                categoria: entitaTipo === 'COMMESSA' ? categoria : null,
                sottocategoria: entitaTipo === 'COMMESSA' ? sottocategoria : null,
                datiEstrattiJson,
            },
        });
    }
    async updateStato(documentoId, stato) {
        const doc = await this.prisma.documento.findUnique({ where: { id: documentoId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento non trovato.');
        const currentJson = doc.datiEstrattiJson ?? {};
        return this.prisma.documento.update({
            where: { id: documentoId },
            data: { datiEstrattiJson: { ...currentJson, stato } },
        });
    }
    async exportCommessaZip(commessaId) {
        const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!commessa)
            throw new common_1.NotFoundException('Commessa non trovata.');
        const docs = await this.prisma.documento.findMany({
            where: { entitaTipo: db_1.TipoEntitaDocumento.COMMESSA, entitaId: commessaId },
        });
        const JSZip = require('jszip');
        const zip = new JSZip();
        for (const doc of docs) {
            const filePath = doc.storageUrl.replace('file://', '');
            try {
                const content = await fs.readFile(filePath);
                zip.file(doc.nomeFile, content);
            }
            catch {
                this.logger.warn(`[ZIP EXPORT] File non trovato su disco: ${filePath}`);
            }
        }
        const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
        const { Readable } = await Promise.resolve().then(() => require('stream'));
        const stream = Readable.from(buffer);
        return {
            stream,
            filename: `archivio-${commessa.codiceIdentificativo}.zip`,
        };
    }
    async patchMetadata(documentoId, datiEstrattiJsonRaw) {
        const doc = await this.prisma.documento.findUnique({ where: { id: documentoId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento non trovato.');
        const datiEstrattiJson = JSON.parse(datiEstrattiJsonRaw);
        return this.prisma.documento.update({
            where: { id: documentoId },
            data: { datiEstrattiJson },
        });
    }
    async deleteDocumento(documentoId) {
        const doc = await this.prisma.documento.findUnique({ where: { id: documentoId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento non trovato.');
        await this.prisma.documento.delete({ where: { id: documentoId } });
    }
    async findByEntita(entitaTipo, entitaId) {
        return this.prisma.documento.findMany({
            where: { entitaTipo, entitaId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findPending() {
        const STATI_FINALI = ['Approvato', 'Approvata', 'Pagata', 'Pagato'];
        const docs = await this.prisma.documento.findMany({
            where: {
                datiEstrattiJson: { not: db_1.Prisma.DbNull },
                entitaTipo: 'COMMESSA',
            },
            orderBy: { createdAt: 'desc' },
        });
        const pending = docs.filter(d => {
            const json = d.datiEstrattiJson;
            if (!json || !json.stato)
                return false;
            const stato = String(json.stato);
            return stato.length > 0 && !STATI_FINALI.includes(stato);
        });
        const commessaIds = [...new Set(pending.map(d => d.entitaId))];
        const commesse = commessaIds.length > 0
            ? await this.prisma.commessa.findMany({
                where: { id: { in: commessaIds } },
                select: { id: true, codiceIdentificativo: true, nomeCliente: true },
            })
            : [];
        const commessaMap = new Map(commesse.map(c => [c.id, c]));
        return pending.map(d => ({
            ...d,
            commessa: commessaMap.get(d.entitaId) ?? undefined,
        }));
    }
    async getFileStream(documentoId) {
        const doc = await this.prisma.documento.findUnique({ where: { id: documentoId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento non trovato a sistema.');
        const filePath = doc.storageUrl.replace('file://', '');
        try {
            await fs.stat(filePath);
        }
        catch {
            throw new common_1.NotFoundException('Il file fisico non esiste più sul server Windows.');
        }
        const stream = (0, fs_1.createReadStream)(filePath);
        const ext = path.extname(doc.nomeFile).toLowerCase();
        const mimeMap = {
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.bmp': 'image/bmp',
            '.svg': 'image/svg+xml',
            '.txt': 'text/plain',
            '.csv': 'text/csv',
            '.html': 'text/html',
            '.xml': 'text/xml',
            '.json': 'application/json',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.mp3': 'audio/mpeg',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };
        const mimeType = mimeMap[ext] ?? 'application/octet-stream';
        return { stream, filename: doc.nomeFile, mimeType };
    }
    async getPreviewHtml(documentoId) {
        const doc = await this.prisma.documento.findUnique({ where: { id: documentoId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento non trovato');
        const filePath = doc.storageUrl.replace('file://', '');
        const ext = path.extname(doc.nomeFile).toLowerCase();
        const baseStyle = `
      <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 24px 32px; color: #1a1a1a; line-height: 1.7; font-size: 14px; background: #fff; }
        h1,h2,h3,h4,h5,h6 { color: #003A7D; margin-top: 1.4em; }
        p { margin: 0.6em 0; }
        table { border-collapse: collapse; width: 100%; font-size: 12px; margin: 12px 0; }
        td, th { border: 1px solid #e2e8f0; padding: 5px 10px; text-align: left; }
        th { background: #f1f5f9; font-weight: 700; color: #003A7D; }
        tr:nth-child(even) td { background: #f9fafb; }
        img { max-width: 100%; }
        .sheet-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #0054B4; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; padding: 4px 10px; margin: 24px 0 8px; display: inline-block; }
        hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
      </style>`;
        if (ext === '.docx' || ext === '.doc') {
            const mammoth = require('mammoth');
            const result = await mammoth.convertToHtml({ path: filePath });
            return `<!DOCTYPE html><html><head><meta charset="utf-8">${baseStyle}</head><body>${result.value}</body></html>`;
        }
        if (ext === '.xlsx' || ext === '.xls') {
            const XLSX = require('xlsx');
            const workbook = XLSX.readFile(filePath);
            const sheets = workbook.SheetNames.map(name => {
                const sheet = workbook.Sheets[name];
                const html = XLSX.utils.sheet_to_html(sheet, { id: `sheet-${name}` });
                return `<div class="sheet-title">${name}</div>${html}`;
            }).join('<hr>');
            return `<!DOCTYPE html><html><head><meta charset="utf-8">${baseStyle}</head><body>${sheets}</body></html>`;
        }
        if (ext === '.txt') {
            const text = await fs.readFile(filePath, 'utf-8');
            const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<!DOCTYPE html><html><head><meta charset="utf-8">${baseStyle}</head><body><pre style="white-space:pre-wrap;word-break:break-word">${escaped}</pre></body></html>`;
        }
        const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
        if (imageExts.includes(ext)) {
            const imgBuffer = await fs.readFile(filePath);
            const base64 = imgBuffer.toString('base64');
            const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : `image/${ext.slice(1)}`;
            return `<!DOCTYPE html><html><head><meta charset="utf-8">${baseStyle}</head><body style="display:flex;justify-content:center;align-items:flex-start;min-height:100vh;padding:24px"><img loading="lazy" src="data:${mimeType};base64,${base64}" style="max-width:100%;cursor:zoom-in" onclick="this.style.maxWidth=this.style.maxWidth==='none'?'100%':'none'" /></body></html>`;
        }
        throw new Error('Formato non supportato per anteprima HTML');
    }
};
exports.DocumentiService = DocumentiService;
DocumentiService.CATEGORIA_FOLDER_MAP = {
    'Contratti Cliente': '01_Contratto Cliente',
    'Contratti Fornitori': '02_Contratti Fornitori',
    'Documentazione Progettuale': '03_Documentazione progettuale',
    'Offerte forniture di materiali': path.join('04_Preventivi Fornitori', '01_Forniture di materiale'),
    'Offerte forniture di servizi': path.join('04_Preventivi Fornitori', '02_Subappalti'),
};
exports.DocumentiService = DocumentiService = DocumentiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentiService);
//# sourceMappingURL=documenti.service.js.map