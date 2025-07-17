'use client';

import Image from 'next/image';
import { UploadedImage } from '../types';
import { Icon } from '../../icon';

type ImageGridProps = {
    images: UploadedImage[];
    isLoading?: boolean;
    onRemove: (image: UploadedImage) => void;
    onAddClick: () => void;
};

export const ImageGrid = ({ images, isLoading = false, onRemove, onAddClick }: ImageGridProps) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
            {images.map((image) => (
                <div key={image.id} className="relative aspect-square">
                    <Image
                        src={image.url}
                        alt="이미지 미리보기"
                        className="w-full h-full object-cover rounded-md"
                        width={200}
                        height={200}
                    />
                    <button
                        disabled={isLoading}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(image);
                        }}
                    >
                        <Icon name="close" size={12} />
                    </button>
                </div>
            ))}
            {isLoading && (
                <div className="flex items-center justify-center aspect-square">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900">.</div>
                </div>
            )}
            <div
                className="border border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square cursor-pointer hover:bg-white/10"
                onClick={(e) => {
                    e.stopPropagation();
                    if (isLoading) return;
                    onAddClick();
                }}
            >
                <span className="text-2xl text-gray-400">+</span>
            </div>
        </div>
    );
};
