import { create } from 'zustand';
import { getCurrentTime } from '@/shared';

interface CurrentTimeStore {
  currentTime: ReturnType<typeof getCurrentTime>;
  setCurrentTime: (time: ReturnType<typeof getCurrentTime>) => void;
}

export const useCurrentTimeStore = create<CurrentTimeStore>((set) => ({
  currentTime: getCurrentTime(),
  setCurrentTime: (time: ReturnType<typeof getCurrentTime>) =>
    set({ currentTime: time }),
}));
