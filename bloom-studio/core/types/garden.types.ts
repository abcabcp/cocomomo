import * as THREE from 'three';

export type ObjectType = 'anemone' | 'crocus' | 'rose' |  'tree';

export type BrushMode = 'place' | 'select' | 'delete';

export interface BrushConfig {
  type: ObjectType | null;
  mode: BrushMode;
  size: number;
  color: string | null;
}

export interface PlacedObject {
  id: string;
  type: ObjectType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string | null;
}

export interface SceneData {
  version: number;
  objects: PlacedObject[];
  createdAt: string;
  updatedAt: string;
}

export interface GardenObjectConfig {
  type: ObjectType;
  label: string;
  category: 'flower' | 'tree';
  path: string;
  loaderType: 'obj' | 'fbx';
  defaultScale: number;
  defaultColor: string | null;
  previewColor: string;
  needsZUpFix?: boolean;
}

export interface IntersectionPoint {
  point: THREE.Vector3;
  normal: THREE.Vector3;
}

export const GARDEN_OBJECTS: GardenObjectConfig[] = [
  {
    type: 'anemone',
    label: 'Anemone',
    category: 'flower',
    path: '/flower/anemone/12973_anemone_flower_v1_l2.obj',
    loaderType: 'obj',
    needsZUpFix: true,
    defaultScale: 1.2,
    defaultColor: '#f0a0c0',
    previewColor: '#f0a0c0',
  },
  {
    type: 'crocus',
    label: 'Crocus',
    category: 'flower',
    path: '/flower/crocus/12974_crocus_flower_v1_l3.obj',
    loaderType: 'obj',
    needsZUpFix: true,
    defaultScale: 1.0,
    defaultColor: '#a78bfa',
    previewColor: '#a78bfa',
  },
  {
    type: 'rose',
    label: 'Rose',
    category: 'flower',
    path: '/flower/rose/rose.fbx',
    loaderType: 'fbx',
    defaultScale: 1.2,
    defaultColor: '#f43f5e',
    previewColor: '#f43f5e',
  },
  // {
  //   type: 'maple-tree',
  //   label: 'Maple Tree',
  //   category: 'tree',
  //   path: '/tree/mapletree/MapleTree.obj',
  //   loaderType: 'obj',
  //   defaultScale: 3.0,
  //   defaultColor: '#d97706',
  //   previewColor: '#d97706',
  // },
  {
    type: 'tree',
    label: 'Pine Tree',
    category: 'tree',
    path: '/tree/pinetree/Tree/Tree.obj',
    loaderType: 'obj',
    defaultScale: 3.0,
    defaultColor: '#16a34a',
    previewColor: '#16a34a',
  },
];
