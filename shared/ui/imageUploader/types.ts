export interface UploadedImage {
  id?: string;
  url: string;
  publicId?: string;
  name?: string;
  size?: number;
  width?: number;
  height?: number;
  format?: string;
  originalFilename?: string;
  file?: File;
}

export interface BaseImageUploaderProps {
  label?: string;
  isDirectUpload?: boolean;
  folder?: string;
  maxSize?: number;
  accept?: string;
  className?: string;
}

export interface SingleImageUploaderProps extends BaseImageUploaderProps {
  onChange: (image: UploadedImage | null) => void;
  value?: UploadedImage | null;
}

export interface MultipleImageUploaderProps extends BaseImageUploaderProps {
  onChange: (images: UploadedImage[] | null) => void;
  value?: UploadedImage[] | null;
  maxFiles?: number;
}

export interface ImageUploaderProps extends BaseImageUploaderProps {
  type?: 'single' | 'multiple';
  value?: UploadedImage | UploadedImage[] | null;
  onChange: (value: UploadedImage | UploadedImage[] | null) => void;
  maxFiles?: number;
}
