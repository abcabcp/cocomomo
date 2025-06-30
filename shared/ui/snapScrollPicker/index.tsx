'use client';

import NumberScrollPicker, {
  NumberScrollPickerProps,
} from './NumberScrollPicker';

import TimeScrollPicker, { TimeScrollPickerProps } from './TimeScrollPicker';

type SnapScrollPickerType = 'number' | 'time';

export interface BaseScrollPickerProps {
  type?: SnapScrollPickerType;
  labels?: [string, string];
}

export type SnapScrollPickerProps =
  | NumberScrollPickerProps
  | TimeScrollPickerProps;

export function SnapScrollPicker(props: SnapScrollPickerProps) {
  if (props.type === 'time') {
    return <TimeScrollPicker {...(props as TimeScrollPickerProps)} />;
  }
  return <NumberScrollPicker {...(props as NumberScrollPickerProps)} />;
}
