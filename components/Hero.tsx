 import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-0 md:min-h-screen pt-16 sm:pt-20 md:pt-32 pb-10 sm:pb-14 md:pb-20 flex flex-col justify-start md:justify-center overflow-hidden bg-gradient-to-br from-stone-50 via-pink-50/20 to-white">
      
      {/* Decorative blurred blobs */}
      <div className="absolute top-1/4 -left-10 w-96 h-96 bg-brand-peach/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-blue-50/20 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-6 text-center md:text-left flex flex-col md:flex-row items-center">
        <div className="w-full md:w-3/5 space-y-6 md:space-y-8">
          <p className="text-brand-peach font-semibold tracking-[0.28em] uppercase text-xs sm:text-sm animate-fade-in-up">
            Estética & Bem-estar
          </p>
          
          <h1 className="font-serif text-brand-dark leading-[1.05] text-[3.2rem] sm:text-6xl md:text-7xl md:leading-[1.1]">
            <span className="block">Onde a mente</span>
            <span className="block">se silencia e o</span>
            <span className="block text-brand-peach italic">coração</span>
            <span className="block">
              encontra <span className="hidden md:inline">propósito.</span>
            </span>
            <span className="block md:hidden">propósito.</span>
          </h1>
          
          <p className="text-gray-500 text-base sm:text-lg md:text-xl max-w-md md:max-w-lg leading-relaxed font-light mx-auto md:mx-0">
            Permita-se viver uma experiência única de relaxamento e autocuidado com protocolos personalizados para você na nossa Casa Nova.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2 sm:pt-4">
            <button className="w-full sm:w-auto bg-brand-peach text-white px-8 py-4 rounded-full font-medium hover:bg-rose-400 transition-colors shadow-lg shadow-brand-peach/20">
              Agendar
            </button>
            <button className="hidden md:flex w-full sm:w-auto text-gray-500 px-8 py-4 rounded-full font-medium hover:text-brand-peach items-center justify-center space-x-2 transition-colors group">
              <span>Nossos Serviços</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        {/* Abstract/Image side could go here, but screenshot shows mainly text on left and whitespace/gradient on right for hero */}
        <div className="w-full md:w-2/5 hidden md:block">
            {/* Keeping it empty to match the clean text-focused look of the first screenshot */}
        </div>
      </div>
    </section>
  );
};

export default Hero;