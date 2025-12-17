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
    price: "A partir de R$ 150,00",
    image: "https://picsum.photos/800/600?random=1",
    icon: "sparkles"
  },
  {
    id: 2,
    title: "Massagem Antiestresse",
    description: "Foco total na redução de tensões em ombros, costas e pescoço. Uma pausa necessária na sua rotina.",
    price: "A partir de R$ 130,00",
    image: "https://picsum.photos/800/600?random=2",
    icon: "heart"
  },
  {
    id: 3,
    title: "Massagem Relaxante",
    description: "Técnica manual que mescla movimentos firmes e suaves. Ideal para aliviar tensões musculares, estresse e ansiedade.",
    price: "A partir de R$ 120,00",
    image: "https://picsum.photos/800/600?random=3",
    icon: "flower"
  },
  {
    id: 4,
    title: "Drenagem Linfática",
    description: "Massagem suave que estimula o sistema linfático, eliminando toxinas e reduzindo a retenção de líquidos.",
    price: "A partir de R$ 100,00",
    image: "https://picsum.photos/800/600?random=4",
    icon: "drop"
  }
];

export const CONTACT_INFO = {
  address: "Sinop - Mato Grosso, Brasil",
  phone: "(66) 99252-5916",
  email: "contato@wemilypiva.com.br",
  instagram: "@wemilypiva_esteticaespa"
};