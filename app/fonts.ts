import localFont from 'next/font/local';

export const pretendardJP = localFont({
  src: [
    {
      path: './fonts/PretendardJP-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/PretendardJP-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-pretendard-jp',
});
