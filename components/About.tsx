import React from 'react';
import { CheckCircle2, Instagram, MapPin } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] max-w-md mx-auto">
              <img 
                src="/images/about.jpg" 
                alt="Wemily Piva" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-brand-peach/35 via-brand-peach/10 to-transparent"></div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-8 text-white">
                <h3 className="text-2xl font-serif">Wemily Piva</h3>
                <div className="flex items-center text-sm text-gray-200 mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span>Sinop - MT</span>
                </div>
              </div>
            </div>

            {/* Instagram Floating Card */}
            <div className="absolute -bottom-6 -right-4 md:right-8 bg-white p-4 rounded-xl shadow-xl flex items-center space-x-4 max-w-xs animate-bounce-slow">
              <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white p-2 rounded-lg">
                <Instagram size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Siga no Instagram</p>
                <p className="font-medium text-brand-dark text-sm">{CONTACT_INFO.instagram}</p>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2 space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-dark">
              Olá! Sou Wemily Piva, esteticista e massoterapeuta apaixonada pelo que faço.
            </h2>
            
            <p className="text-gray-600 leading-relaxed text-lg">
              Recentemente inauguramos nossa <strong>Casa Nova</strong>, um espaço pensado em cada detalhe para ser seu refúgio de tranquilidade em Sinop.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Minha missão vai além da estética: busco proporcionar bem-estar físico e mental. Cada massagem, cada limpeza de pele, é um momento sagrado de conexão com você mesma.
            </p>

            <div className="space-y-4 pt-4">
              {[
                "Atendimento Personalizado",
                "Ambiente Acolhedor e Climatizado",
                "Produtos de Alta Performance",
                "Profissional Certificada"
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 text-gray-700">
                  <CheckCircle2 className="text-brand-peach" size={20} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default About;