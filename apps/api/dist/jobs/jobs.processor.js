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
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const db_1 = require("@bresciani/db");
let JobsProcessor = JobsProcessor_1 = class JobsProcessor extends bullmq_1.WorkerHost {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.logger = new common_1.Logger(JobsProcessor_1.name);
    }
    async process(job) {
        const { jobId, documentoId } = job.data;
        this.logger.log(`Inizio elaborazione asincrona Job ID: ${jobId} per il documento: ${documentoId}`);
        try {
            await this.prisma.jobImportazione.update({
                where: { id: jobId },
                data: { stato: db_1.StatoJob.IN_ELABORAZIONE },
            });
            await new Promise(resolve => setTimeout(resolve, 3000));
            await this.prisma.jobImportazione.update({
                where: { id: jobId },
                data: { stato: db_1.StatoJob.COMPLETATO, totaleRecord: 100, recordProcessati: 100 },
            });
            this.logger.log(`Job ID: ${jobId} completato con successo.`);
        }
        catch (error) {
            this.logger.error(`Errore durante l'elaborazione del Job ${jobId}`, error);
            await this.prisma.jobImportazione.update({
                where: { id: jobId },
                data: { stato: db_1.StatoJob.FALLITO, erroriLog: { msg: 'Errore interno worker' } },
            });
            throw error;
        }
    }
};
exports.JobsProcessor = JobsProcessor;
exports.JobsProcessor = JobsProcessor = JobsProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('excel-import'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsProcessor);
//# sourceMappingURL=jobs.processor.js.map