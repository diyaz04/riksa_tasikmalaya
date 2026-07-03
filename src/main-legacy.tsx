/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import "./index.css";
import { 
  db,
  auth,
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocFromServer,
  onSnapshot,
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  type User
} from "./lib/supabaseCompat";

// ============================================================================
// TYPE DECLARATIONS & SYSTEM DEFINITIONS
// ============================================================================

interface GeneralSettings {
  nama_org: string;
  tagline: string;
  visi: string;
  misi: string;
  sejarah: string;
  alamat: string;
  email: string;
  telp: string;
  instagram: string;
  youtube: string;
  logo_url?: string;
  hero_image_url: string;
  hero_overlay_color: string;
  hero_overlay_opacity: number;
  // Berita section
  berita_badge?: string;
  berita_judul?: string;
  berita_desc?: string;
  berita_tab_all?: string;
  berita_tab_new?: string;
  berita_btn_all?: string;
  // Galeri section
  galeri_badge?: string;
  galeri_judul?: string;
  galeri_desc?: string;
  galeri_kategori?: string[];
  // Konverter section
  konverter_badge?: string;
  konverter_judul?: string;
  konverter_desc?: string;
  konverter_label_input?: string;
  konverter_label_output?: string;
  konverter_tips?: string;
  // Hero extra
  hero_badge?: string;
  hero_subtitle?: string;
  hero_cta1?: string;
  hero_cta2?: string;
  hero_marquee?: string;
  profil_judul?: string;
  timeline?: any[];
  footer_desc?: string;
  footer_motto?: string;
  footer_copyright?: string;
  maps_embed?: string;
}

interface RecruitmentSettings {
  isActive: boolean;
  judul: string;
  deskripsi: string;
  divisi_tersedia: string[];
  kuota: number;
  tanggal_tutup: string;
}

interface StrukturOrganisasi {
  id: string;
  nama: string;
  jabatan: string;
  foto_url: string;
  urutan: number;
  divisi: string;
}

interface Berita {
  id: string;
  judul: string;
  slug: string;
  isi: string;
  thumbnail_url: string;
  tanggal: string;
  status: 'draft' | 'published';
  penulis: string;
}

interface Galeri {
  id: string;
  foto_url: string;
  judul: string;
  keterangan: string;
  kategori: string;
  urutan: number;
  isVisible: boolean;
  tanggal: string;
}

interface Relawan {
  id: string;
  nama: string;
  email: string;
  no_hp: string;
  divisi: string;
  status_aktif: boolean;
  foto_url: string;
  tanggal_bergabung: string;
}

interface PendaftarRelawan {
  id: string;
  nama: string;
  email: string;
  no_hp: string;
  usia: number;
  divisi_pilihan: string;
  motivasi: string;
  foto_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  tanggal_daftar: string;
}

// ============================================================================
// RICH INITIAL SEED DATA FOR PRODUCTION-READY EXPERIENCE (FALLBACKS)
// ============================================================================

const DEFAULT_GENERAL: GeneralSettings = {
  nama_org: "RIKSA (Riuangan Aksara Sunda)",
  tagline: "Melestarikan Aksara, Mengukuhkan Wibawa Budaya Parahyangan",
  visi: "Terwujudnya kedaulatan budaya Tatar Sunda di mana setiap generasi muda mampu membaca, menulis, sarta menghayati falsafah aksara leluhur demi martabat kebudayaan nusantara.",
  misi: "1. Menyelenggarakan pawiyatan (kelas ngulik) baca-tulis aksara Sunda kuno secara gratis.\n2. Mengadakan digitalisasi sarta alih-aksara naskah-naskah lontar peninggalan Parahyangan.\n3. Berkolaborasi dengan sekolah sarta perguruan tinggi untuk membiasakan aksara Sunda baku.\n4. Merancang inovasi tipografi sarta digitalisasi aksara Sunda agar dapat digunakan di gawai moderen.",
  sejarah: "Riuangan Aksara Sunda (RIKSA) bermula dari sarasehan kecil para pegiat naskah klasik sarta mahasiswa sastra Sunda di Bandung pada tahun 2021. Kami mufakat mendirikan wadah pelestarian aksara Sunda karena prihatin atas derasnya moderenisasi yang mengikis kebanggaan generasi muda terhadap tulisan leluhur mereka. Hingga kini, RIKSA telah membina ratusan relawan sarta dipercaya menyelenggarakan berbagai lokakarya berskala nasional.",
  alamat: "Jl. Sunda No. 12, Panyawangan, Kota Bandung, Jawa Barat - 40112",
  email: "kontak@riksa.or.id",
  telp: "+62 822 1919 4545",
  instagram: "https://instagram.com/riksa.aksara",
  youtube: "https://youtube.com/c/RiuanganAksaraSunda",
  logo_url: "",
  hero_image_url: "",
  hero_overlay_color: "#3b1f0a",
  hero_overlay_opacity: 0,
};

const DEFAULT_RECRUITMENT: RecruitmentSettings = {
  isActive: true,
  judul: "Rekrutmen Relawan Budaya RIKSA Gelombang V",
  deskripsi: "Riuangan Aksara Sunda (RIKSA) kembali memanggil putra-putri parahyangan, mahasiswa, sarta peminat budaya adat untuk bergabung menjadi agen pelestari aksara sarta sastra klasik Sunda. Melalui rekrutmen ini, Anda akan dipersiapkan menjadi fasilitator edukasi masyarakat.",
  divisi_tersedia: ["Pengajar Pawiyatan", "Digitalisasi Naskah", "Dokumentasi & Media", "Hubungan Masyarakat"],
  kuota: 25,
  tanggal_tutup: "2026-08-31"
};

const DEFAULT_STRUKTUR: StrukturOrganisasi[] = [
  {
    id: "s1",
    nama: "Ki Ginanjar Sasmita, M.Hum",
    jabatan: "Ketua Umum / Pangulu Agung",
    foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    urutan: 1,
    divisi: "BPH"
  },
  {
    id: "s2",
    nama: "Ambu Neng Rina Kartika",
    jabatan: "Wakil Ketua / Pangaping",
    foto_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    urutan: 2,
    divisi: "BPH"
  },
  {
    id: "s3",
    nama: "Kang Deden Kurniawan",
    jabatan: "Sekretaris / Juru Tulis",
    foto_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    urutan: 3,
    divisi: "BPH"
  },
  {
    id: "s4",
    nama: "Teh Shinta Handayani",
    jabatan: "Bendahara / Juru Simpen",
    foto_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    urutan: 4,
    divisi: "BPH"
  },
  {
    id: "s5",
    nama: "Asep Sunandar, S.S.",
    jabatan: "Kepala Divisi Edukasi",
    foto_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    urutan: 5,
    divisi: "Edukasi"
  },
  {
    id: "s6",
    nama: "Ningrat Wulandari",
    jabatan: "Kepala Divisi Filologi & Arsip",
    foto_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
    urutan: 6,
    divisi: "Arsip"
  },
  {
    id: "s7",
    nama: "Galih Rakasiwi",
    jabatan: "Kepala Divisi Hubungan Masyarakat",
    foto_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    urutan: 7,
    divisi: "Humas"
  },
  {
    id: "s8",
    nama: "Maulana Sandi, S.Kom",
    jabatan: "Kepala Divisi Media Kreatif",
    foto_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    urutan: 8,
    divisi: "Media"
  }
];

const DEFAULT_NEWS: Berita[] = [
  {
    id: "n1",
    judul: "Pasanggiri Maca Aksara Sunda Kuno sa-Jawa Barat Sukses Digelar",
    slug: "pasanggiri-maca-aksara-sunda-kuno",
    isi: "Dalam rangka memperingati Hari Bahasa Ibu Internasional, RIKSA berkolaborasi dengan Pemprov Jawa Barat menyelenggarakan festival kebudayaan bertajuk Pasanggiri Maca Aksara Sunda Kuno tingkat remaja. Diikuti oleh lebih dari 150 peserta dari berbagai kabupaten, festival ini bertujuan mengevaluasi pemahaman literatur klasik sekaligus menumbuhkan kecintaan generasi Z terhadap prasasti kuno Parahyangan.",
    thumbnail_url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=500",
    tanggal: "2026-05-18",
    status: "published",
    penulis: "Humas RIKSA"
  },
  {
    id: "n2",
    judul: "Mengenal Jenis-Jenis Rarangken dalam Aksara Sunda Baku",
    slug: "jenis-rarangken-aksara-sunda",
    isi: "Aksara Sunda Baku tidak sekadar deretan vokal dan konsonan mandiri. Karakteristik paling vital terletak pada Rarangken (vokalisasi/penanda bunyi), yaitu vokalisasi khusus yang dipasang di atas, di bawah, atau sejajar dengan aksara ngalagena. Terdapat 13 rarangken yang dibagi menjadi tiga kelompok fungsional berdasarkan posisi penulisan. Mari kita pelajari metode penggunaannya demi ketrampilan literasi aksara Sunda yang baku sarta sesuai kaidah.",
    thumbnail_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=500",
    tanggal: "2026-04-10",
    status: "published",
    penulis: "Divisi Edukasi"
  },
  {
    id: "n3",
    judul: "Penyelamatan naskah lontar abad ke-16 di kawasan Garut Selatan",
    slug: "penyelamatan-naskah-lontar-garut",
    isi: "Divisi Filologi RIKSA bersama arkeolog setempat berhasil merestorasi serta mendokumentasikan 5 jilid naskah rontal kuno peninggalan era Pajajaran akhir di Garut Selatan. Naskah yang kondisinya lapuk tersebut memuat informasi penting mengenai tata kelola air tradisional, astronomi parahyangan, sarta ajaran silih asih leluhur Sunda kuno.",
    thumbnail_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=500",
    tanggal: "2026-03-22",
    status: "published",
    penulis: "Arsip Filologi"
  }
];

const DEFAULT_GALLERY: Galeri[] = [
  {
    id: "g1",
    foto_url: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=500",
    judul: "Lokakarya Pengenalan Aksara Sunda Baku",
    keterangan: "Kegiatan kelas ngulik rutin mingguan gratis yang diselenggarakan RIKSA untuk anak-anak sekolah dasar di Kota Bandung.",
    kategori: "Edukasi",
    urutan: 1,
    isVisible: true,
    tanggal: "2026-05-15"
  },
  {
    id: "g2",
    foto_url: "https://images.unsplash.com/photo-1464979681340-bdd28a61699e?auto=format&fit=crop&q=80&w=500",
    judul: "Kemah Bakti Adat Cipageran",
    keterangan: "Para relawan berkumpul sarta bermalam di alam bebas guna menghayati sastra klasik sarta filosofi kesundaan.",
    kategori: "Kemah Bakti",
    urutan: 2,
    isVisible: true,
    tanggal: "2026-05-02"
  },
  {
    id: "g3",
    foto_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=500",
    judul: "Pementasan Tarawangsa di Riksa",
    keterangan: "Seni musik sakral leluhur Sunda tarawangsa dimainkan hikmat pada pembukaan program pengajaran baru.",
    kategori: "Budaya",
    urutan: 3,
    isVisible: true,
    tanggal: "2026-04-18"
  },
  {
    id: "g4",
    foto_url: "https://images.unsplash.com/photo-1531243179051-56858917812b?auto=format&fit=crop&q=80&w=500",
    judul: "Lomba Maca Naskah Palem Kuno",
    keterangan: "Pasanggiri membaca aksara kuno antarpelajar SMA guna membangkitkan kompetensi filologi sejak dini.",
    kategori: "Pasanggiri",
    urutan: 4,
    isVisible: true,
    tanggal: "2026-03-05"
  }
];

const DEFAULT_RELAWAN: Relawan[] = [
  {
    id: "r1",
    nama: "Ganjar Ginanjar",
    email: "ganjar@gmail.com",
    no_hp: "081234567890",
    divisi: "Pengajar Pawiyatan",
    status_aktif: true,
    foto_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    tanggal_bergabung: "2025-01-10"
  },
  {
    id: "r2",
    nama: "Neng Widia Astuti",
    email: "widia@gmail.com",
    no_hp: "085721889922",
    divisi: "Digitalisasi Naskah",
    status_aktif: true,
    foto_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200",
    tanggal_bergabung: "2025-03-12"
  },
  {
    id: "r3",
    nama: "Ujang Permana",
    email: "ujangp@gmail.com",
    no_hp: "089678119932",
    divisi: "Hubungan Masyarakat",
    status_aktif: true,
    foto_url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200",
    tanggal_bergabung: "2025-06-25"
  },
  {
    id: "r4",
    nama: "Siti Nurhaliza",
    email: "sitinur@gmail.com",
    no_hp: "082315159090",
    divisi: "Dokumentasi & Media",
    status_aktif: true,
    foto_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    tanggal_bergabung: "2025-09-02"
  }
];

// ============================================================================
// SYSTEM STATE ENGINE (DATABASE CONTROLLER)
// ============================================================================

// ============================================================================
// SYSTEM STATE ENGINE (DATABASE CONTROLLER) & SUPABASE HANDLERS
// ============================================================================

export enum OperationType {
  GET = 'GET',
  WRITE = 'WRITE',
}

export interface SupabaseErrorInfo {
  error: string;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: {
      providerId: string;
      email?: string | null;
    }[];
  }
  operationType: OperationType;
  path: string | null;
}

function handleSupabaseError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: SupabaseErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Supabase Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

class RiksaStore {
  general: GeneralSettings;
  recruitment: RecruitmentSettings;
  news: Berita[];
  gallery: Galeri[];
  volunteers: Relawan[];
  applicants: PendaftarRelawan[];

