'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface HamburgerButtonProps {
    isOpen: boolean;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    lineClassName?: string;
}

export const HamburgerButton = ({
    isOpen = false,
    onClick,
    size = 'md',
    className,
    lineClassName,
}: HamburgerButtonProps) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    return (
        <button
            className={cn(
                'relative flex flex-col justify-center items-center cursor-pointer',
                sizeClasses[size],
                className
            )}
            onClick={onClick}
        >
            <div
                className={cn(
                    'absolute w-full h-[1px] bg-white rounded-full transition-all duration-300 ease-in-out',
                    isOpen
                        ? 'translate-y-0 rotate-45'
                        : size === 'sm' ? '-translate-y-1' : size === 'lg' ? '-translate-y-3' : '-translate-y-2',
                    lineClassName
                )}
            />
            <div
                className={cn(
                    'absolute w-full h-[1px] bg-white rounded-full transition-all duration-300 ease-in-out',
                    isOpen
                        ? 'opacity-0 translate-x-2'
                        : 'translate-y-0 opacity-100',
                    lineClassName
                )}
            />
            <div
                className={cn(
                    'absolute w-full h-[1px] bg-white rounded-full transition-all duration-300 ease-in-out',
                    isOpen
                        ? 'translate-y-0 -rotate-45'
                        : size === 'sm' ? 'translate-y-1' : size === 'lg' ? 'translate-y-3' : 'translate-y-2',
                    lineClassName
                )}
            />
        </button>
    );
};
