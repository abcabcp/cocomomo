'use client';

import { useRef, useState } from "react";
import { BlogSidebar } from "./BlogSidebar";
import { Post } from "./Post";

export function Blog() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [asidePanelWidth, setAsidePanelWidth] = useState(200);

    return (
        <div ref={wrapperRef} className="w-full h-full flex border-gray-400 bg-gray-900">
            <BlogSidebar
                asidePanelWidth={asidePanelWidth}
                setAsidePanelWidth={setAsidePanelWidth}
                wrapperRef={wrapperRef}
            />
            <Post asidePanelWidth={asidePanelWidth} />
        </div>
    );
}