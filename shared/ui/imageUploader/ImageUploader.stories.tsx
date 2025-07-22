import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ImageUploader } from './ImageUploader';
import { UploadedImage } from './types';

const queryClient = new QueryClient();

const withQueryClient = (Story: React.ComponentType) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Story />
        </QueryClientProvider>
    );
};

const meta: Meta<typeof ImageUploader> = {
    title: 'UI/ImageUploader',
    component: ImageUploader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [withQueryClient],
};

export default meta;
type Story = StoryObj<typeof ImageUploader>;

const getMockImageUrl = (id: string) => `https://picsum.photos/id/${id}/300/200`;
export const SingleImageUploader: Story = {
    args: {
        label: '이미지 업로드',
        type: 'single',
        isDirectUpload: false,
        maxSize: 5,
    },
    render: (args) => {
        const [image, setImage] = useState<UploadedImage | null>(null);
        return (
            <ImageUploader
                {...args}
                value={image}
                onChange={(newImage) => setImage(newImage as UploadedImage | null)}
            />
        );
    },
};

/**
 * 다중 이미지 업로더의 기본 상태입니다.
 */
export const MultipleImageUploader: Story = {
    args: {
        label: '다중 이미지 업로드',
        type: 'multiple',
        isDirectUpload: false,
        maxSize: 5,
    },
    render: (args) => {
        const [images, setImages] = useState<UploadedImage[] | null>(null);
        return (
            <ImageUploader
                {...args}
                value={images}
                onChange={(newImages) => setImages(newImages as UploadedImage[] | null)}
            />
        );
    },
};

export const SingleImageUploaderWithImage: Story = {
    args: {
        label: '이미지 업로드 (이미지 있음)',
        type: 'single',
        isDirectUpload: false,
    },
    render: (args) => {
        const [image, setImage] = useState<UploadedImage | null>({
            id: '237',
            url: getMockImageUrl('237'),
        });
        return (
            <ImageUploader
                {...args}
                value={image}
                onChange={(newImage) => setImage(newImage as UploadedImage | null)}
            />
        );
    },
};

export const MultipleImageUploaderWithImages: Story = {
    args: {
        label: '다중 이미지 업로드 (이미지 있음)',
        type: 'multiple',
        isDirectUpload: false,
    },
    render: (args) => {
        const [images, setImages] = useState<UploadedImage[]>([
            {
                id: '237',
                url: getMockImageUrl('237'),
            },
            {
                id: '238',
                url: getMockImageUrl('238'),
            },
            {
                id: '239',
                url: getMockImageUrl('239'),
            },
        ]);
        return (
            <ImageUploader
                {...args}
                value={images}
                onChange={(newImages) => setImages(newImages as UploadedImage[] || [])}
            />
        );
    },
};
