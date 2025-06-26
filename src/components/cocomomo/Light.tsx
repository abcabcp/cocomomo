'use client';

import { Environment } from "@react-three/drei";

export default function Light() {
    return (
        <>
            <Environment preset="forest" />
            <directionalLight
                position={[10, 20, 10]}
                intensity={1}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.001}
            />
            <ambientLight intensity={0.5} color="white" />
        </>
    )
}