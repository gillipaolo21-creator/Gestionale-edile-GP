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
var JobsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsProcessor = void 0;
const db_1 = require("@bresciani/db");
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const fs = require("node:fs");
const path = require("node:path");
const XLSX = require("xlsx");
const prisma_service_1 = require("../prisma/prisma.service");
let JobsProcessor = JobsProcessor_1 = class JobsProcessor extends bullmq_1.WorkerHost {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.logger = new common_1.Logger(JobsProcessor_1.name);
    }
    extractString(row, ...keys) {
        for (const key of keys) {
            const val = row[key];
            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                return String(val);
            }
        }
        return '';
    }
    extractNumber(row, fallback, ...keys) {
        for (const key of keys) {
            const val = row[key];
            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                const n = Number.parseFloat(String(val));
                if (!Number.isNaN(n))
                    return n;
            }
        }
        return fallback;
    }
    async process(job) {
        const { jobId, documentoId } = job.data;
        this.logger.log(`Inizio elaborazione Job ID: ${jobId}, documento: ${documentoId}`);
        const jobRecord = await this.prisma.jobImportazione.findUnique({
            where: { id: jobId },
            include: { documento: true },
        });
        if (!jobRecord) {
            this.logger.error(`Job ${jobId} non trovato nel DB`);
            return;
        }
        await this.prisma.jobImportazione.update({
            where: { id: jobId },
            data: { stato: db_1.StatoJob.IN_ELABORAZIONE },
        });
        const errori = [];
        let totaleRecord = 0;
        let recordProcessati = 0;
        try {
            const filePath = jobRecord.documento.storageUrl;
            if (!fs.existsSync(filePath)) {
                throw new Error(`File non trovato: ${filePath}`);
            }
            const ext = path.extname(filePath).toLowerCase();
            if (!['.xlsx', '.xls', '.csv'].includes(ext)) {
                throw new Error(`Formato file non supportato: ${ext}. Usare .xlsx, .xls o .csv`);
            }
            const workbook = XLSX.readFile(filePath, { cellDates: true });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { defval: null });
            totaleRecord = rows.length;
            switch (jobRecord.entitaTarget) {
                case db_1.EntitaTargetImport.COMPUTO_METRICO:
                    ({ processati: recordProcessati } = await this.importComputoMetrico(rows, errori));
                    break;
                case db_1.EntitaTargetImport.FORNITORI:
                    ({ processati: recordProcessati } = await this.importFornitori(rows, errori));
                    break;
                case db_1.EntitaTargetImport.LISTINO_PREZZI:
                    ({ processati: recordProcessati } = await this.importListinoPrezzi(rows, errori));
                    break;
                default:
                    throw new Error(`Target di importazione non gestito: ${jobRecord.entitaTarget}`);
            }
            const statoFinale = errori.length > 0 && recordProcessati < totaleRecord
                ? db_1.StatoJob.COMPLETATO_CON_ERRORI
                : db_1.StatoJob.COMPLETATO;
            await this.prisma.jobImportazione.update({
                where: { id: jobId },
                data: {
                    stato: statoFinale,
                    totaleRecord,
                    recordProcessati,
                    erroriLog: (errori.length > 0 ? errori : db_1.Prisma.JsonNull),
                },
            });
            this.logger.log(`Job ${jobId} completato: ${recordProcessati}/${totaleRecord} record. Errori: ${errori.length}`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Errore sconosciuto';
            this.logger.error(`Errore critico nel Job ${jobId}: ${message}`, error);
            await this.prisma.jobImportazione.update({
                where: { id: jobId },
                data: {
                    stato: db_1.StatoJob.FALLITO,
                    totaleRecord,
                    recordProcessati,
                    erroriLog: [{ riga: 0, motivo: message }],
                },
            });
            throw error;
        }
    }
    parseComputoMetricoRow(row, rigaNum, errori) {
        const commessaId = this.extractString(row, 'commessaId', 'commessa_id');
        const descrizione = this.extractString(row, 'descrizione');
        const unitaMisura = this.extractString(row, 'unitaMisura', 'unita_misura');
        const quantita = this.extractNumber(row, 0, 'quantita', 'Quantità');
        const prezzoUnitario = this.extractNumber(row, 0, 'prezzoUnitario', 'prezzo_unitario', 'Prezzo');
        const avanzamentoPercent = this.extractNumber(row, 0, 'avanzamentoPercent', 'avanzamento');
        if (!commessaId) {
            errori.push({ riga: rigaNum, motivo: 'commessaId mancante' });
            return null;
        }
        if (!descrizione) {
            errori.push({ riga: rigaNum, motivo: 'descrizione mancante' });
            return null;
        }
        if (!unitaMisura) {
            errori.push({ riga: rigaNum, motivo: 'unitaMisura mancante' });
            return null;
        }
        if (Number.isNaN(quantita) || quantita < 0) {
            errori.push({ riga: rigaNum, motivo: 'quantita non valida' });
            return null;
        }
        if (Number.isNaN(prezzoUnitario) || prezzoUnitario < 0) {
            errori.push({ riga: rigaNum, motivo: 'prezzoUnitario non valido' });
            return null;
        }
        return { commessaId, descrizione, unitaMisura, quantita, prezzoUnitario, avanzamentoPercent };
    }
    async persistComputoMetricoVoce(fields, rigaNum, errori) {
        const commessa = await this.prisma.commessa.findUnique({
            where: { id: fields.commessaId },
            select: { id: true },
        });
        if (!commessa) {
            errori.push({ riga: rigaNum, motivo: `Commessa ${fields.commessaId} non trovata` });
            return false;
        }
        await this.prisma.appaltoVoce.create({
            data: {
                commessaId: fields.commessaId,
                descrizione: fields.descrizione,
                unitaMisura: fields.unitaMisura,
                quantita: new db_1.Prisma.Decimal(fields.quantita),
                prezzoUnitario: new db_1.Prisma.Decimal(fields.prezzoUnitario),
                avanzamentoPercent: new db_1.Prisma.Decimal(Math.min(100, Math.max(0, fields.avanzamentoPercent))),
            },
        });
        return true;
    }
    async importComputoMetrico(rows, errori) {
        let processati = 0;
        for (let i = 0; i < rows.length; i++) {
            const rigaNum = i + 2;
            try {
                const fields = this.parseComputoMetricoRow(rows[i], rigaNum, errori);
                if (!fields)
                    continue;
                const saved = await this.persistComputoMetricoVoce(fields, rigaNum, errori);
                if (saved)
                    processati++;
            }
            catch (err) {
                errori.push({ riga: rigaNum, motivo: err instanceof Error ? err.message : 'Errore inserimento' });
            }
        }
        return { processati };
    }
    async importFornitori(rows, errori) {
        this.logger.log(`Import FORNITORI: ${rows.length} righe ricevute. Nessuna azione DB richiesta.`);
        if (rows.length === 0) {
            errori.push({ riga: 0, motivo: 'Nessuna riga trovata nel file' });
            return { processati: 0 };
        }
        return { processati: rows.length };
    }
    async importListinoPrezzi(rows, errori) {
        this.logger.log(`Import LISTINO_PREZZI: ${rows.length} righe ricevute.`);
        let processati = 0;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rigaNum = i + 2;
            const descrizione = this.extractString(row, 'descrizione');
            const prezzoUnitario = this.extractNumber(row, Number.NaN, 'prezzoUnitario', 'prezzo_unitario', 'Prezzo');
            if (!descrizione) {
                errori.push({ riga: rigaNum, motivo: 'descrizione mancante' });
                continue;
            }
            if (Number.isNaN(prezzoUnitario)) {
                errori.push({ riga: rigaNum, motivo: 'prezzoUnitario non valido' });
                continue;
            }
            processati++;
        }
        return { processati };
    }
};
exports.JobsProcessor = JobsProcessor;
exports.JobsProcessor = JobsProcessor = JobsProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('excel-import'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsProcessor);
//# sourceMappingURL=jobs.processor.js.map