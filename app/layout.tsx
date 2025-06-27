import type { Metadata } from 'next';
import './globals.css';
import { Dock, Header } from '@/widgets/layout';
import { pretendardJP } from './fonts';

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
        <Header />
        {children}
        <Dock />
      </body>
    </html >
  );
}
