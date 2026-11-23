/**
 * sundaSampleGenerator.ts
 * Membuat citra sampel Aksara Sunda beresolusi tinggi di canvas
 * untuk kemudahan pengujian fitur OCR secara instan (1-klik coba).
 */

export interface AksaraSamplePreset {
  id: string;
  title: string;
  aksara: string;
  latin: string;
  arti: string;
  category: string;
}

export const SAMPLE_PRESETS: AksaraSamplePreset[] = [
  {
    id: "sampurasun",
    title: "Sampurasun",
    aksara: "ᮞᮙ᮪ᮕᮥᮛᮞᮥᮔ᮪",
    latin: "sampurasun",
    arti: "Salam santun khas Sunda memohon keselamatan dan berkah leluhur.",
    category: "Salam Luhur"
  },
  {
    id: "riksa",
    title: "Riksa Sukapura",
    aksara: "ᮛᮤᮊ᮪ᮞ ᮞᮥᮊᮕᮥᮛ",
    latin: "riksa sukapura",
    arti: "Merawat serta menjaga warisan budaya leluhur Sukapura Tasikmalaya.",
    category: "Komunitas"
  },
  {
    id: "wilujeng-sumping",
    title: "Wilujeng Sumping",
    aksara: "ᮝᮤᮜᮥᮏᮨᮀ ᮞᮥᮙ᮪ᮕᮤᮀ",
    latin: "wilujeng sumping",
    arti: "Selamat datang di tanah Pasundan yang ramah dan damai.",
    category: "Keramahan"
  },
  {
    id: "kujang",
    title: "Kujang Pasundan",
    aksara: "ᮊᮥᮏᮀ ᮕᮞᮥᮔ᮪ᮓᮔ᮪",
    latin: "kujang pasundan",
    arti: "Senjata pusaka dan lambang kehormatan masyarakat Parahyangan.",
    category: "Pusaka"
  },
  {
    id: "silih-asih",
    title: "Silih Asah Silih Asih Silih Asuh",
    aksara: "ᮞᮤᮜᮤᮂ ᮃᮞᮂ ᮞᮤᮜᮤᮂ ᮃᮞᮤᮂ ᮞᮤᮜᮤᮂ ᮃᮞᮥᮂ",
    latin: "silih asah silih asih silih asuh",
    arti: "Tiga pilar filosofi kemanusiaan agung masyarakat Sunda: saling mencerdaskan (asah), saling mengasihi (asih), dan saling membimbing (asuh).",
    category: "Falsafah"
  }
];

/**
 * Menghasilkan Data URL citra realistis dari teks aksara Sunda
 * Mensimulasikan media naskah / papan kayu / kertas kuno yang otentik
 */
export function generateSampleCardImage(
  aksaraText: string,
  style: 'kertas-kuno' | 'modern-clean' | 'batu-prasasti' = 'modern-clean'
): string {
  const canvas = document.createElement('canvas');
  const canvasWidth = Math.max(640, Math.min(1000, aksaraText.length * 20 + 80));
  canvas.width = canvasWidth;
  canvas.height = 260;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (style === 'kertas-kuno') {
    // Gradien kertas lontar / perkamen kuno
    const grad = ctx.createLinearGradient(0, 0, canvasWidth, 260);
    grad.addColorStop(0, '#EFE4CD');
    grad.addColorStop(0.5, '#F6EEDC');
    grad.addColorStop(1, '#E4D5B7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, 260);

    // Tekstur bintik serat kertas halus
    ctx.fillStyle = 'rgba(110, 80, 40, 0.05)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * canvasWidth;
      const ry = Math.random() * 260;
      ctx.fillRect(rx, ry, Math.random() * 3 + 1, Math.random() * 2 + 1);
    }
  } else if (style === 'batu-prasasti') {
    // Batu prasasti andesit abu-abu
    const grad = ctx.createLinearGradient(0, 0, canvasWidth, 260);
    grad.addColorStop(0, '#3A4240');
    grad.addColorStop(0.5, '#4B5552');
    grad.addColorStop(1, '#333A38');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, 260);

    // Ukiran warna emas muda
    ctx.fillStyle = '#E8D498';
  } else {
    // Modern Clean (Latar putih gading lembut tanpa garis bingkai yang mengganggu OCR)
    ctx.fillStyle = '#FAF7EE';
    ctx.fillRect(0, 0, canvasWidth, 260);
  }

  // Teks Aksara Sunda di Tengah
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  if (style === 'batu-prasasti') {
    ctx.fillStyle = '#F5E6BE';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  } else {
    ctx.fillStyle = '#143D22'; // Hijau gelap Riksa
    ctx.shadowColor = 'transparent';
  }

  // Sesuaikan ukuran font sesuai panjang teks
  const fontSize = aksaraText.length > 20 ? 38 : aksaraText.length > 15 ? 42 : aksaraText.length > 8 ? 54 : 64;
  ctx.font = `bold ${fontSize}px 'Noto Sans Sundanese', serif, sans-serif`;

  ctx.fillText(aksaraText, canvasWidth / 2, 130);

  return canvas.toDataURL('image/png');
}
