import { LucideIcon } from 'lucide-react';

interface TalismanCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  colorTheme: 'secondary' | 'tertiary' | 'error';
  isActive?: boolean;
  extraDescription?: string;
  cornerIcon: LucideIcon;
}

export default function TalismanCard({
  title,
  subtitle,
  description,
  icon: Icon,
  colorTheme,
  isActive = false,
  extraDescription,
  cornerIcon: CornerIcon,
}: TalismanCardProps) {
  const themeStyles = {
    secondary: {
      border: 'border-[#61de8a]',
      text: 'text-[#61de8a]',
      bg: 'bg-[#61de8a]',
      glow: 'shadow-2xl',
      container: 'bg-[#353535]',
    },
    tertiary: {
      border: 'border-[#efc20a]',
      text: 'text-[#efc20a]',
      bg: 'bg-[#efc20a]',
      glow: 'shadow-[0_0_60px_rgba(239,194,10,0.4)]',
      container: 'bg-[#c0392b]',
    },
    error: {
      border: 'border-[#ffb4ab]',
      text: 'text-[#ffb4ab]',
      bg: 'bg-[#ffb4ab]',
      glow: 'shadow-2xl',
      container: 'bg-[#353535]',
    },
  };

  const theme = themeStyles[colorTheme];

  return (
    <div
      className={`group relative w-full md:w-${isActive ? '80' : '64'} h-[${isActive ? '480px' : '400px'}] ${
        theme.container
      } talisman-texture border-t-8 ${theme.border} ${theme.glow} ${
        isActive ? 'scale-105 z-20' : 'transition-all duration-500 hover:-translate-y-4'
      } cursor-pointer overflow-hidden`}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
      )}
      
      <div className={`absolute ${isActive ? 'top-4 left-4' : 'top-0 right-0 p-2 opacity-30'}`}>
        <CornerIcon className={`${isActive ? theme.text : 'text-[#e5e2e1]'} w-8 h-8`} />
      </div>

      <div className={`p-${isActive ? '8' : '6'} h-full flex flex-col items-center justify-between ${isActive ? 'text-[#ffe5e1]' : ''}`}>
        <div className={`w-full ${isActive ? 'text-center' : ''}`}>
          <span
            className={`font-[family-name:var(--font-label)] ${
              isActive ? 'text-xs tracking-[0.3em]' : 'text-[10px] tracking-widest'
            } ${theme.text} font-bold uppercase block mb-2`}
          >
            {subtitle}
          </span>
          <h3
            className={`font-[family-name:var(--font-headline)] ${
              isActive ? 'text-3xl font-black uppercase leading-none tracking-tighter' : 'text-xl font-bold leading-tight'
            }`}
          >
            {title}
          </h3>
        </div>

        <div className={`relative w-full ${isActive ? 'h-56' : 'h-40'} flex items-center justify-center`}>
          <div className={`absolute inset-0 ${theme.bg}/20 blur-3xl rounded-full ${isActive ? 'animate-pulse' : ''}`}></div>
          {isActive ? (
            <div className={`relative z-10 w-40 h-40 border-4 ${theme.border}/40 rounded-full flex items-center justify-center`}>
              <Icon className={`w-20 h-20 ${theme.text} drop-shadow-[0_0_15px_rgba(239,194,10,0.8)]`} />
            </div>
          ) : (
            <Icon className={`w-16 h-16 ${theme.text} z-10`} />
          )}
        </div>

        <div className={`w-full ${isActive ? 'text-center' : ''}`}>
          {extraDescription && (
            <p className="font-[family-name:var(--font-headline)] text-lg font-bold text-white mb-2 italic">
              {extraDescription}
            </p>
          )}
          <p className={`font-[family-name:var(--font-body)] text-sm ${isActive ? 'opacity-90' : 'text-[#e1bfb9] mb-4'}`}>
            {description}
          </p>
          {!isActive && <div className={`w-full h-[2px] ${theme.bg}/20`}></div>}
        </div>
      </div>

      {isActive && (
        <>
          <div className={`absolute -bottom-12 -left-12 w-32 h-32 ${theme.bg}/20 blur-[60px] rounded-full`}></div>
          <div className={`absolute -top-12 -right-12 w-32 h-32 ${theme.bg}/20 blur-[60px] rounded-full`}></div>
        </>
      )}
    </div>
  );
}
