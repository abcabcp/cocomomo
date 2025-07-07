import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useCurrentTimeStore } from '@/shared/store';
import { PresetName } from '../types/sea';
import { ANIMATION_DURATION, SEA_TIME_PRESETS } from '../model/sea';
import { useFrame, useThree } from '@react-three/fiber';
import { ShaderMaterial, Vector2, Vector3 } from 'three';
import gsap from 'gsap';

export function useSea() {
  const materialRef = useRef<ShaderMaterial>(null);
  const { gl, size } = useThree();
  const { currentTime } = useCurrentTimeStore();
  const [activePreset, setActivePreset] = useState<PresetName>('morning');
  const [animating, setAnimating] = useState(false);
  const isFirstRenderRef = useRef(true);

  const uniforms = useMemo(
    () => ({
      iGlobalTime: { value: 0 },
      iResolution: { value: new Vector2() },
      uSkyColor: { value: new Vector3(0.4, 0.6, 0.8) },
      uSkyTopColor: { value: new Vector3(0.2, 0.5, 0.9) },
      uSeaBaseColor: { value: new Vector3(0.05, 0.15, 0.3) },
      uSeaWaterColor: { value: new Vector3(0.2, 0.5, 0.7) },
      uSunPosition: { value: new Vector3(0.2, 0.6, 0.8) },
      uMoonPosition: { value: new Vector3(0.0, -1.0, 0.0) },
      uMoonBrightness: { value: 0.0 },
      uStarBrightness: { value: 0.0 },
      uWaveSpeed: { value: 0.8 },
      uWaveHeight: { value: 0.5 },
      uWaveChoppy: { value: 1.0 },
    }),
    [],
  );

  const animateToPreset = useCallback((presetName: PresetName) => {
    if (!materialRef.current) return;

    setAnimating(true);
    const targetPreset = SEA_TIME_PRESETS[presetName];
    const uniforms = materialRef.current.uniforms;

    const timeline = gsap.timeline({
      onComplete: () => setAnimating(false),
    });

    const animateVector3Value = (uniformName: string, targetValue: Vector3) => {
      timeline.to(
        uniforms[uniformName].value,
        {
          x: targetValue.x,
          y: targetValue.y,
          z: targetValue.z,
          duration: ANIMATION_DURATION,
          ease: 'power2.inOut',
        },
        0,
      );
    };

    const animateScalarValue = (uniformName: string, targetValue: number) => {
      timeline.to(
        uniforms[uniformName],
        {
          value: targetValue,
          duration: ANIMATION_DURATION,
          ease: 'power2.inOut',
        },
        0,
      );
    };

    animateVector3Value('uSkyColor', targetPreset.skyColor);
    animateVector3Value('uSkyTopColor', targetPreset.skyTopColor);
    animateVector3Value('uSeaBaseColor', targetPreset.seaBaseColor);
    animateVector3Value('uSeaWaterColor', targetPreset.seaWaterColor);
    animateVector3Value('uSunPosition', targetPreset.sunPosition);
    animateVector3Value('uMoonPosition', targetPreset.moonPosition);
    animateScalarValue('uMoonBrightness', targetPreset.moonBrightness);
    animateScalarValue('uStarBrightness', targetPreset.starBrightness);
    animateScalarValue('uWaveSpeed', targetPreset.waveSpeed);
    animateScalarValue('uWaveHeight', targetPreset.waveHeight);
    animateScalarValue('uWaveChoppy', targetPreset.waveChoppy);

    return timeline;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (materialRef.current) {
        const pixelRatio = gl.getPixelRatio();
        const pixelWidth = size.width * pixelRatio;
        const pixelHeight = size.height * pixelRatio;

        materialRef.current.uniforms.iResolution.value.set(
          pixelWidth,
          pixelHeight,
        );
      }
    };

    handleResize();
  }, [gl, size]);

  useEffect(() => {
    if (!currentTime) return;

    let hour24 = currentTime.hour;
    if (currentTime.period === 'PM' && hour24 !== 12) hour24 += 12;
    if (currentTime.period === 'AM' && hour24 === 12) hour24 = 0;

    const totalMinutes = hour24 * 60 + currentTime.minute;
    let newPreset: PresetName = 'morning';

    if (totalMinutes >= 180 && totalMinutes < 300) {
      newPreset = 'dawn';
    } else if (totalMinutes >= 300 && totalMinutes < 420) {
      newPreset = 'sunrise';
    } else if (totalMinutes >= 420 && totalMinutes < 720) {
      newPreset = 'morning';
    } else if (totalMinutes >= 720 && totalMinutes < 1020) {
      newPreset = 'afternoon';
    } else if (totalMinutes >= 1020 && totalMinutes < 1140) {
      newPreset = 'sunset';
    } else {
      newPreset = 'night';
    }

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      setActivePreset(newPreset);
      animateToPreset(newPreset);
    } else if (!animating && newPreset !== activePreset) {
      setActivePreset(newPreset);
      animateToPreset(newPreset);
    }
  }, [currentTime, activePreset, animating, animateToPreset]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iGlobalTime.value = clock.getElapsedTime();
    }
  });

  return {
    materialRef,
    uniforms,
    animateToPreset,
    animating,
    activePreset,
  };
}
