export default function SectionDivider({ color = 'text-riksa-green' }: { color?: string }) {
  return (
    <div className={`w-full flex justify-center items-center py-6 sm:py-8 ${color}`}>
      <div className="flex items-center gap-3 opacity-75">
        <span className="h-px w-12 sm:w-20 bg-current opacity-30" />
        <svg width="42" height="18" viewBox="0 0 42 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 sm:w-10 h-auto">
          {/* Traditional Sundanese Central Lotus/Roof Motif */}
          <path d="M21 2 L26 9 L21 16 L16 9 Z" fill="currentColor" opacity="0.85" />
          <circle cx="9" cy="9" r="2.5" fill="#C9972E" />
          <circle cx="33" cy="9" r="2.5" fill="#C9972E" />
          <path d="M2 9 C5 7 12 7 16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M40 9 C37 7 30 7 26 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="h-px w-12 sm:w-20 bg-current opacity-30" />
      </div>
    </div>
  );
}
