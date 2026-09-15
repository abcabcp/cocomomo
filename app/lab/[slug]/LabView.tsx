'use client';

import { findLab } from '@/labs/registry';
import { useLockScroll } from '@/shared/lib/useLockScroll';
import { Link } from 'next-view-transitions';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export function LabView({ slug }: { slug: string }) {
  useLockScroll();
  const lab = findLab(slug);
  const Lab = useMemo(
    () =>
      lab &&
      dynamic(lab.load, {
        ssr: false,
        loading: () => (
          <p className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.3em] text-white/50">
            {lab.index} loading
          </p>
        ),
      }),
    [lab],
  );

  if (!lab || !Lab) return null;

  return (
    <div className="relative h-dvh w-dvw bg-[#0a0a0a]">
      <Lab />
      <nav className="pointer-events-none fixed inset-x-6 top-6 z-30 flex items-baseline justify-between text-[11px] uppercase tracking-[0.2em] text-white mix-blend-difference md:inset-x-10 md:top-10">
        <Link
          href="/"
          className="pointer-events-auto transition-opacity hover:opacity-60"
        >
          ← cocomomo
        </Link>
        <span>
          <span className="font-mono">{lab.index}</span> · {lab.title}
        </span>
      </nav>
    </div>
  );
}
