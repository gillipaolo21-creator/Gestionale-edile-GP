'use client';

import { AlertCircle, AlertTriangle, Archive, ArrowLeft, Briefcase, Loader2, MapPin, Trash2, User, UserCheck, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmModals } from './components/ConfirmModals';
import { ContrattoClienteModal } from './components/ContrattoClienteModal';
import { ContrattoFornitoreModal } from './components/ContrattoFornitoreModal';
import { CreateCommessaModal } from './components/CreateCommessaModal';
import { DashboardView } from './components/DashboardView';
import { DocProgettualeModal } from './components/DocProgettualeModal';
import { FornitoreDocModal } from './components/FornitoreDocModal';
import { FornituraModals } from './components/FornituraModals';
import { PreviewModal } from './components/PreviewModal';
import { TabDocumenti } from './components/TabDocumenti';
import { TabFornitori } from './components/TabFornitori';
import { TabSintesi } from './components/TabSintesi';
import { VarianteModal } from './components/VarianteModal';
import { useAppaltoVoci } from './hooks/useAppaltoVoci';
import { useCommesse } from './hooks/useCommesse';
import { useDocumenti } from './hooks/useDocumenti';
import { useForniture } from './hooks/useForniture';
import type { ActiveTab } from './types/domain';

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const baseUrl = useMemo(() => (typeof window !== 'undefined' ? window.location.origin : ''), []);

  const commesse = useCommesse(baseUrl, setError);
  const appalto = useAppaltoVoci(baseUrl, commesse.selectedCommessa?.id ?? null, setError);
  const forniture = useForniture(baseUrl, commesse.selectedCommessa, setError);
  const documenti = useDocumenti(baseUrl, commesse.selectedCommessa, setError);

  // Documenti Pending
  const [pendingDocs, setPendingDocs] = useState<any[]>([]);
  const fetchPendingDocs = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/api/documenti/pending`);
      if (res.ok) setPendingDocs(await res.json());
    } catch { /* silenzioso */ }
  }, [baseUrl]);
  useEffect(() => { fetchPendingDocs(); }, [fetchPendingDocs]);

  const fetchDetail = async (id: string, tab?: 'sintesi' | 'documenti' | 'fornitori') => {
    try {
      commesse.setLoading(true);
      commesse.setDeleteInfo(null);
      const res = await fetch(`${baseUrl}/api/commesse/${id}`);
      if (!res.ok) throw new Error('Dettaglio non disponibile');
      const data = await res.json();
      commesse.setSelectedCommessa(data);
      commesse.setView('detail');
      commesse.setActiveTab(tab || 'sintesi');

      await Promise.all([
        documenti.fetchDocumenti(data.id),
        forniture.fetchFornitureMateriali(data.id),
        forniture.fetchFornitureServizi(data.id),
        appalto.fetchAppaltoVoci(data.id),
      ]);
      await commesse.fetchDeleteInfo(data.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore inatteso durante il caricamento della commessa');
    } finally {
      commesse.setLoading(false);
    }
  };

  const detailTabs: { id: ActiveTab; label: string }[] = [
    { id: 'sintesi', label: 'Sintesi & Avanzamento' },
    { id: 'documenti', label: 'Archivio Documentale' },
    { id: 'fornitori', label: 'Gestione Fornitori' },
  ];

  if (commesse.loading && commesse.view === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0054B4] stroke-[1px]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans selection:bg-[#0054B4]/5 bg-texture">
      <aside className="w-20 bg-[#003A7D] flex flex-col items-center py-8 gap-8 sticky top-0 h-screen z-50 shadow-md">
        <button
          onClick={() => { commesse.setView('dashboard'); commesse.setSelectedCommessa(null); }}
          className="flex flex-col items-center gap-1.5 group px-1"
          title="Bresciani Group - Home"
        >
          <span className="text-white font-black text-base tracking-tight leading-none group-hover:text-blue-200 transition-colors">B</span>
          <span className="text-white/50 font-black text-[8px] tracking-widest uppercase leading-none group-hover:text-white/80 transition-colors">Group</span>
        </button>

        <nav className="flex flex-col gap-6 w-full">
          <div className="relative flex items-center justify-center group">
            {commesse.view === 'dashboard' && <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />}
            <button
              onClick={() => commesse.setView('dashboard')}
              className={`p-4 rounded-xl transition-all ${commesse.view === 'dashboard' ? 'text-white bg-white/10 shadow-inner' : 'text-white/30 hover:text-white/70 hover:bg-white/5'}`}
            >
              <Briefcase size={22} strokeWidth={2.5} />
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-16 max-w-[1200px] mx-auto w-full">
        <div
          className="cursor-pointer group w-full flex flex-col items-center text-center mb-12"
          onClick={() => { commesse.setView('dashboard'); commesse.setSelectedCommessa(null); }}
        >
          <p className="font-bold tracking-[0.4em] text-[9px] uppercase text-[#0054B4] mb-2">Gestionale Operativo</p>
          <h1 className="text-6xl font-extralight tracking-tighter text-[#003A7D] group-hover:text-[#0054B4] transition-colors leading-none">
            Bresciani <span className="font-medium">Group</span>
          </h1>
          <div className="w-full h-[1px] bg-[#003A7D] mt-3"></div>
        </div>

        {commesse.view === 'dashboard' ? (
          <DashboardView
            commesse={commesse.commesse}
            stats={commesse.stats}
            pendingDocs={pendingDocs}
            onOpenDetail={fetchDetail}
            onPreviewDoc={(doc) => documenti.setPreviewDoc(doc)}
            onCreateCommessa={() => commesse.setShowCreateModal(true)}
            onDeleteFromHome={(c) => { commesse.setCommessaToDelete(c); commesse.setShowHomeDeleteModal(true); }}
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button
              onClick={() => { commesse.setView('dashboard'); commesse.setSelectedCommessa(null); }}
              className="group flex items-center gap-2 text-[#0054B4] font-bold uppercase text-[8px] tracking-[0.4em] mb-12 hover:translate-x-[-2px] transition-all"
            >
              <ArrowLeft size={12} strokeWidth={2.5} /> Torna alla Dashboard
            </button>

            <header className="mb-8 flex justify-between items-end">
              <div>
                <p className="text-[#0054B4] font-bold text-[9px] tracking-[0.4em] uppercase mb-4">Scheda Tecnica Operativa</p>
                <h2 className="text-4xl font-black text-[#003A7D] tracking-tighter leading-none uppercase">
                  {commesse.selectedCommessa?.codiceIdentificativo}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-[9px] uppercase tracking-widest">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0054B4]/10 text-[#0054B4] font-black">
                    {commesse.selectedCommessa?.tipoLavori || 'Tipologia non definita'}
                  </span>
                  <span className="text-stone-300">&bull;</span>
                  <span className="text-stone-500 flex items-center gap-2">
                    <MapPin size={14} />
                    {commesse.selectedCommessa?.citta
                      ? `${commesse.selectedCommessa.indirizzo}, ${commesse.selectedCommessa.cap} ${commesse.selectedCommessa.citta}`
                      : (commesse.selectedCommessa?.indirizzo || 'Indirizzo non presente')}
                  </span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-4">
                <button
                  onClick={() => commesse.setShowCloseModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-[#003A7D] hover:bg-stone-50 hover:border-[#0054B4] rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  <Archive size={12} strokeWidth={2.5} />
                  Chiudi Cantiere
                </button>
                <button
                  onClick={() => commesse.setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  <Trash2 size={12} strokeWidth={2.5} />
                  Elimina Commessa
                </button>
              </div>
            </header>

            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-stone-200">
              <div className="px-4 py-3 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500"><User size={14} /></div>
                <div>
                  <span className="text-[8px] font-black text-stone-400 uppercase block tracking-widest">Committente</span>
                  <span className="text-xs font-bold text-[#003A7D] uppercase">{commesse.selectedCommessa?.nomeCliente || 'N/D'}</span>
                </div>
              </div>
              <div className="px-4 py-3 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#0054B4]"><UserCheck size={14} /></div>
                <div>
                  <span className="text-[8px] font-black text-[#0054B4]/70 uppercase block tracking-widest">Project Manager</span>
                  <span className="text-xs font-bold text-[#0054B4] uppercase">{commesse.selectedCommessa?.responsabile || 'N/D'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-8 border-b border-stone-200 mb-8">
              {detailTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => commesse.setActiveTab(tab.id)}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${commesse.activeTab === tab.id ? 'text-[#0054B4]' : 'text-[#003A7D]/50 hover:text-[#003A7D]/80'}`}
                >
                  {tab.label}
                  {commesse.activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0054B4] rounded-t-full"></span>
                  )}
                </button>
              ))}
            </div>

            {commesse.activeTab === 'sintesi' && commesse.selectedCommessa && (
              <TabSintesi
                selectedCommessa={commesse.selectedCommessa}
                appaltoRowsFlat={appalto.appaltoRowsFlat}
                isSavingAppalto={appalto.isSavingAppalto}
                onAddRow={appalto.handleAddAppaltoRow}
                onAddChildRow={appalto.handleAddAppaltoChildRow}
                onUpdateRow={appalto.handleUpdateAppaltoRow}
                onRemoveRow={appalto.handleRemoveAppaltoRow}
                onToggleRow={appalto.toggleAppaltoRow}
                onSave={appalto.handleSaveAppaltoRows}
                onUpdateDataInizioLavori={commesse.handleUpdateDataInizioLavori}
              />
            )}

            {commesse.activeTab === 'documenti' && (
              <TabDocumenti
                documenti={documenti.documenti}
                baseUrl={baseUrl}
                fornitoriEsistenti={documenti.fornitoriEsistenti}
                setPreviewDoc={documenti.setPreviewDoc}
                onDeleteVariante={documenti.handleDeleteVariante}
                onOpenContrattoCliente={() => documenti.setShowContrattoClienteModal(true)}
                onOpenContrattoFornitore={() => documenti.openContrattoFornitore(documenti.fornitoriEsistenti)}
                onOpenDocProgettuale={() => documenti.setShowDocProgettualeModal(true)}
                onOpenVariante={(baseContratti) => documenti.openVarianteForNew(baseContratti)}
                onEditVariante={(id, vm, baseContratti) => documenti.openVarianteForEdit(id, vm, baseContratti)}
                onAllegatiClienteUpload={documenti.handleAllegatiClienteUpload}
                onAllegatiFornitoreUpload={documenti.handleAllegatiFornitoreUpload}
              />
            )}

            {commesse.activeTab === 'fornitori' && (
              <TabFornitori
                fornitoriDaDocumenti={documenti.fornitoriDaDocumenti}
                docOperativiPerFornitore={documenti.docOperativiPerFornitore}
                baseUrl={baseUrl}
                handleUpdateDocStato={documenti.handleUpdateDocStato}
                setPreviewDoc={documenti.setPreviewDoc}
                onAddDocForFornitore={(fornitore) => documenti.openFornitoreDoc(fornitore)}
              />
            )}
          </div>
        )}
      </main>

      <PreviewModal previewDoc={documenti.previewDoc} setPreviewDoc={documenti.setPreviewDoc} baseUrl={baseUrl} />

      <CreateCommessaModal
        isOpen={commesse.showCreateModal}
        success={commesse.success}
        submitting={commesse.submitting}
        formData={commesse.formData}
        setFormData={commesse.setFormData}
        pmFolders={commesse.pmFolders}
        pmMode={commesse.pmMode}
        setPmMode={commesse.setPmMode}
        onClose={commesse.handleCloseCreateModal}
        onSubmit={commesse.handleCreateCommessa}
      />

      <ConfirmModals
        showCloseModal={commesse.showCloseModal}
        onCloseCancel={() => commesse.setShowCloseModal(false)}
        onCloseConfirm={commesse.handleCloseCommessa}
        showDeleteModal={commesse.showDeleteModal}
        onDeleteCancel={() => commesse.setShowDeleteModal(false)}
        onDeleteConfirm={commesse.handleDeleteCommessa}
        showHomeDeleteModal={commesse.showHomeDeleteModal}
        onHomeDeleteCancel={() => commesse.setShowHomeDeleteModal(false)}
        onHomeDeleteConfirm={commesse.handleDeleteFromHome}
        selectedCommessa={commesse.selectedCommessa}
        commessaToDelete={commesse.commessaToDelete}
        deleteInfo={commesse.deleteInfo}
        isClosing={commesse.isClosing}
        isDeleting={commesse.isDeleting}
      />

      <FornituraModals
        showMaterialModal={forniture.showMaterialModal}
        onMaterialClose={() => forniture.setShowMaterialModal(false)}
        showServiceModal={forniture.showServiceModal}
        onServiceClose={() => forniture.setShowServiceModal(false)}
        materialForm={forniture.materialForm}
        setMaterialForm={forniture.setMaterialForm}
        materialFile={forniture.materialFile}
        setMaterialFile={forniture.setMaterialFile}
        serviceForm={forniture.serviceForm}
        setServiceForm={forniture.setServiceForm}
        serviceFile={forniture.serviceFile}
        setServiceFile={forniture.setServiceFile}
        isSavingMaterial={forniture.isSavingMaterial}
        isSavingService={forniture.isSavingService}
        onMaterialSubmit={forniture.handleCreateFornituraMateriale}
        onServiceSubmit={forniture.handleCreateFornituraServizio}
      />

      <ContrattoClienteModal
        isOpen={documenti.showContrattoClienteModal}
        onClose={() => documenti.setShowContrattoClienteModal(false)}
        form={documenti.contrattoClienteForm}
        setForm={documenti.setContrattoClienteForm}
        files={documenti.contrattoClienteFiles}
        setFiles={documenti.setContrattoClienteFiles}
        isSaving={documenti.isSavingContrattoCliente}
        onSubmit={documenti.handleContrattoClienteUpload}
      />

      <VarianteModal
        isOpen={documenti.showVarianteModal}
        onClose={() => documenti.setShowVarianteModal(false)}
        form={documenti.varianteForm}
        setForm={documenti.setVarianteForm}
        files={documenti.varianteFiles}
        setFiles={documenti.setVarianteFiles}
        isSaving={documenti.isSavingVariante}
        baseContratti={documenti.varianteBaseContratti}
        editingId={documenti.editingVarianteId}
        fornitoriEsistenti={documenti.fornitoriEsistenti}
        onSubmit={documenti.handleVarianteUpload}
      />

      <ContrattoFornitoreModal
        isOpen={documenti.showContrattoFornitoreModal}
        onClose={() => documenti.setShowContrattoFornitoreModal(false)}
        form={documenti.contrattoFornitoreForm}
        setForm={documenti.setContrattoFornitoreForm}
        files={documenti.contrattoFornitoreFiles}
        setFiles={documenti.setContrattoFornitoreFiles}
        isSaving={documenti.isSavingContrattoFornitore}
        fornitoriEsistenti={documenti.fornitoriEsistenti}
        onSubmit={documenti.handleContrattoFornitoreUpload}
      />

      <DocProgettualeModal
        isOpen={documenti.showDocProgettualeModal}
        onClose={() => documenti.setShowDocProgettualeModal(false)}
        form={documenti.docProgettualeForm}
        setForm={documenti.setDocProgettualeForm}
        files={documenti.docProgettualeFiles}
        setFiles={documenti.setDocProgettualeFiles}
        isSaving={documenti.isSavingDocProgettuale}
        onSubmit={documenti.handleDocProgettualeUpload}
      />

      <FornitoreDocModal
        isOpen={documenti.showFornitoreDocModal}
        onClose={() => documenti.setShowFornitoreDocModal(false)}
        fornitore={documenti.selectedFornitore}
        form={documenti.fornitoreDocForm}
        setForm={documenti.setFornitoreDocForm}
        files={documenti.fornitoreDocFiles}
        setFiles={documenti.setFornitoreDocFiles}
        isSaving={documenti.isSavingFornitoreDoc}
        onSubmit={documenti.handleFornitoreDocUpload}
      />

      {error && (
        <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl shadow-lg flex items-start gap-3 max-w-sm animate-in slide-in-from-bottom-4">
          <AlertCircle className="text-red-500" size={18} />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1">Errore</p>
            <p className="text-sm leading-relaxed">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-auto">
            <X size={14} />
          </button>
        </div>
      )}

      {documenti.isUploading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] flex items-center justify-center">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3">
            <Loader2 className="animate-spin text-[#0054B4]" size={20} />
            <span className="text-sm font-bold text-[#003A7D]">Caricamento in corso...</span>
          </div>
        </div>
      )}

      {commesse.isClosing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] flex items-center justify-center">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3">
            <Archive className="text-[#0054B4]" size={20} />
            <span className="text-sm font-bold text-[#003A7D]">Chiusura cantiere in corso...</span>
          </div>
        </div>
      )}

      {commesse.isDeleting && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] flex items-center justify-center">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={20} />
            <span className="text-sm font-bold text-[#003A7D]">Eliminazione in corso...</span>
          </div>
        </div>
      )}
    </div>
  );
}
