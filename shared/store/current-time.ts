import { create } from 'zustand';
import { type TimeOfDay, fromMinutes, nowMinutes } from '../lib/time';

type CurrentTimeStore = {
  currentTime: TimeOfDay;
  setCurrentTime: (time: TimeOfDay) => void;
};

export const useCurrentTimeStore = create<CurrentTimeStore>((set) => ({
  currentTime: fromMinutes(typeof window === 'undefined' ? 720 : nowMinutes()),
  setCurrentTime: (currentTime) => set({ currentTime }),
}));
