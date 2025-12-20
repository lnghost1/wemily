import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { WHATSAPP_PHONE } from '../constants';
import { ArrowLeft, Check, MessageCircle } from 'lucide-react';

type BookingThankYouState = {
  name?: string;
  serviceTitle?: string;
  date?: string;
  time?: string;
};

const BookingThankYouPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const state = (location.state ?? {}) as BookingThankYouState;

  const name = state.name ?? searchParams.get('name') ?? '';
  const serviceTitle = state.serviceTitle ?? searchParams.get('service') ?? '';
  const date = state.date ?? searchParams.get('date') ?? '';
  const time = state.time ?? searchParams.get('time') ?? '';

  const waText = encodeURIComponent(
    `Olá! Gostaria de confirmar meu agendamento:\n\n` +
      `${name ? `Nome: ${name}\n` : ''}` +
      `${serviceTitle ? `Serviço: ${serviceTitle}\n` : ''}` +
      `${date ? `Data: ${date}\n` : ''}` +
      `${time ? `Horário: ${time}` : ''}`
  );
  const waLink = `https://wa.me/${WHATSAPP_PHONE}?text=${waText}`;

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="max-w-md mx-auto px-6 pt-8 pb-16">
        <div className="flex items-center justify-between">
          <Link
            to="/agendar"
            className="h-11 w-11 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand-dark"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="text-center">
            <div className="text-brand-dark font-medium">Obrigado</div>
            <div className="text-xs text-gray-500">Agendamento concluído</div>
          </div>

          <div className="h-11 w-11" />
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-6">
          <div className="flex items-center gap-2 text-brand-dark">
            <Check size={18} className="text-brand-peach" />
            <div className="font-medium">Tudo certo!</div>
          </div>
          <div className="text-sm text-brand-text mt-2">
            Seu pedido de agendamento foi registrado. Agora é só confirmar pelo WhatsApp.
          </div>

          {(serviceTitle || date || time) && (
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-brand-light rounded-2xl p-3 col-span-2">
                <div className="text-xs text-gray-500">Serviço</div>
                <div className="text-brand-dark font-medium">{serviceTitle || '—'}</div>
              </div>
              <div className="bg-brand-light rounded-2xl p-3">
                <div className="text-xs text-gray-500">Data</div>
                <div className="text-brand-dark font-medium">{date || '—'}</div>
              </div>
              <div className="bg-brand-light rounded-2xl p-3">
                <div className="text-xs text-gray-500">Horário</div>
                <div className="text-brand-dark font-medium">{time || '—'}</div>
              </div>
            </div>
          )}
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="mt-4 w-full bg-brand-peach text-white px-6 py-4 rounded-2xl text-sm font-semibold hover:opacity-95 transition-colors text-center block"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <MessageCircle size={18} />
            Confirmar no WhatsApp
          </span>
        </a>

        <Link
          to="/"
          className="mt-3 w-full bg-white border border-gray-100 text-brand-dark px-6 py-4 rounded-2xl text-sm font-semibold hover:bg-brand-peach/5 transition-colors text-center block"
        >
          Voltar para o site
        </Link>
      </div>
    </div>
  );
};

export default BookingThankYouPage;
