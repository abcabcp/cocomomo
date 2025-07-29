'use client';

import { create } from 'zustand';

interface TimeData {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

interface CurrentTimeStore {
  currentTime: TimeData;
  setCurrentTime: (time: TimeData) => void;
  setCustomTime: (time: TimeData) => void;
}

export const useCurrentTimeStore = create<CurrentTimeStore>((set, get) => ({
  currentTime: {
    hour: 0,
    minute: 0,
    period: 'AM',
  },

  setCurrentTime: (time: TimeData) => set({ currentTime: time }),
  setCustomTime: (time: TimeData) => {
    set({
      currentTime: time,
    });
  },
}));
