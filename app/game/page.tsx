'use client';

import { useState } from 'react';
import { Settings, Home, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const PachinkoGame = dynamic(() => import('@/components/PachinkoGame'), {
  ssr: false,
});

export default function GamePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-stone-950">
      <PachinkoGame />

      {/* Settings Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="absolute top-4 left-4 z-50 p-2 bg-stone-900/80 border border-yellow-600/50 rounded-full text-yellow-500 hover:bg-stone-800 hover:border-yellow-400 transition-all shadow-[0_0_10px_rgba(202,138,4,0.2)]"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Menu Modal */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-stone-900 border-2 border-yellow-600/50 rounded-2xl p-6 w-80 shadow-[0_0_30px_rgba(202,138,4,0.2)] flex flex-col items-center">
            <h2 className="text-2xl font-black text-yellow-500 mb-6 tracking-widest">系统菜单</h2>
            
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded-xl text-white font-bold transition-all mb-4"
            >
              <Home className="w-5 h-5" />
              返回主界面
            </Link>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-red-900/50 hover:bg-red-800/50 border border-red-700/50 rounded-xl text-red-200 font-bold transition-all"
            >
              <X className="w-5 h-5" />
              关闭菜单
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
