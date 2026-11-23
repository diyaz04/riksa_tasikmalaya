/**
 * sundaOcrEngine.ts
 * Engine OCR Mandiri & Offline Khusus Aksara Sunda Baku (Kaganga)
 * 100% Client-Side di Browser — Tanpa API Eksternal / Tanpa Gemini API
 * 
 * Inovasi Utama:
 * 1. Pemuatan Font Asli Noto Sans Sundanese secara terverifikasi (document.fonts.ready)
 * 2. Pembersihan Otomatis Garis Bingkai/Frame Foto & Noise Tepian
 * 3. Pemisahan Jembatan Ligatur (*Oversized Ligature Splitting*):
 *    - Memotong jembatan ligatur horizontal tipis antar huruf (seperti antara ᮞ dan ᮙ) tanpa membelah goresan huruf majemuk
 * 4. Penggabungan Suku Kata Cerdas (*Smart Syllable Clustering*):
 *    - Menyatukan goresan terpisah huruf seperti ᮞ (gap 2-3px) agar tidak terpecah menjadi angka 4
 *    - Menyatukan rarangken di luhur/handap (ᮤ, ᮥ, ᮨ, ᮩ, ᮀ, ᮁ) dengan konsonan induk
 *    - Menyatukan rarangken di gigir (᮪ pamaéh, ᮂ pangwisad) yang berdampingan rapat
 * 5. Pustaka Template Komprehensif (Swara + Ngalagena + Kombinasi Suku Kata Baku)
 * 6. Transliterasi Latin & Terjemahan Makna Budaya Indonesia Sesuai Mesin Alih Aksara Baku
 */

import { translateSundaToLatin } from './transliterate';
import { NOTO_SUNDA_BOLD_B64, NOTO_SUNDA_REGULAR_B64 } from './sundaFontData';

export interface AksaraGlyphDef {
  char: string;
  name: string;
  latin: string;
  type: 'swara' | 'ngalagena' | 'rarangken' | 'angka' | 'suku-kata';
  position?: 'luhur' | 'handap' | 'gigir' | 'utama';
}

// ── 1. Aksara Dasar (Swara, Ngalagena, Angka) ──
export const BASE_AKSARA_GLYPHS: AksaraGlyphDef[] = [
  // Swara (Vokal Mandiri)
  { char: "ᮃ", name: "Swara A", latin: "a", type: "swara", position: "utama" },
  { char: "ᮄ", name: "Swara I", latin: "i", type: "swara", position: "utama" },
  { char: "ᮅ", name: "Swara U", latin: "u", type: "swara", position: "utama" },
  { char: "ᮆ", name: "Swara É", latin: "é", type: "swara", position: "utama" },
  { char: "ᮇ", name: "Swara O", latin: "o", type: "swara", position: "utama" },
  { char: "ᮈ", name: "Swara E", latin: "e", type: "swara", position: "utama" },
  { char: "ᮉ", name: "Swara Eu", latin: "eu", type: "swara", position: "utama" },

  // Ngalagena (Konsonan Utama)
  { char: "ᮊ", name: "Ngalagena Ka", latin: "ka", type: "ngalagena", position: "utama" },
  { char: "ᮌ", name: "Ngalagena Ga", latin: "ga", type: "ngalagena", position: "utama" },
  { char: "ᮍ", name: "Ngalagena Nga", latin: "nga", type: "ngalagena", position: "utama" },
  { char: "ᮎ", name: "Ngalagena Ca", latin: "ca", type: "ngalagena", position: "utama" },
  { char: "ᮏ", name: "Ngalagena Ja", latin: "ja", type: "ngalagena", position: "utama" },
  { char: "ᮑ", name: "Ngalagena Nya", latin: "nya", type: "ngalagena", position: "utama" },
  { char: "ᮒ", name: "Ngalagena Ta", latin: "ta", type: "ngalagena", position: "utama" },
  { char: "ᮓ", name: "Ngalagena Da", latin: "da", type: "ngalagena", position: "utama" },
  { char: "ᮔ", name: "Ngalagena Na", latin: "na", type: "ngalagena", position: "utama" },
  { char: "ᮕ", name: "Ngalagena Pa", latin: "pa", type: "ngalagena", position: "utama" },
  { char: "ᮘ", name: "Ngalagena Ba", latin: "ba", type: "ngalagena", position: "utama" },
  { char: "ᮙ", name: "Ngalagena Ma", latin: "ma", type: "ngalagena", position: "utama" },
  { char: "ᮚ", name: "Ngalagena Ya", latin: "ya", type: "ngalagena", position: "utama" },
  { char: "ᮛ", name: "Ngalagena Ra", latin: "ra", type: "ngalagena", position: "utama" },
  { char: "ᮜ", name: "Ngalagena La", latin: "la", type: "ngalagena", position: "utama" },
  { char: "ᮝ", name: "Ngalagena Wa", latin: "wa", type: "ngalagena", position: "utama" },
  { char: "ᮞ", name: "Ngalagena Sa", latin: "sa", type: "ngalagena", position: "utama" },
  { char: "ᮠ", name: "Ngalagena Ha", latin: "ha", type: "ngalagena", position: "utama" },

  // Konsonan serapan
  { char: "ᮖ", name: "Ngalagena Fa", latin: "fa", type: "ngalagena", position: "utama" },
  { char: "ᮗ", name: "Ngalagena Va", latin: "va", type: "ngalagena", position: "utama" },
  { char: "ᮋ", name: "Ngalagena Qa", latin: "qa", type: "ngalagena", position: "utama" },
  { char: "ᮐ", name: "Ngalagena Za", latin: "za", type: "ngalagena", position: "utama" },
  { char: "ᮟ", name: "Ngalagena Xa", latin: "xa", type: "ngalagena", position: "utama" },
  { char: "ᮮ", name: "Ngalagena Kha", latin: "kha", type: "ngalagena", position: "utama" },
  { char: "ᮯ", name: "Ngalagena Sya", latin: "sya", type: "ngalagena", position: "utama" },

  // Angka Sunda
  { char: "᮰", name: "Angka Nol", latin: "0", type: "angka", position: "utama" },
  { char: "᮱", name: "Angka Hiji", latin: "1", type: "angka", position: "utama" },
  { char: "᮲", name: "Angka Dua", latin: "2", type: "angka", position: "utama" },
  { char: "᮳", name: "Angka Tilu", latin: "3", type: "angka", position: "utama" },
  { char: "᮴", name: "Angka Opat", latin: "4", type: "angka", position: "utama" },
  { char: "᮵", name: "Angka Lima", latin: "5", type: "angka", position: "utama" },
  { char: "᮶", name: "Angka Genep", latin: "6", type: "angka", position: "utama" },
  { char: "᮷", name: "Angka Tujuh", latin: "7", type: "angka", position: "utama" },
  { char: "᮸", name: "Angka Dalapan", latin: "8", type: "angka", position: "utama" },
  { char: "᮹", name: "Angka Salapan", latin: "9", type: "angka", position: "utama" }
];

