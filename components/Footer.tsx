import React from 'react';
import { CONTACT_INFO, NAV_LINKS } from '../constants';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <a href="#" className="text-3xl font-serif tracking-wide text-white">
              Wemily<span className="text-brand-peach">Piva</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Especialista em realçar sua beleza natural e proporcionar momentos únicos de relaxamento. Agende sua avaliação.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-brand-peach transition-colors text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-brand-peach transition-colors text-white">
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:pl-10">
            <h4 className="text-lg font-serif mb-6 text-white">Navegação</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-brand-peach transition-colors text-sm">
                    {link.label === 'Início' ? 'Nossos Serviços' : 
                     link.label === 'Sobre' ? 'Sobre Wemily Piva' :
                     link.label === 'Serviços' ? 'Depoimentos' : 
                     'Agendar no WhatsApp'}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-serif mb-6 text-white">Contato</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <MapPin className="text-brand-peach shrink-0" size={18} />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Phone className="text-brand-peach shrink-0" size={18} />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="text-brand-peach shrink-0" size={18} />
                <span>{CONTACT_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2025 Wemily Piva Estética. Todos os direitos reservados.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
             <div className="flex items-center space-x-1">
               <span className="text-gray-600">Admin</span>
             </div>
             <div className="flex items-center space-x-1">
               <span>Feito com <span className="text-red-500">❤</span> para você</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;