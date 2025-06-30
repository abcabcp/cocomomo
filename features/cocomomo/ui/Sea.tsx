'use client';

import seaFragmentShader from '@/features/cocomomo/shaders/seaFragment.glsl';
import seaVertexShader from '@/features/cocomomo/shaders/seaVertex.glsl';
import { useSea } from '../hooks/useSea';


export function Sea() {
    const { materialRef, uniforms } = useSea();

    return (
        <mesh
            frustumCulled={false}
            position={[0, 0, 0]}
        >
            <planeGeometry args={[2, 2]} />
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