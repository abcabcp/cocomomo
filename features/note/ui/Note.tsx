'use client';

import { useRef, useState } from "react";
import { cn, isMobileDevice, Sidebar } from "@/shared";

export function Note({ modal }: { modal?: boolean }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [asidePanelWidth, setAsidePanelWidth] = useState(200);

    return (
        <div ref={wrapperRef} className={cn('w-full h-full flex border-gray-400 bg-gray-900', {
            'pt-6': !isMobileDevice() && !modal
        })}>
            <Sidebar
                asidePanelWidth={asidePanelWidth}
                setAsidePanelWidth={setAsidePanelWidth}
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