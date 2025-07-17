'use client';

import { useRef, useState } from "react";
import { cn, isMobileDevice } from "@/shared";
import { Sidebar } from "@/shared/ui";
import { useUserStore } from "@/shared/store";
import { CreatePost } from "@/features/blog/ui";

export function BlogLayout({ children, modal }: { children: React.ReactNode, modal?: boolean }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [asidePanelWidth, setAsidePanelWidth] = useState(200);
    const { user } = useUserStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    return (
        <div ref={wrapperRef} className={cn('w-full h-full flex border-gray-400 bg-gray-900', {
            'pt-6': !isMobileDevice() && !modal
        })}>
            <Sidebar
                asidePanelWidth={asidePanelWidth}
                setAsidePanelWidth={setAsidePanelWidth}
                wrapperRef={wrapperRef}
            >
                <div className="flex flex-col gap-2 p-2">
                    {user?.role === 'admin' && (
                        <button className="bg-white/10 border border-white/20 text-white py-2 rounded-lg transition-colors duration-200 cursor-pointer text-sm w-full" onClick={() => setIsCreateModalOpen(true)}>Create Post</button>
                    )}
                    <ul>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <li key={index}>menu{index + 1}</li>
                        ))}
                    </ul>
                </div>
            </Sidebar>
            {children}
            {isCreateModalOpen && <CreatePost modal onClose={() => setIsCreateModalOpen(false)} />}
        </div>)
}