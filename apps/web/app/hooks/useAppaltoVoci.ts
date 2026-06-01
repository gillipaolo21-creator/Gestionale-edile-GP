'use client';
import { useMemo, useState } from 'react';
import type { ColumnMapping, MappableField } from '../components/ExcelColumnPickerModal';
import type { ApiAppaltoVoce } from '../types/domain';
import { apiFetch } from './apiFetch';

type ExcelColumns = {
  descrizione: number;
  quantita?: number;
  prezzo?: number;
  totale?: number;
  unita?: number;
  unitaMisura?: number;
};

const normalizeHeader = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .replace(/[.''`_\-/\\()[\]]/g, '');

const parseNumberCell = (value: unknown) => {
  if (value == null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const text = String(value).trim();
  if (!text) return null;
  // gestisce sia 1.234,56 (IT) sia 1,234.56 (EN)
  const normalized = text.includes(',') && text.includes('.')
    ? text.replace(/\./g, '').replace(',', '.')
    : text.replace(',', '.');
  const num = Number.parseFloat(normalized);
  return Number.isNaN(num) ? null : num;
};

const buildRowId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const HEADER_DESCRIZIONE = ['ARTICOLI', 'DESCRIZIONE', 'LAVORAZIONE', 'VOCE', 'DESIGNAZIONE', 'LAVORI'];
const HEADER_QUANTITA = ['QUANTITA', 'QTA', 'QT', 'NRTOT', 'QUANTITATOTALE', 'MISURE'];
const HEADER_PREZZO = ['PREZZOUNIT', 'PREZZO', 'COSTOUNIT', 'COSTO', 'PUNIT', 'PREZ'];
const HEADER_TOTALE = ['TOTALE', 'IMPORTO', 'TOTCOMPLESSIVO', 'IMPTOTALE', 'IMP'];
const HEADER_UNITA = ['UM', 'U', 'UNITA', 'UNITAMISURA', 'MISURA'];

const findComputoHeader = (rows: unknown[][]) => {
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i] ?? [];
    const normalized = row.map((cell) => normalizeHeader(cell));

    const descrizione = normalized.findIndex((cell) =>
      HEADER_DESCRIZIONE.some((h) => cell.includes(h))
    );
    if (descrizione === -1) continue;

    // deve esserci almeno una colonna numerica (quantità o totale) per essere valido
    const quantita = normalized.findIndex((cell) =>
      HEADER_QUANTITA.some((h) => cell.includes(h))
    );
    const prezzo = normalized.findIndex((cell) =>
      HEADER_PREZZO.some((h) => cell.includes(h))
    );
    const totale = normalized.findIndex((cell) =>
      HEADER_TOTALE.some((h) => cell.includes(h))
    );
    const unitaMisura = normalized.findIndex((cell) =>
      HEADER_UNITA.some((h) => cell === h || cell.startsWith(h))
    );

    if (quantita === -1 && totale === -1) continue;

    return {
      headerRow: i,
      columns: {
        descrizione,
        quantita: quantita >= 0 ? quantita : undefined,
        prezzo: prezzo >= 0 ? prezzo : undefined,
        totale: totale >= 0 ? totale : undefined,
        unita: undefined,
        unitaMisura: unitaMisura >= 0 ? unitaMisura : undefined,
      } satisfies ExcelColumns,
    };
  }
  return null;
};

const shouldSkipDescrizione = (descrizione: string) => {
  const normalized = descrizione.trim().toUpperCase();
  return normalized.startsWith('TOTALE') || normalized === 'TOT' || normalized.startsWith('TOT ');
};

export type AppaltoRow = {
  id: string;
  parentId?: string | null;
  societaId: string;
  descrizione: string;
  unitaMisura: string;
  quantita: string;
  prezzoUnitario: string;
  avanzamentoPercent: string;
  costoPrevisto: string;
  costoEffettivo: string;
  ricavoPrevisto: string;
  ricavoEffettivo: string;
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
  defaultSocietaId: string | null,
  setError: (msg: string | null) => void,
) {
  const [appaltoRows, setAppaltoRows] = useState<AppaltoRow[]>([]);
  const [collapsedAppaltoIds, setCollapsedAppaltoIds] = useState<Set<string>>(new Set());
  const [isSavingAppalto, setIsSavingAppalto] = useState(false);

  const fetchAppaltoVoci = async (commessaId: string) => {
    try {
      const data = await apiFetch<AppaltoRowApi[]>(`${baseUrl}/api/commesse/${commessaId}/appalto-voci`);
      setAppaltoRows((data ?? []).map((row) => ({
        id: row.id,
        parentId: row.parentId ?? null,
        societaId: row.societaId ?? defaultSocietaId ?? '',
        descrizione: row.descrizione || '',
        unitaMisura: row.unitaMisura || '',
        quantita: row.quantita?.toString?.() || '',
        prezzoUnitario: row.prezzoUnitario?.toString?.() || '',
        avanzamentoPercent: row.avanzamentoPercent?.toString?.() || '',
        costoPrevisto: row.costoPrevisto?.toString?.() || '',
        costoEffettivo: row.costoEffettivo?.toString?.() || '',
        ricavoPrevisto: row.ricavoPrevisto?.toString?.() || '',
        ricavoEffettivo: row.ricavoEffettivo?.toString?.() || '',
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
        societaId: defaultSocietaId ?? '',
        descrizione: '',
        unitaMisura: '',
        quantita: '',
        prezzoUnitario: '',
        avanzamentoPercent: '',
        costoPrevisto: '',
        costoEffettivo: '',
        ricavoPrevisto: '',
        ricavoEffettivo: '',
      },
    ]));
  };

  const handleAddAppaltoChildRow = (parentId: string) => {
    setAppaltoRows((prev) => ([
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        parentId,
        societaId: defaultSocietaId ?? '',
        descrizione: '',
        unitaMisura: '',
        quantita: '',
        prezzoUnitario: '',
        avanzamentoPercent: '',
        costoPrevisto: '',
        costoEffettivo: '',
        ricavoPrevisto: '',
        ricavoEffettivo: '',
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

  const handleRemoveAppaltoRows = (rowIds: string[]) => {
    setAppaltoRows((prev) => {
      const toRemove = new Set<string>();
      const collect = (id: string) => {
        toRemove.add(id);
        prev.filter((row) => row.parentId === id).forEach((row) => collect(row.id));
      };
      for (const rowId of rowIds) collect(rowId);
      return prev.filter((row) => !toRemove.has(row.id));
    });
  };

  const handleClearAppaltoRows = () => {
    setAppaltoRows([]);
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
        const quantita = Number.parseFloat(row.quantita.replace(',', '.')) || 0;
        const prezzo = Number.parseFloat(row.prezzoUnitario.replace(',', '.')) || 0;
        const total = quantita * prezzo;
        const avzPercent = Math.min(Math.max(Number.parseFloat(row.avanzamentoPercent.replace(',', '.')) || 0, 0), 100);
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
      const missingSocieta = appaltoRows.find((row) => !row.societaId && (row.descrizione.trim() || row.unitaMisura.trim()));
      if (missingSocieta) {
        setError('Seleziona la societa per tutte le voci in appalto.');
        setIsSavingAppalto(false);
        return;
      }
      const payload = appaltoRows
        .filter((row) => row.descrizione.trim() || row.unitaMisura.trim())
        .map((row) => ({
          id: row.id,
          parentId: row.parentId || null,
          societaId: row.societaId,
          descrizione: row.descrizione,
          unitaMisura: row.unitaMisura,
          quantita: Number.parseFloat(row.quantita.replace(',', '.')) || 0,
          prezzoUnitario: Number.parseFloat(row.prezzoUnitario.replace(',', '.')) || 0,
          avanzamentoPercent: Math.min(Math.max(Number.parseFloat(row.avanzamentoPercent.replace(',', '.')) || 0, 0), 100),
          costoPrevisto: Number.parseFloat(row.costoPrevisto.replace(',', '.')) || 0,
          costoEffettivo: Number.parseFloat(row.costoEffettivo.replace(',', '.')) || 0,
          ricavoPrevisto: Number.parseFloat(row.ricavoPrevisto.replace(',', '.')) || 0,
          ricavoEffettivo: Number.parseFloat(row.ricavoEffettivo.replace(',', '.')) || 0,
        }));

      const saved = await apiFetch<AppaltoRowApi[]>(`${baseUrl}/api/commesse/${selectedCommessaId}/appalto-voci`, {
        method: 'PUT',
        body: JSON.stringify({ voci: payload }),
      });
      setAppaltoRows((saved ?? []).map((row) => ({
        id: row.id,
        parentId: row.parentId ?? null,
        societaId: row.societaId ?? defaultSocietaId ?? '',
        descrizione: row.descrizione || '',
        unitaMisura: row.unitaMisura || '',
        quantita: row.quantita?.toString?.() || '',
        prezzoUnitario: row.prezzoUnitario?.toString?.() || '',
        avanzamentoPercent: row.avanzamentoPercent?.toString?.() || '',
        costoPrevisto: row.costoPrevisto?.toString?.() || '',
        costoEffettivo: row.costoEffettivo?.toString?.() || '',
        ricavoPrevisto: row.ricavoPrevisto?.toString?.() || '',
        ricavoEffettivo: row.ricavoEffettivo?.toString?.() || '',
      })));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio delle voci');
    } finally {
      setIsSavingAppalto(false);
    }
  };

  const [pendingExcelData, setPendingExcelData] = useState<{
    headers: string[];
    rows: unknown[][];
    headerRow: number;
    initialMapping: ColumnMapping;
  } | null>(null);

  const handleImportAppaltoExcel = async (file: File) => {
    setError(null);
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      setError('Formato file non supportato. Usa un Excel (.xlsx o .xls).');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const xlsx = await import('xlsx');
      const workbook = xlsx.read(buffer, { type: 'array' });

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) continue;

        const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: '' }) as unknown[][];
        if (rows.length === 0) continue;

        // Prima prova la rilevazione intelligente
        const template = findComputoHeader(rows);
        let headerRowIdx = template?.headerRow ?? -1;

        // Fallback: cerca la riga con più celle di testo non vuote (probabile header)
        if (headerRowIdx === -1) {
          let bestScore = 0;
          for (let i = 0; i < Math.min(rows.length, 25); i++) {
            const textCells = (rows[i] ?? []).filter((c) => {
              const s = String(c ?? '').trim();
              return s.length > 1 && Number.isNaN(Number(s));
            }).length;
            if (textCells > bestScore) { bestScore = textCells; headerRowIdx = i; }
          }
        }
        if (headerRowIdx === -1) headerRowIdx = 0;

        const headerRow = rows[headerRowIdx] ?? [];
        const headers = headerRow.map((h) => String(h ?? '').trim());

        // Dati di esempio per auto-rilevazione tipo colonna
        const sampleData = rows.slice(headerRowIdx + 1, headerRowIdx + 11).filter(
          (r) => (r ?? []).some((c) => String(c ?? '').trim().length > 0)
        );

        const initialMapping: ColumnMapping = {};
        headers.forEach((h, idx) => {
          const norm = normalizeHeader(h);
          // Prima prova a rilevare dall'intestazione
          if (norm.length > 0) {
            if (HEADER_DESCRIZIONE.some((k) => norm.includes(k))) { initialMapping[idx] = 'descrizione'; return; }
            if (HEADER_UNITA.some((k) => norm === k || norm.startsWith(k))) { initialMapping[idx] = 'unitaMisura'; return; }
            if (HEADER_QUANTITA.some((k) => norm.includes(k))) { initialMapping[idx] = 'quantita'; return; }
            if (HEADER_PREZZO.some((k) => norm.includes(k))) { initialMapping[idx] = 'prezzoUnitario'; return; }
            if (HEADER_TOTALE.some((k) => norm.includes(k))) { initialMapping[idx] = 'totale'; return; }
          }
          // Fallback: analizza le celle sottostanti
          const numericCount = sampleData.filter((r) => {
            const v = r[idx];
            if (typeof v === 'number') return Number.isFinite(v);
            const n = Number.parseFloat(String(v ?? '').replace(',', '.'));
            return !Number.isNaN(n);
          }).length;
          const textCount = sampleData.filter((r) => {
            const s = String(r[idx] ?? '').trim();
            return s.length > 2 && Number.isNaN(Number(s));
          }).length;

          if (sampleData.length === 0) { initialMapping[idx] = 'skip'; return; }
          if (textCount / sampleData.length >= 0.5) { initialMapping[idx] = 'descrizione'; return; }
          if (numericCount / sampleData.length >= 0.5) { initialMapping[idx] = 'quantita'; return; }
          initialMapping[idx] = 'skip';
        });

        // Garantisci che ci sia almeno una colonna descrizione
        const hasDescr = Object.values(initialMapping).includes('descrizione');
        if (!hasDescr && headers.length > 0) {
          // Trova la colonna col testo più lungo in media
          let bestTextCol = 0;
          let bestAvg = 0;
          headers.forEach((_, idx) => {
            const avg = sampleData.reduce((s, r) => s + String(r[idx] ?? '').trim().length, 0) / Math.max(sampleData.length, 1);
            if (avg > bestAvg) { bestAvg = avg; bestTextCol = idx; }
          });
          initialMapping[bestTextCol] = 'descrizione';
        }

        setPendingExcelData({ headers, rows, headerRow: headerRowIdx, initialMapping });
        return;
      }

      setError('Nessun foglio valido trovato nel file Excel.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Errore durante la lettura del file Excel");
    }
  };

  const handleConfirmExcelMapping = (mapping: ColumnMapping) => {
    if (!pendingExcelData) return;
    const { rows, headerRow } = pendingExcelData;
    const importedRows: AppaltoRow[] = [];

    const colOf = (field: MappableField): number | undefined => {
      const entry = Object.entries(mapping).find(([, v]) => v === field);
      return entry ? Number(entry[0]) : undefined;
    };

    const descrCol = colOf('descrizione');
    if (descrCol === undefined) return;

    const quantitaCol = colOf('quantita');
    const prezzoCol = colOf('prezzoUnitario');
    const totaleCol = colOf('totale');
    const umCol = colOf('unitaMisura');
    const costoCol = colOf('costoPrevisto');
    const ricavoCol = colOf('ricavoPrevisto');

    const stack: { indent: number; id: string }[] = [];

    for (let i = headerRow + 1; i < rows.length; i += 1) {
      const row = rows[i] ?? [];
      const rawDescr = row[descrCol] ?? '';
      const rawDescrText = String(rawDescr);
      const descrizione = rawDescrText.trim();
      if (!descrizione || shouldSkipDescrizione(descrizione)) continue;

      const quantitaValue = quantitaCol !== undefined ? parseNumberCell(row[quantitaCol]) : null;
      const prezzoValue = prezzoCol !== undefined ? parseNumberCell(row[prezzoCol]) : null;
      const totaleValue = totaleCol !== undefined ? parseNumberCell(row[totaleCol]) : null;
      const costoValue = costoCol !== undefined ? parseNumberCell(row[costoCol]) : null;
      const ricavoValue = ricavoCol !== undefined ? parseNumberCell(row[ricavoCol]) : null;

      let prezzoUnitario = prezzoValue;
      if (prezzoUnitario == null && quantitaValue != null && totaleValue != null && quantitaValue > 0) {
        prezzoUnitario = totaleValue / quantitaValue;
      }

      const unitCandidate = umCol !== undefined ? row[umCol] : undefined;
      const unitaMisura =
        typeof unitCandidate === 'string' && unitCandidate.trim() && Number.isNaN(Number(unitCandidate))
          ? unitCandidate.trim()
          : '';

      const indent = rawDescrText.length - rawDescrText.trimStart().length;
      while (stack.length > 0 && stack[stack.length - 1].indent >= indent) stack.pop();
      const parentId = stack.length > 0 ? stack[stack.length - 1].id : null;

      const id = buildRowId();
      importedRows.push({
        id,
        parentId,
        societaId: defaultSocietaId ?? '',
        descrizione,
        unitaMisura,
        quantita: quantitaValue != null ? String(quantitaValue) : '',
        prezzoUnitario: prezzoUnitario != null ? String(prezzoUnitario) : '',
        avanzamentoPercent: '',
        costoPrevisto: costoValue != null ? String(costoValue) : '',
        costoEffettivo: '',
        ricavoPrevisto: ricavoValue != null ? String(ricavoValue) : '',
        ricavoEffettivo: '',
      });
      stack.push({ indent, id });
    }

    if (importedRows.length === 0) {
      setError('Nessuna voce valida trovata con la mappatura selezionata.');
    } else {
      setAppaltoRows((prev) => [...prev, ...importedRows]);
    }
    setPendingExcelData(null);
  };

  const handleCancelExcelMapping = () => {
    setPendingExcelData(null);
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
    handleRemoveAppaltoRows,
    handleClearAppaltoRows,
    toggleAppaltoRow,
    handleSaveAppaltoRows,
    handleImportAppaltoExcel,
    pendingExcelData,
    handleConfirmExcelMapping,
    handleCancelExcelMapping,
    appaltoRowsFlat,
  };
}
