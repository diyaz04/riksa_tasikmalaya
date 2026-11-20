export default function SundaneseRoofHeading({ title, className = '' }: { title?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* Roof Ornament with Flanking Horizontal Lines */}
      <div className="flex items-center justify-center gap-3 w-full max-w-xs mb-2">
        <span className="grow h-[2px] bg-gradient-to-r from-transparent via-riksa-orange/60 to-riksa-gold rounded-full" />
        <svg width="48" height="20" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          {/* Traditional Julang Ngapak / Badak Heuay Roof Silhouette */}
          <path 
            d="M4,17 Q24,2 44,17 L41,19 Q24,7 7,19 Z" 
            fill="url(#roof-accent)" 
          />
          {/* Spire */}
          <path d="M23,6 L25,6 L24,1 Z" fill="#C9972E" />
          <defs>
            <linearGradient id="roof-accent" x1="4" y1="10" x2="44" y2="10" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D4621A" />
              <stop offset="0.5" stopColor="#E69138" />
              <stop offset="1" stopColor="#C9972E" />
            </linearGradient>
          </defs>
        </svg>
        <span className="grow h-[2px] bg-gradient-to-l from-transparent via-riksa-orange/60 to-riksa-gold rounded-full" />
      </div>

      {title && (
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-riksa-green tracking-tight leading-tight">
          {title}
        </h2>
      )}
    </div>
  );
}
