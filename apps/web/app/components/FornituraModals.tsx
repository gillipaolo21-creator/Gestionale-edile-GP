'use client';
import { X } from 'lucide-react';
import React from 'react';
import type { Societa } from '../types/domain';
import { EuroAmountInput } from './EuroAmountInput';

interface MaterialForm {
  societaId: string;
  fornitoreNome: string;
  importoFornitura: string;
  descrizione: string;
  preventivoRiferimento: string;
  dataPreventivo: string;
}

interface ServiceForm {
  societaId: string;
  fornitoreNome: string;
  importoFornitura: string;
  descrizione: string;
  preventivoRiferimento: string;
  dataPreventivo: string;
}

interface FornituraModalsProps {
  societaOptions: Societa[];
  showMaterialModal: boolean;
  materialForm: MaterialForm;
  setMaterialForm: React.Dispatch<React.SetStateAction<MaterialForm>>;
  materialFile: File | null;
  setMaterialFile: React.Dispatch<React.SetStateAction<File | null>>;
  isSavingMaterial: boolean;
  onMaterialClose: () => void;
  onMaterialSubmit: (e: React.FormEvent) => void;

  showServiceModal: boolean;
  serviceForm: ServiceForm;
  setServiceForm: React.Dispatch<React.SetStateAction<ServiceForm>>;
  serviceFile: File | null;
  setServiceFile: React.Dispatch<React.SetStateAction<File | null>>;
  isSavingService: boolean;
  onServiceClose: () => void;
  onServiceSubmit: (e: React.FormEvent) => void;
}

export function FornituraModals({
  societaOptions,
  showMaterialModal, materialForm, setMaterialForm, materialFile, setMaterialFile, isSavingMaterial, onMaterialClose, onMaterialSubmit,
  showServiceModal, serviceForm, setServiceForm, serviceFile, setServiceFile, isSavingService, onServiceClose, onServiceSubmit,
}: FornituraModalsProps) {
  return (
    <>
      {showMaterialModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4B6E48]/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-gray-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-100">
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-[#F2F0EF]">
              <div>
                <h3 className="text-xl font-black text-[#4B6E48] tracking-tighter uppercase">Nuova Fornitura Materiale</h3>
                <p className="text-[9px] font-bold text-[#4B6E48] uppercase tracking-widest mt-1">Costo legato alla commessa</p>
              </div>
              <button onClick={onMaterialClose} className="w-10 h-10 rounded-full hover:bg-stone-200 flex items-center justify-center text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onMaterialSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Societa</label>
                <select
                  required
                  className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors"
                  value={materialForm.societaId}
                  onChange={e => setMaterialForm({ ...materialForm, societaId: e.target.value })}
                >
                  <option value="">Seleziona societa...</option>
                  {societaOptions.map((s) => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Fornitore</label>
                <input required type="text" className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors" value={materialForm.fornitoreNome} onChange={e => setMaterialForm({ ...materialForm, fornitoreNome: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Importo Fornitura</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800 font-bold text-sm">€</span>
                    <EuroAmountInput required className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors" value={materialForm.importoFornitura} onValueChange={(nextValue) => setMaterialForm({ ...materialForm, importoFornitura: nextValue })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Data Preventivo</label>
                  <input required type="date" className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors" value={materialForm.dataPreventivo} onChange={e => setMaterialForm({ ...materialForm, dataPreventivo: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Preventivo di Riferimento</label>
                <input required type="text" className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors" value={materialForm.preventivoRiferimento} onChange={e => setMaterialForm({ ...materialForm, preventivoRiferimento: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Descrizione</label>
                <textarea rows={3} className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors" value={materialForm.descrizione} onChange={e => setMaterialForm({ ...materialForm, descrizione: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Preventivo (PDF)</label>
                <input required type="file" accept=".pdf" className="w-full text-xs text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#4B6E48] file:px-4 file:py-2 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:text-white" onChange={e => setMaterialFile(e.target.files?.[0] || null)} />
                {materialFile && <p className="text-[10px] text-gray-600 uppercase tracking-widest">{materialFile.name}</p>}
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSavingMaterial} className="w-full bg-[#4B6E48] text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#4B6E48] transition-all disabled:opacity-50">
                  {isSavingMaterial ? 'Salvataggio...' : 'Registra Fornitura'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showServiceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4B6E48]/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-gray-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-100">
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-[#F2F0EF]">
              <div>
                <h3 className="text-xl font-black text-[#4B6E48] tracking-tighter uppercase">Nuova Fornitura Servizi</h3>
                <p className="text-[9px] font-bold text-[#4B6E48] uppercase tracking-widest mt-1">Costo legato alla commessa</p>
              </div>
              <button onClick={onServiceClose} className="w-10 h-10 rounded-full hover:bg-stone-200 flex items-center justify-center text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onServiceSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Societa</label>
                <select
                  required
                  className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors"
                  value={serviceForm.societaId}
                  onChange={e => setServiceForm({ ...serviceForm, societaId: e.target.value })}
                >
                  <option value="">Seleziona societa...</option>
                  {societaOptions.map((s) => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Fornitore</label>
                <input required type="text" className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors" value={serviceForm.fornitoreNome} onChange={e => setServiceForm({ ...serviceForm, fornitoreNome: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Importo Servizio</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800 font-bold text-sm">€</span>
                    <EuroAmountInput required className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors" value={serviceForm.importoFornitura} onValueChange={(nextValue) => setServiceForm({ ...serviceForm, importoFornitura: nextValue })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Data Preventivo</label>
                  <input required type="date" className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors" value={serviceForm.dataPreventivo} onChange={e => setServiceForm({ ...serviceForm, dataPreventivo: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Preventivo di Riferimento</label>
                <input required type="text" className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm font-bold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors" value={serviceForm.preventivoRiferimento} onChange={e => setServiceForm({ ...serviceForm, preventivoRiferimento: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Descrizione</label>
                <textarea rows={3} className="w-full bg-[#F2F0EF] border border-slate-500 rounded-xl px-4 py-3 text-sm text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors" value={serviceForm.descrizione} onChange={e => setServiceForm({ ...serviceForm, descrizione: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Preventivo (PDF)</label>
                <input required type="file" accept=".pdf" className="w-full text-xs text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#4B6E48] file:px-4 file:py-2 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:text-white" onChange={e => setServiceFile(e.target.files?.[0] || null)} />
                {serviceFile && <p className="text-[10px] text-gray-600 uppercase tracking-widest">{serviceFile.name}</p>}
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSavingService} className="w-full bg-[#4B6E48] text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#4B6E48] transition-all disabled:opacity-50">
                  {isSavingService ? 'Salvataggio...' : 'Registra Servizio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
