export const LATIN_MAP: { [key: string]: string } = {
  // Aksara Ngalagena — sesuai Tabél Aksara Sunda & Unicode
  "ka": "ᮊ", "ga": "ᮌ", "nga": "ᮍ",
  "ca": "ᮎ", "ja": "ᮏ", "nya": "ᮑ",  // nya=U+1B91, bukan U+1B90 (za)
  "ta": "ᮒ", "da": "ᮓ", "na": "ᮔ",
  "pa": "ᮕ", "ba": "ᮘ", "ma": "ᮙ",
  "ya": "ᮚ", "ra": "ᮛ", "la": "ᮜ", "wa": "ᮝ", "sa": "ᮞ", "ha": "ᮠ",
  "fa": "ᮖ", "qa": "ᮋ", "va": "ᮗ", "xa": "ᮟ", "za": "ᮐ", "kha": "ᮮ", "sya": "ᮯ",
  // Aksara Swara
  "a": "ᮃ", "i": "ᮄ", "u": "ᮅ", "é": "ᮆ", "o": "ᮇ", "e": "ᮈ", "eu": "ᮉ"
};

export const SUNDA_DIGITS: { [k: string]: string } = {
  "0": "᮰", "1": "᮱", "2": "᮲", "3": "᮳", "4": "᮴",
  "5": "᮵", "6": "᮶", "7": "᮷", "8": "᮸", "9": "᮹"
};

export const LATIN_DIGITS: { [k: string]: string } = {
  "᮰": "0", "᮱": "1", "᮲": "2", "᮳": "3", "᮴": "4",
  "᮵": "5", "᮶": "6", "᮷": "7", "᮸": "8", "᮹": "9"
};

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
const isNgCoda = (w: string, idx: number): boolean => {
  if (idx + 1 >= w.length || w[idx + 1] !== "g") return false;
  const afterG = w[idx + 2];
  return afterG === undefined || !isVowel(afterG);
};

export interface SyllableExplanation {
  part: string;          // e.g. "ri"
  aksaraPart: string;    // e.g. "ᮛᮤ"
  formula: string;       // e.g. "RA menjadi RI ditambah rarangkèn panghulu (ᮤ)"
}

export interface WordExplanation {
  word: string;          // e.g. "rik"
  aksaraWord: string;    // e.g. "ᮛᮤᮊ᮪"
  syllables: SyllableExplanation[];
}

export interface TransliterationResult {
  aksara: string;
  latinRepr: string;
  explanations: WordExplanation[];
}

export const CONSONANT_FORMULA_MAP: { [k: string]: { base: string; glyph: string } } = {
  "k": { base: "KA", glyph: "ᮊ" },
  "g": { base: "GA", glyph: "ᮌ" },
  "ng": { base: "NGA", glyph: "ᮍ" },
  "c": { base: "CA", glyph: "ᮎ" },
  "j": { base: "JA", glyph: "ᮏ" },
  "ny": { base: "NYA", glyph: "ᮑ" },
  "t": { base: "TA", glyph: "ᮒ" },
  "d": { base: "DA", glyph: "ᮓ" },
  "n": { base: "NA", glyph: "ᮔ" },
  "p": { base: "PA", glyph: "ᮕ" },
  "b": { base: "BA", glyph: "ᮘ" },
  "m": { base: "MA", glyph: "ᮙ" },
  "y": { base: "YA", glyph: "ᮚ" },
  "r": { base: "RA", glyph: "ᮛ" },
  "l": { base: "LA", glyph: "ᮜ" },
  "w": { base: "WA", glyph: "ᮝ" },
  "s": { base: "SA", glyph: "ᮞ" },
  "h": { base: "HA", glyph: "ᮠ" },
  "f": { base: "FA", glyph: "ᮖ" },
  "q": { base: "QA", glyph: "ᮋ" },
  "v": { base: "VA", glyph: "ᮗ" },
  "x": { base: "XA", glyph: "ᮟ" },
  "z": { base: "ZA", glyph: "ᮐ" },
  "kh": { base: "KHA", glyph: "ᮮ" },
  "sy": { base: "SYA", glyph: "ᮯ" }
};

