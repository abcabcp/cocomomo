'use client';

import { fromMinutes, toMinutes } from '@/shared/lib/time';
import { useCurrentTimeStore } from '@/shared/store';
import { useEffect } from 'react';
import { SeaCanvas } from './SeaCanvas';
import { TimeScrub } from './TimeScrub';
import type { PresetName } from './presets';

const MINUTES_PER_WHEEL_UNIT = 0.08;

export default function SeaLab({ preview }: { preview?: PresetName }) {
  useEffect(() => {
    let carry = 0;
    const onWheel = (e: WheelEvent) => {
      carry += e.deltaY * MINUTES_PER_WHEEL_UNIT;
      const step = Math.trunc(carry);
      if (!step) return;
      carry -= step;
      const { currentTime, setCurrentTime } = useCurrentTimeStore.getState();
      setCurrentTime(
        fromMinutes((toMinutes(currentTime) + step + 1440) % 1440),
      );
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <>
      <SeaCanvas preview={preview} />
      <TimeScrub className="fixed inset-x-6 bottom-6 z-10 text-white/80 mix-blend-difference md:inset-x-10 md:bottom-10" />
    </>
  );
}
