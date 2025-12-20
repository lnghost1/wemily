import React from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '../constants';

const FloatingWhatsApp: React.FC = () => {
  return (
    <a 
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 bg-brand-peach text-white p-4 rounded-full shadow-lg hover:bg-rose-400 transition-all duration-300 z-50 animate-bounce-subtle flex items-center justify-center"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
};

export default FloatingWhatsApp;