'use client';

import { openModalAnimation } from '@/shared';
import { Loading } from '@/shared';
import dynamic from 'next/dynamic';
import { useTransitionRouter } from 'next-view-transitions';
import { Suspense } from 'react';

const MainCanvas = dynamic(
  () => import('@/features/cocomomo/ui/MainCanvas'),
  {
    loading: () => <Loading />,
    ssr: false
  }
);

function BloomStudioDesktopIcon() {
  const router = useTransitionRouter();

  return (
    <button
      type="button"
      onClick={() => {
        router.push('/bloom-studio', {
          onTransitionReady: openModalAnimation,
          scroll: false,
        });
      }}
      className="group absolute left-5 top-10 z-20 flex w-20 flex-col items-center gap-2 rounded-3xl px-2 py-3 text-white/95 transition-all hover:bg-white/10 active:scale-[0.98] md:left-8 md:top-16 md:w-24"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(180deg,#fff7d6_0%,#ffe7a3_44%,#ffb35c_100%)] shadow-[0_14px_30px_rgba(0,0,0,0.18)] ring-1 ring-white/40 transition-transform group-hover:scale-105 md:h-16 md:w-16">
        <span className="text-[28px] md:text-[32px]">🌷</span>
      </span>
      <span className="rounded-full bg-black/20 px-2 py-1 text-center text-[11px] font-medium leading-tight backdrop-blur-sm md:bg-transparent md:px-0 md:py-0 md:text-xs">
        Bloom Studio
      </span>
    </button>
  );
}

export default function Home() {
  return (
    <main className="relative w-full h-full">
      <Suspense fallback={<Loading />}>
        <MainCanvas />
      </Suspense>
      <BloomStudioDesktopIcon />
    </main>
  );
}