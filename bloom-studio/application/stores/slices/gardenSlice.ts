import { StateCreator } from 'zustand';
import { PlacedObject, BrushConfig, ObjectType } from '../../../core/types/garden.types';

export interface GardenSlice {
  placedObjects: PlacedObject[];
  brush: BrushConfig;
  selectedId: string | null;
  selectedIds: string[];

  addObject: (obj: PlacedObject) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, patch: Partial<PlacedObject>) => void;
  updateSelected: (patch: Partial<PlacedObject>) => void;
  setObjects: (objects: PlacedObject[]) => void;
  clearObjects: () => void;

  setBrushType: (type: ObjectType | null) => void;
  setBrushSize: (size: number) => void;
  setBrushColor: (color: string | null) => void;

  setSelectedId: (id: string | null) => void;
  toggleSelectedId: (id: string, multi: boolean) => void;
  clearSelection: () => void;
}

export const createGardenSlice: StateCreator<GardenSlice> = set => ({
  placedObjects: [],
  brush: {
    type: null,
    mode: 'place',
    size: 1,
    color: null,
  },
  selectedId: null,
  selectedIds: [],

  addObject: (obj) =>
    set(state => ({ placedObjects: [...state.placedObjects, obj] })),

  removeObject: (id) =>
    set(state => ({
      placedObjects: state.placedObjects.filter(o => o.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      selectedIds: state.selectedIds.filter(s => s !== id),
    })),

  updateObject: (id, patch) =>
    set(state => ({
      placedObjects: state.placedObjects.map(o => (o.id === id ? { ...o, ...patch } : o)),
    })),

  updateSelected: (patch) =>
    set(state => ({
      placedObjects: state.placedObjects.map(o =>
        state.selectedIds.includes(o.id) ? { ...o, ...patch } : o
      ),
    })),

  setObjects: (objects) => set({ placedObjects: objects }),

  clearObjects: () => set({ placedObjects: [], selectedId: null, selectedIds: [] }),

  setBrushType: (type) =>
    set(state => ({ brush: { ...state.brush, type } })),

  setBrushSize: (size) =>
    set(state => ({ brush: { ...state.brush, size } })),

  setBrushColor: (color) =>
    set(state => ({ brush: { ...state.brush, color } })),

  setSelectedId: (id) => set({ selectedId: id, selectedIds: id ? [id] : [] }),

  toggleSelectedId: (id, multi) =>
    set(state => {
      if (!multi) return { selectedId: id, selectedIds: [id] };
      const already = state.selectedIds.includes(id);
      const next = already
        ? state.selectedIds.filter(s => s !== id)
        : [...state.selectedIds, id];
      return { selectedIds: next, selectedId: next[next.length - 1] ?? null };
    }),

  clearSelection: () => set({ selectedId: null, selectedIds: [] }),
});
