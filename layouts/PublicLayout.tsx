import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light font-sans selection:bg-brand-peach selection:text-white">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default PublicLayout;
