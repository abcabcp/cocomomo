'use client';

import { dockMenuItems } from '@/entities';
import { cn } from '@/shared';
import { useDragAndDrop } from '@/shared/lib/hooks/useDragAndDrop';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export function Dock() {
    const router = useRouter();
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
        <nav className="p-2 z-10 absolute bottom-10 md:bottom-5 left-1/2 -translate-x-1/2 bg-white/40 rounded-lg backdrop-blur-md z-50">
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
                            if (pathname === menu.link) {
                                window.history.go(-1);
                            } else {
                                router.push(menu.link);
                            }
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: selectedItem?.title === menu.title ? 1.1 : 1.0 }}
                            whileTap={{ scale: selectedItem?.title === menu.title ? 0.95 : 1.0 }}
                            className='relative'
                        >
                            <Image
                                src={menu.imageSrc}
                                alt={menu.title}
                                width={menu.width ?? 40}
                                height={40}
                                className="pointer-events-none"
                            />
                            {pathname === menu.link && <span className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-gray-500" />}
                        </motion.div>
                    </motion.li>
                ))}
            </ul>
        </nav>
    );
}