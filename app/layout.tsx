import { authOptions } from '@/shared/lib/configs/authOptions';
import ClientLayout from '@/widgets/layout/ClientLayout';
import type { Metadata, Viewport } from 'next';
import { getServerSession } from 'next-auth';
import { pretendardJP } from './fonts';
import './globals.css';
import { ViewTransitions } from 'next-view-transitions';

export const metadata: Metadata = {
    title: 'COCO MOMO',
    description: 'COCO MOMO',
    metadataBase: new URL('https://cocomomo.com'),
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
        <ViewTransitions>
            <html lang="ko">
                <head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                        try {
                            window.performance.mark('app-start');
                            if ('caches' in window) {
                                caches.open('asset-cache');
                            }
                        } catch (e) {
                            console.log('Error in performance measurement');
                        }
                        `
                        }}
                    />
                </head>
                <body
                    className={`${pretendardJP.className} w-dvw h-dvh`}
                >
                    <ClientLayout session={session}>
                        {children}
                        {modal}
                    </ClientLayout>
                </body>
            </html>
        </ViewTransitions>
    );
}
