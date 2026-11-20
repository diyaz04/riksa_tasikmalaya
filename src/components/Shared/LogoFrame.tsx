export const RIKSA_LOGO_URL = '/images/riksa-logo.png';

type LogoFrameProps = {
  className?: string;
  imageClassName?: string;
  variant?: 'nav' | 'hero' | 'footer';
};

export default function LogoFrame({ className = '', imageClassName = '', variant = 'nav' }: LogoFrameProps) {
  if (variant === 'nav') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <img
          src={RIKSA_LOGO_URL}
          alt="Logo RIKSA"
          className={`h-8 sm:h-9.5 w-auto object-contain ${imageClassName}`}
        />
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`inline-block ${className}`}>
        <img
          src={RIKSA_LOGO_URL}
          alt="Logo RIKSA"
          className={`h-11 sm:h-12 w-auto object-contain brightness-0 invert opacity-95 ${imageClassName}`}
        />
      </div>
    );
  }

  return (
    <div className={`inline-block ${className}`}>
      <img
        src={RIKSA_LOGO_URL}
        alt="Logo RIKSA"
        className={`h-16 sm:h-20 w-auto object-contain ${imageClassName}`}
      />
    </div>
  );
}
