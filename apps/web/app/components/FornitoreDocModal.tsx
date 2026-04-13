'use client';

import { X } from 'lucide-react';
import React from 'react';

interface Fornitore {
  ragioneSociale: string;
  tipo: string;
  partitaIva?: string;
  referente?: string;
  telefono?: string;
}

interface FornitoreDocForm {
  tipoDocumento: string;
  importo: string;
  tempiPagamento: string;
  note: string;
}

interface FornitoreDocModalProps {
  isOpen: boolean;
  fornitore: Fornitore | null;
  form: FornitoreDocForm;
  setForm: React.Dispatch<React.SetStateAction<FornitoreDocForm>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function FornitoreDocModal({ isOpen, fornitore, form, setForm, files, setFiles, isSaving, onClose, onSubmit }: FornitoreDocModalProps) {
  if (!isOpen || !fornitore) return null;

  const isServizio = fornitore.tipo === 'Fornitore di Servizi/Subappaltatore';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#003A7D]/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden border border-stone-200">
        <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-[#FBFBFB]">
          <div>
            <h3 className="text-xl font-black text-[#003A7D] tracking-tighter uppercase">{fornitore.ragioneSociale}</h3>
            <p className="text-[9px] font-bold text-[#0054B4] uppercase tracking-widest mt-1">
              {isServizio ? 'Fornitore Servizi / Subappalto' : 'Fornitore Materiali'}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Tipo Documento *</label>
            <select
              required
              className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors"
              value={form.tipoDocumento}
              onChange={e => setForm({ ...form, tipoDocumento: e.target.value })}
            >
              {isServizio ? (
                <>
                  <option value="Preventivo">Preventivo</option>
                  <option value="Consuntivo">Consuntivo</option>
                  <option value="SAL">SAL (Stato Avanzamento Lavori)</option>
                  <option value="Fattura">Fattura</option>
                  <option value="Altro">Altro</option>
                </>
              ) : (
                <>
                  <option value="Preventivo">Preventivo</option>
                  <option value="Bolla / DDT">Bolla / DDT</option>
                  <option value="Fattura">Fattura</option>
                  <option value="Altro">Altro</option>
                </>
              )}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Importo (€)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 font-bold text-sm">€</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors"
                  value={form.importo}
                  onChange={e => setForm({ ...form, importo: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Tempi e Modi di Pagamento</label>
              <input
                type="text"
                placeholder="Es: 30gg data fattura, bonifico…"
                className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors"
                value={form.tempiPagamento}
                onChange={e => setForm({ ...form, tempiPagamento: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Note</label>
            <textarea
              rows={2}
              placeholder="Note aggiuntive…"
              className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors resize-none"
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">File * (tutti i formati)</label>
            <input
              required
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip,.dwg"
              className="w-full text-xs text-stone-500 file:mr-4 file:rounded-lg file:border-0 file:bg-[#003A7D] file:px-4 file:py-2 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:text-white"
              onChange={e => setFiles(Array.from(e.target.files || []))}
            />
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((f, i) => (
                  <span key={i} className="text-[10px] bg-stone-100 text-stone-500 rounded-lg px-2 py-1">{f.name}</span>
                ))}
              </div>
            )}
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#003A7D] text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#0054B4] transition-all disabled:opacity-50"
            >
              {isSaving ? 'Caricamento in corso...' : 'Salva Documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
