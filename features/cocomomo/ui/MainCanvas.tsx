'use client';

import { Canvas } from "@react-three/fiber";
import { Time } from "./Time";
import dynamic from "next/dynamic";
import { Html } from "@react-three/drei";
import { Loading } from "@/shared";

const Sea = dynamic(() => import('./Sea'), { ssr: false, loading: () => <Html><Loading /></Html> });

export function MainCanvas() {
    return (
        <Canvas
            className="fixed inset-0 z-0"
            gl={{
                antialias: true,
                powerPreference: 'high-performance',
                precision: 'mediump',
                failIfMajorPerformanceCaveat: true,
                preserveDrawingBuffer: true,
                logarithmicDepthBuffer: false
            }}
            dpr={1}
            performance={{ min: 0.5 }}
        >
            <Sea />
            <Time />
        </Canvas>
    );
}