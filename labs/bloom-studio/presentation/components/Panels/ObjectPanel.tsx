'use client';

import { GARDEN_OBJECTS, ObjectType } from '../../../core/types/garden.types';

interface ObjectPanelProps {
  selectedType: ObjectType | null;
  onSelect: (type: ObjectType | null) => void;
}

export function ObjectPanel({ selectedType, onSelect }: ObjectPanelProps) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {GARDEN_OBJECTS.map((config) => {
        const active = selectedType === config.type;
        return (
          <button
            key={config.type}
            type="button"
            onClick={() => onSelect(active ? null : config.type)}
            className={`pointer-events-auto flex items-center gap-2 transition-opacity hover:opacity-100 ${active ? 'opacity-100' : 'opacity-50'}`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: config.previewColor }}
            />
            <span className={active ? 'underline underline-offset-4' : ''}>
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
