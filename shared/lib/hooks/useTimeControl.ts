'use client';

import { parseTimeString } from '@/shared';
import { useCallback, useState, useEffect, useRef } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);

    if (
      selectedTime.hour !== currentTime.hour ||
      selectedTime.minute !== currentTime.minute ||
      selectedTime.period !== currentTime.period
    ) {
      setCustomTime(selectedTime);
    }
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
    currentTime,
    selectedTime,
    isReset,
    handleTimeChange,
    setUserDefinedTime,
    setIsOpen,
    handleClose,
    resetTime,
    updateTimeByDifference,
  };
}
