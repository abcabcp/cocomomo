'use client';

import { ImageUploaderProps, UploadedImage } from './types';
import { SingleImageUploader } from './components/SingleImageUploader';
import { MultipleImageUploader } from './components/MultipleImageUploader';

export const ImageUploader = (props: ImageUploaderProps) => {
    const { type = 'single', value, onChange, ...rest } = props;

    if (type === 'single') {
        const singleValue = value as UploadedImage | null;
        const handleSingleChange = (image: UploadedImage | null) => {
            onChange(image);
        };

        return (
            <SingleImageUploader
                {...rest}
                value={singleValue}
                onChange={handleSingleChange}
            />
        );
    }

    const multipleValue = value as UploadedImage[] | null;
    const handleMultipleChange = (images: UploadedImage[] | null) => {
        onChange(images);
    };

    return (
        <MultipleImageUploader
            {...rest}
            value={multipleValue}
            onChange={handleMultipleChange}
        />
    );
};
