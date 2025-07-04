'use client';

import { useInstagramFeed } from '@/features/foto/hooks';
import Image from 'next/image';
import { SkeletonFeeds } from './SkeletonFeeds';
import Link from 'next/link';
import { cn } from '@/shared';

export function InstagramFeed() {
    const {
        rowVirtualizer,
        measureRowHeight,
        scrollRef,
        observerRef,
        posts,
        viewCount,
        isLoading,
        isFetching,
        isError,
        error
    } = useInstagramFeed();
    if (isError) {
        return <div className="text-red-500">Error: {error?.message}</div>;
    }
    return (
        <div ref={scrollRef} className="w-full h-full min-h-screen overflow-auto">
            <div
                className="relative w-full h-full"
                style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const startIndex = virtualRow.index * viewCount;
                    const endIndex = startIndex + viewCount;
                    const rowPosts = posts.slice(startIndex, endIndex);

                    return (
                        <div
                            ref={measureRowHeight}
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                            className={`absolute top-0 left-0 w-full grid gap-4 p-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
                            style={{
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            {rowPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="group relative"
                                    style={{ paddingTop: '100%' }}
                                >
                                    <Link
                                        href={post.permalink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            'absolute inset-0 block overflow-hidden hover:opacity-90 transition-opacity',
                                            'bg-white border border-subtle rounded-xl cursor-pointer',
                                            'group-hover:before:content-[""] group-hover:before:absolute group-hover:before:inset-0',
                                            'group-hover:before:bg-[linear-gradient(to_top,rgba(0,0,0,0.3),transparent)]',
                                            'group-hover:before:z-[1]'
                                        )}
                                    >
                                        <Image
                                            src={post.thumbnail_url || post.media_url}
                                            alt={post.caption}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="hidden group-hover:flex absolute inset-0 items-end justify-start z-[2]">
                                            <p className="p-2 text-white text-sm whitespace-pre-line">{post.caption}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    );
                })}
                {(isLoading || isFetching) && (
                    <SkeletonFeeds count={12} />
                )}
            </div>

            <div ref={observerRef} className="h-4 w-full" />
        </div>
    );
};