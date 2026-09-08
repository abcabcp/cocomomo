import { toMinutes } from '@/shared/lib/time';
import { useCurrentTimeStore } from '@/shared/store';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import { type ShaderMaterial, Vector2, Vector3 } from 'three';
import {
  ANIMATION_DURATION,
  type PresetName,
  SEA_TIME_PRESETS,
  presetForMinutes,
} from './presets';

const uniformName = (key: string) => `u${key[0].toUpperCase()}${key.slice(1)}`;

export function useSea(preview?: PresetName) {
  const materialRef = useRef<ShaderMaterial>(null);
  const { gl, size } = useThree();
  const currentTime = useCurrentTimeStore((s) => s.currentTime);
  const preset = preview ?? presetForMinutes(toMinutes(currentTime));

  const uniforms = useMemo(
    () => ({
      iGlobalTime: { value: 0 },
      iResolution: { value: new Vector2() },
      uSkyColor: { value: new Vector3(0.4, 0.6, 0.8) },
      uSkyTopColor: { value: new Vector3(0.2, 0.5, 0.9) },
      uSeaBaseColor: { value: new Vector3(0.05, 0.15, 0.3) },
      uSeaWaterColor: { value: new Vector3(0.2, 0.5, 0.7) },
      uSunPosition: { value: new Vector3(0.2, 0.6, 0.8) },
      uMoonPosition: { value: new Vector3(0, -1, 0) },
      uMoonBrightness: { value: 0 },
      uStarBrightness: { value: 0 },
      uWaveSpeed: { value: 0.8 },
      uWaveHeight: { value: 0.5 },
      uWaveChoppy: { value: 1 },
    }),
    [],
  );

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    uniforms.iResolution.value.set(size.width * dpr, size.height * dpr);
  }, [gl, size, uniforms]);

  useEffect(() => {
    const target = SEA_TIME_PRESETS[preset];
    const tl = gsap.timeline({
      defaults: { duration: ANIMATION_DURATION, ease: 'power2.inOut' },
    });
    for (const [key, value] of Object.entries(target)) {
      const u = uniforms[uniformName(key) as keyof typeof uniforms] as {
        value: Vector3 | number;
      };
      if (value instanceof Vector3) {
        tl.to(u.value as Vector3, { x: value.x, y: value.y, z: value.z }, 0);
      } else {
        tl.to(u, { value }, 0);
      }
    }
    return () => {
      tl.kill();
    };
  }, [preset, uniforms]);

  useFrame(({ clock }) => {
    uniforms.iGlobalTime.value = clock.getElapsedTime();
  });

  return { materialRef, uniforms };
}
