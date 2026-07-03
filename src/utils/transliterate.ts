export const LATIN_MAP: { [key: string]: string } = {
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

export function translateLatinToSunda(text: string): { aksara: string; latinRepr: string } {
  if (!text) return { aksara: "", latinRepr: "" };

  let result = "";
  let latinRepr: string[] = [];
  const clean = text.toLowerCase().trim().replace(/è/g, "é").replace(/[^a-zé ]/g, "");
  const words = clean.split(" ");

  for (const word of words) {
    if (!word) continue;
    let index = 0;

    while (index < word.length) {
      if (word[index] === "n" && isNgCoda(word, index)) {
        result += "ᮀ"; // Panyecek
        latinRepr.push("ng[panyecek]");
        index += 2; continue;
      }

      if (word[index] === "n" && word[index + 1] === "g") {
        const vowel = word[index + 2];
        if (vowel === "e" && word[index + 3] === "u") {
          result += "ᮍᮩ"; latinRepr.push("ngeu"); index += 4; continue;
        }
        if (vowel === "a") {
          result += "ᮍ"; latinRepr.push("nga"); index += 3; continue;
        }
        if (vowel && RARANGKEN_VOWEL[vowel]) {
          result += "ᮍ" + RARANGKEN_VOWEL[vowel]; latinRepr.push("ng" + vowel); index += 3; continue;
        }
      }

      if (index + 3 <= word.length) {
        const c3 = word.substring(index, index + 3);
        if (c3 === "nga") {
          if (index + 5 <= word.length && word.substring(index + 3, index + 5) === "eu") {
            result += "ᮍᮩ"; latinRepr.push("ngeu"); index += 5; continue;
          }
          const nv = word[index + 3];
          if (nv && RARANGKEN_VOWEL[nv]) {
            result += "ᮍ" + RARANGKEN_VOWEL[nv]; latinRepr.push("ng" + nv); index += 4; continue;
          }
          result += "ᮍ"; latinRepr.push("nga"); index += 3; continue;
        }

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

        if (c3.substring(1) === "eu" && LATIN_MAP[c3[0] + "a"]) {
          result += LATIN_MAP[c3[0] + "a"] + "ᮩ"; // + Paneuleung U+1BA9
          latinRepr.push(c3[0] + "eu"); index += 3; continue;
        }
      }

      if (index + 2 <= word.length) {
        const c2 = word.substring(index, index + 2);
        if (c2 === "eu") {
          result += "ᮉ"; latinRepr.push("eu"); index += 2; continue;
        }
        if (LATIN_MAP[c2]) {
          result += LATIN_MAP[c2]; latinRepr.push(c2); index += 2; continue;
        }
        const con = c2[0], vow = c2[1];
        if (LATIN_MAP[con + "a"] && RARANGKEN_VOWEL[vow]) {
          result += LATIN_MAP[con + "a"] + RARANGKEN_VOWEL[vow];
          latinRepr.push(con + vow); index += 2; continue;
        }
      }

      const char = word[index];
      if (LATIN_MAP[char]) {
        result += LATIN_MAP[char]; latinRepr.push(char); index += 1; continue;
      }

      if (LATIN_MAP[char + "a"]) {
        // ══ Consonant cluster check ══
        // Before using Pamaéh, check if the next char forms a cluster
        // that can use a sub-consonant rarangken instead.
        // Panyakra (ᮢ) for +r, Panyiku (ᮣ) for +l, Pamingkal (ᮡ) for +y
        const SUB_MAP: { [k: string]: string } = { "r": "ᮢ", "l": "ᮣ", "y": "ᮡ" };
        const nextChar = word[index + 1];

        if (nextChar && SUB_MAP[nextChar]) {
          const afterSub = word[index + 2];

          // Cluster + "eu" vowel (e.g. "kreu", "bleu")
          if (afterSub === "e" && index + 3 < word.length && word[index + 3] === "u") {
            result += LATIN_MAP[char + "a"] + SUB_MAP[nextChar] + "ᮩ"; // Paneuleung
            latinRepr.push(char + nextChar + "eu");
            index += 4; continue;
          }

          // Cluster + vowel with rarangken (e.g. "kri", "plo", "byu")
          if (afterSub && RARANGKEN_VOWEL[afterSub]) {
            result += LATIN_MAP[char + "a"] + SUB_MAP[nextChar] + RARANGKEN_VOWEL[afterSub];
            latinRepr.push(char + nextChar + afterSub);
            index += 3; continue;
          }

          // Cluster + 'a' vowel (e.g. "kra", "bla", "pya") — default vowel, no rarangken needed
          if (afterSub === "a") {
            result += LATIN_MAP[char + "a"] + SUB_MAP[nextChar];
            latinRepr.push(char + nextChar + "a");
            index += 3; continue;
          }

          // Cluster at end of word or before another consonant (e.g. "str" in loanwords)
          // Sub-consonant carries default 'a'
          if (afterSub === undefined || !isVowel(afterSub)) {
            result += LATIN_MAP[char + "a"] + SUB_MAP[nextChar];
            latinRepr.push(char + nextChar + "a");
            index += 2; continue;
          }
        }

        // ══ Coda 'r' → Panglayar ══
        if (char === "r") {
          result += "ᮁ"; // Panglayar U+1B81
          latinRepr.push("r[panglayar]"); index += 1; continue;
        }

        // ══ Coda 'h' → Pangwisad ══
        if (char === "h") {
          result += "ᮂ"; // Pangwisad U+1B82
          latinRepr.push("h[pangwisad]"); index += 1; continue;
        }

        // ══ True dead consonant → Pamaéh (last resort) ══
        result += LATIN_MAP[char + "a"] + "᮪"; // Pamaéh U+1BAA
        latinRepr.push(char + "[pamaéh]"); index += 1; continue;
      }
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

export function translateSundaToLatin(text: string): string {
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
