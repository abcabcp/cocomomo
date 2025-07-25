'use client';

import { RefObject, useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { useOutsideClick } from '@/shared/lib';

export type SlidePanelDirection = 'left' | 'right';

export interface SlidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    direction?: SlidePanelDirection;
    children: React.ReactNode;
    width?: number | string;
    hasOverlay?: boolean;
    className?: string;
    wrapperClassName?: string;
    animationDuration?: number;
    marginX?: number;
}

export function SlidePanel({
    isOpen,
    onClose,
    direction = 'right',
    children,
    width = 320,
    hasOverlay = true,
    className,
    wrapperClassName,
    animationDuration = 300,
    marginX = 0,
}: SlidePanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    useOutsideClick(panelRef as RefObject<HTMLElement>, () => {
        if (isOpen) onClose();
    }, isOpen);

    if (!isOpen) return null;

    return (
        <>
            {hasOverlay && (
                <div
                    className={cn(
                        'fixed inset-0 bg-black/50 z-40 transition-opacity',
                        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
                        wrapperClassName
                    )}
                    style={{ transitionDuration: `${animationDuration}ms` }}
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
            <div
                ref={panelRef}
                className={cn(
                    'fixed top-0 bottom-0 z-50 h-full flex flex-col bg-white shadow-lg',
                    'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform',
                    direction === 'left' ? `left-0` : `right-0`,
                    {
                        'translate-x-0': isOpen && marginX === 0,
                        'invisible': !isOpen && !hasOverlay,
                    },
                    className
                )}
                style={{
                    width: typeof width === 'number' ? `${width}px` : width,
                    ...(animationDuration !== 300 && {
                        transitionDuration: `${animationDuration}ms`
                    }),
                    ...(marginX > 0 && {
                        [direction === 'left' ? 'left' : 'right']: `${marginX}px`,
                        transform: !isOpen
                            ? `translateX(${direction === 'left'
                                ? `-calc(100% + ${marginX}px)`
                                : `calc(100% + ${marginX}px)`})`
                            : undefined
                    }),
                    ...(isOpen && marginX > 0 && {
                        transform: 'translateX(0)'
                    }),
                    ...(marginX === 0 && {
                        transform: direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)'
                    })
                }}
            >
                {children}
            </div>
        </>
    );
};