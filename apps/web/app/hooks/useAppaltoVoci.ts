'use client';
import { useMemo, useState } from 'react';
import type { ApiAppaltoVoce } from '../types/domain';

export type AppaltoRow = {
  id: string;
  parentId?: string | null;
  descrizione: string;
  unitaMisura: string;
  quantita: string;
  prezzoUnitario: string;
  avanzamentoPercent: string;
};

export type AppaltoRowFlat = AppaltoRow & {
  level: number;
  wbsCode: string;
  total: number;
  avzEuro: number;
  avzPercent: number;
  hasChildren: boolean;
  isCollapsed: boolean;
};

/** Usa il tipo API condiviso come shape per i dati dal backend */
type AppaltoRowApi = ApiAppaltoVoce;

export function useAppaltoVoci(
  baseUrl: string,
  selectedCommessaId: string | null,
  setError: (msg: string | null) => void,
) {
  const [appaltoRows, setAppaltoRows] = useState<AppaltoRow[]>([]);
  const [collapsedAppaltoIds, setCollapsedAppaltoIds] = useState<Set<string>>(new Set());
  const [isSavingAppalto, setIsSavingAppalto] = useState(false);

  const fetchAppaltoVoci = async (commessaId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/commesse/${commessaId}/appalto-voci`);
      if (!res.ok) throw new Error('Impossibile recuperare le voci in appalto');
      const data = await res.json();
      setAppaltoRows((data as AppaltoRowApi[]).map((row) => ({
        id: row.id,
        parentId: row.parentId ?? null,
        descrizione: row.descrizione || '',
        unitaMisura: row.unitaMisura || '',
        quantita: row.quantita?.toString?.() || '',
        prezzoUnitario: row.prezzoUnitario?.toString?.() || '',
        avanzamentoPercent: row.avanzamentoPercent?.toString?.() || '',
      })));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Impossibile recuperare le voci in appalto');
    }
  };

  const handleAddAppaltoRow = () => {
    setAppaltoRows((prev) => ([
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        parentId: null,
        descrizione: '',
        unitaMisura: '',
        quantita: '',
        prezzoUnitario: '',
        avanzamentoPercent: '',
      },
    ]));
  };

  const handleAddAppaltoChildRow = (parentId: string) => {
    setAppaltoRows((prev) => ([
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        parentId,
        descrizione: '',
        unitaMisura: '',
        quantita: '',
        prezzoUnitario: '',
        avanzamentoPercent: '',
      },
    ]));
  };

  const handleUpdateAppaltoRow = (rowId: string, field: keyof AppaltoRow, value: string) => {
    setAppaltoRows((prev) => prev.map((row) => (
      row.id === rowId ? { ...row, [field]: value } : row
    )));
  };

  const handleRemoveAppaltoRow = (rowId: string) => {
    setAppaltoRows((prev) => {
      const toRemove = new Set<string>();
      const collect = (id: string) => {
        toRemove.add(id);
        prev.filter((row) => row.parentId === id).forEach((row) => collect(row.id));
      };
      collect(rowId);
      return prev.filter((row) => !toRemove.has(row.id));
    });
  };

  const toggleAppaltoRow = (rowId: string) => {
    setCollapsedAppaltoIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const appaltoRowsFlat = useMemo((): AppaltoRowFlat[] => {
    const byParent = new Map<string | null, AppaltoRow[]>();
    for (const row of appaltoRows) {
      const key = row.parentId ?? null;
      const group = byParent.get(key) ?? [];
      group.push(row);
      byParent.set(key, group);
    }

    const totalsMap = new Map<string, { total: number; avzEuro: number; avzPercent: number; hasChildren: boolean }>();

    const computeTotals = (row: AppaltoRow): { total: number; avzEuro: number } => {
      const children = byParent.get(row.id) ?? [];
      if (children.length === 0) {
        const quantita = parseFloat(row.quantita.replace(',', '.')) || 0;
        const prezzo = parseFloat(row.prezzoUnitario.replace(',', '.')) || 0;
        const total = quantita * prezzo;
        const avzPercent = Math.min(Math.max(parseFloat(row.avanzamentoPercent.replace(',', '.')) || 0, 0), 100);
        const avzEuro = (total * avzPercent) / 100;
        totalsMap.set(row.id, { total, avzEuro, avzPercent, hasChildren: false });
        return { total, avzEuro };
      }

      let total = 0;
      let avzEuro = 0;
      for (const child of children) {
        const childTotals = computeTotals(child);
        total += childTotals.total;
        avzEuro += childTotals.avzEuro;
      }
      const avzPercent = total > 0 ? (avzEuro / total) * 100 : 0;
      totalsMap.set(row.id, { total, avzEuro, avzPercent, hasChildren: true });
      return { total, avzEuro };
    };

    for (const row of appaltoRows) {
      if (!totalsMap.has(row.id)) {
        computeTotals(row);
      }
    }

    const result: AppaltoRowFlat[] = [];

    const visit = (parentId: string | null, level: number, parentCode: string | null) => {
      const children = byParent.get(parentId);
      if (!children) return;
      children.forEach((child, index) => {
        const wbsCode = parentCode ? `${parentCode}.${index + 1}` : `${index + 1}`;
        const totals = totalsMap.get(child.id) ?? { total: 0, avzEuro: 0, avzPercent: 0, hasChildren: false };
        const isCollapsed = collapsedAppaltoIds.has(child.id);
        result.push({
          ...child,
          level,
          wbsCode,
          total: totals.total,
          avzEuro: totals.avzEuro,
          avzPercent: totals.avzPercent,
          hasChildren: totals.hasChildren,
          isCollapsed,
        });
        if (!isCollapsed) {
          visit(child.id, level + 1, wbsCode);
        }
      });
    };

    visit(null, 0, null);
    return result;
  }, [appaltoRows, collapsedAppaltoIds]);

  const handleSaveAppaltoRows = async () => {
    if (!selectedCommessaId) return;
    setIsSavingAppalto(true);
    setError(null);

    try {
      const payload = appaltoRows
        .filter((row) => row.descrizione.trim() || row.unitaMisura.trim())
        .map((row) => ({
          parentId: row.parentId || null,
          descrizione: row.descrizione,
          unitaMisura: row.unitaMisura,
          quantita: parseFloat(row.quantita.replace(',', '.')) || 0,
          prezzoUnitario: parseFloat(row.prezzoUnitario.replace(',', '.')) || 0,
          avanzamentoPercent: Math.min(Math.max(parseFloat(row.avanzamentoPercent.replace(',', '.')) || 0, 0), 100),
        }));

      const res = await fetch(`${baseUrl}/api/commesse/${selectedCommessaId}/appalto-voci`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Errore durante il salvataggio delle voci');
      }

      const saved = await res.json();
      setAppaltoRows((saved as AppaltoRowApi[]).map((row) => ({
        id: row.id,
        parentId: row.parentId ?? null,
        descrizione: row.descrizione || '',
        unitaMisura: row.unitaMisura || '',
        quantita: row.quantita?.toString?.() || '',
        prezzoUnitario: row.prezzoUnitario?.toString?.() || '',
        avanzamentoPercent: row.avanzamentoPercent?.toString?.() || '',
      })));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio delle voci');
    } finally {
      setIsSavingAppalto(false);
    }
  };

  return {
    appaltoRows,
    setAppaltoRows,
    isSavingAppalto,
    fetchAppaltoVoci,
    handleAddAppaltoRow,
    handleAddAppaltoChildRow,
    handleUpdateAppaltoRow,
    handleRemoveAppaltoRow,
    toggleAppaltoRow,
    handleSaveAppaltoRows,
    appaltoRowsFlat,
  };
}
