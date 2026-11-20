import { useState } from 'react';
import { ArrowRightLeft, Copy, Check, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
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
  { latin: "—", aksara: "᮪", nama: "Pamaéh (mati)" }
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

  const output = mode === 'latin-to-sunda' 
    ? translateLatinToSunda(input).aksara 
    : translateSundaToLatin(input);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertChar = (char: string) => {
    setInput(prev => prev + char);
  };

  return (
    <section id="converter" className="py-20 sm:py-28 bg-[#143D22] text-white relative overflow-hidden">
      
      {/* Background Motifs */}
      <div className="absolute inset-0 pattern-sunda-dark opacity-35 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-riksa-gold font-bold text-xs uppercase tracking-wider mb-4 border border-white/15 backdrop-blur-sm">
              <Sparkles size={14} className="text-riksa-gold" />
              <span>Teknologi Literasi</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Mesin Alih Aksara Sunda
            </h2>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-8 h-[2px] bg-riksa-orange rounded-full" />
              <span className="w-16 h-[3px] bg-riksa-gold rounded-full" />
              <span className="w-8 h-[2px] bg-riksa-orange rounded-full" />
            </div>

            <p className="font-sans text-emerald-100/80 text-base sm:text-lg leading-relaxed">
              Konversikan tulisan Latin ke Aksara Sunda baku atau sebaliknya secara instan, 
              akurat, dan sesuai dengan kaidah ortografi Sunda mutakhir.
            </p>
          </FadeIn>
        </div>

        {/* Converter Main Interactive Card */}
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-riksa-orange hover:bg-riksa-orange-light text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200"
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
                      className="text-riksa-orange hover:underline text-[11px] font-semibold"
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
                      className="flex items-center gap-1.5 text-xs font-bold text-riksa-green hover:text-riksa-green-dark"
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
                className="flex items-center justify-between w-full text-stone-700 hover:text-riksa-green font-bold text-sm"
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
                          onClick={() => insertChar(item.aksara)}
                          className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl hover:border-riksa-green hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        >
                          <span className="font-bold text-stone-500">{item.latin}:</span>
                          <span className="aksara-sunda text-xl text-riksa-green font-bold">{item.aksara}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ngalagena */}
                  <div>
                    <span className="font-bold text-stone-500 uppercase tracking-wider block mb-2">Aksara Ngalagena (Konsonan Dasar):</span>
                    <div className="flex flex-wrap gap-2">
                      {DICT_NGALAGENA.slice(0, 15).map(item => (
                        <button
                          key={item.latin}
                          type="button"
                          onClick={() => insertChar(item.aksara)}
                          className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl hover:border-riksa-green hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
                        >
                          <span className="font-bold text-stone-500">{item.latin}:</span>
                          <span className="aksara-sunda text-xl text-riksa-green font-bold">{item.aksara}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rarangken */}
                  <div>
                    <span className="font-bold text-stone-500 uppercase tracking-wider block mb-2">Rarangken (Tanda Bunyi):</span>
                    <div className="flex flex-wrap gap-2">
                      {DICT_RARANGKEN.map(item => (
                        <button
                          key={item.nama}
                          type="button"
                          onClick={() => insertChar(item.aksara)}
                          className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl hover:border-riksa-green hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
                        >
                          <span className="text-stone-600 font-medium">{item.nama}:</span>
                          <span className="aksara-sunda text-xl text-riksa-orange font-bold">ᮊ{item.aksara}</span>
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
                          onClick={() => insertChar(item.aksara)}
                          className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl hover:border-riksa-green hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
                        >
                          <span className="font-bold text-stone-500">{item.latin}:</span>
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

      </div>
    </section>
  );
}
