'use client';

import { Html } from "@react-three/drei";

export function Sky() {
    return (
        <mesh
            receiveShadow
        >
            <planeGeometry args={[100, 100, 64, 64]} />
            <meshStandardMaterial
                color="#7ab4dd"
                transparent
                opacity={0.85}
            />
        </mesh>
    );
}
