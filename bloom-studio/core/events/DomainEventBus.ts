type EventHandler<T = unknown> = (payload: T) => void;

export class DomainEventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  on<T>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    const set = this.handlers.get(event);
    if (set) set.add(handler as EventHandler);
    return () => this.off(event, handler);
  }

  off<T>(event: string, handler: EventHandler<T>): void {
    this.handlers.get(event)?.delete(handler as EventHandler);
  }

  emit<T>(event: string, payload: T): void {
    this.handlers.get(event)?.forEach(handler => handler(payload));
  }

  clear(): void {
    this.handlers.clear();
  }
}

export const gardenEventBus = new DomainEventBus();

export const GARDEN_EVENTS = {
  OBJECT_PLACED: 'object:placed',
  OBJECT_REMOVED: 'object:removed',
  OBJECT_SELECTED: 'object:selected',
  OBJECT_DESELECTED: 'object:deselected',
  OBJECT_TRANSFORMED: 'object:transformed',
  SCENE_SAVED: 'scene:saved',
  SCENE_LOADED: 'scene:loaded',
  SCENE_CLEARED: 'scene:cleared',
  BRUSH_CHANGED: 'brush:changed',
} as const;
