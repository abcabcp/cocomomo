'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BLADE_COUNT = 9000;
const SPREAD = 30;

const VERT = `
uniform float uTime;
varying float vHeight;

void main() {
  vHeight = position.y;
  float sway = sin(uTime * 2.2 + instanceMatrix[3][0] * 0.7 + instanceMatrix[3][2] * 0.5)
               * 0.18 * vHeight * vHeight;
  float swayZ = cos(uTime * 1.6 + instanceMatrix[3][0] * 0.5 + instanceMatrix[3][2] * 0.9)
               * 0.10 * vHeight * vHeight;
  vec3 pos = position;
  pos.x += sway;
  pos.z += swayZ;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
}
`;

const FRAG = `
varying float vHeight;
void main() {
  vec3 base = vec3(0.10, 0.30, 0.08);
  vec3 tip  = vec3(0.42, 0.72, 0.18);
  float t = clamp(vHeight * 1.6, 0.0, 1.0);
  gl_FragColor = vec4(mix(base, tip, t), 1.0);
}
`;

interface GrassBladesProps {
  skyColor?: string;
}

export function GrassBlades({ skyColor: _skyColor }: GrassBladesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);  
  const applied = useRef(false);
  

  const { geometry, material, instances } = useMemo(() => {
    const SEGS = 3;
    const W = 0.06;
    const H = 0.30;
    const verts: number[] = [];
    const uvs: number[] = [];
    const idxArr: number[] = [];

    for (let i = 0; i <= SEGS; i++) {
      const t = i / SEGS;
      const y = t * H;
      const w = W * (1.0 - t * 0.85);
      verts.push(-w, y, 0,  w, y, 0);
      uvs.push(0, t,  1, t);
      if (i < SEGS) {
        const b = i * 2;
        idxArr.push(b, b+1, b+2,  b+1, b+3, b+2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(idxArr);

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { uTime: { value: 0 } },
      side: THREE.DoubleSide,
    });

    const inst: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    const GRID = Math.ceil(Math.sqrt(BLADE_COUNT));
    const STEP = (SPREAD * 2) / GRID;
    let count = 0;
    for (let row = 0; row < GRID && count < BLADE_COUNT; row++) {
      for (let col = 0; col < GRID && count < BLADE_COUNT; col++) {
        const jx = (Math.random() - 0.5) * STEP;
        const jz = (Math.random() - 0.5) * STEP;
        const x = -SPREAD + col * STEP + jx;
        const z = -SPREAD + row * STEP + jz;
        dummy.position.set(x, 0, z);
        dummy.rotation.y = Math.random() * Math.PI * 2;
        dummy.scale.setScalar(0.5 + Math.random() * 0.6);
        dummy.updateMatrix();
        inst.push(dummy.matrix.clone());
        count++;
      }
    }

    return { geometry: geo, material: mat, instances: inst };
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!applied.current) {
      instances.forEach((mat, i) => mesh.setMatrixAt(i, mat));
      mesh.instanceMatrix.needsUpdate = true;
      applied.current = true;
    }

    timeRef.current += delta;
    material.uniforms.uTime.value = timeRef.current;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, BLADE_COUNT]}
      frustumCulled={false}
    />
  );
}
