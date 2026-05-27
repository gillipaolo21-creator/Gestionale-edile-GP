'use client';
import React, { useEffect, useMemo, useState } from 'react';
import type { ImportDocMode, ImportFormData } from '../components/ImportCommessaModal';
import type { ActiveTab, Commessa, Fattura } from '../types/domain';
import { apiFetch } from './apiFetch';

const defaultImportFormData = (): ImportFormData => ({
  codiceIdentificativo: '',
  nomeCliente: '',
  tipoOpera: '',
  indirizzo: '',
  citta: '',
  cap: '',
  provincia: '',
  responsabile: '',
  importoContratto: '',
  importoLavoriPropri: '',
  dataInizio: new Date().toISOString().split('T')[0],
  dataFinePrevista: '',
  stato: 'IN_CORSO',
  note: '',
});

type FormData = {
  codiceIdentificativo: string;
  tipoLavori: string;
  nomeCliente: string;
  dataCreazione: string;
  indirizzo: string;
  citta: string;
  cap: string;
  responsabile: string;
};

const defaultFormData = (): FormData => ({
  codiceIdentificativo: '',
  tipoLavori: '',
  nomeCliente: '',
  dataCreazione: new Date().toISOString().split('T')[0],
  indirizzo: '',
  citta: '',
  cap: '',
  responsabile: '',
});

const PAGE_SIZE = 20;

