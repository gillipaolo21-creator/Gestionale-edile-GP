'use client';
import { Building2, CheckCircle2, Loader2, Mail, Phone, User, X } from 'lucide-react';
import React, { useState } from 'react';

export interface CreateFornitoreFormData {
  ragioneSociale: string;
  tipo: string;
  piva: string;
  referente: string;
  telefono: string;
  email: string;
  specializzazione: string;
}

export const defaultCreateFornitoreForm = (): CreateFornitoreFormData => ({
  ragioneSociale: '',
  tipo: 'Fornitore di Materiale',
  piva: '',
  referente: '',
  telefono: '',
  email: '',
  specializzazione: '',
});

interface CreateFornitoreModalProps {
  isOpen: boolean;
  success: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFornitoreFormData) => void | Promise<void>;
}

const inputCls =
  'w-full bg-[#F2F0EF] border border-slate-400 rounded-xl px-4 py-3 text-sm font-semibold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors placeholder:text-gray-400 placeholder:font-normal';

export function CreateFornitoreModal({ isOpen, success, submitting, onClose, onSubmit }: CreateFornitoreModalProps) {
  const [form, setForm] = useState<CreateFornitoreFormData>(defaultCreateFornitoreForm());

  if (!isOpen) return null;

  const set = (key: keyof CreateFornitoreFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleClose = () => {
    setForm(defaultCreateFornitoreForm());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#4B6E48]/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-100 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-gray-300">

        {/* Header */}
        <div className="p-7 pb-5 border-b border-stone-200 flex justify-between items-center bg-[#F2F0EF]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={14} className="text-[#B2AC88]" />
              <span className="text-[9px] font-black text-[#B2AC88] uppercase tracking-widest">Anagrafica Fornitore</span>
            </div>
            <h3 className="text-xl font-black text-[#4B6E48] tracking-tighter uppercase">Nuovo Fornitore</h3>
          </div>
          <button onClick={handleClose} className="w-9 h-9 rounded-full hover:bg-stone-200 flex items-center justify-center text-gray-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-[#4B6E48]/10 text-[#4B6E48] rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-black text-[#4B6E48] uppercase tracking-tighter">Fornitore Creato</h4>
            <p className="text-sm text-gray-500">Il fornitore è ora disponibile nella tab "Gestione Fornitori".</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-7 space-y-4">

            {/* Ragione Sociale */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Building2 size={9} /> Ragione Sociale *
              </label>
              <input
                required type="text" placeholder="Es: Bianchi Edilizia Srl"
                className={inputCls} value={form.ragioneSociale} onChange={set('ragioneSociale')}
              />
            </div>

            {/* Tipo */}
            <div className="space-y-1.5">
              <label htmlFor="cf-tipo" className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Tipo Fornitore</label>
              <select id="cf-tipo" className={inputCls} value={form.tipo} onChange={set('tipo')}>
                <option value="Fornitore di Materiale">Fornitore di Materiale</option>
                <option value="Fornitore di Servizi/Subappaltatore">Fornitore di Servizi / Subappaltatore</option>
              </select>
            </div>

            {/* P.IVA + Referente */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="cf-piva" className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Partita IVA</label>
                <input
                  id="cf-piva"
                  type="text" placeholder="IT12345678901"
                  className={inputCls} value={form.piva} onChange={set('piva')}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <User size={9} /> Referente
                </label>
                <input
                  type="text" placeholder="Es: Mario Bianchi"
                  className={inputCls} value={form.referente} onChange={set('referente')}
                />
              </div>
            </div>

            {/* Telefono + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Phone size={9} /> Telefono
                </label>
                <input
                  type="tel" placeholder="Es: 02 1234567"
                  className={inputCls} value={form.telefono} onChange={set('telefono')}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail size={9} /> Email
                </label>
                <input
                  type="email" placeholder="Es: info@bianchi.it"
                  className={inputCls} value={form.email} onChange={set('email')}
                />
              </div>
            </div>

            {/* Specializzazione */}
            <div className="space-y-1.5">
              <label htmlFor="cf-spec" className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Specializzazione</label>
              <input
                id="cf-spec"
                type="text" placeholder="Es: Pavimentazioni, Impianti idraulici..."
                className={inputCls} value={form.specializzazione} onChange={set('specializzazione')}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button" onClick={handleClose}
                className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                Annulla
              </button>
              <button
                type="submit" disabled={submitting}
                className="px-7 py-3 rounded-xl bg-[#4B6E48] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#5a8057] transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? <Loader2 size={13} className="animate-spin" /> : <Building2 size={13} />}
                {submitting ? 'Salvataggio...' : 'Crea Fornitore'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
