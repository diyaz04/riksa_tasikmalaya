import FadeIn from './Shared/FadeIn';

export default function Gallery() {
  const images = [
    { id: 1, src: "https://images.unsplash.com/photo-1596484552993-3d6074124976?auto=format&fit=crop&q=80&w=800", alt: "Workshop Aksara" },
    { id: 2, src: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800", alt: "Kaos Merchandise Riksa" },
    { id: 3, src: "https://images.unsplash.com/photo-1522881113591-b6d98d21b399?auto=format&fit=crop&q=80&w=800", alt: "Menulis Naskah" },
  ];

  return (
    <section id="gallery" className="py-24 bg-riksa-cream relative">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="font-serif text-4xl text-riksa-brown-dark font-bold mb-4">Galeri & Karya</h2>
          <div className="w-16 h-1 bg-riksa-orange mx-auto rounded"></div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <FadeIn key={img.id} delay={index * 0.2}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer shadow-lg border border-riksa-brown-dark/10">
                <div className="absolute inset-0 bg-riksa-brown-dark/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out filter sepia-[.3]"
                />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-riksa-brown-dark to-transparent z-20">
                  <h3 className="text-riksa-cream font-serif text-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {img.alt}
                  </h3>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
