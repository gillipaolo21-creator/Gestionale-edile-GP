'use client';
import { AlertCircle, CheckCircle2, Clock, CreditCard, Euro, FileText, PlusCircle, TrendingUp } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { ApiFattura, ApiSal, StatoPagamento, TipoDocumentoFiscale } from '../types/api';
import { apiFetch } from '../hooks/apiFetch';
import { FatturaRowSkeleton, SalRowSkeleton } from './Skeleton';

// ─── Sub-types ───────────────────────────────────────────────────────────────

interface NewFatturaForm {
  tipoDocumento: TipoDocumentoFiscale;
  importoImponibile: string;
  iva: string;
  dataScadenza: string;
  salId: string;
}

interface NewSalForm {
  dataCertificazione: string;
  percentualeCompletamento: string;
  importoMaturato: string;
}

const TIPO_DOC_LABELS: Record<TipoDocumentoFiscale, string> = {
  FATTURA_ATTIVA: 'Fattura Attiva',
  FATTURA_PASSIVA: 'Fattura Passiva',
  NOTA_CREDITO: 'Nota di Credito',
};

const STATO_PAG_META: Record<StatoPagamento, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  PAGATO: { label: 'Pagato', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
  PARZIALE: { label: 'Parziale', color: 'text-[#4B6E48] bg-[#F2F0EF]', icon: Clock },
  DA_PAGARE: { label: 'Da Pagare', color: 'text-red-600 bg-red-50', icon: AlertCircle },
};

const SAL_STATE_LABELS: Record<string, { label: string; color: string }> = {
  BOZZA: { label: 'Bozza', color: 'bg-slate-600/50 text-gray-800' },
  APPROVATO: { label: 'Approvato DL', color: 'bg-blue-100 text-blue-700' },
  FATTURABILE: { label: 'Fatturabile', color: 'bg-emerald-100 text-emerald-700' },
};

// ─── Component ───────────────────────────────────────────────────────────────

interface TabContabilitaProps {
  commessaId: string;
  baseUrl: string;
}

