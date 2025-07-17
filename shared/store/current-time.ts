'use client';

import { create } from 'zustand';
import { getCurrentTime } from '@/shared';

const isClientSide = () => typeof window !== 'undefined';
const safeDate = () => (isClientSide() ? new Date() : null);

interface TimeData {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

interface CurrentTimeStore {
  currentTime: TimeData;
  isCustomTime: boolean;
  timeDifferenceMs: number;
  lastUpdateTime: number;

  setCurrentTime: (time: TimeData) => void;
  setCustomTime: (time: TimeData) => void;
  updateTimeByDifference: () => void;
  resetToLocalTime: () => void;
}

const getLocalTime = (): TimeData => {
  return getCurrentTime();
};

const calculateTimeDifference = (
  userTime: TimeData,
  localTime: TimeData,
): number => {
  const getUserTimeMs = () => {
    const userHour =
      userTime.period === 'PM' && userTime.hour < 12
        ? userTime.hour + 12
        : userTime.period === 'AM' && userTime.hour === 12
          ? 0
          : userTime.hour;

    const userDate = safeDate();
    if (!userDate) return 0;
    userDate.setHours(userHour, userTime.minute, 0, 0);
    return userDate.getTime();
  };

  const getLocalTimeMs = () => {
    const localHour =
      localTime.period === 'PM' && localTime.hour < 12
        ? localTime.hour + 12
        : localTime.period === 'AM' && localTime.hour === 12
          ? 0
          : localTime.hour;

    const localDate = safeDate();
    if (!localDate) return 0;
    localDate.setHours(localHour, localTime.minute, 0, 0);
    return localDate.getTime();
  };

  return getUserTimeMs() - getLocalTimeMs();
};

const applyTimeDifference = (differenceMs: number): TimeData => {
  const now = safeDate();
  if (!now) return { hour: 12, minute: 0, period: 'AM' };
  const targetTime = new Date(now.getTime() + differenceMs);
  const hours = targetTime.getHours();
  const minutes = targetTime.getMinutes();

  return {
    hour: hours % 12 === 0 ? 12 : hours % 12,
    minute: minutes,
    period: hours >= 12 ? 'PM' : 'AM',
  };
};

export const useCurrentTimeStore = create<CurrentTimeStore>((set, get) => ({
  currentTime: getLocalTime(),
  isCustomTime: false,
  timeDifferenceMs: 0,
  lastUpdateTime: isClientSide() ? Date.now() : 0,

  setCurrentTime: (time: TimeData) => set({ currentTime: time }),

  setCustomTime: (time: TimeData) => {
    const localTime = getLocalTime();
    const timeDiff = calculateTimeDifference(time, localTime);

    set({
      currentTime: time,
      isCustomTime: true,
      timeDifferenceMs: timeDiff,
      lastUpdateTime: isClientSide() ? Date.now() : 0,
    });
  },

  updateTimeByDifference: () => {
    const { isCustomTime, timeDifferenceMs, lastUpdateTime } = get();

    if (!isCustomTime) {
      set({ currentTime: getLocalTime() });
      return;
    }

    if (isClientSide() && Date.now() - lastUpdateTime < 100) {
      return;
    }

    const updatedTime = applyTimeDifference(timeDifferenceMs);
    set({
      currentTime: updatedTime,
      lastUpdateTime: isClientSide() ? Date.now() : 0,
    });
  },

  resetToLocalTime: () =>
    set({
      currentTime: getLocalTime(),
      isCustomTime: false,
      timeDifferenceMs: 0,
    }),
}));
