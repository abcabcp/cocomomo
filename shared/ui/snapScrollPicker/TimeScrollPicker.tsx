'use client';

import { useCallback, useMemo } from 'react';
import { BaseScrollPickerProps } from '.';
import SnapScrollPicker from './SnapScrollPicker';
import { formatTimeString, parseTimeString } from '@/shared/lib';

type Period = 'AM' | 'PM';

export interface TimeScrollPickerProps extends BaseScrollPickerProps {
  // hh:mm
  value: string;
  // hh:mm 형식으로 리턴.
  onChange: (value: string) => void;
}

export default function TimeScrollPicker({
  value,
  onChange,
}: TimeScrollPickerProps) {
  const { hour, minute, period } = parseTimeString(value ?? '');

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const periods = useMemo(() => ['AM', 'PM'] as Period[], []);

  const handleHourChange = useCallback(
    (newHour: number | string) => {
      onChange(formatTimeString(newHour as number, minute, period));
    },
    [onChange, minute, period],
  );

  const handleMinuteChange = useCallback(
    (newMinute: number | string) => {
      onChange(formatTimeString(hour, newMinute as number, period));
    },
    [onChange, hour, period],
  );

  const handlePeriodChange = useCallback(
    (newPeriod: string | number) => {
      onChange(formatTimeString(hour, minute, newPeriod as Period));
    },
    [onChange, hour, minute],
  );

  return (
    <>
      <div className="relative w-full h-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]">
        <div className="w-full grid grid-cols-[22%_22%_22%_34%] gap-0 items-center relative">
          <div className="text-2xl rounded-l-lg">
            <p className="py-3 h-[60px]">&nbsp;</p>
            <p className="py-3 h-[60px]">&nbsp;</p>
            <p className="py-3 h-[60px] bg-grayscale-200 rounded-l-2xl">
              &nbsp;
            </p>
            <p className="py-3 h-[60px]">&nbsp;</p>
            <p className="py-3 h-[60px]">&nbsp;</p>
          </div>
          <div className="overflow-hidden">
            <SnapScrollPicker
              items={hours}
              selectedValue={hour}
              onSelect={handleHourChange}
            />
          </div>

          <div className="overflow-hidden">
            <SnapScrollPicker
              items={minutes}
              selectedValue={minute}
              onSelect={handleMinuteChange}
            />
          </div>

          <div className="overflow-hidden">
            <SnapScrollPicker
              items={periods}
              selectedValue={period}
              onSelect={handlePeriodChange}
              pointerClassName="rounded-r-2xl"
            />
          </div>
        </div>
      </div>
    </>
  );
}
