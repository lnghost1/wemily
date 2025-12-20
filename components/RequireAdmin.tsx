import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const RequireAdmin: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [sessionEmail, setSessionEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      setSessionEmail(null);
      return;
    }

    let isMounted = true;

    const run = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSessionEmail(data.session?.user.email ?? null);
      setLoading(false);
    };

    run();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSessionEmail(nextSession?.user.email ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center px-6">
        <div className="text-brand-text">Carregando...</div>
      </div>
    );
  }

  if (!sessionEmail) {
    return <Navigate to="/admin/login" replace />;
  }

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  if (adminEmail && sessionEmail.toLowerCase() !== adminEmail.toLowerCase()) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-brand-peach/15 p-6 max-w-md w-full">
          <h1 className="font-serif text-2xl text-brand-dark mb-2">Acesso negado</h1>
          <p className="text-brand-text mb-6">Este login não tem permissão para acessar o painel.</p>
          <button
            className="w-full bg-brand-dark text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors"
            onClick={() => supabase.auth.signOut()}
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default RequireAdmin;
