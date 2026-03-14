'use client';

import { useCallback, useEffect } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { commandHistory } from '../../commands/CommandHistory';
import { PlaceObjectCommand } from '../commands/PlaceObjectCommand';
import { RemoveObjectCommand } from '../commands/RemoveObjectCommand';
import { sceneSerializer } from '../../core/services/SceneSerializer';
import { PlacedObject } from '../../core/types/garden.types';
import { gardenEventBus, GARDEN_EVENTS } from '../../core/events/DomainEventBus';

export function useGardenEditor() {
  const {
    placedObjects,
    addObject,
    removeObject,
    setObjects,
    clearObjects,
    selectedId,
    setSelectedId,
  } = useEditorStore();

  const placeObject = useCallback(
    (obj: PlacedObject) => {
      const cmd = new PlaceObjectCommand({
        object: obj,
        onAdd: addObject,
        onRemove: removeObject,
      });
      commandHistory.execute(cmd);
      gardenEventBus.emit(GARDEN_EVENTS.OBJECT_PLACED, obj);
    },
    [addObject, removeObject],
  );

  const deleteObject = useCallback(
    (id: string) => {
      const target = placedObjects.find(o => o.id === id);
      if (!target) return;
      const cmd = new RemoveObjectCommand({
        object: target,
        onAdd: addObject,
        onRemove: removeObject,
      });
      commandHistory.execute(cmd);
      gardenEventBus.emit(GARDEN_EVENTS.OBJECT_REMOVED, { id });
    },
    [placedObjects, addObject, removeObject],
  );

  const undo = useCallback(() => {
    commandHistory.undo();
  }, []);

  const redo = useCallback(() => {
    commandHistory.redo();
  }, []);

  const saveScene = useCallback(() => {
    sceneSerializer.save(placedObjects);
    gardenEventBus.emit(GARDEN_EVENTS.SCENE_SAVED, { count: placedObjects.length });
  }, [placedObjects]);

  const loadScene = useCallback(() => {
    const objects = sceneSerializer.load();
    if (objects) {
      clearObjects();
      commandHistory.clear();
      setObjects(objects);
      gardenEventBus.emit(GARDEN_EVENTS.SCENE_LOADED, { count: objects.length });
    }
  }, [clearObjects, setObjects]);

  const clearScene = useCallback(() => {
    clearObjects();
    commandHistory.clear();
    sceneSerializer.clear();
    gardenEventBus.emit(GARDEN_EVENTS.SCENE_CLEARED, null);
  }, [clearObjects]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if (e.key === 'Escape') {
        setSelectedId(null);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        deleteObject(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedId, deleteObject, setSelectedId]);

  return {
    placedObjects,
    selectedId,
    placeObject,
    deleteObject,
    undo,
    redo,
    saveScene,
    loadScene,
    clearScene,
    canUndo: commandHistory.canUndo(),
    canRedo: commandHistory.canRedo(),
  };
}
