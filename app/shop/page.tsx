import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function Shop() {
  return (
    <>
      <Header balanceLabel="财富余额" balanceValue="8,888.00" />
      
      <main className="relative min-h-screen pt-20 pb-24 overflow-y-auto bg-[radial-gradient(circle_at_center,_#20201f_0%,_#131313_100%)] flex flex-col items-center justify-center">
        <div className="text-stone-500 font-[family-name:var(--font-label)] tracking-widest text-sm uppercase">
          {/* 空白区域，等待添加新功能 */}
          准备就绪
        </div>
      </main>

      <BottomNav />
    </>
  );
}
