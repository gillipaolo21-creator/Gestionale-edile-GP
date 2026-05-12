'use client';
import { ChevronDown, Download, Eye, FileText, FolderOpen, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import type { Documento, DocumentoMetadata } from '../types/domain';
import { AllegatiClienteModal } from './AllegatiClienteModal';
import { AllegatiFornitoreModal } from './AllegatiFornitoreModal';

type VarianteVoce = { fornitore: string; descrizione: string; um: string; qty: string; prezzoUnit: string };

interface TabDocumentiProps {
  documenti: Documento[];
  baseUrl: string;
  fornitoriEsistenti: string[];
  setPreviewDoc: (doc: { id: string; nomeFile: string } | null) => void;
  onDeleteVariante: (id: string) => void;
  onOpenContrattoCliente: () => void;
  onOpenContrattoFornitore: () => void;
  onOpenDocProgettuale: () => void;
  onOpenVariante: (baseContratti: { id: string; nomeCliente: string }[]) => void;
  onEditVariante: (
    id: string,
    vm: { nomeCliente?: string; dataVariante?: string; voci?: VarianteVoce[] },
    baseContratti: { id: string; nomeCliente: string }[],
  ) => void;
  onAllegatiClienteUpload: (files: FileList, nomeCliente: string, descrizione?: string) => void;
  onAllegatiFornitoreUpload: (files: FileList, ragioneSociale: string, descrizione?: string) => void;
}

function DocumentUploadCard({ title, description, category, onOpen }: { title: string; description: string; category: string; onOpen: () => void }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-400 shadow-xl shadow-stone-400/50 group hover:border-[#0054B4]/30 transition-all flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-blue-50 text-[#0054B4] rounded-xl flex items-center justify-center flex-shrink-0">
          <FolderOpen size={16} strokeWidth={2} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#003A7D]">{title}</h4>
          <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{category}</span>
        </div>
      </div>
      <p className="text-xs text-stone-500 mb-4 flex-1">{description}</p>
      <div
        onClick={onOpen}
        className="border border-dashed border-stone-200 rounded-xl p-3 flex items-center justify-center gap-2 transition-colors hover:bg-stone-50 hover:border-[#0054B4]/50 cursor-pointer"
      >
        <UploadCloud size={16} className="text-stone-400 group-hover:text-[#0054B4]" />
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Carica documento</span>
      </div>
    </div>
  );
}

export function TabDocumenti({
  documenti,
  baseUrl,
  fornitoriEsistenti,
  setPreviewDoc,
  onDeleteVariante,
  onOpenContrattoCliente,
  onOpenContrattoFornitore,
  onOpenDocProgettuale,
  onOpenVariante,
  onEditVariante,
  onAllegatiClienteUpload,
  onAllegatiFornitoreUpload,
}: TabDocumentiProps) {
  const [expandedVariantiIds, setExpandedVariantiIds] = useState<Set<string>>(new Set());
  const [contrattoClienteOpen, setContrattoClienteOpen] = useState(true);
  const [showAllegatiClienteModal, setShowAllegatiClienteModal] = useState(false);
  const [allegatiClienteList, setAllegatiClienteList] = useState<string[]>([]);
  const [showAllegatiFornitoreModal, setShowAllegatiFornitoreModal] = useState(false);
  const [allegatiFornitoreList, setAllegatiFornitoreList] = useState<string[]>([]);
  const [expandedFornitori, setExpandedFornitori] = useState<Set<string>>(new Set());
  const [expandedClienti, setExpandedClienti] = useState<Set<string>>(new Set());

  const MACRO_CATEGORIE = [
    { key: 'Contratti Cliente', label: 'Contratto Cliente' },
    { key: 'Contratti Fornitori', label: 'Contratti Fornitore' },
    { key: 'Documentazione Progettuale', label: 'Documentazione Progettuale' },
  ];

  const categorized = new Map<string, Documento[]>();
  for (const doc of documenti) {
    const found = MACRO_CATEGORIE.find(m => m.key === doc.categoria);
    if (found) {
      const list = categorized.get(found.key) ?? [];
      list.push(doc);
      categorized.set(found.key, list);
    }
  }
  const sections = MACRO_CATEGORIE
    .map(m => ({ label: m.label, key: m.key, docs: categorized.get(m.key) ?? [] }))
    .filter(s => s.docs.length > 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
      <div className="grid grid-cols-3 gap-4 items-stretch">
        <DocumentUploadCard
          title="Contratti Cliente"
          category="Area Legale / Amministrativa"
          description="Contratto d'appalto, allegati firmati, varianti contrattuali."
          onOpen={onOpenContrattoCliente}
        />
        <DocumentUploadCard
          title="Contratti Fornitori"
          category="Area Acquisti"
          description="Accordi quadro, contratti di subappalto, condizioni di fornitura."
          onOpen={() => onOpenContrattoFornitore()}
        />
        <DocumentUploadCard
          title="Documentazione Progettuale"
          category="Area Tecnica"
          description="Computo Metrico Estimativo (CME), elaborati grafici, permessi."
          onOpen={onOpenDocProgettuale}
        />
      </div>

      {sections.length === 0 ? (
        <div className="p-8 border border-dashed border-stone-200 rounded-2xl text-center text-stone-400 text-sm">
          Nessun documento caricato. Usa le sezioni sopra per aggiungere file.
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-[#0054B4] uppercase tracking-widest">Archivio Cloud</h3>
          {sections.map(section => {
            if (section.label === 'Contratto Cliente') {
              const nonVarianti = section.docs.filter((d) => d.datiEstrattiJson?.tipoDocumento !== 'Variante');
              const tutteVarianti = section.docs.filter((d) => d.datiEstrattiJson?.tipoDocumento === 'Variante');
              const clientiNomi = [...new Set([
                ...nonVarianti.map(d => d.datiEstrattiJson?.nomeCliente),
                ...tutteVarianti.map(d => d.datiEstrattiJson?.nomeCliente),
              ].filter(Boolean))] as string[];
              const bcForVariante = nonVarianti
                .filter(d => d.datiEstrattiJson?.tipoDocumento !== 'Allegato')
                .map((b) => ({ id: b.id, nomeCliente: b.datiEstrattiJson?.nomeCliente || b.nomeFile }));

              return (
                <div key={section.label} className="bg-white border border-stone-400 rounded-2xl shadow-xl shadow-stone-400/50 overflow-hidden">
                  <div className="px-5 py-3 bg-stone-50 border-b border-stone-100 flex items-center gap-2">
                    <FolderOpen size={13} className="text-[#0054B4]" />
                    <span className="text-[10px] font-black text-[#003A7D] uppercase tracking-widest">{section.label}</span>
                    <span className="ml-auto text-[10px] font-bold text-stone-400">{section.docs.length} file</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onOpenVariante(bcForVariante); }}
                      className="ml-2 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[#0054B4] border border-[#0054B4]/30 rounded-lg hover:bg-blue-50 transition-colors"
                    >+ Variante</button>
                    {clientiNomi.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAllegatiClienteList(clientiNomi);
                          setShowAllegatiClienteModal(true);
                        }}
                        className="ml-1 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                      >+ Documenti</button>
                    )}
                  </div>

                  {/* === SEZIONE DOCUMENTI === */}
                  <div className="border-b border-stone-200">
                    <div className="divide-y divide-stone-100">
                      {clientiNomi.map(clienteName => {
                        const clienteDocs = nonVarianti.filter(d => d.datiEstrattiJson?.nomeCliente === clienteName);
                        const clienteVarianti = tutteVarianti.filter(d => d.datiEstrattiJson?.nomeCliente === clienteName);
                        const isOpen = expandedClienti.has(clienteName);
                        const totalFiles = clienteDocs.length + clienteVarianti.length;

                        return (
                          <div key={clienteName}>
                            <div
                              className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors cursor-pointer select-none"
                              onClick={() => setExpandedClienti(prev => { const s = new Set(prev); s.has(clienteName) ? s.delete(clienteName) : s.add(clienteName); return s; })}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 bg-blue-50 text-[#0054B4] rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FolderOpen size={15} />
                                </div>
                                <p className="text-sm font-bold text-[#003A7D] truncate">{clienteName}</p>
                                <span className="text-[10px] font-semibold text-stone-400">{totalFiles} file</span>
                                {clienteVarianti.length > 0 && (
                                  <span className="text-[10px] font-semibold text-amber-500">{clienteVarianti.length} variant{clienteVarianti.length === 1 ? 'e' : 'i'}</span>
                                )}
                              </div>
                              <ChevronDown size={14} className={`text-stone-400 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                            </div>
                            {isOpen && (
                              <div className="bg-stone-50/40 divide-y divide-stone-100">
                                {clienteDocs.map(doc => {
                                  const meta: DocumentoMetadata = doc.datiEstrattiJson || {};
                                  return (
                                    <div key={doc.id} className="flex items-center justify-between px-5 pl-16 py-2 hover:bg-stone-50 transition-colors">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <FileText size={14} className="text-stone-400 flex-shrink-0" />
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-[#003A7D] truncate">{doc.nomeFile}</p>
                                          <div className="flex items-center gap-2 text-[10px] font-semibold text-stone-400 mt-0.5">
                                            {Number(meta.importoContratto || 0) > 0 && <span className="text-[#003A7D] font-black">€ {Number(meta.importoContratto).toLocaleString('it-IT')}</span>}
                                            {meta.dataContratto && <><span>&bull;</span><span>{new Date(meta.dataContratto).toLocaleDateString('it-IT')}</span></>}
                                            {meta.tipoDocumento === 'Allegato' && <span>Allegato</span>}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 flex-shrink-0">
                                        <button type="button" onClick={() => setPreviewDoc({ id: doc.id, nomeFile: doc.nomeFile })} className="p-2 text-stone-400 hover:text-[#0054B4] hover:bg-blue-50 rounded-lg transition-colors" title="Anteprima">
                                          <Eye size={14} />
                                        </button>
                                        <a href={`${baseUrl}/api/documenti/${doc.id}/download`} target="_blank" rel="noopener noreferrer" className="p-2 text-stone-400 hover:text-[#0054B4] hover:bg-blue-50 rounded-lg transition-colors">
                                          <Download size={14} />
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })}
                                {/* Varianti del cliente */}
                                {clienteVarianti.length > 0 && (
                                  <>
                                    <div className="px-5 pl-16 py-1.5 bg-amber-50/60 flex items-center gap-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                      <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Varianti</span>
                                    </div>
                                    {clienteVarianti.map((v) => {
                                      const vm: DocumentoMetadata = v.datiEstrattiJson || {};
                                      const importoV = Number(vm.importoVariante || 0);
                                      const isExpanded = expandedVariantiIds.has(v.id);
                                      const voci: VarianteVoce[] = (vm.voci as VarianteVoce[]) || [];

                                      return (
                                        <div key={v.id}>
                                          <div className="flex items-center justify-between px-5 pl-16 py-2 hover:bg-stone-50/60 transition-colors">
                                            <button
                                              type="button"
                                              onClick={() => setExpandedVariantiIds(prev => { const s = new Set(prev); s.has(v.id) ? s.delete(v.id) : s.add(v.id); return s; })}
                                              className="flex items-center gap-2 min-w-0 text-left flex-1"
                                            >
                                              <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-[10px] font-black ${vm.segno === '-' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {vm.segno === '-' ? '−' : '+'}
                                              </div>
                                              <div className="min-w-0">
                                                <p className="text-xs font-bold text-[#003A7D] truncate">{vm.descrizione || v.nomeFile}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                                                  {importoV > 0 && <span className={`font-black ${vm.segno === '-' ? 'text-red-500' : 'text-emerald-600'}`}>{vm.segno === '-' ? '−' : '+'} € {importoV.toLocaleString('it-IT')}</span>}
                                                  {vm.dataVariante && <><span>&bull;</span><span>{new Date(vm.dataVariante).toLocaleDateString('it-IT')}</span></>}
                                                  {voci.length > 0 && <><span>&bull;</span><span>{voci.length} voc{voci.length === 1 ? 'e' : 'i'}</span></>}
                                                  <span className={`text-[9px] font-black uppercase tracking-widest ${isExpanded ? 'text-[#0054B4]' : 'text-stone-300'}`}>{isExpanded ? '▲ chiudi' : '▼ dettagli'}</span>
                                                </div>
                                              </div>
                                            </button>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                              <button
                                                type="button"
                                                onClick={() => onEditVariante(v.id, {
                                                  nomeCliente: typeof vm.nomeCliente === 'string' ? vm.nomeCliente : undefined,
                                                  dataVariante: typeof vm.dataVariante === 'string' ? vm.dataVariante : undefined,
                                                  voci: Array.isArray(vm.voci) ? vm.voci as VarianteVoce[] : undefined,
                                                }, bcForVariante)}
                                                className="p-1.5 text-stone-400 hover:text-[#0054B4] hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Modifica variante"
                                              >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                              </button>
                                              <button type="button" onClick={() => setPreviewDoc({ id: v.id, nomeFile: v.nomeFile })} className="p-1.5 text-stone-400 hover:text-[#0054B4] hover:bg-blue-50 rounded-lg transition-colors" title="Anteprima">
                                                <Eye size={13} />
                                              </button>
                                              <a href={`${baseUrl}/api/documenti/${v.id}/download`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-stone-400 hover:text-[#0054B4] hover:bg-blue-50 rounded-lg transition-colors">
                                                <Download size={13} />
                                              </a>
                                              <button
                                                type="button"
                                                onClick={() => onDeleteVariante(v.id)}
                                                className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Elimina variante"
                                              >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                                              </button>
                                            </div>
                                          </div>
                                          {isExpanded && (
                                            <div className="pl-20 pr-3 pb-3 bg-stone-50/40">
                                              {voci.length > 0 ? (
                                                <div className="border border-stone-200 rounded-xl overflow-hidden">
                                                  <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] bg-stone-100 border-b border-stone-200">
                                                    {['Fornitore', 'Descrizione', 'U.M.', 'Q.tà', 'P.Unit. €', 'Totale €'].map(h => (
                                                      <div key={h} className="px-2 py-1.5 text-[8px] font-black text-stone-400 uppercase tracking-widest">{h}</div>
                                                    ))}
                                                  </div>
                                                  {voci.map((voce, vi) => {
                                                    const tot = (parseFloat(voce.qty) || 0) * (parseFloat(voce.prezzoUnit) || 0);
                                                    return (
                                                      <div key={vi} className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] border-b border-stone-100 last:border-b-0">
                                                        <div className="px-2 py-1.5 text-xs text-stone-500 border-r border-stone-100">{voce.fornitore || '—'}</div>
                                                        <div className="px-2 py-1.5 text-xs text-[#003A7D] font-semibold border-r border-stone-100">{voce.descrizione || '—'}</div>
                                                        <div className="px-2 py-1.5 text-xs text-stone-500 border-r border-stone-100">{voce.um || '—'}</div>
                                                        <div className="px-2 py-1.5 text-xs text-stone-500 border-r border-stone-100">{voce.qty || '—'}</div>
                                                        <div className="px-2 py-1.5 text-xs text-stone-500 border-r border-stone-100">{voce.prezzoUnit ? `€ ${Number(voce.prezzoUnit).toLocaleString('it-IT')}` : '—'}</div>
                                                        <div className="px-2 py-1.5 text-xs font-black text-[#003A7D]">{tot > 0 ? `€ ${tot.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}</div>
                                                      </div>
                                                    );
                                                  })}
                                                  <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] bg-stone-50 border-t border-stone-200">
                                                    <div className="col-span-5 px-2 py-1.5 text-[9px] font-black text-stone-400 uppercase tracking-widest">Totale variante</div>
                                                    <div className="px-2 py-1.5 text-xs font-black text-[#003A7D]">{vm.segno === '-' ? '−' : '+'} € {importoV.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                  </div>
                                                </div>
                                              ) : (
                                                <p className="text-xs text-stone-400 py-2">Nessun dettaglio voci disponibile.</p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {nonVarianti.length === 0 && tutteVarianti.length === 0 && (
                        <div className="px-5 py-4 text-center text-xs text-stone-400">Nessun documento caricato.</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // Contratti Fornitore section
            if (section.label === 'Contratti Fornitore') {
              const fornitori = [...new Set(section.docs.map(d => d.datiEstrattiJson?.ragioneSociale).filter(Boolean))] as string[];

              return (
                <div key={section.label} className="bg-white border border-stone-400 rounded-2xl shadow-xl shadow-stone-400/50 overflow-hidden">
                  <div className="px-5 py-3 bg-stone-50 border-b border-stone-100 flex items-center gap-2">
                    <FolderOpen size={13} className="text-[#0054B4]" />
                    <span className="text-[10px] font-black text-[#003A7D] uppercase tracking-widest">{section.label}</span>
                    <span className="ml-auto text-[10px] font-bold text-stone-400">{section.docs.length} file</span>
                    {fornitori.length > 0 && (
                      <button
                        onClick={() => {
                          setAllegatiFornitoreList(fornitori);
                          setShowAllegatiFornitoreModal(true);
                        }}
                        className="ml-2 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                      >+ Documenti</button>
                    )}
                  </div>

                  <div className="divide-y divide-stone-100">
                    {fornitori.map(fornitore => {
                      const fornitDocs = section.docs.filter(d => d.datiEstrattiJson?.ragioneSociale === fornitore);
                      const isOpen = expandedFornitori.has(fornitore);
                      return (
                        <div key={fornitore}>
                          <div
                            className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors cursor-pointer select-none"
                            onClick={() => setExpandedFornitori(prev => { const s = new Set(prev); s.has(fornitore) ? s.delete(fornitore) : s.add(fornitore); return s; })}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 bg-stone-100 text-stone-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FolderOpen size={15} />
                              </div>
                              <p className="text-sm font-bold text-[#003A7D] truncate">{fornitore}</p>
                              <span className="text-[10px] font-semibold text-stone-400">{fornitDocs.length} file</span>
                            </div>
                            <ChevronDown size={14} className={`text-stone-400 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                          </div>
                          {isOpen && (
                            <div className="bg-stone-50/40 divide-y divide-stone-100">
                              {fornitDocs.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between px-5 pl-16 py-2 hover:bg-stone-50 transition-colors">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <FileText size={14} className="text-stone-400 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-[#003A7D] truncate">{doc.nomeFile}</p>
                                      <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                                        {doc.datiEstrattiJson?.referente && <span>{doc.datiEstrattiJson.referente}</span>}
                                        {doc.datiEstrattiJson?.dataContratto && <><span>&bull;</span><span>{new Date(doc.datiEstrattiJson.dataContratto).toLocaleDateString('it-IT')}</span></>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button type="button" onClick={() => setPreviewDoc({ id: doc.id, nomeFile: doc.nomeFile })} className="p-2 text-stone-400 hover:text-[#0054B4] hover:bg-blue-50 rounded-lg transition-colors" title="Anteprima">
                                      <Eye size={14} />
                                    </button>
                                    <a href={`${baseUrl}/api/documenti/${doc.id}/download`} target="_blank" rel="noopener noreferrer" className="p-2 text-stone-400 hover:text-[#0054B4] hover:bg-blue-50 rounded-lg transition-colors">
                                      <Download size={14} />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Generic section
            return (
              <div key={section.label} className="bg-white border border-stone-200 rounded-2xl shadow-xl shadow-stone-400/50 overflow-hidden">
                <div className="px-5 py-3 bg-stone-50 border-b border-stone-100 flex items-center gap-2">
                  <FolderOpen size={13} className="text-[#0054B4]" />
                  <span className="text-[10px] font-black text-[#003A7D] uppercase tracking-widest">{section.label}</span>
                  <span className="ml-auto text-[10px] font-bold text-stone-400">{section.docs.length} file</span>
                </div>
                <div className="divide-y divide-stone-100">
                  {section.docs.map((doc) => {
                    const meta: DocumentoMetadata = doc.datiEstrattiJson || {};
                    const displayName = meta.nome || meta.nomeCliente || meta.ragioneSociale || doc.nomeFile;
                    return (
                      <div key={doc.id} className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 bg-stone-100 text-stone-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={15} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#003A7D] truncate">{displayName}</p>
                            <div className="flex items-center gap-2 text-[10px] font-semibold text-stone-400 mt-0.5">
                              {meta.importoContratto && <span className="text-[#003A7D] font-black">€ {Number(meta.importoContratto).toLocaleString('it-IT')}</span>}
                              {meta.importoContratto && <span>&bull;</span>}
                              {meta.dataContratto && <span>{new Date(meta.dataContratto).toLocaleDateString('it-IT')}</span>}
                              {meta.dataContratto && <span>&bull;</span>}
                              {meta.referente && <span>{meta.referente}</span>}
                              {meta.referente && <span>&bull;</span>}
                              <span className="truncate text-stone-300">{doc.nomeFile}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button type="button" onClick={() => setPreviewDoc({ id: doc.id, nomeFile: doc.nomeFile })} className="p-2 text-stone-400 hover:text-[#0054B4] hover:bg-blue-50 rounded-lg transition-colors" title="Anteprima">
                            <Eye size={16} />
                          </button>
                          <a href={`${baseUrl}/api/documenti/${doc.id}/download`} target="_blank" rel="noopener noreferrer" className="p-2 text-stone-400 hover:text-[#0054B4] hover:bg-blue-50 rounded-lg transition-colors">
                            <Download size={16} />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AllegatiClienteModal
        isOpen={showAllegatiClienteModal}
        clienti={allegatiClienteList}
        onClose={() => setShowAllegatiClienteModal(false)}
        onSubmit={(files, nomeCliente, descrizione) => {
          onAllegatiClienteUpload(files, nomeCliente, descrizione);
          setShowAllegatiClienteModal(false);
        }}
      />

      <AllegatiFornitoreModal
        isOpen={showAllegatiFornitoreModal}
        fornitori={allegatiFornitoreList}
        onClose={() => setShowAllegatiFornitoreModal(false)}
        onSubmit={(files, ragioneSociale, descrizione) => {
          onAllegatiFornitoreUpload(files, ragioneSociale, descrizione);
          setShowAllegatiFornitoreModal(false);
        }}
      />
    </div>
  );
}
