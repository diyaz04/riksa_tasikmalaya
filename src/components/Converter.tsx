import React, { useState, useRef, useEffect, useCallback, ChangeEvent, DragEvent } from 'react';
import { 
  ArrowRightLeft, Copy, Check, ChevronDown, ChevronUp, Sparkles, BookOpen,
  Camera, Upload, Image as ImageIcon, RefreshCw, Eye, CheckCircle2,
  Zap, X, SwitchCamera, Info, Edit3, Clock, FlaskConical
} from 'lucide-react';
import FadeIn from './Shared/FadeIn';
import { translateLatinToSunda, translateSundaToLatin } from '../utils/transliterate';
import { 
  scanAksaraSundaFromImage, 
  OcrScanResult, 
  RecognizedLetter, 
  ALL_AKSARA_GLYPHS,
  translateSundaneseMeaning,
  ensureSundaneseFontLoaded
} from '../utils/sundaOcrEngine';
import { SAMPLE_PRESETS, generateSampleCardImage } from '../utils/sundaSampleGenerator';

const DICT_SWARA = [
  { latin: "a", aksara: "ᮃ" }, { latin: "i", aksara: "ᮄ" }, { latin: "u", aksara: "ᮅ" },
  { latin: "é", aksara: "ᮆ" }, { latin: "o", aksara: "ᮇ" }, { latin: "e", aksara: "ᮈ" }, { latin: "eu", aksara: "ᮉ" }
];

const DICT_NGALAGENA = [
  { latin: "ka", aksara: "ᮊ" }, { latin: "ga", aksara: "ᮌ" }, { latin: "nga", aksara: "ᮍ" },
  { latin: "ca", aksara: "ᮎ" }, { latin: "ja", aksara: "ᮏ" }, { latin: "nya", aksara: "ᮑ" },
  { latin: "ta", aksara: "ᮒ" }, { latin: "da", aksara: "ᮓ" }, { latin: "na", aksara: "ᮔ" },
  { latin: "pa", aksara: "ᮕ" }, { latin: "ba", aksara: "ᮘ" }, { latin: "ma", aksara: "ᮙ" },
  { latin: "ya", aksara: "ᮚ" }, { latin: "ra", aksara: "ᮛ" }, { latin: "la", aksara: "ᮜ" },
  { latin: "wa", aksara: "ᮝ" }, { latin: "sa", aksara: "ᮞ" }, { latin: "ha", aksara: "ᮠ" },
  { latin: "fa", aksara: "ᮖ" }, { latin: "qa", aksara: "ᮋ" }, { latin: "va", aksara: "ᮗ" },
  { latin: "xa", aksara: "ᮟ" }, { latin: "za", aksara: "ᮐ" },
  { latin: "kha", aksara: "ᮮ" }, { latin: "sya", aksara: "ᮯ" }
];

const DICT_RARANGKEN = [
  { latin: "i", aksara: "ᮤ", nama: "Panghulu (i)" },
  { latin: "u", aksara: "ᮥ", nama: "Panyuku (u)" },
  { latin: "é", aksara: "ᮦ", nama: "Panéléng (é)" },
  { latin: "o", aksara: "ᮧ", nama: "Panolong (o)" },
  { latin: "e", aksara: "ᮨ", nama: "Pamepet (e)" },
  { latin: "eu", aksara: "ᮩ", nama: "Paneuleung (eu)" },
  { latin: "ng", aksara: "ᮀ", nama: "Panyecek (+ng)" },
  { latin: "r", aksara: "ᮁ", nama: "Panglayar (+r)" },
  { latin: "h", aksara: "ᮂ", nama: "Pangwisad (+h)" },
  { latin: "ya", aksara: "ᮡ", nama: "Pamingkal (+ya)" },
  { latin: "ra", aksara: "ᮢ", nama: "Panyakra (+ra)" },
  { latin: "la", aksara: "ᮣ", nama: "Panyiku (+la)" },
  { latin: "—", aksara: "᮪", nama: "Pamaéh (mati)" }
];

const DICT_WILANGAN = [
  { latin: "1", aksara: "᮱" }, { latin: "2", aksara: "᮲" }, { latin: "3", aksara: "᮳" },
  { latin: "4", aksara: "᮴" }, { latin: "5", aksara: "᮵" }, { latin: "6", aksara: "᮶" },
  { latin: "7", aksara: "᮷" }, { latin: "8", aksara: "᮸" }, { latin: "9", aksara: "᮹" },
  { latin: "0", aksara: "᮰" },
  { latin: "|", aksara: "|", label: "Pembatas (|)" }
];

