'use client';
import { Activity, Calendar, CheckCircle2, ChevronRight, Layers, Plus, Target, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Commessa, Fattura } from '../types/domain';
import { EuroAmountInput } from './EuroAmountInput';
import type { ColumnMapping } from './ExcelColumnPickerModal';
import { ExcelColumnPickerModal } from './ExcelColumnPickerModal';

interface AppaltoRow {
  id: string;
  parentId?: string | null;
  societaId: string;
  descrizione: string;
  unitaMisura: string;
  quantita: string;
  prezzoUnitario: string;
  avanzamentoPercent: string;
  costoPrevisto: string;
  costoEffettivo: string;
  ricavoPrevisto: string;
  ricavoEffettivo: string;
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
  societaOptions: { id: string; nome: string }[];
  onAddRow: () => void;
  onAddChildRow: (parentId: string) => void;
  onUpdateRow: (rowId: string, field: keyof AppaltoRow, value: string) => void;
  onRemoveRow: (rowId: string) => void;
  onRemoveRows: (ids: string[]) => void;
  onClearRows: () => void;
  onToggleRow: (rowId: string) => void;
  onSave: () => void;
  onUpdateDataInizioLavori: (date: string | null) => void;
  onUpdateImportoLavori: (importo: number) => void;
  onImportExcel: (file: File) => void;
  pendingExcelData: { headers: string[]; initialMapping: ColumnMapping } | null;
  onConfirmExcelMapping: (mapping: ColumnMapping) => void;
  onCancelExcelMapping: () => void;
}

