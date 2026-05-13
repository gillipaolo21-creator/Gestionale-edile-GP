'use client';
import { AlertCircle, Briefcase, ChevronLeft, ChevronRight, FileText, MapPin, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type { Commessa } from '../types/domain';
import { CommessaCardSkeleton } from './Skeleton';

interface PendingDoc {
  id: string;
  nomeFile: string;
  categoria: string | null;
  datiEstrattiJson: Record<string, unknown> | null;
  createdAt: string;
  commessa?: { id: string; codiceIdentificativo: string; nomeCliente: string | null };
}

interface Stats {
  totaleCommesse: number;
  costiCommesse: number;
  avanzamento: string;
}

interface Filters {
  stato?: string;
  responsabile?: string;
  anno?: string;
  citta?: string;
  search?: string;
}

interface DashboardViewProps {
  isLoading?: boolean;
  commesse: Commessa[];
  stats: Stats;
  pendingDocs: PendingDoc[];
  onOpenDetail: (id: string, tab?: 'sintesi' | 'documenti' | 'fornitori') => void;
  onPreviewDoc: (doc: { id: string; nomeFile: string }) => void;
  onCreateCommessa: () => void;
  onDeleteFromHome: (c: Commessa) => void;
  onUpdatePendingDocStato: (docId: string, stato: string) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
  pmFolders: string[];
  onFilterChange: (filters: Filters) => void;
}

const SIGLA_PROVINCIA: Record<string, string> = {
  'Agrigento': 'AG', 'Alessandria': 'AL', 'Ancona': 'AN', 'Aosta': 'AO', 'Arezzo': 'AR',
  'Ascoli Piceno': 'AP', 'Asti': 'AT', 'Avellino': 'AV', 'Bari': 'BA', 'Barletta-Andria-Trani': 'BT',
  'Belluno': 'BL', 'Benevento': 'BN', 'Bergamo': 'BG', 'Biella': 'BI', 'Bologna': 'BO',
  'Bolzano': 'BZ', 'Brescia': 'BS', 'Brindisi': 'BR', 'Cagliari': 'CA', 'Caltanissetta': 'CL',
  'Campobasso': 'CB', 'Caserta': 'CE', 'Catania': 'CT', 'Catanzaro': 'CZ', 'Chieti': 'CH',
  'Como': 'CO', 'Cosenza': 'CS', 'Cremona': 'CR', 'Crotone': 'KR', 'Cuneo': 'CN',
  'Enna': 'EN', 'Fermo': 'FM', 'Ferrara': 'FE', 'Firenze': 'FI', 'Foggia': 'FG',
  'Forlì-Cesena': 'FC', 'Frosinone': 'FR', 'Genova': 'GE', 'Gorizia': 'GO', 'Grosseto': 'GR',
  'Imperia': 'IM', 'Isernia': 'IS', 'L\'Aquila': 'AQ', 'La Spezia': 'SP', 'Latina': 'LT',
  'Lecce': 'LE', 'Lecco': 'LC', 'Livorno': 'LI', 'Lodi': 'LO', 'Lucca': 'LU',
  'Macerata': 'MC', 'Mantova': 'MN', 'Massa-Carrara': 'MS', 'Matera': 'MT', 'Messina': 'ME',
  'Milano': 'MI', 'Modena': 'MO', 'Monza e Brianza': 'MB', 'Napoli': 'NA', 'Novara': 'NO',
  'Nuoro': 'NU', 'Oristano': 'OR', 'Padova': 'PD', 'Palermo': 'PA', 'Parma': 'PR',
  'Pavia': 'PV', 'Perugia': 'PG', 'Pesaro e Urbino': 'PU', 'Pescara': 'PE', 'Piacenza': 'PC',
  'Pisa': 'PI', 'Pistoia': 'PT', 'Pordenone': 'PN', 'Potenza': 'PZ', 'Prato': 'PO',
  'Ragusa': 'RG', 'Ravenna': 'RA', 'Reggio Calabria': 'RC', 'Reggio Emilia': 'RE', 'Rieti': 'RI',
  'Rimini': 'RN', 'Roma': 'RM', 'Rovigo': 'RO', 'Salerno': 'SA', 'Sassari': 'SS',
  'Savona': 'SV', 'Siena': 'SI', 'Siracusa': 'SR', 'Sondrio': 'SO', 'Sud Sardegna': 'SU',
  'Taranto': 'TA', 'Teramo': 'TE', 'Terni': 'TR', 'Torino': 'TO', 'Trapani': 'TP',
  'Trento': 'TN', 'Treviso': 'TV', 'Trieste': 'TS', 'Udine': 'UD', 'Varese': 'VA',
  'Venezia': 'VE', 'Verbano-Cusio-Ossola': 'VB', 'Vercelli': 'VC', 'Verona': 'VR',
  'Vibo Valentia': 'VV', 'Vicenza': 'VI', 'Viterbo': 'VT',
};
function abbreviaCitta(citta: string): string {
  const sigla = SIGLA_PROVINCIA[citta];
  return sigla || citta;
}

type StatoDisplay = 'Preventivo' | 'Approvata' | 'In corso' | 'Finita' | 'Chiusa';

function computeStatoDisplay(c: Commessa): StatoDisplay {
  if (c.stato === 'CHIUSO') return 'Chiusa';
  // Finita: somma fatture attive >= budget
  const totFattureAttive = (c.fatture || [])
    .filter(f => f.tipoDocumento === 'FATTURA_ATTIVA')
    .reduce((sum, f) => sum + Number(f.importoImponibile || 0), 0);
  if (totFattureAttive > 0 && totFattureAttive >= Number(c.importoContratto || 0)) return 'Finita';
  // In corso: data inizio impostata
  if (c.dataInizio) return 'In corso';
  // Approvata: commessa aggiudicata
  if (c.stato === 'AGGIUDICATO') return 'Approvata';
  return 'Preventivo';
}

function formatLocation(indirizzo: string | null | undefined, citta: string | null | undefined): string {
  if (indirizzo) {
    const suffisso = citta ? ` (${abbreviaCitta(citta)})` : '';
    return `${indirizzo}${suffisso}`;
  }
  if (citta) return abbreviaCitta(citta);
  return 'N/D';
}

const STATO_STYLE: Record<StatoDisplay, string> = {
  'Preventivo': 'bg-[#0054B4] text-white border-[#0054B4]',
  'Approvata': 'bg-amber-50 text-amber-600 border-amber-200',
  'In corso': 'bg-[#DFFF00] text-[#800020] border-[#DFFF00]',
  'Finita': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Chiusa': 'bg-stone-200 text-stone-600 border-stone-300',
};

export function DashboardView({ isLoading, commesse, stats, pendingDocs, onOpenDetail, onPreviewDoc, onCreateCommessa, onDeleteFromHome, onUpdatePendingDocStato, page, totalPages, total, onPageChange, pmFolders, onFilterChange }: Readonly<DashboardViewProps>) {
  const [searchInput, setSearchInput] = useState('');
  const [filterStato, setFilterStato] = useState('');
  const [filterPm, setFilterPm] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilterChange({ search: val || undefined, stato: filterStato || undefined, responsabile: filterPm || undefined });
    }, 300);
  };

  const handleFilterStato = (val: string) => {
    setFilterStato(val);
    onFilterChange({ search: searchInput || undefined, stato: val || undefined, responsabile: filterPm || undefined });
  };

  // Cleanup debounce on unmount
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  let commesseGrid: React.ReactNode;
  if (isLoading) {
    commesseGrid = [1, 2, 3, 4, 5].map(i => <CommessaCardSkeleton key={i} />);
  } else if (commesse.length === 0) {
    commesseGrid = (
      <div className="p-20 border border-dashed border-stone-300 rounded-3xl text-center text-stone-300 italic text-sm">
        Nessuna commessa rilevata.
      </div>
    );
  } else {
    commesseGrid = commesse.map(c => (
      <button
        key={c.id}
        type="button"
        onClick={() => onOpenDetail(c.id)}
        className="bg-white p-6 rounded-2xl border border-stone-400 shadow-xl shadow-stone-400/50 hover:border-[#0054B4]/30 hover:shadow-2xl transition-all duration-500 group cursor-pointer w-full text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 bg-[#FBFBFB] rounded-xl flex items-center justify-center text-[#0054B4] group-hover:bg-[#0054B4] group-hover:text-white transition-all duration-500 shadow-sm border border-stone-100">
              <Briefcase size={20} strokeWidth={2} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-lg text-[#003A7D] tracking-tight">
              <span className="font-bold uppercase group-hover:text-[#0054B4] transition-colors">
                {c.codiceIdentificativo}
              </span>
              <span>&bull;</span>
              <span className="font-semibold text-stone-600">{c.tipoOpera || 'Tipologia non definita'}</span>
              <span>&bull;</span>
              <span className="font-semibold text-stone-600">Cliente: {c.committente || 'Non specificato'}</span>
              <span>&bull;</span>
              <span className="font-semibold text-stone-600 flex items-center gap-1">
                <MapPin size={12} />
                {formatLocation(c.indirizzo, c.citta)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div className="flex flex-col items-end justify-center leading-none whitespace-nowrap">
              <p className="text-[8px] font-black text-[#0054B4] uppercase tracking-widest opacity-40 whitespace-nowrap">Importo Lavori</p>
              <p className="text-xl font-semibold text-[#003A7D] leading-none mt-1 flex items-baseline gap-1">
                <span className="text-sm font-bold">€</span>
                <span>{Number(c.importoContratto).toLocaleString('it-IT')}</span>
              </p>
              <span className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${STATO_STYLE[computeStatoDisplay(c)]}`}>
                {computeStatoDisplay(c)}
              </span>
            </div>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onDeleteFromHome(c);
              }}
              className="p-2 rounded-lg border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
              aria-label="Elimina commessa"
            >
              <Trash2 size={16} strokeWidth={2} />
            </button>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-400 group-hover:text-[#0054B4] group-hover:border-[#0054B4]/40 group-hover:bg-blue-50 transition-all shrink-0">
              <ChevronRight size={16} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </button>
    ));
  }

  return (
    <>
      <header className="flex justify-between items-start mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-6 bg-[#0054B4]/40"></span>
            <p className="font-bold tracking-[0.4em] text-[9px] uppercase text-[#0054B4]">Dashboard Direzionale</p>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-[#003A7D]">Situazione Generale</h1>
        </div>
        <button
          onClick={onCreateCommessa}
          className="group flex items-center gap-3 bg-[#003A7D] text-white px-6 py-3 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#0054B4] transition-all shadow-sm"
        >
          <Plus size={14} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-500" />
          Crea Commessa
        </button>
      </header>

      <div className="grid grid-cols-3 gap-8 mb-16">
        {[
          { label: 'Totale commesse', value: `€ ${stats.totaleCommesse.toLocaleString('it-IT')}` },
          { label: 'Costi commesse', value: `€ ${stats.costiCommesse.toLocaleString('it-IT')}` },
          { label: 'Avanzamento cantieri', value: `${stats.avanzamento}%` }
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-2xl border border-stone-400 shadow-xl shadow-stone-400/50">
            <span className="text-[8px] font-black text-[#0054B4] uppercase tracking-[0.3em] opacity-80">{s.label}</span>
            <p className="text-2xl font-bold text-[#003A7D] mt-3 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Layout a 2 colonne: Commesse + Pending ── */}
      <div className={`grid gap-8 ${pendingDocs.length > 0 ? 'grid-cols-[1fr_340px]' : 'grid-cols-1'}`}>
        {/* Colonna sinistra: Situazione Operativa */}
        <section className="space-y-6 min-w-0">
          <div className="flex items-center gap-4 px-2">
            <h2 className="text-[10px] font-black text-[#003A7D] uppercase tracking-[0.2em]">Situazione Operativa</h2>
            <div className="h-[1px] flex-1 bg-stone-200/60"></div>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchInput}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Cerca commessa, cliente, indirizzo…"
                className="w-full pl-8 pr-8 py-2 text-[11px] rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-[#0054B4]/50 placeholder-stone-300"
              />
              {searchInput && (
                <button onClick={() => handleSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500">
                  <X size={12} />
                </button>
              )}
            </div>
            <select
              value={filterStato}
              onChange={e => handleFilterStato(e.target.value)}
              className="py-2 px-3 text-[11px] rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-[#0054B4]/50 text-stone-600"
            >
              <option value="">Tutti gli stati</option>
              <option value="IN_PREVENTIVAZIONE">Preventivo</option>
              <option value="IN_CORSO">In corso</option>
              <option value="SOSPESO">Sospeso</option>
              <option value="CHIUSO">Chiusa</option>
            </select>
            {pmFolders.length > 0 && (
              <select
                value={filterPm}
                onChange={e => { setFilterPm(e.target.value); onFilterChange({ search: searchInput || undefined, stato: filterStato || undefined, responsabile: e.target.value || undefined }); }}
                className="py-2 px-3 text-[11px] rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-[#0054B4]/50 text-stone-600"
              >
                <option value="">Tutti i PM</option>
                {pmFolders.map(pm => <option key={pm} value={pm}>{pm}</option>)}
              </select>
            )}
          </div>
          <div className="grid gap-4">
            {commesseGrid}
          </div>

          {/* Paginazione */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 px-2">
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                {total} commesse &bull; Pagina {page} di {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 hover:text-[#0054B4] hover:border-[#0054B4]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={14} strokeWidth={2.5} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === 'number' && p - arr[idx - 1] > 1) {
                      acc.push('...');
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i, arr) =>
                    p === '...' ? (
                      <span key={`ellipsis-${arr[i - 1] ?? 0}-${arr[i + 1] ?? totalPages}`} className="text-[10px] text-stone-400 px-1">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-bold transition-all border ${
                          p === page
                            ? 'bg-[#003A7D] text-white border-[#003A7D]'
                            : 'bg-white text-stone-500 border-stone-200 hover:text-[#0054B4] hover:border-[#0054B4]/40'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 hover:text-[#0054B4] hover:border-[#0054B4]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Colonna destra: Documenti Pending */}
        {pendingDocs.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <AlertCircle size={14} className="text-amber-500" />
              <h2 className="text-[10px] font-black text-[#003A7D] uppercase tracking-[0.2em]">Documenti Pending</h2>
              <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2.5 py-0.5 rounded-full">{pendingDocs.length}</span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-400 shadow-xl shadow-stone-400/50 overflow-hidden divide-y divide-stone-100 sticky top-8">
              {pendingDocs.map(doc => {
                const meta = doc.datiEstrattiJson;
                const tipo = (meta?.tipoDocumento as string) || doc.categoria || '';
                const stato = (meta?.stato as string) || '';
                const fornitore = (meta?.ragioneSociale as string) || (meta?.nomeCliente as string) || '';

                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50/40 transition-colors group"
                  >
                    <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={12} className="text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-[#003A7D] truncate">{tipo || doc.nomeFile}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {doc.commessa && (
                          <span className="text-[8px] font-bold text-[#0054B4] uppercase tracking-wider">
                            {doc.commessa.codiceIdentificativo}
                          </span>
                        )}
                        {fornitore && (
                          <>
                            <span className="text-stone-300 text-[8px]">&bull;</span>
                            <span className="text-[8px] text-stone-400 truncate">{fornitore}</span>
                          </>
                        )}
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
                        {stato || 'Da elaborare'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePendingDocStato(doc.id, 'Approvato');
                      }}
                      className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                      title="Approva"
                    >
                      Approva
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePendingDocStato(doc.id, 'Rifiutato');
                      }}
                      className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title="Rifiuta"
                    >
                      Rifiuta
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewDoc({ id: doc.id, nomeFile: doc.nomeFile });
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-400 hover:text-[#0054B4] hover:border-[#0054B4]/40 hover:bg-blue-50 transition-all shrink-0"
                      title="Apri anteprima"
                    >
                      <FileText size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (doc.commessa) onOpenDetail(doc.commessa.id, 'fornitori');
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-400 hover:text-[#0054B4] hover:border-[#0054B4]/40 hover:bg-blue-50 transition-all shrink-0"
                      title="Vai alla commessa"
                    >
                      <ChevronRight size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
