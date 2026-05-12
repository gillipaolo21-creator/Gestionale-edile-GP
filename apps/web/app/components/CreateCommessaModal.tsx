'use client';
import { Briefcase, CheckCircle2, Hash, Loader2, MapPin, User, UserCheck, X } from 'lucide-react';
import React from 'react';

interface FormData {
  codiceIdentificativo: string;
  tipoLavori: string;
  nomeCliente: string;
  dataCreazione: string;
  indirizzo: string;
  citta: string;
  cap: string;
  responsabile: string;
}

interface CreateCommessaModalProps {
  isOpen: boolean;
  success: boolean;
  submitting: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  pmFolders: string[];
  pmMode: 'select' | 'free';
  setPmMode: (mode: 'select' | 'free') => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateCommessaModal({
  isOpen, success, submitting, formData, setFormData, pmFolders, pmMode, setPmMode, onClose, onSubmit,
}: CreateCommessaModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#003A7D]/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-stone-200">
        <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-[#FBFBFB]">
          <div>
            <h3 className="text-2xl font-black text-[#003A7D] tracking-tighter uppercase">Nuova Commessa</h3>
            <p className="text-[9px] font-bold text-[#0054B4] uppercase tracking-widest mt-1">Registrazione Protocollo Bresciani Group</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={48} strokeWidth={1.5} />
            </div>
            <h4 className="text-2xl font-black text-[#003A7D] uppercase tracking-tighter text-blue-900">Registrazione Completata</h4>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2"><Hash size={10} /> Codice Univoco</label>
                <input readOnly type="text" className="w-full bg-[#F2F2F2] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none" value={formData.codiceIdentificativo} />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2"><User size={10} /> Nome Cliente</label>
                <input required type="text" placeholder="Es: Mario Rossi" className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={formData.nomeCliente} onChange={e => setFormData({ ...formData, nomeCliente: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2"><Briefcase size={10} /> Tipologia Lavori</label>
              <input required type="text" placeholder="Es: Restauro, Nuova Costruzione" className="w-full bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={formData.tipoLavori} onChange={e => setFormData({ ...formData, tipoLavori: e.target.value })} />
            </div>

            <div className="p-4 rounded-2xl border border-stone-100 bg-stone-50/50 space-y-4">
              <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin size={12} /> Localizzazione Cantiere</p>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Indirizzo (Via e Civico)</label>
                <input required type="text" placeholder="Es: Via Roma 1" className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={formData.indirizzo} onChange={e => setFormData({ ...formData, indirizzo: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Città / Comune</label>
                  <input required type="text" placeholder="Es: Milano" className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={formData.citta} onChange={e => setFormData({ ...formData, citta: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">CAP</label>
                  <input required type="text" placeholder="Es: 20100" maxLength={5} className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors" value={formData.cap} onChange={e => setFormData({ ...formData, cap: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2"><UserCheck size={10} /> PM Incaricato</label>
                {pmMode === 'select' && pmFolders.length > 0 ? (
                  <div className="flex gap-2">
                    <select
                      required
                      className="flex-1 bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors appearance-none"
                      value={formData.responsabile}
                      onChange={e => {
                        if (e.target.value === '__nuovo__') {
                          setPmMode('free');
                          setFormData({ ...formData, responsabile: '' });
                        } else {
                          setFormData({ ...formData, responsabile: e.target.value });
                        }
                      }}
                    >
                      <option value="">Seleziona PM...</option>
                      {pmFolders.map(f => <option key={f} value={f}>{f}</option>)}
                      <option value="__nuovo__">+ Aggiungi nuovo</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      required
                      type="text"
                      placeholder="Es: DONATO CARLUCCI"
                      className="flex-1 bg-[#FBFBFB] border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-[#003A7D] outline-none focus:border-[#0054B4] transition-colors"
                      value={formData.responsabile}
                      onChange={e => setFormData({ ...formData, responsabile: e.target.value })}
                    />
                    {pmFolders.length > 0 && (
                      <button type="button" onClick={() => { setPmMode('select'); setFormData({ ...formData, responsabile: '' }); }} className="px-3 py-2 text-[9px] font-black text-[#0054B4] uppercase tracking-widest border border-[#0054B4]/30 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap">
                        ← Scegli
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <button type="submit" disabled={submitting} className="w-full bg-[#003A7D] text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#0054B4] transition-all disabled:opacity-50 shadow-lg shadow-blue-900/10">
                {submitting ? <Loader2 size={14} className="animate-spin inline mr-2" /> : null}
                Registra Commessa
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
