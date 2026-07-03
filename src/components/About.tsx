import FadeIn from './Shared/FadeIn';

export default function About() {
  return (
    <section id="about" className="py-24 bg-riksa-cream relative">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <FadeIn>
          <h2 className="font-serif text-4xl text-riksa-brown-dark font-bold mb-4">Tentang RIKSA</h2>
          <div className="w-16 h-1 bg-riksa-orange mx-auto mb-8 rounded"></div>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <p className="text-lg md:text-xl text-riksa-brown-dark/80 leading-relaxed font-sans mb-8">
            RIKSA (Riuangan Aksara Sunda) lahir dari sebuah kepedulian mendalam terhadap warisan aksara peninggalan karuhun. 
            Sebagai komunitas literasi aksara Sunda pertama di Tasikmalaya, kami bergerak aktif dalam membumikan kembali 
            Aksara Sunda di Tatar Sukapura.
          </p>
          <p className="text-lg md:text-xl text-riksa-brown-dark/80 leading-relaxed font-sans">
            Kami percaya bahwa aksara bukan sekadar lambang bunyi, melainkan identitas kultural yang memuat filosofi, 
            sejarah, dan jiwa dari masyarakat Sunda itu sendiri.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