export const RARANGKEN_FORMULA_MAP: { [k: string]: { name: string; glyph: string; sound: string } } = {
  "i": { name: "panghulu", glyph: "ᮤ", sound: "i" },
  "u": { name: "panyuku", glyph: "ᮥ", sound: "u" },
  "é": { name: "panéléng", glyph: "ᮦ", sound: "é" },
  "o": { name: "panolong", glyph: "ᮧ", sound: "o" },
  "e": { name: "pamepet", glyph: "ᮨ", sound: "e" },
  "eu": { name: "paneuleung", glyph: "ᮩ", sound: "eu" }
};

export const SUB_CONSONANT_NAMES: { [k: string]: { name: string; glyph: string; sound: string } } = {
  "r": { name: "panyakra", glyph: "ᮢ", sound: "+ra" },
  "l": { name: "panyiku", glyph: "ᮣ", sound: "+la" },
  "y": { name: "pamingkal", glyph: "ᮡ", sound: "+ya" }
};

export const CODA_NAMES: { [k: string]: { name: string; glyph: string; sound: string } } = {
  "r": { name: "panglayar", glyph: "ᮁ", sound: "+r" },
  "ng": { name: "panyecek", glyph: "ᮀ", sound: "+ng" },
  "h": { name: "pangwisad", glyph: "ᮂ", sound: "+h" }
};

