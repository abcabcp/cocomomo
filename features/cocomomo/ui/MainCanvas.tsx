'use client';

import { Sea } from "@/features/cocomomo/ui";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Time } from "./Time";

export function MainCanvas() {
    return (
        <Canvas
            className="fixed inset-0 z-0"
            gl={{ antialias: true }}
            camera={{ position: [0, 5, 20], fov: 50, near: 0.1, far: 1000 }}
            shadows
        >
            <Suspense fallback={null}>
                <Sea />
            </Suspense>
            <Time />
        </Canvas>
    )
}