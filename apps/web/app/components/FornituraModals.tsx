'use client';
import { X } from 'lucide-react';
import React from 'react';

interface MaterialForm {
  fornitoreNome: string;
  importoFornitura: string;
  descrizione: string;
  preventivoRiferimento: string;
  dataPreventivo: string;
}

interface ServiceForm {
  fornitoreNome: string;
  importoFornitura: string;
  descrizione: string;
  preventivoRiferimento: string;
  dataPreventivo: string;
}

interface FornituraModalsProps {
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
  showMaterialModal, materialForm, setMaterialForm, materialFile, setMaterialFile, isSavingMaterial, onMaterialClose, onMaterialSubmit,
  showServiceModal, serviceForm, setServiceForm, serviceFile, setServiceFile, isSavingService, onServiceClose, onServiceSubmit,
}: FornituraModalsProps) {
  return (
    <>
      {showMaterialModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#003A7D]/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-100">
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-[#FBFBFB]">
              <div>
                <h3 className="text-xl font-black text-[#003A7D] tracking-tighter uppercase">Nuova Fornitura Materiale</h3>
                <p className="text-[9px] font-bold text-[#0054B4] uppercase tracking-widest mt-1">Costo legato alla commessa</p>
              </div>
              <button onClick={onMaterialClose} className="w-10 h-10 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onMaterialSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Fornitore</label>
                <input required type="text" className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={materialForm.fornitoreNome} onChange={e => setMaterialForm({ ...materialForm, fornitoreNome: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Importo Fornitura</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 font-bold text-sm">€</span>
                    <input required type="number" step="0.01" className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={materialForm.importoFornitura} onChange={e => setMaterialForm({ ...materialForm, importoFornitura: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Data Preventivo</label>
                  <input required type="date" className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={materialForm.dataPreventivo} onChange={e => setMaterialForm({ ...materialForm, dataPreventivo: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Preventivo di Riferimento</label>
                <input required type="text" className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={materialForm.preventivoRiferimento} onChange={e => setMaterialForm({ ...materialForm, preventivoRiferimento: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Descrizione</label>
                <textarea rows={3} className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={materialForm.descrizione} onChange={e => setMaterialForm({ ...materialForm, descrizione: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Preventivo (PDF)</label>
                <input required type="file" accept=".pdf" className="w-full text-xs text-stone-500 file:mr-4 file:rounded-lg file:border-0 file:bg-[#003A7D] file:px-4 file:py-2 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:text-white" onChange={e => setMaterialFile(e.target.files?.[0] || null)} />
                {materialFile && <p className="text-[10px] text-stone-400 uppercase tracking-widest">{materialFile.name}</p>}
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSavingMaterial} className="w-full bg-[#003A7D] text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#0054B4] transition-all disabled:opacity-50">
                  {isSavingMaterial ? 'Salvataggio...' : 'Registra Fornitura'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showServiceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#003A7D]/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-100">
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-[#FBFBFB]">
              <div>
                <h3 className="text-xl font-black text-[#003A7D] tracking-tighter uppercase">Nuova Fornitura Servizi</h3>
                <p className="text-[9px] font-bold text-[#0054B4] uppercase tracking-widest mt-1">Costo legato alla commessa</p>
              </div>
              <button onClick={onServiceClose} className="w-10 h-10 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onServiceSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Fornitore</label>
                <input required type="text" className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={serviceForm.fornitoreNome} onChange={e => setServiceForm({ ...serviceForm, fornitoreNome: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Importo Servizio</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 font-bold text-sm">€</span>
                    <input required type="number" step="0.01" className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={serviceForm.importoFornitura} onChange={e => setServiceForm({ ...serviceForm, importoFornitura: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Data Preventivo</label>
                  <input required type="date" className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={serviceForm.dataPreventivo} onChange={e => setServiceForm({ ...serviceForm, dataPreventivo: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Preventivo di Riferimento</label>
                <input required type="text" className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={serviceForm.preventivoRiferimento} onChange={e => setServiceForm({ ...serviceForm, preventivoRiferimento: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Descrizione</label>
                <textarea rows={3} className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={serviceForm.descrizione} onChange={e => setServiceForm({ ...serviceForm, descrizione: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Preventivo (PDF)</label>
                <input required type="file" accept=".pdf" className="w-full text-xs text-stone-500 file:mr-4 file:rounded-lg file:border-0 file:bg-[#003A7D] file:px-4 file:py-2 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:text-white" onChange={e => setServiceFile(e.target.files?.[0] || null)} />
                {serviceFile && <p className="text-[10px] text-stone-400 uppercase tracking-widest">{serviceFile.name}</p>}
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSavingService} className="w-full bg-[#003A7D] text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#0054B4] transition-all disabled:opacity-50">
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
