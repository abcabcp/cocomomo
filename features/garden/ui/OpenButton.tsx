import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Html, OrbitControls } from "@react-three/drei";
import { useProgress } from "@react-three/drei";

interface OpenButtonProps {
    setIsStart: (value: boolean) => void;
}

export function OpenButton({ setIsStart }: OpenButtonProps) {
    const { camera } = useThree();
    const particlesRef = useRef<THREE.Points>(null);
    const count = 500;

    const particleTexture = useLoader(
        THREE.TextureLoader,
        '/particle.png'
    );

    const particlesState = useRef<{
        positions: Float32Array;
        speeds: Float32Array;
        angles: Float32Array;
    }>(null);

    useEffect(() => {
        if (!particlesRef.current) return;

        const positions = new Float32Array(count * 3);
        const speeds = new Float32Array(count);
        const angles = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            speeds[i] = 0.1 + Math.random() * 0.1;
            angles[i] = Math.random() * Math.PI * 2;
        }

        particlesRef.current.geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );

        particlesState.current = { positions, speeds, angles };
    }, []);


    useFrame((state) => {
        if (!particlesRef.current || !particlesState.current) return;

        const time = state.clock.getElapsedTime();
        const { positions, speeds, angles } = particlesState.current;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] += Math.cos(angles[i] + time) * speeds[i] * 0.01;
            positions[i3 + 1] += Math.sin(angles[i] + time) * speeds[i] * 0.01;

            if (positions[i3] > 5) positions[i3] = -5;
            if (positions[i3] < -5) positions[i3] = 5;
            if (positions[i3 + 1] > 5) positions[i3 + 1] = -5;
            if (positions[i3 + 1] < -5) positions[i3 + 1] = 5;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <>
            <points ref={particlesRef}>
                <bufferGeometry />
                <pointsMaterial
                    size={0.1}
                    map={particleTexture}
                    color={0xffffff}
                    transparent
                    opacity={0.8}
                    sizeAttenuation={true}
                    alphaTest={0.01}
                    blending={THREE.AdditiveBlending}
                />
            </points>
            <Html>
                <div className="fixed top-0 left-0 inset-0 flex items-center justify-center">
                    <button
                        className="min-w-20 min-h-20 rounded-full bg-white text-black animate-pulse cursor-pointer"
                        onClick={() => {
                            setIsStart(true);
                            camera.position.set(0, 2, 5);
                        }}
                    >
                        <p className="text-sm">Open Garden</p>
                    </button>
                </div>
            </Html>
            <OrbitControls />
        </>
    );
}