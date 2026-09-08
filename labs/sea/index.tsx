'use client';

import { SeaCanvas } from './SeaCanvas';
import { TimeScrub } from './TimeScrub';
import type { PresetName } from './presets';

export default function SeaLab({ preview }: { preview?: PresetName }) {
  return (
    <>
      <SeaCanvas preview={preview} />
      <TimeScrub className="fixed inset-x-6 bottom-6 z-10 text-white/80 mix-blend-difference md:inset-x-10 md:bottom-10" />
    </>
  );
}
