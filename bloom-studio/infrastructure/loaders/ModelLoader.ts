import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { modelCache } from '../cache/ModelCache';
import { enableShadows } from '../../core/services/ObjectService';
import { GARDEN_OBJECTS } from '../../core/types/garden.types';

const DEFAULT_MATERIALS: Record<string, THREE.MeshStandardMaterial> = {};

function getDefaultMaterial(color: string): THREE.MeshStandardMaterial {
  if (!DEFAULT_MATERIALS[color]) {
    DEFAULT_MATERIALS[color] = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.7,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
  }
  return DEFAULT_MATERIALS[color];
}

function ensureMaterials(object: THREE.Object3D): void {
  object.traverse(child => {
    if (!(child instanceof THREE.Mesh)) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    const hasRealMaterial = mats.length > 0 && mats.some(m => m && (m as THREE.MeshStandardMaterial).map);
    if (hasRealMaterial) return;
    const hasMaterial = child.material && !(Array.isArray(child.material) && child.material.length === 0);
    if (!hasMaterial) {
      child.material = getDefaultMaterial('#88bb88');
    }
  });
}

function normalizeModel(object: THREE.Object3D): THREE.Object3D {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 ? 1 / maxDim : 1;

  const offsetX = -(box.min.x + size.x / 2);
  const offsetY = -box.min.y;
  const offsetZ = -(box.min.z + size.z / 2);

  const matrix = new THREE.Matrix4()
    .makeScale(scale, scale, scale)
    .multiply(new THREE.Matrix4().makeTranslation(offsetX, offsetY, offsetZ));

  object.traverse(child => {
    if (child instanceof THREE.Mesh && child.geometry) {
      child.geometry = child.geometry.clone();
      child.geometry.applyMatrix4(matrix);
    }
  });

  object.position.set(0, 0, 0);
  object.rotation.set(0, 0, 0);
  object.scale.set(1, 1, 1);

  ensureMaterials(object);
  enableShadows(object);

  return object;
}

export async function loadOBJ(path: string): Promise<THREE.Object3D> {
  if (modelCache.has(path)) return modelCache.get(path) as THREE.Object3D;

  const basePath = path.substring(0, path.lastIndexOf('/') + 1);
  const mtlName = path.substring(path.lastIndexOf('/') + 1).replace('.obj', '.mtl');
  const mtlPath = basePath + mtlName;

  const objLoader = new OBJLoader();
  let hasMtl = false;

  try {
    const mtlLoader = new MTLLoader();
    mtlLoader.setResourcePath(basePath);
    const materials = await mtlLoader.loadAsync(mtlPath);
    materials.preload();
    objLoader.setMaterials(materials);
    hasMtl = true;
  } catch {
  
  }

  const object = await objLoader.loadAsync(path);

  const config = GARDEN_OBJECTS.find(o => o.path === path);
  if (config?.needsZUpFix) {
    const rotMatrix = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
    object.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry) {
        child.geometry = child.geometry.clone();
        child.geometry.applyMatrix4(rotMatrix);
      }
    });
  }

  if (hasMtl) {
    object.traverse(child => {
      if (!(child instanceof THREE.Mesh)) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      child.material = mats.map(m => {
        const phong = m as THREE.MeshPhongMaterial;
        const hasAlphaMask = !!phong.alphaMap;

        const std = new THREE.MeshStandardMaterial({
          map: phong.map ?? null,
          color: phong.map ? new THREE.Color(1, 1, 1) : phong.color,
          alphaMap: phong.alphaMap ?? null,
          alphaTest: hasAlphaMask ? 0.5 : 0,
          transparent: hasAlphaMask ? false : phong.transparent,
          opacity: phong.opacity,
          depthWrite: true,
          side: THREE.DoubleSide,
          roughness: 0.8,
          metalness: 0,
        });
        if (phong.map) std.needsUpdate = true;
        return std;
      });
      if (mats.length === 1) child.material = (child.material as THREE.Material[])[0];
    });
  }

  normalizeModel(object);
  modelCache.set(path, object);
  return object;
}

export async function loadFBX(path: string): Promise<THREE.Object3D> {
  if (modelCache.has(path)) {
    return modelCache.get(path) as THREE.Object3D;
  }

  const loader = new FBXLoader();
  const object = await loader.loadAsync(path);
  normalizeModel(object);
  modelCache.set(path, object);
  return object;
}

export async function loadModel(
  path: string,
  loaderType: 'obj' | 'fbx',
): Promise<THREE.Object3D> {
  if (loaderType === 'fbx') return loadFBX(path);
  return loadOBJ(path);
}
