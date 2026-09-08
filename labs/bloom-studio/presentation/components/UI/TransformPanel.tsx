'use client';

import { GARDEN_OBJECTS, PlacedObject } from '../../../core/types/garden.types';

interface TransformPanelProps {
  selected: PlacedObject | null;
  selectedCount: number;
  onUpdate: (id: string, patch: Partial<PlacedObject>) => void;
  onUpdateAll: (patch: Partial<PlacedObject>) => void;
  onDelete: (id: string) => void;
  onDeselect: () => void;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="pointer-events-auto flex flex-col gap-2">
      <span className="flex justify-between text-[11px] uppercase tracking-[0.2em]">
        <span>{label}</span>
        <span className="font-mono opacity-60">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="scrub w-full"
      />
    </label>
  );
}

export function TransformPanel({
  selected,
  selectedCount,
  onUpdate,
  onUpdateAll,
  onDelete,
  onDeselect,
}: TransformPanelProps) {
  if (!selected) return null;

  const isMulti = selectedCount > 1;
  const config = GARDEN_OBJECTS.find((o) => o.type === selected.type);
  const baseScale = config?.defaultScale ?? 1;

  const update = (patch: Partial<PlacedObject>) => {
    if (isMulti) {
      onUpdateAll(patch);
    } else {
      onUpdate(selected.id, patch);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <p>
        {config?.label ?? selected.type}
        {isMulti && <span className="opacity-60"> · {selectedCount}</span>}
      </p>

      <Slider
        label="Scale"
        value={selected.scale}
        min={baseScale * 0.2}
        max={baseScale * 4}
        step={baseScale * 0.05}
        onChange={(v) => update({ scale: v })}
      />
      <Slider
        label="Rotation"
        value={selected.rotation[1]}
        min={0}
        max={Math.PI * 2}
        step={0.05}
        onChange={(v) =>
          update({ rotation: [selected.rotation[0], v, selected.rotation[2]] })
        }
      />

      {!isMulti && (
        <>
          <Slider
            label="X"
            value={selected.position[0]}
            min={-28}
            max={28}
            step={0.1}
            onChange={(v) =>
              onUpdate(selected.id, {
                position: [v, selected.position[1], selected.position[2]],
              })
            }
          />
          <Slider
            label="Z"
            value={selected.position[2]}
            min={-28}
            max={28}
            step={0.1}
            onChange={(v) =>
              onUpdate(selected.id, {
                position: [selected.position[0], selected.position[1], v],
              })
            }
          />
        </>
      )}

      <div className="flex gap-5">
        <button
          type="button"
          onClick={onDeselect}
          className="pointer-events-auto transition-opacity hover:opacity-60"
        >
          Deselect
        </button>
        <button
          type="button"
          onClick={() => onDelete(selected.id)}
          className="pointer-events-auto transition-opacity hover:opacity-60"
        >
          {isMulti ? `Delete ${selectedCount}` : 'Delete'}
        </button>
      </div>
    </div>
  );
}
