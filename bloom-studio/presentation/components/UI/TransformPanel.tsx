'use client';

import { PlacedObject, GARDEN_OBJECTS } from '../../../core/types/garden.types';

interface TransformPanelProps {
  selected: PlacedObject | null;
  selectedCount: number;
  onUpdate: (id: string, patch: Partial<PlacedObject>) => void;
  onUpdateAll: (patch: Partial<PlacedObject>) => void;
  onDelete: (id: string) => void;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-white/75 bg-white/62 px-4 py-4 shadow-[0_12px_30px_rgba(99,125,85,0.08)]">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </p>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
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
    <div className="flex flex-col gap-2 rounded-2xl border border-white/70 bg-white/55 px-3 py-3 shadow-[0_8px_20px_rgba(100,126,86,0.06)]">
      <div className="flex justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{value.toFixed(3)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#dde8d9] accent-emerald-500"
      />
    </div>
  );
}

export function TransformPanel({ selected, selectedCount, onUpdate, onUpdateAll, onDelete }: TransformPanelProps) {
  const isMulti = selectedCount > 1;

  if (!selected) {
    return (
      <aside className="flex w-64 items-center justify-center px-4 py-5">
        <div className="rounded-[26px] border border-white/75 bg-white/62 px-6 py-8 text-center shadow-[0_18px_40px_rgba(100,126,86,0.1)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Inspector</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-700">Nothing selected</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Select an object to adjust
            <br />
            scale, rotation, position.
          </p>
        </div>
      </aside>
    );
  }

  const config = GARDEN_OBJECTS.find(o => o.type === selected.type);
  const baseScale = config?.defaultScale ?? 1;
  const scaleMin = baseScale * 0.2;
  const scaleMax = baseScale * 4;
  const scaleStep = baseScale * 0.05;

  const update = (patch: Partial<PlacedObject>) => {
    if (isMulti) {
      onUpdateAll(patch);
    } else {
      onUpdate(selected.id, patch);
    }
  };

  const objectLabel = GARDEN_OBJECTS.find(o => o.type === selected.type)?.label ?? selected.type;

  return (
    <aside className="flex w-64 flex-col gap-4 overflow-y-auto px-4 py-5 text-slate-700">
      <div className="rounded-[26px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,250,245,0.72))] px-4 py-4 shadow-[0_16px_38px_rgba(100,126,86,0.1)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Inspector</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-700">Object settings</h2>
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-full border border-[#d8e4d0] bg-white/85 px-3 py-1.5 text-xs font-medium text-slate-600">
            {objectLabel}
          </span>
          <span className="rounded-full border border-[#e0e7db] bg-[#f7faf4] px-3 py-1.5 text-xs text-slate-500">
            {isMulti ? `${selectedCount} selected` : 'Single edit'}
          </span>
        </div>
      </div>

      {isMulti && (
        <div className="rounded-2xl border border-[#cfe1c6] bg-[linear-gradient(180deg,rgba(236,247,231,0.95),rgba(226,241,220,0.9))] px-3 py-3 text-center text-xs font-medium text-emerald-700 shadow-[0_10px_26px_rgba(101,137,86,0.12)]">
          {selectedCount} objects selected
        </div>
      )}

      <Section title="Transform">
          <Slider
            label="Scale"
            value={selected.scale}
            min={scaleMin}
            max={scaleMax}
            step={scaleStep}
            onChange={v => update({ scale: v })}
          />
          <Slider
            label="Rotation Y"
            value={selected.rotation[1]}
            min={0}
            max={Math.PI * 2}
            step={0.05}
            onChange={v =>
              update({ rotation: [selected.rotation[0], v, selected.rotation[2]] })
            }
          />
      </Section>

      {!isMulti && (
        <Section title="Position">
            <Slider
              label="X"
              value={selected.position[0]}
              min={-28}
              max={28}
              step={0.1}
              onChange={v =>
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
              onChange={v =>
                onUpdate(selected.id, {
                  position: [selected.position[0], selected.position[1], v],
                })
              }
            />
        </Section>
      )}

      {/* {config?.defaultColor !== null && (
        <Section title="Color">
          <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/55 px-3 py-3 shadow-[0_8px_20px_rgba(100,126,86,0.06)]">
            <input
              type="color"
              value={selected.color ?? config?.previewColor ?? '#ffffff'}
              onChange={e => update({ color: e.target.value })}
              className="h-9 w-9 cursor-pointer rounded-full border border-slate-200 bg-transparent"
            />
            <span className="text-xs font-mono text-slate-500">
              {selected.color ?? config?.previewColor ?? '#ffffff'}
            </span>
          </div>
        </Section>
      )} */}

      <button
        type="button"
        onClick={() => onDelete(selected.id)}
        className="mt-auto rounded-2xl border border-[#f0c7c7] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-rose-500 transition-all hover:bg-[#ffeaea]"
      >
        {isMulti ? `Delete ${selectedCount} objects` : 'Delete Object'}
      </button>
    </aside>
  );
}
