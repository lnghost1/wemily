export interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  icon?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  role?: string;
}