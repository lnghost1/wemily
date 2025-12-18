import React from 'react';
import { SERVICES } from '../constants';
import { ArrowUpRight, Sparkles, Heart, Flower, Droplets } from 'lucide-react';

const Services: React.FC = () => {

  const getIcon = (iconName?: string) => {
    switch(iconName) {
      case 'sparkles': return <Sparkles className="text-brand-peach" size={20} />;
      case 'heart': return <Heart className="text-red-400" size={20} />;
      case 'flower': return <Flower className="text-brand-peach" size={20} />;
      case 'drop': return <Droplets className="text-orange-400" size={20} />;
      default: return <Sparkles className="text-brand-peach" size={20} />;
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-brand-peach uppercase tracking-widest text-sm font-medium mb-2">Nossos Tratamentos</p>
          <h2 className="text-4xl font-serif text-brand-dark">Experiências de Cuidado</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {SERVICES.map((service) => (
            <div key={service.id} className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-peach/20 flex flex-col h-full">
              
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden rounded-2xl mb-6 bg-gray-100">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-peach/35 via-brand-peach/10 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md">
                   {getIcon(service.icon)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-2xl font-serif text-brand-dark mb-3 group-hover:text-brand-peach transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm mb-6">
                  {service.description}
                </p>
              </div>

              {/* Footer of Card */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end mt-auto">
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">Sessão</p>
                  <p className="text-brand-peach font-semibold text-lg">{service.price}</p>
                </div>
                <button className="bg-gray-50 text-brand-dark p-3 rounded-full hover:bg-brand-dark hover:text-white transition-colors">
                  <ArrowUpRight size={20} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;