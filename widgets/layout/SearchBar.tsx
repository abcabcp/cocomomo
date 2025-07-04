'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function SearchBar() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSearchClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(true);
    };

    const onClose = () => {
        inputRef.current?.blur();
        setInputValue('');
        setIsOpen(false);
    };

    // TODO: timePanel dim이 header 영역 가리는 부분 수정 후 클릭 문제 해결
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSearch = () => {
        if (inputValue.trim()) {
            alert(`${inputValue} 검색은 개발중 ~`);
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleGlobalKeyDown = (e: KeyboardEvent) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
                    e.preventDefault();
                    setIsOpen(true);
                }
            };

            window.addEventListener('keydown', handleGlobalKeyDown);
            return () => window.removeEventListener('keydown', handleGlobalKeyDown);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && isOpen) {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };

            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    return (
        <>
            <button className='cursor-pointer text-white' onClick={handleSearchClick}>
                Search
            </button>
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 flex justify-center items-start pt-[calc(30vh)]"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 shadow-lg relative">
                        <input
                            type="search"
                            ref={inputRef}
                            className="w-full p-4 pl-12 text-lg outline-none rounded-3xl"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="COCOMOMO Search"
                        />
                        <button onClick={handleSearch}>
                            <Image
                                src="/assets/svgs/search.svg"
                                alt="search"
                                width={24}
                                height={24}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                            />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}