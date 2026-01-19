import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Admin indisponível: configure o Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY).');
      return;
    }

    const run = async () => {
      setError(null);
      try {
        const { error: err } = await supabase.auth.getSessionFromUrl({ storeSession: true });
        if (err) throw err;

        const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
        const hashParams = new URLSearchParams(hash);
        const searchParams = new URLSearchParams(window.location.search);
        const type = hashParams.get('type') ?? searchParams.get('type');

        if (type === 'recovery') {
          navigate('/admin/reset', { replace: true });
          return;
        }

        navigate('/admin', { replace: true });
      } catch (e) {
        const message =
          typeof e === 'object' && e !== null && 'message' in e
            ? String((e as { message?: unknown }).message ?? '')
            : '';
        console.error('Erro no callback do Supabase:', e);
        setError(`Não foi possível validar o link.${message ? ` (${message})` : ''}`);
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="max-w-md mx-auto px-6 pt-10 pb-16">
        <div className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-6">
          <div className="font-serif text-2xl text-brand-dark">Validando acesso…</div>
          <div className="text-brand-text text-sm mt-2">Aguarde um instante.</div>

          {error && (
            <div className="mt-6 bg-brand-peach/10 border border-brand-peach/20 text-brand-dark rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
