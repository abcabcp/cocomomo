'use client';

import { AuthProvider, isMobileDevice } from '@/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dock } from './Dock';
import { Header } from './Header';
import ToastMessage from '@/shared/ui/toast/ToastMessage';
import { useSelectedLayoutSegment } from 'next/navigation'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

export default function ClientLayout({ children, session }: { children: React.ReactNode, session: Session | null }) {
    const [isNavVisible, setIsNavVisible] = useState(!isMobileDevice());
    const pathname = usePathname();
    const isHome = pathname === '/'
    const segment = useSelectedLayoutSegment()

    useEffect(() => {
        if (isHome || typeof window === 'undefined' || !isMobileDevice()) return;

        let startY = 0;
        let lastY = 0;
        let touchStartTime = 0;

        const handleTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
            lastY = startY;
            touchStartTime = Date.now();
        };

        const handleTouchMove = (e: TouchEvent) => {
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - lastY;
            lastY = currentY;

            const minSwipeDownDistance = 8;
            if (deltaY > minSwipeDownDistance) {
                setIsNavVisible(true);
                return;
            }
        };

        const handleTouchEnd = () => {
            startY = 0;
            lastY = 0;
        };

        const handleClick = (e: MouseEvent) => {
            if (!isNavVisible) return;

            const target = e.target as HTMLElement;
            const isDockArea = target.closest('[data-dock]');

            if (!isDockArea) {
                setIsNavVisible(false);
            }
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('click', handleClick);
        };
    }, [isNavVisible, isHome]);

    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <div className="w-full h-full relative bg-black">
                        <Header />
                        <main className="w-full h-full pt-6">
                            {children}
                            <ToastMessage />
                        </main>
                        <ReactQueryDevtools />
                        <Dock visible={isHome || (isMobileDevice() ? isNavVisible : true)} segment={segment} />
                    </div>
                </AuthProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}   