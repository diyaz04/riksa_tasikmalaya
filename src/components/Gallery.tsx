import { useState } from 'react';
import FadeIn from './Shared/FadeIn';
import { Sparkles, ZoomIn } from 'lucide-react';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<'semua' | 'pawiyatan' | 'naskah' | 'seni'>('semua');

  const galleryItems = [
    {
      id: 1,
      category: 'pawiyatan',
      tag: 'Pawiyatan',
      title: 'Workshop Baca-Tulis Aksara Sunda Baku',
      desc: 'Pelatihan intensif literasi aksara karuhun bagi pemuda dan pelajar Tasikmalaya.',
      src: 'https://images.unsplash.com/photo-1596484552993-3d6074124976?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      category: 'naskah',
      tag: 'Naskah Klasik',
      title: 'Alih Aksara & Konservasi Naskah Lontar',
      desc: 'Dokumentasi penelusuran naskah kuno peninggalan Parahyangan.',
      src: 'https://images.unsplash.com/photo-1522881113591-b6d98d21b399?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 3,
      category: 'seni',
      tag: 'Merchandise & Seni',
      title: 'Kaos & Seni Tipografi RIKSA',
      desc: 'Inovasi tipografi aksara Sunda modern pada media sandang kekinian.',
      src: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 4,
      category: 'seni',
      tag: 'Tradisi Lodong',
      title: 'Musik Bambu & Karinding Tatar Sukapura',
      desc: 'Pengiring musikal khas Sunda dalam setiap pawiyatan dan sarasehan adat.',
      src: '/images/hero-children-clean.jpg',
    },
    {
      id: 5,
      category: 'pawiyatan',
      tag: 'Pawiyatan',
      title: 'Reriungan Relawan Muda Parahyangan',
      desc: 'Kebersamaan relawan budaya RIKSA dalam membumikan aksara Sunda.',
      src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 6,
      category: 'naskah',
      tag: 'Koleksi',
      title: 'Kalam & Prasasti Aksara Kuno',
      desc: 'Koleksi artefak literasi dan kajian filologi naskah Tatar Sunda.',
      src: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const filteredItems = activeCategory === 'semua' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      
      {/* Background Micro Sunda Accent */}
      <div className="absolute inset-0 pattern-sunda opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-riksa-green-subtle text-riksa-green font-bold text-xs uppercase tracking-wider mb-4 border border-riksa-green-border">
              <Sparkles size={14} className="text-riksa-orange" />
              <span>Dokumentasi Budaya</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight mb-4">
              Galeri Karya &amp; Tapak Kagiatan
            </h2>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-8 h-[2px] bg-riksa-orange rounded-full" />
              <span className="w-16 h-[3px] bg-riksa-green rounded-full" />
              <span className="w-8 h-[2px] bg-riksa-gold rounded-full" />
            </div>

            <p className="font-sans text-stone-600 text-base sm:text-lg leading-relaxed">
              Potret dedikasi komunitas RIKSA dalam merawat aksara, mengedukasi generasi muda, 
              dan menggelorakan wibawa kebudayaan Parahyangan.
            </p>
          </FadeIn>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {[
              { id: 'semua', label: 'Semua Koleksi' },
              { id: 'pawiyatan', label: 'Pawiyatan & Kelas' },
              { id: 'naskah', label: 'Naskah Klasik' },
              { id: 'seni', label: 'Seni & Tradisi' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 ${
                  activeCategory === tab.id
                    ? 'bg-riksa-green text-white shadow-md'
                    : 'bg-[#FAF7EE] text-stone-700 hover:bg-emerald-50 hover:text-riksa-green border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((img, index) => (
            <FadeIn key={img.id} delay={index * 0.1}>
              <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl cursor-pointer shadow-md hover:shadow-2xl border border-emerald-950/10 transition-all duration-500">
                
                {/* Image */}
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Forest Green Gradient Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-riksa-green-dark via-riksa-green-dark/60 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 text-white">
                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {img.tag}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <ZoomIn size={16} />
                    </div>
                  </div>

                  {/* Bottom Text */}
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug mb-1 text-white">
                      {img.title}
                    </h3>
                    <p className="font-sans text-xs text-emerald-100/80 line-clamp-2">
                      {img.desc}
                    </p>
                  </div>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
