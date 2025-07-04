import type { Metadata } from 'next';
import './globals.css';
import { pretendardJP } from './fonts';
import ClientLayout from '@/widgets/layout/ClientLayout';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
    title: 'COCO MOMO',
    description: 'COCO MOMO',
};

export default function RootLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${pretendardJP.variable} antialiased w-dvw h-dvh`}
            >
                <SessionProvider>
                    <ClientLayout>
                        {children}
                        {modal}
                    </ClientLayout>
                </SessionProvider>
            </body>
        </html>
    );
}
