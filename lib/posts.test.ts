import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { readPosts } from './posts.ts';

const make = (files: Record<string, string>) => {
  const root = mkdtempSync(join(tmpdir(), 'posts-'));
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(join(root, rel, '..'), { recursive: true });
    writeFileSync(join(root, rel), body);
  }
  return root;
};

test('reads, parses and sorts posts', () => {
  const root = make({
    'a/2026-01-01-old.md': '# 옛 글\n\n첫 문단.\n\n둘째 문단.',
    'b/2026-09-14-new.md': `# 새 글\n\n요약이 될 문단.\n\n## 섹션\n\n본문 ${'가'.repeat(1200)}`,
  });
  const posts = readPosts(root);
  assert.equal(posts.length, 2);
  const [first, second] = posts;
  assert.equal(first.slug, 'new');
  assert.equal(first.category, 'b');
  assert.equal(first.date, '2026-09-14');
  assert.equal(first.title, '새 글');
  assert.equal(first.summary, '요약이 될 문단.');
  assert.ok(!first.body.startsWith('# '));
  assert.equal(first.minutes, 2);
  assert.equal(second.slug, 'old');
  assert.equal(second.minutes, 1);
});

test('rejects bad filenames', () => {
  const root = make({ 'c/bad.md': '# x' });
  assert.throws(() => readPosts(root), /YYYY-MM-DD/);
});
