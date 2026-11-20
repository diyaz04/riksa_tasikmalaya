import FadeIn from './Shared/FadeIn';
import { Calendar, MapPin, Users, Sparkles, BookOpen, Laptop, Flame } from 'lucide-react';

interface ProgramProps {
  onOpenJoinModal?: () => void;
}

export default function Program({ onOpenJoinModal }: ProgramProps) {
  const recurringPrograms = [
    {
      icon: BookOpen,
      title: 'Pawiyatan Ngulik Aksara',
      schedule: 'Setiap Akhir Pekan',
      desc: 'Kelas edukasi terbuka dan gratis bagi pelajar, mahasiswa, dan masyarakat umum untuk menguasai baca-tulis Aksara Sunda baku.',
      tag: 'Kelas Terbuka',
    },
    {
      icon: Laptop,
      title: 'Digitalisasi Naskah Lontar',
      schedule: 'Program Berkelanjutan',
      desc: 'Ikhtiar alih-aksara dan pengarsipan digital naskah-naskah kuno peninggalan karuhun Parahyangan agar lestari di era kecerdasan buatan.',
      tag: 'Konservasi',
    },
    {
      icon: Flame,
      title: 'Sarasehan & Festival Sukapura',
      schedule: 'Agenda Triwulan',
      desc: 'Ruang temu budayawan, akademisi, dan seniman muda dalam mengkaji naskah sejarah, filsafat Sunda, dan pertunjukan seni tradisi.',
      tag: 'Sarasehan',
    },
  ];

  return (
    <section id="program" className="py-20 sm:py-28 bg-[#FAF7EE] relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute inset-0 pattern-sunda opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-riksa-green-subtle text-riksa-green font-bold text-xs uppercase tracking-wider mb-4 border border-riksa-green-border">
              <Sparkles size={14} className="text-riksa-orange" />
              <span>Agenda & Kagiatan</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight mb-4">
              Pawiyatan & Pergerakan Budaya
            </h2>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-8 h-[2px] bg-riksa-orange rounded-full" />
              <span className="w-16 h-[3px] bg-riksa-green rounded-full" />
              <span className="w-8 h-[2px] bg-riksa-gold rounded-full" />
            </div>

            <p className="font-sans text-stone-600 text-base sm:text-lg leading-relaxed">
              Bergabunglah dalam berbagai program edukatif dan sosial kemasyarakatan RIKSA untuk 
              menghidupkan kembali aksara Sunda di tengah kehidupan sehari-hari.
            </p>
          </FadeIn>
        </div>

        {/* Featured Agenda Highlight Card */}
        <FadeIn delay={0.2} className="mb-14">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-950/10 relative">
            
            {/* Top Gradient Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-riksa-green via-riksa-gold to-riksa-orange" />

            <div className="p-6 sm:p-10 lg:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                
                {/* Date Badge */}
                <div className="shrink-0 bg-riksa-green text-white rounded-3xl p-6 text-center w-full md:w-36 shadow-md border-2 border-riksa-gold/40">
                  <span className="block text-xs uppercase font-bold tracking-widest text-riksa-gold mb-1">
                    Sabtu
                  </span>
                  <span className="block font-serif text-5xl font-black mb-1">
                    23
                  </span>
                  <span className="block text-xs uppercase tracking-wider text-emerald-100 font-semibold">
                    Mei 2026
                  </span>
                </div>

                {/* Event Details */}
                <div className="grow">
                  <div className="inline-block px-3 py-1 rounded-full bg-riksa-orange/10 text-riksa-orange font-bold text-xs uppercase tracking-wide mb-3">
                    Lokakarya Akbar Terbuka
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
                    Workshop Literasi Aksara Sunda Tatar Sukapura
                  </h3>

                  <div className="space-y-3 mb-6 sm:mb-8 font-sans text-stone-600 text-sm sm:text-base">
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-riksa-green shrink-0 mt-0.5" />
                      <span>
                        <strong>Aula Wiradadaha Bappelitbangda</strong> — Kab. Tasikmalaya, Jawa Barat
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users size={20} className="text-riksa-green shrink-0 mt-0.5" />
                      <span>
                        Didukung oleh Balai Pelestarian Kebudayaan Jawa Barat & Komunitas Literasi Pasundan
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="button"
                      onClick={onOpenJoinModal}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-riksa-green hover:bg-riksa-green-dark text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Daftar Pawiyatan Ini
                    </button>

                    <span className="text-xs text-stone-500 font-medium">
                      * Terbuka untuk umum &amp; kapasitas terbatas 50 peserta.
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </FadeIn>

        {/* 3 Regular Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {recurringPrograms.map((item, index) => {
            const IconComp = item.icon;
            return (
              <FadeIn key={item.title} delay={index * 0.15}>
                <div className="h-full bg-white rounded-3xl p-7 border border-emerald-950/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-riksa-green-subtle text-riksa-green flex items-center justify-center group-hover:bg-riksa-green group-hover:text-white transition-colors duration-300">
                      <IconComp size={22} />
                    </div>
                    <span className="text-xs font-bold text-riksa-orange uppercase tracking-wider bg-riksa-orange-subtle px-3 py-1 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 group-hover:text-riksa-green transition-colors">
                    {item.title}
                  </h3>

                  <span className="text-xs text-stone-500 font-semibold mb-3 flex items-center gap-1.5">
                    <Calendar size={13} className="text-riksa-gold" />
                    {item.schedule}
                  </span>

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
