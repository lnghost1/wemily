import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

type Step = 'loading' | 'ready' | 'done';

const AdminResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<Step>('loading');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const run = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setError('Admin indisponível: configure o Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY).');
        setStep('ready');
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setError('Sessão não encontrada. Abra novamente o link de recuperação enviado por email.');
      }
      setStep('ready');
    };

    run();
  }, []);

  const submit = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Admin indisponível: configure o Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY).');
      return;
    }

    const p1 = password.trim();
    const p2 = confirmPassword.trim();

    if (!p1 || p1.length < 6) {
      setError('Informe uma senha com pelo menos 6 caracteres.');
      return;
    }

    if (p1 !== p2) {
      setError('As senhas não coincidem.');
      return;
    }

    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password: p1 });
    if (err) {
      setError(`Não foi possível atualizar a senha. (${err.message})`);
      return;
    }

    setStep('done');
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="max-w-md mx-auto px-6 pt-10 pb-16">
        <div className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-6">
          <div className="font-serif text-2xl text-brand-dark">Criar nova senha</div>
          <div className="text-brand-text text-sm mt-2">Defina uma nova senha para acessar o painel.</div>

          {error && (
            <div className="mt-6 bg-brand-peach/10 border border-brand-peach/20 text-brand-dark rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {step === 'loading' ? (
            <div className="mt-6 text-brand-text">Carregando…</div>
          ) : step === 'done' ? (
            <div className="mt-6">
              <div className="text-emerald-700 text-sm font-semibold">Senha atualizada com sucesso.</div>
              <button
                className="mt-4 w-full bg-brand-peach text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:opacity-95 transition-colors"
                onClick={() => navigate('/admin', { replace: true })}
              >
                Ir para o painel
              </button>
              <button
                type="button"
                className="mt-3 w-full text-center text-sm text-gray-500 hover:text-brand-dark transition-colors"
                onClick={() => navigate('/admin/login', { replace: true })}
              >
                Voltar para o login
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-brand-text mb-2">Nova senha</label>
                <input
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm text-brand-text mb-2">Confirmar senha</label>
                <input
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                />
              </div>

              <button
                className="w-full bg-brand-peach text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:opacity-95 transition-colors"
                onClick={submit}
              >
                Salvar nova senha
              </button>

              <button
                type="button"
                className="w-full text-center text-sm text-gray-500 hover:text-brand-dark transition-colors"
                onClick={() => navigate('/admin/login', { replace: true })}
              >
                Voltar para o login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminResetPasswordPage;
