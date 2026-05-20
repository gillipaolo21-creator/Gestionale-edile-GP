'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from './apiFetch';
import type { ActiveTab, Commessa, Fattura } from '../types/domain';

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
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHomeDeleteModal, setShowHomeDeleteModal] = useState(false);

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
      const data = await apiFetch<{ totaleImporti: number; totaleBudget: number; avanzamentoMedio: number }>(`${baseUrl}/api/commesse/stats`);
      setApiStats({
        totaleCommesse: data.totaleImporti ?? 0,
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
    showCloseModal, setShowCloseModal,
    showDeleteModal, setShowDeleteModal,
    showHomeDeleteModal, setShowHomeDeleteModal,
    fetchCommesse,
    fetchDeleteInfo,
    handleCreateCommessa,
    handleCloseCreateModal,
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


