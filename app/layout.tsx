import { authOptions } from '@/shared/lib/configs/authOptions';
import ClientLayout from '@/widgets/layout/ClientLayout';
import type { Metadata, Viewport } from 'next';
import { getServerSession } from 'next-auth';
import { pretendardJP } from './fonts';
import './globals.css';

export const metadata: Metadata = {
    title: 'COCO MOMO',
    description: 'COCO MOMO',
    metadataBase: new URL('https://cocomomo.com'),
    other: {
        'preload': '/assets/svgs/load.svg'
    }
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default async function RootLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    return (
        <html lang="ko">
            <head>
                <link rel="preload" href="/assets/svgs/load.svg" as="image" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.performance.mark('app-start');
                        if ('caches' in window) {
                            caches.open('asset-cache');
                        }
                        `
                    }}
                />
            </head>
            <body
                className={`${pretendardJP.variable} antialiased w-dvw h-dvh`}
            >
                <ClientLayout session={session}>
                    {children}
                    {modal}
                </ClientLayout>
                <script
                    defer
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.addEventListener('load', () => {
                            setTimeout(() => {
                                window.performance.mark('app-loaded');
                                const navEntry = performance.getEntriesByType('navigation')[0];
                                const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0];
                                console.log('LCP:', lcpEntry ? lcpEntry.startTime / 1000 : 'Not available');
                            }, 0);
                        });
                        `
                    }}
                />
            </body>
        </html>
    );
}
