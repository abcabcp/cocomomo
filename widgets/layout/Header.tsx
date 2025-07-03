import Image from 'next/image';
import Link from 'next/link';
import { TimePanel } from './TimePanel';
import { SearchBar } from './SearchBar';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-30 w-full bg-white/80 flex justify-between items-center text-sm px-4">
            <div className='flex gap-x-2 items-center text-black'>
                <h1>
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
    )
}