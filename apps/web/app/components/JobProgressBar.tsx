'use client';
import { AlertCircle, CheckCircle2, Clock, Loader2, X } from 'lucide-react';
import type { JobState, JobStatus } from '../hooks/useJobPolling';

interface JobProgressBarProps {
  job: JobState;
  onDismiss: () => void;
}

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; icon: React.ReactNode }> = {
  IN_CODA: {
    label: 'In coda...',
    color: 'bg-blue-500',
    icon: <Clock size={14} className="text-blue-500 animate-pulse" />,
  },
  IN_ELABORAZIONE: {
    label: 'Elaborazione in corso...',
    color: 'bg-[#4B6E48]',
    icon: <Loader2 size={14} className="text-[#4B6E48] animate-spin" />,
  },
  COMPLETATO: {
    label: 'Importazione completata',
    color: 'bg-emerald-500',
    icon: <CheckCircle2 size={14} className="text-emerald-500" />,
  },
  ERRORE: {
    label: 'Errore durante l\'importazione',
    color: 'bg-red-500',
    icon: <AlertCircle size={14} className="text-red-500" />,
  },
};

function computeProgress(job: JobState): number {
  const totale = (job.righeSuccesso ?? 0) + (job.righeErrore ?? 0);
  const processate = job.righeProcessate ?? totale;
  if (job.stato === 'COMPLETATO') return 100;
  if (job.stato === 'IN_CODA') return 0;
  if (processate > 0 && job.righeProcessate) {
    return Math.min(95, Math.round((totale / job.righeProcessate) * 100));
  }
  return 30; // Progresso indeterminato durante elaborazione
}

export function JobProgressBar({ job, onDismiss }: JobProgressBarProps) {
  const config = STATUS_CONFIG[job.stato];
  const progress = computeProgress(job);
  const isTerminal = job.stato === 'COMPLETATO' || job.stato === 'ERRORE';
  const fileName = job.documento?.nomeFile ?? 'file';

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-96 bg-gray-100 rounded-2xl border shadow-2xl shadow-slate-300/30 overflow-hidden transition-all animate-in slide-in-from-bottom-4 duration-500 ${
      job.stato === 'ERRORE' ? 'border-red-200' : job.stato === 'COMPLETATO' ? 'border-emerald-200' : 'border-gray-300'
    }`}>
      {/* Barra progresso */}
      <div className="h-1 w-full bg-slate-600/50">
        <div
          className={`h-full transition-all duration-700 ease-out ${config.color} ${!isTerminal ? 'animate-pulse' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {config.icon}
            <div className="min-w-0">
              <p className="text-[11px] font-black text-[#4B6E48] uppercase tracking-wider truncate">
                {config.label}
              </p>
              <p className="text-[10px] text-gray-600 truncate mt-0.5">{fileName}</p>
            </div>
          </div>
          {isTerminal && (
            <button
              onClick={onDismiss}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-800 hover:bg-slate-600/50 transition-colors flex-shrink-0"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Dettagli risultato */}
        {isTerminal && (
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-4 text-[10px]">
            {job.righeSuccesso != null && (
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 size={10} />
                {job.righeSuccesso} righe importate
              </span>
            )}
            {job.righeErrore != null && job.righeErrore > 0 && (
              <span className="flex items-center gap-1 text-red-500 font-bold">
                <AlertCircle size={10} />
                {job.righeErrore} errori
              </span>
            )}
            {job.stato === 'ERRORE' && job.messaggioErrore && (
              <span className="text-red-400 truncate">{job.messaggioErrore}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
