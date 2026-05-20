'use client';

import { X } from 'lucide-react';
import React from 'react';

export type VarianteVoce = { fornitore: string; descrizione: string; um: string; qty: string; prezzoUnit: string };

interface VarianteModalProps {
  isOpen: boolean;
  form: { nomeCliente: string; dataVariante: string; voci: VarianteVoce[] };
  setForm: React.Dispatch<React.SetStateAction<{ nomeCliente: string; dataVariante: string; voci: VarianteVoce[] }>>;
  baseContratti: { id: string; nomeCliente: string }[];
  editingId: string | null;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isSaving: boolean;
  fornitoriEsistenti: string[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function VarianteModal({
  isOpen, form, setForm, baseContratti, editingId, files, setFiles, isSaving, fornitoriEsistenti, onClose, onSubmit,
}: VarianteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4B6E48]/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-100 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-gray-300">
        <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-[#F2F0EF]">
          <div>
            <h3 className="text-xl font-black text-[#4B6E48] tracking-tighter uppercase">
              {editingId ? 'Modifica Variante' : 'Nuova Variante Contrattuale'}
            </h3>
            <p className="text-[9px] font-bold text-[#4B6E48] uppercase tracking-widest mt-1">
              {form.nomeCliente ? `Contratto: ${form.nomeCliente}` : 'Modifica / Integrazione al Contratto'}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-stone-200 flex items-center justify-center text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          {baseContratti.length > 1 && (
            <div className="space-y-2">
              <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Contratto di riferimento *</label>
              <select
                required
                className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors"
                value={form.nomeCliente}
                onChange={e => setForm({ ...form, nomeCliente: e.target.value })}
              >
                <option value="">— Seleziona contratto —</option>
                {baseContratti.map(bc => <option key={bc.id} value={bc.nomeCliente}>{bc.nomeCliente}</option>)}
              </select>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Data variante *</label>
            <input
              required
              type="date"
              className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors"
              value={form.dataVariante}
              onChange={e => setForm({ ...form, dataVariante: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Voci di variante *</label>
            <div className="border border-gray-300 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] bg-gray-50 border-b border-gray-300">
                {['Fornitore', 'Descrizione', 'U.M.', 'Q.tà', 'P.Unit. €', 'Totale €'].map(h => (
                  <div key={h} className="px-2 py-2 text-[8px] font-black text-gray-600 uppercase tracking-widest">{h}</div>
                ))}
              </div>
              {form.voci.map((voce, i) => {
                const totale = (parseFloat(voce.qty) || 0) * (parseFloat(voce.prezzoUnit) || 0);
                return (
                  <div key={i} className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] border-b border-stone-100 last:border-b-0 items-center">
                    <select
                      className="px-2 py-2 text-xs text-[#4B6E48] bg-transparent outline-none focus:bg-blue-50/50 border-r border-stone-100 w-full"
                      value={voce.fornitore}
                      onChange={e => { const v = [...form.voci]; v[i] = { ...v[i], fornitore: e.target.value }; setForm({ ...form, voci: v }); }}
                    >
                      <option value="">— nessuno —</option>
                      {fornitoriEsistenti.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <input
                      required
                      type="text"
                      placeholder="Descrizione"
                      className="px-2 py-2 text-xs font-semibold text-[#4B6E48] bg-transparent outline-none focus:bg-blue-50/50 border-r border-stone-100 w-full"
                      value={voce.descrizione}
                      onChange={e => { const v = [...form.voci]; v[i] = { ...v[i], descrizione: e.target.value }; setForm({ ...form, voci: v }); }}
                    />
                    <input
                      type="text"
                      placeholder="es. ml"
                      className="px-2 py-2 text-xs text-[#4B6E48] bg-transparent outline-none focus:bg-blue-50/50 border-r border-stone-100 w-full"
                      value={voce.um}
                      onChange={e => { const v = [...form.voci]; v[i] = { ...v[i], um: e.target.value }; setForm({ ...form, voci: v }); }}
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      className="px-2 py-2 text-xs text-[#4B6E48] bg-transparent outline-none focus:bg-blue-50/50 border-r border-stone-100 w-full"
                      value={voce.qty}
                      onChange={e => { const v = [...form.voci]; v[i] = { ...v[i], qty: e.target.value }; setForm({ ...form, voci: v }); }}
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      className="px-2 py-2 text-xs text-[#4B6E48] bg-transparent outline-none focus:bg-blue-50/50 border-r border-stone-100 w-full"
                      value={voce.prezzoUnit}
                      onChange={e => { const v = [...form.voci]; v[i] = { ...v[i], prezzoUnit: e.target.value }; setForm({ ...form, voci: v }); }}
                    />
                    <div className="px-2 py-2 text-xs font-black text-[#4B6E48] flex items-center justify-between gap-1">
                      <span>{totale !== 0 ? totale.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}</span>
                      {form.voci.length > 1 && (
                        <button
                          type="button"
                          onClick={() => { const v = form.voci.filter((_, idx) => idx !== i); setForm({ ...form, voci: v }); }}
                          className="w-4 h-4 rounded-full bg-red-100 text-red-400 flex items-center justify-center text-[10px] hover:bg-red-200 flex-shrink-0"
                        >×</button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] bg-gray-50 border-t border-gray-300">
                <div className="col-span-5 px-2 py-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, voci: [...form.voci, { fornitore: '', descrizione: '', um: '', qty: '', prezzoUnit: '' }] })}
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#4B6E48] hover:text-[#4B6E48] transition-colors"
                  >
                    <span className="w-4 h-4 rounded-full border border-[#4B6E48]/50 flex items-center justify-center text-xs">+</span> Aggiungi riga
                  </button>
                </div>
                <div className="px-2 py-2 text-xs font-black">
                  {(() => {
                    const tot = form.voci.reduce((acc, v) => acc + (parseFloat(v.qty) || 0) * (parseFloat(v.prezzoUnit) || 0), 0);
                    if (tot === 0) return <span className="text-gray-600">—</span>;
                    return <span className={tot >= 0 ? 'text-emerald-600' : 'text-red-500'}>{tot >= 0 ? '+' : '−'} € {Math.abs(tot).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
              Allegati {editingId ? '(opzionale — lascia vuoto per non sostituire)' : '*'}
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.png,.jpg,.jpeg,.zip"
              className="w-full text-xs text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#4B6E48] file:px-4 file:py-2 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:text-white"
              onChange={e => setFiles(Array.from(e.target.files || []))}
            />
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((f, i) => (
                  <span key={i} className="text-[10px] bg-slate-600/50 text-gray-600 rounded-lg px-2 py-1">{f.name}</span>
                ))}
              </div>
            )}
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#4B6E48] text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#4B6E48] transition-all disabled:opacity-50"
            >
              {isSaving ? 'Salvataggio in corso...' : editingId ? 'Aggiorna Variante' : 'Salva Variante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
