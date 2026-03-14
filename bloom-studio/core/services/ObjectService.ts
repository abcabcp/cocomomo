import * as THREE from 'three';
import { PlacedObject, ObjectType, GARDEN_OBJECTS } from '../types/garden.types';

export function createPlacedObject(
  type: ObjectType,
  position: THREE.Vector3,
  options?: { color?: string | null; sizeMultiplier?: number },
): PlacedObject {
  const config = GARDEN_OBJECTS.find(o => o.type === type);
  const baseScale = config?.defaultScale ?? 1;
  const randomRotation = Math.random() * Math.PI * 2;

  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    position: [position.x, position.y, position.z],
    rotation: [0, randomRotation, 0],
    scale: baseScale * (options?.sizeMultiplier ?? 1),
    color: options?.color ?? config?.defaultColor ?? null,
  };
}

export function applyColorToObject(object: THREE.Object3D, color: string): void {
  const threeColor = new THREE.Color(color);
  object.traverse(child => {
    if (!(child instanceof THREE.Mesh)) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    for (const mat of mats) {
      if (mat && 'color' in mat) {
        (mat as THREE.MeshStandardMaterial).color.set(threeColor);
      }
    }
  });
}

export function cloneWithMaterials(source: THREE.Object3D): THREE.Object3D {
  const clone = source.clone(true);
  clone.traverse(child => {
    if (child instanceof THREE.Mesh) {
      if (Array.isArray(child.material)) {
        child.material = child.material.map(m => m.clone());
      } else {
        child.material = child.material.clone();
      }
    }
  });
  return clone;
}

export function enableShadows(object: THREE.Object3D): void {
  object.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}
