'use client';

import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { useEditorStore } from '../../stores/editorStore';
import { ObjectType, GARDEN_OBJECTS } from '../../core/types/garden.types';
import { createPlacedObject } from '../../core/services/ObjectService';
import { commandHistory } from '../../commands/CommandHistory';
import { PlaceObjectCommand } from '../commands/PlaceObjectCommand';

export function useBrush() {
  const { brush, setBrushType, setBrushSize, setBrushColor, addObject, removeObject } = useEditorStore();
  const isDragging = useRef(false);
  const lastPlacedAt = useRef<THREE.Vector3 | null>(null);
  const DRAG_MIN_DISTANCE = 0.8;

  const placeObject = useCallback(
    (obj: ReturnType<typeof createPlacedObject>) => {
      const cmd = new PlaceObjectCommand({ object: obj, onAdd: addObject, onRemove: removeObject });
      commandHistory.execute(cmd);
    },
    [addObject, removeObject],
  );

  const selectBrush = useCallback(
    (type: ObjectType | null) => {
      setBrushType(type);
      if (type) {
        const config = GARDEN_OBJECTS.find(o => o.type === type);
        if (config?.defaultColor) {
          setBrushColor(config.defaultColor);
        }
      }
    },
    [setBrushType, setBrushColor],
  );

  const handleGroundClick = useCallback(
    (point: THREE.Vector3) => {
      if (!brush.type) return;
      const obj = createPlacedObject(brush.type, point, {
        color: brush.color,
        sizeMultiplier: brush.size,
      });
      placeObject(obj);
    },
    [brush, placeObject],
  );

  const handleGroundDragStart = useCallback(() => {
    isDragging.current = true;
    lastPlacedAt.current = null;
  }, []);

  const handleGroundDragMove = useCallback(
    (point: THREE.Vector3) => {
      if (!isDragging.current || !brush.type) return;

      if (lastPlacedAt.current) {
        const dist = point.distanceTo(lastPlacedAt.current);
        if (dist < DRAG_MIN_DISTANCE) return;
      }

      const obj = createPlacedObject(brush.type, point, {
        color: brush.color,
        sizeMultiplier: brush.size,
      });
      placeObject(obj);
      lastPlacedAt.current = point.clone();
    },
    [brush, placeObject],
  );

  const handleGroundDragEnd = useCallback(() => {
    isDragging.current = false;
    lastPlacedAt.current = null;
  }, []);

  return {
    brush,
    selectBrush,
    setBrushSize,
    setBrushColor,
    handleGroundClick,
    handleGroundDragStart,
    handleGroundDragMove,
    handleGroundDragEnd,
  };
}
