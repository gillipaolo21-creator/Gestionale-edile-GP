'use client';
import { AlertCircle, Loader2, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect automatico se già loggato
  if (user) {
    router.push('/');
  }

  const handleSubmit = async (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore durante il login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F0EF]">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4B6E48] mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Strade & Servizi</h1>
          <p className="text-gray-600 text-sm mt-1">Gestionale Edile — Accesso riservato</p>
        </div>

        {/* Card */}
        <div className="bg-gray-100/80 backdrop-blur border border-gray-300 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#4B6E48] focus:ring-1 focus:ring-[#4B6E48] transition"
                  placeholder="nome@azienda.it"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#4B6E48] focus:ring-1 focus:ring-[#4B6E48] transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-3 py-2 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#4B6E48] hover:bg-[#5a8057] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#4B6E48] focus:ring-offset-2 focus:ring-offset-[#F2F0EF]"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Accesso in corso…</>
              ) : (
                'Accedi'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-800 text-xs mt-6">
          © {new Date().getFullYear()} Strade & Servizi — Uso interno riservato
        </p>
      </div>
    </div>
  );
}
