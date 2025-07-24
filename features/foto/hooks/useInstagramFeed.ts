'use client';

import { debounce } from '@/shared';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { InstagramPost, useGetInstagramFeedInfinite } from '../api';
import { useModalStore } from '@/shared/store';

export function useInstagramFeed(modal?: boolean) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetInstagramFeedInfinite();
  const { size } = useModalStore();
  const [selectedFeed, setSelectedFeed] = useState<InstagramPost>();

  const rowHeightRef = useRef<number>(500);
  const posts = data?.pages.flatMap((page) => page.data) || [];
  const currentPage = data?.pages.at(-1)?.nextCursor;

  const getInitialViewCount = () => {
    if (typeof window === 'undefined') return 4;
    const width = modal ? size.width : window.innerWidth;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
  };

  const viewCount = useMemo(
    () => getInitialViewCount(),
    [modal, size, window?.innerWidth],
  );

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(posts.length / viewCount),
    estimateSize: () => rowHeightRef.current,
    overscan: 2,
    getScrollElement: () => document.getElementById('foto-scroll'),
    getItemKey: (index) => index,
  });

  const measureRowHeight = (element: HTMLElement | null) => {
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const height = entry.contentRect.height + 20;

      if (rowHeightRef.current !== height) {
        rowHeightRef.current = height;
        rowVirtualizer.measure();
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  };

  const onSelectFeed = (feed: InstagramPost) => {
    setSelectedFeed(feed);
  };

  const onCloseFeed = () => {
    setSelectedFeed(undefined);
  };

  useLayoutEffect(() => {
    const handleResize = debounce(() => {
      rowVirtualizer.measure();
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rowVirtualizer]);

  useEffect(() => {
    const lastRow = rowVirtualizer.getVirtualItems().at(-1);
    if (!lastRow || !hasNextPage || isFetchingNextPage) return;

    const totalRows = Math.ceil(posts.length / viewCount);
    const isLastRowVisible = lastRow.index >= totalRows - 1;

    if (isLastRowVisible) {
      fetchNextPage();
    }
  }, [
    rowVirtualizer.getVirtualItems(),
    posts.length,
    viewCount,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    currentPage,
  ]);

  return {
    rowVirtualizer,
    measureRowHeight,
    posts,
    viewCount,
    isFetching,
    isLoading,
    isError,
    error,
    fetchNextPage,
    onSelectFeed,
    onCloseFeed,
    selectedFeed,
  };
}
