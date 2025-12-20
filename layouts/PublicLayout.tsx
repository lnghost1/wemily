import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isBookingRoute = location.pathname.startsWith('/agendar');

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
