'use client';

import { useEffect, useRef, useState } from 'react';

export function useSearch() {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = () => {
    setIsOpen(true);
  };

  const closeSearch = () => {
    inputRef.current?.blur();
    setInputValue('');
    setIsOpen(false);
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      alert(`${inputValue} 검색은 개발중 ~`);
      closeSearch();
    }
  };

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

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const useOutsideClickDetection = (
    contentRef: React.RefObject<HTMLElement>,
  ) => {
    useEffect(() => {
      if (isOpen) {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            contentRef.current &&
            !contentRef.current.contains(event.target as Node)
          ) {
            closeSearch();
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [isOpen, contentRef]);
  };

  return {
    inputValue,
    setInputValue,
    isOpen,
    openSearch,
    closeSearch,
    handleSearch,
    inputRef,
    useOutsideClickDetection,
  };
}
