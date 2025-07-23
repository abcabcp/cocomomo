'use client';

import { cn } from "@/shared";
import MDEditor from '@uiw/react-md-editor';
import { useEffect, useState } from "react";
import { Icon, ImageUploader, UploadedImage } from "@/shared/ui";
import { useCreatePosts, useFindAllPosts, useFindOnePosts, useUpdatePosts } from "@/entities/api/query/posts";
import { useForm, formOptions } from '@tanstack/react-form'
import useToast from "@/shared/store/toast";
import { usePostSearchStore } from "../store/post-search";

type PostFormValue = {
    title: string;
    tags: string[];
    markdown: string;
    thumbnailImage: UploadedImage | null;
}

export function PostForm({ modal, id, onClose }: { modal?: boolean, id?: number, onClose: () => void }) {
    const { searchTerm, tags: searchTags } = usePostSearchStore();
    const { data, refetch: refetchPost } = useFindOnePosts(`${id}`, { query: { enabled: !!id } });
    const post = data?.data;
    const [isOpen, setIsOpen] = useState(false);
    const [inputTag, setInputTag] = useState('');
    const [attachedImages, setAttachedImages] = useState<UploadedImage[] | null>(null);
    const { add } = useToast();
    const { refetch: refetchPosts } = useFindAllPosts({
        tags: searchTags?.join(','),
        searchTerm,
    });

    const { mutateAsync: createPost } = useCreatePosts({
        mutation: {
            onSuccess: () => {
                refetchPosts();
            }
        }
    });
    const { mutateAsync: updatePost } = useUpdatePosts({
        mutation: {
            onSuccess: () => {
                refetchPost();
                refetchPosts();
            }
        }
    });


    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            onClose();
        }, 100);
    };

    const postFormOps = formOptions({
        mode: 'onChange',
        defaultValues: { title: post?.title || '', tags: post?.tags || [], markdown: post?.content || '', thumbnailImage: post?.thumbnailUrl ? { url: post.thumbnailUrl } : null } as PostFormValue,
    })

    const postForm = useForm({
        ...postFormOps,
        onSubmit: async ({ value }) => {
            if (id) {
                await updatePost({
                    id: `${id}`,
                    data: {
                        title: value.title,
                        content: value.markdown,
                        tags: value.tags.join(','),
                        thumbnail: value.thumbnailImage?.file,
                    },
                });
                add({
                    message: 'Post updated successfully',
                    status: 'success',
                });
                handleClose()
            } else {
                await createPost({
                    data: {
                        title: value.title,
                        content: value.markdown,
                        tags: value.tags.join(','),
                        thumbnail: value.thumbnailImage?.file,
                    },
                });
                add({
                    message: 'Post created successfully',
                    status: 'success',
                });
                handleClose()
            }
        },
    })


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={cn('absolute top-0 left-0 w-full h-full backdrop-blur-lg rounded-2xl overflow-hidden pb-5 z-20', {
            'pt-9': modal,
        })}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    postForm.handleSubmit();
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
                    <postForm.Field
                        name="title"
                        validators={{
                            onChange: ({ value }) => {
                                if (!value) {
                                    return '제목을 입력해주세요.';
                                }
                                if (value.length < 3) {
                                    return '제목은 3자 이상이어야 합니다.';
                                }
                                return undefined;
                            }
                        }}
                        children={(field) => (
                            <>
                                <label htmlFor="title">제목</label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type="text"
                                    placeholder="Title"
                                    className="border border-gray-400 rounded-lg p-2"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors && (
                                    <p className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</p>
                                )}
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="tag">태그</label>
                    <input
                        id="tag"
                        type="text"
                        placeholder="Tag"
                        value={inputTag}
                        className="border border-gray-400 rounded-lg p-2"
                        onChange={(e) => setInputTag(e.target.value)}
                        onBlur={() => {
                            if (inputTag?.length === 0) return;
                            postForm.setFieldValue('tags', [...postForm.getFieldValue('tags'), inputTag]);
                            setInputTag('');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (inputTag?.length === 0) return;
                                postForm.setFieldValue('tags', [...postForm.getFieldValue('tags'), inputTag]);
                                setInputTag('');
                            }
                        }}
                    />
                    <postForm.Field name="tags" mode="array">
                        {(field) => {
                            return (
                                <div className="flex flex-wrap gap-2">
                                    {field.state.value.map((_, i) => {
                                        return (
                                            <postForm.Field key={i} name={`tags[${i}]`}>
                                                {(subField) => {
                                                    return (
                                                        <p className="bg-white/30 text-black rounded-lg px-2 text-sm flex items-center gap-1 text-white">
                                                            {subField.state.value}
                                                            <button
                                                                type="button"
                                                                className="cursor-pointer"
                                                                onClick={() => field.removeValue(i)}
                                                            >
                                                                <p className="sr-only">태그 삭제</p>
                                                                <Icon name="close" size={12} className="text-white" />
                                                            </button>
                                                        </p>
                                                    )
                                                }}
                                            </postForm.Field>
                                        )
                                    })}
                                </div>
                            )
                        }}
                    </postForm.Field>
                </div>
                <postForm.Field name="thumbnailImage">
                    {(field) => {
                        return (
                            <ImageUploader
                                label="썸네일 이미지"
                                accept="image/jpeg, image/png, image/webp, image/gif, image/jpg"
                                type="single"
                                value={field.state.value}
                                onChange={(images) => field.handleChange(images as UploadedImage)}
                            />
                        )
                    }}
                </postForm.Field>
                <ImageUploader
                    label="첨부 이미지"
                    type="multiple"
                    accept="image/jpeg, image/png, image/webp, image/gif, image/jpg"
                    isDirectUpload
                    folder="post"
                    value={attachedImages}
                    onChange={(images) => setAttachedImages(images as UploadedImage[])}
                />
                {attachedImages && attachedImages.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p>업로드된 이미지 경로</p>
                        <div className="space-y-2">
                            {attachedImages.map((image) => (
                                <div key={image.id} className="flex items-center gap-2 bg-white/10 p-2 rounded-md">
                                    <span className="text-sm truncate flex-1">{image.url}</span>
                                    <button
                                        type="button"
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
                <postForm.Field name="markdown">
                    {(field) => {
                        return (
                            <div className="flex flex-col gap-2 h-60">
                                <MDEditor
                                    id="content"
                                    value={field.state.value}
                                    onChange={(val) => {
                                        field.handleChange(val || '')
                                    }}
                                />
                            </div>
                        )
                    }}
                </postForm.Field>
            </form>
        </div>
    );
}