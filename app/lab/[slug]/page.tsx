import { findLab, labs } from '@/labs/registry';
import { notFound } from 'next/navigation';
import { LabView } from './LabView';

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => labs.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props) {
  const lab = findLab((await params).slug);
  return { title: lab ? `${lab.title} — cocomomo` : 'cocomomo' };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!findLab(slug)) notFound();
  return <LabView slug={slug} />;
}
