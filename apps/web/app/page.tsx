'use client';

import { AlertCircle, AlertTriangle, Archive, ArrowLeft, Briefcase, Loader2, LogOut, MapPin, Menu, Trash2, User, UserCheck, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmModals } from './components/ConfirmModals';
import { ContrattoClienteModal } from './components/ContrattoClienteModal';
import { ContrattoFornitoreModal } from './components/ContrattoFornitoreModal';
import { CreateCommessaModal } from './components/CreateCommessaModal';
import { DashboardView } from './components/DashboardView';
import { DocProgettualeModal } from './components/DocProgettualeModal';
import { FornitoreDocModal } from './components/FornitoreDocModal';
import { FornituraModals } from './components/FornituraModals';
import { JobProgressBar } from './components/JobProgressBar';
import { PreviewModal } from './components/PreviewModal';
import { TabContabilita } from './components/TabContabilita';
import { TabDocumenti } from './components/TabDocumenti';
import { TabFornitori } from './components/TabFornitori';
import { TabSintesi } from './components/TabSintesi';
import { VarianteModal } from './components/VarianteModal';
import { useAuth } from './context/AuthContext';
import { apiFetch } from './hooks/apiFetch';
import { useAppaltoVoci } from './hooks/useAppaltoVoci';
import { useCommesse } from './hooks/useCommesse';
import { useDocumenti } from './hooks/useDocumenti';
import { useForniture } from './hooks/useForniture';
import { useJobPolling } from './hooks/useJobPolling';
import type { ActiveTab } from './types/domain';

