const TOKEN_KEY = 'strade_servizi_token';

function getToken(): string | null {
  if (typeof globalThis.window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Estrae il messaggio leggibile da una risposta HTTP di errore */
async function parseErrorMessage(res: Response): Promise<string> {
  const text = await res.text().catch(() => '');
  if (!text) return res.statusText || `Errore ${res.status}`;
  try {
    const json = JSON.parse(text) as Record<string, unknown>;
    if (typeof json.message === 'string') return json.message;
    if (Array.isArray(json.message)) return (json.message as string[]).join(', ');
    if (typeof json.error === 'string') return json.error;
  } catch {
    // non era JSON — restituiamo il testo grezzo (troncato)
    return text.slice(0, 200);
  }
  return `Errore ${res.status}`;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const message = await parseErrorMessage(res);

    // Sessione scaduta: reindirizza al login
    if (res.status === 401 && typeof globalThis.window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      globalThis.location.href = '/login';
    }

    throw new ApiError(res.status, message);
  }

  const text = await res.text();
  return text ? JSON.parse(text) as T : undefined as unknown as T;
}

