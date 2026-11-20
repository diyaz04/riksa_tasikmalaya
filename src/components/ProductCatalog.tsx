import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  X, 
  Plus, 
  Minus, 
  Star, 
  Search, 
  ArrowRight,
  Info,
  ShieldCheck,
  Tag
} from 'lucide-react';
import FadeIn from './Shared/FadeIn';
import SundaneseRoofHeading from './Shared/SundaneseRoofHeading';
import { supabase, isSupabaseConfigured } from '../lib/supabaseCompat';

export interface ProductItem {
  id: string;
  nama: string;
  kategori: string;
  harga: number;
  tipe_pesanan: 'ready' | 'po';
  estimasi_po?: string;
  deskripsi: string;
  spesifikasi?: string;
  foto: string[]; // up to 5 photos
  foto_utama_index: number; // 0..4
  is_active?: boolean;
  created_at?: string;
}

// Fallback Authentic Curated Cultural Products if database is initially empty
const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'payung-geulis-tasik',
    nama: 'Payung Geulis Bordir Khas Tasikmalaya',
    kategori: 'Kerajinan & Kriya',
    harga: 165000,
    tipe_pesanan: 'ready',
    estimasi_po: 'Ready Stock',
    deskripsi: 'Payung Geulis legendaris warisan budaya Sunda khas Sukapura Tasikmalaya. Dibuat dengan rangka bambu apus pilihan dan dilukis tangan oleh perajin tradisional dengan motif flora Parahyangan yang anggun.',
    spesifikasi: 'Bahan: Rangka Bambu Pilihan, Kain Katun & Kertas Semen Kedap Air | Diameter: 65 cm | Pewarna: Cat lukis tangan tahan cuaca | Asal: Indihiang, Tasikmalaya',
    foto: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80'
    ],
    foto_utama_index: 0,
    is_active: true
  },
  {
    id: 'iket-sunda-makuta',
    nama: 'Iket Sunda Makuta Sinatria (Totopong Bordir Aksara)',
    kategori: 'Pakaian & Adat',
    harga: 85000,
    tipe_pesanan: 'ready',
    estimasi_po: 'Ready Stock',
    deskripsi: 'Iket Sunda praktis model Makuta Sinatria dengan sentuhan bordir Aksara Sunda Kaganga yang sarat nilai filosofi kepemimpinan Sunda. Nyaman dipakai seharian untuk acara adat maupun gaya kasual.',
    spesifikasi: 'Bahan: Katun Primisima Adem & Lembut | Model: Makuta Sinatria Praktis Langsung Pakai | Aksara: Bordir Benang Emas | Ukuran: All Size (Tali Belakang Fleksibel)',
    foto: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=900&q=80'
    ],
    foto_utama_index: 0,
    is_active: true
  },
  {
    id: 'pangsi-sunda-salontreng',
    nama: 'Setelan Pangsi Sunda Salontreng & Celana Komprang',
    kategori: 'Pakaian & Adat',
    harga: 220000,
    tipe_pesanan: 'po',
    estimasi_po: '3-5 Hari Kerja',
    deskripsi: 'Busana adat Sunda pria khas Salontreng dengan kancing batok kelapa alami dan celana komprang yang longgar & sejuk. Cocok untuk upacara seren taun, latihan silat maenpo, maupun peringatan hari budaya.',
    spesifikasi: 'Bahan: Katun Twill Besway Premium Tebal & Adem | Kancing: Batok Kelapa Asli | Warna: Hitam Polos Tradisional | Pilihan Ukuran: M, L, XL, XXL',
    foto: [
      'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'
    ],
    foto_utama_index: 0,
    is_active: true
  },
  {
    id: 'kujang-pajajaran-jati',
    nama: 'Kujang Pajajaran Mini Hiasan Kayu Jati Ukir',
    kategori: 'Pusaka & Hiasan',
    harga: 180000,
    tipe_pesanan: 'ready',
    estimasi_po: 'Ready Stock',
    deskripsi: 'Replika artistik Kujang Ciung khas Pajajaran yang diukir dari kayu jati solid berurat indah. Dilengkapi dengan dudukan kayu berukir motif Megamendung, sangat anggun untuk pajangan meja kerja atau ruang tamu.',
    spesifikasi: 'Bahan: Kayu Jati Solid Finishing Natural Wax | Panjang Bilah: 28 cm | Termasuk: Stand / Dudukan Kayu Ukir Eksklusif',
    foto: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
    ],
    foto_utama_index: 0,
    is_active: true
  },
  {
    id: 'anyaman-mendong-tasik',
    nama: 'Tas Jinjing Anyaman Mendong Khas Rajapolah',
    kategori: 'Kerajinan & Kriya',
    harga: 95000,
    tipe_pesanan: 'ready',
    estimasi_po: 'Ready Stock',
    deskripsi: 'Tas kriya ramah lingkungan dari serat rumput mendong alami Tasikmalaya. Dianyam dengan ketelitian tangan para pengerajin Rajapolah dengan kombinasi tali kulit sintetis yang modis & kuat.',
    spesifikasi: 'Bahan: 100% Rumput Mendong Kering Alami & Handle Faux Leather | Ukuran: 32 x 12 x 25 cm | Furing: Kain Blacu Dalaman dengan Resleting',
    foto: [
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'
    ],
    foto_utama_index: 0,
    is_active: true
  },
  {
    id: 'buku-aksara-kaganga',
    nama: 'Buku Pedoman Aksara Sunda Kaganga (Edisi Eksklusif)',
    kategori: 'Buku & Naskah',
    harga: 75000,
    tipe_pesanan: 'po',
    estimasi_po: '2-4 Hari Kerja',
    deskripsi: 'Buku panduan komprehensif pembelajaran Aksara Sunda Baku karya pegiat budaya RIKSA. Membahas fonologi, aturan ngalagena, rarangken, angka, hingga contoh alih aksara prasasti & naskah kuno.',
    spesifikasi: 'Penulis: Tim Riksa Budaya Sunda | Halaman: 168 Hal Bookpaper | Jilid: Hardcover Eksklusif Bertekstur Serat Bambu | ISBN: Resmi Terdaftar',
    foto: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80'
    ],
    foto_utama_index: 0,
    is_active: true
  }
];

