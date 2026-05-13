'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch } from './apiFetch';

export type JobStatus = 'IN_CODA' | 'IN_ELABORAZIONE' | 'COMPLETATO' | 'ERRORE';

export interface JobState {
  id: string;
  stato: JobStatus;
  righeProcessate: number | null;
  righeErrore: number | null;
  righeSuccesso: number | null;
  messaggioErrore: string | null;
  documento?: { id: string; nomeFile: string } | null;
  createdAt: string;
  updatedAt: string;
}

const TERMINAL_STATES = new Set<JobStatus>(['COMPLETATO', 'ERRORE']);
const POLL_INTERVAL_MS = 3000;

/**
 * Hook per il polling dello stato di un job di importazione.
 * Fa polling ogni 3 secondi finché il job non raggiunge uno stato terminale.
 */
export function useJobPolling(baseUrl: string) {
  const [activeJob, setActiveJob] = useState<JobState | null>(null);
  const [recentJobs, setRecentJobs] = useState<JobState[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const fetchJobStatus = useCallback(async (jobId: string): Promise<JobState | null> => {
    try {
      return await apiFetch<JobState>(`${baseUrl}/api/jobs/${jobId}`);
    } catch {
      return null;
    }
  }, [baseUrl]);

  const pollJob = useCallback(async (jobId: string) => {
    const job = await fetchJobStatus(jobId);
    if (!job) return;

    setActiveJob(job);

    if (TERMINAL_STATES.has(job.stato)) {
      stopPolling();
      // Aggiorna la lista dei job recenti
      setRecentJobs(prev => {
        const filtered = prev.filter(j => j.id !== job.id);
        return [job, ...filtered].slice(0, 10);
      });
    } else {
      pollTimerRef.current = setTimeout(() => pollJob(jobId), POLL_INTERVAL_MS);
    }
  }, [fetchJobStatus, stopPolling]);

  const startPolling = useCallback((jobId: string) => {
    stopPolling();
    setIsPolling(true);
    pollJob(jobId);
  }, [stopPolling, pollJob]);

  const fetchRecentJobs = useCallback(async () => {
    try {
      const data = await apiFetch<JobState[]>(`${baseUrl}/api/jobs?limit=10`);
      setRecentJobs(data ?? []);
      const runningJob = (data ?? []).find(j => !TERMINAL_STATES.has(j.stato));
      if (runningJob) {
        startPolling(runningJob.id);
      }
    } catch { /* silent */ }
  }, [baseUrl, startPolling]);

  const dismissJob = useCallback(() => {
    setActiveJob(null);
  }, []);

  // Cleanup al unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return {
    activeJob,
    recentJobs,
    isPolling,
    startPolling,
    fetchRecentJobs,
    dismissJob,
  };
}
