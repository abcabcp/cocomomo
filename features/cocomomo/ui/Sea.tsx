import seaFragmentShader from '@/features/cocomomo/shaders/seaFragment.glsl';
import seaVertexShader from '@/features/cocomomo/shaders/seaVertex.glsl';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export function Sea() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(() => ({
        iGlobalTime: { value: 0 },
        iResolution: { value: new THREE.Vector2() },
    }), []);

    useEffect(() => {
        const handleResize = () => {
            if (materialRef.current) {
                materialRef.current.uniforms.iResolution.value.x = window.innerWidth;
                materialRef.current.uniforms.iResolution.value.y = window.innerHeight;
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.iGlobalTime.value = clock.getElapsedTime();
        }
    });

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