export default function ProductCatalog() {
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ownerPhone, setOwnerPhone] = useState<string>('6285624607400');
  
  // Shopee Modal State
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [orderQty, setOrderQty] = useState<number>(1);
  const [buyerNotes, setBuyerNotes] = useState<string>('');

  // Fetch Products & Owner Settings from Supabase
  useEffect(() => {
    async function loadCatalog() {
      if (!isSupabaseConfigured || !supabase) return;

      try {
        // Fetch products
        const { data: prodData, error: prodErr } = await supabase
          .from('riksa_documents')
          .select('id, data')
          .eq('collection', 'produk');

        if (!prodErr && prodData && prodData.length > 0) {
          const parsed: ProductItem[] = prodData
            .map(row => {
              const d = row.data || {};
              const fotoArr = Array.isArray(d.foto) && d.foto.length > 0 
                ? d.foto.filter((f: any) => typeof f === 'string' && f.trim() !== '') 
                : ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'];
              
              let fotoUtama = Number(d.foto_utama_index ?? 0);
              if (isNaN(fotoUtama) || fotoUtama < 0 || fotoUtama >= fotoArr.length) {
                fotoUtama = 0;
              }

              return {
                id: row.id,
                nama: d.nama || 'Produk Budaya Sunda',
                kategori: d.kategori || 'Kerajinan & Kriya',
                harga: Number(d.harga) || 0,
                tipe_pesanan: (d.tipe_pesanan === 'po' ? 'po' : 'ready') as 'ready' | 'po',
                estimasi_po: d.estimasi_po || (d.tipe_pesanan === 'po' ? '3-5 Hari' : 'Ready Stock'),
                deskripsi: d.deskripsi || '',
                spesifikasi: d.spesifikasi || '',
                foto: fotoArr,
                foto_utama_index: fotoUtama,
                is_active: d.is_active !== false,
                created_at: d.created_at
              };
            })
            .filter(p => p.is_active);

          if (parsed.length > 0) {
            setProducts(parsed);
          }
        }

        // Fetch owner phone from settings
        const { data: settData } = await supabase
          .from('riksa_documents')
          .select('data')
          .eq('collection', 'settings')
          .eq('id', 'general')
          .maybeSingle();

        if (settData?.data?.telp) {
          const rawTelp = String(settData.data.telp).replace(/[^0-9]/g, '');
          const normalized = rawTelp.startsWith('0') 
            ? '62' + rawTelp.slice(1) 
            : rawTelp.startsWith('62') 
              ? rawTelp 
              : '62' + rawTelp;
          if (normalized.length >= 10) {
            setOwnerPhone(normalized);
          }
        }
      } catch (err) {
        console.warn('Gagal memuat katalog dari Supabase, menggunakan data budaya default:', err);
      }
    }

    loadCatalog();
  }, []);

  // Format currency in Rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Open Shopee Modal with initial state
  const handleOpenProduct = (product: ProductItem) => {
    setActiveProduct(product);
    setActivePhotoIndex(product.foto_utama_index || 0);
    setOrderQty(1);
    setBuyerNotes('');
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setActiveProduct(null);
    document.body.style.overflow = '';
  };

  // WhatsApp Checkout Redirect with Complete Order Template
  const handleWhatsAppCheckout = (product: ProductItem, qty: number, notes: string) => {
    const totalHarga = product.harga * qty;
    const currentUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] + '#products' : 'https://riksa.org#products';
    const statusText = product.tipe_pesanan === 'po' 
      ? `Pre-Order / PO (${product.estimasi_po || '3-5 Hari Kerja'})` 
      : 'Ready Stock';

    const waText = 
