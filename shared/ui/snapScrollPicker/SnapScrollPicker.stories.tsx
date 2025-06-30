import type { Meta, StoryObj } from '@storybook/react';
import { SnapScrollPicker } from './index';

const meta = {
  title: 'Atomic/SnapScrollPicker',
  component: SnapScrollPicker,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
      ],
    },
  },
  argTypes: {
    type: {
      description: 'ScrollPicker의 타입을 설정합니다.',
      control: 'radio',
      options: ['number', 'time'],
    },
    selectValue: {
      description: 'NumberScrollPicker에서 선택된 값입니다.',
      control: 'number',
      if: { arg: 'type', eq: 'number' },
    },
    onChange: {
      description: '값이 변경되었을 때 호출되는 콜백 함수입니다.',
      action: 'changed',
    },
    min: {
      description: 'NumberScrollPicker에서 최소값을 설정합니다.',
      control: 'number',
      if: { arg: 'type', eq: 'number' },
    },
    max: {
      description: 'NumberScrollPicker에서 최대값을 설정합니다.',
      control: 'number',
      if: { arg: 'type', eq: 'number' },
    },
    labels: {
      description:
        '레이블 텍스트를 설정합니다. [왼쪽, 오른쪽] 형식의 배열입니다.',
      control: 'object',
    },
  },
} satisfies Meta<typeof SnapScrollPicker>;

export default meta;
type Story = StoryObj<typeof SnapScrollPicker>;

export const NumberScrollPicker: Story = {
  args: {
    type: 'number',
    selectValue: 50,
    onChange: (value: number) => console.log('Selected value:', value),
    min: 0,
    max: 100,
    labels: ['Every', 'Day'],
  },
};

export const TimeScrollPicker: Story = {
  args: {
    type: 'time',
    value: '12:30 PM',
    onChange: (value: string) => console.log('Selected time:', value),
  },
};
