'use client';

import { closeModalAnimation, cn, getWindowSize, isClient, useMaxWidthLaptop, useOutsideClick } from '@/shared';
import { useModalStore } from '@/shared/store';
import { useTransitionRouter } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { JSX, ReactNode, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ModalProps = {
    className?: string;
    id?: string;
    title?: string;
    body?: ReactNode;
    onClose?: () => void;
    order?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'id' | 'className'>;

type ModalSize = {
    width: number;
    height: number;
}

type ModalPosition = {
    left: number;
    top: number;
}

type InteractionState = {
    isDragging: boolean;
    isResizing: boolean;
    recentlyInteracted: boolean;
    dragOffset: { x: number; y: number };
    initialMousePos: { x: number; y: number };
    initialSize: ModalSize;
};

export const MODAL_CONSTANTS = {
    DEFAULT_WIDTH: 960,
    DEFAULT_HEIGHT: 600,
    MIN_WIDTH: 300,
    MIN_HEIGHT: 200,
    MODAL_Z_INDEX: 20,
    INNER_Z_INDEX: 20,
    INNER_MOBILE_Z_INDEX: 40,
};

const calcModalPosition = (
    windowWidth: number,
    windowHeight: number,
    modalWidth: number,
    modalHeight: number
): ModalPosition => ({
    left: (windowWidth - modalWidth) / 2,
    top: (windowHeight - modalHeight) / 2
});

const checkIsFullscreen = (size: ModalSize, windowSize: ModalSize) => {
    return size.width === windowSize.width && size.height === windowSize.height;
}

const ModalButton = ({ color, onClick, ariaLabel }: {
    color: string;
    onClick: () => void;
    ariaLabel: string
}) => (
    <button
        className={`w-3 h-3 ${color} rounded-full mr-2 cursor-pointer`}
        onClick={onClick}
    >
        <p className="sr-only">{ariaLabel}</p>
    </button>
);


export function Modal({
    id = 'modal',
    className,
    title,
    body,
    order,
    ...props
}: ModalProps): JSX.Element | null {
    const isMobileView = useMaxWidthLaptop();
    const modalRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const resizeHandleRef = useRef<HTMLDivElement>(null);
    const { size, setSize } = useModalStore();
    const [windowSize, setWindowSize] = useState(getWindowSize());
    const [position, setPosition] = useState<ModalPosition>(
        calcModalPosition(windowSize.width, windowSize.height, size.width, size.height)
    );

    const [interaction, setInteraction] = useState<InteractionState>({
        isDragging: false,
        isResizing: false,
        recentlyInteracted: false,
        dragOffset: { x: 0, y: 0 },
        initialMousePos: { x: 0, y: 0 },
        initialSize: { width: 0, height: 0 }
    });

    const isFullscreen = useMemo(() => checkIsFullscreen(size, windowSize), [size, windowSize]);

    const modalStyle = useMemo(() =>
        isMobileView ? {
            position: 'fixed' as const,
            left: 0,
            top: '24px',
            width: '100vw',
            height: '100vh',
        } : {
            position: 'absolute' as const,
            left: `${position.left}px`,
            top: `${position.top}px`,
            width: `${size.width}px`,
            height: `${size.height}px`,
        }, [isMobileView, position, size]
    );

    const updateModalLayout = useCallback(() => {
        const { width, height } = getWindowSize();

        setWindowSize({ width, height });
        if (isMobileView) {
            setSize({ width, height });
            setPosition({ left: 0, top: 0 });
        } else {
            setPosition(calcModalPosition(width, height, size.width, size.height));
        }
    }, [size, setSize, isMobileView]);

    const onClose = () => {
        if (typeof window === 'undefined') return;
        closeModalAnimation()?.then(() => {
            history.back()
            props.onClose?.();
        });
    };

    const onFullscreen = () => {
        if (isMobileView) return;
        if (isFullscreen) {
            setSize({
                width: MODAL_CONSTANTS.DEFAULT_WIDTH,
                height: MODAL_CONSTANTS.DEFAULT_HEIGHT
            });
            setPosition(calcModalPosition(windowSize.width, windowSize.height, MODAL_CONSTANTS.DEFAULT_WIDTH, MODAL_CONSTANTS.DEFAULT_HEIGHT));
            return;
        }
        setSize({
            width: windowSize.width,
            height: windowSize.height
        });
        setPosition({
            left: 0,
            top: 0
        });
    };

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!isClient()) return;
        if (!isMobileView && headerRef.current && modalRef.current) {
            e.preventDefault();
            e.stopPropagation();

            const offsetX = e.clientX - position.left;
            const offsetY = e.clientY - position.top;

            setInteraction({
                ...interaction,
                dragOffset: { x: offsetX, y: offsetY },
                isDragging: true
            });
        }
    }, [position, isMobileView]);

    const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
        if (!isClient()) return;
        if (!isMobileView && modalRef.current) {
            e.preventDefault();
            e.stopPropagation();

            setInteraction({
                ...interaction,
                initialSize: { width: size.width, height: size.height },
                initialMousePos: { x: e.clientX, y: e.clientY },
                isResizing: true
            });
        }
    }, [size, isMobileView]);

    useEffect(() => {
        if (!isClient()) return;

        const handleResize = () => updateModalLayout();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [size]);

    useEffect(() => {
        if (!isClient()) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (interaction.isDragging && modalRef.current) {
                e.preventDefault();
                const left = e.clientX - interaction.dragOffset.x;
                const top = e.clientY - interaction.dragOffset.y;
                setPosition({
                    left: Math.min(Math.max(0, left), windowSize.width - size.width),
                    top: Math.min(Math.max(0, top), windowSize.height - size.height)
                });
            } else if (interaction.isResizing && modalRef.current) {
                e.preventDefault();
                const deltaX = e.clientX - interaction.initialMousePos.x;
                const deltaY = e.clientY - interaction.initialMousePos.y;
                setSize({
                    width: Math.max(MODAL_CONSTANTS.MIN_WIDTH, interaction.initialSize.width + deltaX),
                    height: Math.max(MODAL_CONSTANTS.MIN_HEIGHT, interaction.initialSize.height + deltaY)
                });
            }
        };

        const handleMouseUp = () => {
            if (interaction.isDragging || interaction.isResizing) {
                setInteraction(prev => ({
                    ...prev,
                    recentlyInteracted: true,
                    isDragging: false,
                    isResizing: false
                }));
                setTimeout(() => {
                    setInteraction(prev => ({ ...prev, recentlyInteracted: false }));
                }, 300);
            }
        };

        if (interaction.isDragging || interaction.isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [interaction, size, windowSize]);

    useOutsideClick(
        modalRef as RefObject<HTMLElement>,
        onClose,
        !interaction.recentlyInteracted && !interaction.isDragging && !interaction.isResizing
    );

    return (
        <div
            className="fixed top-6 inset-0 bg-opacity-50 overflow-hidden h-dvh w-screen"
            style={{
                zIndex: MODAL_CONSTANTS.MODAL_Z_INDEX + (order ?? 0)
            }}
        >
            <div
                id={id}
                ref={modalRef}
                style={modalStyle}
                aria-labelledby={title ? `${id}-title` : undefined}
                className={cn('flex flex-col bg-black/60', {
                    'rounded-2xl': !isFullscreen && !isMobileView
                }, className)}
            >
                <header
                    ref={headerRef}
                    className={cn("relative w-full px-4 py-2 flex items-center cursor-move backdrop-blur-sm", {
                        'rounded-t-2xl': !isFullscreen && !isMobileView
                    })}
                    style={{
                        zIndex: isMobileView ? MODAL_CONSTANTS.INNER_MOBILE_Z_INDEX : MODAL_CONSTANTS.INNER_Z_INDEX + (order ?? 0)
                    }}
                    onMouseDown={handleMouseDown}
                >
                    <ModalButton color="bg-red-500" onClick={onClose} ariaLabel="Close" />
                    <ModalButton color="bg-green-500" onClick={onFullscreen} ariaLabel="Fullscreen" />
                    <h2 className="text-sm">{title}</h2>
                </header>
                <div className="w-full flex flex-col flex-1 overflow-hidden">
                    {body}
                </div>
                {isClient() && !isMobileView && (
                    <div
                        ref={resizeHandleRef}
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-transparent"
                        style={{
                            zIndex: isMobileView ? MODAL_CONSTANTS.INNER_MOBILE_Z_INDEX : MODAL_CONSTANTS.INNER_Z_INDEX + (order ?? 0),
                            boxShadow: '2px 2px 0 #ffffff inset',
                        }}
                        onMouseDown={handleResizeMouseDown}
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
            </div>
        </div>
    );
}
