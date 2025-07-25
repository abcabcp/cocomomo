'use client';

import { useSSRMediaQuery } from '@/shared/lib/utils';
import { useModalStore } from '@/shared/store';
import { useEffect, useState } from 'react';

const SIDEBAR_CONSTANTS = {
  DEFAULT_WIDTH: 200,
  MIN_WIDTH: 48,
  MAX_WIDTH: 280,
  BREAK_WIDTH: 768,
};

export function useSidebar({
  modal,
  sidebarWrapperRef,
}: {
  modal?: boolean;
  sidebarWrapperRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isMdScreen = useSSRMediaQuery(SIDEBAR_CONSTANTS.BREAK_WIDTH);
  const { size } = useModalStore();
  const [asidePanelWidth, setAsidePanelWidth] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= SIDEBAR_CONSTANTS.BREAK_WIDTH ||
        size.width < SIDEBAR_CONSTANTS.BREAK_WIDTH
        ? null
        : SIDEBAR_CONSTANTS.DEFAULT_WIDTH;
    }
    return null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
    asidePanelWidth ? asidePanelWidth > SIDEBAR_CONSTANTS.MIN_WIDTH : false,
  );

  const toggleSidebar = () => {
    if (asidePanelWidth !== null) {
      if (isSidebarOpen) {
        setAsidePanelWidth(48);
      } else {
        setAsidePanelWidth(280);
      }
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleResizeAsidePanel = (e: React.MouseEvent) => {
    if (!asidePanelWidth) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = asidePanelWidth;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarWrapperRef.current) return;
      const newWidth = startWidth + (e.clientX - startX);
      setAsidePanelWidth(
        Math.max(
          200,
          Math.min(newWidth, sidebarWrapperRef.current.offsetWidth / 2),
        ),
      );
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (isMdScreen || (modal && size.width < SIDEBAR_CONSTANTS.BREAK_WIDTH)) {
      setAsidePanelWidth(null);
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
      setAsidePanelWidth(SIDEBAR_CONSTANTS.DEFAULT_WIDTH);
    }
  }, [isMdScreen, modal, size]);

  return {
    asidePanelWidth,
    setAsidePanelWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    handleResizeAsidePanel,
    isMdScreen,
  };
}
