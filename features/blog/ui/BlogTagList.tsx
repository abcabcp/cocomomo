'use client';

import { useFindAllTagsPosts } from "@/entities/api/query/posts";
import { cn, isMobileDevice } from "@/shared";
import { useUserStore } from "@/shared/store";
import { usePostSearchStore } from "../store/post-search";

export function BlogTagList({ asidePanelWidth, openCreatePostModal }: { asidePanelWidth: number | null, openCreatePostModal: () => void }) {
    const { user } = useUserStore()
    const { data: tags, isLoading } = useFindAllTagsPosts();
    const { tags: searchTags, setTags, resetTags } = usePostSearchStore();

    const isTagSelected = (tagTitle: string): boolean => {
        if (tagTitle === '전체') {
            return !searchTags || searchTags.length === 0;
        }
        return searchTags?.includes(tagTitle) || false;
    };

    return (
        <div className={cn('flex flex-col gap-3 px-4', {
            'h-full': asidePanelWidth && !isMobileDevice(),
            'h-fit': asidePanelWidth === null || isMobileDevice()
        })}>
            <ul className="flex flex-col gap-2">
                {isLoading ? (
                    Array(5).fill(0).map((_, index) => (
                        <div key={index} className="h-10 w-full bg-white/10 rounded-md animate-pulse" />
                    ))
                ) : (
                    tags?.data?.tags?.map((tag, index) => (
                        <li
                            key={index}
                            className={cn(
                                "px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer flex justify-between items-center",
                                {
                                    "bg-white/10 text-white font-medium shadow-sm shadow-white/5": isTagSelected(tag.title as string),
                                    "text-gray-400 hover:bg-white/5 hover:text-gray-300": !isTagSelected(tag.title as string),
                                }
                            )}
                            onClick={() => {
                                if (tag.title === '전체') {
                                    resetTags();
                                } else {
                                    setTags(tag.title as string);
                                }
                            }}
                        >
                            <span>{tag.title}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/10">{tag.count}</span>
                        </li>
                    ))
                )}
            </ul>
            {user?.role === 'admin' && (
                <button
                    className="bg-gradient-to-r from-white/15 via-white/12 to-white/10 text-white py-2 px-4 rounded-lg transition-all duration-200 hover:from-white/20 hover:via-white/17 hover:to-white/15 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] active:scale-[1.01] border border-white/10 font-medium text-sm w-full backdrop-blur-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        openCreatePostModal();
                    }}
                >
                    새 포스트 작성
                </button>
            )}
        </div>
    );
}