  dbAvailable = false;
  adminUser: User | null = null;

  constructor() {
    // JANGAN load dari localStorage — Supabase adalah sumber kebenaran tunggal
    // Gunakan DEFAULT sampai Supabase berhasil dimuat
    this.general = { ...DEFAULT_GENERAL };
    this.recruitment = { ...DEFAULT_RECRUITMENT };
    this.news = []; // tidak pakai localStorage — selalu load fresh dari Supabase
    this.gallery = []; // tidak pakai localStorage — selalu load fresh dari Supabase
    this.volunteers = []; // tidak pakai localStorage — selalu load fresh dari Supabase
    this.applicants = [];

    // Supabase Auth listener
    onAuthStateChanged(auth, (user) => {
      this.adminUser = user;
      const isAdminUser = user?.email === "simplusewebproject@gmail.com";

      const badgeLive = document.getElementById("db-live-auth-badge");
      if (badgeLive) {
        if (isAdminUser) {
          badgeLive.innerHTML = `● Sesi Admin: <strong class="text-emerald-600">${user?.email}</strong>`;
        } else if (user) {
          badgeLive.innerHTML = `● Terhubung: <span class="text-amber-600 font-medium">${user?.email}</span> (Simulasi)`;
        } else {
          badgeLive.innerHTML = `● Mode Simulasi (Belum Terhubung)`;
        }
      }

      this.loadFromSupabase();
    });
  }

  private loadItem<T>(_key: string, defaultValue: T): T {
    // Tidak lagi menggunakan localStorage — Supabase adalah sumber kebenaran
    return defaultValue;
  }

  save() {
    // Data disimpan ke Supabase, bukan localStorage
    // Method ini dipertahankan untuk kompatibilitas tapi tidak menyimpan ke localStorage
  }

  async loadFromSupabase() {
    try {
      await getDocFromServer(doc(db, "settings", "general"));
      this.dbAvailable = true;

      const warningBanner = document.getElementById("db-warning-banner");
      if (warningBanner) {
        warningBanner.classList.add("hidden");
      }

      // 1. General Profile
      const genRef = doc(db, "settings", "general");
      const genSnap = await getDoc(genRef);
      if (genSnap.exists()) {
        this.general = genSnap.data() as GeneralSettings;
      } else {
        if (this.adminUser) await setDoc(genRef, DEFAULT_GENERAL);
        this.general = DEFAULT_GENERAL;
      }

      // 2. Recruitment
      const recRef = doc(db, "settings", "recruitment");
      const recSnap = await getDoc(recRef);
      if (recSnap.exists()) {
        this.recruitment = {
          ...DEFAULT_RECRUITMENT,
          ...recSnap.data()
        } as RecruitmentSettings;
      } else {
        if (this.adminUser) await setDoc(recRef, DEFAULT_RECRUITMENT);
        this.recruitment = DEFAULT_RECRUITMENT;
      }

      const isAdminUser = this.adminUser?.email === "simplusewebproject@gmail.com";

      // 3. News / Berita
      try {
        let newsSnap;
        if (!isAdminUser) {
          const q = query(collection(db, "berita"), where("status", "==", "published"));
          newsSnap = await getDocs(q);
        } else {
          newsSnap = await getDocs(collection(db, "berita"));
        }

        const list: Berita[] = [];
        newsSnap.forEach(snap => {
          list.push({ id: snap.id, ...snap.data() } as Berita);
        });
        list.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
        this.news = list; // kosong jika memang belum ada konten
      } catch (err) {
        console.warn("Berita loading limited:", err);
      }

      // 4. Galeri
      try {
        let galSnap;
        if (!isAdminUser) {
          const q = query(collection(db, "galeri"), where("isVisible", "==", true));
          galSnap = await getDocs(q);
        } else {
          galSnap = await getDocs(collection(db, "galeri"));
        }

        const list: Galeri[] = [];
        galSnap.forEach(snap => {
          list.push({ id: snap.id, ...snap.data() } as Galeri);
        });
        list.sort((a,b) => a.urutan - b.urutan);
        this.gallery = list; // kosong jika memang belum ada konten
      } catch (err) {
        console.warn("Galeri loading limited:", err);
      }

      // 5. Relawan
      try {
        const volSnap = await getDocs(collection(db, "relawan"));
        const list: Relawan[] = [];
        volSnap.forEach(snap => {
          list.push({ id: snap.id, ...snap.data() } as Relawan);
        });
        list.sort((a,b) => new Date(b.tanggal_bergabung).getTime() - new Date(a.tanggal_bergabung).getTime());
        this.volunteers = list; // kosong jika belum ada relawan
      } catch (err) {
        console.warn("Relawan loading error:", err);
      }

      // 6. Applicants / Pendaftar
      if (isAdminUser) {
        try {
          const appSnap = await getDocs(collection(db, "pendaftar_relawan"));
          const list: PendaftarRelawan[] = [];
          appSnap.forEach(snap => {
            list.push({ id: snap.id, ...snap.data() } as PendaftarRelawan);
          });
          list.sort((a,b) => new Date(b.tanggal_daftar).getTime() - new Date(a.tanggal_daftar).getTime());
          this.applicants = list;
        } catch (err) {
          console.warn("Applicants blocked on non-admin:", err);
        }
      }

      // Data sudah tersimpan di Supabase, tidak perlu cache lokal

      // Sync widgets
      renderBeranda();
      renderBerita();
      renderGaleri();
      renderRelawan();
      renderAdmin();
    } catch (err) {
      console.warn("Supabase connection check bypassed. Fallbacks active.", err);
    }
  }
}

const store = new RiksaStore();

// ============================================================================
// AKSARA SUNDANESE TRANSLITERATION ENGINE
// ============================================================================

interface KeyboardChar {
  label: string;
  aksara: string;
  latin: string;
}

const CONSTS_CONSONANTS: KeyboardChar[] = [
  // Aksara Ngalagena (konsonan) — sesuai Unicode Sundanese block & Tabél Aksara Sunda
  { label: "Ka / ᮊ", aksara: "ᮊ", latin: "ka" },   // U+1B8A
  { label: "Ga / ᮌ", aksara: "ᮌ", latin: "ga" },   // U+1B8C
  { label: "Nga / ᮍ", aksara: "ᮍ", latin: "nga" }, // U+1B8D
  { label: "Ca / ᮎ", aksara: "ᮎ", latin: "ca" },   // U+1B8E
  { label: "Ja / ᮏ", aksara: "ᮏ", latin: "ja" },   // U+1B8F
  { label: "Nya / ᮑ", aksara: "ᮑ", latin: "nya" }, // U+1B91 (bukan ᮐ/U+1B90 yg adalah Za)
  { label: "Ta / ᮒ", aksara: "ᮒ", latin: "ta" },   // U+1B92
  { label: "Da / ᮓ", aksara: "ᮓ", latin: "da" },   // U+1B93
  { label: "Na / ᮔ", aksara: "ᮔ", latin: "na" },   // U+1B94
  { label: "Pa / ᮕ", aksara: "ᮕ", latin: "pa" },   // U+1B95
  { label: "Ba / ᮘ", aksara: "ᮘ", latin: "ba" },   // U+1B98
  { label: "Ma / ᮙ", aksara: "ᮙ", latin: "ma" },   // U+1B99
  { label: "Ya / ᮚ", aksara: "ᮚ", latin: "ya" },   // U+1B9A
  { label: "Ra / ᮛ", aksara: "ᮛ", latin: "ra" },   // U+1B9B
  { label: "La / ᮜ", aksara: "ᮜ", latin: "la" },   // U+1B9C
  { label: "Wa / ᮝ", aksara: "ᮝ", latin: "wa" },   // U+1B9D
  { label: "Sa / ᮞ", aksara: "ᮞ", latin: "sa" },   // U+1B9E
  { label: "Ha / ᮠ", aksara: "ᮠ", latin: "ha" },   // U+1BA0
  { label: "Fa / ᮖ", aksara: "ᮖ", latin: "fa" },   // U+1B96
  { label: "Qa / ᮋ", aksara: "ᮋ", latin: "qa" },   // U+1B8B
  { label: "Va / ᮗ", aksara: "ᮗ", latin: "va" },   // U+1B97
  { label: "Xa / ᮟ", aksara: "ᮟ", latin: "xa" },   // U+1B9F
  { label: "Za / ᮐ", aksara: "ᮐ", latin: "za" },   // U+1B90
  // Aksara Swara (vokal mandiri)
  { label: "A / ᮃ", aksara: "ᮃ", latin: "a" },     // U+1B83
  { label: "I / ᮄ", aksara: "ᮄ", latin: "i" },     // U+1B84
  { label: "U / ᮅ", aksara: "ᮅ", latin: "u" },     // U+1B85
  { label: "É / ᮆ", aksara: "ᮆ", latin: "é" },     // U+1B86
  { label: "O / ᮇ", aksara: "ᮇ", latin: "o" },     // U+1B87
  { label: "E / ᮈ", aksara: "ᮈ", latin: "e" },     // U+1B88
  { label: "Eu / ᮉ", aksara: "ᮉ", latin: "eu" }    // U+1B89
];

const MODIFIERS_RARANGKEN: KeyboardChar[] = [
  // Nu ditulis di luhureun (di atas)
  { label: "Panghulu (+i / ᮤ)", aksara: "ᮤ", latin: "i" },       // U+1BA4
  { label: "Pamepet (+e / ᮨ)", aksara: "ᮨ", latin: "e" },         // U+1BA8
  { label: "Paneuleung (+eu / ᮩ)", aksara: "ᮩ", latin: "eu" },   // U+1BA9
  { label: "Panglayar (+r / ᮁ)", aksara: "ᮁ", latin: "r" },       // U+1B81 (bukan ᮦ!)
  { label: "Panyecek (+ng / ᮀ)", aksara: "ᮀ", latin: "ng" },     // U+1B80
  // Nu ditulis di handapeun (di bawah)
  { label: "Panyuku (+u / ᮥ)", aksara: "ᮥ", latin: "u" },         // U+1BA5
  { label: "Panyiku (+la / ᮣ)", aksara: "ᮣ", latin: "la" },       // U+1BA3
  { label: "Panyakra (+ra / ᮢ)", aksara: "ᮢ", latin: "ra" },     // U+1BA2
  // Nu ditulis sajajar (sejajar)
  { label: "Panéléng (+é / ᮦ)", aksara: "ᮦ", latin: "é" },       // U+1BA6
  { label: "Panolong (+o / ᮧ)", aksara: "ᮧ", latin: "o" },       // U+1BA7
  { label: "Pamingkal (+ya / ᮡ)", aksara: "ᮡ", latin: "ya" },   // U+1BA1
  { label: "Pangwisad (+h / ᮂ)", aksara: "ᮂ", latin: "h" },     // U+1B82
  { label: "Pamaéh (Mati / ᮪)", aksara: "᮪", latin: "" },         // U+1BAA
];

const LATIN_MAP: { [key: string]: string } = {
  // Aksara Ngalagena — sesuai Tabél Aksara Sunda & Unicode
  "ka": "ᮊ", "ga": "ᮌ", "nga": "ᮍ",
  "ca": "ᮎ", "ja": "ᮏ", "nya": "ᮑ",  // nya=U+1B91, bukan U+1B90 (za)
  "ta": "ᮒ", "da": "ᮓ", "na": "ᮔ",
  "pa": "ᮕ", "ba": "ᮘ", "ma": "ᮙ",
  "ya": "ᮚ", "ra": "ᮛ", "la": "ᮜ", "wa": "ᮝ", "sa": "ᮞ", "ha": "ᮠ",
  "fa": "ᮖ", "qa": "ᮋ", "va": "ᮗ", "xa": "ᮟ", "za": "ᮐ",
  // Aksara Swara
  "a": "ᮃ", "i": "ᮄ", "u": "ᮅ", "é": "ᮆ", "o": "ᮇ", "e": "ᮈ", "eu": "ᮉ"
};

