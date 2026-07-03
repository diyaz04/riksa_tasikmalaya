export const RIKSA_LOGO_URL = 'https://lh3.googleusercontent.com/d/1pvJ68cf5YwFYcmn5vlVq-qNe5mpopoBq';

type LogoFrameProps = {
  className?: string;
  imageClassName?: string;
  variant?: 'nav' | 'hero' | 'footer';
};

const variantClass = {
  nav: 'h-14 w-[150px] rounded-2xl border p-1.5 shadow-[0_12px_32px_rgba(61,32,19,0.14)]',
  hero: 'h-32 w-[330px] rounded-[2rem] border-[3px] p-3 shadow-2xl md:h-40 md:w-[430px]',
  footer: 'h-20 w-[210px] rounded-[1.35rem] border-2 p-2 shadow-xl',
};

export default function LogoFrame({ className = '', imageClassName = '', variant = 'nav' }: LogoFrameProps) {
  return (
    <div
      className={[
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden border-white/70 bg-white/88 backdrop-blur-md',
        'ring-1 ring-riksa-gold/45 before:absolute before:inset-x-3 before:top-1 before:h-px before:bg-white/90 after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_rgba(201,161,92,0.22)]',
        variantClass[variant],
        className,
      ].join(' ')}
    >
      <img
        src={RIKSA_LOGO_URL}
        alt="Logo RIKSA"
        className={['relative z-10 h-full w-full object-contain', imageClassName].join(' ')}
      />
    </div>
  );
}
