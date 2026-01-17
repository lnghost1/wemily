import { Service, NavLink } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Início', href: '#home' },
  { label: 'Sobre', href: '#about' },
  { label: 'Serviços', href: '#services' },
  { label: 'Depoimentos', href: '#testimonials' },
];

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "Limpeza de Pele",
    description: "Procedimento profundo para remover impurezas e células mortas, deixando a pele renovada e com viço natural.",
    image: "/images/service-1.jpg",
    icon: "sparkles"
  },
  {
    id: 2,
    title: "Massagem Antiestresse",
    description: "Foco total na redução de tensões em ombros, costas e pescoço. Uma pausa necessária na sua rotina.",
    image: "/images/service-5.jpg",
    icon: "heart"
  },
  {
    id: 3,
    title: "Massagem Relaxante",
    description: "Técnica manual que mescla movimentos firmes e suaves. Ideal para aliviar tensões musculares, estresse e ansiedade.",
    image: "/images/service-3.jpg",
    icon: "flower"
  },
  {
    id: 4,
    title: "Drenagem Linfática",
    description: "Massagem suave que estimula o sistema linfático, eliminando toxinas e reduzindo a retenção de líquidos.",
    image: "/images/service-4.jpg",
    icon: "drop"
  },
  {
    id: 5,
    title: "EXPERIÊNCIA SPA REVITALIZE",
    description: "Essa opção une o autocuidado facial, valorizando saúde para sua pele através da hidratação com máscaras de tratamentos faciais e corporal proporcionando alívio de tensões físicas e emocionais",
    image: "/images/service-6.jpg",
    icon: "sparkles"
  }
];

export const WHATSAPP_PHONE = '5566992525916';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_PHONE}`;

export const CONTACT_INFO = {
  address: "Sinop - Mato Grosso, Brasil",
  phone: "(66) 99252-5916",
  email: "contato@wemilypiva.com.br",
  instagram: "@wemilypiva_esteticaespa"
};