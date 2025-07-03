'use client';

import { parseTimeString } from '@/shared';
import { useCallback, useState, useEffect, useRef, useReducer } from 'react';
import { useCurrentTimeStore } from '@/shared/store';
import { getCurrentTime } from '@/shared/lib/utils/time';

export function useTimeControl() {
  const {
    currentTime,
    setCustomTime,
    updateTimeByDifference,
    resetToLocalTime,
  } = useCurrentTimeStore();

  const [selectedTime, setSelectedTime] = useState(currentTime);
  const [isReset, setIsReset] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isOpen]);

  const closePanel = useCallback(() => {
    if (
      selectedTime.hour !== currentTime.hour ||
      selectedTime.minute !== currentTime.minute ||
      selectedTime.period !== currentTime.period
    ) {
      setCustomTime(selectedTime);
    }
    setIsOpen(false);
  }, [selectedTime, currentTime, setCustomTime]);

  const handleTimeChange = useCallback((value: string) => {
    const parsedTime = parseTimeString(value);
    setSelectedTime(parsedTime);
  }, []);

  const setUserDefinedTime = useCallback(
    (newTime: ReturnType<typeof parseTimeString>) => {
      setCustomTime(newTime);
    },
    [setCustomTime],
  );

  const resetTime = useCallback(() => {
    setIsReset(true);
    resetToLocalTime();
    setSelectedTime(getCurrentTime());
    setTimeout(() => {
      setIsReset(false);
    }, 1000);
  }, [resetToLocalTime]);

  useEffect(() => {
    if (isOpen) {
      setSelectedTime(currentTime);
    }
  }, [isOpen]);

  return {
    isOpen,
    toggleOpen,
    currentTime,
    selectedTime,
    isReset,
    handleTimeChange,
    setUserDefinedTime,
    setIsOpen,
    closePanel,
    resetTime,
    updateTimeByDifference,
  };
}
