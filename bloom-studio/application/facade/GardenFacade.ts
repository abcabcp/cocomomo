'use client';

import { useGardenEditor } from '../hooks/useGardenEditor';
import { useBrush } from '../hooks/useBrush';
import { useCapture } from '../hooks/useCapture';
import { useEditorStore } from '../../stores/editorStore';

export function useGardenFacade() {
  const editor = useGardenEditor();
  const brush = useBrush();
  const capture = useCapture();
  const { updateObject, updateSelected, setSelectedId, toggleSelectedId, clearSelection, selectedIds } = useEditorStore();

  return {
    ...editor,
    brush: brush.brush,
    selectBrush: brush.selectBrush,
    setBrushSize: brush.setBrushSize,
    setBrushColor: brush.setBrushColor,
    handleGroundClick: brush.handleGroundClick,
    handleGroundDragStart: brush.handleGroundDragStart,
    handleGroundDragMove: brush.handleGroundDragMove,
    handleGroundDragEnd: brush.handleGroundDragEnd,
    setRenderer: capture.setRenderer,
    capture: capture.capture,
    updateObject,
    updateSelected,
    setSelectedId,
    selectedIds,
    toggleSelectedId,
    clearSelection,
  };
}
