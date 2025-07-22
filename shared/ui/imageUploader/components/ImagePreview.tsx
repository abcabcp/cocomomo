'use client';

import Image from 'next/image';
import { UploadedImage } from '../types';
import { Icon } from '../../icon';

type ImagePreviewProps = {
    image: UploadedImage;
    isLoading?: boolean;
    onRemove: (image: UploadedImage) => void;
};

export const ImagePreview = ({ image, isLoading = false, onRemove }: ImagePreviewProps) => {
    return (
        <div className="relative w-full h-full">
            <Image
                src={image.url}
                alt="이미지 미리보기"
                className="max-h-[200px] mx-auto object-contain"
                width={200}
                height={200}
            />
            <button
                disabled={isLoading}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    if (isLoading) return;
                    onRemove(image);
                }}
            >
                <Icon name="close" size={12} />
            </button>
        </div>
    );
};
