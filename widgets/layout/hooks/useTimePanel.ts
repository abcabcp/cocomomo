'use client';

import {
  adjustTimeByOffset,
  calculateTimeOffset,
  getCurrentTime,
  parseTimeString,
} from '@/shared';
import { useCallback, useEffect, useState } from 'react';
import { useCurrentTimeStore } from '@/shared/store';

export function useTimePanel() {
  const { currentTime, setCurrentTime } = useCurrentTimeStore();

  const [timeOffset, setTimeOffset] = useState(0);
  const [selectedTime, setSelectedTime] = useState(currentTime);
  const [isOpen, setIsOpen] = useState(false);

  const updateCurrentTime = useCallback(() => {
    setCurrentTime(adjustTimeByOffset(timeOffset));
  }, [timeOffset]);

  const setUserDefinedTime = useCallback(
    (selectedTime: ReturnType<typeof parseTimeString>) => {
      const newOffset = calculateTimeOffset(selectedTime);
      setTimeOffset(newOffset);
      setCurrentTime(selectedTime);
    },
    [],
  );

  const handleClose = () => {
    setIsOpen(false);
    if (
      selectedTime.hour !== currentTime.hour ||
      selectedTime.minute !== currentTime.minute ||
      selectedTime.period !== currentTime.period
    ) {
      setUserDefinedTime(selectedTime);
    }
  };

  const handleTimeChange = (value: string) => {
    const parsedTime = parseTimeString(value);
    setSelectedTime(parsedTime);
  };

  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, [updateCurrentTime]);

  return {
    currentTime,
    selectedTime,
    handleTimeChange,
    setUserDefinedTime,
    isOpen,
    setIsOpen,
    handleClose,
  };
}
