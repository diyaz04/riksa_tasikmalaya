import { motion } from 'framer-motion';

const HERO_IMAGE_URL = 'https://awsimages.detik.net.id/community/media/visual/2024/01/11/pakaian-adat-sunda_169.jpeg?w=1200';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-riksa-cream">
      <img
        src={HERO_IMAGE_URL}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center [mask-image:linear-gradient(to_bottom,black_0%,black_58%,rgba(0,0,0,0.42)_78%,transparent_100%)]"
      />
      <div className="absolute inset-0 bg-riksa-cream/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,233,211,0.18)_0%,rgba(245,233,211,0.52)_42%,rgba(61,32,19,0.28)_100%)]" />
      <div className="absolute inset-0 backdrop-blur-[1.5px] [mask-image:linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.62)_48%,transparent_82%)]" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-riksa-cream/72 to-riksa-cream" />

      {/* Curtain Reveal Animation Layers */}
      <motion.div 
        className="absolute inset-0 bg-riksa-brown-dark z-20 origin-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
      
      {/* Subtle Sundanese Pattern Background */}
      <div className="absolute inset-0 pattern-sunda opacity-30 mix-blend-multiply"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <h1 className="font-serif text-6xl md:text-8xl font-black tracking-wide text-riksa-orange mb-4 drop-shadow-[0_3px_18px_rgba(245,233,211,0.85)]">
            Riksa
          </h1>
          
          {/* Subtitle in Aksara Sunda */}
          <div className="aksara-sunda text-2xl md:text-3xl text-riksa-gold mb-6 opacity-90 drop-shadow-[0_2px_12px_rgba(245,233,211,0.85)]">
            ᮛᮤᮅᮍᮔ᮪ ᮃᮊ᮪ᮞᮛ ᮞᮥᮔ᮪ᮓ
          </div>

          <h2 className="font-serif text-2xl md:text-4xl font-bold text-riksa-brown-dark max-w-3xl leading-snug mb-8 drop-shadow-[0_2px_16px_rgba(245,233,211,0.9)]">
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
