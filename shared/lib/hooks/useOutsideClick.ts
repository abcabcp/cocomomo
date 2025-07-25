'use client';

import { RefObject, useEffect } from 'react';

export function useOutsideClick(
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void,
  isActive = true,
  additionalCheck?: (event: MouseEvent) => boolean,
) {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (!additionalCheck || additionalCheck(event)) {
          handler(event);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler, isActive, additionalCheck]);
}
