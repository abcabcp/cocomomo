import type { ComponentType } from 'react';
import type { PresetName } from './sea/presets';

export type Lab = {
  slug: string;
  index: string;
  title: string;
  tech: string[];
  mood: PresetName;
  load: () => Promise<{ default: ComponentType }>;
};

export const labs: Lab[] = [
  {
    slug: 'sea',
    index: '01',
    title: 'Sea',
    tech: ['GLSL', 'time of day', 'raymarch'],
    mood: 'sunset',
    load: () => import('./sea'),
  },
  {
    slug: 'bloom-studio',
    index: '02',
    title: 'Bloom Studio',
    tech: ['R3F', 'editor', 'undo / redo'],
    mood: 'afternoon',
    load: () => import('./bloom-studio'),
  },
];

export const findLab = (slug: string) => labs.find((l) => l.slug === slug);
