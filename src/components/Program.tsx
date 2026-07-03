import FadeIn from './Shared/FadeIn';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function Program() {
  return (
    <section id="program" className="py-24 bg-riksa-cream relative">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="font-serif text-4xl text-riksa-brown-dark font-bold mb-4">Agenda Utama</h2>
          <div className="w-16 h-1 bg-riksa-orange mx-auto rounded"></div>
        </FadeIn>

        <FadeIn delay={0.2} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-riksa-gold/30 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-riksa-orange to-riksa-gold"></div>
            
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Date Highlight */}
                <div className="flex-shrink-0 bg-riksa-cream rounded-2xl p-6 text-center border border-riksa-gold/20 min-w-[140px]">
                  <span className="block text-riksa-orange font-bold text-sm uppercase tracking-wider mb-1">Sabtu</span>
                  <span className="block font-serif text-5xl font-black text-riksa-brown-dark mb-1">23</span>
                  <span className="block text-riksa-brown-dark/70 font-semibold uppercase">Mei 2026</span>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="font-serif text-3xl font-bold text-riksa-brown-dark mb-4">
                    Workshop Literasi Aksara Sunda
                  </h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-riksa-orange mt-1 flex-shrink-0" size={20} />
                      <p className="text-riksa-brown-dark/80 font-sans">
                        Aula Wiradadaha Bappelitbangda<br/>
                        <span className="text-sm">Kab. Tasikmalaya</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="text-riksa-orange mt-1 flex-shrink-0" size={20} />
                      <p className="text-riksa-brown-dark/80 font-sans">
                        Didukung oleh Balai Pelestarian Kebudayaan Jawa Barat & Program BISA
                      </p>
                    </div>
                  </div>

                  <button className="bg-riksa-brown-dark text-riksa-cream px-8 py-3 rounded-full font-bold hover:bg-riksa-orange transition-colors duration-300 w-full md:w-auto">
                    Daftar Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
