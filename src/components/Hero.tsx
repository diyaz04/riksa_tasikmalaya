import { motion } from 'framer-motion';
import { Type, ShoppingBag, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenJoinModal?: () => void;
  onToggleMobileDrawer?: () => void;
}

export default function Hero({ onOpenJoinModal, onToggleMobileDrawer }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7EE] flex flex-col items-center select-none">
      
      {/* ============================================================== */}
      {/* 1. DESKTOP VIEW (hidden lg:flex) - 2K ULTRA HD CANVAS          */}
      {/* ============================================================== */}
      <div className="hidden lg:flex justify-center w-full">
        <div className="relative w-full max-w-[1920px] aspect-[1024/572]">
          
          {/* 2K Ultra HD Canvas Artwork */}
          <img
            src="/images/hero-desktop-clean-2k.webp"
            alt="RIKSA - Membumikan Aksara Sunda di Tatar Sukapura"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />

          {/* ========================================================== */}
          {/* 2 MAIN FEATURED MENU BUTTONS (UNGGULAN UTAMA WEBSITE)     */}
          {/* 1. ALIH AKSARA (Transliterasi)                             */}
          {/* 2. KATALOG PRODUK KEBUDAYAAN (Kriya & Busana Khas Sunda)   */}
          {/* ========================================================== */}
          <div 
            className="absolute z-20 flex items-center gap-3.5 xl:gap-4.5"
            style={{ left: '8.20%', top: '70.2%', maxWidth: '44%' }}
          >
            {/* Menu Unggulan 1: Alih Aksara */}
            <motion.a
              href="#converter"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Menuju Alih Aksara Sunda"
              title="Alih Aksara Sunda Baku (Transliterasi Latin - Sunda)"
              className="inline-flex items-center gap-3 px-5 py-3 xl:px-6 xl:py-3.5 rounded-full bg-gradient-to-r from-riksa-green via-emerald-800 to-riksa-green-dark text-white font-bold shadow-[0_10px_26px_rgba(30,86,49,0.36)] hover:shadow-[0_16px_34px_rgba(30,86,49,0.48)] border border-emerald-400/40 transition-all duration-200 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                <Type size={17} className="text-amber-300 stroke-[2.5]" />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs xl:text-sm font-extrabold tracking-wide">Alih Aksara</span>
                <span className="text-[10px] text-emerald-200 font-serif opacity-90 font-normal">ᮃᮜᮤᮂ ᮃᮊ᮪ᮞᮛ ᮞᮥᮔ᮪ᮓ</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center ml-0.5 group-hover:bg-white/20 transition-colors">
                <ArrowRight size={13} className="text-emerald-100 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.a>

            {/* Menu Unggulan 2: Katalog Produk Kebudayaan */}
            <motion.a
              href="#products"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Menuju Katalog Produk Kebudayaan"
              title="Katalog Produk Budaya Khas Sunda (Kriya, Busana & Pusaka)"
              className="inline-flex items-center gap-3 px-5 py-3 xl:px-6 xl:py-3.5 rounded-full bg-white/95 backdrop-blur-md text-stone-900 font-bold shadow-[0_10px_26px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_34px_rgba(201,151,46,0.28)] border-2 border-riksa-gold hover:border-riksa-green hover:text-riksa-green transition-all duration-200 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                <ShoppingBag size={17} className="text-riksa-orange stroke-[2.3]" />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs xl:text-sm font-extrabold tracking-wide">Katalog Kebudayaan</span>
                <span className="text-[10px] text-amber-800/80 font-serif opacity-90 font-normal">Karya & Kriya Sunda</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-emerald-50 flex items-center justify-center ml-0.5 transition-colors">
                <ArrowRight size={13} className="text-stone-500 group-hover:text-riksa-green group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.a>
          </div>

          {/* Mouse Scroll Down Indicator */}
          <motion.a
            href="#about"
            whileHover={{ y: 2 }}
            aria-label="Gulir ke Tentang Riksa"
            title="Gulir ke bawah"
            className="absolute z-20 cursor-pointer rounded-full hover:bg-emerald-900/10 active:scale-95 transition-all"
            style={{ left: '48.2%', top: '88.0%', width: '3.6%', height: '9.0%' }}
          />

        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MOBILE VIEW (flex lg:hidden) - 2K ULTRA HD MOBILE ARTWORK   */}
      {/* ============================================================== */}
      <div className="flex lg:hidden justify-center w-full">
        <div className="relative w-full max-w-[500px] aspect-square">
          
          {/* Pristine 2K Mobile Artwork */}
          <img
            src="/images/hero-mobile-clean-2k.webp"
            alt="RIKSA - Membumikan Aksara Sunda di Tatar Sukapura"
            className="w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />

          {/* Mobile Hotspots */}
          {/* Mobile Logo Pill */}
          <a
            href="#"
            aria-label="Beranda RIKSA"
            className="absolute z-20 cursor-pointer rounded-full active:bg-black/10 transition-all"
            style={{ left: '3.5%', top: '2.5%', width: '34.0%', height: '12.0%' }}
          />

          {/* Mobile Hamburger Button [ ☰ ] */}
          <button
            type="button"
            onClick={onToggleMobileDrawer}
            aria-label="Buka Menu Navigasi"
            className="absolute z-20 cursor-pointer rounded-full active:bg-black/20 transition-all"
            style={{ left: '83.0%', top: '2.5%', width: '14.0%', height: '12.0%' }}
          />

          {/* ========================================================== */}
          {/* MOBILE 2 MAIN FEATURED MENU BUTTONS                        */}
          {/* ========================================================== */}
          <div 
            className="absolute z-20 grid grid-cols-2 gap-2"
            style={{ left: '4.2%', top: '69.0%', width: '91.6%' }}
          >
            {/* Mobile Menu 1: Alih Aksara */}
            <motion.a
              href="#converter"
              whileTap={{ scale: 0.95 }}
              aria-label="Alih Aksara Sunda"
              className="flex items-center justify-between gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-gradient-to-r from-riksa-green to-riksa-green-dark text-white font-bold shadow-md border border-emerald-400/30 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Type size={13} className="text-amber-300 stroke-[2.5]" />
                </div>
                <div className="flex flex-col text-left leading-tight min-w-0">
                  <span className="text-[11px] font-extrabold tracking-wide truncate">Alih Aksara</span>
                  <span className="text-[8px] text-emerald-200 font-serif opacity-90 truncate">ᮃᮜᮤᮂ ᮃᮊ᮪ᮞᮛ</span>
                </div>
              </div>
              <ArrowRight size={12} className="text-emerald-100 shrink-0 opacity-80" />
            </motion.a>

            {/* Mobile Menu 2: Katalog Produk Kebudayaan */}
            <motion.a
              href="#products"
              whileTap={{ scale: 0.95 }}
              aria-label="Katalog Produk Kebudayaan"
              className="flex items-center justify-between gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md text-stone-900 font-bold shadow-md border-2 border-riksa-gold/90 hover:text-riksa-green active:scale-95 transition-all"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                  <ShoppingBag size={13} className="text-riksa-orange stroke-[2.2]" />
                </div>
                <div className="flex flex-col text-left leading-tight min-w-0">
                  <span className="text-[11px] font-extrabold tracking-wide truncate">Katalog Budaya</span>
                  <span className="text-[8px] text-amber-800/80 font-serif opacity-90 truncate">Kriya Sunda</span>
                </div>
              </div>
              <ArrowRight size={12} className="text-stone-400 shrink-0" />
            </motion.a>
          </div>

          {/* Mobile Mouse Scroll Indicator */}
          <a
            href="#about"
            aria-label="Gulir ke Tentang Riksa"
            className="absolute z-20 cursor-pointer rounded-full active:bg-emerald-900/20 transition-all"
            style={{ left: '47.50%', top: '88.50%', width: '5.00%', height: '7.50%' }}
          />

        </div>
      </div>

    </section>
  );
}
