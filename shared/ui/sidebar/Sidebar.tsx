'use client';

import { cn, isMobileDevice } from "@/shared";
import { HamburgerButton } from "../hamburger";

export function Sidebar({
    asidePanelWidth,
    setAsidePanelWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    wrapperRef,
    children,
}: {
    asidePanelWidth: number | null;
    setAsidePanelWidth: (width: number) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    wrapperRef: React.RefObject<HTMLDivElement | null>;
    children: React.ReactNode;
}) {
    const handleResizeAsidePanel = (e: React.MouseEvent) => {
        if (!asidePanelWidth) return;
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = asidePanelWidth;

        const handleMouseMove = (e: MouseEvent) => {
            if (!wrapperRef.current) return;
            const newWidth = startWidth + (e.clientX - startX);
            setAsidePanelWidth(Math.max(200, Math.min(newWidth, wrapperRef.current.offsetWidth / 2)));
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const toggleSidebar = () => {
        if (asidePanelWidth !== null) {
            if (isSidebarOpen) {
                setAsidePanelWidth(48);
            } else {
                setAsidePanelWidth(280);
            }
        }
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <aside
            className={cn('bg-gradient-to-b from-gray-800 to-gray-900 transition-all duration-300 ease-in-out', {
                'relative': asidePanelWidth,
                'min-h-12 h-12 overflow-hidden sticky top-0 z-10 flex items-center': !isSidebarOpen && !asidePanelWidth,
                'h-full': isSidebarOpen && !isMobileDevice(),
            })}
            style={{
                width: asidePanelWidth !== null ? `${asidePanelWidth}px` : '100%',
                minWidth: asidePanelWidth !== null ? `${asidePanelWidth}px` : '100%',
            }}
        >
            <HamburgerButton isOpen={isSidebarOpen} onClick={toggleSidebar} size="md" className="m-3" />
            <div className={cn(
                "transition-opacity duration-300 ease-in-out",
                isSidebarOpen ? "opacity-100" : "opacity-0"
            )}>
                {isSidebarOpen && (
                    <>
                        <div
                            className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize bg-transparent hover:bg-blue-500"
                            onMouseDown={handleResizeAsidePanel}
                        />
                        {children}
                    </>
                )}
            </div>
        </aside >
    );
}