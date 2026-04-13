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
var CommesseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommesseService = void 0;
const db_1 = require("@bresciani/db");
const common_1 = require("@nestjs/common");
const documenti_service_1 = require("../documenti/documenti.service");
const prisma_service_1 = require("../prisma/prisma.service");
let CommesseService = CommesseService_1 = class CommesseService {
    constructor(prisma, documentiService) {
        this.prisma = prisma;
        this.documentiService = documentiService;
        this.logger = new common_1.Logger(CommesseService_1.name);
    }
    async findAll() {
        const commesse = await this.prisma.commessa.findMany({
            include: {
                fatture: true,
                sals: { orderBy: { progressivo: 'desc' }, take: 1 }
            },
            orderBy: { createdAt: 'desc' },
        });
        const commessaIds = commesse.map(c => c.id);
        const contractCounts = await this.prisma.documento.groupBy({
            by: ['entitaId'],
            where: {
                entitaTipo: db_1.TipoEntitaDocumento.COMMESSA,
                entitaId: { in: commessaIds },
                categoria: 'Contratti Cliente',
            },
            _count: true,
        });
        const contractMap = new Map(contractCounts.map(c => [c.entitaId, c._count]));
        const docs = await this.prisma.documento.findMany({
            where: {
                entitaTipo: db_1.TipoEntitaDocumento.COMMESSA,
                entitaId: { in: commessaIds },
                categoria: { in: ['Contratti Cliente', 'Varianti'] },
            },
            select: { entitaId: true, categoria: true, datiEstrattiJson: true },
        });
        const importoMap = new Map();
        for (const doc of docs) {
            const json = doc.datiEstrattiJson;
            if (!json)
                continue;
            const current = importoMap.get(doc.entitaId) || 0;
            if (json.importoContratto) {
                importoMap.set(doc.entitaId, current + Number(json.importoContratto));
            }
            else if (json.importoVariante) {
                const segno = json.segno === '-' ? -1 : 1;
                importoMap.set(doc.entitaId, current + segno * Number(json.importoVariante));
            }
        }
        return commesse.map(c => ({
            ...c,
            hasContrattoCliente: (contractMap.get(c.id) || 0) > 0,
            importoCalcolato: (importoMap.get(c.id) || 0).toString(),
        }));
    }
    async getNextCode() {
        const year = new Date().getFullYear();
        const prefix = `${year}-COMM-`;
        const last = await this.prisma.commessa.findFirst({
            where: { codiceIdentificativo: { startsWith: prefix } },
            orderBy: { codiceIdentificativo: 'desc' },
            select: { codiceIdentificativo: true },
        });
        const lastNumber = last?.codiceIdentificativo?.replace(prefix, '') || '0';
        const next = (parseInt(lastNumber, 10) || 0) + 1;
        const padded = next.toString().padStart(3, '0');
        return `${prefix}${padded}`;
    }
    async create(dto) {
        this.logger.debug(`Creazione Commessa DTO Ricevuto: ${JSON.stringify(dto)}`);
        try {
            const codice = dto.codiceIdentificativo || await this.getNextCode();
            const commessa = await this.prisma.$transaction(async (tx) => {
                const record = await tx.commessa.create({
                    data: {
                        codiceIdentificativo: codice,
                        tipoLavori: dto.tipoLavori,
                        nomeCantiere: dto.nomeCantiere,
                        nomeCliente: dto.nomeCliente,
                        indirizzo: dto.indirizzo,
                        citta: dto.citta,
                        cap: dto.cap,
                        responsabile: dto.responsabile,
                        budgetIniziale: new db_1.Prisma.Decimal(dto.budgetIniziale ?? 0),
                        dataInizio: new Date(dto.dataInizio),
                        stato: db_1.StatoCommessa.IN_PREVENTIVAZIONE,
                    },
                });
                if (dto.attivita && dto.attivita.length > 0) {
                    for (const foglio of dto.attivita) {
                        await this.saveAttivitaRecursive(tx, record.id, foglio);
                    }
                }
                return record;
            });
            try {
                await this.documentiService.createCommessaFolder(commessa.responsabile || 'N_D', {
                    codiceIdentificativo: commessa.codiceIdentificativo,
                    indirizzo: commessa.indirizzo,
                    nomeCliente: commessa.nomeCliente,
                });
            }
            catch (fsError) {
                this.logger.warn(`[I/O NON BLOCCANTE] Cartella non creata su Windows per la commessa ${commessa.id}. Sarà creata al primo upload.`);
            }
            return commessa;
        }
        catch (error) {
            this.logger.error('Errore Database durante la creazione della commessa:', error);
            throw new common_1.InternalServerErrorException(error.message || 'Errore durante la persistenza della commessa');
        }
    }
    async saveAttivitaRecursive(tx, commessaId, dto, parentId = null) {
        const attivita = await tx.attivita.create({
            data: {
                commessaId,
                parentId,
                titolo: dto.titolo,
                descrizione: dto.descrizione,
                importoPrevisto: new db_1.Prisma.Decimal(dto.importoPrevisto),
                stato: dto.stato || 'PROGRAMMATA',
                responsabile: dto.responsabile,
                dataInizio: dto.dataInizio ? new Date(dto.dataInizio) : null,
                dataFine: dto.dataFine ? new Date(dto.dataFine) : null,
            },
        });
        if (dto.sottocategorie && dto.sottocategorie.length > 0) {
            for (const sub of dto.sottocategorie) {
                await this.saveAttivitaRecursive(tx, commessaId, sub, attivita.id);
            }
        }
    }
    async findOne(id) {
        const commessa = await this.prisma.commessa.findUnique({
            where: { id },
            include: {
                attivita: { orderBy: { createdAt: 'asc' } },
                sals: { orderBy: { progressivo: 'desc' } },
                fatture: true,
                appaltoVoci: { orderBy: { createdAt: 'asc' } },
            },
        });
        if (!commessa)
            throw new common_1.NotFoundException('Commessa non trovata');
        const docs = await this.prisma.documento.findMany({
            where: {
                entitaTipo: db_1.TipoEntitaDocumento.COMMESSA,
                entitaId: id,
                categoria: { in: ['Contratti Cliente', 'Varianti'] },
            },
            select: { categoria: true, datiEstrattiJson: true },
        });
        let importoCalcolato = 0;
        for (const doc of docs) {
            const json = doc.datiEstrattiJson;
            if (!json)
                continue;
            if (json.importoContratto) {
                importoCalcolato += Number(json.importoContratto);
            }
            else if (json.importoVariante) {
                const segno = json.segno === '-' ? -1 : 1;
                importoCalcolato += segno * Number(json.importoVariante);
            }
        }
        return { ...commessa, importoCalcolato: importoCalcolato.toString() };
    }
    async updateDataInizioLavori(id, dataInizioLavori) {
        const commessa = await this.prisma.commessa.findUnique({ where: { id } });
        if (!commessa)
            throw new common_1.NotFoundException('Commessa non trovata');
        const data = {
            dataInizioLavori: dataInizioLavori ? new Date(dataInizioLavori) : null,
        };
        if (dataInizioLavori && commessa.stato !== db_1.StatoCommessa.CHIUSO) {
            data.stato = db_1.StatoCommessa.IN_CORSO;
        }
        return this.prisma.commessa.update({ where: { id }, data });
    }
    async close(id) {
        try {
            const commessa = await this.prisma.commessa.update({
                where: { id },
                data: { stato: db_1.StatoCommessa.CHIUSO },
            });
            this.logger.log(`Commessa ${id} chiusa con successo.`);
            return commessa;
        }
        catch (error) {
            this.logger.error(`Errore chiusura commessa ${id}:`, error);
            throw new common_1.InternalServerErrorException("Errore durante la chiusura della commessa.");
        }
    }
    async remove(id) {
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.documento.deleteMany({
                    where: { entitaTipo: db_1.TipoEntitaDocumento.COMMESSA, entitaId: id },
                });
                await tx.fattura.deleteMany({ where: { commessaId: id } });
                await tx.sal.deleteMany({ where: { commessaId: id } });
                await tx.commessa.delete({ where: { id } });
            });
            this.logger.log(`Commessa ${id} eliminata dal sistema. I file su disco sono stati mantenuti.`);
        }
        catch (error) {
            this.logger.error(`Errore eliminazione commessa ${id}:`, error);
            throw new common_1.InternalServerErrorException("Errore durante l'eliminazione della commessa.");
        }
    }
    async getDeleteInfo(id) {
        const commessa = await this.prisma.commessa.findUnique({ where: { id } });
        if (!commessa)
            throw new common_1.NotFoundException('Commessa non trovata');
        const documento = await this.prisma.documento.findFirst({
            where: { entitaTipo: db_1.TipoEntitaDocumento.COMMESSA, entitaId: id },
            select: { id: true },
        });
        const hasFilesOnDisk = await this.documentiService.hasCommessaFiles({
            responsabile: commessa.responsabile,
            codiceIdentificativo: commessa.codiceIdentificativo,
            indirizzo: commessa.indirizzo,
            nomeCliente: commessa.nomeCliente,
        });
        return { hasDocuments: !!documento, hasFilesOnDisk };
    }
    async removeFromHome(id) {
        await this.remove(id);
    }
    async getAppaltoVoci(commessaId) {
        const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!commessa)
            throw new common_1.NotFoundException('Commessa non trovata');
        return this.prisma.appaltoVoce.findMany({
            where: { commessaId },
            orderBy: [{ parentId: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async setAppaltoVoci(commessaId, voci) {
        const commessa = await this.prisma.commessa.findUnique({ where: { id: commessaId } });
        if (!commessa)
            throw new common_1.NotFoundException('Commessa non trovata');
        await this.prisma.$transaction(async (tx) => {
            await tx.appaltoVoce.deleteMany({ where: { commessaId } });
            if (voci.length === 0)
                return;
            await tx.appaltoVoce.createMany({
                data: voci.map((voce) => ({
                    commessaId,
                    parentId: voce.parentId || null,
                    descrizione: voce.descrizione,
                    unitaMisura: voce.unitaMisura,
                    quantita: new db_1.Prisma.Decimal(voce.quantita),
                    prezzoUnitario: new db_1.Prisma.Decimal(voce.prezzoUnitario),
                    avanzamentoPercent: new db_1.Prisma.Decimal(voce.avanzamentoPercent),
                })),
            });
        });
        return this.getAppaltoVoci(commessaId);
    }
};
exports.CommesseService = CommesseService;
exports.CommesseService = CommesseService = CommesseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        documenti_service_1.DocumentiService])
], CommesseService);
//# sourceMappingURL=commesse.service.js.map