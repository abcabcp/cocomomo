import { cva } from 'class-variance-authority';
import { useCallback, useEffect, useRef, useState } from 'react';

export type PickerStyleType = 'normal' | 'primary';

const containerStyles = cva(
  'relative overflow-hidden',
  {
    variants: {
      styleType: {
        normal: 'h-[300px]',
        primary: 'h-[180px] lg:h-[300px]',
      },
    },
    defaultVariants: {
      styleType: 'normal',
    },
  }
);

const pointerStyles = cva(
  'absolute pointer-events-none left-0 right-0 z-3 bg-lightgray',
  {
    variants: {
      styleType: {
        normal: 'h-[60px] top-[120px] ',
        primary: 'h-[60px] top-[60px] lg:top-[120px] text-white font-medium bg-white/10 backdrop-filter',
      },
    },
    defaultVariants: {
      styleType: 'normal',
    },
  }
);

const itemStyles = cva(
  'flex items-center justify-center w-full text-center text-xl lg:text-2xl cursor-pointer',
  {
    variants: {
      styleType: {
        normal: 'h-[60px]',
        primary: '',
      },
      isSelected: {
        true: 'text-black',
        false: 'text-gray-400',
      },
    },
    compoundVariants: [
      {
        styleType: 'primary',
        isSelected: true,
        className: 'text-white text-scale-110 transition-all duration-200 text-xl lg:text-4xl font-extrabold tracking-wide h-[60px] text-shadow-lg drop-shadow-md',
      },
      {
        styleType: 'primary',
        isSelected: false,
        className: 'transition-all duration-200 opacity-70 h-[60px] ',
      }
    ],
    defaultVariants: {
      styleType: 'normal',
      isSelected: false,
    },
  }
);

interface SnapScrollPickerProps {
  className?: string;
  pointerClassName?: string;
  items: (number | string)[];
  selectedValue: number | string;
  onSelect: (value: number | string) => void;
  itemHeight?: number;
  formatValue?: (value: number | string) => string;
  styleType?: PickerStyleType;
}

export default function SnapScrollPicker({
  className,
  pointerClassName,
  items,
  selectedValue,
  onSelect,
  itemHeight = 60,
  formatValue = (val) => val.toString().padStart(2, '0'),
  styleType = 'normal',
}: SnapScrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const [visibleItemCount, setVisibleItemCount] = useState(5);

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
    if (styleType === 'primary') {
      const handleResize = () => {
        setVisibleItemCount(window.innerWidth >= 1024 ? 5 : 3);
      };

      handleResize(); // 초기값 설정
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [styleType]);

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
    <div className={containerStyles({ styleType, className })}>
      <div
        className={pointerStyles({ styleType, className: pointerClassName })}
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
            className={itemStyles({
              styleType,
              isSelected: item === selectedValue
            })}
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
