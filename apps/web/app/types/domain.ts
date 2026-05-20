/**
 * ViewModel (tipi UI) — derivati dalle API shapes ma adattati per il frontend.
 * Per i tipi esatti delle risposte API, vedi ./api.ts.
 */
import type {
    ApiCommessaList,
    ApiFattura,
    ApiFornitura,
    ApiSal
} from './api';

// ─── Navigation ─────────────────────────────────────────────────────────────

export type ActiveTab = 'sintesi' | 'documenti' | 'fornitori' | 'contabilita';

// ─── Commessa ───────────────────────────────────────────────────────────────

/** Fattura come arriva dall'API (Decimal serializzato come string) */
export type Fattura = ApiFattura;

/** SAL come arriva dall'API */
export type Sal = ApiSal;

/**
 * Commessa usata nella UI.
 * Estende la shape API list con campo attivita opzionale (presente solo in dettaglio).
 */
export interface Commessa extends ApiCommessaList {
  attivita?: unknown[];
}

// ─── Documenti ──────────────────────────────────────────────────────────────

/**
 * Metadata JSON blob memorizzato in datiEstrattiJson.
 * È un tipo aperto (index signature) perché il contenuto varia per categoria.
 */
export interface DocumentoMetadata {
  tipoDocumento?: string;
  nomeCliente?: string;
  dataContratto?: string;
  importoContratto?: number | string;
  dataVariante?: string;
  importoVariante?: number | string;
  segno?: '+' | '-' | string;
  voci?: unknown[];
  descrizione?: string;
  ragioneSociale?: string;
  partitaIva?: string;
  attivita?: string;
  tipo?: string;
  referente?: string;
  telefono?: string;
  nome?: string;
  note?: string;
  importo?: number | string;
  tempiPagamento?: string;
  stato?: string;
  [key: string]: unknown;
}

/**
 * Documento come usato nella UI.
 * Ricalca ApiDocumento ma con datiEstrattiJson tipizzato come DocumentoMetadata.
 */
export interface Documento {
  id: string;
  nomeFile: string;
  categoria: string | null;
  sottocategoria?: string | null;
  stato?: string | null;
  mimeType?: string | null;
  dimensione?: number | null;
  createdAt?: string;
  datiEstrattiJson?: DocumentoMetadata | null;
}

// ─── Fornitori (da JSON blob, non da tabella DB) ────────────────────────────

export interface Fornitore {
  ragioneSociale: string;
  tipo: string;
  partitaIva?: string;
  referente?: string;
  telefono?: string;
  attivita?: string;
}

// ─── Forniture ──────────────────────────────────────────────────────────────

/** Fornitura materiale/servizio come arriva dall'API */
export type FornituraRecord = ApiFornitura;

// ─── Re-export API types usati direttamente ─────────────────────────────────

export type { ApiAppaltoVoce, ApiCommessaDetail, ApiDocumento } from './api';

