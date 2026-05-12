'use client';
import { AlertCircle, CheckCircle2, Clock, CreditCard, Euro, FileText, PlusCircle, TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { ApiFattura, ApiSal, StatoPagamento, TipoDocumentoFiscale } from '../types/api';

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
  PARZIALE: { label: 'Parziale', color: 'text-amber-600 bg-amber-50', icon: Clock },
  DA_PAGARE: { label: 'Da Pagare', color: 'text-red-600 bg-red-50', icon: AlertCircle },
};

const SAL_STATE_LABELS: Record<string, { label: string; color: string }> = {
  BOZZA: { label: 'Bozza', color: 'bg-stone-100 text-stone-600' },
  APPROVATO_DL: { label: 'Approvato DL', color: 'bg-blue-100 text-blue-700' },
  FATTURABILE: { label: 'Fatturabile', color: 'bg-emerald-100 text-emerald-700' },
};

// ─── Component ───────────────────────────────────────────────────────────────

interface TabContabilitaProps {
  commessaId: string;
  baseUrl: string;
}

export function TabContabilita({ commessaId, baseUrl }: TabContabilitaProps) {
  const [fatture, setFatture] = useState<ApiFattura[]>([]);
  const [sals, setSals] = useState<ApiSal[]>([]);
  const [loading, setLoading] = useState(true);
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
        fetch(`${baseUrl}/api/commesse/${commessaId}/fatture`),
        fetch(`${baseUrl}/api/commesse/${commessaId}/sal`),
      ]);
      if (fRes.ok) setFatture(await fRes.json());
      if (sRes.ok) setSals(await sRes.json());
    } finally {
      setLoading(false);
    }
  }, [baseUrl, commessaId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddFattura = async () => {
    if (!fatturaForm.importoImponibile || !fatturaForm.dataScadenza) return;
    await fetch(`${baseUrl}/api/commesse/${commessaId}/fatture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...fatturaForm,
        importoImponibile: parseFloat(fatturaForm.importoImponibile),
        iva: parseFloat(fatturaForm.iva),
        salId: fatturaForm.salId || null,
      }),
    });
    setShowFatturaForm(false);
    setFatturaForm({ tipoDocumento: 'FATTURA_ATTIVA', importoImponibile: '', iva: '22', dataScadenza: '', salId: '' });
    fetchData();
  };

  const handleAddSal = async () => {
    if (!salForm.dataCertificazione || !salForm.importoMaturato) return;
    await fetch(`${baseUrl}/api/commesse/${commessaId}/sal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...salForm,
        percentualeCompletamento: parseFloat(salForm.percentualeCompletamento || '0'),
        importoMaturato: parseFloat(salForm.importoMaturato),
      }),
    });
    setShowSalForm(false);
    setSalForm({ dataCertificazione: '', percentualeCompletamento: '', importoMaturato: '' });
    fetchData();
  };

  const handleUpdateFatturaStato = async (id: string, statoPagamento: StatoPagamento) => {
    await fetch(`${baseUrl}/api/fatture/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statoPagamento }),
    });
    fetchData();
  };

  // ─── Derived stats ──────────────────────────────────────────────────────────
  const totaleFatturato = fatture.reduce((s, f) => s + parseFloat(f.importoImponibile), 0);
  const totalePagato = fatture
    .filter(f => f.statoPagamento === 'PAGATO')
    .reduce((s, f) => s + parseFloat(f.importoImponibile), 0);
  const ultimoSal = sals[0];
  const avanzamento = ultimoSal ? parseFloat(ultimoSal.percentualeCompletamento) : 0;

  if (loading) {
    return <div className="py-20 text-center text-stone-400 text-sm">Caricamento dati contabilità…</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
      {/* KPI summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Totale Fatturato', value: `€ ${totaleFatturato.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`, icon: Euro, color: 'bg-[#003A7D] text-white' },
          { label: 'Totale Pagato', value: `€ ${totalePagato.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`, icon: CheckCircle2, color: 'bg-white text-[#003A7D] border border-stone-200' },
          { label: 'Avanzamento Lavori', value: `${avanzamento.toFixed(1)} %`, icon: TrendingUp, color: 'bg-white text-[#003A7D] border border-stone-200' },
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
      <div className="flex gap-6 border-b border-stone-200">
        {(['sal', 'fatture'] as const).map(s => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeSection === s ? 'text-[#0054B4]' : 'text-stone-400 hover:text-stone-600'}`}
          >
            {s === 'sal' ? 'Stato Avanzamento Lavori' : 'Fatture'}
            {activeSection === s && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0054B4] rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* SAL Timeline */}
      {activeSection === 'sal' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Timeline SAL ({sals.length})</p>
            <button
              onClick={() => setShowSalForm(v => !v)}
              className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#0054B4] hover:opacity-70 transition-opacity"
            >
              <PlusCircle size={14} /> Nuovo SAL
            </button>
          </div>

          {showSalForm && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <p className="text-[9px] font-black text-[#003A7D] uppercase tracking-widest">Nuovo SAL</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Data Certificazione</label>
                  <input type="date" value={salForm.dataCertificazione} onChange={e => setSalForm(f => ({ ...f, dataCertificazione: e.target.value }))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#003A7D] focus:outline-none focus:border-[#0054B4]" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">% Completamento</label>
                  <input type="number" min="0" max="100" value={salForm.percentualeCompletamento} onChange={e => setSalForm(f => ({ ...f, percentualeCompletamento: e.target.value }))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#003A7D] focus:outline-none focus:border-[#0054B4]" placeholder="0" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Importo Maturato (€)</label>
                  <input type="number" value={salForm.importoMaturato} onChange={e => setSalForm(f => ({ ...f, importoMaturato: e.target.value }))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#003A7D] focus:outline-none focus:border-[#0054B4]" placeholder="0.00" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowSalForm(false)} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors">Annulla</button>
                <button onClick={handleAddSal} className="px-5 py-2 bg-[#003A7D] text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#0054B4] transition-colors">Salva SAL</button>
              </div>
            </div>
          )}

          {sals.length === 0 ? (
            <div className="py-16 text-center text-stone-400">
              <TrendingUp size={32} strokeWidth={1} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nessun SAL registrato</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-stone-100" />
              <div className="space-y-4">
                {sals.map((sal, idx) => {
                  const meta = SAL_STATE_LABELS[sal.statoApprovazione] ?? { label: sal.statoApprovazione, color: 'bg-stone-100 text-stone-600' };
                  return (
                    <div key={sal.id} className="flex items-start gap-6 relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white z-10 flex-shrink-0 ${idx === 0 ? 'bg-[#0054B4]' : 'bg-stone-300'}`}>
                        {sal.progressivo}
                      </div>
                      <div className="flex-1 bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">SAL n.{sal.progressivo} — {new Date(sal.dataCertificazione).toLocaleDateString('it-IT')}</p>
                            <p className="text-lg font-black text-[#003A7D]">€ {parseFloat(sal.importoMaturato).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${meta.color}`}>{meta.label}</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3">
                          <div
                            className="bg-[#0054B4] h-1.5 rounded-full transition-all"
                            style={{ width: `${Math.min(100, parseFloat(sal.percentualeCompletamento))}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-stone-400 mt-1 font-semibold">{parseFloat(sal.percentualeCompletamento).toFixed(1)}% completamento</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fatture List */}
      {activeSection === 'fatture' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Fatture ({fatture.length})</p>
            <button
              onClick={() => setShowFatturaForm(v => !v)}
              className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#0054B4] hover:opacity-70 transition-opacity"
            >
              <PlusCircle size={14} /> Nuova Fattura
            </button>
          </div>

          {showFatturaForm && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <p className="text-[9px] font-black text-[#003A7D] uppercase tracking-widest">Nuova Fattura</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Tipo</label>
                  <select value={fatturaForm.tipoDocumento} onChange={e => setFatturaForm(f => ({ ...f, tipoDocumento: e.target.value as TipoDocumentoFiscale }))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#003A7D] focus:outline-none focus:border-[#0054B4]">
                    {(Object.entries(TIPO_DOC_LABELS) as [TipoDocumentoFiscale, string][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">SAL Collegato</label>
                  <select value={fatturaForm.salId} onChange={e => setFatturaForm(f => ({ ...f, salId: e.target.value }))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#003A7D] focus:outline-none focus:border-[#0054B4]">
                    <option value="">— Nessuno —</option>
                    {sals.map(s => <option key={s.id} value={s.id}>SAL n.{s.progressivo} ({new Date(s.dataCertificazione).toLocaleDateString('it-IT')})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Imponibile (€)</label>
                  <input type="number" value={fatturaForm.importoImponibile} onChange={e => setFatturaForm(f => ({ ...f, importoImponibile: e.target.value }))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#003A7D] focus:outline-none focus:border-[#0054B4]" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">IVA (%)</label>
                  <input type="number" value={fatturaForm.iva} onChange={e => setFatturaForm(f => ({ ...f, iva: e.target.value }))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#003A7D] focus:outline-none focus:border-[#0054B4]" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Data Scadenza</label>
                  <input type="date" value={fatturaForm.dataScadenza} onChange={e => setFatturaForm(f => ({ ...f, dataScadenza: e.target.value }))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-[#003A7D] focus:outline-none focus:border-[#0054B4]" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowFatturaForm(false)} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors">Annulla</button>
                <button onClick={handleAddFattura} className="px-5 py-2 bg-[#003A7D] text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#0054B4] transition-colors">Salva</button>
              </div>
            </div>
          )}

          {fatture.length === 0 ? (
            <div className="py-16 text-center text-stone-400">
              <FileText size={32} strokeWidth={1} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nessuna fattura registrata</p>
            </div>
          ) : (
            <div className="space-y-2">
              {fatture.map(f => {
                const statoPagMeta = STATO_PAG_META[f.statoPagamento];
                const Icon = statoPagMeta.icon;
                const imponibile = parseFloat(f.importoImponibile);
                const iva = parseFloat(f.iva);
                const totale = imponibile + iva;
                return (
                  <div key={f.id} className="flex items-center justify-between bg-white border border-stone-100 rounded-2xl px-6 py-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center">
                        <CreditCard size={16} strokeWidth={1.5} className="text-[#003A7D]" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#003A7D] uppercase">{TIPO_DOC_LABELS[f.tipoDocumento]}</p>
                        <p className="text-[9px] text-stone-400 uppercase tracking-widest">Scadenza: {new Date(f.dataScadenza).toLocaleDateString('it-IT')}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div>
                        <p className="text-xs font-black text-[#003A7D]">€ {totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                        <p className="text-[9px] text-stone-400">impon. {imponibile.toLocaleString('it-IT')} + IVA {iva.toLocaleString('it-IT')}</p>
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
          )}
        </div>
      )}
    </div>
  );
}
