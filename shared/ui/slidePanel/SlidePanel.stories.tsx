import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SlidePanel from './SlidePanel';

const meta: Meta<typeof SlidePanel> = {
    title: 'UI/SlidePanel',
    component: SlidePanel,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SlidePanel>;

// 스토리북에서 상태 관리를 위한 래퍼 컴포넌트
const SlidePanelWithControls = (args: React.ComponentProps<typeof SlidePanel>) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="p-4">
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setIsOpen(true)}
            >
                패널 열기
            </button>
            <SlidePanel
                {...args}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">슬라이드 패널</h2>
                    <p className="mb-4">이것은 측면에서 슬라이드되는 패널 컴포넌트입니다.</p>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => setIsOpen(false)}
                    >
                        닫기
                    </button>
                </div>
            </SlidePanel>
        </div>
    );
};

export const FromRight: Story = {
    render: (args) => <SlidePanelWithControls {...args} direction="right" />,
};

export const FromLeft: Story = {
    render: (args) => <SlidePanelWithControls {...args} direction="left" />,
};

export const CustomWidth: Story = {
    render: (args) => (
        <SlidePanelWithControls {...args} direction="right" width={500} />
    ),
};

export const NoOverlay: Story = {
    render: (args) => (
        <SlidePanelWithControls {...args} direction="right" hasOverlay={false} />
    ),
};

export const SlowAnimation: Story = {
    render: (args) => (
        <SlidePanelWithControls {...args} direction="right" animationDuration={800} />
    ),
};