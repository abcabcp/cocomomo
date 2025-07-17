'use client';

import React from 'react';
import { icons, IconType } from './icons';

interface IconProps {
    name: IconType;
    size?: number;
    color?: string;
    className?: string;
    onClick?: () => void;
}

export const Icon = ({
    name,
    size = 24,
    color,
    className,
    onClick,
}: IconProps) => {
    const icon = icons[name];

    if (!icon) return null;

    const { attr, asset } = icon;

    return (
        <svg
            width={size}
            height={size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            onClick={onClick}
            {...attr}
            color={color}
        >
            <title>{icon.title}</title>
            {asset}
        </svg>
    );
};