export function TabContabilita({ commessaId, baseUrl }: Readonly<TabContabilitaProps>) {
  const [fatture, setFatture] = useState<ApiFattura[]>([]);
  const [sals, setSals] = useState<ApiSal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'fatture' | 'sal'>('sal');
  const [showFatturaForm, setShowFatturaForm] = useState(false);
  const [showSalForm, setShowSalForm] = useState(false);
  const [fatturaForm, setFatturaForm] = useState<NewFatturaForm>({
    tipoDocumento: 'FATTURA_ATTIVA',
    importoImponibile: '',
    iva: '22',
    dataScadenza: '',
    salId: '',
  });
  const [salForm, setSalForm] = useState<NewSalForm>({
    dataCertificazione: '',
    percentualeCompletamento: '',
    importoMaturato: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [fRes, sRes] = await Promise.all([
        apiFetch<ApiFattura[]>(`${baseUrl}/api/commesse/${commessaId}/fatture`),
        apiFetch<ApiSal[]>(`${baseUrl}/api/commesse/${commessaId}/sal`),
      ]);
      setFatture(fRes ?? []);
      setSals(sRes ?? []);
    } catch {
      toast.error('Errore nel caricamento dati contabilità');
    } finally {
      setLoading(false);
    }
  }, [baseUrl, commessaId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddFattura = async () => {
    if (!fatturaForm.importoImponibile || !fatturaForm.dataScadenza) {
      toast.error('Compila imponibile e data scadenza');
      return;
    }
    setSaving(true);
    try {
      await apiFetch(`${baseUrl}/api/commesse/${commessaId}/fatture`, {
        method: 'POST',
        body: JSON.stringify({
          ...fatturaForm,
          importoImponibile: Number.parseFloat(fatturaForm.importoImponibile),
          iva: Number.parseFloat(fatturaForm.iva),
          salId: fatturaForm.salId || null,
        }),
      });
      setShowFatturaForm(false);
      setFatturaForm({ tipoDocumento: 'FATTURA_ATTIVA', importoImponibile: '', iva: '22', dataScadenza: '', salId: '' });
      toast.success('Fattura registrata');
      await fetchData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSal = async () => {
    if (!salForm.dataCertificazione || !salForm.importoMaturato) {
      toast.error('Compila data certificazione e importo maturato');
      return;
    }
    setSaving(true);
    try {
      await apiFetch(`${baseUrl}/api/commesse/${commessaId}/sal`, {
        method: 'POST',
        body: JSON.stringify({
          ...salForm,
          percentualeCompletamento: Number.parseFloat(salForm.percentualeCompletamento || '0'),
          importoMaturato: Number.parseFloat(salForm.importoMaturato),
        }),
      });
      setShowSalForm(false);
      setSalForm({ dataCertificazione: '', percentualeCompletamento: '', importoMaturato: '' });
      toast.success('SAL registrato');
      await fetchData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Errore durante il salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFatturaStato = async (id: string, statoPagamento: StatoPagamento) => {
    try {
      await apiFetch(`${baseUrl}/api/fatture/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ statoPagamento }),
      });
      toast.success('Stato aggiornato');
      await fetchData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Errore aggiornamento stato');
    }
  };

  // ─── Derived stats ──────────────────────────────────────────────────────────
  const totaleFatturato = fatture.reduce((s, f) => s + Number.parseFloat(f.importoImponibile), 0);
  const totalePagato = fatture
    .filter(f => f.statoPagamento === 'PAGATO')
    .reduce((s, f) => s + Number.parseFloat(f.importoImponibile), 0);
  const ultimoSal = sals[0];
  const avanzamento = ultimoSal ? Number.parseFloat(ultimoSal.percentualeCompletamento) : 0;

  // ─── Extracted render blocks (avoid nested ternaries) ────────────────────
  let salContent: React.ReactNode;
  if (loading) {
    salContent = (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <SalRowSkeleton key={i} />)}
      </div>
    );
  } else if (sals.length === 0) {
    salContent = (
      <div className="py-16 text-center text-gray-600">
        <TrendingUp size={32} strokeWidth={1} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Nessun SAL registrato</p>
      </div>
    );
  } else {
    salContent = (
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-slate-600/50" />
        <div className="space-y-4">
          {sals.map((sal, idx) => {
            const meta = SAL_STATE_LABELS[sal.stato] ?? { label: sal.stato, color: 'bg-slate-600/50 text-gray-800' };
            return (
              <div key={sal.id} className="flex items-start gap-6 relative animate-in fade-in slide-in-from-left-2 duration-500">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white z-10 flex-shrink-0 ${idx === 0 ? 'bg-[#4B6E48]' : 'bg-slate-200'}`}>
                  {sal.progressivo}
                </div>
                <div className="flex-1 bg-gray-100 border border-stone-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">SAL n.{sal.progressivo} — {new Date(sal.dataCertificazione).toLocaleDateString('it-IT')}</p>
                      <p className="text-lg font-black text-[#4B6E48]">€ {Number.parseFloat(sal.importoMaturato).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${meta.color}`}>{meta.label}</span>
                  </div>
                  <div className="w-full bg-slate-600/50 rounded-full h-1.5 mt-3">
                    <div
                      className="bg-[#4B6E48] h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, Number.parseFloat(sal.percentualeCompletamento))}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-600 mt-1 font-semibold">{Number.parseFloat(sal.percentualeCompletamento).toFixed(1)}% completamento</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  let fattureContent: React.ReactNode;
  if (loading) {
    fattureContent = (
      <div className="space-y-2">
        {[1, 2, 3].map(i => <FatturaRowSkeleton key={i} />)}
      </div>
    );
  } else if (fatture.length === 0) {
    fattureContent = (
      <div className="py-16 text-center text-gray-600">
        <FileText size={32} strokeWidth={1} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Nessuna fattura registrata</p>
      </div>
    );
  } else {
    fattureContent = (
      <div className="space-y-2">
        {fatture.map(f => {
          const statoPagMeta = STATO_PAG_META[f.statoPagamento];
          const imponibile = Number.parseFloat(f.importoImponibile);
          const iva = Number.parseFloat(f.iva);
          const totale = imponibile + iva;
          return (
            <div key={f.id} className="flex items-center justify-between bg-gray-100 border border-stone-100 rounded-2xl px-6 py-4 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                  <CreditCard size={16} strokeWidth={1.5} className="text-[#4B6E48]" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#4B6E48] uppercase">{TIPO_DOC_LABELS[f.tipoDocumento]}</p>
                  <p className="text-[9px] text-gray-600 uppercase tracking-widest">Scadenza: {f.dataScadenza ? new Date(f.dataScadenza).toLocaleDateString('it-IT') : '—'}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <div>
                  <p className="text-xs font-black text-[#4B6E48]">€ {totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                  <p className="text-[9px] text-gray-600">impon. {imponibile.toLocaleString('it-IT')} + IVA {iva.toLocaleString('it-IT')}</p>
                </div>
                <select
                  value={f.statoPagamento}
                  onChange={e => handleUpdateFatturaStato(f.id, e.target.value as StatoPagamento)}
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${statoPagMeta.color}`}
                >
                  <option value="DA_PAGARE">Da Pagare</option>
                  <option value="PARZIALE">Parziale</option>
                  <option value="PAGATO">Pagato</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
      {/* KPI summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Totale Fatturato', value: `€ ${totaleFatturato.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`, icon: Euro, color: 'bg-[#4B6E48] text-white' },
          { label: 'Totale Pagato', value: `€ ${totalePagato.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`, icon: CheckCircle2, color: 'bg-gray-100 text-[#4B6E48] border border-gray-300' },
          { label: 'Avanzamento Lavori', value: `${avanzamento.toFixed(1)} %`, icon: TrendingUp, color: 'bg-gray-100 text-[#4B6E48] border border-gray-300' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`rounded-2xl p-6 flex items-center gap-4 ${color} shadow-sm`}>
            <Icon size={24} strokeWidth={1.5} />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</p>
              <p className="text-xl font-black leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex gap-6 border-b border-gray-300">
        {(['sal', 'fatture'] as const).map(s => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeSection === s ? 'text-[#4B6E48]' : 'text-gray-600 hover:text-gray-800'}`}
          >
            {s === 'sal' ? 'Stato Avanzamento Lavori' : 'Fatture'}
            {activeSection === s && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4B6E48] rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* SAL Timeline */}
      {activeSection === 'sal' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Timeline SAL ({sals.length})</p>
            <button
              onClick={() => setShowSalForm(v => !v)}
              className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#4B6E48] hover:opacity-70 transition-opacity"
            >
              <PlusCircle size={14} /> Nuovo SAL
            </button>
          </div>

          {showSalForm && (
            <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest">Nuovo SAL</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="sal-data-cert" className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-1">Data Certificazione</label>
                  <input id="sal-data-cert" type="date" value={salForm.dataCertificazione} onChange={e => setSalForm(f => ({ ...f, dataCertificazione: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#4B6E48] focus:outline-none focus:border-[#4B6E48]" />
                </div>
                <div>
                  <label htmlFor="sal-perc" className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-1">% Completamento</label>
                  <input id="sal-perc" type="number" min="0" max="100" value={salForm.percentualeCompletamento} onChange={e => setSalForm(f => ({ ...f, percentualeCompletamento: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#4B6E48] focus:outline-none focus:border-[#4B6E48]" placeholder="0" />
                </div>
                <div>
                  <label htmlFor="sal-importo" className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-1">Importo Maturato (€)</label>
                  <input id="sal-importo" type="number" value={salForm.importoMaturato} onChange={e => setSalForm(f => ({ ...f, importoMaturato: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#4B6E48] focus:outline-none focus:border-[#4B6E48]" placeholder="0.00" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowSalForm(false)} disabled={saving} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50">Annulla</button>
                <button onClick={handleAddSal} disabled={saving} className="px-5 py-2 bg-[#4B6E48] text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#4B6E48] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {saving ? 'Salvataggio…' : 'Salva SAL'}
                </button>
              </div>
            </div>
          )}

          {salContent}
        </div>
      )}

      {/* Fatture List */}
      {activeSection === 'fatture' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Fatture ({fatture.length})</p>
            <button
              onClick={() => setShowFatturaForm(v => !v)}
              className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#4B6E48] hover:opacity-70 transition-opacity"
            >
              <PlusCircle size={14} /> Nuova Fattura
            </button>
          </div>

          {showFatturaForm && (
            <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest">Nuova Fattura</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fat-tipo" className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-1">Tipo</label>
                  <select id="fat-tipo" value={fatturaForm.tipoDocumento} onChange={e => setFatturaForm(f => ({ ...f, tipoDocumento: e.target.value as TipoDocumentoFiscale }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#4B6E48] focus:outline-none focus:border-[#4B6E48]">
                    {(Object.entries(TIPO_DOC_LABELS) as [TipoDocumentoFiscale, string][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="fat-sal" className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-1">SAL Collegato</label>
                  <select id="fat-sal" value={fatturaForm.salId} onChange={e => setFatturaForm(f => ({ ...f, salId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#4B6E48] focus:outline-none focus:border-[#4B6E48]">
                    <option value="">— Nessuno —</option>
                    {sals.map(s => <option key={s.id} value={s.id}>SAL n.{s.progressivo} ({new Date(s.dataCertificazione).toLocaleDateString('it-IT')})</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="fat-importo" className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-1">Imponibile (€)</label>
                  <input id="fat-importo" type="number" value={fatturaForm.importoImponibile} onChange={e => setFatturaForm(f => ({ ...f, importoImponibile: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#4B6E48] focus:outline-none focus:border-[#4B6E48]" placeholder="0.00" />
                </div>
                <div>
                  <label htmlFor="fat-iva" className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-1">IVA (%)</label>
                  <input id="fat-iva" type="number" value={fatturaForm.iva} onChange={e => setFatturaForm(f => ({ ...f, iva: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#4B6E48] focus:outline-none focus:border-[#4B6E48]" />
                </div>
                <div>
                  <label htmlFor="fat-scadenza" className="text-[9px] font-black uppercase tracking-widest text-gray-600 block mb-1">Data Scadenza</label>
                  <input id="fat-scadenza" type="date" value={fatturaForm.dataScadenza} onChange={e => setFatturaForm(f => ({ ...f, dataScadenza: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#4B6E48] focus:outline-none focus:border-[#4B6E48]" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowFatturaForm(false)} disabled={saving} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50">Annulla</button>
                <button onClick={handleAddFattura} disabled={saving} className="px-5 py-2 bg-[#4B6E48] text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#4B6E48] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {saving ? 'Salvataggio…' : 'Salva'}
                </button>
              </div>
            </div>
          )}

          {fattureContent}
        </div>
      )}
    </div>
  );
}
