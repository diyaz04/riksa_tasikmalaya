-- ==============================================================
-- RIKSA: UPDATE RLS POLICY & SEED PRODUK BUDAYA KHAS SUNDA
-- Jalankan query ini di Supabase SQL Editor (Dashboard > SQL Editor)
-- ==============================================================

-- 1. Perbarui Kebijakan RLS agar publik/anon bisa membaca produk aktif di Landing Page
drop policy if exists "Public read landing content" on public.riksa_documents;
create policy "Public read landing content"
on public.riksa_documents
for select
to anon, authenticated
using (
  public.is_riksa_admin()
  or (collection = 'settings' and id in ('general', 'recruitment', 'cloudinary'))
  or (collection = 'berita' and data ->> 'status' = 'published')
  or (collection = 'galeri' and coalesce((data ->> 'isVisible')::boolean, false) = true)
  or (collection = 'struktur')
  or (collection = 'relawan' and coalesce((data ->> 'status_aktif')::boolean, false) = true)
  or (collection = 'produk' and coalesce((data ->> 'is_active')::boolean, true) = true)
);

-- 2. Pastikan email admin Anda terdaftar di tabel admin agar memiliki izin CRUD penuh
-- Tambahkan email admin login Anda di bawah jika belum terdaftar:
insert into public.riksa_admins (email)
values 
  ('simplusewebproject@gmail.com'),
  ('tasikmalayariksa@gmail.com')
on conflict (email) do nothing;

-- 3. Masukkan 6 data produk budaya Sunda bawaan ke database Supabase
insert into public.riksa_documents (collection, id, data)
values
(
  'produk',
  'payung-geulis-tasik',
  '{
    "nama": "Payung Geulis Bordir Khas Tasikmalaya",
    "kategori": "Kerajinan & Kriya",
    "harga": 165000,
    "tipe_pesanan": "ready",
    "estimasi_po": "Ready Stock",
    "deskripsi": "Payung Geulis legendaris warisan budaya Sunda khas Sukapura Tasikmalaya. Dibuat dengan rangka bambu apus pilihan dan dilukis tangan oleh perajin tradisional dengan motif flora Parahyangan yang anggun.",
    "spesifikasi": "Bahan: Rangka Bambu Pilihan, Kain Katun & Kertas Kedap Air | Diameter: 65 cm | Pewarna: Cat lukis tangan tahan cuaca | Asal: Indihiang, Tasikmalaya",
    "foto": [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80"
    ],
    "foto_utama_index": 0,
    "is_active": true
  }'::jsonb
),
(
  'produk',
  'iket-sunda-makuta',
  '{
    "nama": "Iket Sunda Makuta Sinatria (Totopong Bordir Aksara)",
    "kategori": "Pakaian & Adat",
    "harga": 85000,
    "tipe_pesanan": "ready",
    "estimasi_po": "Ready Stock",
    "deskripsi": "Iket Sunda praktis model Makuta Sinatria dengan sentuhan bordir Aksara Sunda Kaganga yang sarat nilai filosofi kepemimpinan Sunda. Nyaman dipakai seharian untuk acara adat maupun gaya kasual.",
    "spesifikasi": "Bahan: Katun Primisima Adem & Lembut | Model: Makuta Sinatria Praktis Langsung Pakai | Aksara: Bordir Benang Emas | Ukuran: All Size (Tali Belakang Fleksibel)",
    "foto": [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=900&q=80"
    ],
    "foto_utama_index": 0,
    "is_active": true
  }'::jsonb
),
(
  'produk',
  'pangsi-sunda-salontreng',
  '{
    "nama": "Setelan Pangsi Sunda Salontreng & Celana Komprang",
    "kategori": "Pakaian & Adat",
    "harga": 220000,
    "tipe_pesanan": "po",
    "estimasi_po": "3-5 Hari Kerja",
    "deskripsi": "Busana adat Sunda pria khas Salontreng dengan kancing batok kelapa alami dan celana komprang yang longgar & sejuk. Cocok untuk upacara seren taun, latihan silat maenpo, maupun peringatan hari budaya.",
    "spesifikasi": "Bahan: Katun Twill Besway Premium Tebal & Adem | Kancing: Batok Kelapa Asli | Warna: Hitam Polos Tradisional | Pilihan Ukuran: M, L, XL, XXL",
    "foto": [
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"
    ],
    "foto_utama_index": 0,
    "is_active": true
  }'::jsonb
),
(
  'produk',
  'kujang-pajajaran-jati',
  '{
    "nama": "Kujang Pajajaran Mini Hiasan Kayu Jati Ukir",
    "kategori": "Pusaka & Hiasan",
    "harga": 180000,
    "tipe_pesanan": "ready",
    "estimasi_po": "Ready Stock",
    "deskripsi": "Replika artistik Kujang Ciung khas Pajajaran yang diukir dari kayu jati solid berurat indah. Dilengkapi dengan dudukan kayu berukir motif Megamendung, sangat anggun untuk pajangan meja kerja atau ruang tamu.",
    "spesifikasi": "Bahan: Kayu Jati Solid Finishing Natural Wax | Panjang Bilah: 28 cm | Termasuk: Stand / Dudukan Kayu Ukir Eksklusif",
    "foto": [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80"
    ],
    "foto_utama_index": 0,
    "is_active": true
  }'::jsonb
),
(
  'produk',
  'anyaman-mendong-tasik',
  '{
    "nama": "Tas Jinjing Anyaman Mendong Khas Rajapolah",
    "kategori": "Kerajinan & Kriya",
    "harga": 95000,
    "tipe_pesanan": "ready",
    "estimasi_po": "Ready Stock",
    "deskripsi": "Tas kriya ramah lingkungan dari serat rumput mendong alami Tasikmalaya. Dianyam dengan ketelitian tangan para pengerajin Rajapolah dengan kombinasi tali kulit sintetis yang modis & kuat.",
    "spesifikasi": "Bahan: 100% Rumput Mendong Kering Alami & Handle Faux Leather | Ukuran: 32 x 12 x 25 cm | Furing: Kain Blacu Dalaman dengan Resleting",
    "foto": [
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80"
    ],
    "foto_utama_index": 0,
    "is_active": true
  }'::jsonb
),
(
  'produk',
  'buku-aksara-kaganga',
  '{
    "nama": "Buku Pedoman Aksara Sunda Kaganga (Edisi Eksklusif)",
    "kategori": "Buku & Naskah",
    "harga": 75000,
    "tipe_pesanan": "po",
    "estimasi_po": "2-4 Hari Kerja",
    "deskripsi": "Buku panduan komprehensif pembelajaran Aksara Sunda Baku karya pegiat budaya RIKSA. Membahas fonologi, aturan ngalagena, rarangken, angka, hingga contoh alih aksara prasasti & naskah kuno.",
    "spesifikasi": "Penulis: Tim Riksa Budaya Sunda | Halaman: 168 Hal Bookpaper | Jilid: Hardcover Eksklusif Bertekstur Serat Bambu | ISBN: Resmi Terdaftar",
    "foto": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80"
    ],
    "foto_utama_index": 0,
    "is_active": true
  }'::jsonb
)
on conflict (collection, id) do update
set 
  data = excluded.data,
  updated_at = now();
