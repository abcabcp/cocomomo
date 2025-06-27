
'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const planeSize = 100;
const waveHeight = 0.3;
const waveSpeed = 1.2;

export function Sea() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;

        const time = clock.getElapsedTime() * waveSpeed;
        const position = meshRef.current.geometry.getAttribute('position');

        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const y = position.getY(i);

            const waveX1 = Math.sin(x * 0.05 + time * 0.7) * waveHeight;
            const waveX2 = Math.sin(x * 0.02 + time * 0.4) * waveHeight * 2;
            const waveY1 = Math.cos(y * 0.01 + time * 0.3) * waveHeight;
            const waveY2 = Math.cos(y * 0.01 + time * 0.6) * waveHeight * 1.5;

            const z = waveX1 + waveX2 + waveY1 + waveY2;
            position.setZ(i, z);
        }
        position.needsUpdate = true;
    });

    return (
        <mesh
            ref={meshRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            receiveShadow
        >
            <boxGeometry args={[planeSize, planeSize, 1]} />
            <meshStandardMaterial
                color="#98daf4"

                transparent
                opacity={0.85}
            />
        </mesh>
    );
}