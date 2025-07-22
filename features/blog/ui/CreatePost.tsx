'use client';

import { cn } from "@/shared";
import MDEditor from '@uiw/react-md-editor';
import { useEffect, useState } from "react";
import { ImageUploader, UploadedImage } from "@/shared/ui";
import { useCreatePosts } from "@/entities/api/query/posts";

export function CreatePost({ modal, onClose }: { modal?: boolean, onClose: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [inputTag, setInputTag] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [markdown, setMarkdown] = useState('');
    const [thumbnailImage, setThumbnailImage] = useState<UploadedImage | null>(null);
    const [attachedImages, setAttachedImages] = useState<UploadedImage[] | null>(null);

    const { mutateAsync: createPost } = useCreatePosts();

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            onClose();
        }, 100);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleSubmit = async () => {
        const result = await createPost({
            data: {
                title,
                content: markdown,
                tags: tags.join(','),
                thumbnail: thumbnailImage?.file,
            },
        });
        console.log(result);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={cn('absolute top-0 left-0 w-full h-full backdrop-blur-lg rounded-2xl overflow-hidden pb-5 z-10', {
            'pt-9': modal,
        })}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubmit();
                    return
                }}
                className={cn(
                    "flex flex-col gap-3 w-full h-full px-2 md:px-4 overflow-y-auto",
                    "transition-all delay-10 duration-300",
                    isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}>
                <div className="flex justify-between items-center w-full gap-x-3 mt-10 my-5 md:my-5">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-[10px] rounded-lg transition-colors duration-200 cursor-pointer text-sm w-full border border-gray-400"
                    >
                        Cancle
                    </button>
                    <button
                        type="submit"
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-[10px] rounded-lg transition-colors duration-200 cursor-pointer text-sm w-full border border-gray-400"
                    >
                        Submit
                    </button>

                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="title">제목</label>
                    <input id="title" type="text" placeholder="Title" className="border border-gray-400 rounded-lg p-2" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={onKeyDown} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="tags">태그</label>
                    <input
                        id="tags"
                        type="text"
                        placeholder="Tag"
                        value={inputTag}
                        className="border border-gray-400 rounded-lg p-2"
                        onChange={(e) => setInputTag(e.target.value)}
                        onBlur={() => {
                            if (inputTag?.length === 0) return;
                            console.log('inputTag', inputTag);
                            setTags([...tags, inputTag]);
                            setInputTag('');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (inputTag?.length === 0) return;
                                setTags([...tags, inputTag]);
                                setInputTag('');
                            }
                        }}
                    />
                    {tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span key={index} className="bg-white/30 text-black rounded-lg px-2 text-sm">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                <ImageUploader
                    label="썸네일 이미지"
                    type="single"
                    value={thumbnailImage}
                    onChange={(images) => setThumbnailImage(images as UploadedImage)}
                />
                <ImageUploader
                    label="첨부 이미지"
                    type="multiple"
                    isDirectUpload
                    folder="post"
                    value={attachedImages}
                    onChange={(images) => setAttachedImages(images as UploadedImage[])}
                />

                {attachedImages && attachedImages.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p>업로드된 이미지 경로</p>
                        <div className="space-y-2">
                            {attachedImages.map((image, index) => (
                                <div key={image.id} className="flex items-center gap-2 bg-white/10 p-2 rounded-md">
                                    <span className="text-sm truncate flex-1">{image.url}</span>
                                    <button
                                        className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs"
                                        onClick={() => {
                                            navigator.clipboard.writeText(image.url);
                                        }}
                                    >
                                        복사
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-2 h-60">
                    <MDEditor
                        id="content"
                        value={markdown}
                        onChange={(val) => {
                            setMarkdown(val || '')
                        }}
                    />
                </div>
            </form>
        </div>
    );
}