export function TabSintesi({
  selectedCommessa,
  appaltoRowsFlat,
  isSavingAppalto,
  societaOptions,
  onAddRow,
  onAddChildRow,
  onUpdateRow,
  onRemoveRow,
  onRemoveRows,
  onClearRows,
  onToggleRow,
  onSave,
  onUpdateDataInizioLavori,
  onUpdateImportoLavori,
  onImportExcel,
  pendingExcelData,
  onConfirmExcelMapping,
  onCancelExcelMapping,
}: Readonly<TabSintesiProps>) {
  const [dataInizioLocal, setDataInizioLocal] = useState(
    selectedCommessa.dataInizio ? selectedCommessa.dataInizio.slice(0, 10) : ''
  );
  const [importoLavoriLocal, setImportoLavoriLocal] = useState(
    String(Number(selectedCommessa.importoContratto || 0))
  );

  useEffect(() => {
    setDataInizioLocal(selectedCommessa.dataInizio ? selectedCommessa.dataInizio.slice(0, 10) : '');
    setImportoLavoriLocal(String(Number(selectedCommessa.importoContratto || 0)));
  }, [selectedCommessa.id, selectedCommessa.dataInizio, selectedCommessa.importoContratto]);

  const isDataInizioDirty = dataInizioLocal !== (selectedCommessa.dataInizio ? selectedCommessa.dataInizio.slice(0, 10) : '');
  const currentImportoLavori = Number(selectedCommessa.importoContratto || 0);
  const parsedImportoLavori = Number.parseFloat(importoLavoriLocal.replace(',', '.'));
  const isImportoValido = Number.isFinite(parsedImportoLavori) && parsedImportoLavori >= 0;
  const isImportoDirty = isImportoValido && Math.abs(parsedImportoLavori - currentImportoLavori) > 0.0001;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allIds = appaltoRowsFlat.map((r) => r.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
  const someSelected = selectedIds.size > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(allIds));
  };

  const handleDeleteSelected = () => {
    onRemoveRows([...selectedIds]);
    setSelectedIds(new Set());
  };

  const handleDeleteAll = () => {
    onClearRows();
    setSelectedIds(new Set());
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
      {pendingExcelData && (
        <ExcelColumnPickerModal
          headers={pendingExcelData.headers}
          initialMapping={pendingExcelData.initialMapping}
          onConfirm={onConfirmExcelMapping}
          onCancel={onCancelExcelMapping}
        />
      )}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Costi effettivi', value: `€ ${(selectedCommessa.fatture?.reduce((sum: number, f: Fattura) => sum + Number(f.importoImponibile || 0), 0) || 0).toLocaleString('it-IT')}`, color: 'bg-[#4B6E48] text-white', icon: Activity },
          { label: 'Importo lavori', value: `€ ${Number(selectedCommessa.importoContratto).toLocaleString('it-IT')}`, color: 'bg-gray-100 text-[#4B6E48]', icon: Target },
          { label: 'Attività WBS', value: selectedCommessa.attivita?.length || 0, color: 'bg-gray-100 text-[#4B6E48]', icon: Layers },
          { label: 'Avanzamento', value: `${selectedCommessa.sal?.[0]?.percentualeCompletamento || 0}%`, color: 'bg-gray-100 text-green-600', icon: CheckCircle2 }
        ].map((box) => (
          <div key={box.label} className={`p-6 rounded-2xl ${box.color} ${box.color.includes('bg-gray-100') ? 'border border-slate-500 shadow-sm' : 'shadow-lg shadow-blue-900/10'}`}>
            <div className="flex justify-between items-start mb-4 text-[8px] font-black uppercase tracking-widest opacity-60">
              <span>{box.label}</span>
              <box.icon size={14} strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-bold tracking-tight">{box.value}</p>
          </div>
        ))}
      </div>

      {/* Data Inizio Lavori */}
      <div className="bg-gray-100 border border-slate-300 rounded-2xl p-5 shadow-xl shadow-slate-300/50 flex items-center gap-4">
        <Calendar size={16} className="text-[#4B6E48] shrink-0" />
        <label htmlFor="data-inizio-lavori" className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest whitespace-nowrap">Data Inizio Lavori</label>
        <input
          id="data-inizio-lavori"
          type="date"
          value={dataInizioLocal}
          onChange={(e) => setDataInizioLocal(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-[#4B6E48] focus:outline-none focus:ring-2 focus:ring-[#4B6E48]/30 focus:border-[#4B6E48]"
        />
        {dataInizioLocal && isDataInizioDirty && (
          <button
            onClick={() => {
              onUpdateDataInizioLavori(dataInizioLocal);
            }}
            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white bg-[#4B6E48] rounded-lg hover:bg-[#4B6E48] transition-colors"
          >
            Conferma inizio lavori
          </button>
        )}
        {selectedCommessa.dataInizio && !isDataInizioDirty && (
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 size={12} /> Confermata
          </span>
        )}
        {selectedCommessa.dataInizio && (
          <button
            onClick={() => { onUpdateDataInizioLavori(null); setDataInizioLocal(''); }}
            className="text-[9px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest"
          >
            Rimuovi
          </button>
        )}
      </div>

      {/* Importo Lavori */}
      <div className="bg-gray-100 border border-slate-300 rounded-2xl p-5 shadow-xl shadow-slate-300/50 flex items-center gap-4 flex-wrap">
        <Target size={16} className="text-[#4B6E48] shrink-0" />
        <label htmlFor="importo-lavori" className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest whitespace-nowrap">Importo Lavori (€)</label>
        <EuroAmountInput
          id="importo-lavori"
          min="0"
          value={importoLavoriLocal}
          onValueChange={(nextValue) => setImportoLavoriLocal(nextValue)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-[#4B6E48] focus:outline-none focus:ring-2 focus:ring-[#4B6E48]/30 focus:border-[#4B6E48]"
        />
        {isImportoDirty && (
          <button
            onClick={() => {
              const normalized = Math.round(parsedImportoLavori * 100) / 100;
              onUpdateImportoLavori(normalized);
            }}
            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white bg-[#4B6E48] rounded-lg hover:bg-[#4B6E48] transition-colors"
          >
            Conferma importo
          </button>
        )}
        {isImportoDirty && (
          <button
            onClick={() => setImportoLavoriLocal(String(currentImportoLavori))}
            className="text-[9px] font-bold text-gray-600 hover:text-gray-800 uppercase tracking-widest"
          >
            Annulla
          </button>
        )}
        {!isImportoValido && importoLavoriLocal.trim().length > 0 && (
          <span className="text-[10px] font-bold text-red-600">Importo non valido</span>
        )}
      </div>

      <div className="bg-gray-100 border border-slate-300 rounded-2xl p-6 shadow-xl shadow-slate-300/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-[#4B6E48] uppercase tracking-widest">Voci in Appalto</h3>
            <p className="text-xs text-gray-600">{selectedCommessa.codiceIdentificativo} — {selectedCommessa.nomeCantiere}</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <button
              onClick={onAddRow}
              className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest hover:underline"
            >
              Aggiungi Riga
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest hover:underline"
            >
              Importa Excel
            </button>
            {someSelected && (
              <button
                onClick={handleDeleteSelected}
                className="text-[9px] font-black text-red-600 uppercase tracking-widest hover:underline"
              >
                Elimina selezionate ({selectedIds.size})
              </button>
            )}
            {appaltoRowsFlat.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:underline"
              >
                Elimina tutto
              </button>
            )}
            <button
              onClick={onSave}
              disabled={isSavingAppalto}
              className="text-[9px] font-black text-white uppercase tracking-widest bg-[#4B6E48] hover:bg-[#4B6E48] px-4 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              {isSavingAppalto ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) onImportExcel(file);
            event.currentTarget.value = '';
          }}
        />

        <div className="rounded-2xl border border-gray-300 bg-gray-100/60">
          <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
            <div className="hidden lg:grid grid-cols-[24px_2.5fr_0.5fr_0.5fr_0.7fr_0.7fr_0.5fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr_56px] gap-2 px-2 py-2 text-[9px] font-black uppercase tracking-widest text-gray-600 sticky top-0 z-10 bg-gray-100/95 backdrop-blur border-b border-stone-100">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-[#4B6E48] cursor-pointer"
                aria-label="Seleziona tutte le righe"
              />
              <span>DESCRIZIONE</span>
              <span>u.m</span>
              <span>Q.ta</span>
              <span>P.Unit</span>
              <span>TOTALE</span>
              <span>AVZ %</span>
              <span>AVZ. €</span>
              <span>C.PREV</span>
              <span>C.EFF</span>
              <span>R.PREV</span>
              <span>R.EFF</span>
              <span></span>
            </div>

            <div className="space-y-2 p-2">
              {appaltoRowsFlat.length === 0 ? (
                <div className="p-8 border border-dashed border-gray-300 rounded-2xl text-center text-gray-600 text-sm">
                  Nessuna voce inserita.
                </div>
              ) : (
                appaltoRowsFlat.map((row) => {
                  const isAggregated = row.hasChildren;

                  return (
                    <div key={row.id} className={`grid gap-2 lg:grid-cols-[24px_2.5fr_0.5fr_0.5fr_0.7fr_0.7fr_0.5fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr_56px] items-center border rounded-xl p-2 ${selectedIds.has(row.id) ? 'border-red-300 bg-red-50/40' : 'border-stone-100'}`}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleSelect(row.id)}
                        className="w-4 h-4 accent-[#4B6E48] cursor-pointer"
                        aria-label="Seleziona riga"
                      />
                      <div className="flex items-center gap-1" style={{ paddingLeft: row.level ? `${row.level * 12}px` : undefined }}>
                        {row.hasChildren ? (
                          <button
                            onClick={() => onToggleRow(row.id)}
                            className="w-5 h-5 rounded-md border border-gray-300 text-gray-600 hover:text-[#4B6E48] hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-center"
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
                        <span className="text-[10px] font-black text-gray-600 min-w-[28px]">{row.wbsCode}</span>
                        <input
                          type="text"
                          className="w-full bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-[13px] text-[#4B6E48] font-semibold outline-none focus:border-[#4B6E48]"
                          placeholder="Descrizione lavorazione"
                          value={row.descrizione}
                          title={row.descrizione}
                          onChange={(e) => onUpdateRow(row.id, 'descrizione', e.target.value)}
                        />
                        <select
                          className="ml-2 bg-gray-100 border border-gray-300 rounded-lg px-2 py-1.5 text-[11px] text-[#4B6E48] font-semibold outline-none focus:border-[#4B6E48]"
                          value={row.societaId}
                          onChange={(e) => onUpdateRow(row.id, 'societaId', e.target.value)}
                          title="Societa"
                        >
                          <option value="">Societa...</option>
                          {societaOptions.map((s) => (
                            <option key={s.id} value={s.id}>{s.nome}</option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-[13px] text-[#4B6E48] font-semibold outline-none focus:border-[#4B6E48]"
                        placeholder="u.m"
                        value={row.unitaMisura}
                        onChange={(e) => onUpdateRow(row.id, 'unitaMisura', e.target.value)}
                      />
                      <input
                        type="number"
                        step="0.01"
                        disabled={isAggregated}
                        className={`w-full border rounded-lg px-2.5 py-1.5 text-[13px] font-semibold outline-none ${isAggregated ? 'bg-slate-600/50 text-gray-600 border-gray-300' : 'bg-gray-100 text-[#4B6E48] border-gray-300 focus:border-[#4B6E48]'}`}
                        placeholder="0"
                        value={row.quantita}
                        onChange={(e) => onUpdateRow(row.id, 'quantita', e.target.value)}
                      />
                      <EuroAmountInput
                        disabled={isAggregated}
                        className={`w-full border rounded-lg px-2.5 py-1.5 text-[13px] font-semibold outline-none ${isAggregated ? 'bg-slate-600/50 text-gray-600 border-gray-300' : 'bg-gray-100 text-[#4B6E48] border-gray-300 focus:border-[#4B6E48]'}`}
                        placeholder="0,00"
                        value={row.prezzoUnitario}
                        onValueChange={(nextValue) => onUpdateRow(row.id, 'prezzoUnitario', nextValue)}
                      />
                      <div className="text-[13px] font-bold text-[#4B6E48]">
                        € {row.total.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        disabled={isAggregated}
                        className={`w-full border rounded-lg px-2.5 py-1.5 text-[13px] font-semibold outline-none ${isAggregated ? 'bg-slate-600/50 text-gray-600 border-gray-300' : 'bg-gray-100 text-[#4B6E48] border-gray-300 focus:border-[#4B6E48]'}`}
                        placeholder="0"
                        value={isAggregated ? row.avzPercent.toFixed(2) : row.avanzamentoPercent}
                        onChange={(e) => onUpdateRow(row.id, 'avanzamentoPercent', e.target.value)}
                      />
                      <div className="text-[13px] font-bold text-[#4B6E48]">
                        € {row.avzEuro.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <EuroAmountInput
                        disabled={isAggregated}
                        className={`w-full border rounded-lg px-2 py-1.5 text-[12px] font-semibold outline-none ${isAggregated ? 'bg-slate-600/50 text-gray-600 border-gray-300' : 'bg-gray-100 text-[#4B6E48] border-gray-300 focus:border-[#4B6E48]'}`}
                        placeholder="0,00"
                        value={row.costoPrevisto}
                        onValueChange={(nextValue) => onUpdateRow(row.id, 'costoPrevisto', nextValue)}
                      />
                      <EuroAmountInput
                        disabled={isAggregated}
                        className={`w-full border rounded-lg px-2 py-1.5 text-[12px] font-semibold outline-none ${isAggregated ? 'bg-slate-600/50 text-gray-600 border-gray-300' : 'bg-gray-100 text-[#4B6E48] border-gray-300 focus:border-[#4B6E48]'}`}
                        placeholder="auto"
                        value={row.costoEffettivo || (row.costoPrevisto && row.avanzamentoPercent ? String(Math.round((Number(row.costoPrevisto) * Number(row.avanzamentoPercent)) / 100 * 100) / 100) : '')}
                        onValueChange={(nextValue) => onUpdateRow(row.id, 'costoEffettivo', nextValue)}
                      />
                      <EuroAmountInput
                        disabled={isAggregated}
                        className={`w-full border rounded-lg px-2 py-1.5 text-[12px] font-semibold outline-none ${isAggregated ? 'bg-slate-600/50 text-gray-600 border-gray-300' : 'bg-gray-100 text-[#4B6E48] border-gray-300 focus:border-[#4B6E48]'}`}
                        placeholder="0,00"
                        value={row.ricavoPrevisto}
                        onValueChange={(nextValue) => onUpdateRow(row.id, 'ricavoPrevisto', nextValue)}
                      />
                      <EuroAmountInput
                        disabled={isAggregated}
                        className={`w-full border rounded-lg px-2 py-1.5 text-[12px] font-semibold outline-none ${isAggregated ? 'bg-slate-600/50 text-gray-600 border-gray-300' : 'bg-gray-100 text-[#4B6E48] border-gray-300 focus:border-[#4B6E48]'}`}
                        placeholder="auto"
                        value={row.ricavoEffettivo || (row.ricavoPrevisto && row.avanzamentoPercent ? String(Math.round((Number(row.ricavoPrevisto) * Number(row.avanzamentoPercent)) / 100 * 100) / 100) : '')}
                        onValueChange={(nextValue) => onUpdateRow(row.id, 'ricavoEffettivo', nextValue)}
                      />
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onAddChildRow(row.id)}
                          className="w-7 h-7 rounded-lg border border-gray-300 text-gray-600 hover:text-[#4B6E48] hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-center"
                          aria-label="Aggiungi sotto-attivita"
                        >
                          <Plus size={14} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => onRemoveRow(row.id)}
                          className="w-7 h-7 rounded-lg border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center"
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