const MAIN_CONSONANTS = [
  { char: "ᮊ", stem: "k", name: "Ka" },
  { char: "ᮌ", stem: "g", name: "Ga" },
  { char: "ᮍ", stem: "ng", name: "Nga" },
  { char: "ᮎ", stem: "c", name: "Ca" },
  { char: "ᮏ", stem: "j", name: "Ja" },
  { char: "ᮑ", stem: "ny", name: "Nya" },
  { char: "ᮒ", stem: "t", name: "Ta" },
  { char: "ᮓ", stem: "d", name: "Da" },
  { char: "ᮔ", stem: "n", name: "Na" },
  { char: "ᮕ", stem: "p", name: "Pa" },
  { char: "ᮘ", stem: "b", name: "Ba" },
  { char: "ᮙ", stem: "m", name: "Ma" },
  { char: "ᮚ", stem: "y", name: "Ya" },
  { char: "ᮛ", stem: "r", name: "Ra" },
  { char: "ᮜ", stem: "l", name: "La" },
  { char: "ᮝ", stem: "w", name: "Wa" },
  { char: "ᮞ", stem: "s", name: "Sa" },
  { char: "ᮠ", stem: "h", name: "Ha" }
];

/**
 * Membangun pustaka karakter komprehensif termasuk suku kata majemuk (Konsonan + Rarangken)
 */
export function buildComprehensiveGlyphLibrary(): AksaraGlyphDef[] {
  const library: AksaraGlyphDef[] = [...BASE_AKSARA_GLYPHS];

  for (const c of MAIN_CONSONANTS) {
    // 1. Konsonan + Pamaéh (᮪) -> Huruf Mati (misal: ᮙ᮪ = m, ᮔ᮪ = n, ᮊ᮪ = k)
    library.push({
      char: `${c.char}᮪`,
      name: `${c.name} + Pamaéh (mati: ${c.stem})`,
      latin: c.stem,
      type: "suku-kata",
      position: "utama"
    });

    // 2. Konsonan + Panyuku (ᮥ) -> Vokal U (misal: ᮕᮥ = pu, ᮞᮥ = su, ᮊᮥ = ku)
    library.push({
      char: `${c.char}ᮥ`,
      name: `${c.name} + Panyuku (${c.stem}u)`,
      latin: `${c.stem}u`,
      type: "suku-kata",
      position: "utama"
    });

    // 3. Konsonan + Panghulu (ᮤ) -> Vokal I (misal: ᮛᮤ = ri, ᮞᮤ = si, ᮕᮤ = pi)
    library.push({
      char: `${c.char}ᮤ`,
      name: `${c.name} + Panghulu (${c.stem}i)`,
      latin: `${c.stem}i`,
      type: "suku-kata",
      position: "utama"
    });

    // 4. Konsonan + Panyecek (ᮀ) -> Akhiran +ng (misal: ᮞᮀ = sang, ᮏᮀ = jang)
    library.push({
      char: `${c.char}ᮀ`,
      name: `${c.name} + Panyecek (${c.stem}ang)`,
      latin: `${c.stem}ang`,
      type: "suku-kata",
      position: "utama"
    });

    // 5. Konsonan + Panglayar (ᮁ) -> Akhiran +r (misal: ᮒᮁ = tar, ᮞᮁ = sar)
    library.push({
      char: `${c.char}ᮁ`,
      name: `${c.name} + Panglayar (${c.stem}ar)`,
      latin: `${c.stem}ar`,
      type: "suku-kata",
      position: "utama"
    });

    // 6. Konsonan + Pangwisad (ᮂ) -> Akhiran +h (misal: ᮞᮂ = sah, ᮛᮂ = rah)
    library.push({
      char: `${c.char}ᮂ`,
      name: `${c.name} + Pangwisad (${c.stem}ah)`,
      latin: `${c.stem}ah`,
      type: "suku-kata",
      position: "utama"
    });

    // 7. Konsonan + Pamepet (ᮨ) -> Vokal E (misal: ᮞᮨ = se, ᮊᮨ = ke)
    library.push({
      char: `${c.char}ᮨ`,
      name: `${c.name} + Pamepet (${c.stem}e)`,
      latin: `${c.stem}e`,
      type: "suku-kata",
      position: "utama"
    });

    // 8. Konsonan + Paneuleung (ᮩ) -> Vokal EU (misal: ᮞᮩ = seu, ᮙᮩ = meu)
    library.push({
      char: `${c.char}ᮩ`,
      name: `${c.name} + Paneuleung (${c.stem}eu)`,
      latin: `${c.stem}eu`,
      type: "suku-kata",
      position: "utama"
    });

    // 9. Konsonan + Panolong (ᮧ) -> Vokal O (misal: ᮞᮧ = so, ᮊᮧ = ko)
    library.push({
      char: `${c.char}ᮧ`,
      name: `${c.name} + Panolong (${c.stem}o)`,
      latin: `${c.stem}o`,
      type: "suku-kata",
      position: "utama"
    });

    // 10. Panéléng (ᮦ) + Konsonan -> Vokal É (misal: ᮦᮞ = sé, ᮦᮕ = pé)
    library.push({
      char: `ᮦ${c.char}`,
      name: `Panéléng + ${c.name} (${c.stem}é)`,
      latin: `${c.stem}é`,
      type: "suku-kata",
      position: "utama"
    });
  }

  const SPECIAL_LIGATURES: AksaraGlyphDef[] = [
    { char: "ᮏᮨᮀ", name: "Ja + Pamepet + Panyecek (jeng)", latin: "jeng", type: "suku-kata", position: "utama" },
    { char: "ᮕᮤᮀ", name: "Pa + Panghulu + Panyecek (ping)", latin: "ping", type: "suku-kata", position: "utama" },
    { char: "ᮞᮤᮂ", name: "Sa + Panghulu + Pangwisad (sih)", latin: "sih", type: "suku-kata", position: "utama" },
    { char: "ᮞᮂ", name: "Sa + Pangwisad (sah)", latin: "sah", type: "suku-kata", position: "utama" },
    { char: "ᮞᮥᮂ", name: "Sa + Panyuku + Pangwisad (suh)", latin: "suh", type: "suku-kata", position: "utama" },
    { char: "ᮜᮤᮂ", name: "La + Panghulu + Pangwisad (lih)", latin: "lih", type: "suku-kata", position: "utama" },
    { char: "ᮜᮥᮂ", name: "La + Panyuku + Pangwisad (luh)", latin: "luh", type: "suku-kata", position: "utama" },
    { char: "ᮞᮥᮙ᮪", name: "Sa + Panyuku + Ma + Pamaéh (sum)", latin: "sum", type: "suku-kata", position: "utama" },
    { char: "ᮞᮥᮀ", name: "Sa + Panyuku + Panyecek (sung)", latin: "sung", type: "suku-kata", position: "utama" }
  ];

  library.push(...SPECIAL_LIGATURES);
  return library;
}

