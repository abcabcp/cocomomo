'use client';

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Sea, Sky, Light } from "@/features/cocomomo/ui";

export function MainCanvas() {
    return (
        <Canvas
            gl={{ antialias: true }}
            className="w-full h-full z-0"
            camera={{ position: [0, 0, 10], fov: 45 }}
            shadows
        >
            {/* TODO: texture 찾기 + controls 조정 */}
            <Suspense fallback={null}>
                <Light />
                <Sky />
                <Sea />
                <OrbitControls />
            </Suspense>
        </Canvas>
    )
}