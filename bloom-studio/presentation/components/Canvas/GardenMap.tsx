'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import React from 'react';

interface GardenMapProps {
  groundRef: React.RefObject<THREE.Mesh | null>;
}

const MAP_OFFSET: [number, number, number] = [0, -9, -12];
const GROUND_Y = -9;

export { GROUND_Y, MAP_OFFSET };

export function GardenMap({ groundRef }: GardenMapProps) {
  const { scene } = useGLTF('/botanical_garden.glb');
  const planeRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    scene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (planeRef.current) {
      (groundRef as React.MutableRefObject<THREE.Mesh | null>).current = planeRef.current;
    }
  }, [groundRef]);

  return (
    <>
      <primitive object={scene} position={MAP_OFFSET} />
      <mesh
        ref={planeRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, GROUND_Y, -12]}
        name="ground"
        visible={false}
      >
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, GROUND_Y + 0.05, -12]}
      >
        <ringGeometry args={[0, 28, 64]} />
        <meshBasicMaterial
          color="#88cc88"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

useGLTF.preload('/botanical_garden.glb');
