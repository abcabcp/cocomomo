'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef, useState } from 'react';
import { useGetInstagramFeedInfinite } from '../api';

export function useInstagramFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetInstagramFeedInfinite();
  const rowHeightRef = useRef<number>(300);
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const posts = data?.pages.flatMap((page) => page.data) || [];

  const getInitialViewCount = () => {
    if (typeof window === 'undefined') return 3;
    return window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4;
  };

  const [viewCount, setViewCount] = useState(getInitialViewCount());

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(posts.length / viewCount),
    estimateSize: () => rowHeightRef.current,
    overscan: 5,
    getScrollElement: () => scrollRef.current,
    getItemKey: (index) => index,
  });

  const measureRowHeight = (element: HTMLElement | null) => {
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const index = Number(element.dataset.index) ?? 0;
      const gridItemWidth = entry.contentRect.width / viewCount;
      const height = gridItemWidth;
      if (rowHeightRef.current !== height) {
        rowHeightRef.current = height;
        rowVirtualizer.resizeItem(index, height);
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  };

  useEffect(() => {
    rowVirtualizer.measure();
  }, [posts.length, rowVirtualizer]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setViewCount(getInitialViewCount());
      rowVirtualizer.measure();
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetching) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, fetchNextPage]);

  return {
    rowVirtualizer,
    measureRowHeight,
    scrollRef,
    observerRef,
    posts,
    viewCount,
    setViewCount,
    isFetching,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
  };
}
