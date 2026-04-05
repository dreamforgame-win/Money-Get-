import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="flex-1 mt-20 mb-24 relative overflow-hidden yunwen-bg flex flex-col h-full min-h-[calc(100vh-176px)] items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6">
          {/* 关卡标题 */}
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 tracking-widest drop-shadow-sm">
            第一关
          </h2>
          
          {/* 关卡入口框 (200x200) */}
          <Link 
            href="/game" 
            className="group relative block w-[200px] h-[200px] rounded-2xl overflow-hidden border-4 border-yellow-600/50 hover:border-yellow-400 transition-all duration-300 shadow-[0_0_30px_rgba(202,138,4,0.2)] hover:shadow-[0_0_40px_rgba(202,138,4,0.4)]"
          >
            {/* 金色滤镜遮罩 */}
            <div className="absolute inset-0 bg-yellow-600/30 mix-blend-color z-10 group-hover:bg-yellow-500/20 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-yellow-500/30 z-10" />
            
            {/* 金色马图片 (使用 picsum 占位图配合金色滤镜) */}
            <Image 
              src="https://picsum.photos/seed/horse/400/400" 
              alt="Golden Horse" 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 sepia-[.5] hue-rotate-[-30deg] saturate-[2]"
              referrerPolicy="no-referrer"
            />
            
            {/* 边框发光效果 */}
            <div className="absolute inset-0 border-2 border-yellow-300/0 group-hover:border-yellow-300/50 rounded-xl transition-colors duration-300 z-20" />
          </Link>

          {/* 开始游戏按钮 */}
          <Link 
            href="/game" 
            className="mt-2 px-10 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-stone-900 font-black text-lg rounded-full hover:from-yellow-500 hover:to-yellow-400 active:scale-95 transition-all shadow-lg shadow-yellow-600/20 border border-yellow-400/50"
          >
            开始游戏
          </Link>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
