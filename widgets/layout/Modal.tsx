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
    const [size, setSize] = useState({ width: 960, height: 600 });

    const [position, setPosition] = useState({
        left: windowSize.width / 2 - size.width / 2,
        top: windowSize.height / 2 - size.height / 2
    });

    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
    const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
    const [recentlyInteracted, setRecentlyInteracted] = useState(false);

    const onClose = () => {
        window.history.go(-1);
        setIsOpen(false);
        props.onClose?.();
    }

    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            setWindowSize({
                width: newWidth,
                height: newHeight
            });

            setPosition(prev => ({
                left: Math.min(Math.max(0, prev.left), newWidth - size.width),
                top: Math.min(Math.max(0, prev.top), newHeight - size.height)
            }));
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [size]);

    useEffect(() => {
        if (modalRef.current) {
            const modalWidth = modalRef.current.offsetWidth;
            const modalHeight = modalRef.current.offsetHeight;

            setPosition({
                left: (windowSize.width - modalWidth) / 2,
                top: (windowSize.height - modalHeight) / 2
            });

            setSize({
                width: modalWidth,
                height: modalHeight
            });
        }
    }, [windowSize]);

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

    const handleMouseDown = (e: React.MouseEvent) => {
        if (headerRef.current && modalRef.current) {
            e.preventDefault();
            e.stopPropagation();

            const offsetX = e.clientX - position.left;
            const offsetY = e.clientY - position.top;

            setDragOffset({ x: offsetX, y: offsetY });
            setIsDragging(true);
        }
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        if (modalRef.current) {
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
                    style={{
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
                    <div className="flex-1 overflow-auto w-full p-4">
                        {body}
                    </div>
                    <div
                        ref={resizeHandleRef}
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                        onMouseDown={handleResizeMouseDown}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'transparent',
                            boxShadow: '2px 2px 0 #ffffff inset',
                        }}
                    />
                </div>
            </div>
        </ViewTransition>
    );
}
