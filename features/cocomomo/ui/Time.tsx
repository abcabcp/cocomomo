'use client';

import { formatTimeString, parseTimeString, SnapScrollPicker } from "@/shared";
import { Html } from "@react-three/drei";
import { useTimeControl } from "@/shared/lib/hooks/useTimeControl";

export function Time() {
    const { currentTime, setUserDefinedTime } = useTimeControl();

    return (
        <Html position={[0, 4.5, 10]} center>
            <div className="min-w-[300px] flex items-center">
                <SnapScrollPicker
                    type="time"
                    styleType="primary"
                    value={formatTimeString(currentTime.hour, currentTime.minute, currentTime.period)}
                    onChange={(value) => setUserDefinedTime(parseTimeString(value))}
                />
            </div>
        </Html>
    )
}