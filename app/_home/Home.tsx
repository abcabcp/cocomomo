'use client';

import { type Lab, labs } from '@/labs/registry';
import { Link } from 'next-view-transitions';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const SeaLab = dynamic(() => import('@/labs/sea'), { ssr: false });

export function Home() {
  const [hovered, setHovered] = useState<Lab | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) return;
    const leave = () => setFocused(false);
    window.addEventListener('keydown', leave);
    window.addEventListener('pointerdown', leave);
    return () => {
      window.removeEventListener('keydown', leave);
      window.removeEventListener('pointerdown', leave);
    };
  }, [focused]);

  return (
    <main className="h-dvh w-dvw overflow-hidden">
      <SeaLab preview={hovered?.mood} />

      <div
        className={`pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-6 text-white mix-blend-difference transition-opacity duration-700 md:p-10 ${focused ? 'opacity-0 [&_*]:pointer-events-none' : 'opacity-100'}`}
      >
        <header className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.2em]">
          <h1>cocomomo</h1>
          <span>
            interactive lab · {labs.length} works ·{' '}
            <Link
              href="/writing"
              className="pointer-events-auto transition-opacity hover:opacity-60"
            >
              writing
            </Link>{' '}
            ·{' '}
            <a
              href="https://github.com/abcabcp"
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto transition-opacity hover:opacity-60"
            >
              github
            </a>
          </span>
        </header>

        <ol className="mb-16 flex flex-col items-end gap-6 md:mb-24 md:gap-8">
          {labs.map((lab) => {
            const active = hovered?.slug === lab.slug;
            const cls = 'pointer-events-auto block text-right';
            const inner = (
              <>
                <span className="font-mono text-[11px] tracking-[0.3em] opacity-60">
                  {lab.index}
                </span>
                <span
                  className={`block text-[clamp(2.5rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] transition-transform duration-500 ease-out ${active ? '-translate-x-3' : ''}`}
                >
                  {lab.title}
                </span>
                <span
                  className={`block h-4 text-[11px] uppercase tracking-[0.2em] transition-all duration-500 ${active ? 'translate-y-0 opacity-70' : 'translate-y-2 opacity-0'}`}
                >
                  {lab.tech.join(' · ')}
                </span>
              </>
            );
            return (
              <li
                key={lab.slug}
                onPointerEnter={() => setHovered(lab)}
                onPointerLeave={() => setHovered(null)}
              >
                {lab.slug === 'sea' ? (
                  <button
                    type="button"
                    className={cls}
                    onClick={() => {
                      setHovered(null);
                      setFocused(true);
                    }}
                  >
                    {inner}
                  </button>
                ) : (
                  <Link href={`/lab/${lab.slug}`} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
