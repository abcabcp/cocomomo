'use client';

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Sea } from "@/features/cocomomo/ui";

export function MainCanvas() {
    return (
        <Canvas
            gl={{ antialias: true }}
            className="w-full h-full z-0"
            camera={{
                position: [0, 5, 20],
                fov: 45,
                near: 0.1,
                far: 1000
            }}
            shadows
        >
            <Suspense fallback={null}>
                <Sea />
                <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 2.5}
                    minDistance={5}
                    maxDistance={50}
                />
            </Suspense>
        </Canvas>
    )
}