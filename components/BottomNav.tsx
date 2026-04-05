'use client';

import { Home, Dices, Sparkles, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: '主页', icon: Home, href: '/' },
    { name: '游戏', icon: Dices, href: '/shop' },
    { name: '商店', icon: Sparkles, href: '#' },
    { name: '系统', icon: Settings, href: '#' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-24 bg-stone-950/90 backdrop-blur-2xl border-t-2 border-yellow-700/20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-all duration-100 ${
              isActive
                ? 'bg-red-700/20 text-yellow-500 shadow-[inset_0_0_10px_rgba(241,196,15,0.3)] rounded-lg px-6 py-2 active:scale-90'
                : 'text-stone-600 grayscale opacity-70 hover:bg-red-900/10 hover:text-red-400'
            }`}
          >
            <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
            <span className="font-[family-name:var(--font-label)] text-[10px] tracking-widest mt-1 uppercase">
              {item.name}
            </span>
          </Link>
        );
      })}
    </footer>
  );
}
