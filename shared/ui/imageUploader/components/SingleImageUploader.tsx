'use client';

import { useRef } from 'react';
import { cn } from '@/shared';
import { ImagePreview } from './ImagePreview';
import { UploadPlaceholder } from './UploadPlaceholder';
import { SingleImageUploaderProps, UploadedImage } from '../types';
import { useImageUpload } from '../hooks/useImageUpload';

export const SingleImageUploader = ({
    label,
    isDirectUpload = false,
    folder,
    onChange,
    value,
    maxSize = 5,
    accept = 'image/*',
    className,
}: SingleImageUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        isLoading,
        isDragging,
        images,
        handleImageChange,
        handleRemove,
        handleDragEvents,
    } = useImageUpload({
        isDirectUpload,
        folder,
        maxSize,
        isSingle: true,
        accept,
        onChangeValue: (value: UploadedImage | UploadedImage[] | null) => {
            onChange(value as UploadedImage | null);
        },
        initialValue: value,
    });

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            {label && <p className="font-medium">{label}</p>}
            <div
                className={cn(
                    'border border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[150px]',
                    isDragging
                        ? 'bg-white/20 border-blue-500'
                        : 'border-gray-400 hover:bg-white/20'
                )}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDrop={(e) => {
                    handleDragEvents(e, false);
                    handleImageChange(e.dataTransfer.files);
                }}
                onClick={() => !isLoading && fileInputRef.current?.click()}
            >
                {images.length > 0 ? (
                    <ImagePreview
                        image={images[0]}
                        isLoading={isLoading}
                        onRemove={handleRemove}
                    />
                ) : (
                    <UploadPlaceholder isLoading={isLoading} maxSize={maxSize} />
                )}
            </div>
            <input
                disabled={isLoading}
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files)}
            />
        </div>
    );
};
