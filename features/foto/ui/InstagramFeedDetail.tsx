'use client';

import { cn } from "@/shared";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { InstagramPost } from "../api";
import { Comments } from "./Comments";

export function InstagramFeedDetail({ modal, feed, onClose }: { modal?: boolean, feed: InstagramPost, onClose: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            onClose();
        }, 100);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={cn('absolute top-0 left-0 w-full h-full backdrop-blur-md rounded-2xl overflow-y-auto md:overflow-y-hidden', {
            'pt-9': modal,
        })}>
            <div className={cn(
                "flex flex-col md:flex-col-reverse md:justify-between w-full h-full px-2 md:px-4",
                "transition-all delay-10 duration-300",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
                <div className="flex justify-between items-center w-full gap-x-3 mt-10 my-5 md:my-5">
                    <Link href={feed.permalink} target="_blank" className="bg-white/10 hover:bg-white/20 md:bg-black/40 md:hover:bg-black/20 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer text-sm flex items-center justify-center gap-2 w-full border border-gray-400">
                        Instagram
                        <Image src="/assets/svgs/instagram.svg" alt="instagram" width={24} height={24} />
                    </Link>
                    <button
                        onClick={handleClose}
                        className="bg-white/10 hover:bg-white/20 md:bg-black/40 md:hover:bg-black/20 text-white px-4 py-[10px] rounded-lg transition-colors duration-200 cursor-pointer text-sm w-full border border-gray-400"
                    >
                        Closed
                    </button>

                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col w-full">
                        <div className={cn("relative w-full", {
                            'pb-[100%]': isVideoLoading || feed.media_type !== 'VIDEO'
                        })}>
                            {feed.media_type === 'VIDEO' && (
                                <>
                                    {isVideoLoading && (
                                        <div className="absolute inset-0 w-full h-full bg-gray-500 animate-pulse flex items-center justify-center" />
                                    )}
                                    <video
                                        src={feed.media_url}
                                        controls
                                        autoPlay
                                        muted
                                        className="object-cover w-full h-full"
                                        onLoadStart={() => setIsVideoLoading(true)}
                                        onCanPlay={() => setIsVideoLoading(false)}
                                        style={{ display: isVideoLoading ? 'none' : 'block' }}
                                    />
                                </>
                            )}
                            {(feed.media_type !== 'VIDEO' && (
                                <Image src={feed.media_url} alt={feed.caption} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                            ))}
                        </div>

                    </div>
                    <div className="w-full">
                        <div className="w-full flex justify-between items-start bg-white/10 md:bg-black/40 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm">
                            <p className="text-white text-sm whitespace-pre-line">{feed.caption}</p>
                        </div>
                        <Comments />
                    </div>
                </div>

            </div>
        </div>
    );
}