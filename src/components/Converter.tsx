import { useState } from 'react';
import { ArrowRightLeft, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import FadeIn from './Shared/FadeIn';
import { translateLatinToSunda, translateSundaToLatin } from '../utils/transliterate';

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
  { latin: "xa", aksara: "ᮟ" }, { latin: "za", aksara: "ᮐ" }
];

// Rarangken dikelompokkan sesuai posisi penulisan
const DICT_RARANGKEN_ATAS = [
  { latin: "i", aksara: "ᮤ", nama: "Panghulu" },
  { latin: "e", aksara: "ᮨ", nama: "Pamepet" },
  { latin: "eu", aksara: "ᮩ", nama: "Paneuleung" },
  { latin: "r", aksara: "ᮁ", nama: "Panglayar" },
  { latin: "ng", aksara: "ᮀ", nama: "Panyecek" },
];

const DICT_RARANGKEN_BAWAH = [
  { latin: "u", aksara: "ᮥ", nama: "Panyuku" },
  { latin: "la", aksara: "ᮣ", nama: "Panyiku" },
  { latin: "ra", aksara: "ᮢ", nama: "Panyakra" },
];

const DICT_RARANGKEN_SEJAJAR = [
  { latin: "é", aksara: "ᮦ", nama: "Panéléng" },
  { latin: "o", aksara: "ᮧ", nama: "Panolong" },
  { latin: "ya", aksara: "ᮡ", nama: "Pamingkal" },
  { latin: "h", aksara: "ᮂ", nama: "Pangwisad" },
  { latin: "—", aksara: "᮪", nama: "Pamaéh" },
];

// Flat list for keyboard usage
const DICT_RARANGKEN = [
  { latin: "i", aksara: "ᮤ", desc: "Panghulu (di atas)" },
  { latin: "u", aksara: "ᮥ", desc: "Panyuku (di bawah)" },
  { latin: "é", aksara: "ᮦ", desc: "Panéléng (sejajar)" },
  { latin: "o", aksara: "ᮧ", desc: "Panolong (sejajar)" },
  { latin: "e", aksara: "ᮨ", desc: "Pamepet (di atas)" },
  { latin: "eu", aksara: "ᮩ", desc: "Paneuleung (di atas)" },
  { latin: "ng", aksara: "ᮀ", desc: "Panyecek (di atas)" },
  { latin: "r", aksara: "ᮁ", desc: "Panglayar (di atas)" },
  { latin: "h", aksara: "ᮂ", desc: "Pangwisad (sejajar)" },
  { latin: "ya", aksara: "ᮡ", desc: "Pamingkal (sejajar)" },
  { latin: "ra", aksara: "ᮢ", desc: "Panyakra (di bawah)" },
  { latin: "la", aksara: "ᮣ", desc: "Panyiku (di bawah)" },
  { latin: "", aksara: "᮪", desc: "Pamaéh (Mati)" }
];

const DICT_WILANGAN = [
  { latin: "1", aksara: "᮱" }, { latin: "2", aksara: "᮲" }, { latin: "3", aksara: "᮳" },
  { latin: "4", aksara: "᮴" }, { latin: "5", aksara: "᮵" }, { latin: "6", aksara: "᮶" },
  { latin: "7", aksara: "᮷" }, { latin: "8", aksara: "᮸" }, { latin: "9", aksara: "᮹" },
  { latin: "0", aksara: "᮰" }
];

