export const RIKSA_LOGO_URL = 'https://lh3.googleusercontent.com/d/1pvJ68cf5YwFYcmn5vlVq-qNe5mpopoBq';

type LogoFrameProps = {
  className?: string;
  imageClassName?: string;
  variant?: 'nav' | 'hero' | 'footer';
};

const variantClass = {
  nav: 'h-14 w-[150px] rounded-[1.15rem] border-2 p-1.5 shadow-md',
  hero: 'h-32 w-[330px] rounded-[2rem] border-[3px] p-3 shadow-2xl md:h-40 md:w-[430px]',
  footer: 'h-20 w-[210px] rounded-[1.35rem] border-2 p-2 shadow-xl',
};

export default function LogoFrame({ className = '', imageClassName = '', variant = 'nav' }: LogoFrameProps) {
  return (
    <div
      className={[
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden border-riksa-gold bg-white',
        'ring-1 ring-white/70 before:absolute before:inset-1 before:rounded-[inherit] before:border before:border-riksa-gold/30',
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
