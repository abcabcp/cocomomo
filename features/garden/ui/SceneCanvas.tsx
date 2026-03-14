'use client';

import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { Door } from "./Door";
import { Garden } from "./Garden";
import { OpenButton } from "./OpenButton";

export function SceneCanvas() {
    const [isStart, setIsStart] = useState(false);
    const [currentScene, setCurrentScene] = useState<'door' | 'garden'>('door');

    const changeScene = (scene: 'door' | 'garden') => {
        setCurrentScene(scene);
    };

    return (
        <>
            <Canvas
                shadows
                camera={{ position: [0, 2, 5], fov: 50 }}
                gl={{ antialias: true }}
            >
                <color attach="background" args={["#111111"]} />
                <ambientLight intensity={0.2} />
                {!isStart && (
                    <Suspense fallback={null}>
                        <OpenButton setIsStart={setIsStart} />
                    </Suspense>
                )}
                {isStart && (
                    <>
                        <directionalLight
                            position={[5, 5, 3]}
                            intensity={0.5}
                            castShadow
                        />
                        <Suspense fallback={null}>
                            {currentScene === 'door' && <Door changeScene={changeScene} />}
                            {/* TODO: door 가 아닌영역부터는 스크롤로 페이지로 잡아서 이동제어 하여 역스크롤 스크롤 반영해주기 */}
                            {currentScene === 'garden' && <Garden />}
                        </Suspense>
                    </>
                )}
            </Canvas>
            <Loader />
        </>
    );
}
