import type { Metadata } from 'next';
import './globals.css';
import { pretendardJP } from './fonts';
import ClientLayout from '@/widgets/layout/ClientLayout'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/lib/configs/authOptions';

export const metadata: Metadata = {
    title: 'COCO MOMO',
    description: 'COCO MOMO',
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
        <html lang="en">
            <body
                className={`${pretendardJP.variable} antialiased w-dvw h-dvh`}
            >
                <ClientLayout session={session}>
                    {children}
                    {modal}
                </ClientLayout>
            </body>
        </html >
    );
}