export default function Converter() {
  const [mode, setMode] = useState<'latin-to-sunda' | 'sunda-to-latin'>('latin-to-sunda');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);

  const toggleMode = () => {

    setMode(m => m === 'latin-to-sunda' ? 'sunda-to-latin' : 'latin-to-sunda');
    setInput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const output = mode === 'latin-to-sunda' 
    ? translateLatinToSunda(input).aksara 
    : translateSundaToLatin(input);

  return (
    <section id="converter" className="py-16 md:py-24 bg-riksa-brown-dark relative overflow-hidden">
      <div className="absolute inset-0 pattern-sunda-dark opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <FadeIn className="text-center mb-10 md:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-riksa-cream font-bold mb-4">Mesin Alih Aksara</h2>
          <div className="w-16 h-1 bg-riksa-gold mx-auto rounded"></div>
          <p className="mt-6 text-riksa-cream/80 max-w-2xl mx-auto font-sans">
            Konversikan teks Latin ke Aksara Sunda baku atau sebaliknya secara instan.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="max-w-4xl mx-auto">
          <div className="bg-riksa-cream rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 border-2 sm:border-4 border-riksa-gold/20">
            
            {/* Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
              <div className={`px-4 sm:px-6 py-3 rounded-xl font-bold flex-1 text-center transition-all ${mode === 'latin-to-sunda' ? 'bg-riksa-brown-dark text-riksa-gold' : 'bg-transparent text-riksa-brown-dark border-2 border-riksa-brown-dark/20'}`}>
                Latin
              </div>
              
              <button 
                onClick={toggleMode}
                className="bg-riksa-orange text-white p-3.5 sm:p-4 rounded-full hover:bg-riksa-orange-light hover:rotate-180 transition-all duration-500 shadow-lg shrink-0 self-center"
                aria-label="Tukar arah transliterasi"
              >
                <ArrowRightLeft size={24} />
              </button>
              
              <div className={`px-4 sm:px-6 py-3 rounded-xl font-bold flex-1 text-center transition-all ${mode === 'sunda-to-latin' ? 'bg-riksa-brown-dark text-riksa-gold' : 'bg-transparent text-riksa-brown-dark border-2 border-riksa-brown-dark/20'}`}>
                Aksara Sunda
              </div>
            </div>

            {/* Translation Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              <div className="flex flex-col">
                <label className="text-riksa-brown-dark font-bold mb-2 ml-2 text-sm uppercase tracking-wider">
                  Masukan Teks ({mode === 'latin-to-sunda' ? 'Latin' : 'Aksara Sunda'})
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'latin-to-sunda' ? 'Ketik bahasa Sunda di dieu...' : 'Pilih huruf tina kibor di handap atawa ketik manual...'}
                  className={`w-full h-44 sm:h-48 p-4 sm:p-5 bg-white border-2 border-riksa-brown-dark/10 rounded-2xl focus:outline-none focus:border-riksa-orange resize-none text-base sm:text-xl ${mode === 'sunda-to-latin' ? 'aksara-sunda text-2xl sm:text-3xl' : 'font-sans'}`}
                />
                
                {/* Virtual Keyboard */}
                {mode === 'sunda-to-latin' && (
                  <div className="mt-4 bg-white/50 border border-riksa-brown-dark/10 rounded-2xl p-3 sm:p-4">
                    <p className="text-xs font-bold text-riksa-orange uppercase mb-3 border-b border-riksa-orange/20 pb-2">Kibor Aksara Sunda (Keyboard)</p>
                    
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                      {/* Swara */}
                      <div>
                        <p className="text-[10px] font-bold text-riksa-brown-dark/50 mb-1">SWARA</p>
                        <div className="flex flex-wrap gap-1.5">
                          {DICT_SWARA.map(item => (
                            <button
                              key={`kb-swara-${item.latin}`}
                              onClick={() => setInput(prev => prev + item.aksara)}
                              className="bg-white border border-riksa-brown-dark/10 hover:border-riksa-orange hover:bg-riksa-orange hover:text-white px-2 py-1 rounded-lg transition-colors min-w-9 sm:min-w-10 flex flex-col items-center justify-center group"
                              title={item.latin}
                            >
                              <span className="text-xl aksara-sunda mb-0.5">{item.aksara}</span>
                              <span className="text-[10px] font-bold text-riksa-brown-dark/50 group-hover:text-white/80 uppercase leading-none">{item.latin}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Ngalagena */}
                      <div>
                        <p className="text-[10px] font-bold text-riksa-brown-dark/50 mb-1">NGALAGENA</p>
                        <div className="flex flex-wrap gap-1.5">
                          {DICT_NGALAGENA.map(item => (
                            <button
                              key={`kb-ngalagena-${item.latin}`}
                              onClick={() => setInput(prev => prev + item.aksara)}
                              className="bg-white border border-riksa-brown-dark/10 hover:border-riksa-orange hover:bg-riksa-orange hover:text-white px-2 py-1 rounded-lg transition-colors min-w-9 sm:min-w-10 flex flex-col items-center justify-center group"
                              title={item.latin}
                            >
                              <span className="text-xl aksara-sunda mb-0.5">{item.aksara}</span>
                              <span className="text-[10px] font-bold text-riksa-brown-dark/50 group-hover:text-white/80 uppercase leading-none">{item.latin}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rarangken */}
                      <div>
                        <p className="text-[10px] font-bold text-riksa-brown-dark/50 mb-1">RARANGKEN</p>
                        <div className="flex flex-wrap gap-1.5">
                          {DICT_RARANGKEN.map(item => (
                            <button
                              key={`kb-rarangken-${item.desc}`}
                              onClick={() => setInput(prev => prev + item.aksara)}
                              className="bg-white border border-riksa-brown-dark/10 hover:border-riksa-orange hover:bg-riksa-orange hover:text-white px-2 py-1 rounded-lg transition-colors min-w-9 sm:min-w-10 flex flex-col items-center justify-center group"
                              title={`+${item.latin} (${item.desc})`}
                            >
                              <span className="text-xl aksara-sunda mb-0.5">◌{item.aksara}</span>
                              <span className="text-[10px] font-bold text-riksa-brown-dark/50 group-hover:text-white/80 uppercase leading-none">+{item.latin}</span>
                            </button>
                          ))}
                          {/* Extra backspace/space for convenience in virtual keyboard */}
                          <button
                            onClick={() => setInput(prev => prev + ' ')}
                            className="bg-riksa-brown-dark/10 hover:bg-riksa-orange hover:text-white px-4 py-1 rounded-lg text-xs font-bold font-sans transition-colors"
                          >
                            SPASI
                          </button>
                          <button
                            onClick={() => setInput(prev => prev.slice(0, -1))}
                            className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white px-4 py-1 rounded-lg text-xs font-bold font-sans transition-colors"
                          >
                            HAPUS
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col relative">
                <div className="flex flex-wrap justify-between items-end gap-2 mb-2">
                  <label className="text-riksa-brown-dark font-bold ml-2 text-sm uppercase tracking-wider">
                    Hasil Transliterasi
                  </label>
                  <button 
                    onClick={handleCopy}
                    disabled={!output}
                    className="flex items-center gap-2 text-riksa-orange hover:text-riksa-orange-light disabled:opacity-50 transition-colors text-sm font-bold"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>
                <div 
                  className={`w-full h-44 sm:h-48 p-4 sm:p-5 bg-riksa-brown-dark/5 border-2 border-riksa-brown-dark/5 rounded-2xl overflow-y-auto break-words text-base sm:text-xl text-riksa-brown-dark ${mode === 'latin-to-sunda' ? 'aksara-sunda text-2xl sm:text-3xl' : 'font-sans'}`}
                >
                  {output || <span className="opacity-30">Hasil akan muncul di sini...</span>}
                </div>
              </div>
            </div>

            {/* Dictionary Toggle */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowDictionary(!showDictionary)}
                className="text-riksa-brown-dark font-bold hover:text-riksa-orange transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {showDictionary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                {showDictionary ? 'Tutup Kamus Aksara' : 'Buka Kamus Aksara (Contekan)'}
              </button>
            </div>

            {/* Dictionary Area */}
            {showDictionary && (
              <div className="mt-8 pt-8 border-t-2 border-riksa-brown-dark/10">
                <h3 className="font-serif text-2xl text-riksa-brown-dark font-bold mb-6 text-center">Tabél Aksara Sunda</h3>
                
                <div className="space-y-8">
                  {/* Swara (Vokal Mandiri) */}
                  <div>
                    <h4 className="font-bold text-riksa-orange mb-4 uppercase tracking-wider text-sm border-b border-riksa-orange/20 pb-2">Aksara Swara (Vokal Mandiri)</h4>
                    <div className="grid grid-cols-3 min-[420px]:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
                      {DICT_SWARA.map(item => (
                        <div key={item.latin} className="bg-white border border-riksa-brown-dark/10 rounded-xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-center shadow-sm">
                          <span className="aksara-sunda text-2xl text-riksa-brown-dark mb-1">{item.aksara}</span>
                          <span className="text-xs font-bold text-riksa-brown-dark/50 uppercase">{item.latin}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ngalagena (Konsonan Dasar) */}
                  <div>
                    <h4 className="font-bold text-riksa-orange mb-4 uppercase tracking-wider text-sm border-b border-riksa-orange/20 pb-2">Aksara Ngalagena (Konsonan Dasar)</h4>
                    <div className="grid grid-cols-3 min-[420px]:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
                      {DICT_NGALAGENA.map(item => (
                        <div key={item.latin} className="bg-white border border-riksa-brown-dark/10 rounded-xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-center shadow-sm">
                          <span className="aksara-sunda text-2xl text-riksa-brown-dark mb-1">{item.aksara}</span>
                          <span className="text-xs font-bold text-riksa-brown-dark/50 uppercase">{item.latin}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rarangken - Grouped by Position */}
                  <div>
                    <h4 className="font-bold text-riksa-orange mb-4 uppercase tracking-wider text-sm border-b border-riksa-orange/20 pb-2">Rarangkén (Penanda Bunyi)</h4>
                    
                    <div className="space-y-5">
                      {/* Di luhureun (di atas) */}
                      <div>
                        <p className="text-xs font-bold text-riksa-brown-dark/60 mb-2 ml-1">Nu ditulis di luhureun aksara ngalagena (di atas)</p>
                        <div className="grid grid-cols-2 min-[420px]:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                          {DICT_RARANGKEN_ATAS.map(item => (
                            <div key={item.nama} className="bg-white border border-riksa-brown-dark/10 rounded-xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-center shadow-sm">
                              <div className="flex items-center gap-0.5 mb-1">
                                <span className="text-riksa-brown-dark/30 text-lg">◌</span>
                                <span className="aksara-sunda text-2xl text-riksa-brown-dark -ml-1">{item.aksara}</span>
                              </div>
                              <span className="text-[11px] font-bold text-riksa-orange">{item.nama}</span>
                              <span className="text-[10px] text-riksa-brown-dark/40">+{item.latin}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Di handapeun (di bawah) */}
                      <div>
                        <p className="text-xs font-bold text-riksa-brown-dark/60 mb-2 ml-1">Nu ditulis di handapeun aksara ngalagena (di bawah)</p>
                        <div className="grid grid-cols-2 min-[420px]:grid-cols-3 gap-2 sm:gap-3">
                          {DICT_RARANGKEN_BAWAH.map(item => (
                            <div key={item.nama} className="bg-white border border-riksa-brown-dark/10 rounded-xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-center shadow-sm">
                              <div className="flex items-center gap-0.5 mb-1">
                                <span className="text-riksa-brown-dark/30 text-lg">◌</span>
                                <span className="aksara-sunda text-2xl text-riksa-brown-dark -ml-1">{item.aksara}</span>
                              </div>
                              <span className="text-[11px] font-bold text-riksa-orange">{item.nama}</span>
                              <span className="text-[10px] text-riksa-brown-dark/40">+{item.latin}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sajajar (sejajar) */}
                      <div>
                        <p className="text-xs font-bold text-riksa-brown-dark/60 mb-2 ml-1">Nu ditulis sajajar jeung aksara ngalagena (sejajar)</p>
                        <div className="grid grid-cols-2 min-[420px]:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                          {DICT_RARANGKEN_SEJAJAR.map(item => (
                            <div key={item.nama} className="bg-white border border-riksa-brown-dark/10 rounded-xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-center shadow-sm">
                              <div className="flex items-center gap-0.5 mb-1">
                                <span className="text-riksa-brown-dark/30 text-lg">◌</span>
                                <span className="aksara-sunda text-2xl text-riksa-brown-dark -ml-1">{item.aksara}</span>
                              </div>
                              <span className="text-[11px] font-bold text-riksa-orange">{item.nama}</span>
                              <span className="text-[10px] text-riksa-brown-dark/40">+{item.latin}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Aksara Wilangan (Angka) */}
                  <div>
                    <h4 className="font-bold text-riksa-orange mb-4 uppercase tracking-wider text-sm border-b border-riksa-orange/20 pb-2">Aksara Wilangan (Angka)</h4>
                    <div className="grid grid-cols-3 min-[420px]:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-3">
                      {DICT_WILANGAN.map(item => (
                        <div key={item.latin} className="bg-white border border-riksa-brown-dark/10 rounded-xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-center shadow-sm">
                          <span className="aksara-sunda text-2xl text-riksa-brown-dark mb-1">{item.aksara}</span>
                          <span className="text-xs font-bold text-riksa-brown-dark/50">{item.latin}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
