'use client';

export function Sidebar({
    asidePanelWidth,
    setAsidePanelWidth,
    wrapperRef,
    children
}: {
    asidePanelWidth: number;
    setAsidePanelWidth: (width: number) => void;
    wrapperRef: React.RefObject<HTMLDivElement | null>;
    children: React.ReactNode;
}) {
    const handleResizeAsidePanel = (e: React.MouseEvent) => {
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


    return (
        <aside
            className={`h-full relative bg-gray-800`}
            style={{ width: `${asidePanelWidth}px` }}
        >
            <div
                className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize bg-transparent hover:bg-blue-500"
                onMouseDown={handleResizeAsidePanel}
            />
            {children}
        </aside>
    )
}