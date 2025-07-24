'use client'

import { FindAllPostsParams } from "@/entities/api/model";
import { useFindAllPosts } from "@/entities/api/query/posts";
import Link from "next/link";
import removeMd from 'remove-markdown';
import { usePostSearchStore } from "../store/post-search";
import { useMemo } from "react";
import { useModalStore } from "@/shared/store";
import { useTransitionRouter } from "next-view-transitions";
import { openModalAnimation, openPostAnimation } from "@/shared";


export function BlogList({ modal }: { modal?: boolean }) {
    const router = useTransitionRouter();
    const { searchTerm, tags: searchTags } = usePostSearchStore();
    const { setSize } = useModalStore()
    const { data: allPosts, isLoading } = useFindAllPosts({
        tags: searchTags?.join(','),
        searchTerm,
        limit: 15
    } as FindAllPostsParams);
    const posts = useMemo(() => allPosts?.data?.list || [], [allPosts?.data?.list])

    return (
        <ul className="flex flex-col gap-6 m-4" id="post-list">
            {isLoading && (
                Array(5).fill(0).map((_, index) => (
                    <li key={index} className="h-50 w-full bg-white/10 rounded-md animate-pulse" />
                ))
            )}
            {!isLoading && !posts?.length && (
                <p className="text-center text-gray-400">검색 결과가 없습니다.</p>
            )}
            {!isLoading && posts?.map((post) => (
                <li
                    key={post?.id}
                    className="rounded-xl overflow-hidden shadow-lg relative min-h-50"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${post?.thumbnailUrl || '/default-thumbnail.jpg'})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40" />
                    <Link
                        href={`/blog/${post?.id}`}
                        scroll={false}
                        onClick={(e) => {
                            e.preventDefault();
                            if (modal) {
                                router.replace(`/blog/${post?.id}`, {
                                    scroll: false,
                                    onTransitionReady: () => {
                                        openPostAnimation();
                                    }
                                });
                            } else {
                                setSize({ width: window.innerWidth, height: window.innerHeight })
                                router.push(`/blog/${post?.id}`, {
                                    scroll: false,
                                    onTransitionReady: () => {
                                        openPostAnimation();
                                    }
                                });
                            }

                        }}
                        className="absolute inset-0 p-6 flex flex-col justify-between z-10 transition-transform hover:scale-[1.01]"
                    >
                        <div>
                            <h2 className="text-lg md:text-2xl font-bold text-white mb-2">{post?.title}</h2>
                            <div className="text-sm text-white/80 line-clamp-3">
                                {removeMd(post?.content)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 flex-wrap">
                            <span className="text-xs text-white/60">
                                {new Date(post?.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {post?.tags && post?.tags?.length > 0 && post?.tags?.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

