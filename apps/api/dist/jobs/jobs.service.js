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
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const db_1 = require("@bresciani/db");
let JobsService = JobsService_1 = class JobsService {
    constructor(importQueue, prisma) {
        this.importQueue = importQueue;
        this.prisma = prisma;
        this.logger = new common_1.Logger(JobsService_1.name);
    }
    async enqueueImportJob(documentoId, target) {
        try {
            const jobRecord = await this.prisma.jobImportazione.create({
                data: {
                    documentoId,
                    entitaTarget: target,
                    stato: db_1.StatoJob.IN_CODA,
                },
            });
            await this.importQueue.add('process-excel', {
                jobId: jobRecord.id,
                documentoId,
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            });
            this.logger.log(`Job importazione ${target} messo in coda con ID: ${jobRecord.id}`);
            return jobRecord;
        }
        catch (error) {
            this.logger.error(`Fallimento messa in coda Job per documento ${documentoId}`, error);
            throw error;
        }
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('excel-import')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        prisma_service_1.PrismaService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map