'use client';

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Light from "./Light";
import { OrbitControls } from "@react-three/drei";
import Sea from "./Sea";
import Sky from "./Sky";

export default function MainCanvas() {
    return (
        <Canvas
            gl={{ antialias: true }}
            className="w-full h-full z-0"
            camera={{ position: [0, 0, 10], fov: 45 }}
            shadows
        >
            <Suspense fallback={null}>
                <Light />
                <Sky />
                <Sea />
                <OrbitControls />
            </Suspense>
        </Canvas>
    )
}