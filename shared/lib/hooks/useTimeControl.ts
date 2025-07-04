'use client';

import { parseTimeString } from '@/shared';
import { useCallback, useState, useEffect } from 'react';
import { useCurrentTimeStore } from '@/shared/store';
import { getCurrentTime } from '@/shared/lib/utils/time';

export function useTimeControl() {
  const { currentTime, setCustomTime, resetToLocalTime } =
    useCurrentTimeStore();

  const [selectedTime, setSelectedTime] = useState(currentTime);
  const [isReset, setIsReset] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

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

  const handleTempTimeChange = useCallback((value: string) => {
    try {
      const parsedTime = parseTimeString(value);
      setSelectedTime(parsedTime);
    } catch (error) {
      console.error('Invalid time format:', error);
    }
  }, []);

  const applyTimeImmediately = useCallback(
    (time: ReturnType<typeof parseTimeString>) => {
      setCustomTime(time);
      setSelectedTime(time);
    },
    [setCustomTime],
  );

  const resetTime = useCallback(() => {
    setIsReset(true);
    resetToLocalTime();
    setSelectedTime(getCurrentTime());
    setTimeout(() => setIsReset(false), 1000);
  }, [resetToLocalTime]);

  useEffect(() => {
    if (isOpen) {
      setSelectedTime(currentTime);
    }
  }, [isOpen, currentTime]);

  return {
    isOpen,
    toggleOpen,
    currentTime,
    selectedTime,
    isReset,
    handleTempTimeChange,
    applyTimeImmediately,
    resetTime,
    closePanel,
  };
}
