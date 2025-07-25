export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

export const isClient = () => typeof window !== 'undefined';

export const getWindowSize = () =>
  isClient()
    ? {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    : { width: 1440, height: 900 };
