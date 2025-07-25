'use client';

import { formatTimeString, Icon, SlidePanel, SnapScrollPicker } from "@/shared";
import { useTimeControl } from "@/shared/lib/hooks/useTimeControl";
import { useEffect, useState } from "react";

export function TimePanel() {
    const { isOpen, isReset, currentTime, selectedTime, handleTempTimeChange, closePanel, resetTime, toggleOpen } = useTimeControl();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="hover:opacity-80 cursor-pointer text-white">
                00:00
            </button>
        );
    }

    const timeString = formatTimeString(currentTime.hour, currentTime.minute, currentTime.period);

    return (
        <>
            <button
                onClick={toggleOpen}
                className="hover:opacity-80 cursor-pointer text-white"
            >
                {timeString}
            </button>
            <SlidePanel
                isOpen={isOpen}
                onClose={closePanel}
                direction="right"
                wrapperClassName="bg-transparent top-6"
                className="mt-6 h-fit rounded-2xl p-4 bg-white/40 backdrop-blur-xl"
                marginX={16}
            >
                <button onClick={resetTime} className="flex items-center justify-end">
                    <Icon
                        name="reset"
                        size={24}
                        className={isReset ? "animate-spin text-gray-500" : "text-gray-500"}
                    />
                </button>
                {mounted && (
                    <SnapScrollPicker
                        type="time"
                        value={formatTimeString(
                            selectedTime.hour,
                            selectedTime.minute,
                            selectedTime.period as 'AM' | 'PM'
                        )}
                        onChange={handleTempTimeChange}
                    />
                )}
            </SlidePanel>
        </>
    );
}