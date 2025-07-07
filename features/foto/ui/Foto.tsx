'use client';

import { InstagramFeed } from "./InstagramFeed";
import { cn, isMobileDevice } from "@/shared";

export function Foto({ modal }: { modal?: boolean }) {
    return (
        <div
            id="foto-scroll"
            className={cn('text-2xl font-bold p-5 overflow-y-auto', {
                'pt-6 h-[calc(100vh-120px)]': !isMobileDevice() && !modal,
                'h-fit': modal
            })}>
            <InstagramFeed modal />
        </div>
    );
}