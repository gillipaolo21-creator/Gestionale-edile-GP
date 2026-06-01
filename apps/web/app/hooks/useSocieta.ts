'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ApiSocieta } from '../types/api';
import { apiFetch } from './apiFetch';

export function useSocieta(
  baseUrl: string,
  setError?: (msg: string | null) => void,
) {
  const [societa, setSocieta] = useState<ApiSocieta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSocieta = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const data = await apiFetch<ApiSocieta[]>(`${baseUrl}/api/societa`);
      setSocieta(data ?? []);
    } catch (err: unknown) {
      setError?.(err instanceof Error ? err.message : 'Impossibile recuperare le societa');
    } finally {
      setLoading(false);
    }
  }, [baseUrl, setError]);

  useEffect(() => {
    fetchSocieta();
  }, [fetchSocieta]);

  return {
    societa,
    loading,
    refresh: fetchSocieta,
  };
}
