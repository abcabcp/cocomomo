import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HamburgerButton } from './HamburgerButton';

const meta: Meta<typeof HamburgerButton> = {
    title: 'Atomic/HamburgerButton',
    component: HamburgerButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        isOpen: { control: 'boolean' },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
            description: '아이콘 크기 (sm: 16px, md: 24px, lg: 32px)'
        },
        className: { control: 'text' },
        lineClassName: {
            control: 'text',
            description: '선에 적용할 추가 클래스 (예: bg-red-500)'
        },
    },
};

export default meta;
type Story = StoryObj<typeof HamburgerButton>;

export const Default: Story = {
    args: {
        isOpen: false,
        size: 'md',
    },
    render: (args) => (
        <div className="p-5 bg-gray-800 rounded-md">
            <HamburgerButton {...args} />
        </div>
    ),
};

export const Opened: Story = {
    args: {
        ...Default.args,
        isOpen: true,
    },
    render: Default.render,
};

export const Interactive: Story = {
    render: (args) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="p-5 bg-gray-800 rounded-md">
                <HamburgerButton
                    {...args}
                    isOpen={isOpen}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>
        );
    },
};

export const Small: Story = {
    args: {
        ...Default.args,
        size: 'sm',
    },
    render: Default.render,
};

export const Large: Story = {
    args: {
        ...Default.args,
        size: 'lg',
    },
    render: Default.render,
};

export const CustomColor: Story = {
    args: {
        ...Default.args,
        lineClassName: 'bg-red-500',
    },
    render: Default.render,
};
