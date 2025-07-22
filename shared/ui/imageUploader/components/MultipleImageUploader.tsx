'use client';

import { useRef } from 'react';
import { cn } from '@/shared';
import { ImageGrid } from './ImageGrid';
import { UploadPlaceholder } from './UploadPlaceholder';
import { MultipleImageUploaderProps, UploadedImage } from '../types';
import { useImageUpload } from '../hooks/useImageUpload';

export const MultipleImageUploader = ({
    label,
    isDirectUpload = false,
    folder,
    onChange,
    value,
    maxSize = 5,
    accept = 'image/*',
    className,
}: MultipleImageUploaderProps) => {
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
        isSingle: false,
        onChangeValue: (value: UploadedImage | UploadedImage[] | null) => {
            onChange(value as UploadedImage[] | null);
        },
        initialValue: value,
    });

    const handleAddClick = () => {
        if (!isLoading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            {label && <p className="font-medium">{label}</p>}
            <div
                className={cn(
                    'border border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
                    isDragging
                        ? 'bg-white/20 border-blue-500'
                        : 'border-gray-400 hover:bg-white/20',
                    images.length > 0 ? 'min-h-[150px]' : 'flex flex-col items-center justify-center min-h-[150px]'
                )}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDrop={(e) => {
                    handleDragEvents(e, false);
                    handleImageChange(e.dataTransfer.files);
                }}
                onClick={(e) => {
                    if (images.length === 0 && !isLoading) {
                        fileInputRef.current?.click();
                    }
                }}
            >
                {images.length > 0 ? (
                    <ImageGrid
                        images={images}
                        isLoading={isLoading}
                        onRemove={handleRemove}
                        onAddClick={handleAddClick}
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
                multiple
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files)}
            />
        </div>
    );
};
