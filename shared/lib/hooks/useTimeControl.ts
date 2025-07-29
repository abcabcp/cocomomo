'use client';

import { parseTimeString } from '@/shared';
import { useCallback, useState, useEffect } from 'react';
import { useCurrentTimeStore } from '@/shared/store';
import { getCurrentTime } from '@/shared/lib/utils/time';

export function useTimeControl() {
  const { currentTime, setCustomTime } = useCurrentTimeStore();

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

  const handleSelectedTimeChange = useCallback((value: string) => {
    try {
      const parsedTime = parseTimeString(value);
      setSelectedTime(parsedTime);
    } catch (error) {
      console.error('Invalid time format:', error);
    }
  }, []);

  const handleApplyTimeImmediately = useCallback(
    (time: ReturnType<typeof parseTimeString>) => {
      setCustomTime(time);
      setSelectedTime(time);
    },
    [setCustomTime],
  );

  const resetTime = useCallback(() => {
    setIsReset(true);
    setCustomTime(getCurrentTime());
    setSelectedTime(getCurrentTime());
    setTimeout(() => setIsReset(false), 1000);
  }, [setCustomTime]);

  useEffect(() => {
    if (isOpen) {
      setSelectedTime(currentTime);
    }
  }, [isOpen, currentTime]);

  useEffect(() => {
    setCustomTime(getCurrentTime());
  }, []);

  return {
    isOpen,
    toggleOpen,
    currentTime,
    selectedTime,
    isReset,
    handleSelectedTimeChange,
    handleApplyTimeImmediately,
    resetTime,
    closePanel,
  };
}
