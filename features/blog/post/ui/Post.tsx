'use client';

import { useFindOnePosts } from "@/entities/api/query/posts";
import { Icon } from "@/shared/ui/icon/Icon";
import MDEditor from "@uiw/react-md-editor";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import { SkeletonPost } from "./SkeletonPost";
import { useModalStore, useUserStore } from "@/shared/store";
import { useMemo, useState } from "react";
import { PostForm } from "../../ui";
import { useSession } from "next-auth/react";
import { useAuth } from "@/features/auth";
import { closePostAnimation, cn } from "@/shared";
import { useTransitionRouter } from "next-view-transitions";

export function Post({ id, modal }: { id: string, modal?: boolean }) {
    const router = useTransitionRouter()
    const { handleGithubLogin } = useAuth();
    const { setSize } = useModalStore()
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
        <div id="post" className="h-full bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 overflow-y-scroll">
            <div className="sticky top-4 left-4 z-20 px-4 h-0">
                <button
                    type="button"
                    className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-lg shadow-lg p-2 text-sm cursor-pointer hover:bg-violet-300 hover:text-black transition-colors"
                    onClick={() => {
                        if (modal) {
                            router.replace('/blog', {
                                scroll: false,
                                onTransitionReady: () => {
                                    closePostAnimation();
                                }
                            })
                        } else {
                            setSize({ width: window.innerWidth, height: window.innerHeight })
                            router.push('/blog', {
                                scroll: false,
                                onTransitionReady: () => {
                                    closePostAnimation();
                                }
                            })
                        }
                    }}
                >
                    <Icon name="list" size={15} />
                    <span>블로그 목록</span>
                </button>
            </div>
            <div className="relative w-full h-60 md:h-90">
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
                <div className="absolute inset-0 z-10 flex flex-col justify-end">
                    <div className="max-w-5xl mx-auto w-full px-4 py-4 md:py-8 lg:py-16">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                {post.title}
                            </h1>
                            {user?.role === 'admin' && (
                                <div className="flex gap-4 items-center">
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-violet-300 transition-colors cursor-pointer"
                                        onClick={() => setIsEditModalOpen(true)}
                                    >
                                        <Icon name="edit" size={24} />
                                    </button>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                        onClick={() => console.log('delete')}
                                    >
                                        <Icon name="close" size={24} />
                                    </button>
                                </div>
                            )}
                        </div>
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
            <div className={cn("max-w-5xl mx-auto px-4 py-8 md:py-10 h-fit")}>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl">
                    <div className="p-6 md:p-8 prose prose-invert md:prose-lg lg:prose-xl max-w-none">
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
            <div className="max-w-5xl mx-auto px-4 mb-28 h-fit">
                <h3 className="text-xl font-semibold text-gray-400 mb-4 flex items-center gap-2">
                    Comment
                </h3>
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
                        className="w-full flex items-center gap-3 text-gray-400 rounded-lg p-4 cursor-pointer bg-gray-800 hover:bg-gray-700/50 transition-colors"
                    >
                        <Icon name="github" size={24} className="text-violet-300" />
                        <span className="font-medium">Login with GitHub</span>
                    </button>
                )}
                <div className="mt-8 space-y-6">
                    <div className="flex items-start gap-4 px-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-violet-300 flex items-center justify-center text-black font-medium overflow-hidden" />
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h4 className="font-semibold text-gray-200">Conan</h4>
                                    <p className="text-xs text-gray-400">2025년 7월 24일</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-gray-400 hover:text-violet-300 transition-colors cursor-pointer">
                                        <Icon name="edit" size={16} />
                                    </button>
                                    <button className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                                        <Icon name="close" size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="text-gray-300">
                                <p>역시 코난이랑 모카가 가장 귀엽네요.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/30 shadow-lg border-t border-b border-gray-700/30 py-6 px-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-emerald-300 flex items-center justify-center text-black font-medium">
                                    <span>CM</span>
                                </div>
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-gray-200">Mocha</h4>
                                        <p className="text-xs text-gray-400">2025년 7월 23일</p>
                                    </div>
                                </div>
                                <div className="text-gray-300">
                                    <p>코멘트 기능은 개발 중이에요</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isEditModalOpen && <PostForm id={post.id} modal onClose={() => setIsEditModalOpen(false)} />}
        </div>
    );
}