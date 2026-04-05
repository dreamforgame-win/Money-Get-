import { Wallet, Coins } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  balanceLabel?: string;
  balanceValue?: string;
  showLinks?: boolean;
}

export default function Header({ balanceLabel, balanceValue, showLinks = false }: HeaderProps) {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-stone-950/80 backdrop-blur-xl border-b-2 border-yellow-600/30 shadow-[0_10px_30px_-10px_rgba(192,57,43,0.4)]">
      <div className="flex items-center gap-3">
        <Wallet className="text-red-700 dark:text-red-600 w-8 h-8" strokeWidth={2.5} />
        <span className="text-2xl font-black italic text-red-600 drop-shadow-[0_0_15px_rgba(192,57,43,0.5)] font-[family-name:var(--font-headline)] tracking-tighter uppercase">
          Golden Fortune
        </span>
      </div>
      <div className="flex items-center gap-6">
        {showLinks ? (
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-yellow-500 font-bold scale-105 font-[family-name:var(--font-label)] tracking-widest text-xs uppercase">
              Home
            </Link>
            <Link href="/shop" className="text-stone-500 font-medium hover:text-yellow-400 hover:brightness-125 transition-all font-[family-name:var(--font-label)] tracking-widest text-xs uppercase">
              Casino
            </Link>
            <Link href="#" className="text-stone-500 font-medium hover:text-yellow-400 hover:brightness-125 transition-all font-[family-name:var(--font-label)] tracking-widest text-xs uppercase">
              Rewards
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <span className="font-[family-name:var(--font-label)] text-xs tracking-widest text-stone-500 uppercase">
              {balanceLabel || '财富余额'}
            </span>
            <span className="font-[family-name:var(--font-headline)] font-bold text-[#efc20a]">
              {balanceValue || '8,888.00'}
            </span>
          </div>
        )}
        <button className="hover:text-yellow-400 hover:brightness-125 transition-all active:scale-95 duration-75 ease-out">
          <Coins className="text-red-700 dark:text-red-600 w-8 h-8" strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
}
