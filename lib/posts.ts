import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export type Post = {
  slug: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  body: string;
  minutes: number;
};

const FILE = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;
const CHARS_PER_MINUTE = 500;

const parse = (
  md: string,
  meta: Pick<Post, 'slug' | 'category' | 'date'>,
): Post => {
  const lines = md.split('\n');
  const titleAt = lines.findIndex((l) => l.startsWith('# '));
  const title = titleAt >= 0 ? lines[titleAt].slice(2).trim() : meta.slug;
  const body = lines
    .filter((_, i) => i !== titleAt)
    .join('\n')
    .trim();
  const summary =
    body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .find((p) => p && !/^[#>!\[`|-]/.test(p))
      ?.replace(/\s+/g, ' ') ?? '';
  const minutes = Math.max(
    1,
    Math.round(body.replace(/\s/g, '').length / CHARS_PER_MINUTE),
  );
  return { ...meta, title, summary, body, minutes };
};

export function readPosts(root = join(process.cwd(), 'content/posts')): Post[] {
  const posts: Post[] = [];
  const categories = readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  for (const category of categories) {
    for (const file of readdirSync(join(root, category)).filter((f) =>
      f.endsWith('.md'),
    )) {
      const m = FILE.exec(file);
      if (!m)
        throw new Error(
          `${category}/${file}: 파일명은 YYYY-MM-DD-slug.md 형식이어야 합니다`,
        );
      posts.push(
        parse(readFileSync(join(root, category, file), 'utf8'), {
          category,
          date: m[1],
          slug: m[2],
        }),
      );
    }
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export const findPost = (slug: string, posts = readPosts()) =>
  posts.find((p) => p.slug === slug);
