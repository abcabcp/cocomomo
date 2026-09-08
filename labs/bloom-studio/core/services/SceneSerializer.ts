import { SceneData, PlacedObject } from '../types/garden.types';
import { useCurrentTimeStore } from '@/shared/store';

const STORAGE_KEY = 'bloom-studio:garden-scene';
const CURRENT_VERSION = 1;

function getCurrentTimeString(): string {
  const { currentTime } = useCurrentTimeStore.getState();
  const hour24 = currentTime.period === 'PM' 
    ? (currentTime.hour === 12 ? 12 : currentTime.hour + 12)
    : (currentTime.hour === 12 ? 0 : currentTime.hour);
  
  const now = new Date();
  now.setHours(hour24, currentTime.minute, 0, 0);
  return now.toISOString();
}

export class SceneSerializer {
  serialize(objects: PlacedObject[]): SceneData {
    const now = getCurrentTimeString();
    return {
      version: CURRENT_VERSION,
      objects,
      createdAt: now,
      updatedAt: now,
    };
  }

  save(objects: PlacedObject[]): void {
    const data = this.serialize(objects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  load(): PlacedObject[] | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const data: SceneData = JSON.parse(raw);
      if (data.version !== CURRENT_VERSION) return null;
      return data.objects;
    } catch {
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  hasSavedScene(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
}

export const sceneSerializer = new SceneSerializer();