export const ALL_AKSARA_GLYPHS = buildComprehensiveGlyphLibrary();

export interface RecognizedLetter {
  char: string;
  name: string;
  latin: string;
  type: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  thumbnail: string;
}

export interface OcrScanResult {
  aksaraText: string;
  latinText: string;
  translationId: string;
  letters: RecognizedLetter[];
  durationMs: number;
  processedImageUrl: string;
  debugInfo?: string;
}

// ── Kamus Kosakata Sunda - Indonesia ──
export const SUNDA_DICTIONARY: Record<string, string> = {
  "sampurasun": "Salam santun luhur khas Sunda: saling mendoakan keselamatan, kemurnian niat, serta berkah karuhun",
  "rampes": "Jawaban dari salam sampurasun (terima kasih, semoga diberkahi dan selamat)",
  "riksa": "Merawat, menjaga, melindungi serta melestarikan warisan adiluhung Sunda",
  "riksa sukapura": "Menjaga serta melestarikan keagungan pusaka dan budaya Sukapura Tasikmalaya",
  "silih asih silih asah silih asuh": "Tiga pilar falsafah agung kemanusiaan Sunda: saling mengasihi, saling mendidik/berbagi ilmu, dan saling membimbing/melindungi",
  "silih asah silih asih silih asuh": "Tiga pilar falsafah agung kemanusiaan Sunda: saling menajamkan ilmu/kecerdasan, saling mengasihi, dan saling membimbing/melindungi",
  "silih asih asah asuh": "Falsafah kemanusiaan Sunda: saling mengasihi (asih), menajamkan pikiran (asah), dan membimbing sesama (asuh)",
  "silih": "Saling / timbal balik dalam kebaikan",
  "asih": "Kasih sayang tulus lahir dan batin",
  "asah": "Mengasah ketajaman ilmu pengetahuan & kecerdasan budi",
  "asuh": "Membimbing, mengasuh, serta melindungi sesama",
  "riuangan": "Perkumpulan, majelis silaturahmi, paguyuban bermusyawarah",
  "aksara sunda": "Sistem tulisan tradisional suku Sunda (aksara Kaganga baku)",
  "aksara": "Sistem lambang grafis tulisan / huruf",
  "sunda": "Tanah Pasundan / suku Sunda / Parahyangan",
  "parahyangan": "Tanah para hyang / dataran tinggi pegunungan Jawa Barat nan asri",
  "priangan": "Kawasan dataran tinggi Parahyangan",
  "sukapura": "Nama historis kadipaten leluhur Tasikmalaya",
  "tasikmalaya": "Kota/Kabupaten Tasikmalaya di tatar Priangan Timur",
  "wilujeng sumping": "Selamat datang di tanah Pasundan yang ramah dan damai",
  "wilujeng": "Selamat / selamat sejahtera",
  "sumping": "Datang / hadir berkunjung",
  "wilujeng enjing": "Selamat pagi",
  "wilujeng siang": "Selamat siang",
  "wilujeng sonten": "Selamat sore",
  "wilujeng wengi": "Selamat malam",
  "kujang": "Senjata pusaka khas Sunda yang melambangkan kekuatan, kehormatan, dan filosofi hidup",
  "kujang pasundan": "Pusaka kehormatan dan jati diri ksatria tanah Sunda",
  "iket": "Kain penutup kepala tradisional Sunda penuh makna filosofis",
  "angklung": "Instrumen musik bambu pentatonis khas Sunda warisan dunia UNESCO",
  "lemah cai": "Tanah air tumpah darah tempat kelahiran tercinta",
  "silih asih": "Saling mengasihi dan mengutamakan cinta kasih sesama manusia",
  "silih asah": "Saling mencerdaskan dan mempertajam wawasan keilmuan",
  "silih asuh": "Saling mengayomi, membimbing, dan menjaga",
  "cageur": "Sehat jasmani dan rohani",
  "bageur": "Baik budi pekerti, ramah dan santun",
  "bener": "Jujur, lurus, dan berintegritas",
  "pinter": "Cerdas dan berpengetahuan luas",
  "singer": "Terampil, tanggap, dan cekatan",
  "cageur bageur bener pinter singer": "Pancaniti karakter manusia unggul Sunda berakhlak mulia",
  "pajajaran": "Kerajaan Sunda Pakuan Pajajaran yang masyhur",
  "siliwangi": "Prabu Siliwangi (Sri Baduga Maharaja), raja agung pemersatu tanah Sunda",
  "galuh": "Kerajaan Galuh kuno di Priangan Timur",
  "nuhun": "Terima kasih",
  "hatur nuhun": "Terima kasih banyak atas segala kebaikannya",
  "sawangsulna": "Sama-sama / terima kasih kembali",
  "mangga": "Silakan / mari",
  "punten": "Permisi / mohon maaf",
  "damang": "Sehat walafiat",
  "kumaha damang": "Bagaimana kabarnya, sehat?",
  "babarengan": "Bersama-sama dalam kebersamaan gotong royong",
  "karuhun": "Leluhur / nenek moyang",
  "kabudayaan": "Kebudayaan / nilai adat tradisi luhur",
  "basa sunda": "Bahasa daerah Sunda",
  "totopong": "Iket penutup kepala adat Sunda",
  "sinatria": "Ksatria berjiwa patriotik dan luhur budi",
  "sauyunan": "Rukun, kompak, selaras, dan bersatu padu",
  "tatar": "Wilayah / kawasan tanah leluhur",
  "gunung": "Gunung / pegunungan yang diagungkan",
  "walungan": "Sungai yang mengalir mengairi persawahan",
  "sawah": "Sawah padi nan hijau subur",
  "bale": "Balai / pendopo tempat berkumpul warga",
  "saung": "Pondok sederhana di sawah tempat istirahat dan berkumpul",
  "karya": "Karya / buah cipta kreativitas",
  "kriya": "Kriya kerajinan tangan bernilai seni tinggi"
};

// ── In-Memory Glyph Template Cache ──
interface GlyphTemplate {
  char: string;
  name: string;
  latin: string;
  type: string;
  position: string;
  matrix: Uint8Array;      // 32 x 32 = 1024 bytes (0 atau 1)
  zoning: number[];        // 4 x 4 = 16 sub-grid density
  hProfile: number[];      // 16 horizontal bins
  vProfile: number[];      // 16 vertical bins
  aspectRatio: number;     // width / height
  density: number;         // ratio ink pixels
}

