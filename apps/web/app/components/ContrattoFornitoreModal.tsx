'use client';

import { X } from 'lucide-react';
import React from 'react';

interface ContrattoFornitoreForm {
  ragioneSociale: string;
  partitaIva: string;
  attivita: string;
  tipo: string;
  referente: string;
  telefono: string;
  isNuovoFornitore: boolean;
}

interface ContrattoFornitoreModalProps {
  isOpen: boolean;
  form: ContrattoFornitoreForm;
  setForm: React.Dispatch<React.SetStateAction<ContrattoFornitoreForm>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isSaving: boolean;
  fornitoriEsistenti: string[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ContrattoFornitoreModal({
  isOpen, form, setForm, files, setFiles, isSaving, fornitoriEsistenti, onClose, onSubmit,
}: ContrattoFornitoreModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#003A7D]/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden border border-stone-200">
        <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-[#FBFBFB]">
          <div>
            <h3 className="text-xl font-black text-[#003A7D] tracking-tighter uppercase">Contratto Fornitore</h3>
            <p className="text-[9px] font-bold text-[#0054B4] uppercase tracking-widest mt-1">Area Acquisti</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Ragione Sociale Fornitore *</label>
            {fornitoriEsistenti.length > 0 && (
              <select
                className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors mb-2"
                value={form.isNuovoFornitore ? '__nuovo__' : form.ragioneSociale}
                onChange={e => {
                  if (e.target.value === '__nuovo__') {
                    setForm({ ...form, ragioneSociale: '', isNuovoFornitore: true });
                  } else {
                    setForm({ ...form, ragioneSociale: e.target.value, isNuovoFornitore: false });
                  }
                }}
              >
                {fornitoriEsistenti.map(f => <option key={f} value={f}>{f}</option>)}
                <option value="__nuovo__">+ Aggiungi nuovo fornitore</option>
              </select>
            )}
            {(form.isNuovoFornitore || fornitoriEsistenti.length === 0) && (
              <input
                required
                type="text"
                placeholder="Es: Tecnofer Srl"
                className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors"
                value={form.ragioneSociale}
                onChange={e => setForm({ ...form, ragioneSociale: e.target.value })}
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">P. IVA N°</label>
              <input
                type="text"
                placeholder="Es: 01234567890"
                maxLength={11}
                minLength={11}
                pattern="\d{11}"
                title="La P.IVA deve essere composta da 11 cifre numeriche"
                className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors"
                value={form.partitaIva}
                onChange={e => setForm({ ...form, partitaIva: e.target.value.replace(/\D/g, '').slice(0, 11) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Tipologia *</label>
              <select
                required
                className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors"
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value })}
              >
                <option value="Fornitore di Materiale">Fornitore di Materiale</option>
                <option value="Fornitore di Servizi/Subappaltatore">Fornitore di Servizi / Subappaltatore</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Attività svolta per la commessa</label>
            <input
              type="text"
              placeholder="Es: Fornitura acciaio, Demolizioni interne…"
              className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors"
              value={form.attivita}
              onChange={e => setForm({ ...form, attivita: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Nome Referente</label>
              <input
                type="text"
                placeholder="Es: Luca Bianchi"
                className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors"
                value={form.referente}
                onChange={e => setForm({ ...form, referente: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Recapito Telefonico</label>
              <input
                type="tel"
                placeholder="Es: +39 02 1234567"
                className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors"
                value={form.telefono}
                onChange={e => setForm({ ...form, telefono: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Documentazione * (tutti i formati)</label>
            <input
              required
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.png,.jpg,.jpeg,.zip"
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
              {isSaving ? 'Caricamento in corso...' : 'Salva Contratto Fornitore'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
