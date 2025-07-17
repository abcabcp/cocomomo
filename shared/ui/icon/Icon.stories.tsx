import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { icons } from './icons';

const meta = {
    title: 'Atomic/Icon',
    component: Icon,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        name: {
            options: Object.keys(icons),
            control: { type: 'select' },
            description: '아이콘 이름',
        },
        size: {
            control: { type: 'number' },
            description: '아이콘 크기 (픽셀)',
        },
        color: {
            control: { type: 'color' },
            description: '아이콘 색상',
        },
    },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        name: 'close',
        size: 24,
    },
};

export const Colored: Story = {
    args: {
        name: 'close',
        size: 24,
        color: '#FF0000',
    },
};

export const Sizes: StoryObj = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Icon name="close" size={16} />
            <Icon name="close" size={24} />
            <Icon name="close" size={32} />
            <Icon name="close" size={48} />
        </div>
    ),
};

export const AllIcons: StoryObj = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {Object.keys(icons).map((name) => (
                <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
                    <Icon name={name as keyof typeof icons} size={24} />
                    <span style={{ marginTop: '8px', fontSize: '12px' }}>{name}</span>
                </div>
            ))}
        </div>
    ),
};