let templateCache: GlyphTemplate[] | null = null;

/**
 * Memastikan font Noto Sans Sundanese telah dimuat oleh browser sebelum me-rasterisasi template
 */
let fontLoadPromise: Promise<boolean> | null = null;

export function ensureSundaneseFontLoaded(): Promise<boolean> {
  if (fontLoadPromise) return fontLoadPromise;
  fontLoadPromise = (async () => {
    if (typeof document === 'undefined' || !document.fonts) return false;
    try {
      // 1. Muat dari embedded base64 (100% offline, instan tanpa latensi file/network)
      const faces = [
        new FontFace('Noto Sans Sundanese', `url(data:font/truetype;charset=utf-8;base64,${NOTO_SUNDA_REGULAR_B64})`, { weight: '400' }),
        new FontFace('Noto Sans Sundanese', `url(data:font/truetype;charset=utf-8;base64,${NOTO_SUNDA_BOLD_B64})`, { weight: '700' })
      ];
      for (const face of faces) {
        await face.load();
        document.fonts.add(face);
      }
      await document.fonts.ready;
    } catch (e) {
      console.warn('Fallback ke URL file lokal /fonts/:', e);
      try {
        const fallbackFaces = [
          new FontFace('Noto Sans Sundanese', "url('/fonts/NotoSansSundanese-Regular.ttf')", { weight: '400' }),
          new FontFace('Noto Sans Sundanese', "url('/fonts/NotoSansSundanese-Bold.ttf')", { weight: '700' })
        ];
        for (const face of fallbackFaces) {
          await face.load();
          document.fonts.add(face);
        }
        await document.fonts.ready;
      } catch (err) {
        console.warn('Gagal memuat font lokal Noto Sans Sundanese:', err);
      }
    }

    // Verifikasi rasterisasi aksara Sunda ᮞ pada canvas untuk memastikan font bukan tofu/fallback
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 64;
    testCanvas.height = 64;
    const testCtx = testCanvas.getContext('2d', { willReadFrequently: true });
    if (testCtx) {
      testCtx.font = "bold 36px 'Noto Sans Sundanese', serif, sans-serif";
      testCtx.fillStyle = '#000000';
      testCtx.fillText('ᮞ', 32, 40);
      const data = testCtx.getImageData(0, 0, 64, 64).data;
      let inkCount = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 100) inkCount++;
      }
      return inkCount >= 20;
    }

    return true;
  })();
  return fontLoadPromise;
}

/**
 * Inisialisasi template matriks referensi dari font Noto Sans Sundanese
 */
export async function initializeGlyphTemplates(): Promise<GlyphTemplate[]> {
  if (templateCache && templateCache.length > 0) {
    return templateCache;
  }

  const isFontOk = await ensureSundaneseFontLoaded();
  if (!isFontOk && typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }

  const templates: GlyphTemplate[] = [];
  const canvas = document.createElement('canvas');
  const size = 96;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) return [];

  for (const item of ALL_AKSARA_GLYPHS) {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Render karakter aksara Sunda asli di tengah canvas
    ctx.fillStyle = '#000000';
    ctx.font = "bold 44px 'Noto Sans Sundanese', serif, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.char, size / 2, size / 2);

    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    let minX = size, minY = size, maxX = 0, maxY = 0;
    let found = false;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (brightness < 160) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          found = true;
        }
      }
    }

    if (!found) {
      minX = 14; maxX = size - 14; minY = 14; maxY = size - 14;
    }

    const glyphW = Math.max(1, maxX - minX + 1);
    const glyphH = Math.max(1, maxY - minY + 1);
    const aspectRatio = glyphW / glyphH;

    // Normalisasi ke grid 32 x 32
    const normSize = 32;
    const normMatrix = new Uint8Array(normSize * normSize);
    let totalBlack = 0;

    for (let ny = 0; ny < normSize; ny++) {
      for (let nx = 0; nx < normSize; nx++) {
        const srcX = Math.min(size - 1, Math.max(0, Math.floor(minX + (nx / normSize) * glyphW)));
        const srcY = Math.min(size - 1, Math.max(0, Math.floor(minY + (ny / normSize) * glyphH)));
        const srcIdx = (srcY * size + srcX) * 4;
        const b = (data[srcIdx] + data[srcIdx + 1] + data[srcIdx + 2]) / 3;
        const isInk = b < 160 ? 1 : 0;
        normMatrix[ny * normSize + nx] = isInk;
        if (isInk) totalBlack++;
      }
    }

    // 16-zone density (4x4)
    const zoning: number[] = new Array(16).fill(0);
    const zoneH = normSize / 4;
    const zoneW = normSize / 4;
    for (let zy = 0; zy < 4; zy++) {
      for (let zx = 0; zx < 4; zx++) {
        let count = 0;
        for (let py = zy * zoneH; py < (zy + 1) * zoneH; py++) {
          for (let px = zx * zoneW; px < (zx + 1) * zoneW; px++) {
            if (normMatrix[Math.floor(py) * normSize + Math.floor(px)] === 1) count++;
          }
        }
        zoning[zy * 4 + zx] = count / (zoneW * zoneH);
      }
    }

    // Horizontal profile (16 bins)
    const hProfile: number[] = new Array(16).fill(0);
    for (let by = 0; by < 16; by++) {
      let count = 0;
      const yStart = Math.floor(by * 2);
      for (let y = yStart; y < yStart + 2; y++) {
        for (let x = 0; x < normSize; x++) {
          if (normMatrix[y * normSize + x] === 1) count++;
        }
      }
      hProfile[by] = count / (2 * normSize);
    }

    // Vertical profile (16 bins)
    const vProfile: number[] = new Array(16).fill(0);
    for (let bx = 0; bx < 16; bx++) {
      let count = 0;
      const xStart = Math.floor(bx * 2);
      for (let x = xStart; x < xStart + 2; x++) {
        for (let y = 0; y < normSize; y++) {
          if (normMatrix[y * normSize + x] === 1) count++;
        }
      }
      vProfile[bx] = count / (2 * normSize);
    }

    templates.push({
      char: item.char,
      name: item.name,
      latin: item.latin,
      type: item.type,
      position: item.position || 'utama',
      matrix: normMatrix,
      zoning,
      hProfile,
      vProfile,
      aspectRatio,
      density: totalBlack / (normSize * normSize)
    });
  }

  const avgDensity = templates.reduce((acc, t) => acc + t.density, 0) / Math.max(1, templates.length);
  if (avgDensity >= 0.04) {
    templateCache = templates;
  }
  return templates;
}

/**
 * Pra-pemrosesan Citra: Adaptive Thresholding (Bradley-Roth Local Integral Image)
 */
