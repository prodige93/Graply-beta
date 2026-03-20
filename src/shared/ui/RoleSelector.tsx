import { useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import CreatorSignupForm from './CreatorSignupForm';
import EnterpriseSignupForm from './EnterpriseSignupForm';

const glass = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(32px) saturate(180%)',
  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.13)',
  boxShadow: '0 2px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
};

const glassFocus = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(32px) saturate(180%)',
  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.28)',
  boxShadow: '0 2px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)',
};

function RoleSelectionView({ onBack, onSelectCreator, onSelectEnterprise }: { onBack: () => void; onSelectCreator: () => void; onSelectEnterprise: () => void }) {
  const [hovered, setHovered] = useState<'creator' | 'enterprise' | null>(null);

  return (
    <div style={{
      width: '100%',
      maxWidth: 420,
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h1 style={{
        fontSize: 28,
        fontWeight: 400,
        color: '#fff',
        letterSpacing: '-0.02em',
        marginBottom: 40,
        textAlign: 'center',
      }}>
        S'inscrire en tant que
      </h1>

      <div style={{
        display: 'flex',
        gap: 20,
        width: '100%',
        justifyContent: 'center',
      }}>
        <div
          style={{
            flex: 1,
            maxWidth: 180,
            aspectRatio: '1',
            borderRadius: 20,
            background: hovered === 'creator'
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: hovered === 'creator'
              ? '1px solid rgba(255,166,114,0.4)'
              : '1px solid rgba(255,255,255,0.13)',
            boxShadow: hovered === 'creator'
              ? '0 8px 32px rgba(255,166,114,0.15), inset 0 1px 0 rgba(255,255,255,0.12)'
              : '0 2px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 20,
            transform: hovered === 'creator' ? 'translateY(-4px)' : 'translateY(0)',
          }}
          onClick={onSelectCreator}
          onMouseEnter={() => setHovered('creator')}
          onMouseLeave={() => setHovered(null)}
        >
          <img
            src="/jauneraisin.png"
            alt="Créateur"
            style={{
              width: 72,
              height: 72,
              objectFit: 'contain',
            }}
          />
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.01em',
          }}>
            Créateur
          </span>
        </div>

        <div
          style={{
            flex: 1,
            maxWidth: 180,
            aspectRatio: '1',
            borderRadius: 20,
            background: hovered === 'enterprise'
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: hovered === 'enterprise'
              ? '1px solid rgba(161,94,255,0.4)'
              : '1px solid rgba(255,255,255,0.13)',
            boxShadow: hovered === 'enterprise'
              ? '0 8px 32px rgba(161,94,255,0.15), inset 0 1px 0 rgba(255,255,255,0.12)'
              : '0 2px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 20,
            transform: hovered === 'enterprise' ? 'translateY(-4px)' : 'translateY(0)',
          }}
          onClick={onSelectEnterprise}
          onMouseEnter={() => setHovered('enterprise')}
          onMouseLeave={() => setHovered(null)}
        >
          <img
            src="/violet.png"
            alt="Entreprise"
            style={{
              width: 72,
              height: 72,
              objectFit: 'contain',
            }}
          />
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.01em',
          }}>
            Entreprise
          </span>
        </div>
      </div>

      <button
        onClick={onBack}
        style={{
          marginTop: 32,
          fontSize: 14,
          color: 'rgba(255,255,255,0.45)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
      >
        Retour à la connexion
      </button>
    </div>
  );
}

interface RoleSelectorProps {
  initialRole: 'creator' | 'enterprise' | null;
  onBack: () => void;
}

