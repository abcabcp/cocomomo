'use client';

import { UploadImageDto, UploadImagesDto } from '@/entities/api/model';
import {
  useAddImageUtils,
  useAddImagesUtils,
  useDeleteImageByUrlUtils,
} from '@/entities/api/query/utils';
import { useState } from 'react';
import { UploadedImage } from '../types';
import useToast from '@/shared/store/toast';

type UseImageUploadProps = {
  isDirectUpload?: boolean;
  folder?: string;
  maxSize?: number;
  isSingle?: boolean;
  onChangeValue: (value: UploadedImage | UploadedImage[] | null) => void;
  accept?: string;
  initialValue?: UploadedImage | UploadedImage[] | null;
};

export const useImageUpload = ({
  isDirectUpload = false,
  folder,
  maxSize = 10,
  isSingle = true,
  onChangeValue,
  accept,
  initialValue,
}: UseImageUploadProps) => {
  const { add } = useToast();
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

    const validSizeFiles: File[] = Array.from(files).filter((file) => {
      const sizeInMB = file.size / (1024 * 1024);
      return sizeInMB <= maxSize;
    });

    if (validSizeFiles.length === 0) {
      add({
        message: `파일 크기는 ${maxSize}MB 이하만 가능합니다.`,
        status: 'error',
      });
      setIsLoading(false);
      return;
    }

    const validFiles: File[] = validSizeFiles.filter((file) => {
      if (!accept) return true;

      const acceptTypes = accept.split(',').map((type) => type.trim());
      return acceptTypes.some((type) => file.type === type);
    });

    if (validFiles.length < validSizeFiles.length) {
      add({
        message: `지원하지 않는 파일 형식이 포함되어 있습니다.\n허용된 형식: ${accept}`,
        status: 'error',
      });
      if (validFiles.length === 0) {
        setIsLoading(false);
        return;
      }
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
        add({
          message: '이미지 업로드에 실패했습니다.',
          status: 'error',
        });
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
