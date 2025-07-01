'use client';

import { formatTimeString, SlidePanel, SnapScrollPicker } from "@/shared";
import { useTimeControl } from "@/shared/lib/hooks/useTimeControl";
import Image from "next/image";

export function TimePanel() {
    const { isOpen, isReset, currentTime, selectedTime, handleTimeChange, setIsOpen, handleClose, resetTime } = useTimeControl();

    return (
        <>
            <button onClick={() => setIsOpen(prev => !prev)} className="hover:opacity-80">
                {formatTimeString(currentTime.hour, currentTime.minute, currentTime.period)}
            </button>
            <SlidePanel
                isOpen={isOpen}
                onClose={handleClose}
                direction="right"
                wrapperClassName="mt-6 bg-transparent"
                className="mt-6 h-fit rounded-2xl p-4 bg-white/40"
                marginX={16}
            >
                <button onClick={resetTime} className="flex items-center justify-end">
                    <Image src="/assets/svgs/reset.svg" alt="reset" width={24} height={24} className={isReset ? "animate-spin" : ""} />
                </button>
                <SnapScrollPicker
                    type="time"
                    value={formatTimeString(
                        selectedTime.hour,
                        selectedTime.minute,
                        selectedTime.period as 'AM' | 'PM'
                    )}
                    onChange={handleTimeChange}
                />
            </SlidePanel>
        </>
    );
}