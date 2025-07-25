'use client';

import { dockMenuItems } from '@/entities';
import { Icon, IconType, closeModalAnimation, cn, isMobileDevice, openModalAnimation } from '@/shared';
import { useDragAndDrop } from '@/shared/lib/hooks/useDragAndDrop';
import { motion } from 'framer-motion';
import { useTransitionRouter } from 'next-view-transitions';
import { usePathname } from 'next/navigation';

export function Dock({ visible, segment }: { visible: boolean, segment: string | null }) {
    const router = useTransitionRouter();
    const pathname = usePathname();
    const {
        dragging,
        sortItems,
        onDragStart,
        onDragEnd,
        onDragOver,
        selectedItem,
        draggedIndex
    } = useDragAndDrop({ items: dockMenuItems });

    const getAnimationProps = (index: number) => {
        const isDragged = draggedIndex === index;
        const isBeforeDragged = index > 0 && index - 1 === draggedIndex;
        const isAfterDragged = draggedIndex !== null && index === draggedIndex + 1;
        const isBeforeTarget = draggedIndex !== null && index < sortItems.length - 1 && index + 1 === draggedIndex;
        const isAfterTarget = draggedIndex !== null && index === draggedIndex - 1;

        return {
            scale: isDragged ? 1.1 : 1,
            opacity: isDragged && dragging ? 0 : 1,
            width: isDragged && dragging ? 0 : '40px',
            marginLeft: (isBeforeDragged || isAfterDragged) ? '1rem' : '0',
            marginRight: (isBeforeTarget || isAfterTarget) ? '1rem' : '0',
            boxShadow: isDragged ? "0px 5px 20px rgba(0,0,0,0.3)" : "none",
        };
    };

    return (
        <nav
            className={cn(
                "p-2 z-50 fixed bottom-10 md:bottom-5 left-1/2 -translate-x-1/2",
                "bg-white/40 rounded-lg backdrop-blur-md",
                "transform transition-transform duration-300 ease-in-out",
                isMobileDevice()
                    ? (!visible ? "translate-y-[200%]" : "translate-y-0")
                    : "",
                "data-[dock=true]"
            )}
            data-dock="true"
        >
            <ul className="flex gap-x-2">
                {sortItems.map((menu, index) => (
                    <motion.li
                        key={menu.title}
                        layout
                        initial={{ opacity: 1 }}
                        animate={getAnimationProps(index)}
                        className={cn(
                            'rounded-lg flex items-center justify-center cursor-pointer',
                            menu.className,
                            draggedIndex === index ? 'z-50' : 'z-10',
                            dragging && draggedIndex === index ? 'cursor-grabbing' : '',
                        )}
                        draggable
                        onDragStart={(e) => {
                            onDragStart(index, e as any);
                        }}
                        onDragEnd={onDragEnd}
                        onDragOver={(e) => {
                            e.preventDefault();
                            onDragOver(index, e as any);
                        }}
                        onClick={() => {
                            if (menu.title === 'mail') {
                                window.open('mailto:dltmfrl600@gmail.com', '_blank');
                                return;
                            }
                            if (menu.title === 'github') {
                                window.open('https://github.com/abcabcp', '_blank');
                                return;
                            }
                            if (pathname === menu.link) {
                                if (segment) {
                                    router.push('/', {
                                        onTransitionReady: closeModalAnimation,
                                        scroll: false,
                                    });
                                } else {
                                    closeModalAnimation()?.then(() => {
                                        router.back();
                                    });
                                }
                            } else {
                                router.push(`${menu.link}`, {
                                    onTransitionReady: openModalAnimation,
                                    scroll: false,
                                });
                            }
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: selectedItem?.title === menu.title ? 1.1 : 1.0 }}
                            whileTap={{ scale: selectedItem?.title === menu.title ? 0.95 : 1.0 }}
                            className='relative'
                        >
                            <Icon
                                name={menu.icon as IconType}
                                className="pointer-events-none text-black"
                                size={menu.icon === 'chrome' || menu.icon === 'github' ? 36 : 40}
                            />
                            {pathname === menu.link && <span className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-gray-500" />}
                        </motion.div>
                    </motion.li>
                ))}
            </ul>
        </nav>
    );
}
