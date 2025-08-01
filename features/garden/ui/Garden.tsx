'use client';

import { OrbitControls, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export function Garden() {
    const { scene } = useGLTF("/botanical_garden.glb");
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(0, 2, 5);
    }, [camera]);


    return (
        <>
            <primitive object={scene} position={[0, -9, -12]} />
            <ambientLight intensity={3} />
            <directionalLight position={[5, 5, 3]} intensity={0.5} />
            <OrbitControls enableZoom={false} />
        </>
    );
}
