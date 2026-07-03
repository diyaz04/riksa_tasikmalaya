export default function SectionDivider({ color = 'text-riksa-gold' }: { color?: string }) {
  return (
    <div className={`w-full flex justify-center px-4 py-8 sm:py-10 md:py-12 ${color}`}>
      <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-36 sm:w-44 md:w-[200px] opacity-80">
        <path d="M0 10 L10 0 L20 10 L30 0 L40 10 L50 0 L60 10 L70 0 L80 10 L90 0 L100 10 L110 0 L120 10 L130 0 L140 10 L150 0 L160 10 L170 0 L180 10 L190 0 L200 10" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter"/>
        <path d="M0 20 L10 10 L20 20 L30 10 L40 20 L50 10 L60 20 L70 10 L80 20 L90 10 L100 20 L110 10 L120 20 L130 10 L140 20 L150 10 L160 20 L170 10 L180 20 L190 10 L200 20" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter"/>
      </svg>
    </div>
  );
}
