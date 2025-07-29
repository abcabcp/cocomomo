'use client';

import { Canvas } from "@react-three/fiber";
import { Time } from "./Time";
import { Sea } from "./Sea";
import { Suspense, useEffect, useState, useRef } from "react";
import { AdaptiveDpr, AdaptiveEvents, BakeShadows } from "@react-three/drei";

export default function MainCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dpr, setDpr] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setDpr(Math.min(window.devicePixelRatio, 2));
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (canvasRef.current) {
            observer.observe(canvasRef.current);
        }

        return () => {
            if (canvasRef.current) {
                observer.unobserve(canvasRef.current);
            }
        };
    }, []);

    return (
        <Canvas
            ref={canvasRef}
            className="fixed inset-0 z-10"
            gl={{
                antialias: false,
                powerPreference: 'high-performance',
                precision: 'mediump',
                failIfMajorPerformanceCaveat: false,
                alpha: true
            }}
            dpr={dpr}
            performance={{ min: 0.5 }}
            frameloop={isVisible ? "always" : "demand"}
            shadows={false}
        >
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            <BakeShadows />
            <Suspense fallback={null}>
                {isVisible && (
                    <>
                        <Sea />
                        <Time />
                    </>
                )}
            </Suspense>
        </Canvas>
    );
}