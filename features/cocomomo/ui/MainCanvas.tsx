'use client';

import { Loading } from "@/shared";
import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Time } from "./Time";

const Sea = dynamic(() => import('./Sea'), { ssr: false, loading: () => <Html><Loading /></Html> });

export function MainCanvas() {
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;
    return (
        <Canvas
            className="fixed inset-0 z-0"
            gl={{
                antialias: true,
                powerPreference: 'high-performance',
                precision: 'highp',
                failIfMajorPerformanceCaveat: false,
                alpha: true
            }}
            dpr={dpr}
            performance={{ min: 0.5 }}
        >
            <Sea />
            <Time />
        </Canvas>
    );
}