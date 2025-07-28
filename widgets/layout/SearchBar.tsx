'use client';

import { dockMenuItems } from "@/entities";
import { Icon, IconType } from "@/shared";
import { useSearch } from "./hooks";

export function SearchBar() {
    const {
        isOpen,
        isBlogPath,
        inputWrapperRef,
        inputValue,
        setInputValue,
        openSearch,
        handleSearch,
        inputRef,
        filteredItems,
        selectedIndex,
        setSelectedIndex,
        handleKeyDown,
    } = useSearch();

    return (
        <>
            <button
                className='cursor-pointer text-gray-200 flex items-center gap-1 bg-gray-800 rounded-full px-2 text-xs'
                onClick={openSearch}
            >
                Search
                <Icon name="command" size={12} />
                <p className="text-gray-200 text-[12px]">K</p>
            </button>
            {isOpen && (
                <div
                    className="fixed inset-0 top-6 z-30 flex justify-center items-start pt-[calc(30vh)]"
                >
                    <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-lg relative" ref={inputWrapperRef}>
                        <div className="relative">
                            <input
                                type="search"
                                ref={inputRef}
                                className="w-full p-4 pl-12 text-lg outline-none rounded-t-2xl placeholder:text-gray-300 text-black"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="COCOMOMO Search"
                            />
                            <button onClick={handleSearch} className="absolute z-1 left-4 top-1/2 transform -translate-y-1/2 pointer-events-none cursor-pointer w-fit h-fit">
                                <Icon name="search" size={24} color="black" />
                            </button>
                        </div>
                        {filteredItems.length > 0 && !isBlogPath && (
                            <div className="max-h-60 overflow-y-auto border-t border-gray-100 rounded-b-2xl text-black">
                                {filteredItems.map((item, index) => (
                                    <div
                                        key={item.link}
                                        className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedIndex === index ? 'bg-gray-100' : ''}`}
                                        onClick={handleSearch}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon name={item.icon as IconType} size={20} />
                                            <span>{item.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {isBlogPath && (
                            <p
                                className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none bg-gray-800/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs`}
                                style={{
                                    backgroundColor: dockMenuItems.find(item => item.link === '/blog')?.color
                                }}>
                                {dockMenuItems.find(item => item.link === '/blog')?.title}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}