export default function App() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const baseUrl = useMemo(() => (typeof globalThis.window !== 'undefined' ? globalThis.location.origin : ''), []);

  // Redirect al login se non autenticato
  useEffect(() => {
    if (!authLoading && !token) {
      globalThis.location.href = '/login';
    }
  }, [authLoading, token]);

  const commesse = useCommesse(baseUrl, setError);
  const appalto = useAppaltoVoci(baseUrl, commesse.selectedCommessa?.id ?? null, setError);
  const forniture = useForniture(baseUrl, commesse.selectedCommessa, setError);
  const documenti = useDocumenti(baseUrl, commesse.selectedCommessa, setError);
  const jobs = useJobPolling(baseUrl);

  // Documenti Pending
  const [pendingDocs, setPendingDocs] = useState<any[]>([]);
  const fetchPendingDocs = useCallback(async () => {
    try {
      const data = await apiFetch<any[]>(`${baseUrl}/api/documenti/pending`);
      setPendingDocs(data ?? []);
    } catch { /* silenzioso */ }
  }, [baseUrl]);
  useEffect(() => { fetchPendingDocs(); }, [fetchPendingDocs]);

  const handleUpdatePendingDocStato = useCallback(async (docId: string, stato: string) => {
    try {
      await apiFetch(`${baseUrl}/api/documenti/${docId}/stato`, {
        method: 'PATCH',
        body: JSON.stringify({ stato }),
      });
      await fetchPendingDocs();
    } catch { /* silenzioso */ }
  }, [baseUrl, fetchPendingDocs]);

  // Job polling: riprendi eventuali job attivi all'avvio
  useEffect(() => { jobs.fetchRecentJobs(); }, [baseUrl]);

  const fetchDetail = async (id: string, tab?: 'sintesi' | 'documenti' | 'fornitori') => {
    try {
      commesse.setLoading(true);
      commesse.setDeleteInfo(null);
      const data = await apiFetch<any>(`${baseUrl}/api/commesse/${id}`);
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
    { id: 'contabilita', label: 'Contabilità' },
  ];

  if (authLoading || !token) {
    return (
      <div className="min-h-screen bg-[#F2F0EF] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#4B6E48] stroke-[1px]" size={32} />
      </div>
    );
  }

  if (commesse.loading && commesse.view === 'dashboard') {
    // loading handled inline via skeleton cards in DashboardView
  }

  return (
    <div className="min-h-screen flex font-sans selection:bg-[#4B6E48]/5 bg-[#F2F0EF]">
      {/* Hamburger button — solo mobile */}
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-[#4B6E48] text-white shadow-md"
        onClick={() => setSidebarOpen(prev => !prev)}
        aria-label="Apri menu"
      >
        <Menu size={20} />
      </button>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-[55]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`w-20 bg-[#4B6E48] flex flex-col items-center py-8 gap-8 fixed md:sticky top-0 h-screen z-[56] shadow-md transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <button
          onClick={() => { commesse.setView('dashboard'); commesse.setSelectedCommessa(null); }}
          className="flex flex-col items-center gap-1.5 group px-1"
          title="Strade & Servizi - Home"
        >
          <span className="text-white font-black text-base tracking-tight leading-none group-hover:text-blue-200 transition-colors">S</span>
          <span className="text-white/50 font-black text-[8px] tracking-widest uppercase leading-none group-hover:text-white/80 transition-colors">S&S</span>
        </button>

        <nav className="flex flex-col gap-6 w-full">
          <div className="relative flex items-center justify-center group">
            {commesse.view === 'dashboard' && <div className="absolute left-0 w-1 h-6 bg-gray-100 rounded-r-full" />}
            <button
              onClick={() => commesse.setView('dashboard')}
              className={`relative p-4 rounded-xl transition-all ${commesse.view === 'dashboard' ? 'text-white bg-gray-100/10 shadow-inner' : 'text-white/30 hover:text-white/70 hover:bg-gray-100/5'}`}
            >
              <Briefcase size={22} strokeWidth={2.5} />
              {pendingDocs.length > 0 && (
                <span className="absolute top-2 right-2 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-[#B2AC88] text-[7px] font-black text-[#4B6E48] px-0.5">
                  {pendingDocs.length}
                </span>
              )}
            </button>
          </div>
        </nav>

        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
          {user && (
            <span className="text-white/40 text-[8px] uppercase tracking-widest text-center leading-tight px-1" title={user.email}>
              {user.nome || user.email.split('@')[0]}
            </span>
          )}
          <button
            onClick={logout}
            title="Esci"
            className="p-3 rounded-xl text-white/30 hover:text-white/80 hover:bg-gray-100/10 transition-all"
          >
            <LogOut size={18} strokeWidth={2} />
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-16 max-w-[1200px] mx-auto w-full md:ml-0 ml-0">
        <button
          type="button"
          className="cursor-pointer group w-full flex flex-col items-center text-center mb-12 bg-transparent border-none p-0"
          onClick={() => { commesse.setView('dashboard'); commesse.setSelectedCommessa(null); }}
        >
          <p className="font-bold tracking-[0.4em] text-[9px] uppercase text-[#4B6E48] mb-2">Gestionale Operativo</p>
          <h1 className="text-6xl font-extralight tracking-tighter text-[#4B6E48] group-hover:text-[#4B6E48] transition-colors leading-none">
            Strade <span className="font-medium">&amp; Servizi</span>
          </h1>
          <div className="w-full h-[1px] bg-[#4B6E48] mt-3"></div>
        </button>

        {commesse.view === 'dashboard' ? (
          <DashboardView
            isLoading={commesse.loading}
            commesse={commesse.commesse}
            stats={commesse.stats}
            pendingDocs={pendingDocs}
            onOpenDetail={fetchDetail}
            onPreviewDoc={(doc) => documenti.setPreviewDoc(doc)}
            onCreateCommessa={() => commesse.setShowCreateModal(true)}
            onDeleteFromHome={(c) => { commesse.setCommessaToDelete(c); commesse.setShowHomeDeleteModal(true); }}
            onUpdatePendingDocStato={handleUpdatePendingDocStato}
            page={commesse.page}
            totalPages={commesse.totalPages}
            total={commesse.total}
            onPageChange={(p) => commesse.fetchCommesse(p)}
            pmFolders={commesse.pmFolders}
            onFilterChange={commesse.applyFilters}
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button
              onClick={() => { commesse.setView('dashboard'); commesse.setSelectedCommessa(null); }}
              className="group flex items-center gap-2 text-[#4B6E48] font-bold uppercase text-[8px] tracking-[0.4em] mb-12 hover:translate-x-[-2px] transition-all"
            >
              <ArrowLeft size={12} strokeWidth={2.5} /> Torna alla Dashboard
            </button>

            <header className="mb-8 flex flex-col gap-4 md:flex-row md:justify-between md:items-end">
              <div>
                <p className="text-[#4B6E48] font-bold text-[9px] tracking-[0.4em] uppercase mb-4">Scheda Tecnica Operativa</p>
                <h2 className="text-4xl font-black text-[#4B6E48] tracking-tighter leading-none uppercase">
                  {commesse.selectedCommessa?.codiceIdentificativo}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-[9px] uppercase tracking-widest">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#4B6E48]/10 text-[#4B6E48] font-black">
                    {commesse.selectedCommessa?.tipoOpera || 'Tipologia non definita'}
                  </span>
                  <span className="text-gray-800">&bull;</span>
                  <span className="text-gray-600 flex items-center gap-2">
                    <MapPin size={14} />
                    {commesse.selectedCommessa?.citta
                      ? `${commesse.selectedCommessa.indirizzo}, ${commesse.selectedCommessa.cap} ${commesse.selectedCommessa.citta}`
                      : (commesse.selectedCommessa?.indirizzo || 'Indirizzo non presente')}
                  </span>
                </div>
              </div>
              <div className="flex flex-row flex-wrap gap-2 md:flex-col md:items-end md:gap-4">
                <button
                  onClick={() => commesse.setShowCloseModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 text-[#4B6E48] hover:bg-gray-50 hover:border-[#4B6E48] rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  <Archive size={12} strokeWidth={2.5} />
                  Chiudi Cantiere
                </button>
                <button
                  onClick={() => commesse.setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  <Trash2 size={12} strokeWidth={2.5} />
                  Elimina Commessa
                </button>
              </div>
            </header>

            <div className="flex flex-wrap items-center gap-4 mb-10 pb-10 border-b border-gray-300">
              <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-600/50 rounded-lg flex items-center justify-center text-gray-600"><User size={14} /></div>
                <div>
                  <span className="text-[8px] font-black text-gray-600 uppercase block tracking-widest">Committente</span>
                  <span className="text-xs font-bold text-[#4B6E48] uppercase">{commesse.selectedCommessa?.committente || 'N/D'}</span>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#4B6E48]"><UserCheck size={14} /></div>
                <div>
                  <span className="text-[8px] font-black text-[#4B6E48]/70 uppercase block tracking-widest">Project Manager</span>
                  <span className="text-xs font-bold text-[#4B6E48] uppercase">{commesse.selectedCommessa?.responsabile || 'N/D'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 md:gap-8 border-b border-gray-300 mb-8 overflow-x-auto pb-px">
              {detailTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => commesse.setActiveTab(tab.id)}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${commesse.activeTab === tab.id ? 'text-[#4B6E48]' : 'text-[#4B6E48]/50 hover:text-[#4B6E48]/80'}`}
                >
                  {tab.label}
                  {commesse.activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4B6E48] rounded-t-full"></span>
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
                onReplaceVarianteFile={documenti.handleReplaceVarianteFile}
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

            {commesse.activeTab === 'contabilita' && commesse.selectedCommessa && (
              <TabContabilita
                commessaId={commesse.selectedCommessa.id}
                baseUrl={baseUrl}
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
          <div className="bg-gray-100 rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3">
            <Loader2 className="animate-spin text-[#4B6E48]" size={20} />
            <span className="text-sm font-bold text-[#4B6E48]">Caricamento in corso...</span>
          </div>
        </div>
      )}

      {commesse.isClosing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] flex items-center justify-center">
          <div className="bg-gray-100 rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3">
            <Archive className="text-[#4B6E48]" size={20} />
            <span className="text-sm font-bold text-[#4B6E48]">Chiusura cantiere in corso...</span>
          </div>
        </div>
      )}

      {commesse.isDeleting && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] flex items-center justify-center">
          <div className="bg-gray-100 rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={20} />
            <span className="text-sm font-bold text-[#4B6E48]">Eliminazione in corso...</span>
          </div>
        </div>
      )}

      {/* Job Progress Bar — visibile durante import Excel attivo */}
      {jobs.activeJob && (
        <JobProgressBar job={jobs.activeJob} onDismiss={jobs.dismissJob} />
      )}
    </div>
  );
}
