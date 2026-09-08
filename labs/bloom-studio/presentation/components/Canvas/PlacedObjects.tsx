'use client';

import { PlacedObject } from '../../../core/types/garden.types';
import { PlacedObjectMesh } from './PlacedObjectMesh';

interface Props {
  objects: PlacedObject[];
  selectedIds: string[];
}

export function PlacedObjects({ objects, selectedIds }: Props) {
  return (
    <>
      {objects.map((obj) => (
        <PlacedObjectMesh
          key={obj.id}
          object={obj}
          isSelected={selectedIds.includes(obj.id)}
        />
      ))}
    </>
  );
}
