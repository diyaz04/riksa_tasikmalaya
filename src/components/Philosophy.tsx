import { motion } from 'framer-motion';
import FadeIn from './Shared/FadeIn';
import { Circle, Square, Type, PenTool } from 'lucide-react'; // Using lucide for icons

export default function Philosophy() {
  const philosophies = [
    {
      id: 1,
      title: "Aksara Sunda 'Ra'",
      desc: "Menyimbolkan suku kata pertama dari nama 'Riksa' serta merepresentasikan nilai kearifan lokal Sunda yang agung.",
      icon: <Type size={40} strokeWidth={1.5} />,
    },
    {
      id: 2,
      title: "Huruf 'R'",
      desc: "Inisial universal yang mengikat Riksa dalam konteks modern tanpa kehilangan akar tradisionalnya.",
      icon: <Circle size={40} strokeWidth={1.5} />,
    },
    {
      id: 3,
      title: "Pena",
      desc: "Lambang intelektualitas, edukasi, dan komitmen Riksa dalam menuliskan dan menyebarluaskan literasi.",
      icon: <PenTool size={40} strokeWidth={1.5} />,
    },
    {
      id: 4,
      title: "Persegi Empat",
      desc: "Mewakili ruang reriungan (perkumpulan), stabilitas, dan empat penjuru mata angin Tatar Sukapura.",
      icon: <Square size={40} strokeWidth={1.5} />,
    }
  ];

  return (
    <section id="philosophy" className="py-16 md:py-24 bg-riksa-brown-dark relative overflow-hidden">
      <div className="absolute inset-0 pattern-sunda-dark"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <FadeIn className="text-center mb-10 md:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-riksa-cream font-bold mb-4">Filosofi Logo</h2>
          <div className="w-16 h-1 bg-riksa-gold mx-auto rounded"></div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {philosophies.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.1} direction="up">
              <motion.div 
                className="group h-full bg-riksa-cream/5 border border-riksa-gold/20 p-6 sm:p-8 rounded-2xl hover:bg-riksa-cream/10 transition-colors duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="text-riksa-white group-hover:text-riksa-orange-light mb-6 transition-colors duration-300 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-riksa-gold mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-riksa-cream/80 text-sm leading-relaxed text-center font-sans">
                  {item.desc}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
