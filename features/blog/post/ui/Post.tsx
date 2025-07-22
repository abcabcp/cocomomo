'use client';

import { useFindOnePosts } from "@/entities/api/query/posts";
import { Icon } from "@/shared/ui/icon/Icon";
import MDEditor from "@uiw/react-md-editor";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import { SkeletonPost } from "./SkeletonPost";

export function Post({ id }: { id: string }) {
    const { data } = useFindOnePosts(id as string);
    const post = data?.data;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "yyyy년 MM월 dd일", { locale: ko });
    };

    if (!post) {
        return <SkeletonPost />
    }

    return (
        <div className="h-full bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 overflow-y-scroll">
            <div className="relative w-full h-60 md:h-90 overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10" />
                {post.thumbnailUrl && (
                    <Image
                        src={post.thumbnailUrl}
                        alt={post.title}
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover object-center"
                    />
                )}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 md:p-8 lg:p-12">
                    <div className="max-w-5xl mx-auto w-full">
                        <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex items-center text-gray-300 text-sm">
                                <Icon name="calendar" size={16} className="mr-2" />
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                            {post.updatedAt && post.updatedAt !== post.createdAt && (
                                <div className="flex items-center text-gray-300 text-sm">
                                    <Icon name="clock" size={16} className="mr-2" />
                                    <span>업데이트: {formatDate(post.updatedAt)}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {post.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-blue-600/80 text-xs font-medium rounded-full text-white backdrop-blur-sm"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 h-fit ">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl">
                    <div className="p-6 md:p-8">
                        <div className="prose prose-invert prose-lg max-w-none">
                            <MDEditor.Markdown
                                source={post.content}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'inherit',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}