// Transliterasi Latin ke Aksara Sunda sesuai Tabél Aksara Sunda baku
function translateLatinToSunda(text: string): { aksara: string; latinRepr: string } {
  if (!text) return { aksara: "", latinRepr: "" };

  let result = "";
  let latinRepr: string[] = [];
  // Pertahankan é; buang karakter selain a-z, é, spasi
  const clean = text.toLowerCase().trim().replace(/[^a-zé ]/g, "");
  const words = clean.split(" ");

  // Rarangken vokal untuk konsonan + vokal non-'a'
  const RARANGKEN_VOWEL: { [v: string]: string } = {
    "i": "ᮤ",  // Panghulu  U+1BA4
    "u": "ᮥ",  // Panyuku   U+1BA5
    "é": "ᮦ",  // Panéléng  U+1BA6
    "o": "ᮧ",  // Panolong  U+1BA7
    "e": "ᮨ",  // Pamepet   U+1BA8
    // "eu" ditangani khusus (2 karakter → Paneuleung ᮩ U+1BA9)
  };

  const VOWELS = "aiueoé";

  // Helper: apakah karakter adalah vokal?
  const isVowel = (c: string) => c !== undefined && VOWELS.includes(c);

  // Helper: apakah 'ng' di posisi idx adalah coda (bukan onset)?
  // Coda jika setelah 'g' tidak ada vokal (atau akhir kata)
  const isNgCoda = (w: string, idx: number): boolean => {
    if (idx + 1 >= w.length || w[idx + 1] !== "g") return false;
    const afterG = w[idx + 2];
    return afterG === undefined || !isVowel(afterG);
  };

  for (const word of words) {
    if (!word) continue;
    let index = 0;

    while (index < word.length) {

      // ══ Periksa "ng" coda dulu (Panyecek ᮀ U+1B80) ══
      // Sebelum mencoba membaca 'n' sebagai konsonan biasa
      if (word[index] === "n" && isNgCoda(word, index)) {
        result += "ᮀ"; // Panyecek
        latinRepr.push("ng[panyecek]");
        index += 2; continue;
      }

      // ══ 3-karakter: "nga", "nya", konsonan+"eu" ══
      if (index + 3 <= word.length) {
        const c3 = word.substring(index, index + 3);

        // "nga" — pastikan bukan coda 'ng' + 'a' (ng-coda sudah ditangani di atas)
        if (c3 === "nga") {
          // nga diikuti "eu" -> ngeu
          if (index + 5 <= word.length && word.substring(index + 3, index + 5) === "eu") {
            result += "ᮍᮩ"; latinRepr.push("ngeu"); index += 5; continue;
          }
          // nga diikuti vokal non-'a'
          const nv = word[index + 3];
          if (nv && RARANGKEN_VOWEL[nv]) {
            result += "ᮍ" + RARANGKEN_VOWEL[nv]; latinRepr.push("ng" + nv); index += 4; continue;
          }
          result += "ᮍ"; latinRepr.push("nga"); index += 3; continue;
        }

        // "nya"
        if (c3 === "nya") {
          if (index + 5 <= word.length && word.substring(index + 3, index + 5) === "eu") {
            result += "ᮑᮩ"; latinRepr.push("nyeu"); index += 5; continue;
          }
          const nv = word[index + 3];
          if (nv && RARANGKEN_VOWEL[nv]) {
            result += "ᮑ" + RARANGKEN_VOWEL[nv]; latinRepr.push("ny" + nv); index += 4; continue;
          }
          result += "ᮑ"; latinRepr.push("nya"); index += 3; continue;
        }

        // Konsonan tunggal + "eu" (e.g. "keu", "beu", "seu")
        if (c3.substring(1) === "eu" && LATIN_MAP[c3[0] + "a"]) {
          result += LATIN_MAP[c3[0] + "a"] + "ᮩ"; // + Paneuleung U+1BA9
          latinRepr.push(c3[0] + "eu"); index += 3; continue;
        }
      }

      // ══ 2-karakter ══
      if (index + 2 <= word.length) {
        const c2 = word.substring(index, index + 2);

        // "eu" vokal mandiri
        if (c2 === "eu") {
          result += "ᮉ"; latinRepr.push("eu"); index += 2; continue;
        }

        // Suku kata konsonan+'a': ka, ga, ra, ba, sa, ...
        if (LATIN_MAP[c2]) {
          result += LATIN_MAP[c2]; latinRepr.push(c2); index += 2; continue;
        }

        // Konsonan + vokal non-'a': ki, ku, ke, ko, ké
        const con = c2[0], vow = c2[1];
        if (LATIN_MAP[con + "a"] && RARANGKEN_VOWEL[vow]) {
          result += LATIN_MAP[con + "a"] + RARANGKEN_VOWEL[vow];
          latinRepr.push(con + vow); index += 2; continue;
        }
      }

      // ══ Karakter tunggal ══
      const char = word[index];

      // Vokal mandiri: a, i, u, é, o, e
      if (LATIN_MAP[char]) {
        result += LATIN_MAP[char]; latinRepr.push(char); index += 1; continue;
      }

      // Konsonan mati (coda) → Pamaéh ᮪ (U+1BAA)
      // Khusus: 'r' coda → Panglayar ᮁ (U+1B81)
      if (LATIN_MAP[char + "a"]) {
        if (char === "r") {
          result += "ᮁ"; // Panglayar U+1B81
          latinRepr.push("r[panglayar]"); index += 1; continue;
        }
        result += LATIN_MAP[char + "a"] + "᮪"; // Pamaéh U+1BAA
        latinRepr.push(char + "[pamaéh]"); index += 1; continue;
      }

      // Karakter tidak dikenal, lewati
      index++;
    }

    result += " ";
    latinRepr.push(" ");
  }

  return {
    aksara: result.trim(),
    latinRepr: latinRepr.join("-").replace(/- -/g, " | ")
  };
}


// ============================================================================
// REVERSE ENGINE: Aksara Sunda Unicode -> Latin
// ============================================================================

const CONSONANT_BASE: { [k: string]: string } = {
  "ᮊ": "k",  "ᮋ": "q",  "ᮌ": "g",  "ᮍ": "ng", "ᮎ": "c",  "ᮏ": "j",
  "ᮐ": "z",  "ᮑ": "ny", "ᮒ": "t",  "ᮓ": "d",  "ᮔ": "n",  "ᮕ": "p",
  "ᮖ": "f",  "ᮗ": "v",  "ᮘ": "b",  "ᮙ": "m",  "ᮚ": "y",  "ᮛ": "r",
  "ᮜ": "l",  "ᮝ": "w",  "ᮞ": "s",  "ᮟ": "x",  "ᮠ": "h",
};

const SWARA: { [k: string]: string } = {
  "ᮃ": "a", "ᮄ": "i", "ᮅ": "u", "ᮆ": "é", "ᮇ": "o", "ᮈ": "e", "ᮉ": "eu",
};

const VOWEL_MODIFIER: { [k: string]: string } = {
  "ᮤ": "i",   // Panghulu
  "ᮥ": "u",   // Panyuku
  "ᮦ": "é",   // Panelaeng
  "ᮧ": "o",   // Panolong
  "ᮨ": "e",   // Pamepet
  "ᮩ": "eu",  // Paneuleung
};

const CODA_MAP: { [k: string]: string } = {
  "ᮀ": "ng", // Panyecek
  "ᮁ": "r",  // Panglayar
  "ᮂ": "h",  // Pangwisad
};

const CONSONANT_SUB: { [k: string]: string } = {
  "ᮡ": "ya", // Pamingkal
  "ᮢ": "ra", // Panyakra
  "ᮣ": "la", // Panyiku
};

function translateSundaToLatin(text: string): string {
  if (!text) return "";
  let result = "";
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === " " || ".,;:!?-\"'()[]".includes(c)) {
      result += c; i++; continue;
    }
    if (SWARA[c]) {
      result += SWARA[c]; i++; continue;
    }
    if (CONSONANT_BASE[c]) {
      const base = CONSONANT_BASE[c];
      let vowel = "a";
      i++;
      if (i < text.length) {
        const nxt = text[i];
        if (VOWEL_MODIFIER[nxt]) {
          vowel = VOWEL_MODIFIER[nxt]; i++;
        } else if (nxt === "᮪") {
          vowel = ""; i++;
        }
      }
      result += base + vowel;
      if (i < text.length && CONSONANT_SUB[text[i]]) {
        result += CONSONANT_SUB[text[i]]; i++;
      }
      if (i < text.length && CODA_MAP[text[i]]) {
        result += CODA_MAP[text[i]]; i++;
      }
      continue;
    }
    if (CODA_MAP[c]) { result += CODA_MAP[c]; i++; continue; }
    if (CONSONANT_SUB[c]) { result += CONSONANT_SUB[c]; i++; continue; }
    if (c === "᮪") { i++; continue; }
    i++;
  }
  return result.trim();
}

// ============================================================================
// UI MAIN RENDER COMPONENT CONTROLLERS
// ============================================================================

// Global Toast System helper
function showToast(message: string, isSuccess = true) {
  const customToast = document.getElementById("custom-toast") as HTMLDivElement;
  const toastMessage = document.getElementById("toast-message") as HTMLSpanElement;
  const toastIcon = document.getElementById("toast-icon") as HTMLDivElement;

  if (customToast && toastMessage && toastIcon) {
    toastMessage.textContent = message;
    
    // Customize icon based on state
    if (isSuccess) {
      toastIcon.innerHTML = `<svg class="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else {
      toastIcon.innerHTML = `<svg class="h-5 w-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
    }

    customToast.classList.add("show");
    setTimeout(() => {
      customToast.classList.remove("show");
    }, 4000);
  }
}

