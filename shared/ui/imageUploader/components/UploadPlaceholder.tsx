'use client';

type UploadPlaceholderProps = {
    isLoading?: boolean;
    maxSize?: number;
};

export const UploadPlaceholder = ({
    isLoading = false,
    maxSize = 5,
}: UploadPlaceholderProps) => {
    if (isLoading) {
        return (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900">.</div>
        );
    }
    return (
        <>
            <p className="text-sm text-gray-500">이미지를 드래그하여 놓거나 클릭하여 선택하세요</p>
            <p className="text-xs text-gray-400 mt-1">권장: Webp (최대 {maxSize}MB)</p>
        </>
    );
};
