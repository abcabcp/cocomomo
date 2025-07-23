'use client';

import { useFindOnePosts } from "@/entities/api/query/posts";
import { Icon } from "@/shared/ui/icon/Icon";
import MDEditor from "@uiw/react-md-editor";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import { SkeletonPost } from "./SkeletonPost";
import { useUserStore } from "@/shared/store";
import { useMemo, useState } from "react";
import { PostForm } from "../../ui";
import { useSession } from "next-auth/react";
import { useAuth } from "@/features/auth";

export function Post({ id }: { id: string }) {
    const { handleGithubLogin } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { status } = useSession();
    const { user } = useUserStore()
    const { data } = useFindOnePosts(id as string);
    const post = useMemo(() => data?.data, [data?.data])

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
                {user?.role === 'admin' && (
                    <button type="button" className="absolute top-5 right-5 z-11 cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
                        <Icon name="edit" size={24} className="text-gray-400" />
                    </button>
                )}
                <div className="absolute inset-0 bg-black/50 z-5" />
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
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-8 lg:p-12">
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
                                    className="px-3 py-1 bg-violet-300/80 text-xs font-medium rounded-full text-black backdrop-blur-sm"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-10 h-fit ">
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
            <div className="max-w-5xl mx-auto px-4 md:px-8 pb-10 h-fit">
                <h3 className="text-xl font-semibold text-gray-400 mb-4 flex items-center gap-2">
                    Comment
                </h3>
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-8">
                    {status === 'authenticated' ? (
                        <div className="relative">
                            <textarea
                                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-violet-300 outline-none min-h-[100px] resize-none"
                                placeholder="댓글 내용을 입력해주세요"
                            />
                            <button className="absolute right-4 bottom-4 bg-violet-300 hover:bg-violet-400 text-black font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2">
                                Post
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleGithubLogin}
                            className="w-full flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-gray-400 px-5 py-3 rounded-lg shadow-lg cursor-pointer"
                        >
                            <Icon name="github" size={24} className="text-violet-300" />
                            <span className="font-medium">Login with GitHub</span>
                        </button>
                    )}
                </div>
            </div>
            {isEditModalOpen && <PostForm id={post.id} modal onClose={() => setIsEditModalOpen(false)} />}
        </div>
    );
}