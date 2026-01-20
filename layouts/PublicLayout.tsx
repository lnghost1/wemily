import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const PublicLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBookingRoute = location.pathname.startsWith('/agendar');

  React.useEffect(() => {
    const hash = window.location.hash ?? '';
    const search = window.location.search ?? '';

    const hasSupabaseParams =
      hash.includes('access_token=') ||
      hash.includes('error=') ||
      search.includes('code=') ||
      search.includes('error=');

    if (!hasSupabaseParams) return;
    if (location.pathname.startsWith('/auth/callback')) return;

    navigate(`/auth/callback${search}${hash}`, { replace: true });
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-brand-light font-sans selection:bg-brand-peach selection:text-white">
      {!isBookingRoute && <Header />}
      <main>
        <Outlet />
      </main>
      {!isBookingRoute && <Footer />}
      {!isBookingRoute && <FloatingWhatsApp />}
    </div>
  );
};

export default PublicLayout;
