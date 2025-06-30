import { create } from 'zustand';
import { getCurrentTime } from '@/shared';

// 시간 타입 정의
interface TimeData {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

interface CurrentTimeStore {
  // 현재 표시할 시간
  currentTime: TimeData;
  // 사용자가 시간을 변경했는지 여부
  isCustomTime: boolean;
  // 로컬 시간과의 차이 (밀리초 단위)
  timeDifferenceMs: number;
  // 마지막 업데이트 시간 (성능 최적화용)
  lastUpdateTime: number;

  // 시간 설정 함수
  setCurrentTime: (time: TimeData) => void;
  // 사용자가 시간을 직접 설정
  setCustomTime: (time: TimeData) => void;
  // 로컬 시간 기준으로 시간 업데이트 (매 초 호출)
  updateTimeByDifference: () => void;
  // 로컬 시간으로 리셋
  resetToLocalTime: () => void;
}

// 현재 로컬 시간 가져오기 (내부 유틸리티)
const getLocalTime = (): TimeData => {
  return getCurrentTime();
};

// 두 시간 간의 차이 계산 (밀리초)
const calculateTimeDifference = (
  userTime: TimeData,
  localTime: TimeData,
): number => {
  const getUserTimeMs = () => {
    const now = new Date();
    const userHour =
      userTime.period === 'PM' && userTime.hour < 12
        ? userTime.hour + 12
        : userTime.period === 'AM' && userTime.hour === 12
          ? 0
          : userTime.hour;

    const userDate = new Date();
    userDate.setHours(userHour, userTime.minute, 0, 0);
    return userDate.getTime();
  };

  const getLocalTimeMs = () => {
    const now = new Date();
    const localHour =
      localTime.period === 'PM' && localTime.hour < 12
        ? localTime.hour + 12
        : localTime.period === 'AM' && localTime.hour === 12
          ? 0
          : localTime.hour;

    const localDate = new Date();
    localDate.setHours(localHour, localTime.minute, 0, 0);
    return localDate.getTime();
  };

  return getUserTimeMs() - getLocalTimeMs();
};

// 시간 차이를 적용하여 현재 시간 계산
const applyTimeDifference = (differenceMs: number): TimeData => {
  const now = new Date();
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
  lastUpdateTime: Date.now(),

  setCurrentTime: (time: TimeData) => set({ currentTime: time }),

  setCustomTime: (time: TimeData) => {
    const localTime = getLocalTime();
    const timeDiff = calculateTimeDifference(time, localTime);

    set({
      currentTime: time,
      isCustomTime: true,
      timeDifferenceMs: timeDiff,
      lastUpdateTime: Date.now(),
    });
  },

  updateTimeByDifference: () => {
    const { isCustomTime, timeDifferenceMs, lastUpdateTime } = get();

    // 커스텀 시간이 아니면 로컬 시간 사용
    if (!isCustomTime) {
      set({ currentTime: getLocalTime() });
      return;
    }

    // 마지막 업데이트 후 100ms 이내면 스킵 (성능 최적화)
    if (Date.now() - lastUpdateTime < 100) {
      return;
    }

    // 시간 차이 적용하여 현재 시간 계산
    const updatedTime = applyTimeDifference(timeDifferenceMs);
    set({
      currentTime: updatedTime,
      lastUpdateTime: Date.now(),
    });
  },

  resetToLocalTime: () =>
    set({
      currentTime: getLocalTime(),
      isCustomTime: false,
      timeDifferenceMs: 0,
    }),
}));
