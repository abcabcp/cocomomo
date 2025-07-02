'use client';

import { cn } from '@/shared';
import { JSX, ReactNode, useEffect, useRef, useState } from 'react';
import { unstable_ViewTransition as ViewTransition } from 'react'

interface ModalProps {
    title?: string;
    body?: ReactNode;
    onClose?: () => void;
    className?: string;
}

type ModalState = {
    width: number;
    height: number;
};

type PositionState = {
    left: number;
    top: number;
};

const MODAL_SIZE = {
    BREAKPOINT: 1000,
    DEFAULT_WIDTH: 960,
    DEFAULT_HEIGHT: 600,
};

const checkIsMobileView = (): boolean => typeof window !== 'undefined' && window.innerWidth <= MODAL_SIZE.BREAKPOINT;
const calcModalPosition = (
    windowWidth: number,
    windowHeight: number,
    modalWidth: number,
    modalHeight: number
): PositionState => ({
    left: (windowWidth - modalWidth) / 2,
    top: (windowHeight - modalHeight) / 2
});

export function Modal({
    title,
    body,
    className,
    ...props
}: ModalProps): JSX.Element | null {
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const resizeHandleRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(true);
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1440,
        height: typeof window !== 'undefined' ? window.innerHeight : 900
    });

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [size, setSize] = useState<ModalState>({
        width: MODAL_SIZE.DEFAULT_WIDTH,
        height: MODAL_SIZE.DEFAULT_HEIGHT
    });

    const [position, setPosition] = useState<PositionState>(
        calcModalPosition(
            windowSize.width,
            windowSize.height,
            MODAL_SIZE.DEFAULT_WIDTH,
            MODAL_SIZE.DEFAULT_HEIGHT
        )
    );

    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
    const [initialSize, setInitialSize] = useState<ModalState>({ width: 0, height: 0 });
    const [recentlyInteracted, setRecentlyInteracted] = useState(false);

    const updateModalLayout = () => {
        const { innerWidth, innerHeight } = typeof window !== 'undefined' ? window : { innerWidth: 1440, innerHeight: 900 };

        setWindowSize({
            width: innerWidth,
            height: innerHeight
        });

        if (checkIsMobileView()) {
            setSize({
                width: innerWidth,
                height: innerHeight
            });
            setPosition({ left: 0, top: 0 });
        } else {
            setPosition(
                calcModalPosition(
                    innerWidth,
                    innerHeight,
                    size.width,
                    size.height
                )
            );
        }
    };

    const onClose = () => {
        if (typeof window === 'undefined') return;
        window.history.go(-1);
        setIsOpen(false);
        props.onClose?.();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (typeof window === 'undefined') return;
        if (window.innerWidth > MODAL_SIZE.BREAKPOINT && headerRef.current && modalRef.current) {
            e.preventDefault();
            e.stopPropagation();

            const offsetX = e.clientX - position.left;
            const offsetY = e.clientY - position.top;

            setDragOffset({ x: offsetX, y: offsetY });
            setIsDragging(true);
        }
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        if (typeof window === 'undefined') return;
        if (window.innerWidth > MODAL_SIZE.BREAKPOINT && modalRef.current) {
            e.preventDefault();
            e.stopPropagation();

            setInitialSize({
                width: size.width,
                height: size.height
            });
            setInitialMousePos({
                x: e.clientX,
                y: e.clientY
            });
            setIsResizing(true);
        }
    };


    useEffect(() => {
        updateModalLayout();
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleResize = () => updateModalLayout();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [size]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (recentlyInteracted || isDragging || isResizing) {
                return;
            }
            if (
                overlayRef.current &&
                modalRef.current &&
                overlayRef.current.contains(event.target as Node) &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        const disableBodyScroll = () => {
            document.body.style.overflow = 'hidden';
        };

        const enableBodyScroll = () => {
            document.body.style.overflow = '';
        };

        if (isOpen) {
            disableBodyScroll();
        }

        document.addEventListener('click', handleOutsideClick);

        return () => {
            enableBodyScroll();
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen, isDragging, isResizing, recentlyInteracted]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && modalRef.current) {
                e.preventDefault();
                e.stopPropagation();

                const left = e.clientX - dragOffset.x;
                const top = e.clientY - dragOffset.y;

                const safeLeft = Math.min(Math.max(0, left), windowSize.width - size.width);
                const safeTop = Math.min(Math.max(0, top), windowSize.height - size.height);

                setPosition({ left: safeLeft, top: safeTop });
            } else if (isResizing && modalRef.current) {
                e.preventDefault();
                e.stopPropagation();
                const deltaX = e.clientX - initialMousePos.x;
                const deltaY = e.clientY - initialMousePos.y;
                const newWidth = Math.max(300, initialSize.width + deltaX);
                const newHeight = Math.max(200, initialSize.height + deltaY);
                setSize({ width: newWidth, height: newHeight });
            }
        };

        const handleMouseUp = () => {
            if (isDragging || isResizing) {
                setRecentlyInteracted(true);
                setTimeout(() => {
                    setRecentlyInteracted(false);
                }, 300);
            }

            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, dragOffset, size, windowSize, initialMousePos, initialSize]);


    if (!isOpen) return null;

    return (
        <ViewTransition name="modal">
            <div
                ref={overlayRef}
                className={cn(
                    `fixed inset-0 bg-opacity-50 overflow-hidden h-dvh w-screen z-20`,
                )}
            >
                <div
                    ref={modalRef}
                    style={checkIsMobileView() ? {
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        width: '100vw',
                        height: '100vh',
                    } : {
                        position: 'absolute',
                        left: `${position.left}px`,
                        top: `${position.top}px`,
                        width: `${size.width}px`,
                        height: `${size.height}px`,
                    }}
                    className='flex flex-col bg-black/60 rounded-2xl'
                >
                    <header
                        ref={headerRef}
                        className="relative w-full px-4 py-2 flex items-center cursor-move z-10"
                        onMouseDown={handleMouseDown}
                    >
                        <button className='w-3 h-3 bg-red-500 rounded-full mr-2' onClick={onClose} />
                        <button className='w-3 h-3 bg-green-500 rounded-full mr-2' />
                        <h2 className="text-sm">{title}</h2>
                    </header>
                    <div className="flex-1 overflow-auto w-full">
                        {body}
                    </div>
                    {typeof window !== 'undefined' && window.innerWidth > MODAL_SIZE.BREAKPOINT && (
                        <div
                            ref={resizeHandleRef}
                            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-transparent"
                            onMouseDown={handleResizeMouseDown}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                boxShadow: '2px 2px 0 #ffffff inset',
                            }}
                        />
                    )}
                </div>
            </div>
        </ViewTransition>
    );
}
