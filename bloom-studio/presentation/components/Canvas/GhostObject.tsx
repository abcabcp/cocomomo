'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BrushConfig, GARDEN_OBJECTS } from '../../../core/types/garden.types';
import { loadModel } from '../../../infrastructure/loaders/ModelLoader';

interface Props {
  brush: BrushConfig;
}

export function GhostObject({ brush }: Props) {
  const { camera, gl } = useThree();
  const ghostRef = useRef<THREE.Group>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const ndc = useRef(new THREE.Vector2());
  const groundPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const hitTarget = useRef(new THREE.Vector3());
  const [model, setModel] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!brush.type) {
      setModel(null);
      return;
    }
    const config = GARDEN_OBJECTS.find(o => o.type === brush.type);
    if (!config) return;

    let cancelled = false;
    loadModel(config.path, config.loaderType).then(source => {
      if (cancelled) return;
      const clone = source.clone(true);
      clone.traverse(child => {
        if (!(child instanceof THREE.Mesh)) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        child.material = mats.map(m => {
          const mat = (m as THREE.MeshStandardMaterial).clone();
          if (mat.alphaTest > 0) {
            mat.opacity = 1.0;
            mat.transparent = false;
            mat.color.multiplyScalar(0.7);
          } else {
            mat.transparent = true;
            mat.opacity = 0.6;
            mat.depthWrite = false;
          }
          return mat;
        });
        if (mats.length === 1) child.material = (child.material as THREE.Material[])[0];
      });
      setModel(clone);
    }).catch(err => console.error('[GhostObject] load error:', err));

    return () => { cancelled = true; };
  }, [brush.type, brush.color]);

  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ndc.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    canvas.addEventListener('mousemove', onMove);
    return () => canvas.removeEventListener('mousemove', onMove);
  }, [gl]);

  useFrame(() => {
    if (!ghostRef.current) return;

    if (!brush.type) {
      ghostRef.current.visible = false;
      return;
    }

    raycaster.current.setFromCamera(ndc.current, camera);
    const hit = raycaster.current.ray.intersectPlane(groundPlane.current, hitTarget.current);

    if (hit) {
      const config = GARDEN_OBJECTS.find(o => o.type === brush.type);
      const baseScale = config?.defaultScale ?? 1;
      ghostRef.current.position.copy(hitTarget.current);
      ghostRef.current.scale.setScalar(baseScale * brush.size);
      ghostRef.current.visible = true;
    } else {
      ghostRef.current.visible = false;
    }
  });

  if (!model || !brush.type) return null;

  return (
    <group ref={ghostRef} visible={false}>
      <primitive object={model} />
    </group>
  );
}
