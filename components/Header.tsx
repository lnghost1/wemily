import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import { Menu, X, User } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="text-2xl font-serif tracking-wide text-brand-dark">
          Wemily<span className="text-brand-peach font-bold">Piva</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-sm uppercase tracking-wider text-gray-600 hover:text-brand-peach transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="bg-brand-dark text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Agendar Agora
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-brand-dark transition-colors">
            <User size={18} />
            <span className="text-sm">Entrar</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-brand-dark"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-6 px-6 flex flex-col space-y-4 border-t border-gray-100">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-gray-600 hover:text-brand-peach text-lg font-serif"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <hr className="border-gray-100" />
          <button className="bg-brand-dark text-white w-full py-3 rounded-full text-sm font-medium">
            Agendar Agora
          </button>
          <button className="flex items-center justify-center space-x-2 text-gray-600 py-2">
            <User size={18} />
            <span>Entrar</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;