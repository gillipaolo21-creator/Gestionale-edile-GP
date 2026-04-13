'use client';
import { Activity, Calendar, CheckCircle2, ChevronRight, Layers, Plus, Target, Trash2 } from 'lucide-react';
import type { Commessa, Fattura } from '../types/domain';

interface AppaltoRow {
  id: string;
  parentId?: string | null;
  descrizione: string;
  unitaMisura: string;
  quantita: string;
  prezzoUnitario: string;
  avanzamentoPercent: string;
}

type AppaltoRowFlat = AppaltoRow & {
  level: number;
  wbsCode: string;
  total: number;
  avzEuro: number;
  avzPercent: number;
  hasChildren: boolean;
  isCollapsed: boolean;
};

interface TabSintesiProps {
  selectedCommessa: Commessa;
  appaltoRowsFlat: AppaltoRowFlat[];
  isSavingAppalto: boolean;
  onAddRow: () => void;
  onAddChildRow: (parentId: string) => void;
  onUpdateRow: (rowId: string, field: keyof AppaltoRow, value: string) => void;
  onRemoveRow: (rowId: string) => void;
  onToggleRow: (rowId: string) => void;
  onSave: () => void;
  onUpdateDataInizioLavori: (date: string | null) => void;
}

export function TabSintesi({
  selectedCommessa,
  appaltoRowsFlat,
  isSavingAppalto,
  onAddRow,
  onAddChildRow,
  onUpdateRow,
  onRemoveRow,
  onToggleRow,
  onSave,
  onUpdateDataInizioLavori,
}: TabSintesiProps) {
  const [dataInizioLocal, setDataInizioLocal] = useState(
    selectedCommessa.dataInizioLavori ? selectedCommessa.dataInizioLavori.slice(0, 10) : ''
  );
  const isDirty = dataInizioLocal !== (selectedCommessa.dataInizioLavori ? selectedCommessa.dataInizioLavori.slice(0, 10) : '');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Costi effettivi', value: `€ ${(selectedCommessa.fatture?.reduce((sum: number, f: Fattura) => sum + Number(f.importoImponibile || 0), 0) || 0).toLocaleString('it-IT')}`, color: 'bg-[#003A7D] text-white', icon: Activity },
          { label: 'Importo lavori', value: `€ ${Number(selectedCommessa.importoCalcolato).toLocaleString('it-IT')}`, color: 'bg-white text-[#003A7D]', icon: Target },
          { label: 'Attività WBS', value: selectedCommessa.attivita?.length || 0, color: 'bg-white text-[#003A7D]', icon: Layers },
          { label: 'Avanzamento', value: `${selectedCommessa.sals?.[0]?.percentualeCompletamento || 0}%`, color: 'bg-white text-green-600', icon: CheckCircle2 }
        ].map((box, i) => (
          <div key={i} className={`p-6 rounded-2xl ${box.color} ${box.color.includes('bg-white') ? 'border border-stone-300 shadow-sm' : 'shadow-lg shadow-blue-900/10'}`}>
            <div className="flex justify-between items-start mb-4 text-[8px] font-black uppercase tracking-widest opacity-60">
              <span>{box.label}</span>
              <box.icon size={14} strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-bold tracking-tight">{box.value}</p>
          </div>
        ))}
      </div>

      {/* Data Inizio Lavori */}
      <div className="bg-white border border-stone-400 rounded-2xl p-5 shadow-xl shadow-stone-400/50 flex items-center gap-4">
        <Calendar size={16} className="text-[#0054B4] shrink-0" />
        <label className="text-[9px] font-black text-[#003A7D] uppercase tracking-widest whitespace-nowrap">Data Inizio Lavori</label>
        <input
          type="date"
          value={dataInizioLocal}
          onChange={(e) => setDataInizioLocal(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-[#003A7D] focus:outline-none focus:ring-2 focus:ring-[#0054B4]/30 focus:border-[#0054B4]"
        />
        {dataInizioLocal && isDirty && (
          <button
            onClick={() => {
              onUpdateDataInizioLavori(dataInizioLocal);
            }}
            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white bg-[#0054B4] rounded-lg hover:bg-[#003A7D] transition-colors"
          >
            Conferma inizio lavori
          </button>
        )}
        {selectedCommessa.dataInizioLavori && !isDirty && (
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 size={12} /> Confermata
          </span>
        )}
        {selectedCommessa.dataInizioLavori && (
          <button
            onClick={() => { onUpdateDataInizioLavori(null); setDataInizioLocal(''); }}
            className="text-[9px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest"
          >
            Rimuovi
          </button>
        )}
      </div>

      <div className="bg-white border border-stone-400 rounded-2xl p-6 shadow-xl shadow-stone-400/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-[#003A7D] uppercase tracking-widest">Voci in Appalto</h3>
            <p className="text-xs text-stone-400">Inserimento manuale delle voci di avanzamento</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onAddRow}
              className="text-[9px] font-black text-[#0054B4] uppercase tracking-widest hover:underline"
            >
              Aggiungi Riga
            </button>
            <button
              onClick={onSave}
              disabled={isSavingAppalto}
              className="text-[9px] font-black text-white uppercase tracking-widest bg-[#003A7D] hover:bg-[#0054B4] px-4 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              {isSavingAppalto ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white/60">
          <div className="max-h-[420px] overflow-y-auto">
            <div className="hidden lg:grid grid-cols-[2.2fr_0.7fr_0.7fr_0.9fr_0.9fr_0.7fr_0.9fr_56px] gap-2 px-2 py-2 text-[9px] font-black uppercase tracking-widest text-stone-400 sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-stone-100">
              <span>DESCRIZIONE</span>
              <span>u.m</span>
              <span>Q.ta</span>
              <span>P.Unit</span>
              <span>TOTALE</span>
              <span>AVZ %</span>
              <span>AVZ. €</span>
              <span></span>
            </div>

            <div className="space-y-2 p-2">
              {appaltoRowsFlat.length === 0 ? (
                <div className="p-8 border border-dashed border-stone-200 rounded-2xl text-center text-stone-400 text-sm">
                  Nessuna voce inserita.
                </div>
              ) : (
                appaltoRowsFlat.map((row) => {
                  const isAggregated = row.hasChildren;

                  return (
                    <div key={row.id} className="grid gap-2 lg:grid-cols-[2.2fr_0.7fr_0.7fr_0.9fr_0.9fr_0.7fr_0.9fr_56px] items-center border border-stone-100 rounded-xl p-2">
                      <div className="flex items-center gap-1" style={{ paddingLeft: row.level ? `${row.level * 12}px` : undefined }}>
                        {row.hasChildren ? (
                          <button
                            onClick={() => onToggleRow(row.id)}
                            className="w-5 h-5 rounded-md border border-stone-200 text-stone-400 hover:text-[#0054B4] hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-center"
                            aria-label={row.isCollapsed ? 'Espandi macro-attivita' : 'Comprimi macro-attivita'}
                          >
                            <ChevronRight
                              size={12}
                              strokeWidth={2.5}
                              className={row.isCollapsed ? '' : 'rotate-90'}
                            />
                          </button>
                        ) : (
                          <span className="w-5 h-5" />
                        )}
                        <span className="text-[10px] font-black text-stone-400 min-w-[28px]">{row.wbsCode}</span>
                        <input
                          type="text"
                          className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-[13px] text-[#003A7D] font-semibold outline-none focus:border-[#0054B4]"
                          placeholder="Descrizione lavorazione"
                          value={row.descrizione}
                          onChange={(e) => onUpdateRow(row.id, 'descrizione', e.target.value)}
                        />
                      </div>
                      <input
                        type="text"
                        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-[13px] text-[#003A7D] font-semibold outline-none focus:border-[#0054B4]"
                        placeholder="u.m"
                        value={row.unitaMisura}
                        onChange={(e) => onUpdateRow(row.id, 'unitaMisura', e.target.value)}
                      />
                      <input
                        type="number"
                        step="0.01"
                        disabled={isAggregated}
                        className={`w-full border rounded-lg px-2.5 py-1.5 text-[13px] font-semibold outline-none ${isAggregated ? 'bg-stone-100 text-stone-400 border-stone-200' : 'bg-white text-[#003A7D] border-stone-200 focus:border-[#0054B4]'}`}
                        placeholder="0"
                        value={row.quantita}
                        onChange={(e) => onUpdateRow(row.id, 'quantita', e.target.value)}
                      />
                      <input
                        type="number"
                        step="0.01"
                        disabled={isAggregated}
                        className={`w-full border rounded-lg px-2.5 py-1.5 text-[13px] font-semibold outline-none ${isAggregated ? 'bg-stone-100 text-stone-400 border-stone-200' : 'bg-white text-[#003A7D] border-stone-200 focus:border-[#0054B4]'}`}
                        placeholder="0,00"
                        value={row.prezzoUnitario}
                        onChange={(e) => onUpdateRow(row.id, 'prezzoUnitario', e.target.value)}
                      />
                      <div className="text-[13px] font-bold text-[#003A7D]">
                        € {row.total.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        disabled={isAggregated}
                        className={`w-full border rounded-lg px-2.5 py-1.5 text-[13px] font-semibold outline-none ${isAggregated ? 'bg-stone-100 text-stone-400 border-stone-200' : 'bg-white text-[#003A7D] border-stone-200 focus:border-[#0054B4]'}`}
                        placeholder="0"
                        value={isAggregated ? row.avzPercent.toFixed(2) : row.avanzamentoPercent}
                        onChange={(e) => onUpdateRow(row.id, 'avanzamentoPercent', e.target.value)}
                      />
                      <div className="text-[13px] font-bold text-[#003A7D]">
                        € {row.avzEuro.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onAddChildRow(row.id)}
                          className="w-7 h-7 rounded-lg border border-stone-200 text-stone-400 hover:text-[#0054B4] hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-center"
                          aria-label="Aggiungi sotto-attivita"
                        >
                          <Plus size={14} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => onRemoveRow(row.id)}
                          className="w-7 h-7 rounded-lg border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center"
                          aria-label="Rimuovi riga"
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
