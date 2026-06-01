'use client';
import {
    Banknote, Briefcase, CalendarDays, CheckCircle2,
    FileInput, FolderOpen, Hash, Loader2, MapPin, Paperclip, StickyNote, Upload, User, X,
} from 'lucide-react';
import React, { useRef } from 'react';
import { EuroAmountInput } from './EuroAmountInput';

const TIPO_OPERA_OPTIONS = [
  { value: 'MOVIMENTO_TERRA', label: 'Movimento Terra' },
  { value: 'CAPANNONE_LOGISTICO', label: 'Capannone Logistico' },
  { value: 'INFRASTRUTTURA_STRADALE', label: 'Infrastruttura Stradale' },
  { value: 'OPERE_CIVILI', label: 'Opere Civili' },
  { value: 'PAVIMENTAZIONE', label: 'Pavimentazione' },
  { value: 'OPERE_VERDE', label: 'Opere a Verde' },
  { value: 'ALTRO', label: 'Altro' },
];

const STATO_OPTIONS = [
  { value: 'AGGIUDICATO', label: 'Aggiudicato' },
  { value: 'IN_CORSO', label: 'In Corso' },
  { value: 'SOSPESO', label: 'Sospeso' },
];

export interface ImportFormData {
  societaId: string;
  codiceIdentificativo: string;
  nomeCliente: string;
  tipoOpera: string;
  indirizzo: string;
  citta: string;
  cap: string;
  provincia: string;
  responsabile: string;
  importoContratto: string;
  importoLavoriPropri: string;
  dataInizio: string;
  dataFinePrevista: string;
  stato: string;
  note: string;
}

export type ImportDocMode = 'none' | 'server' | 'local';

