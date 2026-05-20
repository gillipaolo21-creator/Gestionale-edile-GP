'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthUser {
  id: string;
  email: string;
  ruolo: string;
  nome: string | null;
  cognome: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const TOKEN_KEY = 'strade_servizi_token';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async (jwt: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      setToken(null);
      setUser(null);
    }
  }, []);

  // Carica il token salvato al boot
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      fetchMe(saved).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      let msg = 'Credenziali non valide';
      if (err.message) {
        if (typeof err.message === 'string') msg = err.message;
        else if (Array.isArray(err.message)) msg = err.message.join(', ');
        else if (err.message.message) {
          msg = Array.isArray(err.message.message) ? err.message.message.join(', ') : err.message.message;
        }
      }
      throw new Error(msg);
    }

    const { accessToken } = await res.json();
    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
    await fetchMe(accessToken);
  }, [fetchMe]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({ user, token, login, logout, isLoading }),
    [user, token, login, logout, isLoading],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider');
  return ctx;
}
