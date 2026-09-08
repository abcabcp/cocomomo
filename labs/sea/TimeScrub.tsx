'use client';

import { fromMinutes, pad, toMinutes } from '@/shared/lib/time';
import { useCurrentTimeStore } from '@/shared/store';
import { presetForMinutes } from './presets';

export function TimeScrub({ className = '' }: { className?: string }) {
  const currentTime = useCurrentTimeStore((s) => s.currentTime);
  const setCurrentTime = useCurrentTimeStore((s) => s.setCurrentTime);
  const minutes = toMinutes(currentTime);

  return (
    <label
      className={`flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] ${className}`}
    >
      <span className="font-mono tabular-nums">
        {pad(Math.floor(minutes / 60))}:{pad(minutes % 60)}
      </span>
      <input
        type="range"
        min={0}
        max={1439}
        value={minutes}
        onChange={(e) => setCurrentTime(fromMinutes(Number(e.target.value)))}
        aria-label="time of day"
        className="scrub flex-1"
      />
      <span className="w-20 text-right">{presetForMinutes(minutes)}</span>
    </label>
  );
}
