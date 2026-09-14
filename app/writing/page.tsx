import { readPosts } from '@/lib/posts';
import { WritingList } from './WritingList';

export const metadata = { title: 'writing — cocomomo' };

export default function Page() {
  const posts = readPosts().map(({ body: _body, ...rest }) => rest);
  const categories = [...new Set(posts.map((p) => p.category))];
  return <WritingList posts={posts} categories={categories} />;
}
