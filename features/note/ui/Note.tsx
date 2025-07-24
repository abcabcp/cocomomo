'use client';

import { Sidebar, cn, isMobileDevice } from "@/shared";
import { useSidebar } from "@/shared/lib/hooks";
import { useRef } from "react";

export function Note({ modal }: { modal?: boolean }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { asidePanelWidth, setAsidePanelWidth, isSidebarOpen, setIsSidebarOpen } = useSidebar({ modal, sidebarWrapperRef: wrapperRef });

    return (
        <div ref={wrapperRef} className={cn('w-full h-full flex border-gray-400 bg-gray-900', {
            'pt-6': !isMobileDevice() && !modal
        })}>
            <Sidebar
                asidePanelWidth={asidePanelWidth}
                setAsidePanelWidth={setAsidePanelWidth}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                wrapperRef={wrapperRef}
            >
                <div>
                </div>
            </Sidebar>
            <article className={`h-full`} style={{ width: `calc(100% - ${asidePanelWidth}px)` }}>
                Contents 위치
            </article>
        </div>
    );
}