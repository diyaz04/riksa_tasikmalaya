import { motion } from 'framer-motion';
import FadeIn from './Shared/FadeIn';
import SundaneseRoofHeading from './Shared/SundaneseRoofHeading';
import { PenTool, Compass, Square, Type } from 'lucide-react';

export default function Philosophy() {
  const philosophies = [
    {
      id: 1,
      aksara: 'ᮛ',
      title: "Aksara Sunda 'Ra'",
      desc: "Menyimbolkan suku kata pertama dari nama 'Riksa' serta merepresentasikan nilai kearifan lokal Sunda yang agung dan luhur.",
      icon: Type,
      highlight: 'Aksara Induk',
    },
    {
      id: 2,
      aksara: 'R',
      title: "Huruf Latin 'R'",
      desc: "Inisial universal yang mengikat pergerakan RIKSA dalam denyut zaman modern tanpa kehilangan akar kebudayaan tradisionalnya.",
      icon: Compass,
      highlight: 'Modernitas',
    },
    {
      id: 3,
      aksara: '✒',
      title: "Pena & Kalam Literasi",
      desc: "Lambang intelektualitas, pendidikan keaksaraan, dan dedikasi abadi komunitas dalam mencatat serta menyebarluaskan ilmu.",
      icon: PenTool,
      highlight: 'Edukasi',
    },
    {
      id: 4,
      aksara: '❖',
      title: "Pasagi Opat Sukapura",
      desc: "Mewakili ruang reriungan (perkumpulan), stabilitas kebersamaan, dan empat penjuru mata angin pancer Tatar Parahyangan.",
      icon: Square,
      highlight: 'Reriungan',
    },
  ];

  return (
    <section id="philosophy" className="py-20 sm:py-28 bg-[#143D22] text-white relative overflow-hidden">
      
      {/* Background Motifs */}
      <div className="absolute inset-0 pattern-sunda-dark opacity-30 pointer-events-none" />

      {/* Subtle Megamendung Glow Backdrop */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        
        {/* Header with Sundanese Roof Ornament */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <FadeIn>
            <SundaneseRoofHeading title="Filosofi Lambang" className="[&_h2]:text-white" />

            <p className="font-sans text-emerald-100/80 text-base sm:text-lg leading-relaxed mt-3">
              Setiap goresan lambang RIKSA mengandung doa dan falsafah hidup masyarakat Parahyangan: 
              merawat ingatan, menautkan persaudaraan, dan mengokohkan martabat bangsa.
            </p>
          </FadeIn>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {philosophies.map((item, index) => {
            const IconComp = item.icon;
            return (
              <FadeIn key={item.id} delay={index * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="h-full bg-white/[0.07] backdrop-blur-md border border-white/15 hover:border-riksa-gold/60 p-6 sm:p-7 rounded-3xl transition-all duration-300 flex flex-col group relative overflow-hidden"
                >
                  {/* Subtle Corner Glow on Hover */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-riksa-gold/10 rounded-full blur-xl group-hover:bg-riksa-gold/20 transition-all pointer-events-none" />

                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 text-riksa-gold flex items-center justify-center border border-white/10 group-hover:bg-riksa-gold group-hover:text-stone-900 transition-colors duration-300">
                      <IconComp size={22} />
                    </div>

                    <span className="text-2xl font-bold font-serif text-emerald-200/40 group-hover:text-riksa-gold/80 transition-colors">
                      {item.aksara}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-riksa-gold/90 mb-1 font-sans">
                    {item.highlight}
                  </span>

                  <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-riksa-gold transition-colors">
                    {item.title}
                  </h3>

                  <p className="font-sans text-emerald-100/75 text-sm leading-relaxed mt-auto">
                    {item.desc}
                  </p>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}
