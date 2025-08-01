'use client';

import { useAnimations, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';

export function Door({ changeScene }: { changeScene: (scene: 'door' | 'garden') => void }) {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/old_wooden_door.glb");
    const { actions } = useAnimations(animations, group);
    const [isOpen, setIsOpen] = useState(false);
    const { camera, scene: mainScene } = useThree();
    const pointLightRef = useRef<THREE.PointLight>(null);
    const hemisphereRef = useRef<THREE.HemisphereLight>(null);

    useEffect(() => {
        const action = actions?.["Door|DoorAction"];
        if (action) {
            setIsOpen(true);
            action.play().setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (isOpen) {
            const tl = gsap.timeline();
            if (pointLightRef.current) {
                pointLightRef.current.intensity = 0;
                tl.to(pointLightRef.current, {
                    intensity: 2000,
                    duration: 1.5,
                    ease: "power2.in"
                }, 1);
            }
            if (hemisphereRef.current) {
                hemisphereRef.current.intensity = 0;
                const startColor = new THREE.Color("#000000");
                const endColor = new THREE.Color("#ffffff");

                tl.to(hemisphereRef.current, {
                    intensity: 100,
                    ease: "power2.in",
                    duration: 1.5,
                    onUpdate: function () {
                        const progress = this.progress();
                        hemisphereRef.current?.groundColor.lerpColors(startColor, endColor, progress);
                    }
                }, 1);
            }
            tl.to(mainScene.background, {
                r: 1,
                g: 1,
                b: 1,
                duration: 2,
                ease: "power2.out",
            }, 2.5);
            tl.to(camera.position, {
                x: 0,
                y: 0.5,
                z: -1,
                duration: 2,
                ease: "power2.out",
                onComplete: () => changeScene('garden')
            }, 2);
        }
    }, [isOpen]);

    return (
        <>
            <group ref={group} position={[0, -1, 0]} rotation={[0, Math.PI / 2, 0]}>
                <primitive object={scene} />
            </group>
            <pointLight
                ref={pointLightRef}
                position={[0, 1.5, -1.5]}
                color="#ffffff"
                intensity={0}
                distance={0}
                decay={1}
            />
            <hemisphereLight
                ref={hemisphereRef}
                color="#000000"
                groundColor="#000000"
                intensity={0}
            />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
        </>
    );
}