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
  min = 0,
  max = 100,
}: NumberScrollPickerProps) {
  const items = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );

  return (
    <div className="relative w-full h-full bg-grayscale-50/50 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]">
      <SnapScrollPicker
        items={items}
        selectedValue={selectValue}
        onSelect={(value) => onChange(value as number)}
      />
    </div>
  );
}
