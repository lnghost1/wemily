import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

function App() {
  return (
    <div className="min-h-screen bg-brand-light font-sans selection:bg-brand-peach selection:text-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default App;