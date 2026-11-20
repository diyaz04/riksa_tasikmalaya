import { useState, useEffect } from 'react';
import { 
  Home, 
  Feather, 
  Calendar, 
  Image as ImageIcon, 
  User, 
  Users, 
  Menu, 
  X,
  Type,
  ShoppingBag
} from 'lucide-react';
import LogoFrame from './Shared/LogoFrame';

interface NavbarProps {
  onOpenJoinModal?: () => void;
  activeSection?: string;
  isMobileDrawerOpen?: boolean;
  setIsMobileDrawerOpen?: (open: boolean) => void;
}

export default function Navbar({ 
  onOpenJoinModal, 
  activeSection = 'tentang',
  isMobileDrawerOpen = false,
  setIsMobileDrawerOpen 
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);

  const drawerOpen = setIsMobileDrawerOpen ? isMobileDrawerOpen : internalDrawerOpen;
  const setDrawer = setIsMobileDrawerOpen || setInternalDrawerOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Tentang Riksa', href: '#about', id: 'tentang' },
    { name: 'Filosofi', href: '#philosophy', id: 'filosofi', icon: Feather },
    { name: 'Agenda', href: '#program', id: 'agenda', icon: Calendar },
    { name: 'Galeri', href: '#gallery', id: 'galeri', icon: ImageIcon },
    { name: 'Katalog Budaya', href: '#products', id: 'products', icon: ShoppingBag },
    { name: 'Alih Aksara', href: '#converter', id: 'converter' },
  ];

  return (
    <>
      {/* ============================================================== */}
      {/* 1. DESKTOP SYSTEM NAVBAR (ALWAYS VISIBLE & FLOATING)           */}
      {/* Sits right on top of the blurred navbar region in the hero     */}
      {/* ============================================================== */}
      <header className="hidden lg:block fixed top-3 sm:top-4 inset-x-0 z-50 px-4 pointer-events-none transition-all duration-300">
        <div className="max-w-[960px] xl:max-w-5xl mx-auto pointer-events-auto">
          <nav 
            className={`w-full bg-white rounded-full px-5 py-2.5 flex items-center justify-between border transition-all duration-300 ${
              isScrolled 
                ? 'shadow-[0_12px_40px_rgba(20,61,34,0.14)] border-emerald-950/15 py-2.5' 
                : 'shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-stone-200/80 py-2.5'
            }`}
          >
            {/* Logo on Left */}
            <a 
              href="#" 
              className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]"
              aria-label="Beranda RIKSA"
            >
              <LogoFrame variant="nav" />
            </a>

            {/* Desktop Center Navigation */}
            <div className="flex items-center gap-5 xl:gap-7 text-sm font-medium">
              <a 
                href="#" 
                aria-label="Beranda"
                className="text-riksa-green hover:text-riksa-green-dark p-1.5 rounded-full transition-colors"
              >
                <Home size={18} className="stroke-[2.2]" />
              </a>

              {navLinks.map((link) => {
                const IconComp = link.icon;
                const isActive = activeSection === link.id;

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 transition-colors py-1 group ${
                      isActive 
                        ? 'text-riksa-green font-bold' 
                        : 'text-stone-700 hover:text-riksa-green font-medium'
                    }`}
                  >
                    {IconComp && <IconComp size={15} className="opacity-80 group-hover:opacity-100 transition-opacity" />}
                    <span>{link.name}</span>

                    {/* Active Solid Green Underline Bar matching Mockup */}
                    {isActive && (
                      <span className="absolute -bottom-1 inset-x-0 h-[2.5px] bg-riksa-green rounded-full" />
                    )}
                  </a>
                );
              })}

              <span className="h-4 w-px bg-stone-300/80 mx-1" aria-hidden="true" />

              <a 
                href="/admin/index.html"
                className="flex items-center gap-1.5 text-stone-700 hover:text-riksa-green transition-colors font-medium"
              >
                <User size={16} className="opacity-80" />
                <span>Login</span>
              </a>
            </div>

            {/* Right Action: Gabung Button (Real Interactive System Button) */}
            <button
              type="button"
              onClick={onOpenJoinModal}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-riksa-green hover:bg-riksa-green-dark text-white text-xs sm:text-sm font-bold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Users size={16} />
              <span>Gabung</span>
            </button>
          </nav>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MOBILE FLOATING ACTION NAVBAR (Appears Past Hero on Scroll)  */}
      {/* ============================================================== */}
      <div 
        className={`lg:hidden fixed top-2.5 inset-x-3 z-50 flex items-center justify-between pointer-events-none transition-all duration-300 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        <a 
          href="#"
          className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-stone-200/80 flex items-center pointer-events-auto active:scale-95 transition-transform"
        >
          <LogoFrame variant="nav" imageClassName="h-7 w-auto" />
        </a>

        <button
          type="button"
          onClick={() => setDrawer(!drawerOpen)}
          aria-label={drawerOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          className="w-11 h-11 rounded-full bg-riksa-green text-white flex items-center justify-center shadow-lg pointer-events-auto active:scale-90 transition-transform"
        >
          {drawerOpen ? <X size={22} className="stroke-[2.5]" /> : <Menu size={22} className="stroke-[2.5]" />}
        </button>
      </div>

      {/* ============================================================== */}
      {/* 3. MOBILE MENU DRAWER POPUP                                    */}
      {/* ============================================================== */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-x-3 top-16 z-50 max-w-lg mx-auto bg-white/98 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-emerald-950/15 animate-fade-in pointer-events-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-riksa-green">Menu Navigasi RIKSA</span>
              <button 
                type="button" 
                onClick={() => setDrawer(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X size={18} />
              </button>
            </div>

            <a
              href="#"
              onClick={() => setDrawer(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-riksa-green font-bold bg-emerald-50"
            >
              <Home size={18} />
              <span>Beranda Utama</span>
            </a>

            {navLinks.map((link) => {
              const IconComp = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setDrawer(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-stone-700 hover:text-riksa-green hover:bg-emerald-50/60 font-medium transition-colors"
                >
                  {IconComp ? <IconComp size={18} /> : <Type size={18} />}
                  <span>{link.name}</span>
                </a>
              );
            })}

            <hr className="my-1.5 border-stone-200" />

            <div className="flex flex-col gap-2 pt-1">
              <a
                href="/admin/index.html"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-semibold hover:border-riksa-green hover:text-riksa-green transition-colors"
              >
                <User size={18} />
                <span>Login Admin</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setDrawer(false);
                  onOpenJoinModal?.();
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-riksa-green text-white font-bold shadow-md hover:bg-riksa-green-dark transition-colors"
              >
                <Users size={18} />
                <span>Gabung Komunitas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
