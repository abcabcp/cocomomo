'use client';

import { formatTimeString, SlidePanel, SnapScrollPicker } from "@/shared";
import { useTimePanel } from "./hooks/useTimePanel";

export function TimePanel() {
    const { currentTime, selectedTime, handleTimeChange, setUserDefinedTime, isOpen, setIsOpen, handleClose } = useTimePanel();

    return (
        <>
            <button onClick={() => setIsOpen(prev => !prev)} className="hover:opacity-80">
                {formatTimeString(currentTime.hour, currentTime.minute, currentTime.period)}
            </button>

            <SlidePanel
                isOpen={isOpen}
                onClose={handleClose}
                direction="right"
                wrapperClassName="mt-6 bg-transparent¡¡"
                className="mt-6 h-fit rounded-2xl p-4 bg-white/80"
                marginX={16}
            >
                <>
                    <h3 className="text-lg font-medium mb-4">Time Picker</h3>
                    <SnapScrollPicker
                        type="time"
                        value={formatTimeString(
                            selectedTime.hour,
                            selectedTime.minute,
                            selectedTime.period as 'AM' | 'PM'
                        )}
                        onChange={handleTimeChange}
                    />
                </>
            </SlidePanel>
        </>
    );
}