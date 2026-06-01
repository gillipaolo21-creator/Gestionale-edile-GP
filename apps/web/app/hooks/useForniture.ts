'use client';
import React, { useEffect, useState } from 'react';
import type { Commessa, FornituraRecord } from '../types/domain';
import { apiFetch } from './apiFetch';

type FornituraForm = {
  societaId: string;
  fornitoreNome: string;
  importoFornitura: string;
  descrizione: string;
  preventivoRiferimento: string;
  dataPreventivo: string;
};

export function useForniture(
  baseUrl: string,
  selectedCommessa: Commessa | null,
  defaultSocietaId: string | null,
  setError: (msg: string | null) => void,
) {
  const [fornitureMateriali, setFornitureMateriali] = useState<FornituraRecord[]>([]);
  const [fornitureServizi, setFornitureServizi] = useState<FornituraRecord[]>([]);

  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState<FornituraForm>({
    societaId: defaultSocietaId ?? '',
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
    societaId: defaultSocietaId ?? '',
    fornitoreNome: '',
    importoFornitura: '',
    descrizione: '',
    preventivoRiferimento: '',
    dataPreventivo: new Date().toISOString().split('T')[0],
  });
  const [serviceFile, setServiceFile] = useState<File | null>(null);
  const [isSavingService, setIsSavingService] = useState(false);

  useEffect(() => {
    if (defaultSocietaId && !materialForm.societaId) {
      setMaterialForm((prev) => ({ ...prev, societaId: defaultSocietaId }));
    }
    if (defaultSocietaId && !serviceForm.societaId) {
      setServiceForm((prev) => ({ ...prev, societaId: defaultSocietaId }));
    }
  }, [defaultSocietaId, materialForm.societaId, serviceForm.societaId]);

  const fetchFornitureMateriali = async (commessaId: string) => {
    try {
      const data = await apiFetch<FornituraRecord[]>(`${baseUrl}/api/materiali?commessaId=${commessaId}`);
      setFornitureMateriali(data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Impossibile recuperare le forniture materiali');
    }
  };

  const fetchFornitureServizi = async (commessaId: string) => {
    try {
      const data = await apiFetch<FornituraRecord[]>(`${baseUrl}/api/materiali?commessaId=${commessaId}`);
      setFornitureServizi(data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Impossibile recuperare le forniture servizi');
    }
  };

  const handleCreateFornituraMateriale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommessa) return;
    setIsSavingMaterial(true);
    setError(null);

    if (!materialForm.societaId) {
      setIsSavingMaterial(false);
      setError('Seleziona la societa della fornitura.');
      return;
    }

    if (!materialFile) {
      setIsSavingMaterial(false);
      setError('Carica il preventivo della fornitura.');
      return;
    }

    try {
      await apiFetch(`${baseUrl}/api/materiali`, {
        method: 'POST',
        body: JSON.stringify({
          commessaId: selectedCommessa.id,
          societaId: materialForm.societaId,
          fornitoreNome: materialForm.fornitoreNome,
          descrizione: materialForm.descrizione || materialForm.fornitoreNome,
          quantita: 1,
          prezzoUnitario: Number.parseFloat(materialForm.importoFornitura),
          ddt: materialForm.preventivoRiferimento,
          dataConsegna: materialForm.dataPreventivo,
        }),
      });

      const filePayload = new FormData();
      filePayload.append('file', materialFile);
      filePayload.append('entitaTipo', 'COMMESSA');
      filePayload.append('entitaId', selectedCommessa.id);
      filePayload.append('categoria', 'Offerte forniture di materiali');
      filePayload.append('sottocategoria', materialForm.fornitoreNome);

      await apiFetch(`${baseUrl}/api/documenti/upload`, {
        method: 'POST',
        headers: {},
        body: filePayload,
      } as unknown as RequestInit);

      setShowMaterialModal(false);
      setMaterialForm({
        societaId: materialForm.societaId,
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

    if (!serviceForm.societaId) {
      setIsSavingService(false);
      setError('Seleziona la societa del servizio.');
      return;
    }

    if (!serviceFile) {
      setIsSavingService(false);
      setError('Carica il preventivo del servizio.');
      return;
    }

    try {
      await apiFetch(`${baseUrl}/api/materiali`, {
        method: 'POST',
        body: JSON.stringify({
          commessaId: selectedCommessa.id,
          societaId: serviceForm.societaId,
          fornitoreNome: serviceForm.fornitoreNome,
          descrizione: serviceForm.descrizione || serviceForm.fornitoreNome,
          quantita: 1,
          prezzoUnitario: Number.parseFloat(serviceForm.importoFornitura),
          ddt: serviceForm.preventivoRiferimento,
          dataConsegna: serviceForm.dataPreventivo,
        }),
      });

      const filePayload = new FormData();
      filePayload.append('file', serviceFile);
      filePayload.append('entitaTipo', 'COMMESSA');
      filePayload.append('entitaId', selectedCommessa.id);
      filePayload.append('categoria', 'Offerte forniture di servizi');
      filePayload.append('sottocategoria', serviceForm.fornitoreNome);

      await apiFetch(`${baseUrl}/api/documenti/upload`, {
        method: 'POST',
        headers: {},
        body: filePayload,
      } as RequestInit);

      setShowServiceModal(false);
      setServiceForm({
        societaId: serviceForm.societaId,
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