export function preprocessAdaptiveBinarize(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): { binaryData: Uint8Array; debugCanvasUrl: string } {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const numPixels = width * height;

  const gray = new Uint8Array(numPixels);
  let totalLuminance = 0;

  for (let i = 0; i < numPixels; i++) {
    const idx = i * 4;
    const val = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
    gray[i] = val;
    totalLuminance += val;
  }

  // 1. Hitung histogram kecerahan untuk deteksi polaritas cerdas (dark-mode vs normal)
  const hist = new Int32Array(256);
  for (let i = 0; i < numPixels; i++) {
    hist[gray[i]]++;
  }
  let accum = 0;
  let medianLum = 128;
  const halfPixels = Math.floor(numPixels * 0.50);
  for (let b = 0; b < 256; b++) {
    accum += hist[b];
    if (accum >= halfPixels) {
      medianLum = b;
      break;
    }
  }

  // Hanya jika mayoritas piksel (median) sangat gelap (< 80), barulah asumsikan tulisan putih di atas latar gelap
  if (medianLum < 80) {
    for (let i = 0; i < numPixels; i++) {
      gray[i] = 255 - gray[i];
    }
  }

  const integral = new Float64Array(numPixels);
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      sum += gray[idx];
      if (y === 0) {
        integral[idx] = sum;
      } else {
        integral[idx] = integral[(y - 1) * width + x] + sum;
      }
    }
  }

  const s = Math.max(12, Math.round(width / 20));
  const t = 0.15;
  const binary = new Uint8Array(numPixels);

  const debugCanvas = document.createElement('canvas');
  debugCanvas.width = width;
  debugCanvas.height = height;
  const debugCtx = debugCanvas.getContext('2d')!;
  const debugImgData = debugCtx.createImageData(width, height);
  const outD = debugImgData.data;

  const s2 = Math.floor(s / 2);

  for (let y = 0; y < height; y++) {
    const y1 = Math.max(0, y - s2);
    const y2 = Math.min(height - 1, y + s2);
    for (let x = 0; x < width; x++) {
      const x1 = Math.max(0, x - s2);
      const x2 = Math.min(width - 1, x + s2);

      const count = (x2 - x1 + 1) * (y2 - y1 + 1);
      const a = (y1 > 0 && x1 > 0) ? integral[(y1 - 1) * width + (x1 - 1)] : 0;
      const b = (y1 > 0) ? integral[(y1 - 1) * width + x2] : 0;
      const c = (x1 > 0) ? integral[y2 * width + (x1 - 1)] : 0;
      const d = integral[y2 * width + x2];
      const sum = d - b - c + a;

      const idx = y * width + x;
      const pixelVal = gray[idx];
      const isInk = (pixelVal * count) <= (sum * (1.0 - t));

      binary[idx] = isInk ? 1 : 0;

      const oIdx = idx * 4;
      if (isInk) {
        outD[oIdx] = 18;
        outD[oIdx + 1] = 60;
        outD[oIdx + 2] = 30;
        outD[oIdx + 3] = 255;
      } else {
        outD[oIdx] = 255;
        outD[oIdx + 1] = 255;
        outD[oIdx + 2] = 255;
        outD[oIdx + 3] = 255;
      }
    }
  }

  debugCtx.putImageData(debugImgData, 0, 0);

  return {
    binaryData: binary,
    debugCanvasUrl: debugCanvas.toDataURL('image/png')
  };
}

interface ComponentBox {
  id: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  area: number;
}

/**
 * Filter bingkai dan garis tepi
 */
function isBorderOrFrame(comp: ComponentBox, imgW: number, imgH: number): boolean {
  if (comp.width > imgW * 0.55 && comp.height > imgH * 0.45) return true;
  if (comp.width > imgW * 0.70) return true;
  if (comp.height > imgH * 0.70) return true;

  if (comp.width > imgW * 0.5 && comp.height <= 8) return true;
  if (comp.height > imgH * 0.5 && comp.width <= 8) return true;

  // Deteksi tepi luar kamera / margin foto (<= 4px dari tepi)
  const touchesTop = comp.minY <= 4;
  const touchesBottom = comp.maxY >= imgH - 4;
  const touchesLeft = comp.minX <= 4;
  const touchesRight = comp.maxX >= imgW - 4;
  const touchCount = (touchesTop ? 1 : 0) + (touchesBottom ? 1 : 0) + (touchesLeft ? 1 : 0) + (touchesRight ? 1 : 0);
  
  if (touchCount >= 1 && (comp.width > imgW * 0.25 || comp.height > imgH * 0.25)) return true;
  if (touchCount >= 2 && (comp.width > imgW * 0.15 || comp.height > imgH * 0.15)) return true;

  const bboxArea = comp.width * comp.height;
  if (bboxArea > 10000 && (comp.area / bboxArea) < 0.10) return true;

  return false;
}

/**
 * Segmentasi Komponen Terhubung (CCL 8-Arah)
 */
function findConnectedComponents(
  binary: Uint8Array,
  width: number,
  height: number
): ComponentBox[] {
  const visited = new Uint8Array(width * height);
  const rawComponents: ComponentBox[] = [];
  let compId = 1;

  const stackX = new Int32Array(width * height);
  const stackY = new Int32Array(width * height);
  const minCompArea = Math.max(12, Math.round((width * height) / 45000));

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const startIdx = y * width + x;
      if (binary[startIdx] === 1 && visited[startIdx] === 0) {
        let minX = x, maxX = x, minY = y, maxY = y;
        let area = 0;

        let stackPtr = 0;
        stackX[stackPtr] = x;
        stackY[stackPtr] = y;
        stackPtr++;
        visited[startIdx] = 1;

        while (stackPtr > 0) {
          stackPtr--;
          const curX = stackX[stackPtr];
          const curY = stackY[stackPtr];
          area++;

          if (curX < minX) minX = curX;
          if (curX > maxX) maxX = curX;
          if (curY < minY) minY = curY;
          if (curY > maxY) maxY = curY;

          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = curX + dx;
              const ny = curY + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIdx = ny * width + nx;
                if (binary[nIdx] === 1 && visited[nIdx] === 0) {
                  visited[nIdx] = 1;
                  stackX[stackPtr] = nx;
                  stackY[stackPtr] = ny;
                  stackPtr++;
                }
              }
            }
          }
        }

        const compW = maxX - minX + 1;
        const compH = maxY - minY + 1;

        if (area >= minCompArea && compW >= 3 && compH >= 4) {
          const comp: ComponentBox = {
            id: compId++,
            minX,
            minY,
            maxX,
            maxY,
            width: compW,
            height: compH,
            area
          };

          if (!isBorderOrFrame(comp, width, height)) {
            rawComponents.push(comp);
          }
        }
      }
    }
  }

  return rawComponents;
}

