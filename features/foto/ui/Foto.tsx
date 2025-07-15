'use client';

import { InstagramFeed } from "./InstagramFeed";
import { cn, isMobileDevice } from "@/shared";
import { InstagramPost } from "../api";
import { useState } from "react";
import { InstagramFeedDetail } from "./InstagramFeedDetail";

export function Foto({ modal }: { modal?: boolean }) {
    const [selectedFeed, setSelectedFeed] = useState<InstagramPost>();
    const onSelectFeed = (feed: InstagramPost) => {
        setSelectedFeed(feed);
    };
    const onCloseFeed = () => {
        setSelectedFeed(undefined);
    };

    return (
        <>
            <div
                id="foto-scroll"
                className={cn('text-2xl font-bold p-5 overflow-y-auto', {
                    'pt-6 h-[calc(100vh-120px)]': !isMobileDevice() && !modal,
                    'h-fit': modal
                })}>
                <InstagramFeed modal onSelectFeed={onSelectFeed} onCloseFeed={onCloseFeed} />

            </div>
            {
                selectedFeed && (
                    <InstagramFeedDetail modal feed={selectedFeed} onClose={onCloseFeed} />
                )
            }
        </>
    );

}