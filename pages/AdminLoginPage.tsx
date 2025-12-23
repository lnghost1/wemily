import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { Bell, LockKeyhole, Mail } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME as string | undefined;

  const resolveEmailForLogin = () => {
    const input = usernameOrEmail.trim();
    if (!input) return null;

    if (adminUsername && input.toLowerCase() === adminUsername.toLowerCase()) {
      return adminEmail ?? null;
    }

    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    if (looksLikeEmail) return input;

    return null;
  };

  const submit = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Admin indisponível: configure o Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY).');
      return;
    }

    const email = resolveEmailForLogin();
    if (!email) {
      if (!adminEmail && adminUsername && !usernameOrEmail.trim().includes('@')) {
        setError('Admin indisponível: configure VITE_ADMIN_EMAIL para usar login por usuário.');
        return;
      }
      setError('Usuário inválido.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      navigate('/admin', { replace: true });
    } catch (e) {
      setError('Login inválido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="max-w-md mx-auto px-6 pt-10 pb-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white border border-brand-peach/20 shadow-sm flex items-center justify-center">
              <div className="h-9 w-9 rounded-full bg-brand-peach/15" />
            </div>
            <div>
              <div className="text-brand-dark font-medium">Olá, Wemily</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>

          <button
            type="button"
            className="h-10 w-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500"
            aria-label="Notificações"
          >
            <Bell size={18} />
          </button>
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-6">
          <div className="flex items-center gap-2 text-brand-dark">
            <LockKeyhole size={18} />
            <h1 className="font-serif text-2xl">Entrar no painel</h1>
          </div>
          <p className="text-brand-text text-sm mt-2">Acesso restrito para visualizar os agendamentos.</p>

          {error && (
            <div className="mt-6 bg-brand-peach/10 border border-brand-peach/20 text-brand-dark rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-brand-text mb-2">Usuário</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  type="text"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brand-text mb-2">Senha</label>
              <input
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
              />
            </div>

            <button
              className="w-full bg-brand-peach text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:opacity-95 transition-colors disabled:opacity-60"
              onClick={submit}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <button
              type="button"
              className="w-full text-center text-sm text-gray-500 hover:text-brand-dark transition-colors"
              onClick={() => navigate('/')}
            >
              Voltar para o site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