/**
 * SEGMENTASI SUKU KATA PRESISI TINGGI (Two-Phase Syllable Clustering)
 * Phase 1: Membelah komponen ligatur yang terlalu lebar (> 1.22 * avgHeight)
 * Phase 2: Memisahkan diakritik (rarangken luhur, handap, gigir) dari goresan pokok huruf (base strokes)
 * Phase 3: Menggabungkan goresan pokok yang merupakan pasangan kaki huruf majemuk (ᮞ, ᮊ, ᮔ) atau palang bertumpuk (ᮛ)
 * Phase 4: Menempelkan kembali rarangken ke huruf pokok induknya berdasarkan tumpang tindih X dan kedekatan posisi
 */
function clusterSyllableComponents(
  rawComponents: ComponentBox[],
  binary: Uint8Array,
  imgWidth: number,
  imgHeight: number
): ComponentBox[][] {
  if (rawComponents.length === 0) return [];

  // Hitung perkiraan tinggi karakter utama (base height) secara tangguh menggunakan persentil ke-70
  const candidateHeights = rawComponents
    .filter(c => c.height >= 14 && c.width >= 10 && c.width < imgWidth * 0.40 && c.height < imgHeight * 0.40)
    .map(c => c.height)
    .sort((a, b) => a - b);

  const baseHeight = candidateHeights.length > 0
    ? candidateHeights[Math.floor(candidateHeights.length * 0.70)]
    : 40;

  // 1. Membelah ligatur yang melebar tidak wajar (> 1.25 * baseHeight) dan memiliki jembatan tipis
  const splittedComps: ComponentBox[] = [];
  let nextId = 1000;

  for (const c of rawComponents) {
    if (c.width > baseHeight * 1.25) {
      let minInk = 999;
      let splitX = Math.round((c.minX + c.maxX) / 2);
      const searchStart = c.minX + Math.round(baseHeight * 0.25);
      const searchEnd = c.maxX - Math.round(baseHeight * 0.25);

      for (let x = searchStart; x <= searchEnd; x++) {
        let count = 0;
        for (let y = c.minY; y <= c.maxY; y++) {
          if (binary[y * imgWidth + x] === 1) count++;
        }
        if (count < minInk) {
          minInk = count;
          splitX = x;
        }
      }

      const isThinBridge = minInk <= Math.max(3, Math.round(baseHeight * 0.09));
      if (isThinBridge) {
        splittedComps.push({
          id: nextId++,
          minX: c.minX,
          maxX: splitX,
          minY: c.minY,
          maxY: c.maxY,
          width: splitX - c.minX + 1,
          height: c.maxY - c.minY + 1,
          area: Math.round(c.area / 2)
        });
        splittedComps.push({
          id: nextId++,
          minX: splitX + 1,
          maxX: c.maxX,
          minY: c.minY,
          maxY: c.maxY,
          width: c.maxX - splitX,
          height: c.maxY - c.minY + 1,
          area: Math.round(c.area / 2)
        });
      } else {
        splittedComps.push(c);
      }
    } else {
      splittedComps.push(c);
    }
  }

  // 2. Kelompokkan ke baris teks dengan toleransi 1.25 * baseHeight
  const lineTolerance = baseHeight * 1.25;
  splittedComps.sort((a, b) => a.minY - b.minY);

  const lines: ComponentBox[][] = [];
  for (const comp of splittedComps) {
    let placed = false;
    for (const line of lines) {
      const lineCenterY = line.reduce((acc, c) => acc + (c.minY + c.maxY) / 2, 0) / line.length;
      const compCenterY = (comp.minY + comp.maxY) / 2;
      if (Math.abs(compCenterY - lineCenterY) <= lineTolerance) {
        line.push(comp);
        placed = true;
        break;
      }
    }
    if (!placed) {
      lines.push([comp]);
    }
  }

  lines.sort((a, b) => {
    const aY = a.reduce((acc, c) => acc + c.minY, 0) / a.length;
    const bY = b.reduce((acc, c) => acc + c.minY, 0) / b.length;
    return aY - bY;
  });

  // 3. Gabungkan suku kata per baris menggunakan Two-Phase Clustering
  const clusteredLines: ComponentBox[][] = [];

  for (const line of lines) {
    const lineYs = line.filter(c => c.height >= 18).map(c => (c.minY + c.maxY) / 2);
    const lineMidY = lineYs.length > 0 
      ? lineYs.reduce((a, b) => a + b, 0) / lineYs.length 
      : line.reduce((acc, c) => acc + (c.minY + c.maxY) / 2, 0) / line.length;

    interface DiacriticBox extends ComponentBox {
      role: 'upper' | 'lower' | 'side';
    }

    const diacritics: DiacriticBox[] = [];
    const baseStrokes: ComponentBox[] = [];

    for (const c of line) {
      const isUpper = (c.maxY < lineMidY - baseHeight * 0.15 && c.height <= baseHeight * 0.55);
      const isLower = (c.minY > lineMidY + baseHeight * 0.10 && c.height <= baseHeight * 0.55);
      const isSide = (
        c.width <= Math.max(18, baseHeight * 0.48) &&
        c.height <= baseHeight * 0.85 &&
        c.area <= baseHeight * baseHeight * 0.45
      );

      if (isUpper || isLower || isSide) {
        diacritics.push({ ...c, role: isUpper ? 'upper' : (isLower ? 'lower' : 'side') });
      } else {
        baseStrokes.push(c);
      }
    }

    // Gabungkan goresan pokok (base strokes)
    baseStrokes.sort((a, b) => a.minX - b.minX);
    let mergedBases: ComponentBox[] = [...baseStrokes];
    let changed = true;

    while (changed) {
      changed = false;
      const nextList: ComponentBox[] = [];
      let i = 0;

      while (i < mergedBases.length) {
        let cur = mergedBases[i];

        if (i + 1 < mergedBases.length) {
          const next = mergedBases[i + 1];
          const xOverlap = Math.min(cur.maxX, next.maxX) - Math.max(cur.minX, next.minX);
          const minW = Math.min(cur.width, next.width);
          const gapX = next.minX - cur.maxX;
          const combW = Math.max(cur.maxX, next.maxX) - Math.min(cur.minX, next.minX) + 1;

          // Palang bertumpuk vertikal (seperti palang atas dan bawah Ra)
          const isOverlap = xOverlap > (minW * 0.25);

          // Pasangan dua kaki huruf majemuk (ᮞ, ᮊ, ᮔ)
          const isLegPair = (
            cur.width <= baseHeight * 0.54 &&
            next.width <= baseHeight * 0.54 &&
            gapX <= Math.max(8, baseHeight * 0.22) &&
            combW <= baseHeight * 1.25 &&
            Math.abs(cur.minY - next.minY) <= Math.max(4, baseHeight * 0.12) &&
            Math.abs(cur.maxY - next.maxY) <= Math.max(4, baseHeight * 0.12)
          );

          if (isOverlap || isLegPair) {
            cur = {
              id: cur.id,
              minX: Math.min(cur.minX, next.minX),
              minY: Math.min(cur.minY, next.minY),
              maxX: Math.max(cur.maxX, next.maxX),
              maxY: Math.max(cur.maxY, next.maxY),
              width: combW,
              height: Math.max(cur.maxY, next.maxY) - Math.min(cur.minY, next.minY) + 1,
              area: cur.area + next.area
            };
            i += 2;
            changed = true;
            nextList.push(cur);
            continue;
          }
        }

        nextList.push(cur);
        i++;
      }

      mergedBases = nextList;
    }

    // Tempelkan rarangken kembali ke konsonan pokok induknya
    for (const d of diacritics) {
      let bestBase: ComponentBox | null = null;
      let bestScore = -999;

      for (const b of mergedBases) {
        if (d.role === 'side') {
          const dist = d.minX - b.maxX;
          if (dist >= -Math.max(6, baseHeight * 0.15) && dist <= Math.max(14, baseHeight * 0.35)) {
            const score = 100 - Math.abs(dist);
            if (score > bestScore) {
              bestScore = score;
              bestBase = b;
            }
          }
        } else {
          const overlap = Math.min(b.maxX, d.maxX) - Math.max(b.minX, d.minX);
          if (overlap > bestScore) {
            bestScore = overlap;
            bestBase = b;
          }
        }
      }

      if (bestBase) {
        bestBase.minX = Math.min(bestBase.minX, d.minX);
        bestBase.maxX = Math.max(bestBase.maxX, d.maxX);
        bestBase.minY = Math.min(bestBase.minY, d.minY);
        bestBase.maxY = Math.max(bestBase.maxY, d.maxY);
        bestBase.width = bestBase.maxX - bestBase.minX + 1;
        bestBase.height = bestBase.maxY - bestBase.minY + 1;
        bestBase.area += d.area;
      } else {
        mergedBases.push(d);
      }
    }

    mergedBases.sort((a, b) => a.minX - b.minX);
    clusteredLines.push(mergedBases);
  }

  return clusteredLines;
}

