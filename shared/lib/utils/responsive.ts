'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export const SCREENS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

type ScreenType = keyof typeof SCREENS;

export const useScreenSize = (
  screenType: ScreenType,
  type: 'max' | 'min' = 'max',
) => {
  const [mounted, setMounted] = useState(false);
  const width = SCREENS[screenType];
  const result = useMediaQuery({
    [`${type}Width`]: width,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? result : false;
};

export const useSSRMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener('change', updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => {
      media.removeEventListener('change', updateTarget);
    };
  }, [updateTarget, width]);

  return targetReached;
};

export const useIsMobile = () => {
  return useMediaQuery({
    maxWidth: SCREENS.md,
  });
};

export const useIsLaptop = () => {
  return useMediaQuery({
    minWidth: SCREENS.md,
    maxWidth: SCREENS.xl,
  });
};

export const useMaxWidthMobile = () => useScreenSize('sm');
export const useMaxWidthTablet = () => useScreenSize('md');
export const useMaxWidthLaptop = () => useScreenSize('lg');
export const useMaxWidthDesktop = () => useScreenSize('xl', 'min');

export const useIsMobileDevice = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const userAgent = navigator?.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    setIsMobileDevice(mobileRegex.test(userAgent));
  }, []);

  return isMobileDevice;
};
