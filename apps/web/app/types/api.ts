/**
 * Tipi che rispecchiano fedelmente le risposte JSON dell'API NestJS.
 * Prisma serializza Decimal come string e Date come ISO string.
 * NON modificare questi tipi per esigenze UI — usare i ViewModel in domain.ts.
 */

// ─── Enums (mirror del backend) ────────────────────────────────────────────

export type StatoCommessa = 'PREVENTIVO' | 'AGGIUDICATO' | 'IN_CORSO' | 'SOSPESO' | 'CHIUSO';
export type StatoSAL = 'BOZZA' | 'APPROVATO' | 'FATTURABILE';
export type TipoSAL = 'ATTIVO' | 'PASSIVO';
export type TipoOpera = 'NUOVA_COSTRUZIONE' | 'RISTRUTTURAZIONE' | 'MANUTENZIONE' | 'RESTAURO' | 'INFRASTRUTTURE' | 'IMPIANTI' | 'ALTRO';
export type StatoPagamento = 'DA_PAGARE' | 'PARZIALE' | 'PAGATO';
export type TipoDocumentoFiscale = 'FATTURA_ATTIVA' | 'FATTURA_PASSIVA' | 'NOTA_CREDITO';
export type TipoEntitaDocumento = 'COMMESSA' | 'SAL' | 'FATTURA' | 'FORNITORE';

// ─── Risposte API: Commesse ────────────────────────────────────────────────

export interface ApiFattura {
  id: string;
  tipoDocumento: TipoDocumentoFiscale;
  commessaId: string;
  salId: string | null;
  numero: string | null;
  fornitoreCliente: string | null;
  importoImponibile: string; // Decimal → string
  iva: string;
  dataEmissione: string; // ISO date
  dataScadenza: string | null; // ISO date
  statoPagamento: StatoPagamento;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSal {
  id: string;
  commessaId: string;
  tipo: TipoSAL;
  progressivo: number;
  dataCertificazione: string;
  percentualeCompletamento: string; // Decimal → string
  importoMaturato: string;
  importoRitenuta: string | null;
  stato: StatoSAL;
  note: string | null;
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
  tipoOpera: TipoOpera;
  nomeCantiere: string;
  committente: string | null;
  indirizzo: string | null;
  citta: string | null;
  cap: string | null;
  responsabile: string | null;
  importoContratto: string; // Decimal → string
  dataInizio: string;
  dataFinePrevista: string | null;
  stato: StatoCommessa;
  createdAt: string;
  updatedAt: string;
  fatture: ApiFattura[];
  sals: ApiSal[];
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
