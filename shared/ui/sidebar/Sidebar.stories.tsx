import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { createRef } from 'react';

const meta = {
    title: 'Atomic/Sidebar',
    component: Sidebar,
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
        asidePanelWidth: {
            control: 'range',
            min: 200,
            max: 1000,
        },
        setAsidePanelWidth: {
            action: 'changed',
            type: 'function',
        },
        wrapperRef: {
            control: 'object',
        },
        children: {
            control: 'object',
        },
    },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
    args: {
        asidePanelWidth: 200,
        setAsidePanelWidth: (width: number) => console.log('Selected value:', width),
        wrapperRef: createRef(),
        children: <ul><li>menu1</li><li>menu2</li><li>menu3</li></ul>,
    },
};