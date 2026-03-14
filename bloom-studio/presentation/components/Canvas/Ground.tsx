'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import React from 'react';

import groundVertexGlsl from './shaders/groundVertex.glsl';
import groundFragmentGlsl from './shaders/groundFragment.glsl';
import { GrassBlades } from './GrassBlades';

interface GroundProps {
  groundRef: React.RefObject<THREE.Mesh | null>;
  skyColor?: string;
}

export function Ground({ groundRef, skyColor = '#c8dfe8' }: GroundProps) {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uElevationScale: { value: 0.8 },
    uSkyColor: { value: new THREE.Color(skyColor) },
    uSunDir: { value: new THREE.Vector3(0.6, 1.0, 0.4).normalize() },
  }), []);

  useEffect(() => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uSkyColor.value.set(skyColor);
    }
  }, [skyColor]);

  useFrame((_, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <>
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        name="ground"
      >
        <planeGeometry args={[80, 80, 120, 120]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={groundVertexGlsl}
          fragmentShader={groundFragmentGlsl}
          uniforms={uniforms}
          side={THREE.FrontSide}
        />
      </mesh>
      <GrassBlades skyColor={skyColor} />
    </>
  );
}
