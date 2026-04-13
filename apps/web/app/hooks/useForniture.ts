'use client';
import React, { useState } from 'react';
import type { Commessa, FornituraRecord } from '../types/domain';

type FornituraForm = {
  fornitoreNome: string;
  importoFornitura: string;
  descrizione: string;
  preventivoRiferimento: string;
  dataPreventivo: string;
};

export function useForniture(
  baseUrl: string,
  selectedCommessa: Commessa | null,
  setError: (msg: string | null) => void,
) {
  const [fornitureMateriali, setFornitureMateriali] = useState<FornituraRecord[]>([]);
  const [fornitureServizi, setFornitureServizi] = useState<FornituraRecord[]>([]);

  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState<FornituraForm>({
    fornitoreNome: '',
    importoFornitura: '',
    descrizione: '',
    preventivoRiferimento: '',
    dataPreventivo: new Date().toISOString().split('T')[0],
  });
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState<FornituraForm>({
    fornitoreNome: '',
    importoFornitura: '',
    descrizione: '',
    preventivoRiferimento: '',
    dataPreventivo: new Date().toISOString().split('T')[0],
  });
  const [serviceFile, setServiceFile] = useState<File | null>(null);
  const [isSavingService, setIsSavingService] = useState(false);

  const fetchFornitureMateriali = async (commessaId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/commesse/${commessaId}/forniture-materiali`);
      if (!res.ok) throw new Error('Impossibile recuperare le forniture materiali');
      const data = await res.json();
      setFornitureMateriali(data as FornituraRecord[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Impossibile recuperare le forniture materiali');
    }
  };

  const fetchFornitureServizi = async (commessaId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/commesse/${commessaId}/forniture-servizi`);
      if (!res.ok) throw new Error('Impossibile recuperare le forniture servizi');
      const data = await res.json();
      setFornitureServizi(data as FornituraRecord[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Impossibile recuperare le forniture servizi');
    }
  };

  const handleCreateFornituraMateriale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommessa) return;
    setIsSavingMaterial(true);
    setError(null);

    if (!materialFile) {
      setIsSavingMaterial(false);
      setError('Carica il preventivo della fornitura.');
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessa.id}/forniture-materiali`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fornitoreNome: materialForm.fornitoreNome,
          importoFornitura: parseFloat(materialForm.importoFornitura),
          descrizione: materialForm.descrizione || undefined,
          preventivoRiferimento: materialForm.preventivoRiferimento,
          dataPreventivo: materialForm.dataPreventivo,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errorMessage = Array.isArray(errData.message)
          ? errData.message.join(' | ')
          : (errData.message || 'Errore durante il salvataggio della fornitura');
        throw new Error(errorMessage);
      }

      const filePayload = new FormData();
      filePayload.append('file', materialFile);
      filePayload.append('entitaTipo', 'COMMESSA');
      filePayload.append('entitaId', selectedCommessa.id);
      filePayload.append('categoria', 'Offerte forniture di materiali');
      filePayload.append('sottocategoria', materialForm.fornitoreNome);

      const uploadRes = await fetch(`${baseUrl}/api/documenti/upload`, {
        method: 'POST',
        body: filePayload,
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        const errorMessage = Array.isArray(errData.message)
          ? errData.message.join(' | ')
          : (errData.message || 'Errore durante il caricamento del preventivo');
        throw new Error(errorMessage);
      }

      setShowMaterialModal(false);
      setMaterialForm({
        fornitoreNome: '',
        importoFornitura: '',
        descrizione: '',
        preventivoRiferimento: '',
        dataPreventivo: new Date().toISOString().split('T')[0],
      });
      setMaterialFile(null);
      await fetchFornitureMateriali(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio della fornitura materiale');
    } finally {
      setIsSavingMaterial(false);
    }
  };

  const handleCreateFornituraServizio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommessa) return;
    setIsSavingService(true);
    setError(null);

    if (!serviceFile) {
      setIsSavingService(false);
      setError('Carica il preventivo del servizio.');
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessa.id}/forniture-servizi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fornitoreNome: serviceForm.fornitoreNome,
          importoFornitura: parseFloat(serviceForm.importoFornitura),
          descrizione: serviceForm.descrizione || undefined,
          preventivoRiferimento: serviceForm.preventivoRiferimento,
          dataPreventivo: serviceForm.dataPreventivo,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errorMessage = Array.isArray(errData.message)
          ? errData.message.join(' | ')
          : (errData.message || 'Errore durante il salvataggio del servizio');
        throw new Error(errorMessage);
      }

      const filePayload = new FormData();
      filePayload.append('file', serviceFile);
      filePayload.append('entitaTipo', 'COMMESSA');
      filePayload.append('entitaId', selectedCommessa.id);
      filePayload.append('categoria', 'Offerte forniture di servizi');
      filePayload.append('sottocategoria', serviceForm.fornitoreNome);

      const uploadRes = await fetch(`${baseUrl}/api/documenti/upload`, {
        method: 'POST',
        body: filePayload,
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        const errorMessage = Array.isArray(errData.message)
          ? errData.message.join(' | ')
          : (errData.message || 'Errore durante il caricamento del preventivo');
        throw new Error(errorMessage);
      }

      setShowServiceModal(false);
      setServiceForm({
        fornitoreNome: '',
        importoFornitura: '',
        descrizione: '',
        preventivoRiferimento: '',
        dataPreventivo: new Date().toISOString().split('T')[0],
      });
      setServiceFile(null);
      await fetchFornitureServizi(selectedCommessa.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio della fornitura servizio');
    } finally {
      setIsSavingService(false);
    }
  };

  return {
    fornitureMateriali, setFornitureMateriali,
    fornitureServizi, setFornitureServizi,
    showMaterialModal, setShowMaterialModal,
    materialForm, setMaterialForm,
    materialFile, setMaterialFile,
    isSavingMaterial,
    showServiceModal, setShowServiceModal,
    serviceForm, setServiceForm,
    serviceFile, setServiceFile,
    isSavingService,
    fetchFornitureMateriali,
    fetchFornitureServizi,
    handleCreateFornituraMateriale,
    handleCreateFornituraServizio,
  };
}
