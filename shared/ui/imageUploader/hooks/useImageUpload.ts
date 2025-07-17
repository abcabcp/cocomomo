'use client';

import { UploadImageDto, UploadImagesDto } from '@/entities/api/model';
import {
  useAddImageUtils,
  useAddImagesUtils,
  useDeleteImageByUrlUtils,
} from '@/entities/api/query/utils';
import { useState } from 'react';
import { UploadedImage } from '../types';

type UseImageUploadProps = {
  isDirectUpload?: boolean;
  folder?: string;
  maxSize?: number;
  isSingle?: boolean;
  onChangeValue: (value: UploadedImage | UploadedImage[] | null) => void;
  initialValue?: UploadedImage | UploadedImage[] | null;
};

export const useImageUpload = ({
  isDirectUpload = false,
  folder,
  maxSize = 5,
  isSingle = true,
  onChangeValue,
  initialValue,
}: UseImageUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const images = isSingle
    ? (initialValue as UploadedImage | null)
      ? [initialValue as UploadedImage]
      : []
    : (initialValue as UploadedImage[] | null) || [];

  const { mutateAsync: uploadImage } = useAddImageUtils({
    mutation: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });
  const { mutateAsync: uploadImages } = useAddImagesUtils({
    mutation: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const { mutateAsync: deleteImage } = useDeleteImageByUrlUtils();

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsLoading(true);

    const validFiles: File[] = Array.from(files).filter((file) => {
      const sizeInMB = file.size / (1024 * 1024);
      return sizeInMB <= maxSize;
    });

    if (validFiles.length === 0) {
      alert(`파일 크기는 ${maxSize}MB 이하만 가능합니다.`);
      setIsLoading(false);
      return;
    }

    if (isDirectUpload) {
      try {
        if (isSingle) {
          const { data } = (await uploadImage({
            data: { image: validFiles[0] },
            params: { folder },
          })) as { data: UploadImageDto };

          if (data?.imageUrl) {
            const uploadedImage: UploadedImage = {
              id: generateId(),
              url: data.imageUrl,
            };
            onChangeValue(uploadedImage);
          }
        } else {
          const { data } = (await uploadImages({
            data: { images: validFiles },
            params: { folder },
          })) as { data: UploadImagesDto };

          if (data?.imageUrls && data.imageUrls.length > 0) {
            const uploadedImages: UploadedImage[] = data.imageUrls.map(
              (url: string) => ({
                id: generateId(),
                url,
              }),
            );
            onChangeValue(uploadedImages);
          }
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
        setIsLoading(false);
      }
    } else {
      const processFiles = async () => {
        const newImages: UploadedImage[] = await Promise.all(
          validFiles.map(async (file) => {
            const url = await readFileAsDataURL(file);
            return {
              id: generateId(),
              url,
              file,
            };
          }),
        );

        if (isSingle) {
          onChangeValue(newImages[0]);
        } else {
          const currentImages = (initialValue as UploadedImage[]) || [];
          onChangeValue([...currentImages, ...newImages]);
        }
        setIsLoading(false);
      };

      processFiles();
    }
  };

  const handleRemove: (image: UploadedImage) => void = async (
    image: UploadedImage,
  ) => {
    if (isSingle) {
      onChangeValue(null);
      if (isDirectUpload && !image.file) {
        try {
          await deleteImage({ params: { imageUrl: image.url } });
        } catch (error) {
          console.error('이미지 삭제 실패', error);
        }
      }
    } else {
      const filteredImages = (images as UploadedImage[]).filter(
        (img) => img.id !== image.id,
      );
      onChangeValue(filteredImages.length > 0 ? filteredImages : null);

      if (isDirectUpload && !image.file) {
        try {
          await deleteImage({ params: { imageUrl: image.url } });
        } catch (error) {
          console.error('이미지 삭제 실패', error);
        }
      }
    }
  };

  const handleDragEvents = (e: React.DragEvent, isDragActive: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(isDragActive);
    }
  };

  return {
    isLoading,
    isDragging,
    images,
    handleImageChange,
    handleRemove,
    handleDragEvents,
  };
};
