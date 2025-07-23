'use client';

import { PostForm } from "@/features/blog/ui";
import { cn } from "@/shared";
import { useSSRMediaQuery } from "@/shared/lib/utils";
import { useModalStore } from "@/shared/store";
import { Sidebar } from "@/shared/ui";
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from "react";
import { BlogTagList } from "./BlogTagList";

const BlogLayoutClientOnly = ({ children, modal }: { children: React.ReactNode, modal?: boolean }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const isMdScreen = useSSRMediaQuery(768);
    const { size } = useModalStore();

    const [asidePanelWidth, setAsidePanelWidth] = useState<number | null>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth <= 768 || size.width < 768 ? null : 200;
        }
        return null;
    });

    useEffect(() => {
        if (isMdScreen || modal && size.width < 768) {
            setAsidePanelWidth(null);
        } else {
            setAsidePanelWidth(200);
        }
    }, [isMdScreen, modal, size]);

    return (
        <div ref={wrapperRef} className={cn('w-full h-full flex bg-gray-900', {
            'flex-col': !asidePanelWidth,
            'flex-row': asidePanelWidth
        })}>
            <Sidebar
                asidePanelWidth={asidePanelWidth}
                setAsidePanelWidth={setAsidePanelWidth}
                wrapperRef={wrapperRef}
            >
                <BlogTagList
                    asidePanelWidth={asidePanelWidth}
                    openCreatePostModal={() => setIsCreateModalOpen(true)}
                />
            </Sidebar>
            <article className={cn(
                "overflow-y-auto",
                asidePanelWidth ? "flex-1 h-full" : "w-full h-full"
            )}>
                {children}
            </article>
            {isCreateModalOpen && <PostForm modal onClose={() => setIsCreateModalOpen(false)} />}
        </div>
    );
};

const BlogLayoutWithNoSSR = dynamic(() => Promise.resolve(BlogLayoutClientOnly), {
    ssr: false,
});

export function BlogLayout(props: { children: React.ReactNode, modal?: boolean }) {
    return <BlogLayoutWithNoSSR {...props} />;
}