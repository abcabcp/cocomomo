import { render } from '@/lib/markdown';
import { readPosts } from '@/lib/posts';
import { Link } from 'next-view-transitions';
import { notFound } from 'next/navigation';
import { Toc } from './Toc';

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () =>
  readPosts().map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = readPosts().find((p) => p.slug === slug);
  return post
    ? { title: `${post.title} — cocomomo`, description: post.summary }
    : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const posts = readPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const post = posts[index];
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const { html, headings } = await render(post.body);

  return (
    <main className="min-h-dvh px-6 pt-28 pb-32 md:px-10 md:pt-40">
      <nav className="fixed inset-x-6 top-6 z-30 flex items-baseline justify-between text-[11px] uppercase tracking-[0.2em] md:inset-x-10 md:top-10">
        <Link href="/writing" className="transition-opacity hover:opacity-60">
          ← writing
        </Link>
        <span>
          {post.category} ·{' '}
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

      <Toc headings={headings} />

      <article className="mx-auto max-w-[65ch]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
          <span className="font-mono">{post.date.replaceAll('-', '.')}</span> ·{' '}
          {post.category} · <span className="font-mono">{post.minutes}</span>{' '}
          min
        </p>
        <h1
          className="mt-6 text-3xl font-semibold leading-[1.15] tracking-[-0.02em] md:text-4xl"
          style={{ viewTransitionName: `post-${post.slug}` }}
        >
          {post.title}
        </h1>
        <div
          className="post mt-16"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <footer className="mt-24 grid gap-8 border-t border-black/10 pt-8 text-sm md:grid-cols-2">
          {older ? (
            <Link href={`/writing/${older.slug}`} className="group">
              <span className="block text-[11px] uppercase tracking-[0.2em] text-black/40">
                older
              </span>
              <span className="mt-2 block font-semibold tracking-[-0.01em] transition-opacity group-hover:opacity-60">
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link
              href={`/writing/${newer.slug}`}
              className="group md:text-right"
            >
              <span className="block text-[11px] uppercase tracking-[0.2em] text-black/40">
                newer
              </span>
              <span className="mt-2 block font-semibold tracking-[-0.01em] transition-opacity group-hover:opacity-60">
                {newer.title}
              </span>
            </Link>
          )}
        </footer>
      </article>
    </main>
  );
}
