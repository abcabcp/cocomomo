import Image from 'next/image';

export function Header() {
    return (
        <header className="w-full bg-white/80 flex justify-between items-center text-sm">
            <div className='flex gap-x-2 items-center text-black'>
                <h1>
                    <Image src="/assets/svgs/logo.svg" alt="logo" width={24} height={24} />
                    <span className='sr-only'>COCOMOMO</span>
                </h1>
                <ul className='flex gap-x-2'>
                    <li><button>이동</button></li>
                    <li><button>터미널</button></li>
                    <li><button>도움말</button></li>
                </ul>
            </div>
            <ul className='flex gap-x-2 text-black'>
                <li><button>Lang</button></li>
                <li><button>Search</button></li>
                <li><button>Time</button></li>
            </ul>
        </header>
    )
}