// 1. POPULATE & RENDER BERANDA (HOME)
function renderBeranda() {
  const g = store.general as any;

  // Hero section texts
  const gTagline = document.getElementById("general-tagline");
  const gVisi = document.getElementById("general-visi");
  const gMisi = document.getElementById("general-misi");
  const gSejarah = document.getElementById("general-sejarah");

  if (gTagline) gTagline.textContent = g.tagline || "⚠️ Tagline belum diatur — silakan isi di Dashboard → Pengaturan Umum";
  if (gVisi) gVisi.textContent = g.visi || "⚠️ Visi organisasi belum diatur.";
  if (gMisi) {
    const lines = (g.misi || "").split("\n").filter((l: string) => l.trim() !== "");
    gMisi.innerHTML = lines.length > 0
      ? lines.map((line: string) => `<p class="leading-relaxed">${line}</p>`).join("")
      : `<p class="text-gray-400 italic text-xs">⚠️ Misi organisasi belum diatur — isi di Dashboard → Pengaturan Umum.</p>`;
  }
  if (gSejarah) gSejarah.textContent = g.sejarah || "⚠️ Sejarah organisasi belum diatur.";

  // Hero badge / sapaan
  const heroBadgeEl = document.querySelector("#sec-beranda .animate-pulse-once");
  if (heroBadgeEl && g.hero_badge) heroBadgeEl.textContent = g.hero_badge;

  // Hero subtitle (h3 "Riuangan Aksara Sunda" below RIKSA title)
  const heroSubtitleEl = document.querySelector("#sec-beranda h3.font-serif");
  if (heroSubtitleEl && g.hero_subtitle) heroSubtitleEl.textContent = g.hero_subtitle;

  // Hero CTA buttons
  const heroCta1El = document.querySelector("#sec-beranda button[data-goto='profil']");
  if (heroCta1El && g.hero_cta1) heroCta1El.textContent = g.hero_cta1;
  const heroCta2El = document.querySelector("#sec-beranda button[data-goto='konverter']");
  if (heroCta2El && g.hero_cta2) heroCta2El.textContent = g.hero_cta2;

  // Marquee / running text — update Latin text spans inside animate-marquee (top bar)
  if (g.hero_marquee) {
    document.querySelectorAll(".animate-marquee").forEach((marqueeDiv: Element) => {
      // Spans: [0]=aksara, [1]=latin-main, [2]=aksara-riksa, [3]=latin-riksa
      const spans = Array.from(marqueeDiv.querySelectorAll("span")).filter(
        (s: Element) => !s.classList.contains("aksara-sunda")
      );
      if (spans[0]) spans[0].textContent = g.hero_marquee;
    });
  }

  // Logo website (navbar + footer)
  if (g.logo_url) {
    const logoImgs = document.querySelectorAll<HTMLImageElement>(".site-logo-img");
    logoImgs.forEach(img => {
      img.src = g.logo_url!;
      img.style.display = "block";
      img.onload = () => {
        const fallback = img.parentElement?.querySelector(".site-logo-fallback") as HTMLElement | null;
        if (fallback) fallback.style.display = "none";
      };
      img.onerror = () => {
        img.style.display = "none";
        const fallback = img.parentElement?.querySelector(".site-logo-fallback") as HTMLElement | null;
        if (fallback) fallback.style.display = "";
      };
    });
  }

  // Contact info - both footer and kontak section
  const fAlamat = document.getElementById("footer-alamat");
  const fAlamatSec = document.getElementById("footer-alamat-sec");
  const fEmail = document.getElementById("footer-email") as HTMLAnchorElement;
  const fTelp = document.getElementById("footer-telp");
  const fTelpSec = document.getElementById("footer-telp-sec");
  const fInstagramSec = document.getElementById("footer-instagram-sec") as HTMLAnchorElement;
  const fYoutubeSec = document.getElementById("footer-youtube-sec") as HTMLAnchorElement;

  if (fAlamat) fAlamat.textContent = g.alamat || "—";
  if (fAlamatSec) fAlamatSec.textContent = g.alamat || "—";
  if (fEmail) { fEmail.textContent = g.email || "—"; fEmail.href = g.email ? `mailto:${g.email}` : "#"; }
  if (fTelp) fTelp.textContent = g.telp || "—";
  if (fTelpSec) fTelpSec.textContent = g.telp || "—";
  if (fInstagramSec && g.instagram) fInstagramSec.href = g.instagram;
  if (fYoutubeSec && g.youtube) fYoutubeSec.href = g.youtube;

  // Maps embed
  const mapIframe = document.querySelector("#sec-kontak iframe") as HTMLIFrameElement;
  if (mapIframe && g.maps_embed) mapIframe.src = g.maps_embed;

  // Footer texts
  const footerDescEl = document.querySelector("footer .text-stone-400.leading-relaxed.text-justify");
  if (footerDescEl && g.footer_desc) footerDescEl.textContent = g.footer_desc;

  // Footer copyright
  const copyrightEls = document.querySelectorAll("footer p");
  copyrightEls.forEach((el) => {
    if (el.textContent && el.textContent.includes("RIKSA") && el.textContent.includes("©") && g.footer_copyright) {
      el.textContent = g.footer_copyright;
    }
  });

  // Timeline (sejarah section)
  if (g.timeline && Array.isArray(g.timeline)) {
    const timelineContainer = document.querySelector("#tab-content-sejarah .space-y-6.pt-4.border-t");
    if (timelineContainer) {
      timelineContainer.innerHTML = g.timeline.map((item: any) => `
        <div class="flex gap-4">
          <div class="font-extrabold font-serif text-[var(--color-primary)] w-12 text-right">${item.tahun}</div>
          <div class="border-l-2 border-[var(--color-gold)] pl-4">
            <h4 class="font-bold font-serif mb-0.5">${item.judul}</h4>
            <p class="text-gray-500 text-xxs">${item.deskripsi}</p>
          </div>
        </div>
      `).join("");
    }
  }

  // ─── SECTION BERITA header ───
  const beritaBadgeEl = document.querySelector("#sec-berita .text-xxs.font-bold.uppercase");
  const beritaJudulEl = document.querySelector("#sec-berita h2.font-serif");
  const beritaDescEl = document.querySelector("#sec-berita .text-sm.text-\\[var\\(--color-teal\\)\\].leading-relaxed");
  if (beritaBadgeEl && g.berita_badge) beritaBadgeEl.textContent = g.berita_badge;
  if (beritaJudulEl && g.berita_judul) beritaJudulEl.textContent = g.berita_judul;
  if (beritaDescEl && g.berita_desc) beritaDescEl.textContent = g.berita_desc;
  // filter tabs berita
  const beritaTabAll = document.querySelector(".filter-news-btn[data-status='all']");
  const beritaTabNew = document.querySelector(".filter-news-btn[data-status='published']");
  if (beritaTabAll && g.berita_tab_all) beritaTabAll.textContent = g.berita_tab_all;
  if (beritaTabNew && g.berita_tab_new) beritaTabNew.textContent = g.berita_tab_new;
  const beritaBtnAll = document.getElementById("btn-show-all-news-modal");
  if (beritaBtnAll && g.berita_btn_all) beritaBtnAll.textContent = g.berita_btn_all;

  // ─── SECTION GALERI header ───
  const galeriSec = document.getElementById("sec-galeri");
  if (galeriSec) {
    const galBadge = galeriSec.querySelector(".text-xxs.font-bold.uppercase");
    const galJudul = galeriSec.querySelector("h2.font-serif");
    const galDesc = galeriSec.querySelector(".text-sm.leading-relaxed");
    if (galBadge && g.galeri_badge) galBadge.textContent = g.galeri_badge;
    if (galJudul && g.galeri_judul) galJudul.textContent = g.galeri_judul;
    if (galDesc && g.galeri_desc) galDesc.textContent = g.galeri_desc;
    // Update filter buttons from saved kategori
    if (g.galeri_kategori && Array.isArray(g.galeri_kategori)) {
      const filterWrap = galeriSec.querySelector(".flex.flex-wrap.items-center.justify-center.gap-2.max-w-lg");
      if (filterWrap) {
        const staticAll = filterWrap.querySelector("[data-category='all']");
        const customBtns = Array.from(filterWrap.querySelectorAll("[data-category]:not([data-category='all'])"));
        customBtns.forEach(b => b.remove());
        g.galeri_kategori.forEach((kat: string) => {
          const btn = document.createElement("button");
          btn.className = "filter-gallery-btn px-3.5 py-1 text-xs font-semibold rounded-full bg-stone-100 text-stone-700 hover:bg-[var(--color-cream)] transition-colors";
          btn.dataset.category = kat;
          btn.textContent = kat;
          filterWrap.appendChild(btn);
        });
        // Rebind ALL filter-gallery-btn listeners after rebuilding
        filterWrap.querySelectorAll(".filter-gallery-btn").forEach((btn: Element) => {
          btn.addEventListener("click", () => {
            filterWrap.querySelectorAll(".filter-gallery-btn").forEach(b => b.classList.remove("active", "bg-[var(--color-primary)]", "text-white"));
            btn.classList.add("active", "bg-[var(--color-primary)]", "text-white");
            const filterCat = (btn as HTMLButtonElement).getAttribute("data-category") || "all";
            renderGaleri(filterCat);
          });
        });
      }
    }
  }

  // ─── SECTION KONVERTER header ───
  const konvSec = document.getElementById("sec-konverter");
  if (konvSec) {
    const konvBadge = konvSec.querySelector(".text-xxs.font-bold.uppercase");
    const konvJudul = konvSec.querySelector("h2.font-serif");
    const konvDesc = konvSec.querySelector(".text-sm.leading-relaxed");
    const konvLabelIn = document.getElementById("label-converter-input");
    const konvLabelOut = document.getElementById("label-converter-output");
    const konvTips = konvSec.querySelector(".p-3\\.5.bg-\\[var\\(--color-cream\\)\\]");
    if (konvBadge && g.konverter_badge) konvBadge.textContent = g.konverter_badge;
    if (konvJudul && g.konverter_judul) konvJudul.textContent = g.konverter_judul;
    if (konvDesc && g.konverter_desc) konvDesc.textContent = g.konverter_desc;
    if (konvLabelIn && g.konverter_label_input) konvLabelIn.textContent = g.konverter_label_input;
    if (konvLabelOut && g.konverter_label_output) konvLabelOut.textContent = g.konverter_label_output;
    if (konvTips && g.konverter_tips) konvTips.innerHTML = `<strong>Tips Aksara:</strong> ${g.konverter_tips.replace(/^Tips Aksara:\s*/i,'')}`;
  }

  // Apply hero image & overlay settings
  const heroSection = document.getElementById("sec-beranda");
  if (heroSection) {
    const { hero_image_url, hero_overlay_color, hero_overlay_opacity } = g;
    if (hero_image_url) {
      heroSection.style.backgroundImage = `url('${hero_image_url}')`;
      heroSection.style.backgroundSize = "cover";
      heroSection.style.backgroundPosition = "center";
      heroSection.style.backgroundRepeat = "no-repeat";
    } else {
      heroSection.style.backgroundImage = "";
      heroSection.style.backgroundSize = "";
      heroSection.style.backgroundPosition = "";
    }
    const opacity = typeof hero_overlay_opacity === "number" ? hero_overlay_opacity : 0;
    const hex = (hero_overlay_color || "#3b1f0a").replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16) || 59;
    const gg = parseInt(hex.slice(2, 4), 16) || 31;
    const b = parseInt(hex.slice(4, 6), 16) || 10;
    heroSection.style.setProperty("--hero-overlay-color", `rgba(${r},${gg},${b},${opacity})`);
    heroSection.classList.toggle("has-hero-overlay", opacity > 0 || !!hero_image_url);
  }
}
// 2. RENDER STORIES / NEWS
function renderBerita(filterStatus: string = "all") {
  const grid = document.getElementById("news-container-grid");
  if (!grid) return;

  const filtered = filterStatus === "all" 
    ? store.news 
    : store.news.filter(n => n.status === filterStatus);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-gray-400">
        <div class="text-4xl mb-3">📰</div>
        <p class="text-sm font-semibold text-gray-500">Konten Berita Belum Ada</p>
        <p class="text-xs mt-1">Tambahkan artikel di <strong>Dashboard → Kelola Berita</strong></p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="traditional-card flex flex-col h-full bg-white rounded-lg border border-[var(--color-beige)] overflow-hidden">
      <!-- Image Thumbnail -->
      <div class="aspect-video w-full overflow-hidden bg-stone-100">
        <img src="${item.thumbnail_url}" alt="${item.judul}" class="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105" onError="this.src='https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=500'" />
      </div>

      <!-- Article Header details -->
      <div class="p-6 flex flex-col flex-grow justify-between">
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xxs font-semibold text-[var(--color-teal)] uppercase">
            <span>Penulis: ${item.penulis}</span>
            <span>${item.tanggal}</span>
          </div>
          <h4 style="color: var(--color-brown);" class="text-lg font-bold font-serif leading-snug hover:text-[var(--color-primary)] transition-colors">
            ${item.judul}
          </h4>
          <p class="text-xs text-gray-600 line-clamp-3 leading-relaxed text-justify">
            ${item.isi}
          </p>
        </div>
        
        <!-- Action launch popup modal -->
        <div class="pt-4 mt-4 border-t border-[var(--color-beige)] flex justify-between items-center">
          <span class="text-xxs font-mono bg-[var(--color-cream)] text-[var(--color-primary-dark)] py-1 px-2.5 rounded font-bold uppercase">${item.status}</span>
          <button data-news-id="${item.id}" class="read-news-btn text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] text-xs font-bold transition-colors select-none flex items-center gap-1 focus:outline-none">
            Baca Selengkapnya &rarr;
          </button>
        </div>
      </div>
    </article>
  `).join("");

  // Attach dynamic listener for full news overview popup modal
  document.querySelectorAll(".read-news-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const id = target.getAttribute("data-news-id");
      const findNews = store.news.find(n => n.id === id);
      if (findNews) {
        showArticleModal(findNews);
      }
    });
  });
}

// Full news overview modal view helper
function showArticleModal(news: Berita) {
  // Create modular modal frame elements
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 z-100 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in";
  modal.id = "news-detail-modal";
  modal.innerHTML = `
    <div style="background-color: var(--color-warm-white); max-width: 32rem;" class="w-full max-h-[85vh] rounded-xl border border-[var(--color-gold)] overflow-hidden flex flex-col shadow-2xl relative">
      <button id="btn-close-news-modal" class="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors focus:outline-none" title="Tutup">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="w-full aspect-video overflow-hidden bg-stone-100">
        <img src="${news.thumbnail_url}" alt="${news.judul}" class="w-full h-full object-cover" onError="this.src='https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=500'" />
      </div>

      <div class="p-6 overflow-y-auto space-y-4">
        <div class="flex items-center justify-between text-xxs font-bold text-[var(--color-teal)] uppercase tracking-wider">
          <span>Kontributor: ${news.penulis}</span>
          <span>${news.tanggal}</span>
        </div>
        <h3 style="color: var(--color-brown);" class="text-2xl font-black font-serif leading-tight">
          ${news.judul}
        </h3>
        <p class="text-xs md:text-sm text-gray-700 leading-relaxed text-justify whitespace-pre-line">
          ${news.isi}
        </p>
      </div>

      <div class="py-3 px-6 bg-[var(--color-cream)] border-t border-[var(--color-beige)] flex justify-between items-center">
        <span class="text-xxs font-mono text-gray-500">Artikel Pustaka RIKSA</span>
        <button id="btn-close-news-modal-footer" class="btn-traditional text-xxs font-bold py-1 px-3">Selesai</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    modal.classList.add("animate-fade-out");
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 200);
  };

  document.getElementById("btn-close-news-modal")?.addEventListener("click", closeModal);
  document.getElementById("btn-close-news-modal-footer")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

