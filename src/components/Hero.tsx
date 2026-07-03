import { motion } from 'framer-motion';
import LogoFrame from './Shared/LogoFrame';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-riksa-cream">
      {/* Curtain Reveal Animation Layers */}
      <motion.div 
        className="absolute inset-0 bg-riksa-brown-dark z-20 origin-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
      
      {/* Subtle Sundanese Pattern Background */}
      <div className="absolute inset-0 pattern-sunda opacity-40 mix-blend-multiply"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <LogoFrame variant="hero" />
          </motion.div>
          
          {/* Subtitle in Aksara Sunda */}
          <div className="aksara-sunda text-2xl md:text-3xl text-riksa-gold mb-6 opacity-80">
            ᮛᮤᮅᮍᮔ᮪ ᮃᮊ᮪ᮞᮛ ᮞᮥᮔ᮪ᮓ
          </div>

          <h2 className="font-serif text-2xl md:text-4xl font-bold text-riksa-brown-dark max-w-3xl leading-snug mb-8">
            Membumikan Aksara Sunda di Tatar Sukapura
          </h2>

          <motion.a 
            href="#program"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-riksa-orange text-white font-sans font-bold tracking-wide rounded-full shadow-lg hover:bg-riksa-orange-light transition-colors duration-300"
          >
            Gabung Komunitas
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
