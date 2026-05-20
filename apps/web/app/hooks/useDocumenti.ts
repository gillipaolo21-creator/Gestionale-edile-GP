'use client';
import React, { useMemo, useState } from 'react';
import type { VarianteVoce } from '../components/VarianteModal';
import type { Commessa, Documento, DocumentoMetadata, Fornitore } from '../types/domain';
import { apiFetch } from './apiFetch';

type ContrattoClienteForm = {
  nomeCliente: string;
  dataContratto: string;
  importoContratto: string;
  note: string;
};

type VarianteForm = {
  nomeCliente: string;
  dataVariante: string;
  voci: VarianteVoce[];
};

type ContrattoFornitoreForm = {
  ragioneSociale: string;
  partitaIva: string;
  attivita: string;
  tipo: string;
  referente: string;
  telefono: string;
  isNuovoFornitore: boolean;
};

type DocProgettualeForm = {
  nome: string;
  descrizione: string;
  note: string;
};

type FornitoreDocForm = {
  tipoDocumento: string;
  importo: string;
  tempiPagamento: string;
  note: string;
};

type SelectedFornitore = Fornitore | null;

const emptyVoce = (): VarianteVoce => ({ fornitore: '', descrizione: '', um: '', qty: '', prezzoUnit: '' });

export function useDocumenti(
  baseUrl: string,
  selectedCommessa: Commessa | null,
  setError: (msg: string | null) => void,
) {
  const [documenti, setDocumenti] = useState<Documento[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Preview
  const [previewDoc, setPreviewDoc] = useState<{ id: string; nomeFile: string } | null>(null);

  // Modal: Contratto Cliente
  const [showContrattoClienteModal, setShowContrattoClienteModal] = useState(false);
  const [contrattoClienteForm, setContrattoClienteForm] = useState<ContrattoClienteForm>({
    nomeCliente: '',
    dataContratto: new Date().toISOString().split('T')[0],
    importoContratto: '',
    note: '',
  });
  const [contrattoClienteFiles, setContrattoClienteFiles] = useState<File[]>([]);
  const [isSavingContrattoCliente, setIsSavingContrattoCliente] = useState(false);

  // Modal: Variante
  const [showVarianteModal, setShowVarianteModal] = useState(false);
  const [varianteForm, setVarianteForm] = useState<VarianteForm>({
    nomeCliente: '',
    dataVariante: new Date().toISOString().split('T')[0],
    voci: [emptyVoce()],
  });
  const [varianteBaseContratti, setVarianteBaseContratti] = useState<{ id: string; nomeCliente: string }[]>([]);
  const [editingVarianteId, setEditingVarianteId] = useState<string | null>(null);
  const [varianteFiles, setVarianteFiles] = useState<File[]>([]);
  const [isSavingVariante, setIsSavingVariante] = useState(false);

  // Modal: Contratto Fornitore
  const [showContrattoFornitoreModal, setShowContrattoFornitoreModal] = useState(false);
  const [contrattoFornitoreForm, setContrattoFornitoreForm] = useState<ContrattoFornitoreForm>({
    ragioneSociale: '',
    partitaIva: '',
    attivita: '',
    tipo: 'Fornitore di Materiale',
    referente: '',
    telefono: '',
    isNuovoFornitore: true,
  });
  const [contrattoFornitoreFiles, setContrattoFornitoreFiles] = useState<File[]>([]);
  const [isSavingContrattoFornitore, setIsSavingContrattoFornitore] = useState(false);

  // Modal: Doc Progettuale
  const [showDocProgettualeModal, setShowDocProgettualeModal] = useState(false);
  const [docProgettualeForm, setDocProgettualeForm] = useState<DocProgettualeForm>({
    nome: '',
    descrizione: '',
    note: '',
  });
  const [docProgettualeFiles, setDocProgettualeFiles] = useState<File[]>([]);
  const [isSavingDocProgettuale, setIsSavingDocProgettuale] = useState(false);

  // Modal: Fornitore Doc
  const [showFornitoreDocModal, setShowFornitoreDocModal] = useState(false);
  const [selectedFornitore, setSelectedFornitore] = useState<SelectedFornitore>(null);
  const [fornitoreDocForm, setFornitoreDocForm] = useState<FornitoreDocForm>({
    tipoDocumento: '',
    importo: '',
    tempiPagamento: '',
    note: '',
  });
  const [fornitoreDocFiles, setFornitoreDocFiles] = useState<File[]>([]);
  const [isSavingFornitoreDoc, setIsSavingFornitoreDoc] = useState(false);

  // ─── Fetches ─────────────────────────────────────────────────────────────
  const fetchDocumenti = async (commessaId: string) => {
    try {
      const data = await apiFetch<Documento[]>(`${baseUrl}/api/documenti/COMMESSA/${commessaId}`);
      setDocumenti(data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Impossibile recuperare i documenti');
    }
  };

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleDeleteVariante = async (documentoId: string) => {
    if (!confirm('Eliminare definitivamente questa variante?')) return;
    try {
      await apiFetch(`${baseUrl}/api/documenti/${documentoId}`, { method: 'DELETE' });
      if (selectedCommessa) await fetchDocumenti(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Errore durante l'eliminazione della variante");
    }
  };

  /**
   * Sostituisce il file fisico di un documento/variante.
   * Il backend crea automaticamente un backup con suffisso timestamp
   * e aggiorna l'hash SHA256.
   */
  const handleReplaceVarianteFile = async (documentoId: string, file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const payload = new FormData();
      payload.append('file', file);
      await apiFetch(`${baseUrl}/api/documenti/${documentoId}/replace-file`, {
        method: 'PATCH',
        body: payload,
      });
      if (selectedCommessa) await fetchDocumenti(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante la sostituzione del file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateDocStato = async (docId: string, currentMeta: DocumentoMetadata, nuovoStato: string) => {
    const updatedMeta = JSON.stringify({ ...currentMeta, stato: nuovoStato });
    try {
      await apiFetch(`${baseUrl}/api/documenti/${docId}/metadata`, {
        method: 'PATCH',
        body: JSON.stringify({ datiEstrattiJson: updatedMeta }),
      });
      if (selectedCommessa) await fetchDocumenti(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore aggiornamento stato');
    }
  };

  const handleContrattoClienteUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommessa || contrattoClienteFiles.length === 0) {
      setError('Aggiungi almeno un documento da allegare.');
      return;
    }
    setIsSavingContrattoCliente(true);
    setError(null);

    const metadata = JSON.stringify({
      nomeCliente: contrattoClienteForm.nomeCliente,
      dataContratto: contrattoClienteForm.dataContratto,
      importoContratto: contrattoClienteForm.importoContratto,
      note: contrattoClienteForm.note,
    });

    try {
      for (const file of contrattoClienteFiles) {
        const payload = new FormData();
        payload.append('file', file);
        payload.append('entitaTipo', 'COMMESSA');
        payload.append('entitaId', selectedCommessa.id);
        payload.append('categoria', 'Contratti Cliente');
        payload.append('sottocategoria', contrattoClienteForm.nomeCliente);
        payload.append('datiEstrattiJson', metadata);
        await apiFetch(`${baseUrl}/api/documenti/upload`, { method: 'POST', body: payload });
      }
      setShowContrattoClienteModal(false);
      setContrattoClienteForm({ nomeCliente: '', dataContratto: new Date().toISOString().split('T')[0], importoContratto: '', note: '' });
      setContrattoClienteFiles([]);
      await fetchDocumenti(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento del contratto cliente');
    } finally {
      setIsSavingContrattoCliente(false);
    }
  };

  const handleVarianteUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommessa || (!editingVarianteId && varianteFiles.length === 0)) {
      setError('Aggiungi almeno un documento da allegare.');
      return;
    }
    setIsSavingVariante(true);
    setError(null);

    const totaleVariante = varianteForm.voci.reduce((acc, v) => {
      const qty = Number.parseFloat(v.qty) || 0;
      const pu = Number.parseFloat(v.prezzoUnit) || 0;
      return acc + qty * pu;
    }, 0);

    const metadata = JSON.stringify({
      tipoDocumento: 'Variante',
      nomeCliente: varianteForm.nomeCliente,
      dataVariante: varianteForm.dataVariante,
      importoVariante: Math.abs(totaleVariante),
      segno: totaleVariante >= 0 ? '+' : '-',
      voci: varianteForm.voci,
      descrizione: varianteForm.voci.map(v => v.descrizione).filter(Boolean).join(', '),
    });

    try {
      if (editingVarianteId) {
        await apiFetch(`${baseUrl}/api/documenti/${editingVarianteId}/metadata`, {
          method: 'PATCH',
          body: JSON.stringify({ datiEstrattiJson: metadata }),
        });
      } else {
        for (const file of varianteFiles) {
          const payload = new FormData();
          payload.append('file', file);
          payload.append('entitaTipo', 'COMMESSA');
          payload.append('entitaId', selectedCommessa.id);
          payload.append('categoria', 'Contratti Cliente');
          payload.append('sottocategoria', 'Variante');
          payload.append('datiEstrattiJson', metadata);
          await apiFetch(`${baseUrl}/api/documenti/upload`, { method: 'POST', body: payload });
        }
      }
      setShowVarianteModal(false);
      setEditingVarianteId(null);
      setVarianteForm({ nomeCliente: '', dataVariante: new Date().toISOString().split('T')[0], voci: [emptyVoce()] });
      setVarianteFiles([]);
      await fetchDocumenti(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento della variante');
    } finally {
      setIsSavingVariante(false);
    }
  };

  const handleContrattoFornitoreUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommessa || contrattoFornitoreFiles.length === 0) {
      setError('Aggiungi almeno un documento da allegare.');
      return;
    }
    if (!contrattoFornitoreForm.ragioneSociale.trim()) {
      setError('La ragione sociale del fornitore è obbligatoria.');
      return;
    }
    setIsSavingContrattoFornitore(true);
    setError(null);

    const metadata = JSON.stringify({
      ragioneSociale: contrattoFornitoreForm.ragioneSociale,
      partitaIva: contrattoFornitoreForm.partitaIva,
      attivita: contrattoFornitoreForm.attivita,
      tipo: contrattoFornitoreForm.tipo,
      referente: contrattoFornitoreForm.referente,
      telefono: contrattoFornitoreForm.telefono,
    });

    try {
      for (const file of contrattoFornitoreFiles) {
        const payload = new FormData();
        payload.append('file', file);
        payload.append('entitaTipo', 'COMMESSA');
        payload.append('entitaId', selectedCommessa.id);
        payload.append('categoria', 'Contratti Fornitori');
        payload.append('sottocategoria', contrattoFornitoreForm.ragioneSociale);
        payload.append('datiEstrattiJson', metadata);
        await apiFetch(`${baseUrl}/api/documenti/upload`, { method: 'POST', body: payload });
      }
      setShowContrattoFornitoreModal(false);
      setContrattoFornitoreForm({ ragioneSociale: '', partitaIva: '', attivita: '', tipo: 'Fornitore di Materiale', referente: '', telefono: '', isNuovoFornitore: true });
      setContrattoFornitoreFiles([]);
      await fetchDocumenti(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento del contratto fornitore');
    } finally {
      setIsSavingContrattoFornitore(false);
    }
  };

  const handleDocProgettualeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommessa || docProgettualeFiles.length === 0) {
      setError('Aggiungi almeno un documento da allegare.');
      return;
    }
    setIsSavingDocProgettuale(true);
    setError(null);

    const metadata = JSON.stringify({
      nome: docProgettualeForm.nome,
      descrizione: docProgettualeForm.descrizione,
      note: docProgettualeForm.note,
    });

    try {
      for (const file of docProgettualeFiles) {
        const payload = new FormData();
        payload.append('file', file);
        payload.append('entitaTipo', 'COMMESSA');
        payload.append('entitaId', selectedCommessa.id);
        payload.append('categoria', 'Documentazione Progettuale');
        payload.append('datiEstrattiJson', metadata);
        await apiFetch(`${baseUrl}/api/documenti/upload`, { method: 'POST', body: payload });
      }
      setShowDocProgettualeModal(false);
      setDocProgettualeForm({ nome: '', descrizione: '', note: '' });
      setDocProgettualeFiles([]);
      await fetchDocumenti(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento del documento progettuale');
    } finally {
      setIsSavingDocProgettuale(false);
    }
  };

  const handleFornitoreDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommessa || !selectedFornitore || fornitoreDocFiles.length === 0) {
      setError('Aggiungi almeno un file da allegare.');
      return;
    }
    setIsSavingFornitoreDoc(true);
    setError(null);

    const isServizio = selectedFornitore.tipo === 'Fornitore di Servizi/Subappaltatore';
    const categoriaUpload = isServizio ? 'Documenti Fornitore Servizi' : 'Documenti Fornitore Materiali';

    const metadata = JSON.stringify({
      ragioneSociale: selectedFornitore.ragioneSociale,
      tipoDocumento: fornitoreDocForm.tipoDocumento,
      importo: fornitoreDocForm.importo,
      tempiPagamento: fornitoreDocForm.tempiPagamento,
      note: fornitoreDocForm.note,
    });

    try {
      for (const file of fornitoreDocFiles) {
        const payload = new FormData();
        payload.append('file', file);
        payload.append('entitaTipo', 'COMMESSA');
        payload.append('entitaId', selectedCommessa.id);
        payload.append('categoria', categoriaUpload);
        payload.append('sottocategoria', selectedFornitore.ragioneSociale);
        payload.append('datiEstrattiJson', metadata);
        await apiFetch(`${baseUrl}/api/documenti/upload`, { method: 'POST', body: payload });
      }
      setShowFornitoreDocModal(false);
      setFornitoreDocForm({ tipoDocumento: '', importo: '', tempiPagamento: '', note: '' });
      setFornitoreDocFiles([]);
      setSelectedFornitore(null);
      await fetchDocumenti(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento del documento fornitore');
    } finally {
      setIsSavingFornitoreDoc(false);
    }
  };

  const handleFileUpload = async (file: File, categoria: string) => {
    if (!selectedCommessa) return;
    setIsUploading(true);
    try {
      const payload = new FormData();
      payload.append('file', file);
      payload.append('entitaTipo', 'COMMESSA');
      payload.append('entitaId', selectedCommessa.id);
      payload.append('categoria', categoria);
      await apiFetch(`${baseUrl}/api/documenti/upload`, { method: 'POST', body: payload });
      await fetchDocumenti(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento del file');
    } finally {
      setIsUploading(false);
    }
  };

  // ─── Modal helpers ────────────────────────────────────────────────────────
  const openVarianteForNew = (baseContratti: { id: string; nomeCliente: string }[]) => {
    setVarianteBaseContratti(baseContratti);
    setVarianteForm((f) => ({
      ...f,
      nomeCliente: baseContratti.length === 1 ? baseContratti[0].nomeCliente : '',
      voci: [emptyVoce()],
    }));
    setEditingVarianteId(null);
    setVarianteFiles([]);
    setShowVarianteModal(true);
  };

  const openVarianteForEdit = (
    varianteId: string,
    vm: { nomeCliente?: string; dataVariante?: string; voci?: VarianteVoce[] },
    baseContratti: { id: string; nomeCliente: string }[],
  ) => {
    setVarianteBaseContratti(baseContratti);
    setVarianteForm({
      nomeCliente: vm.nomeCliente || '',
      dataVariante: vm.dataVariante || new Date().toISOString().split('T')[0],
      voci: (vm.voci ?? []).length > 0 ? (vm.voci as VarianteVoce[]) : [emptyVoce()],
    });
    setEditingVarianteId(varianteId);
    setVarianteFiles([]);
    setShowVarianteModal(true);
  };

  const openContrattoFornitore = (fornitoriEsistenti: string[]) => {
    setContrattoFornitoreForm({
      ragioneSociale: '',
      partitaIva: '',
      attivita: '',
      tipo: 'Fornitore di Materiale',
      referente: '',
      telefono: '',
      isNuovoFornitore: fornitoriEsistenti.length === 0,
    });
    setShowContrattoFornitoreModal(true);
  };

  const openFornitoreDoc = (fornitore: SelectedFornitore) => {
    setSelectedFornitore(fornitore);
    setFornitoreDocForm({ tipoDocumento: 'Preventivo', importo: '', tempiPagamento: '', note: '' });
    setFornitoreDocFiles([]);
    setShowFornitoreDocModal(true);
  };

  // ─── Derived state ────────────────────────────────────────────────────────
  const fornitoriEsistenti = useMemo(() => {
    const found = new Set<string>();
    for (const doc of documenti) {
      if (doc.categoria === 'Contratti Fornitori' && doc.datiEstrattiJson?.ragioneSociale) {
        found.add(doc.datiEstrattiJson.ragioneSociale as string);
      }
    }
    return Array.from(found).sort((a, b) => a.localeCompare(b));
  }, [documenti]);

  const fornitoriDaDocumenti = useMemo(() => {
    const map = new Map<string, Fornitore>();
    for (const doc of documenti) {
      if (doc.categoria === 'Contratti Fornitori' && doc.datiEstrattiJson?.ragioneSociale) {
        const rs = doc.datiEstrattiJson.ragioneSociale as string;
        if (!map.has(rs)) {
          map.set(rs, {
            ragioneSociale: rs,
            tipo: doc.datiEstrattiJson.tipo || 'Fornitore di Materiale',
            partitaIva: doc.datiEstrattiJson.partitaIva,
            referente: doc.datiEstrattiJson.referente,
            telefono: doc.datiEstrattiJson.telefono,
            attivita: doc.datiEstrattiJson.attivita,
          });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => a.ragioneSociale.localeCompare(b.ragioneSociale));
  }, [documenti]);

  const docOperativiPerFornitore = useMemo(() => {
    const map = new Map<string, Documento[]>();
    for (const doc of documenti) {
      if (
        (doc.categoria === 'Documenti Fornitore Materiali' || doc.categoria === 'Documenti Fornitore Servizi') &&
        doc.datiEstrattiJson?.ragioneSociale
      ) {
        const rs = doc.datiEstrattiJson.ragioneSociale as string;
        const list = map.get(rs) ?? [];
        list.push(doc);
        map.set(rs, list);
      }
    }
    return map;
  }, [documenti]);

  const handleAllegatiClienteUpload = async (files: FileList, nomeCliente: string, descrizione?: string) => {
    if (!selectedCommessa || files.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const payload = new FormData();
        payload.append('file', file);
        payload.append('entitaTipo', 'COMMESSA');
        payload.append('entitaId', selectedCommessa.id);
        payload.append('categoria', 'Contratti Cliente');
        payload.append('sottocategoria', nomeCliente);
        payload.append('datiEstrattiJson', JSON.stringify({ tipoDocumento: 'Allegato', nomeCliente, ...(descrizione ? { descrizione } : {}) }));
        await apiFetch(`${baseUrl}/api/documenti/upload`, { method: 'POST', body: payload });
      }
      await fetchDocumenti(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento degli allegati');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAllegatiFornitoreUpload = async (files: FileList, ragioneSociale: string, descrizione?: string) => {
    if (!selectedCommessa || files.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const payload = new FormData();
        payload.append('file', file);
        payload.append('entitaTipo', 'COMMESSA');
        payload.append('entitaId', selectedCommessa.id);
        payload.append('categoria', 'Contratti Fornitori');
        payload.append('sottocategoria', ragioneSociale);
        payload.append('datiEstrattiJson', JSON.stringify({ tipoDocumento: 'Allegato', ragioneSociale, ...(descrizione ? { descrizione } : {}) }));
        await apiFetch(`${baseUrl}/api/documenti/upload`, { method: 'POST', body: payload });
      }
      await fetchDocumenti(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento degli allegati');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    // state
    documenti, isUploading,
    previewDoc, setPreviewDoc,
    // contratto cliente
    showContrattoClienteModal, setShowContrattoClienteModal,
    contrattoClienteForm, setContrattoClienteForm,
    contrattoClienteFiles, setContrattoClienteFiles,
    isSavingContrattoCliente,
    // variante
    showVarianteModal, setShowVarianteModal,
    varianteForm, setVarianteForm,
    varianteBaseContratti, setVarianteBaseContratti,
    editingVarianteId, setEditingVarianteId,
    varianteFiles, setVarianteFiles,
    isSavingVariante,
    // contratto fornitore
    showContrattoFornitoreModal, setShowContrattoFornitoreModal,
    contrattoFornitoreForm, setContrattoFornitoreForm,
    contrattoFornitoreFiles, setContrattoFornitoreFiles,
    isSavingContrattoFornitore,
    // doc progettuale
    showDocProgettualeModal, setShowDocProgettualeModal,
    docProgettualeForm, setDocProgettualeForm,
    docProgettualeFiles, setDocProgettualeFiles,
    isSavingDocProgettuale,
    // fornitore doc
    showFornitoreDocModal, setShowFornitoreDocModal,
    selectedFornitore, setSelectedFornitore,
    fornitoreDocForm, setFornitoreDocForm,
    fornitoreDocFiles, setFornitoreDocFiles,
    isSavingFornitoreDoc,
    // handlers
    fetchDocumenti,
    handleDeleteVariante,
    handleReplaceVarianteFile,
    handleUpdateDocStato,
    handleContrattoClienteUpload,
    handleVarianteUpload,
    handleContrattoFornitoreUpload,
    handleDocProgettualeUpload,
    handleFornitoreDocUpload,
    handleFileUpload,
    handleAllegatiClienteUpload,
    handleAllegatiFornitoreUpload,
    // helpers
    openVarianteForNew,
    openVarianteForEdit,
    openContrattoFornitore,
    openFornitoreDoc,
    // derived
    fornitoriEsistenti,
    fornitoriDaDocumenti,
    docOperativiPerFornitore,
  };
}
