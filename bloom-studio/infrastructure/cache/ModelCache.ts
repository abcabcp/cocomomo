import * as THREE from 'three';

class ModelCache {
  private cache: Map<string, THREE.Object3D> = new Map();

  has(path: string): boolean {
    return this.cache.has(path);
  }

  get(path: string): THREE.Object3D | undefined {
    return this.cache.get(path);
  }

  set(path: string, model: THREE.Object3D): void {
    this.cache.set(path, model);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const modelCache = new ModelCache();