// 3. RENDER GALLERY ALBUM CARDS
function renderGaleri(filterCategory: string = "all") {
  const grid = document.getElementById("gallery-container-grid");
  if (!grid) return;

  const filtered = filterCategory === "all"
    ? store.gallery.filter(g => g.isVisible)
    : store.gallery.filter(g => g.isVisible && g.kategori === filterCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-gray-400">
        <div class="text-4xl mb-3">🖼️</div>
        <p class="text-sm font-semibold text-gray-500">Konten Galeri Belum Ada</p>
        <p class="text-xs mt-1">Tambahkan foto di <strong>Dashboard → Kelola Galeri</strong></p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="traditional-card group bg-white rounded-lg border border-[var(--color-beige)] overflow-hidden cursor-pointer" data-gallery-id="${item.id}">
      <div class="aspect-square w-full relative overflow-hidden bg-stone-100">
        <img src="${item.foto_url}" alt="${item.judul}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError="this.src='https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=500'" />
        
        <!-- Category Pill overlay -->
        <span style="background-color: var(--color-primary);" class="absolute top-3 left-3 text-xxs font-black text-white px-2.5 py-1 rounded">
          ${item.kategori}
        </span>

        <!-- Floating description overlay on Desktop hover -->
        <div class="absolute inset-0 bg-black/75 flex flex-col justify-end p-4 text-white opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <p class="text-xxs text-[var(--color-gold)] font-mono">${item.tanggal}</p>
          <h5 class="font-serif font-bold text-sm text-[var(--color-cream)] mt-0.5">${item.judul}</h5>
          <p class="text-[10px] text-gray-350 line-clamp-2 mt-1 leading-normal">${item.keterangan}</p>
        </div>
      </div>

      <!-- Mobile info block beneath thumbnail -->
      <div class="p-4 border-t border-[var(--color-beige)] block md:hidden space-y-1">
        <span class="text-xxs font-bold text-gray-400 font-mono">${item.tanggal}</span>
        <h5 style="color: var(--color-brown);" class="font-serif font-bold text-sm">${item.judul}</h5>
        <p class="text-xxs text-gray-600 line-clamp-2">${item.keterangan}</p>
      </div>
    </div>
  `).join("");

  // Setup lightbox preview trigger
  document.querySelectorAll("[data-gallery-id]").forEach(card => {
    card.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLDivElement;
      const id = target.getAttribute("data-gallery-id");
      const findItem = store.gallery.find(g => g.id === id);
      if (findItem) {
        openLightbox(findItem);
      }
    });
  });
}

// Lightbox controller
function openLightbox(item: Galeri) {
  const modal = document.getElementById("gallery-lightbox-modal") as HTMLDivElement;
  const img = document.getElementById("lightbox-img") as HTMLImageElement;
  const title = document.getElementById("lightbox-title") as HTMLHeadingElement;
  const desc = document.getElementById("lightbox-desc") as HTMLParagraphElement;

  if (modal && img && title && desc) {
    img.src = item.foto_url;
    title.textContent = item.judul;
    desc.textContent = `${item.tanggal} — [Kategori: ${item.kategori}] ${item.keterangan}`;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

// 4. RENDER ORGANIZING BOARD (STRUKTUR)
function renderStruktur() {
  const gridCore = document.getElementById("organisasi-grid-core");
  const gridDivs = document.getElementById("organisasi-grid-divisions");

  if (!gridCore || !gridDivs) return;

  // Filter core leaders (BPH)
  const coreLeader = DEFAULT_STRUKTUR.filter(s => s.divisi === "BPH");
  // Filter other division heads
  const divHeads = DEFAULT_STRUKTUR.filter(s => s.divisi !== "BPH");

  gridCore.innerHTML = coreLeader.map(item => `
    <div style="background-color: white; border-color: var(--color-gold);" class="rounded-xl border-2 p-6 text-center space-y-4 shadow-sm relative overflow-hidden group">
      <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gold)]"></div>
      
      <!-- Photo Frame -->
      <div style="border-color: var(--color-beige);" class="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 bg-stone-100 shadow-inner">
        <img src="${item.foto_url}" alt="${item.nama}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" onError="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'" />
      </div>

      <!-- Identity -->
      <div>
        <h4 style="color: var(--color-brown);" class="font-bold font-serif text-md">${item.nama}</h4>
        <span style="color: var(--color-primary-dark);" class="text-xs font-semibold block uppercase tracking-wide mt-1">${item.jabatan}</span>
        <span class="inline-block text-[10px] font-mono bg-[var(--color-cream)] text-[var(--color-brown)] px-2 py-0.5 rounded-full font-bold mt-2">DPI Utama</span>
      </div>
    </div>
  `).join("");

  gridDivs.innerHTML = divHeads.map(item => `
    <div style="background-color: white; border-color: var(--color-beige);" class="rounded-lg border p-5 text-center space-y-3 shadow-xs hover:border-[var(--color-gold)] transition-colors group">
      <div style="border-color: var(--color-beige);" class="w-16 h-16 mx-auto rounded-full overflow-hidden border">
        <img src="${item.foto_url}" alt="${item.nama}" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
      </div>
      <div>
        <h4 style="color: var(--color-brown);" class="font-bold font-serif text-sm">${item.nama}</h4>
        <span style="color: var(--color-teal);" class="text-xxs font-semibold block uppercase tracking-wider mt-0.5">${item.jabatan}</span>
      </div>
    </div>
  `).join("");
}

// 5. RENDER RECRUITMENT AND VOLUNTEERS
function renderRelawan() {
  const badge = document.getElementById("badge-recruitment");
  const rBadge = document.getElementById("recruitment-status-badge");
  
  const rTitle = document.getElementById("recruitment-title");
  const rDesc = document.getElementById("recruitment-desc");
  const rQuota = document.getElementById("recruitment-quota");
  const rDeadline = document.getElementById("recruitment-deadline");
  const rDivisi = document.getElementById("recruitment-divisi-list");

  // Form wrappers
  const formBox = document.getElementById("recruitment-form-container");
  const closedBox = document.getElementById("recruitment-closed-container");
  const formSelectSelect = document.getElementById("v-division") as HTMLSelectElement;

  // Active volunteers listing
  const vListGrid = document.getElementById("active-volunteers-grid");

  // Load state values
  const active = store.recruitment.isActive;

  // Header active indicator sync
  if (badge) {
    if (active) badge.classList.remove("hidden");
    else badge.classList.add("hidden");
  }

  // Update Status Badge
  if (rBadge) {
    rBadge.innerHTML = active 
      ? `<span class="pulse-badge">DIBUKA</span>`
      : `<span style="background-color: #FDE8E8; color: #9B1C1C;" class="inline-flex items-center text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">DITUTUP</span>`;
  }

  // Details
  if (rTitle) rTitle.textContent = store.recruitment.judul;
  if (rDesc) rDesc.textContent = store.recruitment.deskripsi;
  if (rQuota) rQuota.textContent = `${store.recruitment.kuota} Orang`;
  if (rDeadline) rDeadline.textContent = store.recruitment.tanggal_tutup;
  
  if (rDivisi) {
    rDivisi.innerHTML = store.recruitment.divisi_tersedia.map(div => `<li>${div} (Divisi Pilihan)</li>`).join("");
  }

  // Swap panels
  if (active) {
    if (formBox) formBox.classList.remove("hidden");
    if (closedBox) closedBox.classList.add("hidden");

    // Populate dynamic select block options
    if (formSelectSelect) {
      formSelectSelect.innerHTML = `<option value="" disabled selected>Pilih Divisi Penempatan</option>` +
        store.recruitment.divisi_tersedia.map(div => `<option value="${div}">${div}</option>`).join("");
    }
  } else {
    if (formBox) formBox.classList.add("hidden");
    if (closedBox) closedBox.classList.remove("hidden");
  }

  // Rentering active volunteers list
  if (vListGrid) {
    const activeVols = store.volunteers.filter(v => v.status_aktif);
    if (activeVols.length === 0) {
      vListGrid.innerHTML = `
        <div class="col-span-full py-8 text-center text-gray-400">
          <div class="text-3xl mb-2">👥</div>
          <p class="text-sm font-semibold text-gray-500">Konten Relawan Belum Ada</p>
          <p class="text-xs mt-1">Tambahkan data di <strong>Dashboard → Kelola Relawan</strong></p>
        </div>
      `;
    } else {
      vListGrid.innerHTML = activeVols.map(vol => `
        <div style="background-color: white; border-color: var(--color-beige);" class="p-4 rounded-lg border text-center space-y-3 shadow-xxs">
          <div class="w-16 h-16 rounded-full overflow-hidden mx-auto border bg-stone-50">
            <img src="${vol.foto_url}" alt="${vol.nama}" class="w-full h-full object-cover" onError="this.src='https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'" />
          </div>
          <div>
            <h4 style="color: var(--color-brown);" class="font-bold font-serif text-sm truncate">${vol.nama}</h4>
            <span style="color: var(--color-teal);" class="text-xxs font-medium block uppercase tracking-wide mt-0.5">${vol.divisi}</span>
            <span class="inline-block text-[9px] font-mono text-gray-500 mt-2">Bergabung: ${vol.tanggal_bergabung}</span>
          </div>
        </div>
      `).join("");
    }
  }
}

// 6. RENDER ADMIN DASHBOARD CONTROLS

// ============================================================================
// CLOUDINARY UPLOAD UTILITY (main.tsx)
// ============================================================================

// Compress image before upload (max 800px, quality 0.75)
function compressImage(file: File, maxPx = 800, quality = 0.75): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width > height) { height = Math.round(height * maxPx / width); width = maxPx; }
        else { width = Math.round(width * maxPx / height); height = maxPx; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Compress gagal")), "image/jpeg", quality);
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function getCldCfg(): Promise<{cloudName:string;uploadPreset:string;folder:string} | null> {
  try {
    const snap = await getDoc(doc(db, "settings", "cloudinary"));
    if (snap.exists()) {
      const d = snap.data() as {cloudName:string;uploadPreset:string;folder:string};
      if (d.cloudName && d.uploadPreset) return d;
    }
  } catch(e) { console.warn("getCldCfg:", e); }
  return null;
}

async function uploadFileToCloudinary(
  file: File,
  targetInputId: string,
  previewElId?: string
): Promise<string | null> {
  const cfg = await getCldCfg();
  if (!cfg) {
    showToast("⚠️ Konfigurasi Cloudinary belum diset di dashboard admin.");
    return null;
  }
  showToast("⏳ Mengkompres & mengupload gambar...");
  let uploadBlob: Blob = file;
  try {
    uploadBlob = await compressImage(file, 800, 0.75);
  } catch(e) { console.warn("Compress skip:", e); }
  const form = new FormData();
  form.append("file", uploadBlob, "foto.jpg");
  form.append("upload_preset", cfg.uploadPreset);
  if (cfg.folder) form.append("folder", cfg.folder);
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`, {
      method: "POST", body: form
    });
    const data = await res.json();
    if (data.secure_url) {
      const el = document.getElementById(targetInputId) as HTMLInputElement;
      if (el) { el.value = data.secure_url; el.dispatchEvent(new Event("input")); }
      if (previewElId) {
        const prev = document.getElementById(previewElId) as HTMLImageElement;
        if (prev) prev.src = data.secure_url;
      }
      showToast("✅ Gambar berhasil diupload!");
      return data.secure_url;
    }
    throw new Error(data.error?.message || "Upload gagal");
  } catch(e: any) {
    showToast("❌ Upload gagal: " + e.message);
    return null;
  }
}

function attachFileUpload(fileInputId: string, targetInputId: string, previewElId?: string) {
  const fi = document.getElementById(fileInputId) as HTMLInputElement;
  if (!fi) return;
  fi.addEventListener("change", async () => {
    if (fi.files?.[0]) await uploadFileToCloudinary(fi.files[0], targetInputId, previewElId);
    fi.value = "";
  });
}

