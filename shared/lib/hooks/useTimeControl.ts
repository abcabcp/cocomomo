'use client';

import { parseTimeString } from '@/shared';
import { useCallback, useState, useEffect } from 'react';
import { useCurrentTimeStore } from '@/shared/store';

export function useTimeControl() {
  const {
    currentTime,
    setCustomTime,
    updateTimeByDifference,
    resetToLocalTime,
  } = useCurrentTimeStore();

  const [selectedTime, setSelectedTime] = useState(currentTime);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedTime(currentTime);
    }
  }, [isOpen]);

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

  return {
    currentTime,
    selectedTime,
    handleTimeChange,
    setUserDefinedTime,
    isOpen,
    setIsOpen,
    handleClose,
    resetToLocalTime,
    updateTimeByDifference,
  };
}
