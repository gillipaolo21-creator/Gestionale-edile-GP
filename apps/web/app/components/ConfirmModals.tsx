'use client';
import { AlertTriangle, Archive, Loader2, Trash2 } from 'lucide-react';
import type { Commessa } from '../types/domain';

interface ConfirmModalsProps {
  // Chiudi Cantiere
  showCloseModal: boolean;
  isClosing: boolean;
  selectedCommessa: Commessa | null;
  onCloseCancel: () => void;
  onCloseConfirm: () => void;
  // Elimina Commessa
  showDeleteModal: boolean;
  isDeleting: boolean;
  deleteInfo: { hasDocuments: boolean; hasFilesOnDisk: boolean } | null;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  // Elimina dalla Home
  showHomeDeleteModal: boolean;
  commessaToDelete: Commessa | null;
  onHomeDeleteCancel: () => void;
  onHomeDeleteConfirm: () => void;
}

export function ConfirmModals({
  showCloseModal, isClosing, selectedCommessa, onCloseCancel, onCloseConfirm,
  showDeleteModal, isDeleting, deleteInfo, onDeleteCancel, onDeleteConfirm,
  showHomeDeleteModal, commessaToDelete, onHomeDeleteCancel, onHomeDeleteConfirm,
}: ConfirmModalsProps) {
  return (
    <>
      {showCloseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#003A7D]/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-100">
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-[#0054B4] rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={32} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-black text-[#003A7D] tracking-tighter uppercase mb-2">Chiudi Cantiere</h3>
              <p className="text-sm text-stone-500 mb-8 leading-relaxed">
                Stai per chiudere <span className="font-bold text-[#003A7D]">{selectedCommessa?.codiceIdentificativo}</span>. Lo stato passerà a CHIUSO. I documenti storici e l&apos;anagrafica rimarranno consultabili nell&apos;archivio.
              </p>
              <div className="flex gap-4 w-full">
                <button onClick={onCloseCancel} disabled={isClosing} className="flex-1 px-6 py-4 rounded-xl text-[9px] font-black text-stone-500 uppercase tracking-widest bg-stone-100 hover:bg-stone-200 transition-colors disabled:opacity-50">
                  Annulla
                </button>
                <button onClick={onCloseConfirm} disabled={isClosing} className="flex-1 px-6 py-4 rounded-xl text-[9px] font-black text-white uppercase tracking-widest bg-[#003A7D] hover:bg-[#0054B4] shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {isClosing ? <Loader2 size={14} className="animate-spin" /> : <Archive size={14} />}
                  Conferma Chiusura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#3A1D1D]/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-100">
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={32} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-black text-[#003A7D] tracking-tighter uppercase mb-2">Elimina Commessa</h3>
              <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                Stai per eliminare <span className="font-bold text-[#003A7D]">{selectedCommessa?.codiceIdentificativo}</span>. La commessa verrà rimossa definitivamente dal gestionale.
                <span className="block mt-3 text-amber-600 font-semibold">
                  La documentazione caricata resterà consultabile nella cartella di riferimento su disco.
                </span>
              </p>
              <div className="flex gap-4 w-full">
                <button onClick={onDeleteCancel} disabled={isDeleting} className="flex-1 px-6 py-4 rounded-xl text-[9px] font-black text-stone-500 uppercase tracking-widest bg-stone-100 hover:bg-stone-200 transition-colors disabled:opacity-50">
                  Annulla
                </button>
                <button onClick={onDeleteConfirm} disabled={isDeleting} className="flex-1 px-6 py-4 rounded-xl text-[9px] font-black text-white uppercase tracking-widest bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Conferma Eliminazione
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHomeDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#3A1D1D]/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-100">
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={32} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-black text-[#003A7D] tracking-tighter uppercase mb-2">Elimina Commessa</h3>
              <p className="text-sm text-stone-500 mb-8 leading-relaxed">
                Confermi l&apos;eliminazione della commessa <span className="font-bold text-[#003A7D]">{commessaToDelete?.codiceIdentificativo}</span>? La commessa verrà rimossa definitivamente dal gestionale.
                <span className="block mt-3 text-amber-600 font-semibold">
                  La documentazione caricata resterà consultabile nella cartella di riferimento su disco.
                </span>
              </p>
              <div className="flex gap-4 w-full">
                <button onClick={onHomeDeleteCancel} disabled={isDeleting} className="flex-1 px-6 py-4 rounded-xl text-[9px] font-black text-stone-500 uppercase tracking-widest bg-stone-100 hover:bg-stone-200 transition-colors disabled:opacity-50">
                  Annulla
                </button>
                <button onClick={onHomeDeleteConfirm} disabled={isDeleting} className="flex-1 px-6 py-4 rounded-xl text-[9px] font-black text-white uppercase tracking-widest bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Conferma Eliminazione
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
