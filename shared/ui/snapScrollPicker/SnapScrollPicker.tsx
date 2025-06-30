import { cn } from '@/shared';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SnapScrollPickerProps {
  className?: string;
  pointerClassName?: string;
  items: (number | string)[];
  selectedValue: number | string;
  onSelect: (value: number | string) => void;
  itemHeight?: number;
  formatValue?: (value: number | string) => string;
}

export default function SnapScrollPicker({
  className,
  pointerClassName,
  items,
  selectedValue,
  onSelect,
  itemHeight = 60,
  formatValue = (val) => val.toString().padStart(2, '0'),
}: SnapScrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const visibleItemCount = 5;

  const paddingTop = Math.floor(visibleItemCount / 2) * itemHeight;
  const paddingBottom =
    (visibleItemCount - Math.ceil(visibleItemCount / 2)) * itemHeight;
  const lastScrollTop = useRef<number>(0);

  const handleScrollEnd = useCallback(() => {
    if (!containerRef.current || scrolling) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;

    const scrollDirection = scrollTop > lastScrollTop.current ? 'down' : 'up';
    lastScrollTop.current = scrollTop;

    const rawIndex = scrollTop / itemHeight;
    let safeIndex: number;

    if (scrollDirection === 'down') {
      safeIndex = Math.min(items.length - 1, Math.ceil(rawIndex * 2) / 2);
    } else {
      safeIndex = Math.max(0, Math.floor(rawIndex * 2) / 2);
    }

    safeIndex = Math.round(safeIndex);
    const newValue = items[safeIndex];

    if (newValue !== selectedValue) {
      onSelect(newValue);
      snapToItem(safeIndex);
    }
  }, [itemHeight, items, selectedValue, onSelect, scrolling]);

  const snapToItem = useCallback(
    (index: number) => {
      if (!containerRef.current) return;

      setScrolling(true);
      const targetScroll = index * itemHeight;

      containerRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });

      setTimeout(() => setScrolling(false), 300);
    },
    [itemHeight],
  );

  const handleTouchMove = useCallback(() => {
    setScrolling(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setScrolling(false);
    handleScrollEnd();
  }, [handleScrollEnd, setScrolling]);

  useEffect(() => {
    if (selectedValue) {
      const index = items.indexOf(selectedValue);
      if (index !== -1) {
        snapToItem(index);
      }
    }
  }, [selectedValue, items, snapToItem]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      clearTimeout(scrollTimeout.current as NodeJS.Timeout);
      scrollTimeout.current = setTimeout(() => {
        handleScrollEnd();
      }, 100);
    };

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      clearTimeout(scrollTimeout.current as NodeJS.Timeout);
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleScrollEnd]);

  return (
    <div className={cn('relative h-[300px] overflow-hidden', className)}>
      <div
        className={cn(
          'absolute pointer-events-none top-[120px] left-0 right-0 h-[60px] z-3 bg-lightgray',
          pointerClassName,
        )}
      />
      <div
        ref={containerRef}
        className="h-full overflow-auto scroll-smooth [&::-webkit-scrollbar]:hidden relative z-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div style={{ height: paddingTop }} />
        {items.map((item, idx) => (
          <div
            key={`${item}-${idx}`}
            className={cn(
              'h-[60px] flex items-center justify-center w-full text-center text-2xl cursor-pointer',
              { 'text-black': item === selectedValue },
              { 'text-gray-300': item !== selectedValue },
            )}
            onClick={() => {
              const actualIndex = items.indexOf(item);
              if (actualIndex !== -1) {
                snapToItem(actualIndex);
                onSelect(item);
              }
            }}
          >
            {formatValue ? formatValue(item) : item}
          </div>
        ))}

        <div style={{ height: paddingBottom }} />
      </div>
    </div>
  );
}
