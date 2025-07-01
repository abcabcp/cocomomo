'use client';

import { Header } from "./Header";
import { Dock } from "./Dock";
import { useCurrentTimeStore } from '@/shared/store';
import { useEffect } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const { updateTimeByDifference } = useCurrentTimeStore();

    useEffect(() => {
        updateTimeByDifference();

        const interval = setInterval(() => {
            updateTimeByDifference();
        }, 1000);

        return () => clearInterval(interval);
    }, [updateTimeByDifference]);


    return (
        <div className="w-full h-full relative">
            <Header />
            {children}
            <Dock />
        </div>
    );
}   