'use client';

import { TimeScrub } from '@/labs/sea/TimeScrub';
import { useEffect, useMemo, useState } from 'react';
import { useGardenFacade } from '../../application/facade/GardenFacade';
import { GardenScene } from '../components/Canvas/GardenScene';
import { ObjectPanel } from '../components/Panels/ObjectPanel';
import { Toolbar } from '../components/UI/Toolbar';
import { TransformPanel } from '../components/UI/TransformPanel';

export function GardenEditorContainer() {
  const {
    placedObjects,
    selectedId,
    selectedIds,
    brush,
    canUndo,
    canRedo,
    selectBrush,
    handleGroundClick,
    handleGroundDragStart,
    handleGroundDragMove,
    handleGroundDragEnd,
    undo,
    redo,
    saveScene,
    loadScene,
    clearScene,
    capture,
    setRenderer,
    toggleSelectedId,
    clearSelection,
    deleteObject,
    updateObject,
    updateSelected,
    moveObjects,
  } = useGardenFacade();

  const [notice, setNotice] = useState('');
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 1500);
    return () => clearTimeout(t);
  }, [notice]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (selectedIds.length) clearSelection();
      else if (brush.type) selectBrush(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIds.length, brush.type, clearSelection, selectBrush]);

  useEffect(() => {
    if (!capturing) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        capture();
        setNotice('captured');
        setCapturing(false);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [capturing, capture]);

  const announce = (fn: () => void, text: string) => () => {
    fn();
    setNotice(text);
  };

  const hint = selectedIds.length
    ? `${selectedIds.length} selected · drag to move${selectedIds.length === 1 ? ' · ⌫ delete' : ''} · esc`
    : brush.type
      ? 'click to place · drag to paint · esc to orbit'
      : 'pick a flower below · click one to select · shift+click adds';

  const selectedObject = useMemo(
    () => placedObjects.find((o) => o.id === selectedId) ?? null,
    [placedObjects, selectedId],
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      <GardenScene
        brush={capturing ? { ...brush, type: null } : brush}
        placedObjects={placedObjects}
        selectedIds={capturing ? [] : selectedIds}
        onGroundClick={handleGroundClick}
        onGroundDragStart={handleGroundDragStart}
        onGroundDragMove={handleGroundDragMove}
        onGroundDragEnd={handleGroundDragEnd}
        onSelectObject={toggleSelectedId}
        onDeselect={clearSelection}
        onMoveObjects={(moves) => {
          for (const m of moves) updateObject(m.id, { position: m.to });
        }}
        onMoveEnd={moveObjects}
        onRendererReady={setRenderer}
      />

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 pt-16 text-sm text-white mix-blend-difference md:p-10 md:pt-24">
        <p className="self-center text-[11px] uppercase tracking-[0.2em] opacity-60">
          {hint}
        </p>

        <div className="flex flex-col gap-6">
          <TimeScrub className="pointer-events-auto" />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <ObjectPanel selectedType={brush.type} onSelect={selectBrush} />
            <Toolbar
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
              onCapture={() => setCapturing(true)}
              onSave={announce(saveScene, 'saved')}
              onLoad={announce(loadScene, 'loaded')}
              onClear={announce(clearScene, 'cleared')}
              objectCount={placedObjects.length}
              notice={notice}
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-6 z-20 hidden w-48 items-center text-sm text-white mix-blend-difference md:right-10 md:flex">
        <TransformPanel
          selected={selectedObject}
          selectedCount={selectedIds.length}
          onUpdate={updateObject}
          onUpdateAll={updateSelected}
          onDelete={deleteObject}
          onDeselect={clearSelection}
        />
      </div>
    </div>
  );
}
