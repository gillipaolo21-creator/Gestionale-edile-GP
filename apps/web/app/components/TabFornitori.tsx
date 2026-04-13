'use client';
import { ChevronRight, Download, Eye, FileText, Plus, Truck, Wrench } from 'lucide-react';
import { useState } from 'react';
import type { Documento, DocumentoMetadata, Fornitore } from '../types/domain';

interface TabFornitoriProps {
  fornitoriDaDocumenti: Fornitore[];
  docOperativiPerFornitore: Map<string, Documento[]>;
  baseUrl: string;
  handleUpdateDocStato: (docId: string, currentMeta: DocumentoMetadata, nuovoStato: string) => void;
  setPreviewDoc: (doc: { id: string; nomeFile: string } | null) => void;
  onAddDocForFornitore: (fornitore: Fornitore) => void;
}

export function TabFornitori({
  fornitoriDaDocumenti,
  docOperativiPerFornitore,
  baseUrl,
  handleUpdateDocStato,
  setPreviewDoc,
  onAddDocForFornitore,
}: TabFornitoriProps) {
  const [expandedFornitoriIds, setExpandedFornitoriIds] = useState<Set<string>>(new Set());

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
      {fornitoriDaDocumenti.length === 0 ? (
        <div className="p-10 border border-dashed border-stone-200 rounded-2xl text-center text-stone-400 text-sm">
          Nessun fornitore registrato. Aggiungili dall&apos;Archivio Documentale → Contratti Fornitori.
        </div>
      ) : (
        <div className="bg-white border border-stone-400 rounded-2xl shadow-xl shadow-stone-400/50 overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-2.5 bg-stone-50 border-b border-stone-100 text-[9px] font-black uppercase tracking-widest text-stone-400">
            <span className="w-6" />
            <span>Fornitore</span>
            <span className="text-right w-16">Doc.</span>
            <span className="text-right w-28">Totale imp.</span>
            <span className="w-28" />
            <span className="w-8" />
          </div>

          <div className="divide-y divide-stone-100">
            {fornitoriDaDocumenti.map((fornitore) => {
              const docs = docOperativiPerFornitore.get(fornitore.ragioneSociale) ?? [];
              const isExpanded = expandedFornitoriIds.has(fornitore.ragioneSociale);
              const totaleImporto = docs.reduce((sum, d) => {
                const imp = parseFloat(d.datiEstrattiJson?.importo || '0');
                return sum + (isNaN(imp) ? 0 : imp);
              }, 0);
              const isServizio = fornitore.tipo === 'Fornitore di Servizi/Subappaltatore';

              return (
                <div key={fornitore.ragioneSociale}>
                  <div
                    className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-3 hover:bg-stone-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedFornitoriIds(prev => {
                      const next = new Set(prev);
                      next.has(fornitore.ragioneSociale) ? next.delete(fornitore.ragioneSociale) : next.add(fornitore.ragioneSociale);
                      return next;
                    })}
                  >
                    <ChevronRight
                      size={14}
                      strokeWidth={2.5}
                      className={`text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isServizio ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                          {isServizio ? <Wrench size={9} /> : <Truck size={9} />}
                          {isServizio ? 'Subappalto' : 'Materiali'}
                        </span>
                        <p className="text-sm font-bold text-[#003A7D] truncate">{fornitore.ragioneSociale}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[9px] font-semibold text-stone-400">
                        {fornitore.partitaIva && <span>P.IVA {fornitore.partitaIva}</span>}
                        {fornitore.attivita && <><span>&bull;</span><span>{fornitore.attivita}</span></>}
                        {fornitore.referente && <><span>&bull;</span><span>{fornitore.referente}</span></>}
                        {fornitore.telefono && <><span>&bull;</span><span>{fornitore.telefono}</span></>}
                      </div>
                    </div>

                    <div className="w-16 text-right">
                      <span className="text-xs font-black text-[#003A7D]">{docs.length}</span>
                      <span className="text-[9px] text-stone-400 ml-1">file</span>
                    </div>

                    <div className="w-28 text-right">
                      {totaleImporto > 0 ? (
                        <span className="text-sm font-black text-[#003A7D]">€ {totaleImporto.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      ) : (
                        <span className="text-[10px] text-stone-300">—</span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddDocForFornitore(fornitore);
                      }}
                      className="w-28 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[9px] font-black text-[#0054B4] uppercase tracking-widest border border-[#0054B4]/30 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Plus size={10} /> Aggiungi
                    </button>

                    <div className="w-8" />
                  </div>

                  {isExpanded && (
                    <div className="bg-stone-50/60 border-t border-stone-100">
                      {docs.length === 0 ? (
                        <p className="px-14 py-3 text-[10px] text-stone-400 italic">Nessun documento operativo caricato.</p>
                      ) : (
                        <div className="divide-y divide-stone-100">
                          {docs.map((doc) => {
                            const meta: DocumentoMetadata = doc.datiEstrattiJson || {};
                            const tipo = meta.tipoDocumento || '';
                            const statoCorrente = meta.stato || '';

                            const statoConfig: Record<string, { label: string; color: string; bg: string; activeBg: string; activeText: string }[]> = {
                              'Preventivo': [
                                { label: 'Ricevuto', color: 'text-stone-500', bg: 'bg-stone-100 border-stone-200', activeBg: 'bg-stone-500', activeText: 'text-white' },
                                { label: 'Trattativa', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', activeBg: 'bg-amber-500', activeText: 'text-white' },
                                { label: 'Approvato', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', activeBg: 'bg-emerald-500', activeText: 'text-white' },
                              ],
                              'Fattura': [
                                { label: 'Ricevuta', color: 'text-stone-500', bg: 'bg-stone-100 border-stone-200', activeBg: 'bg-stone-500', activeText: 'text-white' },
                                { label: 'Approvata', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', activeBg: 'bg-blue-500', activeText: 'text-white' },
                                { label: 'Pagata', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', activeBg: 'bg-emerald-500', activeText: 'text-white' },
                              ],
                              'Bolla / DDT': [
                                { label: 'Approvata', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', activeBg: 'bg-emerald-500', activeText: 'text-white' },
                              ],
                              'Consuntivo': [
                                { label: 'Ricevuto', color: 'text-stone-500', bg: 'bg-stone-100 border-stone-200', activeBg: 'bg-stone-500', activeText: 'text-white' },
                                { label: 'Approvato', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', activeBg: 'bg-emerald-500', activeText: 'text-white' },
                              ],
                              'SAL': [
                                { label: 'Ricevuto', color: 'text-stone-500', bg: 'bg-stone-100 border-stone-200', activeBg: 'bg-stone-500', activeText: 'text-white' },
                                { label: 'Approvato', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', activeBg: 'bg-emerald-500', activeText: 'text-white' },
                              ],
                            };

                            const steps = statoConfig[tipo] ?? [
                              { label: 'Ricevuto', color: 'text-stone-500', bg: 'bg-stone-100 border-stone-200', activeBg: 'bg-stone-500', activeText: 'text-white' },
                              { label: 'Approvato', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', activeBg: 'bg-emerald-500', activeText: 'text-white' },
                            ];
                            const statoIdx = steps.findIndex(s => s.label === statoCorrente);

                            return (
                              <div key={doc.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-5 py-3 hover:bg-white transition-colors">
                                <div className="w-6 flex justify-center self-start pt-0.5">
                                  <FileText size={13} className="text-stone-300" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#003A7D] truncate">{tipo || doc.nomeFile}</p>
                                  <div className="flex items-center gap-2 text-[9px] text-stone-400 mt-0.5">
                                    <span className="truncate">{doc.nomeFile}</span>
                                    {meta.tempiPagamento && <><span>&bull;</span><span>{meta.tempiPagamento}</span></>}
                                    {meta.note && <><span>&bull;</span><span className="italic">{meta.note}</span></>}
                                  </div>
                                  {steps.length > 0 && (
                                    <div className="flex items-center gap-1.5 mt-2">
                                      {steps.map((step, idx) => {
                                        const isActive = statoIdx >= idx;
                                        const isCurrent = statoIdx === idx;
                                        return (
                                          <button
                                            key={step.label}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const nuovoStato = isCurrent && idx > 0 ? steps[idx - 1].label : isCurrent ? '' : step.label;
                                              handleUpdateDocStato(doc.id, meta, nuovoStato);
                                            }}
                                            className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${isActive ? `${step.activeBg} ${step.activeText} border-transparent` : `${step.bg} ${step.color}`}`}
                                          >
                                            {step.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right shrink-0 self-start pt-0.5">
                                  {meta.importo ? (
                                    <span className="text-xs font-bold text-[#003A7D]">€ {Number(meta.importo).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  ) : <span className="text-[10px] text-stone-300">—</span>}
                                </div>
                                <div className="flex items-center gap-1 justify-end shrink-0 self-start pt-0.5">
                                  <button type="button" onClick={() => setPreviewDoc({ id: doc.id, nomeFile: doc.nomeFile })} className="p-1.5 text-stone-400 hover:text-[#0054B4] hover:bg-blue-50 rounded-lg transition-colors" title="Anteprima">
                                    <Eye size={13} />
                                  </button>
                                  <a href={`${baseUrl}/api/documenti/${doc.id}/download`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-stone-400 hover:text-[#0054B4] hover:bg-blue-50 rounded-lg transition-colors">
                                    <Download size={13} />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
