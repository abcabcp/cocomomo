'use client';

import { dockMenuItems } from '@/entities';
import { openModalAnimation, useOutsideClick } from '@/shared';
import { useTransitionRouter } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';

export function useSearch() {
  const router = useTransitionRouter();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isBlogPath = pathname.includes('/blog');

  const filteredItems = useMemo(() => {
    if (!inputValue || isBlogPath) return [];
    return dockMenuItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.link.toLowerCase().includes(inputValue.toLowerCase()),
      )
      .sort((a, b) => {
        const aStartsWith = a.title
          .toLowerCase()
          .startsWith(inputValue.toLowerCase());
        const bStartsWith = b.title
          .toLowerCase()
          .startsWith(inputValue.toLowerCase());

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return 0;
      });
  }, [inputValue, isBlogPath]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Tab' && filteredItems.length > 0) {
      e.preventDefault();
      setInputValue(filteredItems[0].title);
      setSelectedIndex(0);
    }
  };

  const openSearch = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const closeSearch = () => {
    setIsOpen(false);
    setInputValue('');
    setSelectedIndex(0);
  };

  const handleSearch = () => {
    if (!isBlogPath) {
      if (filteredItems.length === 0) {
        return;
      }
      if (filteredItems[selectedIndex].link === pathname) {
        closeSearch();
        return;
      }
      router.push(filteredItems[selectedIndex].link, {
        onTransitionReady: openModalAnimation,
        scroll: false,
      });
    } else {
      alert('blog search ing');
    }
    closeSearch();
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (isOpen && e.key === 'Escape') {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useOutsideClick(
    inputWrapperRef as RefObject<HTMLElement>,
    () => {
      if (isOpen) closeSearch();
    },
    isOpen,
  );

  return {
    inputValue,
    inputWrapperRef,
    setInputValue,
    isOpen,
    openSearch,
    closeSearch,
    handleSearch,
    inputRef,
    filteredItems,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    isBlogPath,
  };
}