export function translateLatinToSunda(text: string): TransliterationResult {
  if (!text) return { aksara: "", latinRepr: "", explanations: [] };

  let result = "";
  let latinRepr: string[] = [];
  const explanations: WordExplanation[] = [];

  // Normalisasi karakter Sunda Wilangan jika ada yang dimasukkan langsung
  let normalized = text;
  for (const [sundaDigit, latinDigit] of Object.entries(LATIN_DIGITS)) {
    normalized = normalized.split(sundaDigit).join(latinDigit);
  }

  const clean = normalized.toLowerCase().trim().replace(/è/g, "é").replace(/[^a-zé0-9| ]/g, "");
  const words = clean.split(" ");

  for (const word of words) {
    if (!word) continue;

    const currentWordSyls: SyllableExplanation[] = [];
    let currentWordAksara = "";

    // ══ Jika kata adalah bilangan/angka murni (misal: "2024" atau "|2024|") ══
    if (/^\|?\d+\|?$/.test(word)) {
      const digitsOnly = word.replace(/\|/g, "");
      const sundaDigits = digitsOnly.split("").map(d => SUNDA_DIGITS[d] || d).join("");
      result += `|${sundaDigits}| `;
      latinRepr.push(`|${digitsOnly}|`);
      latinRepr.push(" ");
      explanations.push({
        word: word,
        aksaraWord: `|${sundaDigits}|`,
        syllables: [{
          part: digitsOnly,
          aksaraPart: `|${sundaDigits}|`,
          formula: `Angka Wilangan Sunda ${digitsOnly} (|${sundaDigits}|) diapit ku tanda pembatas pipa (|)`
        }]
      });
      continue;
    }

    let index = 0;

    while (index < word.length) {
      // ══ Deteksi Angka (Wilangan) di dalam susunan kata ══
      if (word[index] === "|" || (word[index] >= "0" && word[index] <= "9")) {
        let numStr = "";
        if (word[index] === "|") index++;
        while (index < word.length && word[index] >= "0" && word[index] <= "9") {
          numStr += word[index];
          index++;
        }
        if (index < word.length && word[index] === "|") index++;
        if (numStr.length > 0) {
          const sundaDigits = numStr.split("").map(d => SUNDA_DIGITS[d] || d).join("");
          const pipedAksara = `|${sundaDigits}|`;
          result += pipedAksara;
          currentWordAksara += pipedAksara;
          currentWordSyls.push({
            part: numStr,
            aksaraPart: pipedAksara,
            formula: `Angka Wilangan Sunda ${numStr} (${pipedAksara}) diapit ku tanda pembatas pipa (|)`
          });
          latinRepr.push(`|${numStr}|`);
          continue;
        }
      }

      // ══ Coda 'ng' Onset / Coda check ══
      if (word[index] === "n" && isNgCoda(word, index)) {
        result += "ᮀ"; // Panyecek
        currentWordAksara += "ᮀ";
        currentWordSyls.push({
          part: "ng",
          aksaraPart: "ᮀ",
          formula: "ditambah rarangkèn panyecek (+ng / ᮀ) di luhur"
        });
        latinRepr.push("ng[panyecek]");
        index += 2; continue;
      }

      // ══ Onset 'ng' + vowel ══
      if (word[index] === "n" && word[index + 1] === "g") {
        const vowel = word[index + 2];
        if (vowel === "e" && word[index + 3] === "u") {
          result += "ᮍᮩ"; currentWordAksara += "ᮍᮩ";
          currentWordSyls.push({
            part: "ngeu",
            aksaraPart: "ᮍᮩ",
            formula: "NGA menjadi NGEU ditambah rarangkèn paneuleung (ᮩ)"
          });
          latinRepr.push("ngeu"); index += 4; continue;
        }
        if (vowel === "a") {
          result += "ᮍ"; currentWordAksara += "ᮍ";
          currentWordSyls.push({
            part: "nga",
            aksaraPart: "ᮍ",
            formula: "Aksara Ngalagena NGA (ᮍ) (sora vokal asli 'a')"
          });
          latinRepr.push("nga"); index += 3; continue;
        }
        if (vowel && RARANGKEN_VOWEL[vowel]) {
          const rar = RARANGKEN_FORMULA_MAP[vowel];
          const glyph = "ᮍ" + RARANGKEN_VOWEL[vowel];
          result += glyph; currentWordAksara += glyph;
          currentWordSyls.push({
            part: "ng" + vowel,
            aksaraPart: glyph,
            formula: `NGA menjadi NG${vowel.toUpperCase()} ditambah rarangkèn ${rar.name} (${rar.glyph})`
          });
          latinRepr.push("ng" + vowel); index += 3; continue;
        }
      }

      // ══ 3-character matching: nga, nya, consonant + eu ══
      if (index + 3 <= word.length) {
        const c3 = word.substring(index, index + 3);
        if (c3 === "nga") {
          if (index + 5 <= word.length && word.substring(index + 3, index + 5) === "eu") {
            result += "ᮍᮩ"; currentWordAksara += "ᮍᮩ";
            currentWordSyls.push({
              part: "ngeu",
              aksaraPart: "ᮍᮩ",
              formula: "NGA menjadi NGEU ditambah rarangkèn paneuleung (ᮩ)"
            });
            latinRepr.push("ngeu"); index += 5; continue;
          }
          const nv = word[index + 3];
          if (nv && RARANGKEN_VOWEL[nv]) {
            const rar = RARANGKEN_FORMULA_MAP[nv];
            const glyph = "ᮍ" + RARANGKEN_VOWEL[nv];
            result += glyph; currentWordAksara += glyph;
            currentWordSyls.push({
              part: "ng" + nv,
              aksaraPart: glyph,
              formula: `NGA menjadi NG${nv.toUpperCase()} ditambah rarangkèn ${rar.name} (${rar.glyph})`
            });
            latinRepr.push("ng" + nv); index += 4; continue;
          }
          result += "ᮍ"; currentWordAksara += "ᮍ";
          currentWordSyls.push({
            part: "nga",
            aksaraPart: "ᮍ",
            formula: "Aksara Ngalagena NGA (ᮍ) (sora vokal asli 'a')"
          });
          latinRepr.push("nga"); index += 3; continue;
        }

        if (c3 === "nya") {
          if (index + 5 <= word.length && word.substring(index + 3, index + 5) === "eu") {
            result += "ᮑᮩ"; currentWordAksara += "ᮑᮩ";
            currentWordSyls.push({
              part: "nyeu",
              aksaraPart: "ᮑᮩ",
              formula: "NYA menjadi NYEU ditambah rarangkèn paneuleung (ᮩ)"
            });
            latinRepr.push("nyeu"); index += 5; continue;
          }
          const nv = word[index + 3];
          if (nv && RARANGKEN_VOWEL[nv]) {
            const rar = RARANGKEN_FORMULA_MAP[nv];
            const glyph = "ᮑ" + RARANGKEN_VOWEL[nv];
            result += glyph; currentWordAksara += glyph;
            currentWordSyls.push({
              part: "ny" + nv,
              aksaraPart: glyph,
              formula: `NYA menjadi NY${nv.toUpperCase()} ditambah rarangkèn ${rar.name} (${rar.glyph})`
            });
            latinRepr.push("ny" + nv); index += 4; continue;
          }
          result += "ᮑ"; currentWordAksara += "ᮑ";
          currentWordSyls.push({
            part: "nya",
            aksaraPart: "ᮑ",
            formula: "Aksara Ngalagena NYA (ᮑ) (sora vokal asli 'a')"
          });
          latinRepr.push("nya"); index += 3; continue;
        }

        if (c3.substring(1) === "eu" && LATIN_MAP[c3[0] + "a"]) {
          const con = c3[0];
          const conInfo = CONSONANT_FORMULA_MAP[con];
          const baseName = conInfo ? conInfo.base : con.toUpperCase() + "A";
          const glyph = LATIN_MAP[con + "a"] + "ᮩ";
          result += glyph; currentWordAksara += glyph;
          currentWordSyls.push({
            part: c3,
            aksaraPart: glyph,
            formula: `${baseName} menjadi ${c3.toUpperCase()} ditambah rarangkèn paneuleung (ᮩ)`
          });
          latinRepr.push(c3[0] + "eu"); index += 3; continue;
        }
      }

      // ══ 2-character matching: standalone eu, standard CV pair ══
      if (index + 2 <= word.length) {
        const c2 = word.substring(index, index + 2);
        if (c2 === "eu") {
          result += "ᮉ"; currentWordAksara += "ᮉ";
          currentWordSyls.push({
            part: "eu",
            aksaraPart: "ᮉ",
            formula: "Aksara Swara mandiri EU (ᮉ)"
          });
          latinRepr.push("eu"); index += 2; continue;
        }
        if (LATIN_MAP[c2]) {
          result += LATIN_MAP[c2]; currentWordAksara += LATIN_MAP[c2];
          currentWordSyls.push({
            part: c2,
            aksaraPart: LATIN_MAP[c2],
            formula: `Aksara Ngalagena ${c2.toUpperCase()} (${LATIN_MAP[c2]}) (sora vokal asli 'a')`
          });
          latinRepr.push(c2); index += 2; continue;
        }
        const con = c2[0], vow = c2[1];
        if (LATIN_MAP[con + "a"] && RARANGKEN_VOWEL[vow]) {
          const conInfo = CONSONANT_FORMULA_MAP[con];
          const baseName = conInfo ? conInfo.base : con.toUpperCase() + "A";
          const rar = RARANGKEN_FORMULA_MAP[vow];
          const glyph = LATIN_MAP[con + "a"] + RARANGKEN_VOWEL[vow];
          result += glyph; currentWordAksara += glyph;
          currentWordSyls.push({
            part: con + vow,
            aksaraPart: glyph,
            formula: `${baseName} menjadi ${(con + vow).toUpperCase()} ditambah rarangkèn ${rar.name} (${rar.glyph})`
          });
          latinRepr.push(con + vow); index += 2; continue;
        }
      }

      // ══ 1-character matching ══
      const char = word[index];
      if (LATIN_MAP[char]) {
        result += LATIN_MAP[char]; currentWordAksara += LATIN_MAP[char];
        currentWordSyls.push({
          part: char,
          aksaraPart: LATIN_MAP[char],
          formula: `Aksara Swara mandiri ${char.toUpperCase()} (${LATIN_MAP[char]})`
        });
        latinRepr.push(char); index += 1; continue;
      }

      if (LATIN_MAP[char + "a"]) {
        const conInfo = CONSONANT_FORMULA_MAP[char];
        const baseName = conInfo ? conInfo.base : char.toUpperCase() + "A";
        const SUB_MAP: { [k: string]: string } = { "r": "ᮢ", "l": "ᮣ", "y": "ᮡ" };
        const nextChar = word[index + 1];

        // ══ Consonant cluster check (panyakra, panyiku, pamingkal) ══
        if (nextChar && SUB_MAP[nextChar]) {
          const subInfo = SUB_CONSONANT_NAMES[nextChar];
          const afterSub = word[index + 2];

          // Cluster + "eu" vowel (e.g. "kreu", "bleu")
          if (afterSub === "e" && index + 3 < word.length && word[index + 3] === "u") {
            const glyph = LATIN_MAP[char + "a"] + SUB_MAP[nextChar] + "ᮩ";
            result += glyph; currentWordAksara += glyph;
            currentWordSyls.push({
              part: char + nextChar + "eu",
              aksaraPart: glyph,
              formula: `${baseName} diseselan rarangkèn ${subInfo.name} (${subInfo.sound} / ${subInfo.glyph}) sarta ditambah rarangkèn paneuleung (ᮩ) janten ${(char + nextChar + "eu").toUpperCase()}`
            });
            latinRepr.push(char + nextChar + "eu");
            index += 4; continue;
          }

          // Cluster + vowel with rarangken (e.g. "kri", "plo", "byu")
          if (afterSub && RARANGKEN_VOWEL[afterSub]) {
            const rar = RARANGKEN_FORMULA_MAP[afterSub];
            const glyph = LATIN_MAP[char + "a"] + SUB_MAP[nextChar] + RARANGKEN_VOWEL[afterSub];
            result += glyph; currentWordAksara += glyph;
            currentWordSyls.push({
              part: char + nextChar + afterSub,
              aksaraPart: glyph,
              formula: `${baseName} diseselan rarangkèn ${subInfo.name} (${subInfo.sound} / ${subInfo.glyph}) sarta ditambah rarangkèn ${rar.name} (${rar.glyph}) janten ${(char + nextChar + afterSub).toUpperCase()}`
            });
            latinRepr.push(char + nextChar + afterSub);
            index += 3; continue;
          }

          // Cluster + 'a' vowel (e.g. "kra", "bla", "pya")
          if (afterSub === "a") {
            const glyph = LATIN_MAP[char + "a"] + SUB_MAP[nextChar];
            result += glyph; currentWordAksara += glyph;
            currentWordSyls.push({
              part: char + nextChar + "a",
              aksaraPart: glyph,
              formula: `${baseName} diseselan rarangkèn ${subInfo.name} (${subInfo.sound} / ${subInfo.glyph}) janten ${(char + nextChar + "a").toUpperCase()}`
            });
            latinRepr.push(char + nextChar + "a");
            index += 3; continue;
          }

          // Cluster at end of word or before another consonant
          if (afterSub === undefined || !isVowel(afterSub)) {
            const glyph = LATIN_MAP[char + "a"] + SUB_MAP[nextChar];
            result += glyph; currentWordAksara += glyph;
            currentWordSyls.push({
              part: char + nextChar + "a",
              aksaraPart: glyph,
              formula: `${baseName} diseselan rarangkèn ${subInfo.name} (${subInfo.sound} / ${subInfo.glyph}) janten ${(char + nextChar + "a").toUpperCase()}`
            });
            latinRepr.push(char + nextChar + "a");
            index += 2; continue;
          }
        }

        // ══ Coda 'r' → Panglayar ══
        if (char === "r") {
          result += "ᮁ"; currentWordAksara += "ᮁ";
          currentWordSyls.push({
            part: "r",
            aksaraPart: "ᮁ",
            formula: "ditambah rarangkèn panglayar (+r / ᮁ) di luhur"
          });
          latinRepr.push("r[panglayar]"); index += 1; continue;
        }

        // ══ Coda 'h' → Pangwisad ══
        if (char === "h") {
          result += "ᮂ"; currentWordAksara += "ᮂ";
          currentWordSyls.push({
            part: "h",
            aksaraPart: "ᮂ",
            formula: "ditambah rarangkèn pangwisad (+h / ᮂ) di tungtung"
          });
          latinRepr.push("h[pangwisad]"); index += 1; continue;
        }

        // ══ True dead consonant → Pamaéh (last resort) ══
        const glyph = LATIN_MAP[char + "a"] + "᮪";
        result += glyph; currentWordAksara += glyph;
        currentWordSyls.push({
          part: char,
          aksaraPart: glyph,
          formula: `${baseName} menjadi ${char.toUpperCase()} ditambah rarangkèn pamaèh (᮪)`
        });
        latinRepr.push(char + "[pamaéh]"); index += 1; continue;
      }
      index++;
    }

    if (currentWordSyls.length > 0) {
      explanations.push({
        word: word,
        aksaraWord: currentWordAksara,
        syllables: currentWordSyls
      });
    }

    result += " ";
    latinRepr.push(" ");
  }

  return {
    aksara: result.trim(),
    latinRepr: latinRepr.join("-").replace(/- -/g, " | "),
    explanations
  };
}

