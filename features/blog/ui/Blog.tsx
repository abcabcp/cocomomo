'use client';

import { useRef, useState } from "react";
import { Post } from "./Post";
import { cn, isMobileDevice, Sidebar } from "@/shared";

export function Blog({ modal }: { modal?: boolean }) {
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
                <ul>
                    <li>menu1</li>
                    <li>menu2</li>
                    <li>menu3</li>
                </ul>
            </Sidebar>
            <Post asidePanelWidth={asidePanelWidth} />

        </div>
    );
}