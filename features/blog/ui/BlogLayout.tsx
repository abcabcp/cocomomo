'use client';

import { PostForm } from "@/features/blog/ui";
import { cn } from "@/shared";
import { useSidebar } from "@/shared/lib/hooks";
import { Sidebar } from "@/shared/ui";
import dynamic from 'next/dynamic';
import { useRef, useState } from "react";
import { BlogTagList } from "./BlogTagList";

const BlogLayoutClientOnly = ({ children, modal }: { children: React.ReactNode, modal?: boolean }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { asidePanelWidth, setAsidePanelWidth, isSidebarOpen, setIsSidebarOpen } = useSidebar({ modal, sidebarWrapperRef: wrapperRef });

    return (
        <div ref={wrapperRef} className={cn('w-full h-full flex bg-gray-900', {
            'flex-col': !asidePanelWidth,
            'flex-row': asidePanelWidth
        })}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
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