const CONSONANT_BASE: { [k: string]: string } = {
  "ᮊ": "k",  "ᮋ": "q",  "ᮌ": "g",  "ᮍ": "ng", "ᮎ": "c",  "ᮏ": "j",
  "ᮐ": "z",  "ᮑ": "ny", "ᮒ": "t",  "ᮓ": "d",  "ᮔ": "n",  "ᮕ": "p",
  "ᮖ": "f",  "ᮗ": "v",  "ᮘ": "b",  "ᮙ": "m",  "ᮚ": "y",  "ᮛ": "r",
  "ᮜ": "l",  "ᮝ": "w",  "ᮞ": "s",  "ᮟ": "x",  "ᮠ": "h",  "ᮮ": "kh", "ᮯ": "sy"
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

export function translateSundaToLatin(text: string): string {
  if (!text) return "";
  let result = "";
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === " " || ".,;:!?-\"'()[]".includes(c)) {
      result += c; i++; continue;
    }

    // ══ Wilangan (Angka Sunda ᮰ - ᮹ & Angka Latin 0 - 9) ══
    if (LATIN_DIGITS[c]) {
      result += LATIN_DIGITS[c];
      i++;
      continue;
    }
    if (c >= "0" && c <= "9") {
      result += c;
      i++;
      continue;
    }

    // ══ Pembatas Wilangan (Piping |) ══
    if (c === "|") {
      const prevIsDigit = i > 0 && (!!LATIN_DIGITS[text[i - 1]] || (text[i - 1] >= '0' && text[i - 1] <= '9'));
      const nextIsDigit = i + 1 < text.length && (!!LATIN_DIGITS[text[i + 1]] || (text[i + 1] >= '0' && text[i + 1] <= '9'));
      if (prevIsDigit || nextIsDigit) {
        i++;
        continue;
      }
      result += "|";
      i++;
      continue;
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
  // Normalisasi ejaan fonetik khas (seperti sampurasun, riksa sukapura, silih asih asah asuh)
  return result
    .replace(/sampura+sun/gi, "sampurasun")
    .replace(/riksasukapura/gi, "riksa sukapura")
    .replace(/wilujengsumping/gi, "wilujeng sumping")
    .replace(/silihasihsilihasahsilihasuh/gi, "silih asih silih asah silih asuh")
    .replace(/silihasahsilihasihsilihasuh/gi, "silih asah silih asih silih asuh")
    .replace(/silihasihasahasuh/gi, "silih asih asah asuh")
    .replace(/kujangpasundan/gi, "kujang pasundan")
    .replace(/aa+/g, "a")
    .trim();
}

export function explainSundaToLatin(text: string): WordExplanation[] {
  if (!text) return [];
  const explanations: WordExplanation[] = [];
  const words = text.trim().split(/\s+/);

  for (const word of words) {
    if (!word) continue;
    const syls: SyllableExplanation[] = [];
    let i = 0;

    while (i < word.length) {
      const c = word[i];

      // ══ Wilangan (Angka) ══
      if (c === "|" || LATIN_DIGITS[c] || (c >= "0" && c <= "9")) {
        let numAksara = "";
        let numLatin = "";
        let hasPipe = false;
        if (c === "|") { hasPipe = true; i++; }
        while (i < word.length && (LATIN_DIGITS[word[i]] || (word[i] >= "0" && word[i] <= "9"))) {
          numAksara += word[i];
          numLatin += LATIN_DIGITS[word[i]] || word[i];
          i++;
        }
        if (i < word.length && word[i] === "|") { hasPipe = true; i++; }
        if (numAksara.length > 0) {
          const displayAksara = hasPipe ? `|${numAksara}|` : numAksara;
          syls.push({
            part: numLatin,
            aksaraPart: displayAksara,
            formula: `Angka Wilangan Sunda ${numLatin} (${displayAksara}) diapit ku tanda pembatas pipa (|)`
          });
          continue;
        }
      }

      // ══ Aksara Swara (Vokal Mandiri) ══
      if (SWARA[c]) {
        const sound = SWARA[c].toUpperCase();
        syls.push({
          part: SWARA[c],
          aksaraPart: c,
          formula: `Aksara Swara mandiri ${sound} (${c})`
        });
        i++;
        continue;
      }

      // ══ Aksara Ngalagena (Konsonan Dasar) ══
      if (CONSONANT_BASE[c]) {
        const baseLatin = CONSONANT_BASE[c];
        const baseName = baseLatin.toUpperCase() + "A";
        let partAksara = c;
        let partLatin = baseLatin;
        let formula = "";
        i++;

        // Sub-consonant (Panyesel: Panyakra, Panyiku, Pamingkal)
        let subName = "";
        if (i < word.length && CONSONANT_SUB[word[i]]) {
          const subChar = word[i];
          partAksara += subChar;
          const subSound = CONSONANT_SUB[subChar];
          const subKey = subSound.replace("a", "");
          const subInfo = SUB_CONSONANT_NAMES[subKey];
          subName = subInfo?.name || "panyesel";
          partLatin += subKey;
          i++;
        }

        // Vowel modifier or Pamaeh
        if (i < word.length && VOWEL_MODIFIER[word[i]]) {
          const vm = word[i];
          partAksara += vm;
          const vowSound = VOWEL_MODIFIER[vm];
          const rarInfo = RARANGKEN_FORMULA_MAP[vowSound];
          partLatin += vowSound;
          if (subName) {
            formula = `${baseName} diseselan rarangkèn ${subName} sarta ditambah rarangkèn ${rarInfo?.name || "panyora"} (${vm}) janten ${partLatin.toUpperCase()}`;
          } else {
            formula = `${baseName} menjadi ${partLatin.toUpperCase()} ditambah rarangkèn ${rarInfo?.name || "panyora"} (${vm})`;
          }
          i++;
        } else if (i < word.length && word[i] === "᮪") {
          partAksara += "᮪";
          formula = `${baseName} menjadi ${partLatin.toUpperCase()} ditambah rarangkèn pamaèh (᮪)`;
          i++;
        } else {
          partLatin += "a";
          if (subName) {
            formula = `${baseName} diseselan rarangkèn ${subName} janten ${partLatin.toUpperCase()}`;
          } else {
            formula = `Aksara Ngalagena ${baseName} (${c}) (sora vokal asli 'a')`;
          }
        }

        // Coda (Panyecek, Panglayar, Pangwisad) attached directly
        if (i < word.length && CODA_MAP[word[i]]) {
          const cd = word[i];
          const codaSound = CODA_MAP[cd];
          const codaInfo = CODA_NAMES[codaSound];
          partAksara += cd;
          partLatin += codaSound;
          formula += ` sarta ditambah rarangkèn ${codaInfo?.name || "coda"} (+${codaSound} / ${cd})`;
          i++;
        }

        syls.push({
          part: partLatin,
          aksaraPart: partAksara,
          formula: formula
        });
        continue;
      }

      // Standalone Coda
      if (CODA_MAP[c]) {
        const codaSound = CODA_MAP[c];
        const codaInfo = CODA_NAMES[codaSound];
        syls.push({
          part: codaSound,
          aksaraPart: c,
          formula: `Ditambah rarangkèn ${codaInfo?.name || "coda"} (+${codaSound} / ${c}) di ${c === "ᮂ" ? "tungtung" : "luhur"}`
        });
        i++;
        continue;
      }

      i++;
    }

    if (syls.length > 0) {
      explanations.push({
        word: translateSundaToLatin(word) || word,
        aksaraWord: word,
        syllables: syls
      });
    }
  }

  return explanations;
}
