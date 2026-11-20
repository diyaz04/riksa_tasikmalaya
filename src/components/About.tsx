import FadeIn from './Shared/FadeIn';
import { BookOpen, Users, Sprout, Handshake, ChevronRight, Compass, Users2 } from 'lucide-react';

export default function About() {
  const quickFeatures = [
    {
      icon: BookOpen,
      title: 'Lestarikan Aksara Sunda',
    },
    {
      icon: Users,
      title: 'Bangun Komunitas',
    },
    {
      icon: Sprout,
      title: 'Rawat Budaya',
    },
    {
      icon: Handshake,
      title: 'Jaga Jati Diri Bangsa',
    },
  ];

  const pillars = [
    {
      icon: Compass,
      title: 'Visi Kedaulatan Budaya',
      desc: 'Terwujudnya kedaulatan budaya Tatar Sunda di mana setiap generasi muda cakap membaca, menulis, dan mengamalkan nilai kearifan aksara karuhun.',
    },
    {
      icon: BookOpen,
      title: 'Pawiyatan & Digitalisasi',
      desc: 'Menyelenggarakan kelas belajar aksara Sunda secara terbuka, serta mengalihaksarakan naskah lontar peninggalan Parahyangan ke format digital modern.',
    },
    {
      icon: Users2,
      title: 'Reriungan Tatar Sukapura',
      desc: 'Wadah kolaborasi penggiat budaya, akademisi, dan relawan muda di Tasikmalaya untuk membumikan tradisi lokal ke panggung kebudayaan nasional.',
    },
  ];

  return (
    <section id="about" className="pt-2 sm:pt-4 pb-20 sm:pb-28 bg-[#FAF7EE] relative overflow-hidden">
      
      {/* Background Micro Sunda Accent */}
      <div className="absolute inset-0 pattern-sunda opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
        
        {/* ============================================================== */}
        {/* 1. 4 FEATURE CARDS IN WHITE PILL CONTAINER (PERSIS MOCKUP)      */}
        {/* ============================================================== */}
        <FadeIn delay={0.1} className="mb-12 sm:mb-16">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-stone-200/80 p-4 sm:p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-4 divide-x divide-stone-200/80">
              {quickFeatures.map((item) => {
                const IconComp = item.icon;
                return (
                  <div key={item.title} className="flex flex-col items-center text-center px-1.5 sm:px-4 py-1">
                    {/* Circle Icon Badge */}
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-emerald-100/70 text-riksa-green flex items-center justify-center mb-2 sm:mb-3 shadow-inner">
                      <IconComp size={20} className="sm:w-6 sm:h-6 stroke-[2.2]" />
                    </div>
                    {/* Label */}
                    <span className="text-[10px] sm:text-xs font-bold text-stone-800 leading-tight">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* ============================================================== */}
        {/* 2. TENTANG RIKSA SECTION HEADER (PERSIS MOCKUP)                */}
        {/* ============================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <FadeIn>
            {/* Flanked Eyebrow Badge */}
            <div className="inline-flex items-center justify-center gap-3 mb-2.5">
              <span className="h-[1.5px] w-8 sm:w-12 bg-riksa-green/40 rounded-full" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-riksa-green font-serif">
                Tentang Riksa
              </span>
              <span className="h-[1.5px] w-8 sm:w-12 bg-riksa-green/40 rounded-full" />
            </div>

            {/* Main Section Heading */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-riksa-green tracking-tight leading-snug mb-3">
              Gerakan Bersama Melestarikan Budaya Sunda
            </h2>

            {/* Subtitle / Description */}
            <p className="font-sans text-stone-600 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
              Riksa adalah gerakan bersama untuk melestarikan aksara Sunda, 
              menumbuhkan budaya, dan merawat jati diri bangsa.
            </p>
          </FadeIn>
        </div>

        {/* ============================================================== */}
        {/* 3. SAUNG BALE PHOTO CARD WITH MEGAMENDUNG CLOUDS & BUTTON      */}
        {/* ============================================================== */}
        <FadeIn delay={0.2} className="mb-14 sm:mb-20">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 max-w-3xl mx-auto group">
            {/* Saung Bale Photo with Mountains & Megamendung (2K Ultra HD, Clean without Leftover Slices) */}
            <img
              src="/images/saung-bale-2k.webp"
              alt="Saung Sunda Bale Tradisional dengan latar Gunung Galunggung dan awan Megamendung"
              className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-700 ease-out"
            />

            {/* Single Crisp Vector Button 'Pelajari Lebih Lanjut >' */}
            <a
              href="#philosophy"
              aria-label="Pelajari Lebih Lanjut Tentang RIKSA"
              className="absolute right-3 sm:right-6 bottom-3 sm:bottom-6 inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-900 text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-lg transition-all active:scale-95 border border-stone-200/80 group/btn"
            >
              <span>Pelajari Lebih Lanjut</span>
              <ChevronRight size={16} className="stroke-[2.5] text-riksa-green group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </FadeIn>

        {/* ============================================================== */}
        {/* 4. THREE PILLARS EXPANDED DETAILS CARDS                        */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {pillars.map((item, index) => {
            const IconComp = item.icon;
            return (
              <FadeIn key={item.title} delay={index * 0.15}>
                <div className="h-full bg-white rounded-3xl p-7 sm:p-8 border border-emerald-950/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-riksa-green flex items-center justify-center mb-6 shadow-sm border border-emerald-900/10 group-hover:bg-riksa-green group-hover:text-white transition-colors duration-300">
                    <IconComp size={26} />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-3 group-hover:text-riksa-green transition-colors">
                    {item.title}
                  </h3>

                  <p className="font-sans text-stone-600 text-sm leading-relaxed mt-auto">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}
