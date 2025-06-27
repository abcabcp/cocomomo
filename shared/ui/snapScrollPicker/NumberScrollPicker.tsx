'use client';

import { useMemo } from 'react';
import { BaseScrollPickerProps } from '.';
import SnapScrollPicker from './SnapScrollPicker';

export interface NumberScrollPickerProps extends BaseScrollPickerProps {
  type?: 'number';
  selectValue: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function NumberScrollPicker({
  selectValue,
  onChange,
  labels,
  min = 0,
  max = 100,
}: NumberScrollPickerProps) {
  const items = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );

  return (
    <div className="relative w-full h-full bg-grayscale-50/50 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]">
      <div className="w-full grid grid-cols-[33%_33%_34%] gap-0 items-center relative">
        <div className="text-2xl rounded-l-lg">
          <p className="py-3 h-[60px]">&nbsp;</p>
          <p className="py-3 h-[60px]">&nbsp;</p>
          <p className="py-3 h-[60px] bg-grayscale-200 rounded-l-2xl text-right">
            {labels?.[0]}
          </p>
          <p className="py-3 h-[60px]">&nbsp;</p>
          <p className="py-3 h-[60px]">&nbsp;</p>
        </div>
        <div className="overflow-hidden">
          <SnapScrollPicker
            items={items}
            selectedValue={selectValue}
            onSelect={(value) => onChange(value as number)}
          />
        </div>
        <div className="text-2xl rounded-r-lg">
          <p className="py-3 h-[60px]">&nbsp;</p>
          <p className="py-3 h-[60px]">&nbsp;</p>
          <p className="py-3 h-[60px] bg-grayscale-200 rounded-r-2xl text-left">
            {labels?.[1] ? labels[1] : ''}
          </p>
          <p className="py-3 h-[60px]">&nbsp;</p>
          <p className="py-3 h-[60px]">&nbsp;</p>
        </div>
      </div>
    </div>
  );
}
