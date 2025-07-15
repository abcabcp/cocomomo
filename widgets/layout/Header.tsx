'use client';

import { cn, isMobileDevice } from '@/shared';
import { useUserStore } from '@/shared/store';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { SubMenu } from './SubMenu';
import { TimePanel } from './TimePanel';

type HeaderProps = {
    visible: boolean;
};

export enum SUBMENU_STATE {
    NONE = -1,
    COCOMOMO = 0,
    HELP = 1,
}

export function Header({ visible }: HeaderProps) {
    const [dropdownState, setDropdownState] = useState<SUBMENU_STATE>(SUBMENU_STATE.NONE);
    const pathname = usePathname();
    const { user } = useUserStore();

    const handleDropdownClick = (target: SUBMENU_STATE) => {
        if (dropdownState === target) {
            return;
        }
        setDropdownState(target)
    };

    return (
        <header
            data-header="true"
            className={cn(
                "fixed top-0 left-0 right-0 w-full bg-black flex justify-between items-center text-sm font-bold px-4 z-30",
                "transition-transform duration-300 ease-in-out",
                isMobileDevice()
                    ? (!visible ? "transform -translate-y-full" : "transform translate-y-0")
                    : "",
                pathname === '/' && "lg:transform-none",
            )}
        >
            <div className='flex gap-x-2 items-center text-gray-100'>
                <button
                    className='cursor-pointer'
                    onClick={() => handleDropdownClick(SUBMENU_STATE.COCOMOMO)}
                    onMouseEnter={() => {
                        if (dropdownState === SUBMENU_STATE.HELP) {
                            setDropdownState(SUBMENU_STATE.COCOMOMO)
                        }
                    }}
                >
                    <Image src="/assets/svgs/logo.svg" alt="logo" width={24} height={24} />
                    <h1 className='sr-only'>COCOMOMO</h1>
                </button>
                <button
                    className='cursor-pointer'
                    onClick={() => handleDropdownClick(SUBMENU_STATE.HELP)}
                    onMouseEnter={() => {
                        if (dropdownState === SUBMENU_STATE.COCOMOMO) {
                            setDropdownState(SUBMENU_STATE.HELP)
                        }
                    }}
                >
                    도움말
                </button>
                {dropdownState !== SUBMENU_STATE.NONE &&
                    <SubMenu
                        dropdownState={dropdownState}
                        handleDropdownClick={handleDropdownClick}
                    />}
            </div>
            <ul className='flex gap-x-2 text-white items-center'>
                {user?.name && (
                    <li className='flex items-center gap-x-2'>
                        <div className='bg-yellow-500 text-white rounded-md text-xs px-2'>{user?.name}</div>
                        {user?.role === 'ADMIN' && (
                            <p className='bg-blue-500 text-white rounded-md text-xs px-2'>
                                Admin
                            </p>
                        )}
                    </li>
                )}
                <li className='flex items-center'>
                    <SearchBar />
                </li>
                <li className='cursor-pointer'>
                    <TimePanel />
                </li>
            </ul>
        </header >
    );
}