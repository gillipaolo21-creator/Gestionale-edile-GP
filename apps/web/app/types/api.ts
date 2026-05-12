/**
 * Tipi che rispecchiano fedelmente le risposte JSON dell'API NestJS.
 * Prisma serializza Decimal come string e Date come ISO string.
 * NON modificare questi tipi per esigenze UI — usare i ViewModel in domain.ts.
 */

// ─── Enums (mirror del backend) ────────────────────────────────────────────

export type StatoCommessa = 'IN_PREVENTIVAZIONE' | 'IN_CORSO' | 'SOSPESO' | 'CHIUSO';
export type StatoSAL = 'BOZZA' | 'APPROVATO_DL' | 'FATTURABILE';
export type StatoPagamento = 'DA_PAGARE' | 'PARZIALE' | 'PAGATO';
export type TipoDocumentoFiscale = 'FATTURA_ATTIVA' | 'FATTURA_PASSIVA' | 'NOTA_CREDITO';
export type TipoEntitaDocumento = 'COMMESSA' | 'SAL' | 'FATTURA' | 'FORNITORE';

// ─── Risposte API: Commesse ────────────────────────────────────────────────

export interface ApiFattura {
  id: string;
  tipoDocumento: TipoDocumentoFiscale;
  commessaId: string;
  salId: string | null;
  importoImponibile: string; // Decimal → string
  iva: string;
  dataScadenza: string; // ISO date
  statoPagamento: StatoPagamento;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSal {
  id: string;
  commessaId: string;
  progressivo: number;
  dataCertificazione: string;
  percentualeCompletamento: string; // Decimal → string
  importoMaturato: string;
  statoApprovazione: StatoSAL;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAttivita {
  id: string;
  commessaId: string;
  parentId: string | null;
  codiceWbs: string | null;
  titolo: string;
  descrizione: string | null;
  importoPrevisto: string;
  dataInizio: string | null;
  dataFine: string | null;
  responsabile: string | null;
  stato: string;
  createdAt: string;
  updatedAt: string;
}

/** GET /api/commesse — lista (include fatture + ultimo SAL) */
export interface ApiCommessaList {
  id: string;
  codiceIdentificativo: string;
  tipoLavori: string;
  nomeCantiere: string;
  nomeCliente: string | null;
  indirizzo: string | null;
  citta: string | null;
  cap: string | null;
  responsabile: string | null;
  budgetIniziale: string; // Decimal → string
  dataInizio: string;
  dataFinePrevista: string | null;
  dataInizioLavori: string | null;
  stato: StatoCommessa;
  createdAt: string;
  updatedAt: string;
  fatture: ApiFattura[];
  sals: ApiSal[];
  hasContrattoCliente: boolean;
  importoCalcolato: string;
}

/** GET /api/commesse/:id — dettaglio (include attivita, appaltoVoci, fatture, sals) */
export interface ApiCommessaDetail extends ApiCommessaList {
  attivita: ApiAttivita[];
  appaltoVoci: ApiAppaltoVoce[];
}

// ─── Risposte API: Appalto Voci ────────────────────────────────────────────

export interface ApiAppaltoVoce {
  id: string;
  commessaId: string;
  parentId: string | null;
  descrizione: string;
  unitaMisura: string;
  quantita: string; // Decimal → string
  prezzoUnitario: string;
  avanzamentoPercent: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Risposte API: Documenti ───────────────────────────────────────────────

export interface ApiDocumento {
  id: string;
  entitaTipo: TipoEntitaDocumento;
  entitaId: string;
  nomeFile: string;
  storageUrl: string;
  hashFile: string;
  categoria: string | null;
  sottocategoria: string | null;
  statoOcr: string;
  datiEstrattiJson: Record<string, unknown> | null;
  createdAt: string;
}

// ─── Risposte API: Forniture ───────────────────────────────────────────────

export interface ApiFornitura {
  id: string;
  commessaId: string;
  fornitoreNome: string;
  importoFornitura: string; // Decimal → string
  descrizione: string | null;
  preventivoRiferimento: string;
  dataPreventivo: string;
  createdAt: string;
  updatedAt: string;
}
