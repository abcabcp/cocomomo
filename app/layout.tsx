import type { Metadata } from 'next';
import './globals.css';
import { pretendardJP } from './fonts';
import ClientLayout from '@/widgets/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'COCO MOMO',
  description: 'COCO MOMO',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pretendardJP.variable} antialiased w-dvw h-dvh`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html >
  );
}
