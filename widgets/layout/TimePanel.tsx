'use client';

import { formatTimeString, SlidePanel, SnapScrollPicker } from "@/shared";
import { useTimeControl } from "@/shared/lib/hooks/useTimeControl";
import Image from "next/image";

export function TimePanel() {
    const { isOpen, isReset, currentTime, selectedTime, handleTimeChange, closePanel, resetTime, toggleOpen } = useTimeControl();

    return (
        <>
            <button
                onClick={toggleOpen}
                className="hover:opacity-80 cursor-pointer"
            >
                {formatTimeString(currentTime.hour, currentTime.minute, currentTime.period)}
            </button>
            <SlidePanel
                isOpen={isOpen}
                onClose={closePanel}
                direction="right"
                wrapperClassName="bg-transparent"
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