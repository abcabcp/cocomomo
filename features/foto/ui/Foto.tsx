'use client';

import { InstagramFeed } from "./InstagramFeed";
import { cn, isMobileDevice } from "@/shared";

export function Foto() {
    return (
        <div className={cn('text-2xl font-bold p-5', {
            'pt-6': !isMobileDevice()
        })}>
            <InstagramFeed />
        </div>
    );
}