'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn, isMobileDevice } from '@/shared';
import { TimePanel } from './TimePanel';
import { SearchBar } from './SearchBar';

type HeaderProps = {
    visible: boolean;
};

export function Header({ visible }: HeaderProps) {
    const pathname = usePathname();

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 w-full bg-white/80 flex justify-between items-center text-sm px-4 z-30",
                "transition-transform duration-300 ease-in-out",
                isMobileDevice()
                    ? (!visible ? "transform -translate-y-full" : "transform translate-y-0")
                    : "",
                pathname === '/' && "lg:transform-none"
            )}
        >
            <div className='flex gap-x-2 items-center text-black'>
                <h1 className='cursor-pointer'>
                    <Link href="/">
                        <Image src="/assets/svgs/logo.svg" alt="logo" width={24} height={24} />
                        <span className='sr-only'>COCOMOMO</span>
                    </Link>
                </h1>
                <ul className='flex gap-x-2'>
                    <li><button>도움말</button></li>
                </ul>
            </div>
            <ul className='flex gap-x-2 text-black items-center'>
                <li>
                    Lang
                </li>
                <li className='flex items-center'>
                    <SearchBar />
                </li>
                <li className='cursor-pointer'>
                    <TimePanel />
                </li>
            </ul>
        </header>
    );
}