interface ImportCommessaModalProps {
  isOpen: boolean;
  success: boolean;
  submitting: boolean;
  formData: ImportFormData;
  setFormData: React.Dispatch<React.SetStateAction<ImportFormData>>;
  societaOptions: { id: string; nome: string }[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  // Selezione documenti
  pmFolders: string[];
  importDocMode: ImportDocMode;
  setImportDocMode: (m: ImportDocMode) => void;
  selectedPmFolder: string;
  onSelectPmFolder: (folder: string) => void;
  pmFolderFiles: { name: string; size: number }[];
  selectedFileNames: Set<string>;
  toggleFileName: (name: string) => void;
  localFiles: File[];
  onLocalFilesChange: (files: File[]) => void;
  loadingFolderFiles: boolean;
}

const inputCls =
  'w-full bg-[#F2F0EF] border border-slate-400 rounded-xl px-4 py-3 text-sm font-semibold text-[#4B6E48] outline-none focus:border-[#4B6E48] transition-colors placeholder:text-gray-400 placeholder:font-normal';

const labelCls =
  'text-[8px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5';

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{icon}{label}</label>
      {children}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImportCommessaModal({
  isOpen, success, submitting, formData, setFormData, societaOptions, onClose, onSubmit,
  pmFolders, importDocMode, setImportDocMode, selectedPmFolder, onSelectPmFolder,
  pmFolderFiles, selectedFileNames, toggleFileName, localFiles, onLocalFilesChange,
  loadingFolderFiles,
}: ImportCommessaModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const folderPickerAttrs = {
    webkitdirectory: 'true',
    directory: 'true',
  } as unknown as React.InputHTMLAttributes<HTMLInputElement>;

  const selectedRootFolders = Array.from(new Set(
    localFiles
      .map((file) => {
        const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
        if (!relativePath) return '';
        const root = relativePath.split('/')[0];
        return root || '';
      })
      .filter(Boolean),
  ));

  if (!isOpen) return null;

  const canSubmit = !submitting && (
    importDocMode === 'none'
    || (importDocMode === 'server' && selectedFileNames.size > 0)
    || (importDocMode === 'local' && localFiles.length > 0)
  );

  const set = (key: keyof ImportFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#4B6E48]/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-100 w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden border border-gray-300 flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="p-8 pb-6 border-b border-stone-200 flex justify-between items-center bg-[#F2F0EF] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileInput size={16} className="text-[#B2AC88]" />
              <span className="text-[9px] font-black text-[#B2AC88] uppercase tracking-widest">Importazione Commessa Esistente</span>
            </div>
            <h3 className="text-2xl font-black text-[#4B6E48] tracking-tighter uppercase">Registra Cantiere Aperto</h3>
            <p className="text-[9px] text-gray-500 mt-1">Inserisci i dati di una commessa già in corso da registrare nel gestionale</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-stone-200 flex items-center justify-center text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        {success ? (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[#4B6E48]/10 text-[#4B6E48] rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={48} strokeWidth={1.5} />
            </div>
            <h4 className="text-2xl font-black text-[#4B6E48] uppercase tracking-tighter">Commessa Importata</h4>
            <p className="text-sm text-gray-500">Il cantiere è stato registrato correttamente nel sistema.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">

            {/* Sezione 1: Identificazione */}
            <section className="space-y-4">
              <p className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest border-b border-[#4B6E48]/20 pb-2">
                1 · Identificazione
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Codice Commessa" icon={<Hash size={9} />}>
                  <input
                    required type="text" placeholder="Es: 2025-COMM-007"
                    className={inputCls} value={formData.codiceIdentificativo} onChange={set('codiceIdentificativo')}
                  />
                </Field>
                <Field label="Societa" icon={<Briefcase size={9} />}>
                  <select required className={inputCls} value={formData.societaId} onChange={set('societaId')}>
                    <option value="">-- Seleziona --</option>
                    {societaOptions.map((s) => (
                      <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Stato Attuale" icon={<Briefcase size={9} />}>
                  <select required className={inputCls} value={formData.stato} onChange={set('stato')}>
                    {STATO_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Committente / Nome Cliente" icon={<User size={9} />}>
                  <input
                    required type="text" placeholder="Es: Comune di Milano"
                    className={inputCls} value={formData.nomeCliente} onChange={set('nomeCliente')}
                  />
                </Field>
                <Field label="Tipo Opera" icon={<Briefcase size={9} />}>
                  <select required className={inputCls} value={formData.tipoOpera} onChange={set('tipoOpera')}>
                    <option value="">-- Seleziona --</option>
                    {TIPO_OPERA_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Responsabile di Cantiere" icon={<User size={9} />}>
                <input
                  type="text" placeholder="Es: Ing. Rossi"
                  className={inputCls} value={formData.responsabile} onChange={set('responsabile')}
                />
              </Field>
            </section>

            {/* Sezione 2: Localizzazione */}
            <section className="space-y-4">
              <p className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest border-b border-[#4B6E48]/20 pb-2">
                2 · Localizzazione Cantiere
              </p>
              <Field label="Indirizzo (Via e Civico)" icon={<MapPin size={9} />}>
                <input
                  required type="text" placeholder="Es: Via Torino 45"
                  className={inputCls} value={formData.indirizzo} onChange={set('indirizzo')}
                />
              </Field>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3">
                  <Field label="Città / Comune">
                    <input
                      required type="text" placeholder="Es: Milano"
                      className={inputCls} value={formData.citta} onChange={set('citta')}
                    />
                  </Field>
                </div>
                <Field label="CAP">
                  <input
                    type="text" maxLength={5} placeholder="20100"
                    className={inputCls} value={formData.cap} onChange={set('cap')}
                  />
                </Field>
                <Field label="Prov.">
                  <input
                    type="text" maxLength={2} placeholder="MI"
                    className={`${inputCls} uppercase`} value={formData.provincia} onChange={set('provincia')}
                  />
                </Field>
              </div>
            </section>

            {/* Sezione 3: Dati Economici */}
            <section className="space-y-4">
              <p className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest border-b border-[#4B6E48]/20 pb-2">
                3 · Dati Economici
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Importo Contratto (€)" icon={<Banknote size={9} />}>
                  <EuroAmountInput
                    min="0"
                    placeholder="Es: 250000"
                    className={inputCls}
                    value={formData.importoContratto}
                    onValueChange={(nextValue) => setFormData((prev) => ({ ...prev, importoContratto: nextValue }))}
                  />
                </Field>
                <Field label="Importo Lavori Propri (€)" icon={<Banknote size={9} />}>
                  <EuroAmountInput
                    min="0"
                    placeholder="Es: 200000"
                    className={inputCls}
                    value={formData.importoLavoriPropri}
                    onValueChange={(nextValue) => setFormData((prev) => ({ ...prev, importoLavoriPropri: nextValue }))}
                  />
                </Field>
              </div>
            </section>

            {/* Sezione 4: Date */}
            <section className="space-y-4">
              <p className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest border-b border-[#4B6E48]/20 pb-2">
                4 · Tempistica
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Data Inizio Effettiva" icon={<CalendarDays size={9} />}>
                  <input
                    required type="date"
                    className={inputCls} value={formData.dataInizio} onChange={set('dataInizio')}
                  />
                </Field>
                <Field label="Data Fine Prevista (opzionale)" icon={<CalendarDays size={9} />}>
                  <input
                    type="date"
                    className={inputCls} value={formData.dataFinePrevista} onChange={set('dataFinePrevista')}
                  />
                </Field>
              </div>
            </section>

            {/* Sezione 5: Note */}
            <section className="space-y-4">
              <p className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest border-b border-[#4B6E48]/20 pb-2">
                5 · Note
              </p>
              <Field label="Note aggiuntive (opzionale)" icon={<StickyNote size={9} />}>
                <textarea
                  rows={3} placeholder="Informazioni aggiuntive sulla commessa..."
                  className={`${inputCls} resize-none`} value={formData.note} onChange={set('note')}
                />
              </Field>
            </section>

            {/* Sezione 6: Documenti */}
            <section className="space-y-4">
              <p className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest border-b border-[#4B6E48]/20 pb-2">
                6 · Documenti da importare
              </p>

              {/* Selezione modalità */}
              <div className="flex gap-2">
                {([
                  { mode: 'none' as ImportDocMode, label: 'Nessun documento', icon: <X size={11} /> },
                  { mode: 'server' as ImportDocMode, label: 'Cartella server', icon: <FolderOpen size={11} /> },
                  { mode: 'local' as ImportDocMode, label: 'Carica da computer', icon: <Upload size={11} /> },
                ]).map(({ mode, label, icon }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setImportDocMode(mode);
                      onSelectPmFolder('');
                      onLocalFilesChange([]);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${
                      importDocMode === mode
                        ? 'bg-[#4B6E48] text-white border-[#4B6E48]'
                        : 'bg-[#F2F0EF] text-gray-500 border-slate-300 hover:border-[#4B6E48]'
                    }`}
                  >
                    {icon}{label}
                  </button>
                ))}
              </div>

              {/* Modalità: cartella server */}
              {importDocMode === 'server' && (
                <div className="space-y-3">
                  <Field label="Seleziona cartella" icon={<FolderOpen size={9} />}>
                    <select
                      className={inputCls}
                      value={selectedPmFolder}
                      onChange={(e) => onSelectPmFolder(e.target.value)}
                    >
                      <option value="">-- Scegli cartella --</option>
                      {pmFolders.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </Field>

                  {selectedPmFolder && (
                    <div className="border border-slate-300 rounded-xl overflow-hidden">
                      <div className="bg-[#F2F0EF] px-4 py-2 flex items-center justify-between">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                          {loadingFolderFiles ? 'Caricamento...' : `${pmFolderFiles.length} file trovati`}
                        </span>
                        {pmFolderFiles.length > 0 && (
                          <button
                            type="button"
                            className="text-[9px] font-black text-[#4B6E48] uppercase tracking-widest hover:underline"
                            onClick={() => {
                              if (selectedFileNames.size === pmFolderFiles.length) {
                                pmFolderFiles.forEach((f) => selectedFileNames.has(f.name) && toggleFileName(f.name));
                              } else {
                                pmFolderFiles.forEach((f) => !selectedFileNames.has(f.name) && toggleFileName(f.name));
                              }
                            }}
                          >
                            {selectedFileNames.size === pmFolderFiles.length ? 'Deseleziona tutti' : 'Seleziona tutti'}
                          </button>
                        )}
                      </div>
                      {loadingFolderFiles && (
                        <div className="flex items-center justify-center py-8 text-gray-400">
                          <Loader2 size={20} className="animate-spin" />
                        </div>
                      )}
                      {!loadingFolderFiles && pmFolderFiles.length === 0 && (
                        <p className="text-center py-6 text-xs text-gray-400">Nessun file trovato in questa cartella</p>
                      )}
                      {!loadingFolderFiles && pmFolderFiles.length > 0 && (
                        <ul className="divide-y divide-slate-200 max-h-48 overflow-y-auto">
                          {pmFolderFiles.map((file) => (
                            <li key={file.name}>
                              <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F2F0EF] cursor-pointer transition-colors">
                                <input
                                  type="checkbox"
                                  checked={selectedFileNames.has(file.name)}
                                  onChange={() => toggleFileName(file.name)}
                                  className="accent-[#4B6E48] w-3.5 h-3.5 flex-shrink-0"
                                />
                                <Paperclip size={12} className="text-gray-400 flex-shrink-0" />
                                <span className="text-xs text-gray-700 font-medium flex-1 truncate">{file.name}</span>
                                <span className="text-[10px] text-gray-400">{formatBytes(file.size)}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                      {selectedFileNames.size > 0 && (
                        <div className="bg-[#4B6E48]/10 px-4 py-2 text-[9px] font-black text-[#4B6E48] uppercase tracking-widest">
                          {selectedFileNames.size} file selezionati
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Modalità: upload da computer */}
              {importDocMode === 'local' && (
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => onLocalFilesChange(Array.from(e.target.files ?? []))}
                  />
                  <input
                    ref={folderInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => onLocalFilesChange(Array.from(e.target.files ?? []))}
                    {...folderPickerAttrs}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-300 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-[#4B6E48] hover:text-[#4B6E48] transition-colors"
                    >
                      <Upload size={24} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Seleziona file singoli</span>
                      <span className="text-[10px]">PDF, DOCX, XLSX, immagini</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => folderInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-300 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-[#4B6E48] hover:text-[#4B6E48] transition-colors"
                    >
                      <FolderOpen size={24} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Seleziona cartella intera</span>
                      <span className="text-[10px]">Import ricorsivo con sottocartelle</span>
                    </button>
                  </div>

                  {selectedRootFolders.length > 0 && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[10px] text-emerald-700">
                      <span className="font-black uppercase tracking-widest">Cartella selezionata:</span>{' '}
                      {selectedRootFolders.join(', ')}
                    </div>
                  )}

                  <p className="text-[10px] text-gray-500">Max 50 MB per file.</p>

                  {localFiles.length > 0 && (
                    <ul className="divide-y divide-slate-200 border border-slate-300 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                      {localFiles.map((file, i) => (
                        <li key={`${file.name}-${i}`} className="flex items-center gap-3 px-4 py-2.5">
                          <Paperclip size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-700 font-medium flex-1 truncate">{(file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name}</span>
                          <span className="text-[10px] text-gray-400">{formatBytes(file.size)}</span>
                          <button
                            type="button"
                            onClick={() => onLocalFilesChange(localFiles.filter((_, j) => j !== i))}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button" onClick={onClose}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                Annulla
              </button>
              <button
                type="submit" disabled={!canSubmit}
                className="px-8 py-3 rounded-xl bg-[#4B6E48] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#5a8057] transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <FileInput size={14} />}
                {submitting ? 'Importazione...' : 'Importa Commessa'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