export default function RoleSelector({ initialRole, onBack }: RoleSelectorProps) {
  const getInitialView = () => {
    if (initialRole === 'creator') return 'creatorSignup';
    if (initialRole === 'enterprise') return 'enterpriseSignup';
    return 'login';
  };

  const [view, setView] = useState<'login' | 'role' | 'creatorSignup' | 'enterpriseSignup'>(getInitialView());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoginLoading(true);
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setLoginError(error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : error.message);
    }
    setLoginLoading(false);
  };

  return (
    <div className="role-selector-container" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 48px',
      background: 'rgba(10,10,12,0.6)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      position: 'relative',
      overflowY: 'auto',
      overflowX: 'hidden',
      minHeight: '100%',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(255,120,42,0.06) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {view === 'enterpriseSignup' ? (
        <EnterpriseSignupForm onBack={() => setView('role')} />
      ) : view === 'creatorSignup' ? (
        <CreatorSignupForm onBack={() => setView('role')} />
      ) : view === 'role' ? (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
          <RoleSelectionView onBack={() => setView('login')} onSelectCreator={() => setView('creatorSignup')} onSelectEnterprise={() => setView('enterpriseSignup')} />
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
          style={{ width: '100%', maxWidth: 360, position: 'relative', zIndex: 1 }}
        >
          <button
            type="button"
            onClick={onBack}
            style={{
              marginBottom: 20,
              fontSize: 13,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.45)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ← Retour à l&apos;accueil
          </button>
          <h1 className="login-title" style={{
            fontSize: 28,
            fontWeight: 400,
            color: '#fff',
            letterSpacing: '-0.02em',
            marginBottom: 32,
          }}>
            Se connecter à <span style={{ color: '#ffffff' }}>Graply</span>
          </h1>

          {loginError && (
            <div style={{
              marginBottom: 16,
              padding: '12px 16px',
              borderRadius: 14,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444',
              fontSize: 13,
              fontWeight: 500,
            }}>
              {loginError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={e => { setEmail(e.target.value); setLoginError(''); }}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              required
              style={{
                width: '100%',
                padding: '16px 18px',
                borderRadius: 14,
                fontSize: 15,
                color: '#fff',
                outline: 'none',
                transition: 'all 0.2s ease',
                ...(emailFocused ? glassFocus : glass),
                boxSizing: 'border-box',
              }}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginError(''); }}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '16px 18px',
                borderRadius: 14,
                fontSize: 15,
                color: '#fff',
                outline: 'none',
                transition: 'all 0.2s ease',
                ...(passwordFocused ? glassFocus : glass),
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            style={{
              width: '100%',
              padding: '15px 18px',
              borderRadius: 14,
              marginTop: 16,
              fontSize: 15,
              fontWeight: 600,
              color: '#000',
              background: '#fff',
              border: 'none',
              cursor: loginLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 24px rgba(255,255,255,0.15)',
              transition: 'all 0.2s ease',
              opacity: loginLoading ? 0.6 : 1,
            }}
          >
            {loginLoading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '28px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 500, letterSpacing: '0.05em' }}>OU</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <button
            type="button"
            onClick={() => setView('role')}
            style={{
              width: '100%',
              padding: '15px 18px',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 500,
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: 'transparent',
              border: '1px solid #fff',
            }}
          >
            Créer un nouveau compte
          </button>

        </form>
      )}

      <div className="mobile-stats" style={{
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        marginTop: 'auto',
        paddingTop: 40,
        position: 'relative',
        zIndex: 1,
      }}>
        {[
          { label: 'Createurs actifs', value: '13K', plusColor: '#A15EFF', plusGlow: '0 0 8px rgba(161,94,255,0.8), 0 0 20px rgba(161,94,255,0.4)' },
          { label: 'Campagnes actives', value: '1000', plusColor: '#FFFFFF', plusGlow: '0 0 8px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)' },
          { label: 'Verses aux createurs', value: '2M€', plusColor: '#FFA672', plusGlow: '0 0 8px rgba(255,166,114,0.8), 0 0 20px rgba(255,166,114,0.4)' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' as const }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: stat.plusColor, textShadow: stat.plusGlow, lineHeight: 1 }}>+</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginTop: 2 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
