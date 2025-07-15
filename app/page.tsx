'use client';

import { Loading } from '@/shared';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MainCanvas = dynamic(
  () => import('@/features/cocomomo/ui/MainCanvas'),
  {
    loading: () => <Loading />,
    ssr: false
  }
);

export default function Home() {
  return (
    <main className="relative w-full h-full">
      <Suspense fallback={<Loading />}>
        <MainCanvas />
      </Suspense>
    </main>
  );
}