import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import LogoFrame from './Shared/LogoFrame';

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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/18 backdrop-blur-2xl shadow-[0_18px_55px_rgba(61,32,19,0.16)] border-b border-white/30 py-2.5 sm:py-3'
        : 'bg-transparent py-3 sm:py-5'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" aria-label="RIKSA Beranda" className="transition-transform duration-300 hover:-translate-y-0.5">
          <LogoFrame
            variant="nav"
            className={isScrolled ? 'shadow-riksa-gold/20' : 'shadow-riksa-brown-dark/15'}
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
            className="font-sans font-bold text-sm tracking-wide uppercase text-riksa-brown-dark/85 transition-colors hover:text-riksa-orange drop-shadow-[0_1px_10px_rgba(245,233,211,0.75)]"
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-4">
            <a 
              href="/admin/index.html" 
              className="font-sans font-bold text-sm tracking-wide uppercase text-riksa-brown-dark transition-colors hover:text-riksa-orange drop-shadow-[0_1px_10px_rgba(245,233,211,0.75)]"
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
          className="lg:hidden text-riksa-brown-dark drop-shadow-[0_1px_10px_rgba(245,233,211,0.75)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-riksa-brown-dark/92 backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-[calc(100svh-72px)] border-b-4 border-riksa-orange' : 'max-h-0'}`}>
        <div className="flex flex-col p-4 sm:p-6 gap-3 overflow-y-auto">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans font-bold text-riksa-cream text-base sm:text-lg uppercase tracking-wider py-2 border-b border-riksa-cream/10 hover:text-riksa-orange transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-riksa-cream/20">
            <a 
              href="/admin/index.html" 
              className="font-sans font-bold text-riksa-cream text-base sm:text-lg uppercase tracking-wider text-center py-3 border border-riksa-cream/30 rounded-xl hover:bg-riksa-cream/10 transition-colors"
            >
              Login Admin
            </a>
            <a 
              href="#program" 
              className="bg-riksa-orange text-white font-sans font-bold text-base sm:text-lg uppercase tracking-wider text-center py-3 rounded-xl hover:bg-riksa-orange-light transition-colors"
            >
              Gabung Sekarang
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
