import { Instagram, Mail, MapPin } from 'lucide-react';
import LogoFrame from './Shared/LogoFrame';

export default function Footer() {
  return (
    <footer className="bg-riksa-brown-dark relative overflow-hidden text-riksa-cream pt-14 sm:pt-16 md:pt-20 pb-8 sm:pb-10 border-t-4 border-riksa-gold">
      <div className="absolute inset-0 pattern-sunda-dark"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 mb-12 md:mb-16">
          {/* Brand */}
          <div>
            <LogoFrame variant="footer" className="mb-5" />
            <p className="font-sans text-riksa-cream/80 leading-relaxed mb-6">
              Riuangan Aksara Sunda. Membumikan aksara warisan leluhur di Tatar Sukapura.
            </p>
            <div className="aksara-sunda text-xl sm:text-2xl text-riksa-gold opacity-50">
              ᮛᮤᮅᮍᮔ᮪ ᮃᮊ᮪ᮞᮛ ᮞᮥᮔ᮪ᮓ
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6 text-riksa-white">Tautan Cepat</h3>
            <ul className="space-y-3 font-sans">
              <li><a href="#about" className="hover:text-riksa-orange transition-colors">Tentang Riksa</a></li>
              <li><a href="#philosophy" className="hover:text-riksa-orange transition-colors">Filosofi</a></li>
              <li><a href="#program" className="hover:text-riksa-orange transition-colors">Program Utama</a></li>
              <li><a href="#gallery" className="hover:text-riksa-orange transition-colors">Galeri Karya</a></li>
            </ul>
          </div>

          {/* Contact & Social Proof */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6 text-riksa-white">Hubungi Kami</h3>
            <ul className="space-y-4 font-sans mb-8">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-riksa-orange" />
                <span className="text-riksa-cream/80">Tasikmalaya, Jawa Barat</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-riksa-orange" />
                <span className="text-riksa-cream/80">halo@riksa.id</span>
              </li>
            </ul>
            
            <a href="https://instagram.com/riksa.tasikmalaya" target="_blank" rel="noreferrer" className="inline-flex w-full max-w-sm items-center gap-3 bg-white/5 border border-riksa-gold/30 rounded-xl p-4 hover:bg-riksa-orange/20 transition-colors duration-300 sm:w-auto">
              <div className="bg-gradient-to-tr from-yellow-500 via-riksa-orange to-pink-500 p-2 rounded-lg">
                <Instagram size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-riksa-white">@riksa.tasikmalaya</p>
                <p className="text-xs text-riksa-gold">10.2K+ Followers</p>
              </div>
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm font-sans text-riksa-cream/50">
          <p>&copy; {new Date().getFullYear()} RIKSA - Riuangan Aksara Sunda. Rahayu.</p>
        </div>
      </div>
    </footer>
  );
}
