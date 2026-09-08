'use client';

import { useThree } from '@react-three/fiber';
import type { PresetName } from './presets';
import fragmentShader from './seaFragment.glsl';
import vertexShader from './seaVertex.glsl';
import { useSea } from './useSea';

export function Sea({ preview }: { preview?: PresetName }) {
  const { materialRef, uniforms } = useSea(preview);
  const { viewport } = useThree();

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
}
