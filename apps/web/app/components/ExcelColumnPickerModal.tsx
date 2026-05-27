'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

export type MappableField =
  | 'skip'
  | 'descrizione'
  | 'unitaMisura'
  | 'quantita'
  | 'prezzoUnitario'
  | 'totale'
  | 'costoPrevisto'
  | 'ricavoPrevisto';

export const FIELD_LABELS: Record<MappableField, string> = {
  skip: '— Non importare —',
  descrizione: 'Descrizione',
  unitaMisura: 'U.M.',
  quantita: 'Quantità',
  prezzoUnitario: 'Prezzo Unitario',
  totale: 'Totale',
  costoPrevisto: 'Costo Previsto',
  ricavoPrevisto: 'Ricavo Previsto',
};

const ALL_FIELDS: MappableField[] = ['skip', 'descrizione', 'unitaMisura', 'quantita', 'prezzoUnitario', 'totale', 'costoPrevisto', 'ricavoPrevisto'];

export type ColumnMapping = Record<number, MappableField>;

interface Props {
  headers: string[];
  initialMapping: ColumnMapping;
  onConfirm: (mapping: ColumnMapping) => void;
  onCancel: () => void;
}

export function ExcelColumnPickerModal({ headers, initialMapping, onConfirm, onCancel }: Props) {
  const [mapping, setMapping] = useState<ColumnMapping>(() => {
    const init: ColumnMapping = {};
    headers.forEach((_, idx) => {
      init[idx] = initialMapping[idx] ?? 'skip';
    });
    return init;
  });

  const setField = (idx: number, field: MappableField) => {
    setMapping((prev) => ({ ...prev, [idx]: field }));
  };

  const hasDescrizione = Object.values(mapping).includes('descrizione');
  const importCount = Object.values(mapping).filter((v) => v !== 'skip').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-sm font-black text-[#4B6E48] uppercase tracking-widest">Seleziona Colonne da Importare</h2>
            <p className="text-xs text-gray-500 mt-1">Per ogni colonna Excel, scegli a quale campo corrisponde (o &quot;Non importare&quot; per saltarla)</p>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-2">
          <div className="grid grid-cols-[32px_1fr_200px] gap-3 px-2 pb-2 border-b border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400">
            <span>#</span>
            <span>Intestazione nel file Excel</span>
            <span>Importa come campo</span>
          </div>
          {headers.map((header, idx) => {
            const currentField = mapping[idx] ?? 'skip';
            const isImported = currentField !== 'skip';
            return (
              <div key={idx} className={`grid grid-cols-[32px_1fr_200px] gap-3 items-center px-2 py-2 rounded-lg ${isImported ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                <span className="text-[11px] font-semibold text-gray-400 text-right">{idx + 1}</span>
                <span className="text-[12px] text-gray-800 font-medium truncate" title={header}>{header || '(vuoto)'}</span>
                <select
                  value={currentField}
                  onChange={(e) => setField(idx, e.target.value as MappableField)}
                  className={`border rounded-lg px-2 py-1 text-[11px] font-semibold outline-none w-full ${isImported ? 'border-green-400 text-green-700 bg-white' : 'border-gray-300 text-gray-400 bg-white'}`}
                >
                  {ALL_FIELDS.map((f) => (
                    <option key={f} value={f}>{FIELD_LABELS[f]}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-[11px] text-gray-500">{importCount} colonne selezionate</span>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annulla
            </button>
            <button
              onClick={() => onConfirm(mapping)}
              disabled={!hasDescrizione}
              className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-[#4B6E48] rounded-lg disabled:opacity-40 hover:opacity-90"
            >
              {hasDescrizione ? `Importa (${importCount} campi)` : 'Seleziona almeno Descrizione'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
