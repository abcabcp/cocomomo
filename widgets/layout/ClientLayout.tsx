'use client';

import { Header } from "./Header";
import { Dock } from "./Dock";
import { useCurrentTimeStore } from '@/shared/store';
import { useEffect } from 'react';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});




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
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools />
            </QueryClientProvider>
            <Dock />
        </div>
    );
}