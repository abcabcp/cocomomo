'use client';

import { useInstagramFeed } from '@/features/foto/hooks';
import { cn, Icon } from '@/shared';
import Image from 'next/image';
import { InstagramPost } from '../api';
import { SkeletonFeeds } from './SkeletonFeeds';

export function InstagramFeed({ modal, onSelectFeed, onCloseFeed }: { modal?: boolean, onSelectFeed?: (feed: InstagramPost) => void, onCloseFeed?: () => void }) {
    const {
        rowVirtualizer,
        measureRowHeight,
        posts,
        viewCount,
        isLoading,
        isFetching,
        isError,
        error,
    } = useInstagramFeed();

    if (isError) {
        return <div className="text-red-500">Error: {error?.message}</div>;
    }

    return (
        <div
            className={cn("overflow-y-auto", {
                'h-[calc(100vh-120px)] max-h-full': !modal
            })}
        >
            <div
                className="relative w-full"
                style={{
                    height: rowVirtualizer.getTotalSize() ? `${rowVirtualizer.getTotalSize()}px` : '100vh',
                }}
            >
                {rowVirtualizer.getVirtualItems()?.map((virtualRow) => {
                    const startIndex = virtualRow.index * viewCount;
                    const endIndex = startIndex + viewCount;
                    const rowPosts = posts.slice(startIndex, endIndex);
                    return (
                        <div
                            ref={measureRowHeight}
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                            className="absolute top-0 left-0 w-full h-fit"
                            style={{
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            <div
                                className="grid gap-4 p-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                            >
                                {rowPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="group relative"
                                        style={{ paddingTop: '100%' }}
                                        onClick={() => onSelectFeed?.(post)}
                                    >

                                        <div
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
                                            {post.media_type === 'VIDEO' && (
                                                <div className="absolute right-2 top-2 z-[2]">
                                                    <Icon name="video" size={24} className='text-black' />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            {
                (isLoading || isFetching) && (
                    <div
                        className="relative w-full">
                        <SkeletonFeeds count={12} />

                    </div>
                )
            }
        </div >
    );
};