'use client';

import { AdaptiveDpr } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Sea } from './Sea';
import type { PresetName } from './presets';

export function SeaCanvas({ preview }: { preview?: PresetName }) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        precision: 'mediump',
      }}
      performance={{ min: 0.6 }}
    >
      <AdaptiveDpr pixelated />
      <Sea preview={preview} />
    </Canvas>
  );
}
