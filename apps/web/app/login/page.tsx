'use client';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect automatico se già loggato
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          {/* Icona montagna/strada verde + testo STRADE e servizi */}
          <div className="inline-flex flex-col items-center mb-2">
            <div className="inline-flex items-center gap-2">
              {/* Icona verde stile logo sito */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Montagna / strada */}
                <polygon points="24,6 44,38 4,38" fill="#41755A" />
                <polygon points="24,14 36,38 12,38" fill="#2d5c3a" />
                {/* Strada centrale */}
                <rect x="21" y="28" width="6" height="10" fill="#FCBF1B" />
              </svg>
              <div className="text-left leading-tight">
                <div className="text-[#8B1A1A] font-extrabold text-2xl tracking-tight leading-none">STRADE</div>
                <div className="text-gray-600 font-medium text-sm tracking-wide leading-none">e servizi</div>
              </div>
            </div>
            {/* Barra gialla accent sotto il logo, come la nav del sito */}
            <div className="h-0.5 w-16 bg-[#FCBF1B] mt-2 rounded-full" />
          </div>
          <p className="text-gray-500 text-sm mt-3">Gestionale Edile — Accesso riservato</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#41755A] focus:ring-1 focus:ring-[#41755A] transition"
                  placeholder="nome@azienda.it"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#41755A] focus:ring-1 focus:ring-[#41755A] transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#41755A] transition"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 rounded-lg px-3 py-2 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit — verde come il pulsante "SCRIVICI UNA MAIL" del sito */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#41755A] hover:bg-[#2d5c3a] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg tracking-wide uppercase text-sm transition focus:outline-none focus:ring-2 focus:ring-[#41755A] focus:ring-offset-2"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Accesso in corso…</>
              ) : (
                'Accedi'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © {new Date().getFullYear()} Strade & Servizi S.r.l. — Uso interno riservato
        </p>
      </div>
    </div>
  );
}
