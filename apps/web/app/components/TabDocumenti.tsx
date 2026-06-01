'use client';
import { Building2, ChevronDown, Download, Eye, FileText, FolderOpen, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { downloadDocumentoAutenticato } from '../hooks/documentiClient';
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
  onReplaceVarianteFile: (documentoId: string, file: File) => void;
  onDeleteDocumenti: (documentoIds: string[]) => Promise<void>;
  onCreateFornitore: () => void;
}

function DocumentUploadCard({ title, description, category, onOpen }: Readonly<{ title: string; description: string; category: string; onOpen: () => void }>) {
  return (
    <div className="bg-gray-100 p-5 rounded-2xl border border-slate-300 shadow-xl shadow-slate-300/50 group hover:border-[#4B6E48]/30 transition-all flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-blue-50 text-[#4B6E48] rounded-xl flex items-center justify-center flex-shrink-0">
          <FolderOpen size={16} strokeWidth={2} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#4B6E48]">{title}</h4>
          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{category}</span>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-4 flex-1">{description}</p>
      <button
        type="button"
        onClick={onOpen}
        className="w-full border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center gap-2 transition-colors hover:bg-gray-50 hover:border-[#4B6E48]/50 cursor-pointer"
      >
        <UploadCloud size={16} className="text-gray-600 group-hover:text-[#4B6E48]" />
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Carica documento</span>
      </button>
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
  onReplaceVarianteFile,
  onDeleteDocumenti,
  onCreateFornitore,
}: Readonly<TabDocumentiProps>) {
  const [expandedVariantiIds, setExpandedVariantiIds] = useState<Set<string>>(new Set());
  const [showAllegatiClienteModal, setShowAllegatiClienteModal] = useState(false);
  const [allegatiClienteList, setAllegatiClienteList] = useState<string[]>([]);
  const [showAllegatiFornitoreModal, setShowAllegatiFornitoreModal] = useState(false);
  const [allegatiFornitoreList, setAllegatiFornitoreList] = useState<string[]>([]);
  const [expandedFornitori, setExpandedFornitori] = useState<Set<string>>(new Set());
  const [expandedClienti, setExpandedClienti] = useState<Set<string>>(new Set());
  const [selectedClienteIds, setSelectedClienteIds] = useState<Set<string>>(new Set());
  const [selectedFornitoreIds, setSelectedFornitoreIds] = useState<Set<string>>(new Set());
  const [selectedProgettualiIds, setSelectedProgettualiIds] = useState<Set<string>>(new Set());

  // ── Filtri ─────────────────────────────────────────────────────────────
  const [filterCategoria, setFilterCategoria] = useState<string>('');
  const [filterDataDa, setFilterDataDa] = useState<string>('');
  const [filterDataA, setFilterDataA] = useState<string>('');

  // Ref per nascondere il file input di sostituzione file
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingDocId, setReplacingDocId] = useState<string | null>(null);

  const NO_CLIENT_REFERENCE = 'Senza riferimento cliente';
  const NO_FORNITORE_REFERENCE = 'Senza riferimento fornitore';

  const getClienteReference = (doc: Documento): string => {
    const nomeCliente = doc.datiEstrattiJson?.nomeCliente;
    if (typeof nomeCliente === 'string' && nomeCliente.trim()) {
      return nomeCliente.trim();
    }
    if (typeof doc.sottocategoria === 'string' && doc.sottocategoria.trim()) {
      return doc.sottocategoria.trim();
    }
    return NO_CLIENT_REFERENCE;
  };

  const getFornitoreReference = (doc: Documento): string => {
    const ragioneSociale = doc.datiEstrattiJson?.ragioneSociale;
    if (typeof ragioneSociale === 'string' && ragioneSociale.trim()) {
      return ragioneSociale.trim();
    }
    if (typeof doc.sottocategoria === 'string' && doc.sottocategoria.trim()) {
      return doc.sottocategoria.trim();
    }
    return NO_FORNITORE_REFERENCE;
  };

  const handleReplaceClick = (docId: string) => {
    setReplacingDocId(docId);
    replaceInputRef.current?.click();
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && replacingDocId) {
      onReplaceVarianteFile(replacingDocId, file);
    }
    // Reset per permettere ri-selezione dello stesso file
    e.target.value = '';
    setReplacingDocId(null);
  };

  const handleDownloadDocumento = async (docId: string, nomeFile: string) => {
    try {
      await downloadDocumentoAutenticato(baseUrl, docId, nomeFile);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Errore durante il download del documento');
    }
  };

  const keepOnlyExistingIds = (prev: Set<string>, valid: Set<string>): Set<string> => {
    const next = new Set<string>();
    prev.forEach((id) => {
      if (valid.has(id)) next.add(id);
    });
    return next;
  };

  const removeIdsFromSet = (prev: Set<string>, idsToRemove: string[]): Set<string> => {
    if (idsToRemove.length === 0) return prev;
    const next = new Set(prev);
    idsToRemove.forEach((id) => {
      next.delete(id);
    });
    return next;
  };

  const getSelectedIdsForDocs = (docs: Documento[], selectedIds: Set<string>): string[] => (
    docs.filter((doc) => selectedIds.has(doc.id)).map((doc) => doc.id)
  );

  useEffect(() => {
    const clienteIds = new Set(
      documenti
        .filter((doc) => doc.categoria === 'Contratti Cliente')
        .map((doc) => doc.id),
    );
    const fornitoreIds = new Set(
      documenti
        .filter((doc) => doc.categoria === 'Contratti Fornitori')
        .map((doc) => doc.id),
    );
    const progettualiIds = new Set(
      documenti
        .filter((doc) => doc.categoria === 'Documentazione Progettuale')
        .map((doc) => doc.id),
    );

    setSelectedClienteIds((prev) => keepOnlyExistingIds(prev, clienteIds));
    setSelectedFornitoreIds((prev) => keepOnlyExistingIds(prev, fornitoreIds));
    setSelectedProgettualiIds((prev) => keepOnlyExistingIds(prev, progettualiIds));
  }, [documenti]);

  const toggleClienteSelection = (docId: string) => {
    setSelectedClienteIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  };

  const selectAllCliente = (docs: Documento[]) => {
    setSelectedClienteIds(new Set(docs.map((doc) => doc.id)));
  };

  const clearClienteSelection = () => {
    setSelectedClienteIds(new Set());
  };

  const handleDeleteSelectedCliente = async (documentoIds: string[]) => {
    const ids = Array.from(new Set(documentoIds));
    if (ids.length === 0) return;
    if (!confirm(`Eliminare ${ids.length} documento/i selezionato/i?`)) return;
    await onDeleteDocumenti(ids);
    setSelectedClienteIds((prev) => removeIdsFromSet(prev, ids));
  };

  const toggleFornitoreSelection = (docId: string) => {
    setSelectedFornitoreIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  };

  const selectAllFornitori = (docs: Documento[]) => {
    setSelectedFornitoreIds(new Set(docs.map((doc) => doc.id)));
  };

  const clearFornitoriSelection = () => {
    setSelectedFornitoreIds(new Set());
  };

  const handleDeleteSelectedFornitori = async (documentoIds: string[]) => {
    const ids = Array.from(new Set(documentoIds));
    if (ids.length === 0) return;
    if (!confirm(`Eliminare ${ids.length} documento/i selezionato/i?`)) return;
    await onDeleteDocumenti(ids);
    setSelectedFornitoreIds((prev) => removeIdsFromSet(prev, ids));
  };

  const toggleProgettualeSelection = (docId: string) => {
    setSelectedProgettualiIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  };

  const selectAllProgettuali = (docs: Documento[]) => {
    setSelectedProgettualiIds(new Set(docs.map((doc) => doc.id)));
  };

  const clearProgettualiSelection = () => {
    setSelectedProgettualiIds(new Set());
  };

  const handleDeleteSelectedProgettuali = async (documentoIds: string[]) => {
    const ids = Array.from(new Set(documentoIds));
    if (ids.length === 0) return;
    if (!confirm(`Eliminare ${ids.length} documento/i selezionato/i?`)) return;
    await onDeleteDocumenti(ids);
    setSelectedProgettualiIds((prev) => removeIdsFromSet(prev, ids));
  };

  const MACRO_CATEGORIE = [
    { key: 'Contratti Cliente', label: 'Contratto Cliente' },
    { key: 'Contratti Fornitori', label: 'Contratti Fornitore' },
    { key: 'Documentazione Progettuale', label: 'Documentazione Progettuale' },
  ];

  // Applica filtri per categoria e data
  const isDocVisibleByFilters = (doc: Documento): boolean => {
    if (filterCategoria && doc.categoria !== filterCategoria) return false;
    if (filterDataDa && doc.createdAt && doc.createdAt < filterDataDa) return false;
    if (filterDataA && doc.createdAt && doc.createdAt > `${filterDataA}T23:59:59`) return false;
    return true;
  };

  const filteredDocumenti = documenti.filter(isDocVisibleByFilters);

  const categorized = new Map<string, Documento[]>();
  for (const doc of filteredDocumenti) {
    const found = MACRO_CATEGORIE.find(m => m.key === doc.categoria);
    if (found) {
      const list = categorized.get(found.key) ?? [];
      list.push(doc);
      categorized.set(found.key, list);
    }
  }
  const sections = MACRO_CATEGORIE
    .map(m => ({ label: m.label, key: m.key, docs: categorized.get(m.key) ?? [] }));

  useEffect(() => {
    const visibleClienteIds = new Set(
      documenti
        .filter((doc) => doc.categoria === 'Contratti Cliente' && isDocVisibleByFilters(doc))
        .map((doc) => doc.id),
    );
    const visibleFornitoreIds = new Set(
      documenti
        .filter((doc) => doc.categoria === 'Contratti Fornitori' && isDocVisibleByFilters(doc))
        .map((doc) => doc.id),
    );
    const visibleProgettualiIds = new Set(
      documenti
        .filter((doc) => doc.categoria === 'Documentazione Progettuale' && isDocVisibleByFilters(doc))
        .map((doc) => doc.id),
    );

    setSelectedClienteIds((prev) => keepOnlyExistingIds(prev, visibleClienteIds));
    setSelectedFornitoreIds((prev) => keepOnlyExistingIds(prev, visibleFornitoreIds));
    setSelectedProgettualiIds((prev) => keepOnlyExistingIds(prev, visibleProgettualiIds));
  }, [documenti, filterCategoria, filterDataDa, filterDataA]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
      {/* Input nascosto per sostituzione file */}
      <input
        ref={replaceInputRef}
        type="file"
        className="hidden"
        onChange={handleReplaceFileChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt,.zip"
      />

      {/* Barra filtri */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Filtri:</span>
        <select
          value={filterCategoria}
          onChange={e => setFilterCategoria(e.target.value)}
          className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-[#4B6E48] font-semibold focus:outline-none focus:ring-1 focus:ring-[#4B6E48]"
        >
          <option value="">Tutte le categorie</option>
          {MACRO_CATEGORIE.map(m => (
            <option key={m.key} value={m.key}>{m.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Dal</span>
          <input
            type="date"
            value={filterDataDa}
            onChange={e => setFilterDataDa(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4B6E48]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Al</span>
          <input
            type="date"
            value={filterDataA}
            onChange={e => setFilterDataA(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4B6E48]"
          />
        </div>
        {(filterCategoria || filterDataDa || filterDataA) && (
          <button
            type="button"
            onClick={() => { setFilterCategoria(''); setFilterDataDa(''); setFilterDataA(''); }}
            className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 border border-red-200 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >Azzera</button>
        )}
        {documenti.length !== filteredDocumenti.length && (
          <span className="ml-auto text-[9px] font-bold text-gray-600">
            {filteredDocumenti.length} / {documenti.length} file
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 items-stretch">
        <DocumentUploadCard
          title="Contratti Cliente"
          category="Area Legale / Amministrativa"
          description="Contratto d'appalto, allegati firmati, varianti contrattuali."
          onOpen={onOpenContrattoCliente}
        />

        {/* Card Contratti Fornitori con doppia azione */}
        <div className="bg-gray-100 p-5 rounded-2xl border border-slate-300 shadow-xl shadow-slate-300/50 group hover:border-[#4B6E48]/30 transition-all flex flex-col h-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-50 text-[#4B6E48] rounded-xl flex items-center justify-center flex-shrink-0">
              <FolderOpen size={16} strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#4B6E48]">Contratti Fornitori</h4>
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Area Acquisti</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-4 flex-1">Accordi quadro, contratti di subappalto, condizioni di fornitura.</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onOpenContrattoFornitore()}
              className="w-full border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center gap-2 transition-colors hover:bg-gray-50 hover:border-[#4B6E48]/50 cursor-pointer"
            >
              <UploadCloud size={14} className="text-gray-600" />
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Carica Documento</span>
            </button>
            <button
              type="button"
              onClick={onCreateFornitore}
              className="w-full border border-[#B2AC88] rounded-xl p-3 flex items-center justify-center gap-2 transition-colors hover:bg-[#B2AC88]/10 hover:border-[#4B6E48]/50 cursor-pointer"
            >
              <Building2 size={14} className="text-[#4B6E48]" />
              <span className="text-[10px] font-bold text-[#4B6E48] uppercase tracking-widest">Crea Fornitore</span>
            </button>
          </div>
        </div>

        <DocumentUploadCard
          title="Documentazione Progettuale"
          category="Area Tecnica"
          description="Computo Metrico Estimativo (CME), elaborati grafici, permessi."
          onOpen={onOpenDocProgettuale}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-[#4B6E48] uppercase tracking-widest">Archivio Cloud</h3>
        {sections.map(section => {
            if (section.label === 'Contratto Cliente') {
              const nonVarianti = section.docs.filter((d) => d.datiEstrattiJson?.tipoDocumento !== 'Variante');
              const tutteVarianti = section.docs.filter((d) => d.datiEstrattiJson?.tipoDocumento === 'Variante');
              const clientiNomi = Array.from(
                new Set(
                  [...nonVarianti, ...tutteVarianti].map((d) => getClienteReference(d)),
                ),
              ).sort((a, b) => a.localeCompare(b, 'it'));
              const clientiPerIntegrazione = clientiNomi.filter((nome) => nome !== NO_CLIENT_REFERENCE);
              const bcForVariante = nonVarianti
                .filter(d => d.datiEstrattiJson?.tipoDocumento !== 'Allegato')
                .map((b) => ({ id: b.id, nomeCliente: getClienteReference(b) }));
              const selectedClientVisibleIds = getSelectedIdsForDocs(section.docs, selectedClienteIds);
              const allClientSelected = section.docs.length > 0 && selectedClientVisibleIds.length === section.docs.length;

              return (
                <div key={section.label} className="bg-gray-100 border border-slate-300 rounded-2xl shadow-xl shadow-slate-300/50 overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-stone-100 flex items-center gap-2">
                    <FolderOpen size={13} className="text-[#4B6E48]" />
                    <span className="text-[10px] font-black text-[#4B6E48] uppercase tracking-widest">{section.label}</span>
                    <span className="ml-auto text-[10px] font-bold text-gray-600">{section.docs.length} file</span>
                    {section.docs.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => (allClientSelected ? clearClienteSelection() : selectAllCliente(section.docs))}
                          className="ml-2 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[#4B6E48] border border-[#4B6E48]/30 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          {allClientSelected ? 'Deseleziona' : 'Seleziona tutti'}
                        </button>
                        <button
                          type="button"
                          disabled={selectedClientVisibleIds.length === 0}
                          onClick={() => { void handleDeleteSelectedCliente(selectedClientVisibleIds); }}
                          className="ml-1 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Elimina selezionati
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); onOpenVariante(bcForVariante); }}
                      className="ml-1 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[#4B6E48] border border-[#4B6E48]/30 rounded-lg hover:bg-blue-50 transition-colors"
                    >+ Variante</button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAllegatiClienteList(clientiPerIntegrazione);
                        setShowAllegatiClienteModal(true);
                      }}
                      className="ml-1 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                    >+ Integrazione</button>
                  </div>

                  {/* === SEZIONE DOCUMENTI === */}
                  <div className="border-b border-gray-300">
                    <div className="divide-y divide-stone-100">
                      {clientiNomi.map(clienteName => {
                        const clienteDocs = nonVarianti.filter(d => getClienteReference(d) === clienteName);
                        const clienteVarianti = tutteVarianti.filter(d => getClienteReference(d) === clienteName);
                        const isOpen = !expandedClienti.has(clienteName);
                        const totalFiles = clienteDocs.length + clienteVarianti.length;

                        return (
                          <div key={clienteName}>
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              className="w-full text-left flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer select-none"
                              onClick={() => setExpandedClienti(prev => { const s = new Set(prev); s.has(clienteName) ? s.delete(clienteName) : s.add(clienteName); return s; })}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 bg-blue-50 text-[#4B6E48] rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FolderOpen size={15} />
                                </div>
                                <p className="text-sm font-bold text-[#4B6E48] truncate">{clienteName}</p>
                                <span className="text-[10px] font-semibold text-gray-600">{totalFiles} file</span>
                                {clienteVarianti.length > 0 && (
                                  <span className="text-[10px] font-semibold text-[#4B6E48]">{clienteVarianti.length} variant{clienteVarianti.length === 1 ? 'e' : 'i'}</span>
                                )}
                              </div>
                              <ChevronDown size={14} className={`text-gray-600 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                            </button>
                            {isOpen && (
                              <div className="bg-gray-50/40 divide-y divide-stone-100">
                                {clienteDocs.map(doc => {
                                  const meta: DocumentoMetadata = doc.datiEstrattiJson || {};
                                  const isSelectedClienteDoc = selectedClienteIds.has(doc.id);
                                  return (
                                    <div key={doc.id} className={`flex items-center justify-between px-5 pl-16 py-2 transition-colors ${isSelectedClienteDoc ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                                      <div className="flex items-center gap-3 min-w-0">
                                        <input
                                          type="checkbox"
                                          checked={isSelectedClienteDoc}
                                          onChange={() => toggleClienteSelection(doc.id)}
                                          className="w-4 h-4 rounded border-gray-300 text-[#4B6E48] focus:ring-[#4B6E48]"
                                          aria-label={`Seleziona ${doc.nomeFile}`}
                                        />
                                        <FileText size={14} className="text-gray-600 flex-shrink-0" />
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-[#4B6E48] truncate">{doc.nomeFile}</p>
                                          <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 mt-0.5">
                                            {Number(meta.importoContratto || 0) > 0 && <span className="text-[#4B6E48] font-black">€ {Number(meta.importoContratto).toLocaleString('it-IT')}</span>}
                                            {meta.dataContratto && <><span>&bull;</span><span>{new Date(meta.dataContratto).toLocaleDateString('it-IT')}</span></>}
                                            {meta.tipoDocumento === 'Allegato' && <span>Allegato</span>}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 flex-shrink-0">
                                        <button type="button" onClick={() => setPreviewDoc({ id: doc.id, nomeFile: doc.nomeFile })} className="p-2 text-gray-600 hover:text-[#4B6E48] hover:bg-blue-50 rounded-lg transition-colors" title="Anteprima">
                                          <Eye size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => { void handleDownloadDocumento(doc.id, doc.nomeFile); }}
                                          className="p-2 text-gray-600 hover:text-[#4B6E48] hover:bg-blue-50 rounded-lg transition-colors"
                                          title="Scarica"
                                        >
                                          <Download size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                                {/* Varianti del cliente */}
                                {clienteVarianti.length > 0 && (
                                  <>
                                    <div className="px-5 pl-16 py-1.5 bg-[#F2F0EF]/60 flex items-center gap-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4B6E48]"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                      <span className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest">Varianti</span>
                                    </div>
                                    {clienteVarianti.map((v) => {
                                      const vm: DocumentoMetadata = v.datiEstrattiJson || {};
                                      const importoV = Number(vm.importoVariante || 0);
                                      const isExpanded = expandedVariantiIds.has(v.id);
                                      const isSelectedVariante = selectedClienteIds.has(v.id);
                                      const voci: VarianteVoce[] = (vm.voci as VarianteVoce[]) || [];

                                      return (
                                        <div key={v.id}>
                                          <div className={`flex items-center justify-between px-5 pl-16 py-2 transition-colors ${isSelectedVariante ? 'bg-blue-50/50' : 'hover:bg-gray-50/60'}`}>
                                            <button
                                              type="button"
                                              onClick={() => setExpandedVariantiIds(prev => { const s = new Set(prev); s.has(v.id) ? s.delete(v.id) : s.add(v.id); return s; })}
                                              className="flex items-center gap-2 min-w-0 text-left flex-1"
                                            >
                                              <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-[10px] font-black ${vm.segno === '-' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {vm.segno === '-' ? '−' : '+'}
                                              </div>
                                              <div className="min-w-0">
                                                <p className="text-xs font-bold text-[#4B6E48] truncate">{vm.descrizione || v.nomeFile}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-600 mt-0.5">
                                                  {importoV > 0 && <span className={`font-black ${vm.segno === '-' ? 'text-red-500' : 'text-emerald-600'}`}>{vm.segno === '-' ? '−' : '+'} € {importoV.toLocaleString('it-IT')}</span>}
                                                  {vm.dataVariante && <><span>&bull;</span><span>{new Date(vm.dataVariante).toLocaleDateString('it-IT')}</span></>}
                                                  {voci.length > 0 && <><span>&bull;</span><span>{voci.length} voc{voci.length === 1 ? 'e' : 'i'}</span></>}
                                                  <span className={`text-[9px] font-black uppercase tracking-widest ${isExpanded ? 'text-[#4B6E48]' : 'text-gray-800'}`}>{isExpanded ? '▲ chiudi' : '▼ dettagli'}</span>
                                                </div>
                                              </div>
                                            </button>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                              <input
                                                type="checkbox"
                                                checked={isSelectedVariante}
                                                onChange={() => toggleClienteSelection(v.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-[#4B6E48] focus:ring-[#4B6E48]"
                                                aria-label={`Seleziona ${v.nomeFile}`}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => onEditVariante(v.id, {
                                                  nomeCliente: typeof vm.nomeCliente === 'string' ? vm.nomeCliente : undefined,
                                                  dataVariante: typeof vm.dataVariante === 'string' ? vm.dataVariante : undefined,
                                                  voci: Array.isArray(vm.voci) ? vm.voci as VarianteVoce[] : undefined,
                                                }, bcForVariante)}
                                                className="p-1.5 text-gray-600 hover:text-[#4B6E48] hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Modifica variante"
                                              >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleReplaceClick(v.id)}
                                                className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Sostituisci file (backup automatico)"
                                              >
                                                <RefreshCw size={13} />
                                              </button>
                                              <button type="button" onClick={() => setPreviewDoc({ id: v.id, nomeFile: v.nomeFile })} className="p-1.5 text-gray-600 hover:text-[#4B6E48] hover:bg-blue-50 rounded-lg transition-colors" title="Anteprima">
                                                <Eye size={13} />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => { void handleDownloadDocumento(v.id, v.nomeFile); }}
                                                className="p-1.5 text-gray-600 hover:text-[#4B6E48] hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Scarica"
                                              >
                                                <Download size={13} />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => onDeleteVariante(v.id)}
                                                className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Elimina variante"
                                              >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                                              </button>
                                            </div>
                                          </div>
                                          {isExpanded && (
                                            <div className="pl-20 pr-3 pb-3 bg-gray-50/40">
                                              {voci.length > 0 ? (
                                                <div className="border border-gray-300 rounded-xl overflow-hidden">
                                                  <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] bg-slate-600/50 border-b border-gray-300">
                                                    {['Fornitore', 'Descrizione', 'U.M.', 'Q.tà', 'P.Unit. €', 'Totale €'].map(h => (
                                                      <div key={h} className="px-2 py-1.5 text-[8px] font-black text-gray-600 uppercase tracking-widest">{h}</div>
                                                    ))}
                                                  </div>
                                                  {voci.map((voce, vi) => {
                                                    const tot = (parseFloat(voce.qty) || 0) * (parseFloat(voce.prezzoUnit) || 0);
                                                    return (
                                                      <div key={vi} className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] border-b border-stone-100 last:border-b-0">
                                                        <div className="px-2 py-1.5 text-xs text-gray-600 border-r border-stone-100">{voce.fornitore || '—'}</div>
                                                        <div className="px-2 py-1.5 text-xs text-[#4B6E48] font-semibold border-r border-stone-100">{voce.descrizione || '—'}</div>
                                                        <div className="px-2 py-1.5 text-xs text-gray-600 border-r border-stone-100">{voce.um || '—'}</div>
                                                        <div className="px-2 py-1.5 text-xs text-gray-600 border-r border-stone-100">{voce.qty || '—'}</div>
                                                        <div className="px-2 py-1.5 text-xs text-gray-600 border-r border-stone-100">{voce.prezzoUnit ? `€ ${Number(voce.prezzoUnit).toLocaleString('it-IT')}` : '—'}</div>
                                                        <div className="px-2 py-1.5 text-xs font-black text-[#4B6E48]">{tot > 0 ? `€ ${tot.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}</div>
                                                      </div>
                                                    );
                                                  })}
                                                  <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] bg-gray-50 border-t border-gray-300">
                                                    <div className="col-span-5 px-2 py-1.5 text-[9px] font-black text-gray-600 uppercase tracking-widest">Totale variante</div>
                                                    <div className="px-2 py-1.5 text-xs font-black text-[#4B6E48]">{vm.segno === '-' ? '−' : '+'} € {importoV.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                  </div>
                                                </div>
                                              ) : (
                                                <p className="text-xs text-gray-600 py-2">Nessun dettaglio voci disponibile.</p>
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
                        <div className="px-5 py-4 text-center text-xs text-gray-600">Nessun documento caricato.</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // Contratti Fornitore section
            if (section.label === 'Contratti Fornitore') {
              const fornitori = Array.from(
                new Set(section.docs.map((d) => getFornitoreReference(d))),
              ).sort((a, b) => a.localeCompare(b, 'it'));
              const fornitoriPerIntegrazione = fornitori.filter((nome) => nome !== NO_FORNITORE_REFERENCE);
              const selectedFornitoriVisibleIds = getSelectedIdsForDocs(section.docs, selectedFornitoreIds);
              const allFornitoriSelected = section.docs.length > 0 && selectedFornitoriVisibleIds.length === section.docs.length;

              return (
                <div key={section.label} className="bg-gray-100 border border-slate-300 rounded-2xl shadow-xl shadow-slate-300/50 overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-stone-100 flex items-center gap-2">
                    <FolderOpen size={13} className="text-[#4B6E48]" />
                    <span className="text-[10px] font-black text-[#4B6E48] uppercase tracking-widest">{section.label}</span>
                    <span className="ml-auto text-[10px] font-bold text-gray-600">{section.docs.length} file</span>
                    {section.docs.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => (allFornitoriSelected ? clearFornitoriSelection() : selectAllFornitori(section.docs))}
                          className="ml-2 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[#4B6E48] border border-[#4B6E48]/30 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          {allFornitoriSelected ? 'Deseleziona' : 'Seleziona tutti'}
                        </button>
                        <button
                          type="button"
                          disabled={selectedFornitoriVisibleIds.length === 0}
                          onClick={() => { void handleDeleteSelectedFornitori(selectedFornitoriVisibleIds); }}
                          className="ml-1 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Elimina selezionati
                        </button>
                      </>
                    )}
                    {fornitori.length > 0 && (
                      <button
                        onClick={() => {
                          setAllegatiFornitoreList(fornitoriPerIntegrazione);
                          setShowAllegatiFornitoreModal(true);
                        }}
                        className="ml-1 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
                      >+ Documenti</button>
                    )}
                  </div>

                  <div className="divide-y divide-stone-100">
                    {fornitori.map(fornitore => {
                      const fornitDocs = section.docs.filter(d => getFornitoreReference(d) === fornitore);
                      const isOpen = !expandedFornitori.has(fornitore);
                      return (
                        <div key={fornitore}>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            className="w-full text-left flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer select-none"
                            onClick={() => setExpandedFornitori(prev => { const s = new Set(prev); s.has(fornitore) ? s.delete(fornitore) : s.add(fornitore); return s; })}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 bg-slate-600/50 text-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FolderOpen size={15} />
                              </div>
                              <p className="text-sm font-bold text-[#4B6E48] truncate">{fornitore}</p>
                              <span className="text-[10px] font-semibold text-gray-600">{fornitDocs.length} file</span>
                            </div>
                            <ChevronDown size={14} className={`text-gray-600 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                          </button>
                          {isOpen && (
                            <div className="bg-gray-50/40 divide-y divide-stone-100">
                              {fornitDocs.map(doc => {
                                const isSelectedFornitoreDoc = selectedFornitoreIds.has(doc.id);
                                return (
                                  <div key={doc.id} className={`flex items-center justify-between px-5 pl-16 py-2 transition-colors ${isSelectedFornitoreDoc ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-3 min-w-0">
                                      <input
                                        type="checkbox"
                                        checked={isSelectedFornitoreDoc}
                                        onChange={() => toggleFornitoreSelection(doc.id)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#4B6E48] focus:ring-[#4B6E48]"
                                        aria-label={`Seleziona ${doc.nomeFile}`}
                                      />
                                      <FileText size={14} className="text-gray-600 flex-shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-xs font-bold text-[#4B6E48] truncate">{doc.nomeFile}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-600 mt-0.5">
                                          {doc.datiEstrattiJson?.referente && <span>{doc.datiEstrattiJson.referente}</span>}
                                          {doc.datiEstrattiJson?.dataContratto && <><span>&bull;</span><span>{new Date(doc.datiEstrattiJson.dataContratto).toLocaleDateString('it-IT')}</span></>}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <button type="button" onClick={() => setPreviewDoc({ id: doc.id, nomeFile: doc.nomeFile })} className="p-2 text-gray-600 hover:text-[#4B6E48] hover:bg-blue-50 rounded-lg transition-colors" title="Anteprima">
                                        <Eye size={14} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => { void handleDownloadDocumento(doc.id, doc.nomeFile); }}
                                        className="p-2 text-gray-600 hover:text-[#4B6E48] hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Scarica"
                                      >
                                        <Download size={14} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {fornitori.length === 0 && (
                      <div className="px-5 py-4 text-center text-xs text-gray-600">Nessun documento caricato.</div>
                    )}
                  </div>
                </div>
              );
            }

            // Documentazione progettuale section
            if (section.key === 'Documentazione Progettuale') {
              const selectedProgettualiVisibleIds = getSelectedIdsForDocs(section.docs, selectedProgettualiIds);
              const allSelected = section.docs.length > 0 && selectedProgettualiVisibleIds.length === section.docs.length;

              return (
                <div key={section.label} className="bg-gray-100 border border-gray-300 rounded-2xl shadow-xl shadow-slate-300/50 overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-stone-100 flex items-center gap-2">
                    <FolderOpen size={13} className="text-[#4B6E48]" />
                    <span className="text-[10px] font-black text-[#4B6E48] uppercase tracking-widest">{section.label}</span>
                    <span className="ml-auto text-[10px] font-bold text-gray-600">{section.docs.length} file</span>
                    {section.docs.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => (allSelected ? clearProgettualiSelection() : selectAllProgettuali(section.docs))}
                          className="ml-2 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[#4B6E48] border border-[#4B6E48]/30 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          {allSelected ? 'Deseleziona' : 'Seleziona tutti'}
                        </button>
                        <button
                          type="button"
                          disabled={selectedProgettualiVisibleIds.length === 0}
                          onClick={() => { void handleDeleteSelectedProgettuali(selectedProgettualiVisibleIds); }}
                          className="ml-1 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Elimina selezionati
                        </button>
                      </>
                    )}
                  </div>

                  {section.docs.length === 0 ? (
                    <div className="px-5 py-4 text-center text-xs text-gray-600">Nessun documento caricato.</div>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {section.docs.map((doc) => {
                        const meta: DocumentoMetadata = doc.datiEstrattiJson || {};
                        const displayName = meta.nome || meta.nomeCliente || meta.ragioneSociale || doc.nomeFile;
                        const isSelected = selectedProgettualiIds.has(doc.id);

                        return (
                          <div key={doc.id} className={`flex items-center justify-between px-5 py-3 transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                            <div className="flex items-center gap-3 min-w-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleProgettualeSelection(doc.id)}
                                className="w-4 h-4 rounded border-gray-300 text-[#4B6E48] focus:ring-[#4B6E48]"
                                aria-label={`Seleziona ${doc.nomeFile}`}
                              />
                              <div className="w-8 h-8 bg-slate-600/50 text-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText size={15} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-[#4B6E48] truncate">{displayName}</p>
                                <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 mt-0.5">
                                  {meta.descrizione && <span className="truncate">{String(meta.descrizione)}</span>}
                                  {meta.descrizione && <span>&bull;</span>}
                                  <span className="truncate text-gray-800">{doc.nomeFile}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button type="button" onClick={() => setPreviewDoc({ id: doc.id, nomeFile: doc.nomeFile })} className="p-2 text-gray-600 hover:text-[#4B6E48] hover:bg-blue-50 rounded-lg transition-colors" title="Anteprima">
                                <Eye size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => { void handleDownloadDocumento(doc.id, doc.nomeFile); }}
                                className="p-2 text-gray-600 hover:text-[#4B6E48] hover:bg-blue-50 rounded-lg transition-colors"
                                title="Scarica"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!confirm('Eliminare il documento selezionato?')) return;
                                  void onDeleteDocumenti([doc.id]);
                                }}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Elimina documento"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Generic fallback section
            return (
              <div key={section.label} className="bg-gray-100 border border-gray-300 rounded-2xl shadow-xl shadow-slate-300/50 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-stone-100 flex items-center gap-2">
                  <FolderOpen size={13} className="text-[#4B6E48]" />
                  <span className="text-[10px] font-black text-[#4B6E48] uppercase tracking-widest">{section.label}</span>
                  <span className="ml-auto text-[10px] font-bold text-gray-600">{section.docs.length} file</span>
                </div>
                {section.docs.length === 0 ? (
                  <div className="px-5 py-4 text-center text-xs text-gray-600">Nessun documento caricato.</div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {section.docs.map((doc) => {
                      const meta: DocumentoMetadata = doc.datiEstrattiJson || {};
                      const displayName = meta.nome || meta.nomeCliente || meta.ragioneSociale || doc.nomeFile;
                      return (
                        <div key={doc.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 bg-slate-600/50 text-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText size={15} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#4B6E48] truncate">{displayName}</p>
                              <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 mt-0.5">
                                {meta.importoContratto && <span className="text-[#4B6E48] font-black">€ {Number(meta.importoContratto).toLocaleString('it-IT')}</span>}
                                {meta.importoContratto && <span>&bull;</span>}
                                {meta.dataContratto && <span>{new Date(meta.dataContratto).toLocaleDateString('it-IT')}</span>}
                                {meta.dataContratto && <span>&bull;</span>}
                                {meta.referente && <span>{meta.referente}</span>}
                                {meta.referente && <span>&bull;</span>}
                                <span className="truncate text-gray-800">{doc.nomeFile}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button type="button" onClick={() => setPreviewDoc({ id: doc.id, nomeFile: doc.nomeFile })} className="p-2 text-gray-600 hover:text-[#4B6E48] hover:bg-blue-50 rounded-lg transition-colors" title="Anteprima">
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => { void handleDownloadDocumento(doc.id, doc.nomeFile); }}
                              className="p-2 text-gray-600 hover:text-[#4B6E48] hover:bg-blue-50 rounded-lg transition-colors"
                              title="Scarica"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
        })}
      </div>

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
