'use client';

import type { Post } from '@/lib/posts';
import { Link } from 'next-view-transitions';
import { useState } from 'react';

type Item = Omit<Post, 'body'>;

export function WritingList({
  posts,
  categories,
}: { posts: Item[]; categories: string[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const visible = category
    ? posts.filter((p) => p.category === category)
    : posts;
  const filters = [null, ...categories];

  return (
    <main className="min-h-dvh px-6 pt-28 pb-24 md:px-10 md:pt-40">
      <nav className="fixed inset-x-6 top-6 z-30 flex items-baseline justify-between text-[11px] uppercase tracking-[0.2em] md:inset-x-10 md:top-10">
        <Link href="/" className="transition-opacity hover:opacity-60">
          ← cocomomo
        </Link>
        <span>
          writing ·{' '}
          <a
            href="https://github.com/abcabcp"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-60"
          >
            github
          </a>
        </span>
      </nav>

      <div className="mx-auto max-w-4xl">
        {categories.length > 1 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.2em]">
            {filters.map((f) => {
              const active = f === category;
              return (
                <li key={f ?? 'all'}>
                  <button
                    type="button"
                    onClick={() => setCategory(f)}
                    className={`transition-opacity hover:opacity-100 ${active ? 'underline underline-offset-4' : 'opacity-40'}`}
                  >
                    {f ?? 'all'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <ol className="mt-16 border-b border-black/10 md:mt-24">
          {visible.map((post, i) => {
            const year = post.date.slice(0, 4);
            const newYear = i === 0 || visible[i - 1].date.slice(0, 4) !== year;
            return (
              <li key={post.slug}>
                {newYear && (
                  <p
                    className={`font-mono text-[11px] tracking-[0.3em] text-black/30 ${i === 0 ? '' : 'mt-16'} mb-4`}
                  >
                    {year}
                  </p>
                )}
                <Link
                  href={`/writing/${post.slug}`}
                  className="group grid grid-cols-[4.5rem_1fr] items-baseline gap-4 border-t border-black/10 py-6 md:grid-cols-[6rem_1fr] md:gap-6 md:py-8"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-black/40">
                    {post.date.slice(5).replace('-', '.')}
                  </span>
                  <span className="min-w-0">
                    <span
                      className="block text-xl font-semibold leading-[1.2] tracking-[-0.01em] transition-transform duration-500 ease-out group-hover:-translate-x-2 md:text-2xl"
                      style={{ viewTransitionName: `post-${post.slug}` }}
                    >
                      {post.title}
                    </span>
                    <span className="mt-3 block truncate text-sm text-black/40 transition-colors duration-500 group-hover:text-black/70">
                      {post.summary}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
