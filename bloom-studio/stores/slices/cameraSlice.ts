import { StateCreator } from 'zustand';

export interface CameraSlice {
  zoomLevel: number;
  minZoom: number;
  maxZoom: number;
  setZoomLevel: (level: number) => void;
  setZoomRange: (min: number, max: number) => void;
}

export const createCameraSlice: StateCreator<CameraSlice> = set => ({
  zoomLevel: 55,
  minZoom: 1,
  maxZoom: 100,
  setZoomLevel: (level: number) => set({ zoomLevel: level }),
  setZoomRange: (min: number, max: number) =>
    set({ minZoom: min, maxZoom: max }),
});
