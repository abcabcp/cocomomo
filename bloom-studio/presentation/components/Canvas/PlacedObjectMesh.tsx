'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GARDEN_OBJECTS, PlacedObject } from '../../../core/types/garden.types';
import { loadModel } from '../../../infrastructure/loaders/ModelLoader';

interface Props {
  object: PlacedObject;
  isSelected: boolean;
  onClick: (id: string, multi: boolean) => void;
}

export function PlacedObjectMesh({ object, isSelected, onClick }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Object3D | null>(null);

  const config = GARDEN_OBJECTS.find(o => o.type === object.type);

  useEffect(() => {
    if (!config) return;
    let cancelled = false;

    loadModel(config.path, config.loaderType).then(source => {
      if (cancelled) return;
      const clone = source.clone(true);
      const tint = new THREE.Color(object.color ?? config.previewColor);
      clone.traverse(child => {
        if (!(child instanceof THREE.Mesh)) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        child.material = mats.map(m => {
          const mat = (m as THREE.MeshStandardMaterial).clone();
          mat.side = THREE.DoubleSide;
          if (mat.map) {
            mat.alphaTest = 0.4;
            mat.transparent = false;
            mat.depthWrite = true;
          } else {
            mat.color.set(tint);
          }
          return mat;
        });
        if (mats.length === 1) child.material = (child.material as THREE.Material[])[0];
        child.castShadow = true;
        child.receiveShadow = true;
      });
      setModel(clone);
    });

    return () => { cancelled = true; };
  }, [config, object.color]);

  if (!model) return null;

  return (
    <group
      ref={groupRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick(object.id, e.shiftKey);
      }}
    >
      <primitive object={model} />
      {isSelected && (
        <mesh>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial color="#60a5fa" wireframe opacity={0.6} transparent />
        </mesh>
      )}
    </group>
  );
}
