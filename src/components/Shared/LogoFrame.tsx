export const RIKSA_LOGO_URL = 'https://lh3.googleusercontent.com/d/1pvJ68cf5YwFYcmn5vlVq-qNe5mpopoBq';

type LogoFrameProps = {
  className?: string;
  imageClassName?: string;
  variant?: 'nav' | 'hero' | 'footer';
};

const variantClass = {
  nav: 'h-12 w-[132px] rounded-2xl border p-1.5 shadow-[0_12px_32px_rgba(61,32,19,0.14)] sm:h-14 sm:w-[150px]',
  hero: 'h-24 w-[260px] rounded-[1.5rem] border-[3px] p-2.5 shadow-2xl sm:h-32 sm:w-[330px] md:h-40 md:w-[430px]',
  footer: 'h-16 w-[176px] rounded-[1.15rem] border-2 p-1.5 shadow-xl sm:h-20 sm:w-[210px] sm:rounded-[1.35rem] sm:p-2',
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
