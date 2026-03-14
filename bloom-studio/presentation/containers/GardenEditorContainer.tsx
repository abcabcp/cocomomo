'use client';

import { useMemo } from 'react';
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
    setBrushColor,
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
  } = useGardenFacade();

  const selectedObject = useMemo(
    () => placedObjects.find(o => o.id === selectedId) ?? null,
    [placedObjects, selectedId],
  );

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-[linear-gradient(180deg,#f7f7f1_0%,#eef4ea_48%,#e6efe4_100%)] text-slate-800">
      <Toolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onCapture={capture}
        onSave={saveScene}
        onLoad={loadScene}
        onClear={clearScene}
        objectCount={placedObjects.length}
      />

      <div className="flex flex-1 flex-col gap-4 overflow-hidden px-3 pb-3 min-h-0 md:flex-row md:px-4 md:pb-4">
        <div className="order-2 max-h-[32vh] rounded-[28px] border border-white/70 bg-white/58 shadow-[0_18px_50px_rgba(106,138,92,0.12)] backdrop-blur-xl overflow-hidden md:order-1 md:max-h-none">
          <ObjectPanel
            selectedType={brush.type}
            onSelect={selectBrush}
          />
        </div>

        <div className="order-1 flex-1 relative min-h-[46vh] md:min-h-0 rounded-[32px] border border-white/75 bg-white/38 p-2.5 md:p-3 shadow-[0_24px_60px_rgba(88,115,77,0.16)] backdrop-blur-xl">
          <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-black/5 bg-[#edf2ea] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          {brush.type && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none md:top-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/78 px-3 py-1.5 text-[10px] font-medium tracking-[0.02em] text-slate-600 shadow-[0_10px_30px_rgba(62,86,56,0.12)] backdrop-blur-md md:px-4 md:py-2 md:text-[11px]">
                Place with left click or drag
              </span>
            </div>
          )}

            <GardenScene
              brush={brush}
              placedObjects={placedObjects}
              selectedIds={selectedIds}
              onGroundClick={handleGroundClick}
              onGroundDragStart={handleGroundDragStart}
              onGroundDragMove={handleGroundDragMove}
              onGroundDragEnd={handleGroundDragEnd}
              onSelectObject={toggleSelectedId}
              onDeselect={clearSelection}
              onRendererReady={setRenderer}
            />
          </div>
        </div>

        <div className="order-3 hidden rounded-[28px] border border-white/70 bg-white/58 shadow-[0_18px_50px_rgba(106,138,92,0.12)] backdrop-blur-xl overflow-hidden md:block">
          <TransformPanel
            selected={selectedObject}
            selectedCount={selectedIds.length}
            onUpdate={updateObject}
            onUpdateAll={updateSelected}
            onDelete={deleteObject}
          />
        </div>
      </div>  
{/* 
      {brush.type && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 rounded-full border border-white/80 bg-white/82 px-3 py-2.5 shadow-[0_16px_45px_rgba(76,104,69,0.18)] backdrop-blur-md md:bottom-8 md:px-4 md:py-3">
          <span className="text-xs font-medium text-slate-500">Brush color</span>
          <input
            type="color"
            value={brush.color ?? '#ffffff'}
            onChange={e => setBrushColor(e.target.value)}
            className="h-7 w-7 cursor-pointer rounded-full border border-slate-200 bg-transparent md:h-8 md:w-8"
          />
        </div>
      )} */}
    </div>
  );
}
