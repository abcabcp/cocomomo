import localFont from 'next/font/local';

export const pretendardJP = localFont({
  src: [
    {
      path: '../public/assets/fonts/PretendardJP-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/assets/fonts/PretendardJP-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard-jp',
});
