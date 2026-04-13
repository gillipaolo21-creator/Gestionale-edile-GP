'use client';
import React, { useEffect, useMemo, useState } from 'react';
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

  const fetchCommesse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/commesse`);
      if (!res.ok) throw new Error('Sincronizzazione API fallita');
      const data = await res.json();
      setCommesse(data as Commessa[]);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore di connessione al database');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeleteInfo = async (commessaId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/commesse/${commessaId}/delete-info`);
      if (!res.ok) throw new Error('Impossibile verificare i file della commessa');
      const data = await res.json();
      setDeleteInfo(data);
    } catch {
      setDeleteInfo(null);
    }
  };

  const suggestNextCode = useMemo(() => {
    const year = new Date().getFullYear();
    const count = commesse.length + 1;
    const paddedCount = count.toString().padStart(3, '0');
    return `${year}-COMM-${paddedCount}`;
  }, [commesse]);

  useEffect(() => {
    const loadNextCode = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/commesse/next-code`);
        if (!res.ok) throw new Error('Impossibile generare il codice automatico');
        const data = await res.json();
        setFormData((prev) => ({ ...prev, codiceIdentificativo: data.codiceIdentificativo }));
      } catch (err: unknown) {
        setFormData((prev) => ({ ...prev, codiceIdentificativo: suggestNextCode }));
        setError(err instanceof Error ? err.message : 'Impossibile generare il codice automatico');
      }
    };

    if (showCreateModal && !formData.codiceIdentificativo) {
      loadNextCode();
    }
    if (showCreateModal) {
      fetch(`${baseUrl}/api/documenti/pm-folders`)
        .then((r) => r.json())
        .then((data: string[]) => {
          setPmFolders(data);
          setPmMode(data.length > 0 ? 'select' : 'free');
        })
        .catch(() => { setPmFolders([]); setPmMode('free'); });
    }
  }, [showCreateModal, suggestNextCode, baseUrl, formData.codiceIdentificativo]);

  useEffect(() => {
    fetchCommesse();
  }, [baseUrl]);

  const handleCreateCommessa = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/commesse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errorMessage = Array.isArray(errData.message)
          ? errData.message.join(' | ')
          : (errData.message || 'Errore fatale del server durante la registrazione');
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        handleCloseCreateModal();
        fetchCommesse();
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
      const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessa.id}/chiudi`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Errore durante la chiusura');
      }
      setShowCloseModal(false);
      setSelectedCommessa(null);
      setView('dashboard');
      fetchCommesse();
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
      const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessa.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Errore durante eliminazione commessa');
      }
      setShowDeleteModal(false);
      setSelectedCommessa(null);
      setView('dashboard');
      fetchCommesse();
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
      const res = await fetch(`${baseUrl}/api/commesse/${commessaToDelete.id}/home`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Eliminazione non consentita dalla dashboard');
      }
      setShowHomeDeleteModal(false);
      setCommessaToDelete(null);
      fetchCommesse();
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
      await fetch(`${baseUrl}/commesse/${selectedCommessa.id}/data-inizio-lavori`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataInizioLavori: date }),
      });
      setSelectedCommessa({ ...selectedCommessa, dataInizioLavori: date });
      fetchCommesse();
    } catch {
      // silent
    }
  };

  const stats = useMemo(() => {
    const totaleCommesse = commesse.reduce((acc, c) => acc + Number(c.importoCalcolato || 0), 0);
    const costiCommesse = commesse.reduce((acc, c) => {
      const costi = c.fatture?.reduce((sum: number, f: Fattura) => sum + Number(f.importoImponibile || 0), 0) || 0;
      return acc + costi;
    }, 0);
    const avanzamento = commesse.length > 0
      ? commesse.reduce((acc, c) => acc + (c.sals?.[0]?.percentualeCompletamento || 0), 0) / commesse.length
      : 0;
    return { totaleCommesse, costiCommesse, avanzamento: avanzamento.toFixed(1) };
  }, [commesse]);

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
  };
}
