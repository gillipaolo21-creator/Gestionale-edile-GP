'use client';

import { UploadCloud, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface AllegatiClienteModalProps {
  isOpen: boolean;
  clienti: string[];
  onClose: () => void;
  onSubmit: (files: FileList, nomeCliente: string, descrizione: string) => void;
}

export function AllegatiClienteModal({ isOpen, clienti, onClose, onSubmit }: AllegatiClienteModalProps) {
  const [selectedCliente, setSelectedCliente] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedCliente('');
    setDescrizione('');
    setFiles([]);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente || files.length === 0) return;
    const dt = new DataTransfer();
    files.forEach(f => dt.items.add(f));
    onSubmit(dt.files, selectedCliente, descrizione);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-gray-100 rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="text-sm font-black text-[#4B6E48] uppercase tracking-widest">Carica Documento Cliente</h3>
          <button onClick={handleClose} className="p-1 hover:bg-slate-600/50 rounded-lg transition-colors">
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Cliente */}
          <div className="space-y-2">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Cliente *</label>
            <select
              required
              value={selectedCliente}
              onChange={e => setSelectedCliente(e.target.value)}
              className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors"
            >
              <option value="">Seleziona cliente...</option>
              {clienti.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Descrizione */}
          <div className="space-y-2">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Descrizione</label>
            <input
              type="text"
              value={descrizione}
              onChange={e => setDescrizione(e.target.value)}
              placeholder="Es: Allegato contrattuale, Documentazione integrativa, ecc."
              className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors"
            />
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">File *</label>
            <div
              onClick={() => inputRef.current?.click()}
              className="border border-dashed border-slate-500 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 hover:border-[#4B6E48]/50 transition-colors"
            >
              <UploadCloud size={18} className="text-gray-600" />
              <span className="text-xs font-bold text-gray-600">
                {files.length > 0 ? `${files.length} file selezionat${files.length === 1 ? 'o' : 'i'}` : 'Clicca per selezionare i file'}
              </span>
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={e => {
                if (e.target.files) setFiles(Array.from(e.target.files));
              }}
            />
            {files.length > 0 && (
              <div className="space-y-1">
                {files.map((f, i) => (
                  <div key={i} className="text-[10px] text-gray-600 truncate">{f.name}</div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              Annulla
            </button>
            <button
              type="submit"
              disabled={!selectedCliente || files.length === 0}
              className="px-5 py-2 text-xs font-black text-white bg-[#4B6E48] rounded-xl hover:bg-[#4B6E48] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Carica
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
