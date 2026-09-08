import type { Metadata, Viewport } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { pretendardJP } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'cocomomo — interactive lab',
  description: 'Interactive experiments with shaders and 3D.',
  metadataBase: new URL('https://coco-momo.com'),
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="ko">
        <body
          className={`${pretendardJP.className} h-dvh w-dvw overflow-hidden bg-[#0a0a0a] text-white antialiased`}
        >
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}