export default function Converter() {
  // Navigation Tabs: 'text' = Pengetikan Manual (Default), 'ocr' = Pindai Foto & Kamera (Segera Hadir)
  const [activeTab, setActiveTab] = useState<'text' | 'ocr'>('text');
  const [showDevOcr, setShowDevOcr] = useState(false);

  // Text Mode State
  const [mode, setMode] = useState<'latin-to-sunda' | 'sunda-to-latin'>('latin-to-sunda');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);

  // OCR Mode State
  const [ocrImage, setOcrImage] = useState<string | null>(null);
  const [ocrBinarizedImage, setOcrBinarizedImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'original' | 'binarized'>('original');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<OcrScanResult | null>(null);
  const [copiedAksara, setCopiedAksara] = useState(false);
  const [copiedLatin, setCopiedLatin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingLetterIdx, setEditingLetterIdx] = useState<number | null>(null);

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Pre-warm Noto Sans Sundanese font on mount for instantaneous, high-accuracy OCR
  useEffect(() => {
    ensureSundaneseFontLoaded().catch(err => {
      console.warn("Pre-warming font warning:", err);
    });
  }, []);

  const toggleMode = () => {
    setMode(m => m === 'latin-to-sunda' ? 'sunda-to-latin' : 'latin-to-sunda');
    setInput('');
  };

  const output = mode === 'latin-to-sunda' 
    ? translateLatinToSunda(input).aksara 
    : translateSundaToLatin(input);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertChar = (aksara: string, latin?: string) => {
    if (mode === 'latin-to-sunda' && latin && latin !== '—') {
      setInput(prev => prev + latin);
    } else {
      setInput(prev => prev + aksara);
    }
  };

  // ── Camera Controller ──
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = async (facing: 'environment' | 'user' = 'environment') => {
    stopCameraStream();
    setErrorMsg(null);
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: unknown) {
      console.error("Camera access error:", err);
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Tidak dapat mengakses kamera: ${message}. Pastikan izin kamera telah diberikan di browser.`);
      setIsCameraOpen(false);
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const closeCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    // Crop fokus ke area reticle bidik kamera (tengah frame, dengan margin aman)
    // agar bayangan tangan, keyboard, dan latar ruangan tidak mengganggu segmentasi OCR
    const cropX = Math.round(vw * 0.08);
    const cropY = Math.round(vh * 0.08);
    const cropW = Math.round(vw * 0.84);
    const cropH = Math.round(vh * 0.84);

    const canvas = document.createElement('canvas');
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.94);

    closeCamera();
    processImageSource(dataUrl);
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  // ── OCR Execution Engine ──
  const processImageSource = async (src: string | File) => {
    setErrorMsg(null);
    setIsScanning(true);
    setScanResult(null);

    try {
      let previewUrl = '';
      if (typeof src === 'string') {
        previewUrl = src;
      } else {
        previewUrl = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result as string);
          reader.onerror = rej;
          reader.readAsDataURL(src);
        });
      }

      setOcrImage(previewUrl);

      // Jalankan Engine OCR Aksara Sunda Offline
      const result = await scanAksaraSundaFromImage(src);
      setScanResult(result);
      setOcrBinarizedImage(result.processedImageUrl);
    } catch (err: unknown) {
      console.error("Error OCR processing:", err);
      const message = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Gagal memindai aksara: ${message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageSource(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageSource(file);
    }
  };

  const handleLoadSample = async (sample: typeof SAMPLE_PRESETS[0]) => {
    await ensureSundaneseFontLoaded();
    const sampleImg = generateSampleCardImage(sample.aksara, 'modern-clean');
    processImageSource(sampleImg);
  };

  // ── 1-Click Letter Correction (Koreksi Huruf Interaktif) ──
  const handleUpdateLetter = (index: number, newGlyph: typeof ALL_AKSARA_GLYPHS[0]) => {
    if (!scanResult) return;

    const updatedLetters = [...scanResult.letters];
    const target = updatedLetters[index];
    if (!target) return;

    updatedLetters[index] = {
      ...target,
      char: newGlyph.char,
      name: newGlyph.name,
      latin: newGlyph.latin,
      type: newGlyph.type,
      confidence: 100 // Manual verified
    };

    const newAksaraStr = updatedLetters.map(l => l.char).join('');
    const newLatinStr = translateSundaToLatin(newAksaraStr);
    const newTranslation = translateSundaneseMeaning(newLatinStr);

    setScanResult({
      ...scanResult,
      aksaraText: newAksaraStr,
      latinText: newLatinStr,
      translationId: newTranslation,
      letters: updatedLetters
    });

    setEditingLetterIdx(null);
  };

  // Kirim hasil OCR ke konverter manual teks
  const sendToTextConverter = () => {
    if (!scanResult) return;
    setActiveTab('text');
    setMode('sunda-to-latin');
    setInput(scanResult.aksaraText);
  };

  return (
    <section id="converter" className="py-20 sm:py-28 bg-[#143D22] text-white relative overflow-hidden">
      
      {/* Background Motifs */}
      <div className="absolute inset-0 pattern-sunda-dark opacity-35 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-riksa-gold font-bold text-xs uppercase tracking-wider mb-4 border border-white/15 backdrop-blur-sm shadow-sm">
              <Sparkles size={14} className="text-riksa-gold" />
              <span>Teknologi Literasi Parahyangan</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Alih Aksara Sunda Baku &amp; Wilangan
            </h2>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-8 h-[2px] bg-riksa-orange rounded-full" />
              <span className="w-16 h-[3px] bg-riksa-gold rounded-full" />
              <span className="w-8 h-[2px] bg-riksa-orange rounded-full" />
            </div>

            <p className="font-sans text-emerald-100/90 text-base sm:text-lg leading-relaxed">
              Konversi dua arah <strong className="text-riksa-gold font-semibold">Latin ↔ Aksara Sunda</strong> secara instan dengan dukungan lengkap Ngalagena, Swara, Rarangken, dan Wilangan (Angka). Fitur pemindaian foto &amp; kamera (OCR) sedang dalam tahap pengujian akurasi lanjutan.
            </p>
          </FadeIn>
        </div>

        {/* Master Navigation Tabs */}
        <FadeIn delay={0.1}>
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1.5 rounded-2xl bg-black/35 border border-white/15 backdrop-blur-md shadow-xl max-w-lg w-full">
              
              {/* Tab 1: Ketik Manual (Utama) */}
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'text'
                    ? 'bg-white text-stone-900 shadow-lg'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <ArrowRightLeft size={18} className={activeTab === 'text' ? 'text-riksa-green' : ''} />
                <span>Ketik Manual (2 Arah)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold hidden sm:inline">
                  Baku
                </span>
              </button>

              {/* Tab 2: Pindai Foto / Kamera (OCR - Segera Hadir) */}
              <button
                type="button"
                onClick={() => setActiveTab('ocr')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'ocr'
                    ? 'bg-gradient-to-r from-riksa-orange to-amber-600 text-white shadow-lg'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Camera size={18} />
                <span>Pindai Foto / Kamera</span>
                <span className="text-[10px] bg-amber-400/25 text-amber-200 border border-amber-300/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                  Segera Hadir
                </span>
              </button>

            </div>
          </div>
        </FadeIn>

        {/* ======================================================== */}
        {/* TAB 1: OCR PINDAI GAMBAR & KAMERA (AKAN SEGERA HADIR)    */}
        {/* ======================================================== */}
        {activeTab === 'ocr' && (
          <FadeIn delay={0.2}>
            <div className="bg-[#FAF7EE] text-stone-900 rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-12 border-2 border-riksa-gold/40 relative overflow-hidden">
              
              {/* Decorative Background Accents */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-riksa-gold/15 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-riksa-orange/15 blur-2xl pointer-events-none" />

              {/* Status Header & Announcement Card */}
              <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider mb-5 border border-amber-300/80 shadow-xs">
                  <Clock size={14} className="text-riksa-orange animate-pulse" />
                  <span>Fitur Sedang Dalam Pembangunan &amp; Pengujian Akurasi</span>
                </div>

                <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-amber-500 via-riksa-orange to-emerald-900 p-0.5 shadow-xl flex items-center justify-center">
                  <div className="w-full h-full bg-[#FAF7EE] rounded-[22px] flex items-center justify-center">
                    <Camera size={36} className="text-riksa-orange" />
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mb-3">
                  Pindai Kamera &amp; Foto Aksara Sunda (OCR)
                </h3>
                
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                  Fitur pengalihan aksara secara membaca langsung melalui tangkapan kamera maupun unggahan berkas gambar 
                  <strong className="text-riksa-orange font-semibold"> akan segera hadir</strong>. 
                  Sistem saat ini sedang dalam tahap intensif pengetesan ketepatan algoritma alih aksara huruf demi huruf agar menghasilkan pembacaan 100% presisi dan terverifikasi baku.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('text')}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-riksa-green hover:bg-riksa-green-dark text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <ArrowRightLeft size={16} />
                    <span>Gunakan Pengetikan Manual (Latin ↔ Sunda)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDevOcr(v => !v)}
                    className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 font-semibold text-xs border border-stone-300 shadow-2xs transition-all cursor-pointer"
                    title="Buka ruang uji coba prototipe mesin OCR"
                  >
                    <FlaskConical size={15} className="text-riksa-orange" />
                    <span>{showDevOcr ? 'Sembunyikan Ruang Uji Prototipe' : 'Buka Ruang Uji Coba Prototipe'}</span>
                  </button>
                </div>
              </div>

              {/* 3 Progress & Assurance Pillar Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto relative z-10">
                <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-stone-200/90 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 font-bold mb-3">
                    <Sparkles size={20} className="text-riksa-orange" />
                  </div>
                  <h4 className="font-bold text-stone-800 text-sm mb-1.5">Pengetesan Ketepatan 100%</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Sedang diuji terhadap 25 Aksara Ngalagena, 7 Aksara Swara, 13 Rarangken, dan 10 Wilangan (angka) agar tidak terjadi kekeliruan antar bentuk karakter serupa.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-stone-200/90 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 font-bold mb-3">
                    <Zap size={20} className="text-riksa-green" />
                  </div>
                  <h4 className="font-bold text-stone-800 text-sm mb-1.5">Pemrosesan 100% Offline</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Seluruh deteksi citra berjalan langsung di peramban pengguna tanpa mengirim gambar ke server luar, menjaga privasi penuh dan kecepatan responsif.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-stone-200/90 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-bold mb-3">
                    <BookOpen size={20} className="text-stone-700" />
                  </div>
                  <h4 className="font-bold text-stone-800 text-sm mb-1.5">Kaidah Baku Kaganga</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Mengikuti standar pedoman ejaan aksara Sunda resmi Jawa Barat (SK No. 434/Dis.PK/98) serta penyesuaian Unicode resmi blok Sunda (U+1B80–U+1BBF).
                  </p>
                </div>
              </div>

              {/* Dev Mode Expansion / OCR Workspace */}
              {showDevOcr && (
                <div className="pt-8 mt-6 border-t-2 border-dashed border-amber-300 relative z-10">
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FlaskConical size={16} className="text-riksa-orange shrink-0" />
                      <span>
                        <strong>Ruang Pengujian Prototipe OCR Aktif:</strong> Anda dapat menguji pemindaian kamera langsung atau mengunggah gambar untuk memverifikasi akurasi huruf per huruf.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDevOcr(false)}
                      className="px-2.5 py-1 rounded-lg bg-amber-200/70 hover:bg-amber-300 text-amber-900 font-bold text-[11px] cursor-pointer"
                    >
                      Tutup Pengujian
                    </button>
                  </div>
              
              {/* Error Notice */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                  <X size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="block font-bold mb-0.5">Perhatian:</strong>
                    <span>{errorMsg}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setErrorMsg(null)}
                    className="text-rose-400 hover:text-rose-700 font-bold text-xs"
                  >
                    Tutup
                  </button>
                </div>
              )}

              {/* Action Source Trigger Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                
                {/* 1. Tombol Buka Kamera */}
                <button
                  type="button"
                  onClick={() => startCamera(cameraFacing)}
                  className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-riksa-green hover:bg-riksa-green-dark text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 border border-emerald-700/30 cursor-pointer"
                >
                  <Camera size={18} className="text-emerald-300" />
                  <span>Ambil Foto Kamera</span>
                </button>

                {/* 2. Tombol Unggah File */}
                <label className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm border-2 border-dashed border-stone-300 hover:border-riksa-green shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                  <Upload size={18} className="text-riksa-orange" />
                  <span>Unggah Berkas Gambar</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* 3. Badge Status Mesin Offline */}
                <div className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
                  <Zap size={16} className="text-emerald-600 shrink-0" />
                  <span>Mesin OCR 100% Offline (Lokal)</span>
                </div>

              </div>

              {/* Quick Sample Presets (1-Klik Pengujian) */}
              <div className="mb-6 p-4 rounded-2xl bg-stone-100/70 border border-stone-200">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-riksa-orange" />
                    <span>Belum Punya Foto? Coba Sampel Aksara Sunda Siap Pindai:</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PRESETS.map(sample => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleLoadSample(sample)}
                      disabled={isScanning}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-stone-300 hover:border-riksa-green text-xs font-medium text-stone-700 hover:text-riksa-green transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span className="aksara-sunda text-base text-riksa-green font-bold">{sample.aksara}</span>
                      <span className="text-stone-500 font-sans font-semibold">({sample.title})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Camera Viewport Modal */}
              {isCameraOpen && (
                <div className="mb-6 p-4 rounded-3xl bg-stone-900 text-white relative overflow-hidden border-2 border-riksa-gold shadow-2xl">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Kamera Aktif — Posisikan Aksara Sunda di Dalam Kotak</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-colors"
                        title="Ganti Kamera Depan/Belakang"
                      >
                        <SwitchCamera size={16} />
                        <span className="hidden sm:inline">Ganti Kamera</span>
                      </button>

                      <button
                        type="button"
                        onClick={closeCamera}
                        className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/80 text-white transition-colors"
                        title="Tutup Kamera"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Video Box with Target Reticle & Scan Laser Animation */}
                  <div className="relative aspect-video max-h-[380px] bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Viewfinder Target Framing */}
                    <div className="absolute inset-8 sm:inset-12 border-2 border-emerald-400/80 rounded-2xl pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      {/* Corner Target Accents */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-riksa-gold" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-riksa-gold" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-riksa-gold" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-riksa-gold" />

                      {/* Moving Scan Laser Beam */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399] animate-bounce-subtle" />
                    </div>
                  </div>

                  {/* Shutter Capture Button */}
                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-riksa-orange to-amber-500 hover:from-riksa-orange-light hover:to-amber-400 text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95"
                    >
                      <Camera size={20} />
                      <span>Jepret Foto &amp; Baca Sekarang</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Drag & Drop Visual Zone / Image Preview */}
              {!ocrImage && !isCameraOpen && (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="py-14 px-6 rounded-3xl border-2 border-dashed border-stone-300 hover:border-riksa-green bg-white/60 hover:bg-emerald-50/40 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100/70 text-riksa-green flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    <ImageIcon size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-stone-800 text-base mb-1">
                      Tarik &amp; Lepaskan Gambar Tulisan Aksara Sunda di Sini
                    </p>
                    <p className="text-stone-500 text-xs sm:text-sm">
                      Mendukung format JPG, PNG, WebP dari papan nama, buku naskah, kain batik, atau foto tulisan tangan.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-riksa-green/10 text-riksa-green font-bold text-xs">
                    <Upload size={14} />
                    <span>Pilih Berkas dari Perangkat</span>
                  </span>
                </div>
              )}

              {/* Scanning Active Loading Overlay */}
              {isScanning && (
                <div className="py-12 px-6 rounded-3xl bg-white border border-stone-200 text-center flex flex-col items-center justify-center gap-4 shadow-sm mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-riksa-green animate-spin" />
                  <div>
                    <h4 className="font-bold text-stone-900 text-base mb-1">
                      Sedang Membaca Citra Aksara Sunda...
                    </h4>
                    <p className="text-stone-500 text-xs max-w-md">
                      Menerapkan adaptive thresholding, segmentasi garis komponen huruf, dan mencocokkan matriks 32x32 Kaganga secara presisi huruf demi huruf.
                    </p>
                  </div>
                </div>
              )}

              {/* Processed Image & Inspector Display */}
              {ocrImage && !isScanning && (
                <div className="space-y-6">
                  
                  {/* Image Viewer Card with Toggle Filter */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                          Pratinjau Citra Sumber:
                        </span>
                        {scanResult && (
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-600" />
                            <span>{scanResult.debugInfo}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Toggle View Mode: Original vs Binarized B&W */}
                        {ocrBinarizedImage && (
                          <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => setViewMode('original')}
                              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                viewMode === 'original' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                              }`}
                            >
                              Foto Asli
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewMode('binarized')}
                              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                viewMode === 'binarized' ? 'bg-riksa-green text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                              }`}
                            >
                              Deteksi B&amp;W
                            </button>
                          </div>
                        )}

                        {/* Re-scan button */}
                        <button
                          type="button"
                          onClick={() => processImageSource(ocrImage)}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                          title="Pindai Ulang Citra"
                        >
                          <RefreshCw size={15} />
                        </button>

                        {/* Reset / Ganti Foto */}
                        <button
                          type="button"
                          onClick={() => {
                            setOcrImage(null);
                            setScanResult(null);
                            setOcrBinarizedImage(null);
                          }}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                          title="Hapus & Ganti Gambar"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Image Canvas / Display Container */}
                    <div className="relative rounded-2xl overflow-hidden bg-stone-900/5 max-h-[360px] flex items-center justify-center p-2">
                      <img
                        src={viewMode === 'binarized' && ocrBinarizedImage ? ocrBinarizedImage : ocrImage}
                        alt="Citra Aksara Sunda Terdeteksi"
                        className="max-h-[340px] w-auto object-contain rounded-xl shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Letter-by-Letter Interactive Breakdown Ribbon */}
                  {scanResult && scanResult.letters.length > 0 && (
                    <div className="p-5 rounded-3xl bg-white border-2 border-emerald-500/30 shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200">
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span>Hasil Deteksi Huruf demi Huruf ({scanResult.letters.length} Karakter)</span>
                          </h4>
                          <p className="text-stone-500 text-xs">
                            Klik pada salah satu huruf jika Anda ingin mengoreksi atau mengubahnya secara langsung.
                          </p>
                        </div>
                      </div>

                      {/* Letters Card Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                        {scanResult.letters.map((letter, idx) => (
                          <div
                            key={idx}
                            onClick={() => setEditingLetterIdx(editingLetterIdx === idx ? null : idx)}
                            className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer relative group ${
                              editingLetterIdx === idx
                                ? 'border-riksa-orange bg-amber-50/70 ring-2 ring-riksa-orange/30 shadow-sm'
                                : 'border-stone-200 bg-stone-50 hover:border-riksa-green hover:bg-emerald-50/50 shadow-2xs'
                            }`}
                          >
                            {/* Letter Thumbnail */}
                            <div className="w-10 h-10 mx-auto mb-1.5 rounded-xl bg-white border border-stone-200 overflow-hidden flex items-center justify-center shadow-inner">
                              <img src={letter.thumbnail} alt={letter.name} className="w-full h-full object-contain" />
                            </div>

                            {/* Recognized Aksara Glyph */}
                            <div className="aksara-sunda text-2xl text-riksa-green font-bold leading-none mb-1">
                              {letter.char}
                            </div>

                            {/* Phonetic Latin */}
                            <div className="text-xs font-extrabold text-stone-900 font-sans">
                              {letter.latin}
                            </div>

                            {/* Confidence Pill */}
                            <div className="text-[10px] text-stone-600 font-semibold mt-0.5">
                              {letter.confidence}%
                            </div>

                            {/* Edit Icon on Hover */}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-stone-600">
                              <Edit3 size={12} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Inline Letter Edit Palette */}
                      {editingLetterIdx !== null && (
                        <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-stone-900 animate-fade-in">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                              <Edit3 size={14} className="text-riksa-orange" />
                              <span>Pilih Pengganti untuk Huruf Ke-{editingLetterIdx + 1}:</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingLetterIdx(null)}
                              className="text-stone-500 hover:text-stone-800 text-xs font-bold"
                            >
                              Batal
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-amber-200">
                            {ALL_AKSARA_GLYPHS.map(glyph => (
                              <button
                                key={glyph.char}
                                type="button"
                                onClick={() => handleUpdateLetter(editingLetterIdx, glyph)}
                                className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-emerald-100 border border-stone-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <span className="aksara-sunda text-base text-riksa-green font-bold">{glyph.char}</span>
                                <span className="text-[10px] text-stone-500 font-sans">({glyph.latin})</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Output Translation Cards */}
                  {scanResult && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Box 1: Teks Aksara Sunda Baku */}
                      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                              <Sparkles size={14} className="text-riksa-gold" />
                              <span>Teks Aksara Sunda Baku Terbaca</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(scanResult.aksaraText);
                                setCopiedAksara(true);
                                setTimeout(() => setCopiedAksara(false), 2000);
                              }}
                              className="flex items-center gap-1 text-xs font-bold text-riksa-green hover:text-riksa-green-dark cursor-pointer"
                            >
                              {copiedAksara ? (
                                <>
                                  <Check size={14} className="text-emerald-600" />
                                  <span className="text-emerald-600">Disalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={14} />
                                  <span>Salin Aksara</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="aksara-sunda text-3xl sm:text-4xl text-riksa-green-dark font-bold leading-relaxed p-4 rounded-2xl bg-[#FAF7EE] border border-stone-200 min-h-[100px] flex items-center">
                            {scanResult.aksaraText || <span className="text-stone-400 italic font-sans text-sm">Tidak ada aksara terdeteksi</span>}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                          <span>Unicode U+1B80–U+1BBF</span>
                          <button
                            type="button"
                            onClick={sendToTextConverter}
                            className="text-riksa-orange hover:text-riksa-orange-light font-bold flex items-center gap-1"
                          >
                            <span>Buka di Pengetikan Manual</span>
                            <ArrowRightLeft size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Box 2: Alih Aksara Latin & Arti Terjemahan */}
                      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                              <BookOpen size={14} className="text-riksa-orange" />
                              <span>Alih Aksara Latin &amp; Terjemahan</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(scanResult.latinText);
                                setCopiedLatin(true);
                                setTimeout(() => setCopiedLatin(false), 2000);
                              }}
                              className="flex items-center gap-1 text-xs font-bold text-riksa-orange hover:text-riksa-orange-light cursor-pointer"
                            >
                              {copiedLatin ? (
                                <>
                                  <Check size={14} className="text-emerald-600" />
                                  <span className="text-emerald-600">Disalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={14} />
                                  <span>Salin Latin</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Latin Transliteration Text */}
                          <div className="font-serif text-2xl font-bold text-stone-900 leading-snug p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 mb-3">
                            {scanResult.latinText || <span className="text-stone-400 italic text-sm">Tidak ada alih aksara</span>}
                          </div>

                          {/* Cultural Indonesian Meaning */}
                          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-stone-800 text-xs sm:text-sm">
                            <strong className="block text-riksa-green font-bold mb-1 flex items-center gap-1">
                              <Info size={14} />
                              <span>Arti / Makna Budaya:</span>
                            </strong>
                            <p className="leading-relaxed">
                              {scanResult.translationId || "Kaidah aksara Sunda baku sesuai tata nulis konsonan dan rarangken resmi."}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                          <span>Transliterasi Otomatis Baku</span>
                          <span className="text-emerald-700 font-semibold">100% Offline</span>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

                </div>
              )}

            </div>
          </FadeIn>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PENGETIKAN MANUAL TEKS (BIDIRECTIONAL)            */}
        {/* ======================================================== */}
        {activeTab === 'text' && (
          <FadeIn delay={0.2}>
            <div className="bg-[#FAF7EE] text-stone-900 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border-2 border-riksa-gold/40 relative">
              
              {/* Top Switcher Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-200">
                <div className="flex items-center gap-2 text-sm font-bold font-sans">
                  <span className={`px-4 py-1.5 rounded-full ${mode === 'latin-to-sunda' ? 'bg-riksa-green text-white shadow-sm' : 'bg-stone-200/60 text-stone-600'}`}>
                    Latin
                  </span>
                  <span className="text-stone-400">➔</span>
                  <span className={`px-4 py-1.5 rounded-full ${mode === 'latin-to-sunda' ? 'bg-stone-200/60 text-stone-600' : 'bg-riksa-green text-white shadow-sm'}`}>
                    Aksara Sunda
                  </span>
                </div>

                {/* Toggle Mode Button */}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-riksa-orange hover:bg-riksa-orange-light text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <ArrowRightLeft size={16} />
                  <span>Tukar Arah Alih Aksara</span>
                </button>
              </div>

              {/* Input & Output Split Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                {/* Input Area */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center justify-between">
                    <span>{mode === 'latin-to-sunda' ? 'Ketik Teks Latin' : 'Ketik Aksara Sunda'}</span>
                    {input && (
                      <button
                        type="button"
                        onClick={() => setInput('')}
                        className="text-riksa-orange hover:underline text-[11px] font-semibold cursor-pointer"
                      >
                        Bersihkan
                      </button>
                    )}
                  </label>

                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'latin-to-sunda' ? 'Contoh: wilujeng sumping di tatar sunda...' : 'Tempel atanapi ketik aksara sunda...'}
                    rows={5}
                    className={`w-full p-4 rounded-2xl bg-white border border-stone-300 focus:border-riksa-green focus:ring-2 focus:ring-riksa-green/20 outline-none text-base resize-none shadow-inner ${
                      mode === 'sunda-to-latin' ? 'aksara-sunda text-2xl' : 'font-sans'
                    }`}
                  />
                </div>

                {/* Output Area */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      {mode === 'latin-to-sunda' ? 'Hasil Aksara Sunda Baku' : 'Hasil Teks Latin'}
                    </label>

                    {output && (
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs font-bold text-riksa-green hover:text-riksa-green-dark cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check size={14} className="text-emerald-600" />
                            <span className="text-emerald-600">Disalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Salin Hasil</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div 
                    className={`w-full p-4 rounded-2xl bg-white border border-stone-300 min-h-[140px] flex items-center overflow-auto shadow-inner ${
                      mode === 'latin-to-sunda' ? 'aksara-sunda text-3xl text-riksa-green-dark' : 'font-sans text-lg text-stone-800'
                    }`}
                  >
                    {output ? (
                      <span className="select-all leading-relaxed">{output}</span>
                    ) : (
                      <span className="text-stone-400 italic text-sm font-sans select-none">
                        Hasil alih aksara bakal otomatis medal di dieu...
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Quick Virtual Keyboard Accordion */}
              <div className="border-t border-stone-200 pt-5">
                <button
                  type="button"
                  onClick={() => setShowDictionary(!showDictionary)}
                  className="flex items-center justify-between w-full text-stone-700 hover:text-riksa-green font-bold text-sm cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} className="text-riksa-orange" />
                    <span>Kamus Cepat Aksara Sunda &amp; Rarangken (Bisa Diklik Langsung)</span>
                  </span>
                  {showDictionary ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {showDictionary && (
                  <div className="mt-5 space-y-4 pt-2 text-xs">
                    {/* Swara */}
                    <div>
                      <span className="font-bold text-stone-500 uppercase tracking-wider block mb-2">Aksara Swara (Vokal Mandiri):</span>
                      <div className="flex flex-wrap gap-2">
                        {DICT_SWARA.map(item => (
                          <button
                            key={item.latin}
                            type="button"
                            onClick={() => insertChar(item.aksara, item.latin)}
                            className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl hover:border-riksa-green hover:bg-emerald-50 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <span className="font-bold text-stone-500">{item.latin}:</span>
                            <span className="aksara-sunda text-xl text-riksa-green font-bold">{item.aksara}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ngalagena */}
                    <div>
                      <span className="font-bold text-stone-500 uppercase tracking-wider block mb-2">Aksara Ngalagena (Konsonan Dasar &amp; Serapan):</span>
                      <div className="flex flex-wrap gap-2">
                        {DICT_NGALAGENA.map(item => (
                          <button
                            key={item.latin}
                            type="button"
                            onClick={() => insertChar(item.aksara, item.latin)}
                            className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl hover:border-riksa-green hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <span className="font-bold text-stone-500">{item.latin}:</span>
                            <span className="aksara-sunda text-xl text-riksa-green font-bold">{item.aksara}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rarangken */}
                    <div>
                      <span className="font-bold text-stone-500 uppercase tracking-wider block mb-2">Rarangken (Tanda Bunyi &amp; Sisipan):</span>
                      <div className="flex flex-wrap gap-2">
                        {DICT_RARANGKEN.map(item => (
                          <button
                            key={item.nama}
                            type="button"
                            onClick={() => insertChar(item.aksara, item.latin)}
                            className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl hover:border-riksa-green hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <span className="text-stone-600 font-medium">{item.nama}:</span>
                            <span className="aksara-sunda text-xl text-riksa-orange font-bold">
                              {item.aksara === 'ᮦ' ? `ᮦᮊ` : `ᮊ${item.aksara}`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Wilangan */}
                    <div>
                      <span className="font-bold text-stone-500 uppercase tracking-wider block mb-2">Wilangan (Angka Sunda 0-9):</span>
                      <div className="flex flex-wrap gap-2">
                        {DICT_WILANGAN.map(item => (
                          <button
                            key={item.latin}
                            type="button"
                            onClick={() => insertChar(item.aksara, item.latin)}
                            className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl hover:border-riksa-green hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <span className="font-bold text-stone-500">
                              {'label' in item ? item.label : `${item.latin}:`}
                            </span>
                            <span className="aksara-sunda text-lg text-stone-800 font-bold">{item.aksara}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </FadeIn>
        )}

      </div>
    </section>
  );
}