/**
 * Pencocokan Karakter Suku Kata Mandiri Terhadap Matriks Aksara Sunda Baku
 */
function classifyGlyph(
  binary: Uint8Array,
  imgWidth: number,
  box: ComponentBox,
  templates: GlyphTemplate[]
): { bestChar: GlyphTemplate; score: number } {
  const normSize = 32;
  const sampleMatrix = new Uint8Array(normSize * normSize);
  let totalBlack = 0;

  for (let ny = 0; ny < normSize; ny++) {
    for (let nx = 0; nx < normSize; nx++) {
      const srcX = Math.min(imgWidth - 1, Math.max(0, Math.floor(box.minX + (nx / normSize) * box.width)));
      const srcY = Math.floor(box.minY + (ny / normSize) * box.height);
      const isInk = binary[srcY * imgWidth + srcX];
      sampleMatrix[ny * normSize + nx] = isInk;
      if (isInk === 1) totalBlack++;
    }
  }

  // 16-zone density
  const sampleZoning: number[] = new Array(16).fill(0);
  const zoneH = normSize / 4;
  const zoneW = normSize / 4;
  for (let zy = 0; zy < 4; zy++) {
    for (let zx = 0; zx < 4; zx++) {
      let count = 0;
      for (let py = zy * zoneH; py < (zy + 1) * zoneH; py++) {
        for (let px = zx * zoneW; px < (zx + 1) * zoneW; px++) {
          if (sampleMatrix[Math.floor(py) * normSize + Math.floor(px)] === 1) count++;
        }
      }
      sampleZoning[zy * 4 + zx] = count / (zoneW * zoneH);
    }
  }

  // Profile horizontal & vertikal (16 bins)
  const sampleHProfile: number[] = new Array(16).fill(0);
  for (let by = 0; by < 16; by++) {
    let count = 0;
    const yStart = Math.floor(by * 2);
    for (let y = yStart; y < yStart + 2; y++) {
      for (let x = 0; x < normSize; x++) {
        if (sampleMatrix[y * normSize + x] === 1) count++;
      }
    }
    sampleHProfile[by] = count / (2 * normSize);
  }

  const sampleVProfile: number[] = new Array(16).fill(0);
  for (let bx = 0; bx < 16; bx++) {
    let count = 0;
    const xStart = Math.floor(bx * 2);
    for (let x = xStart; x < xStart + 2; x++) {
      for (let y = 0; y < normSize; y++) {
        if (sampleMatrix[y * normSize + x] === 1) count++;
      }
    }
    sampleVProfile[bx] = count / (2 * normSize);
  }

  const sampleAspectRatio = box.width / box.height;
  const sampleDensity = totalBlack / (normSize * normSize);

  let bestMatch = templates[0];
  let highestScore = -1;

  for (const t of templates) {
    // 1. Bitwise IoU
    let intersection = 0;
    let union = 0;
    for (let i = 0; i < normSize * normSize; i++) {
      const a = sampleMatrix[i];
      const b = t.matrix[i];
      if (a === 1 && b === 1) intersection++;
      if (a === 1 || b === 1) union++;
    }
    const iou = union > 0 ? intersection / union : 0;

    // 2. Zoning Euclidean Distance
    let zoneDiffSum = 0;
    for (let z = 0; z < 16; z++) {
      const diff = sampleZoning[z] - t.zoning[z];
      zoneDiffSum += diff * diff;
    }
    const zoneSim = Math.max(0, 1 - Math.sqrt(zoneDiffSum / 16));

    // 3. Profile Similarity (H & V)
    let hDiffSum = 0;
    for (let b = 0; b < 16; b++) {
      const diff = sampleHProfile[b] - t.hProfile[b];
      hDiffSum += diff * diff;
    }
    const hSim = Math.max(0, 1 - Math.sqrt(hDiffSum / 16));

    let vDiffSum = 0;
    for (let b = 0; b < 16; b++) {
      const diff = sampleVProfile[b] - t.vProfile[b];
      vDiffSum += diff * diff;
    }
    const vSim = Math.max(0, 1 - Math.sqrt(vDiffSum / 16));

    // 4. Aspect Ratio Match
    const aspectDiff = Math.abs(Math.log(sampleAspectRatio / Math.max(0.1, t.aspectRatio)));
    const aspectSim = Math.max(0, 1 - aspectDiff);

    // 5. Density Match
    const densityDiff = Math.abs(sampleDensity - t.density);
    const densitySim = Math.max(0, 1 - densityDiff * 2);

    const compositeScore = (
      iou * 0.44 +
      zoneSim * 0.22 +
      hSim * 0.12 +
      vSim * 0.12 +
      aspectSim * 0.05 +
      densitySim * 0.05
    );

    if (compositeScore > highestScore) {
      highestScore = compositeScore;
      bestMatch = t;
    }
  }

  const confidence = Math.min(99, Math.max(50, Math.round(highestScore * 100)));
  return { bestChar: bestMatch, score: confidence };
}

