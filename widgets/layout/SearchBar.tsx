'use client';

import { Icon, useOutsideClick } from "@/shared";
import { MouseEvent, RefObject, useRef } from "react";
import { useSearch } from "./hooks";


function SearchButton({ onClick }: { onClick: (e: MouseEvent) => void }) {
    return (
        <button
            className='cursor-pointer text-gray-200 flex items-center gap-1 bg-gray-800 rounded-full px-2 text-xs'
            onClick={onClick}
        >
            Search
            <Icon name="command" size={12} />
            <p className="text-gray-200 text-[12px]">K</p>
        </button>
    );
}

function SearchModal({
    isOpen,
    onClose,
    inputRef,
    inputValue,
    setInputValue,
    handleSearch
}: {
    isOpen: boolean;
    onClose: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSearch: () => void;
}) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputWrapperRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    useOutsideClick(inputWrapperRef as RefObject<HTMLElement>, () => {
        if (isOpen) onClose();
    }, isOpen);

    if (!isOpen) return null;

    return (
        <div
            ref={wrapperRef}
            className="fixed inset-0 top-6 z-30 flex justify-center items-start pt-[calc(30vh)]"
            onClick={(e) => {
                if (e.target === wrapperRef.current) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 shadow-lg relative" ref={inputWrapperRef}>
                <input
                    type="search"
                    ref={inputRef}
                    className="w-full p-4 pl-12 text-lg outline-none rounded-3xl placeholder:text-gray-300 text-black"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="COCOMOMO Search"
                />
                <button onClick={handleSearch}>
                    <Icon
                        name="search"
                        size={24}
                        color="black"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    />
                </button>
            </div>
        </div>
    );
}

export function SearchBar() {
    const {
        inputValue,
        setInputValue,
        isOpen,
        openSearch,
        closeSearch,
        handleSearch,
        inputRef,
        setupKeyboardEvents,
        useFocusManagement
    } = useSearch();

    setupKeyboardEvents();
    useFocusManagement();

    return (
        <>
            <SearchButton onClick={openSearch} />
            <SearchModal
                isOpen={isOpen}
                onClose={closeSearch}
                inputRef={inputRef as React.RefObject<HTMLInputElement>}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSearch={handleSearch}
            />
        </>
    );
}