function renderAdmin() {
  const loginError = document.getElementById("admin-login-error");
  if (loginError) loginError.classList.add("hidden");

  // Sync Applicants Counter Badge in sub navs
  const countBadge = document.getElementById("dash-applicants-count");
  const pendingCount = store.applicants.filter(a => a.status === "pending").length;
  if (countBadge) countBadge.textContent = String(pendingCount);

  // Fill in profile input forms
  const admG_Nama = document.getElementById("adm-g-nama") as HTMLInputElement;
  const admG_Tagline = document.getElementById("adm-g-tagline") as HTMLInputElement;
  const admG_Visi = document.getElementById("adm-g-visi") as HTMLTextAreaElement;
  const admG_Misi = document.getElementById("adm-g-misi") as HTMLTextAreaElement;
  const admG_Sejarah = document.getElementById("adm-g-sejarah") as HTMLTextAreaElement;
  const admG_Email = document.getElementById("adm-g-email") as HTMLInputElement;
  const admG_Telp = document.getElementById("adm-g-telp") as HTMLInputElement;
  const admG_Alamat = document.getElementById("adm-g-alamat") as HTMLInputElement;
  const admG_Instagram = document.getElementById("adm-g-instagram") as HTMLInputElement;
  const admG_Youtube = document.getElementById("adm-g-youtube") as HTMLInputElement;

  if (admG_Nama) admG_Nama.value = store.general.nama_org;
  if (admG_Tagline) admG_Tagline.value = store.general.tagline;
  if (admG_Visi) admG_Visi.value = store.general.visi;
  if (admG_Misi) admG_Misi.value = store.general.misi;
  if (admG_Sejarah) admG_Sejarah.value = store.general.sejarah;
  if (admG_Email) admG_Email.value = store.general.email;
  if (admG_Telp) admG_Telp.value = store.general.telp;
  if (admG_Alamat) admG_Alamat.value = store.general.alamat;
  if (admG_Instagram) admG_Instagram.value = store.general.instagram;
  if (admG_Youtube) admG_Youtube.value = store.general.youtube;

  const admG_HeroImageUrl = document.getElementById("adm-g-hero-image-url") as HTMLInputElement;
  const admG_HeroOverlayColor = document.getElementById("adm-g-hero-overlay-color") as HTMLInputElement;
  const admG_HeroOverlayOpacity = document.getElementById("adm-g-hero-overlay-opacity") as HTMLInputElement;
  const admG_HeroOpacityVal = document.getElementById("adm-g-hero-opacity-val");
  if (admG_HeroImageUrl) admG_HeroImageUrl.value = store.general.hero_image_url || "";
  if (admG_HeroOverlayColor) admG_HeroOverlayColor.value = store.general.hero_overlay_color || "#3b1f0a";
  if (admG_HeroOverlayOpacity) admG_HeroOverlayOpacity.value = String(store.general.hero_overlay_opacity ?? 0);
  if (admG_HeroOpacityVal) admG_HeroOpacityVal.textContent = String(Math.round((store.general.hero_overlay_opacity ?? 0) * 100)) + "%";

  // Fill in recruitment config inputs
  const admR_Active = document.getElementById("adm-r-active") as HTMLInputElement;
  const admR_StatusLabel = document.getElementById("adm-r-status-label");
  const admR_Judul = document.getElementById("adm-r-judul") as HTMLInputElement;
  const admR_Quota = document.getElementById("adm-r-kuota") as HTMLInputElement;
  const admR_Tanggal = document.getElementById("adm-r-tanggal") as HTMLInputElement;
  const admR_Divisi = document.getElementById("adm-r-divisi") as HTMLInputElement;
  const admR_Deskripsi = document.getElementById("adm-r-deskripsi") as HTMLTextAreaElement;

  if (admR_Active) {
    admR_Active.checked = store.recruitment.isActive;
    if (admR_StatusLabel) {
      admR_StatusLabel.textContent = store.recruitment.isActive ? "DIBUKA" : "DITUTUP";
      admR_StatusLabel.className = store.recruitment.isActive ? "ml-3 text-xs font-bold text-emerald-600 uppercase tracking-widest leading-none" : "ml-3 text-xs font-bold text-red-500 uppercase tracking-widest leading-none";
    }
  }

  if (admR_Judul) admR_Judul.value = store.recruitment.judul;
  if (admR_Quota) admR_Quota.value = String(store.recruitment.kuota);
  if (admR_Tanggal) admR_Tanggal.value = store.recruitment.tanggal_tutup;
  if (admR_Divisi) admR_Divisi.value = store.recruitment.divisi_tersedia.join(", ");
  if (admR_Deskripsi) admR_Deskripsi.value = store.recruitment.deskripsi;

  // RENDER EDIT NEWS TABLE ROW LISTS
  const newsTableBody = document.getElementById("adm-news-table-body");
  if (newsTableBody) {
    if (store.news.length === 0) {
      newsTableBody.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-gray-400 font-mono italic">Belum ada artikel berita.</td></tr>`;
    } else {
      newsTableBody.innerHTML = store.news.map(item => `
        <tr class="border-b border-gray-100 hover:bg-stone-50">
          <td class="py-3 px-4 font-bold max-w-xs truncate">${item.judul}</td>
          <td class="py-3 px-4 text-gray-500">${item.penulis}</td>
          <td class="py-3 px-4 font-mono text-gray-500">${item.tanggal}</td>
          <td class="py-3 px-4">
            <span class="${item.status === "published" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-700 border-gray-200"} text-xxs px-2 py-0.5 rounded border border-dashed font-semibold uppercase">
              ${item.status}
            </span>
          </td>
          <td class="py-3 px-4 text-center">
            <button data-delete-news-id="${item.id}" class="adm-del-news-btn font-mono text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 py-1 px-3 rounded focus:outline-none transition-colors">
              Hapus
            </button>
          </td>
        </tr>
      `).join("");

      // Delete listener setup
      document.querySelectorAll(".adm-del-news-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const target = e.currentTarget as HTMLButtonElement;
          const id = target.getAttribute("data-delete-news-id");
          if (confirm("Apakah anda yakin ingin menghapus artikel warta ini dari sistem?")) {
            store.news = store.news.filter(n => n.id !== id);
            store.save();

            if (store.dbAvailable && id) {
              try {
                await deleteDoc(doc(db, "berita", id));
              } catch (error) {
                handleSupabaseError(error, OperationType.WRITE, `berita/${id}`);
              }
            }

            showToast("Artikel berhasil dihapus.");
            renderBerita();
            renderAdmin();
          }
        });
      });
    }
  }

  // RENDER APPLICANTS MANAGEMENT BOARD ACTIONS
  const appTableBody = document.getElementById("adm-applicants-table-body");
  if (appTableBody) {
    if (store.applicants.length === 0) {
      appTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-8 text-gray-400 font-mono text-xxs italic">
            Belum ada permohonan seleksi pendaftar relawan masuk.
          </td>
        </tr>
      `;
    } else {
      appTableBody.innerHTML = store.applicants.map(app => {
        let statusBadgeClass = "bg-stone-100 text-stone-700 border-stone-200";
        if (app.status === "approved") statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (app.status === "rejected") statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";

        return `
          <tr class="border-b border-gray-100 hover:bg-stone-50 align-top">
            <td class="py-3.5 px-3 font-mono text-gray-500 whitespace-nowrap text-[10px]">${app.tanggal_daftar}</td>
            <td class="py-3.5 px-3">
              <div class="font-bold text-[var(--color-brown)]">${app.nama}</div>
              <div class="text-xxs text-gray-400">Usia: ${app.usia} Tahun</div>
              <div class="mt-2 text-xxs text-gray-600 bg-amber-50/70 p-2.5 rounded border border-dashed border-[var(--color-gold)] max-w-xs text-justify font-sans leading-relaxed">
                <strong>Motivasi:</strong> "${app.motivasi}"
              </div>
            </td>
            <td class="py-3.5 px-3 font-semibold text-[var(--color-teal)]">${app.divisi_pilihan}</td>
            <td class="py-3.5 px-3 font-mono text-stone-500 text-[10px] space-y-0.5 leading-none">
              <div>WhatsApp: ${app.no_hp}</div>
              <div class="mt-1">Email: ${app.email}</div>
            </td>
            <td class="py-3.5 px-3 text-center">
              <span class="${statusBadgeClass} text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded border border-dashed">
                ${app.status}
              </span>
            </td>
            <td class="py-3.5 px-3 text-center whitespace-nowrap">
              ${app.status === "pending" ? `
                <div class="inline-flex gap-1.5 justify-center">
                  <button data-approve-app-id="${app.id}" class="btn-approve text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors focus:outline-none">
                    Setujui
                  </button>
                  <button data-reject-app-id="${app.id}" class="btn-reject text-xs font-bold px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors focus:outline-none">
                    Tolak
                  </button>
                </div>
              ` : `
                <span class="text-xxs text-gray-400 italic">Selesai Ditinjau</span>
              `}
            </td>
          </tr>
        `;
      }).join("");

      // Approve Handler Listener
      document.querySelectorAll(".btn-approve").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const target = e.currentTarget as HTMLButtonElement;
          const id = target.getAttribute("data-approve-app-id");
          const applicant = store.applicants.find(a => a.id === id);
          if (applicant && id) {
            applicant.status = "approved";

            // Add as active official volunteer
            const newVol: Relawan = {
              id: "v_" + Date.now(),
              nama: applicant.nama,
              email: applicant.email,
              no_hp: applicant.no_hp,
              divisi: applicant.divisi_pilihan,
              status_aktif: true,
              foto_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200", // Default placeholder
              tanggal_bergabung: new Date().toISOString().split("T")[0]
            };
            store.volunteers.unshift(newVol);
            store.save();

            if (store.dbAvailable) {
              try {
                // Update applicant status
                await updateDoc(doc(db, "pendaftar_relawan", id), { status: "approved" });
                // Add relawan doc
                const { id: volId, ...volData } = newVol;
                await setDoc(doc(db, "relawan", volId), volData);
              } catch (err) {
                handleSupabaseError(err, OperationType.WRITE, `approve/${id}`);
              }
            }

            showToast(`${applicant.nama} resmi disetujui sebagai bagian Relawan RIKSA.`);
            renderRelawan();
            renderAdmin();
          }
        });
      });

      // Reject Handler Listener
      document.querySelectorAll(".btn-reject").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const target = e.currentTarget as HTMLButtonElement;
          const id = target.getAttribute("data-reject-app-id");
          const applicant = store.applicants.find(a => a.id === id);
          if (applicant && id) {
            applicant.status = "rejected";
            store.save();

            if (store.dbAvailable) {
              try {
                await updateDoc(doc(db, "pendaftar_relawan", id), { status: "rejected" });
              } catch (err) {
                handleSupabaseError(err, OperationType.WRITE, `pendaftar_relawan/${id}`);
              }
            }

            showToast("Aplikasi ditolak secara profesional.");
            renderAdmin();
          }
        });
      });
    }
  }
}

// ============================================================================
// AKSARA CHARACTER GRAPHICS INJECTOR
// ============================================================================

function initializeAksaraKeyboard() {
  const padMain = document.getElementById("aksara-btn-pad");
  const padRara = document.getElementById("rarangken-btn-pad");
  const displayAksara = document.getElementById("trainer-aksara-display");
  const displayLatin = document.getElementById("trainer-latin-display");

  if (!padMain || !padRara || !displayAksara || !displayLatin) return;

  let currentAksaraSeq: string[] = [];
  let currentLatinSeq: string[] = [];

  const updateTrainerBoard = () => {
    if (currentAksaraSeq.length === 0) {
      displayAksara.textContent = "ᮛᮤᮥᮃᮍᮔ᮪ ᮃᮊ᮪ᮞᮛ ᮞᮥᮔ᮪ᮓ";
      displayLatin.textContent = "( ri - u - a - nga - n - a - ka - sa - ra - su - n - da )";
    } else {
      displayAksara.textContent = currentAksaraSeq.join("");
      displayLatin.textContent = `( ${currentLatinSeq.join(" - ")} )`;
    }
  };

  // Build pokok character keypads
  padMain.innerHTML = CONSTS_CONSONANTS.map(item => `
    <button class="char-pad-btn focus:outline-none" data-val="${item.aksara}" data-lat="${item.latin}">
      <span class="aksara-sunda text-2xl text-[var(--color-primary-dark)]">${item.aksara}</span>
      <span class="text-xxs font-semibold text-gray-500 lowercase">${item.latin}</span>
    </button>
  `).join("");

  // Build rarangken modifier keys
  padRara.innerHTML = MODIFIERS_RARANGKEN.map(item => `
    <button class="char-pad-btn bg-stone-50 border-stone-200 focus:outline-none" data-val="${item.aksara}" data-lat="${item.latin}">
      <span class="aksara-sunda text-2xl text-[var(--color-teal)]">◌${item.aksara}</span>
      <span style="font-size: 9px;" class="font-bold text-gray-600 line-clamp-1 truncate">${item.label.split(" (")[0]}</span>
    </button>
  `).join("");

  // Register event clicks on pokok keypads
  padMain.querySelectorAll("[data-val]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const ak = target.getAttribute("data-val") || "";
      const lat = target.getAttribute("data-lat") || "";
      
      currentAksaraSeq.push(ak);
      currentLatinSeq.push(lat);
      updateTrainerBoard();
    });
  });

  // Register modifier attachment clicks
  padRara.querySelectorAll("[data-val]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      if (currentAksaraSeq.length === 0) {
        showToast("Pilih karakter pokok aksara terlebih dahulu.", false);
        return;
      }
      const target = e.currentTarget as HTMLButtonElement;
      const r_ak = target.getAttribute("data-val") || "";
      const r_lat = target.getAttribute("data-lat") || "";

      // Attach modifier directly to the last base consonant index
      const lastIndex = currentAksaraSeq.length - 1;
      
      if (r_ak === "᮪") { // Pamaéh (closes syllable. eg. "ka" -> "k")
        currentAksaraSeq[lastIndex] += "᮪";
        currentLatinSeq[lastIndex] = currentLatinSeq[lastIndex].replace(/a$/, "");
      } else {
        currentAksaraSeq[lastIndex] += r_ak;
        // Adjust literal latin representation
        if (currentLatinSeq[lastIndex].endsWith("a")) {
          currentLatinSeq[lastIndex] = currentLatinSeq[lastIndex].substring(0, currentLatinSeq[lastIndex].length - 1) + r_lat;
        } else {
          currentLatinSeq[lastIndex] += r_lat;
        }
      }
      
      updateTrainerBoard();
    });
  });

  // Setup Clear Trainer button
  const clearBtn = document.getElementById("btn-trainer-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      currentAksaraSeq = [];
      currentLatinSeq = [];
      updateTrainerBoard();
      // Clear auto-translator too
      const latInput = document.getElementById("latin-translator-input") as HTMLInputElement;
      if (latInput) latInput.value = "";
    });
  }

  // Setup Latin Instant Transliterator Box
  const latinInput = document.getElementById("latin-translator-input") as HTMLInputElement;
  if (latinInput) {
    latinInput.addEventListener("input", (e) => {
      const val = (e.target as HTMLInputElement).value;
      if (!val) {
        currentAksaraSeq = [];
        currentLatinSeq = [];
        updateTrainerBoard();
        return;
      }
      const res = translateLatinToSunda(val);
      displayAksara.textContent = res.aksara;
      displayLatin.textContent = `( ${res.latinRepr} )`;
    });
  }
}

// ============================================================================
// LIVE NAVIGATION TAB SECTIONS WIRING
// ============================================================================

function setupNavigation() {
  const navBtns = document.querySelectorAll(".nav-btn");
  const mobNavBtns = document.querySelectorAll(".mobile-nav-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");

  const switchTab = (tabId: string) => {
    // Smooth scroll to the targeted section element
    const sectionEl = document.getElementById(`sec-${tabId}`);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Update Desktop Nav Active Links
    navBtns.forEach(btn => {
      const dataTab = btn.getAttribute("data-tab");
      if (dataTab === tabId) {
        btn.classList.add("nav-link-active");
      } else {
        btn.classList.remove("nav-link-active");
      }
    });

    // Update Mobile Nav Links
    mobNavBtns.forEach(btn => {
      const dataTab = btn.getAttribute("data-tab");
      if (dataTab === tabId) {
        btn.classList.add("bg-[var(--color-cream)]", "font-bold");
      } else {
        btn.classList.remove("bg-[var(--color-cream)]", "font-bold");
      }
    });

    // Collapse mobile drawer if open
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
    }
  };

  // Register desktop links listen
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab") || "beranda";
      switchTab(tabId);
    });
  });

  // Register mobile drawer links listen
  mobNavBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab") || "beranda";
      switchTab(tabId);
    });
  });

  // Footer Navigation links wiring
  document.querySelectorAll(".footer-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab") || "beranda";
      switchTab(tabId);
    });
  });

  // Register general actions CTA links (e.g. Join or Explore)
  document.querySelectorAll("[data-goto]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const tabId = target.getAttribute("data-goto") || "beranda";
      switchTab(tabId);
    });
  });

  // Mobile menu toggle click
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // ============================================
  // ORGANIZATIONAL PROFILE SUB-TABS INTERACTIVITY
  // ============================================
  const btnVisiMisi = document.getElementById("btn-profil-visimisi");
  const btnSejarah = document.getElementById("btn-profil-sejarah");
  const btnStruktur = document.getElementById("btn-profil-struktur");

  const pnlVisiMisi = document.getElementById("tab-content-visimisi");
  const pnlSejarah = document.getElementById("tab-content-sejarah");
  const pnlStruktur = document.getElementById("tab-content-struktur");

  if (btnVisiMisi && btnSejarah && btnStruktur && pnlVisiMisi && pnlSejarah && pnlStruktur) {
    const clearProfileTabs = () => {
      pnlVisiMisi.classList.add("hidden");
      pnlSejarah.classList.add("hidden");
      pnlStruktur.classList.add("hidden");

      const activeClasses = ["border-b-2", "border-[var(--color-primary)]", "text-[var(--color-primary)]", "font-extrabold"];
      const normalClasses = ["text-gray-500", "font-bold"];

      btnVisiMisi.classList.remove(...activeClasses);
      btnVisiMisi.classList.add(...normalClasses);
      btnSejarah.classList.remove(...activeClasses);
      btnSejarah.classList.add(...normalClasses);
      btnStruktur.classList.remove(...activeClasses);
      btnStruktur.classList.add(...normalClasses);
    };

    btnVisiMisi.addEventListener("click", () => {
      clearProfileTabs();
      pnlVisiMisi.classList.remove("hidden");
      btnVisiMisi.classList.add("border-b-2", "border-[var(--color-primary)]", "text-[var(--color-primary)]", "font-extrabold");
      btnVisiMisi.classList.remove("text-gray-500", "font-bold");
    });

    btnSejarah.addEventListener("click", () => {
      clearProfileTabs();
      pnlSejarah.classList.remove("hidden");
      btnSejarah.classList.add("border-b-2", "border-[var(--color-primary)]", "text-[var(--color-primary)]", "font-extrabold");
      btnSejarah.classList.remove("text-gray-500", "font-bold");
    });

    btnStruktur.addEventListener("click", () => {
      clearProfileTabs();
      pnlStruktur.classList.remove("hidden");
      btnStruktur.classList.add("border-b-2", "border-[var(--color-primary)]", "text-[var(--color-primary)]", "font-extrabold");
      btnStruktur.classList.remove("text-gray-500", "font-bold");
    });
  }

  // ============================================
  // SECTION KONVERTER SUBSTRATE INTEGRATION (LOCAL + GEMINI AI HYBRID)
  // ============================================
  const convInput = document.getElementById("converter-input") as HTMLTextAreaElement;
  const convOutput = document.getElementById("converter-output");
  const convOutputPhonetic = document.getElementById("converter-output-phonetic");
  const convMode = document.getElementById("converter-mode") as HTMLSelectElement;
  const convSwap = document.getElementById("btn-converter-swap");
  const convCopy = document.getElementById("btn-converter-copy");
  const convKey = document.getElementById("converter-gemini-key") as HTMLInputElement;
  const convSubmit = document.getElementById("btn-converter-submit");
  const convSpinner = document.getElementById("converter-spinner");

  const labelInput = document.getElementById("label-converter-input");
  const labelOutput = document.getElementById("label-converter-output");

  if (convInput && convOutput && convOutputPhonetic && convMode && convSubmit) {

    // Helper: sync labels & placeholder to current mode value
    function updateConverterLabels(mode: string) {
      if (mode === "sunda-to-latin") {
        if (labelInput) labelInput.textContent = "Aksara Sunda (Input)";
        if (labelOutput) labelOutput.textContent = "Tekst Latin / Alfabet (Hasil)";
        convInput.placeholder = "Tempelkan tulisan Aksara Sunda (misalnya: ᮛᮤᮊ᮪ᮞ)...";
      } else {
        if (labelInput) labelInput.textContent = "Tekst Latin (Alfabet)";
        if (labelOutput) labelOutput.textContent = "Salinan Aksara Sunda";
        convInput.placeholder = "Tuliskan kata atau kalimat bahasa Sunda loma / kasar di sini...";
      }
    }

    // Update labels whenever dropdown changes directly
    convMode.addEventListener("change", () => {
      updateConverterLabels(convMode.value);
    });

    // Swap direction action
    if (convSwap) {
      convSwap.addEventListener("click", () => {
        const val = convMode.value;
        convMode.value = val === "latin-to-sunda" ? "sunda-to-latin" : "latin-to-sunda";
        updateConverterLabels(convMode.value);
      });
    }

    // Copy result clipboard action
    if (convCopy) {
      convCopy.addEventListener("click", () => {
        const textToCopy = convOutput.textContent || "";
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast("Hasil konversi berhasil disalin ke papan klip!");
        });
      });
    }

    // Submit translator action
    convSubmit.addEventListener("click", async () => {
      const text = convInput.value.trim();
      const mode = convMode.value;

      if (!text) {
        showToast("Harap masukkan teks input terlebih dahulu.", false);
        return;
      }

      if (convSpinner) convSpinner.classList.remove("hidden");
      convSubmit.setAttribute("disabled", "true");

      // Kedua mode kini menggunakan algoritma lokal — tanpa API key, tanpa internet
      if (mode === "latin-to-sunda") {
        const resLocal = translateLatinToSunda(text);
        convOutput.textContent = resLocal.aksara;
        convOutputPhonetic.textContent = `( ${resLocal.latinRepr} )`;
        showToast("Konversi Latin → Aksara Sunda berhasil!");
      } else {
        const latinResult = translateSundaToLatin(text);
        convOutput.textContent = latinResult;
        convOutputPhonetic.textContent = "( Transliterasi lokal — offline )";
        showToast("Transliterasi Aksara → Latin berhasil!");
      }
      if (convSpinner) convSpinner.classList.add("hidden");
      convSubmit.removeAttribute("disabled");
    });
  }

  // Floating Clear button inside Keypad
  const clearFloating = document.getElementById("btn-trainer-clear-floating");
  const displayAksara = document.getElementById("trainer-aksara-display");
  const displayLatin = document.getElementById("trainer-latin-display");
  if (clearFloating && displayAksara && displayLatin) {
    clearFloating.addEventListener("click", () => {
      displayAksara.textContent = "ᮛᮤᮥᮃᮍᮔ᮪ ᮃᮊ᮪ᮞᮛ ᮞᮥᮔ᮪ᮓ";
      displayLatin.textContent = "( ri - u - a - nga - n - a - ka - sa - ra - su - n - da )";
      showToast("Papan tulis trainer berhasil dibersihkan!");
    });
  }

  // ============================================
  // SUB DASHBOARD MULTI-TAB PANEL SWAPS
  // ============================================
  const dashBtns = document.querySelectorAll(".dash-tab-btn");
  const dashPanels = document.querySelectorAll(".dash-tab-content");

  dashBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-dash") || btn.getAttribute("data-sub") || "";
      
      // Update Tab Button States
      dashBtns.forEach(b => {
        if (b === btn) {
          b.className = "dash-tab-btn px-4 py-2 text-xxs font-extrabold uppercase tracking-wider rounded-lg bg-[var(--color-primary)] text-white";
        } else {
          b.className = "dash-tab-btn px-4 py-2 text-xxs font-extrabold uppercase tracking-wider rounded-lg text-stone-600 hover:bg-stone-200";
        }
      });

      // Update Panel Swaps
      dashPanels.forEach(panel => {
        if (panel.id === `dash-form-${tabId}` || panel.id === `dash-panel-${tabId}`) {
          panel.classList.remove("hidden");
          panel.classList.add("block");
        } else {
          panel.classList.remove("block");
          panel.classList.add("hidden");
        }
      });
    });
  });

  // LIGHTBOX CLOSE MOUNTING
  const lbClose = document.getElementById("btn-lightbox-close");
  const lbModal = document.getElementById("gallery-lightbox-modal");
  if (lbClose && lbModal) {
    const closeLb = () => { lbModal.classList.add("hidden"); };
    lbClose.addEventListener("click", closeLb);
    lbModal.addEventListener("click", (e) => {
      if (e.target === lbModal) closeLb();
    });
  }
}

// ============================================================================
// ADMINISTRATIVE AUTH / CREDENTIAL PANEL
// ============================================================================

function setupAdministrationAuth() {
  const loginForm = document.getElementById("admin-login-form") as HTMLFormElement;
  const passInput = document.getElementById("admin-password-input") as HTMLInputElement;
  const authCard = document.getElementById("admin-auth-card");
  const adminPanel = document.getElementById("admin-dashboard-panel");
  const loginError = document.getElementById("admin-login-error");
  const logoutBtn = document.getElementById("btn-admin-logout");
  const googleBtn = document.getElementById("btn-google-login");

  if (!loginForm || !passInput || !authCard || !adminPanel) return;

  // Handles admin PIN validation (Preset: 123456)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pin = passInput.value.trim();

    if (pin === "123456") {
      authCard.classList.add("hidden");
      adminPanel.classList.remove("hidden");
      showToast("Gembok Pengurus Terbuka (Silaturahmi Simulasi). Wilujeng Sumping!");
      passInput.value = "";
    } else {
      if (loginError) loginError.classList.remove("hidden");
      passInput.focus();
    }
  });

  // Google Sign-In with popup
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const email = result.user.email;
        authCard.classList.add("hidden");
        adminPanel.classList.remove("hidden");
        
        if (email === "simplusewebproject@gmail.com") {
          showToast(`Gembok Terbuka! Admin Utama: ${email}`);
        } else {
          showToast(`Masuk sebagai ${email} (Mode Simulasi/Tamu)`);
        }
      } catch (err: any) {
        showToast("Gagal masuk dengan Google: " + err.message, false);
      }
    });
  }

  // Logout Admin Board
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (auth.currentUser) {
        await signOut(auth).catch(() => {});
      }
      adminPanel.classList.add("hidden");
      authCard.classList.remove("hidden");
      showToast("Keluar dari panel admin.", false);
    });
  }
}

// ============================================================================
// ACTION CRUD FORM SUBMIT HANDLERS
// ============================================================================

function setupFormsInteraction() {
  
  // A. VOLUNTEER REGISTRATION FORM SUBMIT
  const volForm = document.getElementById("volunteer-form") as HTMLFormElement;
  if (volForm) {
    volForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameVal = (document.getElementById("v-name") as HTMLInputElement).value;
      const emailVal = (document.getElementById("v-email") as HTMLInputElement).value;
      const phoneVal = (document.getElementById("v-phone") as HTMLInputElement).value;
      const ageVal = parseInt((document.getElementById("v-age") as HTMLInputElement).value);
      const divVal = (document.getElementById("v-division") as HTMLSelectElement).value;
      const motVal = (document.getElementById("v-motivation") as HTMLTextAreaElement).value;
      const fotoVal = (document.getElementById("v-foto-url") as HTMLInputElement)?.value || "";

      const newApplicant: PendaftarRelawan = {
        id: "app_" + Date.now(),
        nama: nameVal,
        email: emailVal,
        no_hp: phoneVal,
        usia: ageVal,
        divisi_pilihan: divVal,
        motivasi: motVal,
        foto_url: fotoVal,
        status: "pending",
        tanggal_daftar: new Date().toISOString().split("T")[0]
      };

      store.applicants.push(newApplicant);
      store.save();

      if (store.dbAvailable) {
        try {
          const { id, ...supabaseData } = newApplicant;
          await setDoc(doc(db, "pendaftar_relawan", id), supabaseData);
        } catch (error) {
          handleSupabaseError(error, OperationType.WRITE, `pendaftar_relawan/${newApplicant.id}`);
        }
      }

      showToast("Hatur Nuhun! Formulir pendaftaran berhasil diserahkan ke komite RIKSA.");
      volForm.reset();
      // Reset foto upload state
      const fotoUrlEl = document.getElementById("v-foto-url") as HTMLInputElement;
      const fotoPreview = document.getElementById("v-foto-preview") as HTMLImageElement;
      const fotoLabel = document.getElementById("v-foto-label");
      const fotoIcon = document.getElementById("v-foto-icon");
      if (fotoUrlEl) fotoUrlEl.value = "";
      if (fotoPreview) { fotoPreview.src = ""; fotoPreview.classList.add("hidden"); }
      if (fotoLabel) fotoLabel.textContent = "Klik atau seret foto ke sini";
      if (fotoIcon) fotoIcon.classList.remove("hidden");
      
      // Refresh admin screens just in case
      renderAdmin();
    });
  }

  // A2. FOTO UPLOAD HANDLER (volunteer form)
  const fotoInput = document.getElementById("v-foto-input") as HTMLInputElement;
  const fotoDropzone = document.getElementById("v-foto-dropzone");
  if (fotoInput && fotoDropzone) {
    const handleFotoFile = async (file: File) => {
      const maxMB = 5;
      if (file.size > maxMB * 1024 * 1024) {
        const errEl = document.getElementById("v-foto-error");
        if (errEl) { errEl.textContent = `Ukuran file maksimal ${maxMB}MB.`; errEl.classList.remove("hidden"); }
        return;
      }
      const errEl = document.getElementById("v-foto-error");
      if (errEl) errEl.classList.add("hidden");

      // Show spinner
      const spinner = document.getElementById("v-foto-spinner");
      const labelEl = document.getElementById("v-foto-label");
      const iconEl = document.getElementById("v-foto-icon");
      if (spinner) { spinner.classList.remove("hidden"); spinner.style.display = "flex"; }
      if (labelEl) labelEl.classList.add("hidden");
      if (iconEl) iconEl.classList.add("hidden");

      const url = await uploadFileToCloudinary(file, "v-foto-url", "v-foto-preview");

      if (spinner) { spinner.classList.add("hidden"); spinner.style.display = ""; }
      if (url) {
        // Show preview
        const preview = document.getElementById("v-foto-preview") as HTMLImageElement;
        if (preview) { preview.src = url; preview.classList.remove("hidden"); }
        if (labelEl) { labelEl.textContent = "✅ Foto berhasil diupload"; labelEl.classList.remove("hidden"); }
      } else {
        if (labelEl) labelEl.classList.remove("hidden");
        if (iconEl) iconEl.classList.remove("hidden");
      }
    };

    fotoInput.addEventListener("change", () => {
      if (fotoInput.files?.[0]) handleFotoFile(fotoInput.files[0]);
    });

    // Drag & drop support
    fotoDropzone.addEventListener("dragover", (e) => { e.preventDefault(); fotoDropzone.classList.add("bg-amber-50"); });
    fotoDropzone.addEventListener("dragleave", () => fotoDropzone.classList.remove("bg-amber-50"));
    fotoDropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      fotoDropzone.classList.remove("bg-amber-50");
      const file = (e as DragEvent).dataTransfer?.files?.[0];
      if (file && file.type.startsWith("image/")) handleFotoFile(file);
    });
  }

  // B. ADMIN PROFILE UPDATE FORM SUBMIT
  const generalForm = document.getElementById("dash-form-general") as HTMLFormElement;
  if (generalForm) {
    generalForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      store.general.nama_org = (document.getElementById("adm-g-nama") as HTMLInputElement).value;
      store.general.tagline = (document.getElementById("adm-g-tagline") as HTMLInputElement).value;
      store.general.visi = (document.getElementById("adm-g-visi") as HTMLTextAreaElement).value;
      store.general.misi = (document.getElementById("adm-g-misi") as HTMLTextAreaElement).value;
      store.general.sejarah = (document.getElementById("adm-g-sejarah") as HTMLTextAreaElement).value;
      store.general.email = (document.getElementById("adm-g-email") as HTMLInputElement).value;
      store.general.telp = (document.getElementById("adm-g-telp") as HTMLInputElement).value;
      store.general.alamat = (document.getElementById("adm-g-alamat") as HTMLInputElement).value;
      store.general.instagram = (document.getElementById("adm-g-instagram") as HTMLInputElement).value;
      store.general.youtube = (document.getElementById("adm-g-youtube") as HTMLInputElement).value;
      store.general.hero_image_url = (document.getElementById("adm-g-hero-image-url") as HTMLInputElement)?.value || "";
      store.general.hero_overlay_color = (document.getElementById("adm-g-hero-overlay-color") as HTMLInputElement)?.value || "#3b1f0a";
      store.general.hero_overlay_opacity = parseFloat((document.getElementById("adm-g-hero-overlay-opacity") as HTMLInputElement)?.value || "0");

      store.save();

      if (store.dbAvailable) {
        try {
          await setDoc(doc(db, "settings", "general"), store.general);
        } catch (error) {
          handleSupabaseError(error, OperationType.WRITE, "settings/general");
        }
      }

      showToast("Profil organisasi berhasil diperbaharui di Supabase.");
      
      // Sync layouts immediately
      renderBeranda();
    });
  }

  // C. ADMIN RECRUITMENT FORM CONFIG SUBMIT
  const recForm = document.getElementById("dash-form-recruitment") as HTMLFormElement;
  const admRActiveCheckbox = document.getElementById("adm-r-active") as HTMLInputElement;
  const admRStatusLabel = document.getElementById("adm-r-status-label");

  if (admRActiveCheckbox && admRStatusLabel) {
    admRActiveCheckbox.addEventListener("change", () => {
      const isChecked = admRActiveCheckbox.checked;
      admRStatusLabel.textContent = isChecked ? "DIBUKA" : "DITUTUP";
      admRStatusLabel.className = isChecked 
        ? "ml-3 text-xs font-bold text-emerald-600 uppercase tracking-widest leading-none" 
        : "ml-3 text-xs font-bold text-red-500 uppercase tracking-widest leading-none";
    });
  }

  if (recForm) {
    recForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      store.recruitment.isActive = (document.getElementById("adm-r-active") as HTMLInputElement).checked;
      store.recruitment.judul = (document.getElementById("adm-r-judul") as HTMLInputElement).value;
      store.recruitment.kuota = parseInt((document.getElementById("adm-r-kuota") as HTMLInputElement).value);
      store.recruitment.tanggal_tutup = (document.getElementById("adm-r-tanggal") as HTMLInputElement).value;
      
      const commaDiv = (document.getElementById("adm-r-divisi") as HTMLInputElement).value;
      store.recruitment.divisi_tersedia = commaDiv.split(",").map(d => d.trim()).filter(d => d !== "");
      
      store.recruitment.deskripsi = (document.getElementById("adm-r-deskripsi") as HTMLTextAreaElement).value;

      store.save();

      if (store.dbAvailable) {
        try {
          await setDoc(doc(db, "settings", "recruitment"), store.recruitment);
        } catch (error) {
          handleSupabaseError(error, OperationType.WRITE, "settings/recruitment");
        }
      }

      showToast("Parameter rekrutmen berhasil diperbaharui.");
      
      // Update screens
      renderRelawan();
    });
  }

  // D. ADMIN ARTICLE CREATOR FORM SUBMIT
  const artForm = document.getElementById("dash-form-new-article") as HTMLFormElement;
  if (artForm) {
    artForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = (document.getElementById("adm-b-judul") as HTMLInputElement).value;
      const writer = (document.getElementById("adm-b-penulis") as HTMLInputElement).value;
      const thumb = (document.getElementById("adm-b-thumb") as HTMLInputElement).value;
      const pubStatus = (document.getElementById("adm-b-status") as HTMLSelectElement).value as "published" | "draft";
      const contentText = (document.getElementById("adm-b-isi") as HTMLTextAreaElement).value;

      const newArt: Berita = {
        id: "art_" + Date.now(),
        judul: title,
        slug: title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-"),
        isi: contentText,
        thumbnail_url: thumb,
        tanggal: new Date().toISOString().split("T")[0],
        status: pubStatus,
        penulis: writer
      };

      store.news.unshift(newArt);
      store.save();

      if (store.dbAvailable) {
        try {
          const { id, ...supabaseData } = newArt;
          await setDoc(doc(db, "berita", id), supabaseData);
        } catch (error) {
          handleSupabaseError(error, OperationType.WRITE, `berita/${newArt.id}`);
        }
      }

      showToast("Warta artikel berhasil diterbitkan ke pusaka.");
      artForm.reset();

      // Refresh listings
      renderBerita();
      renderAdmin();
    });
  }

  // E. REGISTER NEWS AND GALLERY CATEGORY PILTRATIONS EVENT CLICKS
  const newsCategoryBtns = document.querySelectorAll(".filter-news-btn");
  newsCategoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      newsCategoryBtns.forEach(b => b.classList.remove("active", "bg-[var(--color-primary)]", "text-white"));
      btn.classList.add("active", "bg-[var(--color-primary)]", "text-white");
      
      const filterKey = btn.getAttribute("data-status") || "all";
      renderBerita(filterKey);
    });
  });

  const galleryCategoryBtns = document.querySelectorAll(".filter-gallery-btn");
  galleryCategoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      galleryCategoryBtns.forEach(b => b.classList.remove("active", "bg-[var(--color-primary)]", "text-white"));
      btn.classList.add("active", "bg-[var(--color-primary)]", "text-white");

      const filterCat = btn.getAttribute("data-category") || "all";
      renderGaleri(filterCat);
    });
  });
}

function initializeCalculators() {
  const scaleSelect = document.getElementById("calc-scale") as HTMLSelectElement | null;
  const qtyInput = document.getElementById("calc-qty") as HTMLInputElement | null;
  const foodRadios = document.getElementsByName("calc-food");

  const crewEl = document.getElementById("res-crew");
  const mealsEl = document.getElementById("res-meals");
  const soundEl = document.getElementById("res-sound");
  const costEl = document.getElementById("res-cost");

  function runEstimates() {
    if (!scaleSelect || !qtyInput || !crewEl || !mealsEl || !soundEl || !costEl) return;

    const scale = scaleSelect.value;
    const qty = Math.max(5, parseInt(qtyInput.value) || 0);

    // Get selected food multiplication factor
    let foodMultiplier = 45000; // Nasi Timbel
    foodRadios.forEach((r: any) => {
      if (r.checked) {
        if (r.value === "suro") foodMultiplier = 30000;
        if (r.value === "pasar") foodMultiplier = 15000;
      }
    });

    // 1. Crew estimation: Rereongan 1:8, Tatatapa 1:12, Ruatan 1:15
    let crewRatio = 12;
    if (scale === "rereongan") crewRatio = 8;
    if (scale === "ruatan") crewRatio = 15;
    const crewCount = Math.max(2, Math.round(qty / crewRatio));

    // 2. Meal portions: 1.2 portions per participant (including crew fallback)
    const mealPortions = Math.round(qty * 1.2);

    // 3. Sound requirement:
    let soundStr = "Small (500W)";
    if (qty > 50 && qty <= 250) soundStr = "Medium (2kW)";
    if (qty > 250) soundStr = "Large Professional (8kW)";

    // 4. Budget cost: Catering + Logistical Overhead base per scale
    let baseOverhead = 500000;
    if (scale === "tatatapa") baseOverhead = 2000000;
    if (scale === "ruatan") baseOverhead = 7500000;

    const totalEstimate = baseOverhead + (mealPortions * foodMultiplier) + (crewCount * 150000);

    // Update views
    crewEl.textContent = `${crewCount} Orang`;
    mealsEl.textContent = `${mealPortions} Porsi`;
    soundEl.textContent = soundStr;
    
    // Format Cost in Indonesian Rupiah beautifully (e.g. "Rp 4.5 Juta" or "Rp 450 Ribu")
    if (totalEstimate >= 1000000) {
      costEl.textContent = `Rp ${(totalEstimate / 1000000).toFixed(1)} Juta`;
    } else {
      costEl.textContent = `Rp ${(totalEstimate / 1000).toFixed(0)} Ribu`;
    }
  }

  // Bind change listeners
  if (scaleSelect) {
    scaleSelect.addEventListener("change", () => {
      // Auto adjust qty based on scale to give helpful template value
      if (scaleSelect.value === "rereongan" && qtyInput) qtyInput.value = "30";
      if (scaleSelect.value === "tatatapa" && qtyInput) qtyInput.value = "100";
      if (scaleSelect.value === "ruatan" && qtyInput) qtyInput.value = "500";
      runEstimates();
    });
  }

  if (qtyInput) {
    qtyInput.addEventListener("input", runEstimates);
  }
  
  foodRadios.forEach(radio => {
    radio.addEventListener("change", runEstimates);
  });

  // RUN Estimations once on startup
  runEstimates();

  // B. TALLY WORK REGISTER
  const tallyEl = document.getElementById("tally-count");
  const btnPlus = document.getElementById("btn-tally-plus");
  const btnPlus5 = document.getElementById("btn-tally-plus5");
  const btnMinus = document.getElementById("btn-tally-minus");
  const btnReset = document.getElementById("btn-tally-reset");
  const btnSave = document.getElementById("btn-tally-save");

  // Load starting tally value from client standard state
  let tallyValue = 0; // tally tidak lagi disimpan lokal
  
  function updateTallyUI() {
    if (!tallyEl) return;
    // Format to 3 padding zeroes (e.g. "003")
    tallyEl.textContent = tallyValue.toString().padStart(3, "0");
  }

  if (btnPlus) {
    btnPlus.addEventListener("click", () => {
      tallyValue++;
      updateTallyUI();
    });
  }
  if (btnPlus5) {
    btnPlus5.addEventListener("click", () => {
      tallyValue += 5;
      updateTallyUI();
    });
  }
  if (btnMinus) {
    btnMinus.addEventListener("click", () => {
      tallyValue = Math.max(0, tallyValue - 1);
      updateTallyUI();
    });
  }
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      tallyValue = 0;
      updateTallyUI();
    });
  }
  if (btnSave) {
    btnSave.addEventListener("click", () => {
      // tally tidak lagi disimpan lokal
      showToast(`State loket (${tallyValue}) berhasil disimpan offline!`);
    });
  }

  updateTallyUI();
}

// ============================================================================
// SUPABASE CLIENT CONNECTION & ERROR HANDLERS (OPTIONAL GROUND RUNS)
// ============================================================================

function trySupabaseConnector() {
  const warningBanner = document.getElementById("db-warning-banner");
  if (!warningBanner) return;

  // Default: sembunyikan banner dulu, tunggu hasil cek koneksi
  warningBanner.classList.add("hidden");

  // Ping Supabase pakai dokumen yang sudah ada
  const testRef = doc(db, "settings", "general");

  onSnapshot(
    testRef,
    { includeMetadataChanges: true },
    (snapshot) => {
      const isOnline = !snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites;
      if (isOnline) {
        // Berhasil konek ke server — sembunyikan banner
        warningBanner.classList.add("hidden");
      } else {
        // Dari cache / belum sync ke server — tampilkan banner
        warningBanner.classList.remove("hidden");
      }
    },
    (error) => {
      // Gagal konek (network error, permission, dll) — tampilkan banner
      console.warn("Supabase connection check failed:", error);
      warningBanner.classList.remove("hidden");
    }
  );
}

// ============================================================================
// SYSTEM INITS RUNNER ON DOCUMENT READINESS
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Try configuring any Supabase connection checks gracefully
  trySupabaseConnector();

  // Load and Render Home screen parameters
  renderBeranda();

  // Load and Render News Articles
  renderBerita();

  // Load and Render Galleries
  renderGaleri();

  // Load and Render structures board
  renderStruktur();

  // Load and Render volunteer states and registrations forms setups
  renderRelawan();

  // Pre-load form values in the admin dashboards
  renderAdmin();

  // Setup Aksara interactive training boards and phonetic modifications Keypads
  initializeAksaraKeyboard();

  // Set up click listeners for structural navigators
  setupNavigation();

  // Secure Administrative panel PIN authentication setups
  setupAdministrationAuth();

  // Setup live submit listeners on profile changes, rekrutments, articles creation
  setupFormsInteraction();

  // Setup interactive calculators and tally meters
  initializeCalculators();
  
  // Intersection Observer for scroll-based section fade-ins
  const hiddenElements = document.querySelectorAll(".section-hidden");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });
  hiddenElements.forEach(el => observer.observe(el));

  // Quick fade entries styles initialization
  document.body.style.opacity = "1";
});
