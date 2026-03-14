'use client';

import { GARDEN_OBJECTS, ObjectType, GardenObjectConfig } from '../../../core/types/garden.types';

interface ObjectPanelProps {
  selectedType: ObjectType | null;
  onSelect: (type: ObjectType | null) => void;
}

function ObjectCard({ config, isSelected, onClick }: {
  config: GardenObjectConfig;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex min-w-[148px] items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 md:w-full md:min-w-0
        ${isSelected
          ? 'border-[#cfe1c6] bg-[linear-gradient(180deg,rgba(233,246,229,0.95),rgba(222,239,217,0.88))] shadow-[0_10px_28px_rgba(116,150,98,0.18)]'
          : 'border-white/60 bg-white/56 shadow-[0_4px_18px_rgba(104,132,91,0.08)] hover:border-[#d8e4d0] hover:bg-white/78'}
      `}
    >
      <span
        className="h-9 w-9 flex-shrink-0 rounded-full border border-white/70 shadow-sm"
        style={{ backgroundColor: config.previewColor }}
      />
      <span className="text-sm font-medium text-slate-700">{config.label}</span>
      {isSelected && (
        <span className="ml-auto rounded-full bg-white/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">On</span>
      )}
    </button>
  );
}

export function ObjectPanel({ selectedType, onSelect }: ObjectPanelProps) {
  const flowers = GARDEN_OBJECTS.filter(o => o.category === 'flower');
  const trees = GARDEN_OBJECTS.filter(o => o.category === 'tree');

  const handleSelect = (type: ObjectType) => {
    onSelect(selectedType === type ? null : type);
  };

  return (
    <aside className="flex h-full w-full flex-col gap-6 overflow-y-auto px-4 py-4 text-slate-700 md:w-64 md:px-4 md:py-5">
      <div className="px-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Palette</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-700">Garden objects</h2>
        <p className="mt-1 text-sm leading-5 text-slate-500">Pick a flower or tree, then place it directly on the field.</p>
      </div>

      <div>
        <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Flowers
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-2 md:overflow-visible md:pb-0">
          {flowers.map(config => (
            <ObjectCard
              key={config.type}
              config={config}
              isSelected={selectedType === config.type}
              onClick={() => handleSelect(config.type)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Trees
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-2 md:overflow-visible md:pb-0">
          {trees.map(config => (
            <ObjectCard
              key={config.type}
              config={config}
              isSelected={selectedType === config.type}
              onClick={() => handleSelect(config.type)}
            />
          ))}
        </div>
      </div>

      {selectedType && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="mt-auto rounded-2xl border border-[#d7e2d1] bg-white/65 px-3 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-white/85 hover:text-slate-700"
        >
          Clear brush
        </button>
      )}
    </aside>
  );
}
