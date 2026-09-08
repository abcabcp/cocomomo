import { create } from 'zustand';
import { CameraSlice, createCameraSlice } from './slices/cameraSlice';
import { GardenSlice, createGardenSlice } from '../application/stores/slices/gardenSlice';

export type EditorStore =
  CameraSlice &
  GardenSlice;

export const useEditorStore = create<EditorStore>()((...a) => ({
  ...createCameraSlice(...a),
  ...createGardenSlice(...a),
}));
