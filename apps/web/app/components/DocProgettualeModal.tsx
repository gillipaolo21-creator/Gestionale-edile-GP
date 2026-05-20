'use client';

import { X } from 'lucide-react';
import React from 'react';

interface DocProgettualeModalProps {
  isOpen: boolean;
  form: { nome: string; descrizione: string; note: string };
  setForm: React.Dispatch<React.SetStateAction<{ nome: string; descrizione: string; note: string }>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function DocProgettualeModal({ isOpen, form, setForm, files, setFiles, isSaving, onClose, onSubmit }: DocProgettualeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4B6E48]/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-100 w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden border border-gray-300">
        <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-[#F2F0EF]">
          <div>
            <h3 className="text-xl font-black text-[#4B6E48] tracking-tighter uppercase">Documentazione Progettuale</h3>
            <p className="text-[9px] font-bold text-[#4B6E48] uppercase tracking-widest mt-1">Area Tecnica</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-stone-200 flex items-center justify-center text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Nome documento *</label>
            <input
              required
              type="text"
              placeholder="Es: Computo Metrico Rev.2, Planimetria Piano Terra…"
              className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Descrizione</label>
            <textarea
              rows={3}
              placeholder="Breve descrizione del contenuto del documento…"
              className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors resize-none"
              value={form.descrizione}
              onChange={e => setForm({ ...form, descrizione: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Note</label>
            <textarea
              rows={2}
              placeholder="Note aggiuntive…"
              className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors resize-none"
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Allegati * (tutti i formati)</label>
            <input
              required
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.dxf,.png,.jpg,.jpeg,.zip"
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
              {isSaving ? 'Caricamento in corso...' : 'Salva Documentazione'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
