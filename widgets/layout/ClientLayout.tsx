'use client';

import { isMobileDevice } from '@/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dock } from './Dock';
import { Header } from './Header';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});
export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [headerVisible, setHeaderVisible] = useState(!isMobileDevice());
    const [dockVisible, setDockVisible] = useState(!isMobileDevice());
    const pathname = usePathname();
    const isHome = pathname === '/';


    useEffect(() => {
        if (isHome || typeof window === 'undefined' || !isMobileDevice()) return;

        let startY = 0;
        let lastY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
            lastY = startY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - lastY;
            lastY = currentY;

            if (startY < 100 && deltaY > 10 && !headerVisible) {
                setHeaderVisible(true);
            }
            else if (startY > window.innerHeight * 2 / 3 && deltaY < -10 && !dockVisible) {
                setDockVisible(true);
            }
            else if (deltaY < -10 && headerVisible) {
                setHeaderVisible(false);
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchTarget = e.target as HTMLElement;
            const isHeaderArea = touchTarget.closest('header');
            const isDockArea = touchTarget.closest('[data-dock]');

            if (!isHeaderArea && startY < 100 && headerVisible && Math.abs(lastY - startY) < 5) {
                setHeaderVisible(false);
            }
            if (!isDockArea && dockVisible) {
                setDockVisible(false);
            }
            startY = 0;
            lastY = 0;
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [headerVisible, isHome]);

    return (
        <div className="w-full h-full relative">
            <Header visible={isHome || (isMobileDevice() ? headerVisible : true)} />
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools />
            </QueryClientProvider>
            <Dock visible={isHome || (isMobileDevice() ? dockVisible : true)} />
        </div>
    );
}   