export function useCommesse(
  baseUrl: string,
  setError: (msg: string | null) => void,
) {
  const [view, setView] = useState<'dashboard' | 'detail'>('dashboard');
  const [activeTab, setActiveTab] = useState<ActiveTab>('sintesi');

  const [commesse, setCommesse] = useState<Commessa[]>([]);
  const [selectedCommessa, setSelectedCommessa] = useState<Commessa | null>(null);
  const [commessaToDelete, setCommessaToDelete] = useState<Commessa | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteInfo, setDeleteInfo] = useState<{ hasDocuments: boolean; hasFilesOnDisk: boolean } | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState<FormData>(defaultFormData());
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pmFolders, setPmFolders] = useState<string[]>([]);
  const [pmMode, setPmMode] = useState<'select' | 'free'>('select');

  const [isClosing, setIsClosing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHomeDeleteModal, setShowHomeDeleteModal] = useState(false);

  const [importFormData, setImportFormData] = useState<ImportFormData>(defaultImportFormData());
  const [importSuccess, setImportSuccess] = useState(false);
  const [importSubmitting, setImportSubmitting] = useState(false);

  // Selezione documenti durante import
  const [importDocMode, setImportDocMode] = useState<ImportDocMode>('none');
  const [importPmFolders, setImportPmFolders] = useState<string[]>([]);
  const [importSelectedFolder, setImportSelectedFolder] = useState('');
  const [importFolderFiles, setImportFolderFiles] = useState<{ name: string; size: number }[]>([]);
  const [importSelectedFileNames, setImportSelectedFileNames] = useState<Set<string>>(new Set());
  const [importLocalFiles, setImportLocalFiles] = useState<File[]>([]);
  const [loadingFolderFiles, setLoadingFolderFiles] = useState(false);

  // Stats aggregate dal server (tutti i record, non solo la pagina corrente)
  const [apiStats, setApiStats] = useState<{ totaleCommesse: number; costiCommesse: number; avanzamento: string } | null>(null);

  // Filtri attivi
  const [filters, setFilters] = useState<{
    stato?: string;
    responsabile?: string;
    anno?: string;
    citta?: string;
    search?: string;
  }>({});

  const fetchCommesse = async (targetPage = page, activeFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(targetPage), limit: String(PAGE_SIZE) });
      if (activeFilters.stato) params.set('stato', activeFilters.stato);
      if (activeFilters.responsabile) params.set('responsabile', activeFilters.responsabile);
      if (activeFilters.anno) params.set('anno', activeFilters.anno);
      if (activeFilters.citta) params.set('citta', activeFilters.citta);
      if (activeFilters.search) params.set('search', activeFilters.search);
      const result = await apiFetch<{ data: Commessa[]; total: number; totalPages: number }>(`${baseUrl}/api/commesse?${params.toString()}`);
      setCommesse(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setPage(targetPage);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore di connessione al database');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchCommesse(1, newFilters);
  };

  const fetchStats = async () => {
    try {
      const data = await apiFetch<{ totaleCommesse: number; totaleImporti: number; totaleBudget: number; avanzamentoMedio: number }>(`${baseUrl}/api/commesse/stats`);
      setApiStats({
        totaleCommesse: data.totaleCommesse ?? 0,
        costiCommesse: data.totaleBudget ?? 0,
        avanzamento: (data.avanzamentoMedio ?? 0).toFixed(1),
      });
    } catch { /* silent */ }
  };

  const fetchDeleteInfo = async (commessaId: string) => {
    try {
      const data = await apiFetch<{ hasDocuments: boolean; hasFilesOnDisk: boolean }>(`${baseUrl}/api/commesse/${commessaId}/delete-info`);
      setDeleteInfo(data);
    } catch {
      setDeleteInfo(null);
    }
  };

  const suggestNextCode = useMemo(() => {
    const year = new Date().getFullYear();
    const count = total + 1;
    const paddedCount = count.toString().padStart(3, '0');
    return `${year}-COMM-${paddedCount}`;
  }, [total]);

  useEffect(() => {
    if (showCreateModal && !formData.codiceIdentificativo) {
      const loadNextCode = async () => {
        try {
          const data = await apiFetch<{ codiceIdentificativo: string }>(`${baseUrl}/api/commesse/next-code`);
          setFormData((prev) => ({ ...prev, codiceIdentificativo: data.codiceIdentificativo }));
        } catch (err: unknown) {
          setFormData((prev) => ({ ...prev, codiceIdentificativo: suggestNextCode }));
          setError(err instanceof Error ? err.message : 'Impossibile generare il codice automatico');
        }
      };
      loadNextCode();
    }
    if (showCreateModal) {
      apiFetch<string[]>(`${baseUrl}/api/documenti/pm-folders`)
        .then((data) => {
          setPmFolders(data);
          setPmMode(data.length > 0 ? 'select' : 'free');
        })
        .catch(() => { setPmFolders([]); setPmMode('free'); });
    }
  }, [showCreateModal, suggestNextCode, baseUrl, formData.codiceIdentificativo]);

  useEffect(() => {
    if (showImportModal) {
      apiFetch<string[]>(`${baseUrl}/api/documenti/pm-folders`)
        .then((data) => setImportPmFolders(data ?? []))
        .catch(() => setImportPmFolders([]));
    }
  }, [showImportModal, baseUrl]);

  const handleSelectImportFolder = async (folder: string) => {
    setImportSelectedFolder(folder);
    setImportSelectedFileNames(new Set());
    if (!folder) { setImportFolderFiles([]); return; }
    setLoadingFolderFiles(true);
    try {
      const files = await apiFetch<{ name: string; size: number }[]>(
        `${baseUrl}/api/documenti/pm-folders/${encodeURIComponent(folder)}/files`,
      );
      setImportFolderFiles(files ?? []);
    } catch {
      setImportFolderFiles([]);
    } finally {
      setLoadingFolderFiles(false);
    }
  };

  const toggleImportFileName = (name: string) => {
    setImportSelectedFileNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  useEffect(() => {
    fetchCommesse(1);
    fetchStats();
  }, [baseUrl]);

  const handleCreateCommessa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch(`${baseUrl}/api/commesse`, {
        method: 'POST',
        body: JSON.stringify({
          codiceIdentificativo: formData.codiceIdentificativo,
          tipoLavori: formData.tipoLavori,
          nomeCantiere: `${formData.codiceIdentificativo} - ${formData.citta || formData.indirizzo}`,
          nomeCliente: formData.nomeCliente,
          dataInizio: formData.dataCreazione,
          indirizzo: formData.indirizzo,
          citta: formData.citta,
          cap: formData.cap,
          responsabile: formData.responsabile,
        }),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        handleCloseCreateModal();
        fetchCommesse(1);
        fetchStats();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante la creazione della commessa');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setPmMode('select');
    setPmFolders([]);
    setFormData(defaultFormData());
  };

  const handleImportCommessa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImportSubmitting(true);
    try {
      const newCommessa = await apiFetch<{ id: string }>(`${baseUrl}/api/commesse`, {
        method: 'POST',
        body: JSON.stringify({
          codiceIdentificativo: importFormData.codiceIdentificativo,
          nomeCliente: importFormData.nomeCliente,
          committente: importFormData.nomeCliente,
          nomeCantiere: `${importFormData.codiceIdentificativo} - ${importFormData.citta || importFormData.indirizzo}`,
          tipoOpera: importFormData.tipoOpera || undefined,
          indirizzo: importFormData.indirizzo,
          citta: importFormData.citta,
          cap: importFormData.cap,
          provincia: importFormData.provincia,
          responsabile: importFormData.responsabile,
          importoContratto: importFormData.importoContratto ? Number(importFormData.importoContratto) : undefined,
          importoLavoriPropri: importFormData.importoLavoriPropri ? Number(importFormData.importoLavoriPropri) : undefined,
          dataInizio: importFormData.dataInizio || undefined,
          dataFinePrevista: importFormData.dataFinePrevista || undefined,
          stato: importFormData.stato,
          note: importFormData.note || undefined,
        }),
      });

      // Import documenti dalla cartella server
      if (importDocMode === 'server' && importSelectedFolder && importSelectedFileNames.size > 0) {
        await apiFetch(`${baseUrl}/api/documenti/pm-folders/${encodeURIComponent(importSelectedFolder)}/import`, {
          method: 'POST',
          body: JSON.stringify({
            commessaId: newCommessa.id,
            fileNames: Array.from(importSelectedFileNames),
            categoria: 'Documentazione Progettuale',
          }),
        });
      }

      // Import documenti locali
      if (importDocMode === 'local' && importLocalFiles.length > 0) {
        for (const file of importLocalFiles) {
          const payload = new FormData();
          payload.append('file', file);
          payload.append('entitaTipo', 'COMMESSA');
          payload.append('entitaId', newCommessa.id);
          payload.append('categoria', 'Documentazione Progettuale');
          await apiFetch(`${baseUrl}/api/documenti/upload`, { method: 'POST', body: payload });
        }
      }

      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        setShowImportModal(false);
        setImportFormData(defaultImportFormData());
        setImportDocMode('none');
        setImportSelectedFolder('');
        setImportFolderFiles([]);
        setImportSelectedFileNames(new Set());
        setImportLocalFiles([]);
        fetchCommesse(1);
        fetchStats();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'importazione della commessa');
    } finally {
      setImportSubmitting(false);
    }
  };

  const handleCloseCommessa = async () => {
    if (!selectedCommessa) return;
    setIsClosing(true);
    setError(null);
    try {
      await apiFetch(`${baseUrl}/api/commesse/${selectedCommessa.id}/chiudi`, { method: 'PATCH' });
      setShowCloseModal(false);
      setSelectedCommessa(null);
      setView('dashboard');
      fetchCommesse(page);
    } catch (err: unknown) {
      setShowCloseModal(false);
      setError(err instanceof Error ? err.message : 'Errore durante la chiusura commessa');
    } finally {
      setIsClosing(false);
    }
  };

  const handleDeleteCommessa = async () => {
    if (!selectedCommessa) return;
    setIsDeleting(true);
    setError(null);
    try {
      await apiFetch(`${baseUrl}/api/commesse/${selectedCommessa.id}`, { method: 'DELETE' });
      setShowDeleteModal(false);
      setSelectedCommessa(null);
      setView('dashboard');
      fetchCommesse(page);
      fetchStats();
    } catch (err: unknown) {
      setShowDeleteModal(false);
      setError(err instanceof Error ? err.message : 'Errore durante eliminazione commessa');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteFromHome = async () => {
    if (!commessaToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await apiFetch(`${baseUrl}/api/commesse/${commessaToDelete.id}`, { method: 'DELETE' });
      setShowHomeDeleteModal(false);
      setCommessaToDelete(null);
      fetchCommesse(page);
      fetchStats();
    } catch (err: unknown) {
      setShowHomeDeleteModal(false);
      setError(err instanceof Error ? err.message : 'Errore durante eliminazione dalla dashboard');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateDataInizioLavori = async (date: string | null) => {
    if (!selectedCommessa) return;
    try {
      await apiFetch(`${baseUrl}/api/commesse/${selectedCommessa.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ dataInizio: date }),
      });
      fetchCommesse(page);
    } catch {
      // silent
    }
  };

  // Fallback stats calcolate dalla pagina corrente se l'API non ha ancora risposto
  const localStats = useMemo(() => {
    const totaleCommesse = commesse.reduce((acc, c) => acc + Number((c as any).importoContratto || 0), 0);
    const costiCommesse = commesse.reduce((acc, c) => {
      const costi = c.fatture?.reduce((sum: number, f: Fattura) => sum + Number(f.importoImponibile || 0), 0) || 0;
      return acc + costi;
    }, 0);
    const avanzamento = commesse.length > 0
      ? commesse.reduce((acc, c) => acc + Number(c.sals?.[0]?.percentualeCompletamento || 0), 0) / commesse.length
      : 0;
    return { totaleCommesse, costiCommesse, avanzamento: avanzamento.toFixed(1) };
  }, [commesse]);

  const stats = apiStats ?? localStats;

  return {
    view, setView,
    activeTab, setActiveTab,
    commesse,
    selectedCommessa, setSelectedCommessa,
    commessaToDelete, setCommessaToDelete,
    loading, setLoading,
    deleteInfo, setDeleteInfo,
    formData, setFormData,
    success,
    submitting,
    pmFolders, setPmFolders,
    pmMode, setPmMode,
    isClosing,
    isDeleting,
    showCreateModal, setShowCreateModal,
    showImportModal, setShowImportModal,
    importFormData, setImportFormData,
    importSuccess,
    importSubmitting,
    importDocMode, setImportDocMode,
    importPmFolders,
    importSelectedFolder,
    importFolderFiles,
    importSelectedFileNames,
    importLocalFiles, setImportLocalFiles,
    loadingFolderFiles,
    handleSelectImportFolder,
    toggleImportFileName,
    showCloseModal, setShowCloseModal,
    showDeleteModal, setShowDeleteModal,
    showHomeDeleteModal, setShowHomeDeleteModal,
    fetchCommesse,
    fetchDeleteInfo,
    handleCreateCommessa,
    handleCloseCreateModal,
    handleImportCommessa,
    handleCloseCommessa,
    handleDeleteCommessa,
    handleDeleteFromHome,
    handleUpdateDataInizioLavori,
    stats,
    page,
    totalPages,
    total,
    filters,
    applyFilters,
  };
}


