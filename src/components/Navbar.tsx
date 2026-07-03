import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Tentang Riksa', href: '#about' },
    { name: 'Filosofi', href: '#philosophy' },
    { name: 'Agenda', href: '#program' },
    { name: 'Galeri', href: '#gallery' },
    { name: 'Alih Aksara', href: '#converter' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-riksa-brown-dark/95 backdrop-blur-md shadow-xl py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className={`font-script text-3xl font-bold transition-colors ${isScrolled ? 'text-riksa-orange' : 'text-riksa-brown-dark'}`}>
          Riksa
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={`font-sans font-bold text-sm tracking-wide uppercase transition-colors hover:text-riksa-orange ${isScrolled ? 'text-riksa-cream' : 'text-riksa-brown-dark/80'}`}
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-4">
            <a 
              href="/admin/index.html" 
              className={`font-sans font-bold text-sm tracking-wide uppercase transition-colors hover:text-riksa-orange ${isScrolled ? 'text-riksa-cream' : 'text-riksa-brown-dark'}`}
            >
              Login
            </a>
            <a 
              href="#program" 
              className="bg-riksa-orange text-white px-6 py-2 rounded-full font-bold font-sans hover:bg-riksa-orange-light transition-colors"
            >
              Gabung
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`md:hidden ${isScrolled ? 'text-riksa-cream' : 'text-riksa-brown-dark'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-riksa-brown-dark shadow-2xl transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-[500px] border-b-4 border-riksa-orange' : 'max-h-0'}`}>
        <div className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans font-bold text-riksa-cream text-lg uppercase tracking-wider py-2 border-b border-riksa-cream/10 hover:text-riksa-orange transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-riksa-cream/20">
            <a 
              href="/admin/index.html" 
              className="font-sans font-bold text-riksa-cream text-lg uppercase tracking-wider text-center py-3 border border-riksa-cream/30 rounded-xl hover:bg-riksa-cream/10 transition-colors"
            >
              Login Admin
            </a>
            <a 
              href="#program" 
              className="bg-riksa-orange text-white font-sans font-bold text-lg uppercase tracking-wider text-center py-3 rounded-xl hover:bg-riksa-orange-light transition-colors"
            >
              Gabung Sekarang
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
