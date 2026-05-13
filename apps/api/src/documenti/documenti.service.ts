import { Documento, Prisma, TipoEntitaDocumento } from '@bresciani/db';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as crypto from 'crypto';
import { createReadStream } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentiService implements OnModuleInit {
  private readonly logger = new Logger(DocumentiService.name);

  private get storageBasePath(): string {
    let envPath = process.env.STORAGE_BASE_PATH || 'C:\\Users\\Utente\\bresciani.group\\01.Operativo - Documenti\\Commesse';
    envPath = envPath.replace(/^["']|["']$/g, '');
    return path.normalize(envPath);
  }

  constructor(private readonly prisma: PrismaService) { }

  async onModuleInit() {
    try {
      await fs.mkdir(this.storageBasePath, { recursive: true });
      this.logger.log(`[STORAGE I/O VERIFICATO] Radice operativa agganciata: ${this.storageBasePath}`);
    } catch (error) {
      this.logger.error(`[CRITICO] Impossibile accedere o creare la radice: ${this.storageBasePath}. Verifica permessi.`, error);
    }
  }

  private sanitizeFilename(name: string): string {
    return name.replace(/[/\\?%*:|"<>]/g, '-').trim();
  }

  private formatPmFolder(responsabile: string | null | undefined): string {
    if (!responsabile) return 'PM_NON_ASSEGNATO';
    return this.sanitizeFilename(responsabile).toUpperCase();
  }

  private static readonly CATEGORIA_FOLDER_MAP: Record<string, string> = {
    'Contratti Cliente': '01_Contratto Cliente',
    'Contratti Fornitori': '02_Contratti Fornitori',
    'Documentazione Progettuale': '03_Documentazione progettuale',
    'Offerte forniture di materiali': path.join('04_Preventivi Fornitori', '01_Forniture di materiale'),
    'Offerte forniture di servizi': path.join('04_Preventivi Fornitori', '02_Subappalti'),
  };

  private normalizeCategoriaFolderName(categoria?: string): string | null {
    if (!categoria) return null;

    const normalized = categoria.trim();
    if (!normalized) return null;

    const mapped = DocumentiService.CATEGORIA_FOLDER_MAP[normalized];
    if (mapped) return mapped;

    return this.sanitizeFilename(normalized);
  }

  private normalizeSottocategoriaFolderName(sottocategoria?: string): string | null {
    if (!sottocategoria) return null;

    const normalized = sottocategoria.trim();
    if (!normalized) return null;

    return this.sanitizeFilename(normalized);
  }

  private resolveCommessaFolderName(commessa: {
    codiceIdentificativo?: string | null;
    indirizzo?: string | null;
    citta?: string | null;
  }): string {
    const rawCodice = (commessa.codiceIdentificativo || 'N_D').trim() || 'N_D';
    // Trasforma '2026-COMM-001' in '2026_001' per nomi cartella più leggibili
    const codice = rawCodice.replace(/-COMM-/g, '_');
    const indirizzo = (commessa.indirizzo || 'N_D').trim() || 'N_D';
    const citta = (commessa.citta || 'N_D').trim() || 'N_D';

    return `${codice}_${indirizzo}_${citta}`;
  }

  private resolveCommessaFolderPath(commessa: {
    responsabile?: string | null;
    codiceIdentificativo?: string | null;
    indirizzo?: string | null;
    citta?: string | null;
  }): string {
    const pmFolder = this.formatPmFolder(commessa.responsabile);
    const commessaFolder = this.sanitizeFilename(this.resolveCommessaFolderName(commessa));
    return path.join(this.storageBasePath, pmFolder, commessaFolder);
  }

  private async hasAnyFileRecursive(folderPath: string): Promise<boolean> {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) return true;
      if (entry.isDirectory()) {
        const nestedPath = path.join(folderPath, entry.name);
        if (await this.hasAnyFileRecursive(nestedPath)) return true;
      }
    }
    return false;
  }

  async hasCommessaFiles(commessa: {
    responsabile?: string | null;
    codiceIdentificativo?: string | null;
    indirizzo?: string | null;
    citta?: string | null;
  }): Promise<boolean> {
    const basePath = this.resolveCommessaFolderPath(commessa);
    try {
      await fs.stat(basePath);
    } catch {
      return false;
    }

    try {
      return await this.hasAnyFileRecursive(basePath);
    } catch (error) {
      this.logger.warn(`[I/O WARNING] Verifica file commessa fallita: ${basePath}`, error as Error);
      return false;
    }
  }

  async listPmFolders(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.storageBasePath, { withFileTypes: true });
      return entries
        .filter(e => e.isDirectory())
        .map(e => e.name)
        .sort();
    } catch {
      return [];
    }
  }

  async createCommessaFolder(
    responsabile: string,
    commessa: {
      codiceIdentificativo?: string | null;
      indirizzo?: string | null;
      citta?: string | null;
    },
  ): Promise<string> {
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
      await Promise.all(
        sottocartelle.map(sub => fs.mkdir(path.join(fullPath, sub), { recursive: true })),
      );

      // Sottocartelle per tipo fornitore dentro 04
      await Promise.all([
        fs.mkdir(path.join(fullPath, '04_Preventivi Fornitori', '01_Forniture di materiale'), { recursive: true }),
        fs.mkdir(path.join(fullPath, '04_Preventivi Fornitori', '02_Subappalti'), { recursive: true }),
      ]);

      this.logger.log(`[DIRECTORY CREATA] ${fullPath} (con ${sottocartelle.length} sottocartelle)`);

      return fullPath;
    } catch (error) {
      this.logger.error(`[ERRORE I/O] Fallita creazione cartella commessa in: ${this.storageBasePath}`, error);
      throw new InternalServerErrorException('Errore sistema I/O. File locked da Windows?');
    }
  }

  async uploadAndSave(
    file: Express.Multer.File,
    entitaTipo: TipoEntitaDocumento,
    entitaId: string,
    categoria?: string,
    sottocategoria?: string,
    datiEstrattiJsonRaw?: string,
  ): Promise<Documento> {
    if (!file || !file.buffer) {
      throw new BadRequestException('File non valido o corrotto.');
    }

    let targetPath = this.storageBasePath;

    if (entitaTipo === 'COMMESSA') {
      const commessa = await this.prisma.commessa.findUnique({ where: { id: entitaId } });
      if (!commessa) {
        throw new NotFoundException('Commessa non trovata per il caricamento documentale.');
      }

      const categoriaFolder = this.normalizeCategoriaFolderName(categoria);
      if (!categoriaFolder) {
        throw new BadRequestException('Categoria obbligatoria per i documenti di commessa.');
      }

      const requiresSupplierFolder = categoria === 'Offerte forniture di materiali'
        || categoria === 'Offerte forniture di servizi';
      const sottocategoriaFolder = this.normalizeSottocategoriaFolderName(sottocategoria);
      if (requiresSupplierFolder && !sottocategoriaFolder) {
        throw new BadRequestException('Nome fornitore obbligatorio per le offerte materiali o servizi.');
      }

      const commessaFolderPath = this.resolveCommessaFolderPath(commessa);

      // I documenti operativi/economici dei fornitori (caricati da "Gestione Fornitori")
      // finiscono nella sottocartella del tipo appropriato dentro 04_Preventivi Fornitori
      const isDocumentoOperativoFornitore =
        categoria === 'Documenti Fornitore Materiali' ||
        categoria === 'Documenti Fornitore Servizi';

      if (isDocumentoOperativoFornitore) {
        if (!sottocategoriaFolder) {
          throw new BadRequestException('Ragione sociale fornitore obbligatoria per i documenti operativi.');
        }
        const tipoSub = categoria === 'Documenti Fornitore Materiali'
          ? '01_Forniture di materiale'
          : '02_Subappalti';
        targetPath = path.join(commessaFolderPath, '04_Preventivi Fornitori', tipoSub, sottocategoriaFolder);
      } else if (categoria === 'Contratti Cliente' && sottocategoria?.trim() === 'Variante') {
        // Varianti: cartella progressiva Variante01_DD-MM-YYYY, Variante02_DD-MM-YYYY, ...
        const contrattoDir = path.join(commessaFolderPath, categoriaFolder);
        await fs.mkdir(contrattoDir, { recursive: true });
        let nextNum = 1;
        try {
          const entries = await fs.readdir(contrattoDir, { withFileTypes: true });
          const varianteFolders = entries.filter(e => e.isDirectory() && /^Variante\d{2}_/.test(e.name));
          nextNum = varianteFolders.length + 1;
        } catch { /* directory vuota */ }
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        const varianteFolder = `Variante${String(nextNum).padStart(2, '0')}_${dd}-${mm}-${yyyy}`;
        targetPath = path.join(contrattoDir, varianteFolder);
      } else {
        targetPath = path.join(
          commessaFolderPath,
          categoriaFolder,
          ...(sottocategoriaFolder ? [sottocategoriaFolder] : []),
        );
      }
      await fs.mkdir(targetPath, { recursive: true });

      // Quando si registra un Contratto Fornitore, creiamo in automatico anche
      // le cartelle preventivi per il fornitore in entrambe le sottocartelle di 04
      if (categoria === 'Contratti Fornitori' && sottocategoriaFolder) {
        const prevMateriali = path.join(commessaFolderPath, '04_Preventivi Fornitori', '01_Forniture di materiale', sottocategoriaFolder);
        const prevSubappalti = path.join(commessaFolderPath, '04_Preventivi Fornitori', '02_Subappalti', sottocategoriaFolder);
        try {
          await Promise.all([
            fs.mkdir(prevMateriali, { recursive: true }),
            fs.mkdir(prevSubappalti, { recursive: true }),
          ]);
          this.logger.log(`[DIRECTORY FORNITORE PREVENTIVI CREATA] ${prevMateriali}, ${prevSubappalti}`);
        } catch (fsErr) {
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
    } catch (error) {
      throw new InternalServerErrorException('Impossibile salvare il file fisicamente sul server.');
    }

    const storageUrl = `file://${filePath.replace(/\\/g, '/')}`;

    let datiEstrattiJson: Prisma.InputJsonValue | typeof Prisma.JsonNull = Prisma.JsonNull;
    if (datiEstrattiJsonRaw) {
      try {
        datiEstrattiJson = JSON.parse(datiEstrattiJsonRaw) as Prisma.InputJsonValue;
      } catch {
        // JSON malformato: ignoriamo silenziosamente
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

  async patchMetadata(documentoId: string, datiEstrattiJsonRaw: string): Promise<Documento> {
    const doc = await this.prisma.documento.findUnique({ where: { id: documentoId } });
    if (!doc) throw new NotFoundException('Documento non trovato.');
    const datiEstrattiJson = JSON.parse(datiEstrattiJsonRaw) as Prisma.InputJsonValue;
    return this.prisma.documento.update({
      where: { id: documentoId },
      data: { datiEstrattiJson },
    });
  }

  async deleteDocumento(documentoId: string): Promise<void> {
    const doc = await this.prisma.documento.findUnique({ where: { id: documentoId } });
    if (!doc) throw new NotFoundException('Documento non trovato.');
    await this.prisma.documento.delete({ where: { id: documentoId } });
  }

  async findByEntita(entitaTipo: TipoEntitaDocumento, entitaId: string): Promise<Documento[]> {
    return this.prisma.documento.findMany({
      where: { entitaTipo, entitaId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Restituisce tutti i documenti "pending" — quelli che hanno uno stato workflow
   * ma non hanno ancora raggiunto lo stato finale (Approvato/Approvata/Pagata).
   */
  async findPending(): Promise<(Documento & { commessa?: { id: string; codiceIdentificativo: string; nomeCliente: string | null } })[]> {
    const STATI_FINALI = ['Approvato', 'Approvata', 'Pagata', 'Pagato'];

    // Tutti i documenti con datiEstrattiJson.stato valorizzato
    const docs = await this.prisma.documento.findMany({
      where: {
        datiEstrattiJson: { not: Prisma.DbNull },
        entitaTipo: 'COMMESSA',
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filtra: solo quelli con stato workflow non finale
    const pending = docs.filter(d => {
      const json = d.datiEstrattiJson as Record<string, unknown> | null;
      if (!json || !json.stato) return false;
      const stato = String(json.stato);
      return stato.length > 0 && !STATI_FINALI.includes(stato);
    });

    // Arricchisci con info commessa
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

  /**
   * SOLID: Espone uno stream del file per bypassare i blocchi di sicurezza del browser sulle URI file://
   */
  async getFileStream(documentoId: string) {
    const doc = await this.prisma.documento.findUnique({ where: { id: documentoId } });
    if (!doc) throw new NotFoundException('Documento non trovato a sistema.');

    // Puliamo la URI per ottenere il percorso di Windows nativo
    const filePath = doc.storageUrl.replace('file://', '');

    try {
      await fs.stat(filePath);
    } catch {
      throw new NotFoundException('Il file fisico non esiste più sul server Windows.');
    }

    const stream = createReadStream(filePath);

    // Inferenza mime-type per anteprima nativa nel browser
    const ext = path.extname(doc.nomeFile).toLowerCase();
    const mimeMap: Record<string, string> = {
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

  async getPreviewHtml(documentoId: string): Promise<string> {
    const doc = await this.prisma.documento.findUnique({ where: { id: documentoId } });
    if (!doc) throw new NotFoundException('Documento non trovato');

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
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mammoth = require('mammoth') as typeof import('mammoth');
      const result = await mammoth.convertToHtml({ path: filePath });
      return `<!DOCTYPE html><html><head><meta charset="utf-8">${baseStyle}</head><body>${result.value}</body></html>`;
    }

    if (ext === '.xlsx' || ext === '.xls') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const XLSX = require('xlsx') as typeof import('xlsx');
      const workbook = XLSX.readFile(filePath);
      const sheets = workbook.SheetNames.map(name => {
        const sheet = workbook.Sheets[name];
        const html = XLSX.utils.sheet_to_html(sheet, { id: `sheet-${name}` });
        return `<div class="sheet-title">${name}</div>${html}`;
      }).join('<hr>');
      return `<!DOCTYPE html><html><head><meta charset="utf-8">${baseStyle}</head><body>${sheets}</body></html>`;
    }

    throw new Error('Formato non supportato per anteprima HTML');
  }
}
