import { useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  isMars: boolean;
  onBack: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthPage({ isMars, onBack, initialMode = 'signin' }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const accentColor = isMars ? '#8B5CF6' : '#FFA500';
  const accentRgb = isMars ? '139,92,246' : '255,165,0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
          },
        });

        if (error) throw error;
        setMessage('Compte créé avec succès ! Vous êtes maintenant connecté.');
        setTimeout(() => onBack(), 2000);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setMessage('Connexion réussie !');
        setTimeout(() => onBack(), 1500);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
        />
      </div>

      <div className="w-full max-w-md relative">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/80 backdrop-blur-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex justify-center mb-6">
            <svg
              width="48"
              height="48"
              viewBox="0 0 100 100"
              className="transition-all duration-700"
              style={{ filter: `drop-shadow(0 0 12px rgba(${accentRgb},0.6))` }}
            >
              <defs>
                <radialGradient id="grapeGold" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor={isMars ? '#C4B5FD' : '#FFB347'} />
                  <stop offset="40%" stopColor={accentColor} />
                  <stop offset="100%" stopColor={isMars ? '#6D28D9' : '#CC7A00'} />
                </radialGradient>
              </defs>
              <circle cx="35" cy="45" r="14" fill="url(#grapeGold)" />
              <circle cx="58" cy="42" r="13" fill="url(#grapeGold)" />
              <circle cx="46" cy="55" r="15" fill="url(#grapeGold)" />
              <circle cx="30" cy="65" r="12" fill="url(#grapeGold)" />
              <circle cx="55" cy="68" r="13" fill="url(#grapeGold)" />
              <circle cx="42" cy="78" r="11" fill="url(#grapeGold)" />
              <circle cx="68" cy="55" r="11" fill="url(#grapeGold)" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
          </h2>
          <p className="text-white/60 text-center mb-8">
            {mode === 'signin'
              ? 'Connectez-vous pour accéder à votre compte'
              : 'Rejoignez la communauté des créateurs'}
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div
              className="mb-6 p-4 rounded-lg border text-sm"
              style={{
                backgroundColor: `rgba(${accentRgb}, 0.1)`,
                borderColor: `rgba(${accentRgb}, 0.2)`,
                color: accentColor,
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="mt-1 text-xs text-white/40">
                  Minimum 6 caractères
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: `rgba(${accentRgb}, 0.15)`,
                border: `1px solid rgba(${accentRgb}, 0.3)`,
                color: accentColor,
                boxShadow: `0 0 20px rgba(${accentRgb}, 0.2)`,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = `rgba(${accentRgb}, 0.25)`;
                  e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.5)`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `rgba(${accentRgb}, 0.15)`;
                e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.3)`;
              }}
            >
              {loading
                ? 'Chargement...'
                : mode === 'signin'
                ? 'Se connecter'
                : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
                setMessage('');
              }}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              {mode === 'signin' ? (
                <>
                  Pas encore de compte ?{' '}
                  <span style={{ color: accentColor }}>Inscrivez-vous</span>
                </>
              ) : (
                <>
                  Déjà un compte ?{' '}
                  <span style={{ color: accentColor }}>Connectez-vous</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