`Sampurasun Admin RIKSA 🙏
Saya tertarik dan ingin memesan produk budaya Sunda dari website RIKSA:

📦 *RINCIAN PESANAN:*
• *Produk:* ${product.nama}
• *Kategori:* ${product.kategori}
• *Status:* ${statusText}
• *Harga Satuan:* ${formatRupiah(product.harga)}
• *Jumlah Pesanan:* ${qty} pcs
• *Total Estimasi:* ${formatRupiah(totalHarga)}

📝 *Catatan Pemesan:*
${notes.trim() ? notes.trim() : '-'}

🔗 *Tautan Produk:*
${currentUrl}

Mohon informasi ketersediaan stok & petunjuk proses pembayarannya. Hatur nuhun!`;

    const waUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  // Filter Categories
  const categories = ['Semua', 'Kerajinan & Kriya', 'Pakaian & Adat', 'Pusaka & Hiasan', 'Buku & Naskah'];

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'Semua' || p.kategori.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section id="products" className="py-20 sm:py-28 bg-[#FAF7EE] relative overflow-hidden">
      {/* Background Decorative Motifs */}
      <div className="absolute inset-0 pattern-sunda opacity-25 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-riksa-green/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-riksa-gold/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        
        {/* Section Header with Sundanese Roof Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-riksa-green-subtle text-riksa-green font-bold text-xs uppercase tracking-wider mb-3 border border-riksa-green-border">
              <Sparkles size={14} className="text-riksa-orange" />
              <span>Karya & Kriya Budaya Sunda</span>
            </div>

            <SundaneseRoofHeading 
              title="Katalog Produk Budaya Khas Sunda" 
              className="mb-4"
            />

            <p className="font-serif italic text-sm text-riksa-gold font-semibold mb-3">
              ᮊᮛᮡ ᮘᮥᮓᮚ ᮞᮥᮔ᮪ᮓ — Warisan Karuhun Tatar Parahyangan
            </p>

            <p className="font-sans text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Ragam karya kerajinan tradisional, busana adat, hiasan pusaka, dan naskah karya pegiat RIKSA. 
              Pesanan Anda langsung terhubung ke pengurus melalui WhatsApp untuk menjaga keaslian & keberkahan budaya.
            </p>
          </FadeIn>
        </div>

        {/* Filter Bar & Search */}
        <div className="mb-10 sm:mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                  selectedCategory === cat
                    ? 'bg-riksa-green text-white border-riksa-green shadow-md shadow-emerald-950/10 scale-105'
                    : 'bg-white text-stone-700 hover:text-riksa-green border-stone-200/90 hover:border-riksa-green/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk budaya..."
              className="w-full pl-9 pr-4 py-2 rounded-full text-xs sm:text-sm bg-white border border-stone-200/90 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-riksa-green/30 focus:border-riksa-green shadow-sm"
            />
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white/70 rounded-3xl border border-stone-200/70 max-w-lg mx-auto">
            <ShoppingBag size={48} className="mx-auto text-stone-300 mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">Produk Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-4">Tidak ada karya yang sesuai dengan kata kunci pencarian Anda.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('Semua'); setSearchQuery(''); }}
              className="px-4 py-1.5 rounded-full bg-riksa-green text-white text-xs font-bold hover:bg-riksa-green-dark transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              // Ensure display photo is prioritized
              const displayPhotoUrl = product.foto[product.foto_utama_index] || product.foto[0] || '';
              const isPo = product.tipe_pesanan === 'po';

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-[0_4px_20px_-4px_rgba(20,61,34,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(20,61,34,0.14)] hover:border-riksa-green/40 transition-all duration-300 flex flex-col hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleOpenProduct(product)}
                >
                  {/* Photo Thumbnail Container */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    <img
                      src={displayPhotoUrl}
                      alt={product.nama}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay for badges readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Left: Order Type Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {isPo ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-white text-[10px] sm:text-xs font-extrabold tracking-wide shadow-md">
                          <Clock size={12} className="stroke-[2.5]" />
                          <span>PO ({product.estimasi_po || '3-5 Hari'})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-700/95 backdrop-blur-md text-white text-[10px] sm:text-xs font-extrabold tracking-wide shadow-md">
                          <CheckCircle2 size={12} className="stroke-[2.5]" />
                          <span>Ready Stock</span>
                        </span>
                      )}
                    </div>

                    {/* Top Right: Category Tag */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 text-[10px] sm:text-xs font-bold shadow-sm">
                        {product.kategori}
                      </span>
                    </div>

                    {/* Bottom Right: Photo Counter Badge if multi photos */}
                    {product.foto.length > 1 && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">
                        📷 {product.foto.length} Foto
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Product Name */}
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-riksa-green transition-colors line-clamp-2 mb-2 leading-snug">
                        {product.nama}
                      </h3>

                      {/* Brief Excerpt */}
                      <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                        {product.deskripsi}
                      </p>
                    </div>

                    {/* Footer Info & Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                          Harga Satuan
                        </span>
                        <span className="text-base sm:text-lg font-extrabold text-riksa-orange">
                          {formatRupiah(product.harga)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick View Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProduct(product);
                          }}
                          className="px-3.5 py-2 rounded-full bg-stone-100 hover:bg-riksa-green-subtle text-stone-700 hover:text-riksa-green text-xs font-bold transition-colors"
                        >
                          Detail
                        </button>

                        {/* Direct Order Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppCheckout(product, 1, '');
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
                          title="Pesan Langsung via WhatsApp"
                        >
                          <MessageCircle size={14} />
                          <span>Pesan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner Support */}
        <div className="mt-14 sm:mt-16 bg-gradient-to-r from-riksa-green-dark via-riksa-green to-[#134423] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none w-64 h-auto">
            <svg viewBox="0 0 200 200" fill="white">
              <path d="M40 160 Q100 20 160 160 Z" />
            </svg>
          </div>

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold mb-2">
              <ShieldCheck size={14} className="text-riksa-gold" />
              <span>Dukungan Pelestarian Budaya Tatar Sunda</span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold leading-snug mb-2">
              Ingin Custom Busana Adat atau Pemesanan Skala Komunitas?
            </h4>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
              Kami melayani pengadaan seragam pangsi, iket bordir lembaga, plakat kujang cinderamata acara budaya, hingga naskah Aksara Sunda dalam jumlah khusus.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <a
              href={`https://wa.me/${ownerPhone}?text=${encodeURIComponent('Sampurasun Admin RIKSA, saya ingin berkonsultasi mengenai pemesanan khusus / custom produk budaya Sunda.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-riksa-gold hover:bg-riksa-gold-light text-stone-900 font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle size={16} />
              <span>Konsultasi Khusus via WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* SHOPEE-STYLE INTERACTIVE DETAIL MODAL                           */}
      {/* ============================================================== */}
      {activeProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200/90 overflow-hidden relative my-auto animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF7EE]">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-riksa-green text-lg tracking-tight">
                  Katalog Budaya RIKSA
                </span>
                <span className="text-stone-300">|</span>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Rincian Produk
                </span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-full bg-white hover:bg-stone-200/70 text-stone-600 flex items-center justify-center transition-colors shadow-sm"
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: 2 Columns Shopee Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
              
              {/* Left Column: Multi-photo Gallery (Max 5 Photos) */}
              <div className="md:col-span-6 flex flex-col gap-3">
                {/* Main Big Photo Viewer */}
                <div className="relative aspect-square rounded-2xl bg-stone-100 overflow-hidden border border-stone-200 shadow-sm group">
                  <img
                    src={activeProduct.foto[activePhotoIndex] || activeProduct.foto[0]}
                    alt={activeProduct.nama}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Primary Photo Badge */}
                  {activePhotoIndex === (activeProduct.foto_utama_index || 0) && (
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-riksa-green text-white text-[11px] font-bold shadow-md">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>Foto Display Utama</span>
                    </div>
                  )}

                  {/* Photo Counter */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                    Foto {activePhotoIndex + 1} dari {activeProduct.foto.length}
                  </div>
                </div>

                {/* Thumbnails Row (Up to 5 Photos) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                  {activeProduct.foto.map((fotoUrl, idx) => {
                    const isActive = activePhotoIndex === idx;
                    const isMain = idx === (activeProduct.foto_utama_index || 0);

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhotoIndex(idx)}
                        onMouseEnter={() => setActivePhotoIndex(idx)}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                          isActive
                            ? 'border-riksa-green ring-2 ring-riksa-green/40 scale-100 shadow-md'
                            : 'border-stone-200 opacity-60 hover:opacity-100 hover:border-riksa-gold'
                        }`}
                      >
                        <img
                          src={fotoUrl}
                          alt={`${activeProduct.nama} - Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isMain && (
                          <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-riksa-gold rounded-full flex items-center justify-center text-[8px] text-white font-bold" title="Foto Display">
                            ★
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-stone-400 text-center italic">
                  *Arahkan kursor atau sentuh foto mini untuk melihat sudut pandang lainnya (maksimal 5 foto).
                </p>
              </div>

              {/* Right Column: Order Details & Shopee Stepper */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Status & Category Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
                      {activeProduct.kategori}
                    </span>

                    {activeProduct.tipe_pesanan === 'po' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                        <Clock size={12} className="text-amber-600" />
                        <span>Pre-Order (Estimasi: {activeProduct.estimasi_po || '3-5 Hari Kerja'})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        <span>Ready Stock Siap Kirim</span>
                      </span>
                    )}
                  </div>

                  {/* Product Title */}
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug mb-3">
                    {activeProduct.nama}
                  </h2>

                  {/* Shopee Style Price Banner */}
                  <div className="bg-[#FAF7EE] border border-stone-200/80 rounded-2xl p-4 mb-4 flex items-baseline gap-2">
                    <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Harga:</span>
                    <span className="text-3xl font-extrabold text-riksa-orange">
                      {formatRupiah(activeProduct.harga)}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">/ pcs</span>
                  </div>

                  {/* Product Specifications */}
                  {activeProduct.spesifikasi && (
                    <div className="mb-4 bg-stone-50 rounded-xl p-3 border border-stone-200/60">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-riksa-green uppercase tracking-wider mb-1.5">
                        <Info size={13} />
                        <span>Spesifikasi & Dimensi</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {activeProduct.spesifikasi}
                      </p>
                    </div>
                  )}

                  {/* Product Full Description */}
                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                      Deskripsi Produk
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                      {activeProduct.deskripsi}
                    </p>
                  </div>

                  {/* Quantity Counter (Shopee Style) */}
                  <div className="pt-4 border-t border-stone-200/80 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                        Jumlah Pesanan:
                      </span>
                      <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white shadow-sm">
                        <button
                          type="button"
                          onClick={() => setOrderQty(prev => Math.max(1, prev - 1))}
                          disabled={orderQty <= 1}
                          className="w-9 h-9 flex items-center justify-center hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent text-stone-700 font-bold transition-colors"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="w-12 text-center text-sm font-bold text-stone-900 select-none">
                          {orderQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setOrderQty(prev => prev + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-stone-100 text-stone-700 font-bold transition-colors"
                          aria-label="Tambah jumlah"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Total Price Calculation */}
                    <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/70 rounded-xl px-4 py-2.5">
                      <span className="text-xs font-bold text-emerald-900">Total Estimasi ({orderQty} pcs):</span>
                      <span className="text-base font-extrabold text-riksa-green">
                        {formatRupiah(activeProduct.harga * orderQty)}
                      </span>
                    </div>
                  </div>

                  {/* Optional Buyer Notes */}
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Catatan Pemesan <span className="text-stone-400 font-normal lowercase">(opsional):</span>
                    </label>
                    <textarea
                      rows={2}
                      value={buyerNotes}
                      onChange={(e) => setBuyerNotes(e.target.value)}
                      placeholder="Contoh: Ukuran M / Warna Dasar Hitam / Tambah ukiran nama..."
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200/90 focus:outline-none focus:ring-2 focus:ring-riksa-green/30 focus:border-riksa-green bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Direct WhatsApp Checkout CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppCheckout(activeProduct, orderQty, buyerNotes)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98]"
                  >
                    <MessageCircle size={20} className="fill-white stroke-none" />
                    <span>Pesan Sekarang via WhatsApp</span>
                  </button>
                  <p className="text-[11px] text-stone-400 text-center mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck size={13} className="text-riksa-green" />
                    <span>Rincian pesanan & template otomatis langsung terkirim ke WhatsApp Owner RIKSA</span>
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
