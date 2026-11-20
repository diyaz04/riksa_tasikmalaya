import { Instagram, Mail, MapPin, Heart } from 'lucide-react';
import LogoFrame from './Shared/LogoFrame';

export default function Footer() {
  return (
    <footer className="bg-[#0E2917] text-white relative overflow-hidden pt-16 sm:pt-20 pb-10 border-t-4 border-riksa-gold">
      
      {/* Background Motifs */}
      <div className="absolute inset-0 pattern-sunda-dark opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-14">
          
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col items-start">
            <LogoFrame variant="footer" className="mb-4" />
            
            <p className="font-sans text-emerald-100/80 leading-relaxed text-sm mb-4 max-w-sm">
              <strong>RIKSA (Riuangan Aksara Sunda)</strong> adalah komunitas literasi aksara Sunda 
              pertama di Tasikmalaya yang berdedikasi membumikan kembali kebudayaan karuhun di Tatar Sukapura.
            </p>

            <div className="aksara-sunda text-2xl text-riksa-gold font-bold mb-2">
              ᮛᮤᮅᮍᮔ᮪ ᮃᮊ᮪ᮞᮛ ᮞᮥᮔ᮪ᮓ
            </div>
            <span className="text-xs text-emerald-200/50 font-serif italic">
              Riksa · Rukun · Lestari
            </span>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="font-serif text-lg font-bold mb-5 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-riksa-orange" />
              <span>Tautan Cepat</span>
            </h3>
            <ul className="space-y-3 font-sans text-sm text-emerald-100/75">
              <li>
                <a href="#about" className="hover:text-riksa-gold transition-colors flex items-center gap-2">
                  <span>Tentang RIKSA</span>
                </a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-riksa-gold transition-colors flex items-center gap-2">
                  <span>Filosofi Lambang</span>
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-riksa-gold transition-colors flex items-center gap-2">
                  <span>Agenda &amp; Pawiyatan</span>
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-riksa-gold transition-colors flex items-center gap-2">
                  <span>Galeri Dokumentasi</span>
                </a>
              </li>
              <li>
                <a href="#converter" className="hover:text-riksa-gold transition-colors flex items-center gap-2">
                  <span>Mesin Alih Aksara</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social Proof */}
          <div className="md:col-span-4">
            <h3 className="font-serif text-lg font-bold mb-5 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-riksa-gold" />
              <span>Sekretariat &amp; Kontak</span>
            </h3>
            
            <ul className="space-y-3 font-sans text-sm text-emerald-100/75 mb-6">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-riksa-gold shrink-0 mt-0.5" />
                <span>Tasikmalaya, Jawa Barat — Tatar Sukapura, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-riksa-gold shrink-0" />
                <span>kontak@riksa.or.id</span>
              </li>
            </ul>

            <a 
              href="https://instagram.com/riksa.tasikmalaya" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl p-3.5 hover:bg-white/15 transition-all duration-300 w-full sm:w-auto"
            >
              <div className="bg-gradient-to-tr from-amber-500 via-riksa-orange to-pink-500 p-2.5 rounded-xl text-white shadow-sm">
                <Instagram size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-white">@riksa.tasikmalaya</p>
                <p className="text-xs text-riksa-gold">Komunitas Literasi Tatar Sukapura</p>
              </div>
            </a>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-emerald-100/50">
          <p>&copy; {new Date().getFullYear()} RIKSA (Riuangan Aksara Sunda). Hak cipta dilindungi.</p>
          <p className="flex items-center gap-1.5">
            <span>Dirawat kalayan asih</span>
            <Heart size={13} className="text-riksa-orange fill-riksa-orange" />
            <span>pikeun Budaya Tatar Sunda.</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
