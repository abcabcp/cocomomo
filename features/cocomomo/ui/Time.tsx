'use client';

import { formatTimeString, parseTimeString, SnapScrollPicker } from "@/shared";
import { Html } from "@react-three/drei";
import { useTimeControl } from "@/shared/lib/hooks/useTimeControl";

export function Time() {
    const { currentTime, applyTimeImmediately } = useTimeControl();

    return (
        <Html
            position={[0, 1, 0]}
            center
            prepend
            zIndexRange={[100, 0]}
            distanceFactor={10}
        >
            <div className="flex items-center p-4">
                <SnapScrollPicker
                    type="time"
                    styleType="primary"
                    value={formatTimeString(currentTime.hour, currentTime.minute, currentTime.period)}
                    onChange={(value) => applyTimeImmediately(parseTimeString(value))}

                />
            </div>
        </Html>
    )
}