/**
 * Mencari Arti & Terjemahan Kata Basa Sunda ke Bahasa Indonesia
 */
export function translateSundaneseMeaning(latinText: string): string {
  if (!latinText) return "";
  let cleaned = latinText.toLowerCase().trim().replace(/[^a-zé0-9 ]/g, "");

  if (/^\d+$/.test(cleaned)) {
    return `Bilangan / angka Sunda bernilai ${cleaned}.`;
  }

  cleaned = cleaned.replace(/sampura+sun/g, "sampurasun");
  cleaned = cleaned.replace(/riksasukapura/g, "riksa sukapura");
  cleaned = cleaned.replace(/wilujengsumping/g, "wilujeng sumping");
  cleaned = cleaned.replace(/silih\s*asih\s*silih\s*asah\s*silih\s*asuh/g, "silih asih silih asah silih asuh");
  cleaned = cleaned.replace(/silih\s*asah\s*silih\s*asih\s*silih\s*asuh/g, "silih asah silih asih silih asuh");
  cleaned = cleaned.replace(/silih\s*asih\s*asah\s*asuh/g, "silih asih asah asuh");

  if (SUNDA_DICTIONARY[cleaned]) {
    return SUNDA_DICTIONARY[cleaned];
  }

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";

  const meaningList: string[] = [];
  for (const w of words) {
    if (SUNDA_DICTIONARY[w]) {
      meaningList.push(`${w}: ${SUNDA_DICTIONARY[w]}`);
    }
  }

  if (meaningList.length > 0) {
    return meaningList.join(" • ");
  }

  return `Teks basa Sunda bermakna '${cleaned}'. Alih aksara sesuai pedoman ortografi baku Sunda Parahyangan.`;
}

/**
 * FUNGSI UTAMA: Scan Aksara Sunda Huruf per Huruf dari File Image atau Canvas
 * 100% Berjalan Lokal di Browser — Sesuai Pedoman Mesin Alih Aksara Baku
 */
export async function scanAksaraSundaFromImage(
  imageSource: HTMLImageElement | HTMLCanvasElement | File | Blob | string
): Promise<OcrScanResult> {
  const startTime = performance.now();
  const templates = await initializeGlyphTemplates();

  // 1. Muat ke Image Canvas
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  if (imageSource instanceof HTMLCanvasElement) {
    canvas = imageSource;
    ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  } else {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    let img: HTMLImageElement;
    if (imageSource instanceof HTMLImageElement) {
      img = imageSource;
    } else if (typeof imageSource === 'string') {
      img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = imageSource;
      });
    } else {
      img = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = reader.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageSource);
      });
    }

    const maxDim = 1200;
    let targetW = img.naturalWidth || img.width || 800;
    let targetH = img.naturalHeight || img.height || 600;

    if (targetW > maxDim || targetH > maxDim) {
      if (targetW > targetH) {
        targetH = Math.round((targetH * maxDim) / targetW);
        targetW = maxDim;
      } else {
        targetW = Math.round((targetW * maxDim) / targetH);
        targetH = maxDim;
      }
    }

    canvas.width = targetW;
    canvas.height = targetH;
    ctx.drawImage(img, 0, 0, targetW, targetH);
  }

  const { width, height } = canvas;

  // 2. Preprocessing & Binarisasi Adaptif
  const { binaryData, debugCanvasUrl } = preprocessAdaptiveBinarize(ctx, width, height);

  // 3. Segmentasi Komponen & Pembersihan Garis Bingkai Luar
  const rawComponents = findConnectedComponents(binaryData, width, height);

  // 4. Pembelahan Ligatur & Pengelompokan Suku Kata Cerdas (Smart Syllable Clustering)
  const clusteredLines = clusterSyllableComponents(rawComponents, binaryData, width, height);

  // 5. Klasifikasi Huruf demi Huruf
  const recognizedLetters: RecognizedLetter[] = [];
  let detectedAksaraString = "";

  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = 56;
  thumbCanvas.height = 56;
  const thumbCtx = thumbCanvas.getContext('2d')!;

  for (let lIdx = 0; lIdx < clusteredLines.length; lIdx++) {
    const line = clusteredLines[lIdx];
    if (lIdx > 0 && detectedAksaraString.length > 0 && !detectedAksaraString.endsWith(" ")) {
      detectedAksaraString += " ";
    }
    for (let bIdx = 0; bIdx < line.length; bIdx++) {
      const box = line[bIdx];

      // Sisipkan spasi jika terdapat jarak pemisah kata yang cukup lebar
      if (bIdx > 0) {
        const prevBox = line[bIdx - 1];
        const gapX = box.minX - prevBox.maxX;
        const validHeights = line.filter(c => c.height >= 14).map(c => c.height);
        const avgH = validHeights.length > 0 ? validHeights.reduce((a, b) => a + b, 0) / validHeights.length : 40;
        if (gapX >= Math.max(14, avgH * 0.32)) {
          detectedAksaraString += " ";
        }
      }

      const { bestChar, score } = classifyGlyph(binaryData, width, box, templates);

      thumbCtx.clearRect(0, 0, 56, 56);
      thumbCtx.fillStyle = '#FAF7EE';
      thumbCtx.fillRect(0, 0, 56, 56);

      const pad = 4;
      const drawW = 56 - pad * 2;
      const drawH = 56 - pad * 2;
      thumbCtx.drawImage(
        canvas,
        box.minX, box.minY, box.width, box.height,
        pad, pad, drawW, drawH
      );

      recognizedLetters.push({
        char: bestChar.char,
        name: bestChar.name,
        latin: bestChar.latin,
        type: bestChar.type,
        confidence: score,
        bbox: {
          x: box.minX,
          y: box.minY,
          width: box.width,
          height: box.height
        },
        thumbnail: thumbCanvas.toDataURL('image/png')
      });

      detectedAksaraString += bestChar.char;
    }
  }

  // 6. Alih Aksara Otomatis Baku ke Latin & Terjemahan Makna Budaya
  const latinTransliteration = translateSundaToLatin(detectedAksaraString);
  const indonesianTranslation = translateSundaneseMeaning(latinTransliteration);

  const durationMs = Math.round(performance.now() - startTime);

  return {
    aksaraText: detectedAksaraString,
    latinText: latinTransliteration,
    translationId: indonesianTranslation,
    letters: recognizedLetters,
    durationMs,
    processedImageUrl: debugCanvasUrl,
    debugInfo: `Ditemukan ${recognizedLetters.length} suku kata aksara (${clusteredLines.length} baris teks) dipindai secara presisi dalam ${durationMs}ms.`
  };
}
