'use client';

import { useCallback, useMemo } from 'react';
import { BaseScrollPickerProps } from '.';
import SnapScrollPicker, { PickerStyleType } from './SnapScrollPicker';
import { cn, formatTimeString, parseTimeString } from '@/shared/lib';
import { cva } from 'class-variance-authority';

type Period = 'AM' | 'PM';

const containerStyles = cva(
  'relative w-full h-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]',
  {
    variants: {
      styleType: {
        normal: '',
        primary: 'min-w-[220px] max-w-[300px] lg:min-w-[320px]',
      },
    },
    defaultVariants: {
      styleType: 'normal',
    },
  }
);


const leftColumnStyles = cva(
  'rounded-l-lg',
  {
    variants: {
      styleType: {
        normal: 'h-[60px]',
        primary: 'h-[60px] ',
      },
    },
    defaultVariants: {
      styleType: 'normal',
    },
  }
);

const leftColumnPointerStyles = cva(
  'py-3',
  {
    variants: {
      styleType: {
        normal: 'bg-grayscale-200 rounded-l-2xl h-[60px]',
        primary: 'h-[60px] text-white font-medium bg-white/10 rounded-l-2xl',
      },
    },
    defaultVariants: {
      styleType: 'normal',
    },
  }
);


export interface TimeScrollPickerProps extends BaseScrollPickerProps {
  // hh:mm
  value: string;
  // hh:mm 형식으로 리턴.
  onChange: (value: string) => void;
  styleType?: PickerStyleType;
}

export default function TimeScrollPicker({
  value,
  onChange,
  styleType = 'normal',
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
      <div className={containerStyles({ styleType })}>
        <div className="w-full grid grid-cols-[22%_22%_22%_34%] gap-0 items-center relative">
          <div>
            <p className={cn(leftColumnStyles({ styleType }), { 'hidden lg:block': styleType === 'primary' })}>&nbsp;</p>
            <p className={leftColumnStyles({ styleType })}>&nbsp;</p>
            <p className={leftColumnPointerStyles({ styleType })}>
              &nbsp;
            </p>
            <p className={leftColumnStyles({ styleType })}>&nbsp;</p>
            <p className={cn(leftColumnStyles({ styleType }), { 'hidden lg:block': styleType === 'primary' })}>&nbsp;</p>
          </div>
          <div className="overflow-hidden">
            <SnapScrollPicker
              items={hours}
              selectedValue={hour}
              onSelect={handleHourChange}
              styleType={styleType}
            />
          </div>

          <div className="overflow-hidden">
            <SnapScrollPicker
              items={minutes}
              selectedValue={minute}
              onSelect={handleMinuteChange}
              styleType={styleType}
            />
          </div>

          <div className="overflow-hidden">
            <SnapScrollPicker
              items={periods}
              selectedValue={period}
              onSelect={handlePeriodChange}
              pointerClassName="rounded-r-2xl"
              styleType={styleType}
            />
          </div>
        </div>
      </div>
    </>
  );
}
