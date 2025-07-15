'use client';

import seaFragmentShader from '@/features/cocomomo/shaders/seaFragment.glsl';
import seaVertexShader from '@/features/cocomomo/shaders/seaVertex.glsl';
import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { useSea } from '../hooks/useSea';

export function Sea() {
    const meshRef = useRef<Mesh>(null);
    const { materialRef, uniforms } = useSea();
    const { viewport } = useThree();

    return (
        <mesh
            ref={meshRef}
            frustumCulled={false}
            position={[0, 0, 0]}
        >
            <planeGeometry args={[viewport.width, viewport.height]} />
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={seaVertexShader}
                fragmentShader={seaFragmentShader}
                transparent={true}
            />
        </mesh>
    );
}

export default Sea;