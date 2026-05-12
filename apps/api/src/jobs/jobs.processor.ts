import { EntitaTargetImport, Prisma, StatoJob } from '@bresciani/db';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as XLSX from 'xlsx';
import { PrismaService } from '../prisma/prisma.service';

interface ImportError {
  riga: number;
  motivo: string;
}

interface ComputoMetricoFields {
  commessaId: string;
  descrizione: string;
  unitaMisura: string;
  quantita: number;
  prezzoUnitario: number;
  avanzamentoPercent: number;
}

@Processor('excel-import')
export class JobsProcessor extends WorkerHost {
  private readonly logger = new Logger(JobsProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  /** Estrae una stringa da `row` cercando i `keys` in ordine; ignora valori object. */
  private extractString(row: Record<string, unknown>, ...keys: string[]): string {
    for (const key of keys) {
      const val = row[key];
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return String(val);
      }
    }
    return '';
  }

  /** Estrae un numero da `row` cercando i `keys` in ordine; restituisce `fallback` se assente o non parsabile. */
  private extractNumber(row: Record<string, unknown>, fallback: number, ...keys: string[]): number {
    for (const key of keys) {
      const val = row[key];
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        const n = Number.parseFloat(String(val));
        if (!Number.isNaN(n)) return n;
      }
    }
    return fallback;
  }

  async process(job: Job<any, any, string>): Promise<void> {
    const { jobId, documentoId } = job.data;
    this.logger.log(`Inizio elaborazione Job ID: ${jobId}, documento: ${documentoId}`);

    // Recupera il record del job e il documento associato
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
      data: { stato: StatoJob.IN_ELABORAZIONE },
    });

    const errori: ImportError[] = [];
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
      const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });

      totaleRecord = rows.length;

      switch (jobRecord.entitaTarget) {
        case EntitaTargetImport.COMPUTO_METRICO:
          ({ processati: recordProcessati } = await this.importComputoMetrico(rows, errori));
          break;
        case EntitaTargetImport.FORNITORI:
          ({ processati: recordProcessati } = await this.importFornitori(rows, errori));
          break;
        case EntitaTargetImport.LISTINO_PREZZI:
          ({ processati: recordProcessati } = await this.importListinoPrezzi(rows, errori));
          break;
        default:
          throw new Error(`Target di importazione non gestito: ${jobRecord.entitaTarget}`);
      }

      const statoFinale = errori.length > 0 && recordProcessati < totaleRecord
        ? StatoJob.COMPLETATO_CON_ERRORI
        : StatoJob.COMPLETATO;

      await this.prisma.jobImportazione.update({
        where: { id: jobId },
        data: {
          stato: statoFinale,
          totaleRecord,
          recordProcessati,
          erroriLog: (errori.length > 0 ? errori : Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
        },
      });

      this.logger.log(`Job ${jobId} completato: ${recordProcessati}/${totaleRecord} record. Errori: ${errori.length}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore sconosciuto';
      this.logger.error(`Errore critico nel Job ${jobId}: ${message}`, error);

      await this.prisma.jobImportazione.update({
        where: { id: jobId },
        data: {
          stato: StatoJob.FALLITO,
          totaleRecord,
          recordProcessati,
          erroriLog: [{ riga: 0, motivo: message }],
        },
      });
      throw error;
    }
  }

  /**
   * Estrae e valida i campi scalari di una riga del Computo Metrico.
   * Responsabilità unica: parsing + validazione. Nessun accesso al DB.
   */
  private parseComputoMetricoRow(
    row: Record<string, unknown>,
    rigaNum: number,
    errori: ImportError[],
  ): ComputoMetricoFields | null {
    const commessaId = this.extractString(row, 'commessaId', 'commessa_id');
    const descrizione = this.extractString(row, 'descrizione');
    const unitaMisura = this.extractString(row, 'unitaMisura', 'unita_misura');
    const quantita = this.extractNumber(row, 0, 'quantita', 'Quantità');
    const prezzoUnitario = this.extractNumber(row, 0, 'prezzoUnitario', 'prezzo_unitario', 'Prezzo');
    const avanzamentoPercent = this.extractNumber(row, 0, 'avanzamentoPercent', 'avanzamento');

    if (!commessaId) { errori.push({ riga: rigaNum, motivo: 'commessaId mancante' }); return null; }
    if (!descrizione) { errori.push({ riga: rigaNum, motivo: 'descrizione mancante' }); return null; }
    if (!unitaMisura) { errori.push({ riga: rigaNum, motivo: 'unitaMisura mancante' }); return null; }
    if (Number.isNaN(quantita) || quantita < 0) { errori.push({ riga: rigaNum, motivo: 'quantita non valida' }); return null; }
    if (Number.isNaN(prezzoUnitario) || prezzoUnitario < 0) { errori.push({ riga: rigaNum, motivo: 'prezzoUnitario non valido' }); return null; }

    return { commessaId, descrizione, unitaMisura, quantita, prezzoUnitario, avanzamentoPercent };
  }

  /**
   * Verifica l'esistenza della commessa e persiste una voce AppaltoVoce.
   * Responsabilità unica: I/O sul DB. Nessuna logica di parsing.
   */
  private async persistComputoMetricoVoce(
    fields: ComputoMetricoFields,
    rigaNum: number,
    errori: ImportError[],
  ): Promise<boolean> {
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
        quantita: new Prisma.Decimal(fields.quantita),
        prezzoUnitario: new Prisma.Decimal(fields.prezzoUnitario),
        avanzamentoPercent: new Prisma.Decimal(Math.min(100, Math.max(0, fields.avanzamentoPercent))),
      },
    });
    return true;
  }

  /**
   * Import Computo Metrico (AppaltoVoci) per una commessa.
   * Colonne attese: commessaId, descrizione, unitaMisura, quantita, prezzoUnitario, avanzamentoPercent
   * Orchestratore puro: delega parsing a parseComputoMetricoRow e DB a persistComputoMetricoVoce.
   */
  private async importComputoMetrico(
    rows: Record<string, unknown>[],
    errori: ImportError[],
  ): Promise<{ processati: number }> {
    let processati = 0;

    for (let i = 0; i < rows.length; i++) {
      const rigaNum = i + 2; // Header è riga 1, dati da riga 2
      try {
        const fields = this.parseComputoMetricoRow(rows[i], rigaNum, errori);
        if (!fields) continue;
        const saved = await this.persistComputoMetricoVoce(fields, rigaNum, errori);
        if (saved) processati++;
      } catch (err) {
        errori.push({ riga: rigaNum, motivo: err instanceof Error ? err.message : 'Errore inserimento' });
      }
    }

    return { processati };
  }

  /**
   * Import Fornitori (solo log — entità non più in DB come tabella separata).
   * Utile per pre-popolare le sottocartelle fornitore.
   */
  private async importFornitori(
    rows: Record<string, unknown>[],
    errori: ImportError[],
  ): Promise<{ processati: number }> {
    // I fornitori sono stringhe nei documenti, non una tabella DB.
    // Registriamo solo quanti ne verrebbero importati.
    this.logger.log(`Import FORNITORI: ${rows.length} righe ricevute. Nessuna azione DB richiesta.`);
    if (rows.length === 0) {
      errori.push({ riga: 0, motivo: 'Nessuna riga trovata nel file' });
      return { processati: 0 };
    }
    return { processati: rows.length };
  }

  /**
   * Import Listino Prezzi (AppaltoVoci template senza commessaId — solo prezzi di riferimento).
   * Colonne attese: descrizione, unitaMisura, prezzoUnitario
   */
  private async importListinoPrezzi(
    rows: Record<string, unknown>[],
    errori: ImportError[],
  ): Promise<{ processati: number }> {
    // Il listino prezzi non ha ancora un modello DB dedicato.
    // Registriamo solo la validazione delle righe.
    this.logger.log(`Import LISTINO_PREZZI: ${rows.length} righe ricevute.`);
    let processati = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rigaNum = i + 2;
      const descrizione = this.extractString(row, 'descrizione');
      const prezzoUnitario = this.extractNumber(row, Number.NaN, 'prezzoUnitario', 'prezzo_unitario', 'Prezzo');

      if (!descrizione) { errori.push({ riga: rigaNum, motivo: 'descrizione mancante' }); continue; }
      if (Number.isNaN(prezzoUnitario)) { errori.push({ riga: rigaNum, motivo: 'prezzoUnitario non valido' }); continue; }

      processati++;
    }

    return { processati };
  }
}
