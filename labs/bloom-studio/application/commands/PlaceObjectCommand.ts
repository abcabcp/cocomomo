import { ICommand, CommandMetadata } from '../../commands/Command.interface';
import { PlacedObject } from '../../core/types/garden.types';

interface PlaceObjectCommandPayload {
  object: PlacedObject;
  onAdd: (obj: PlacedObject) => void;
  onRemove: (id: string) => void;
}

export class PlaceObjectCommand implements ICommand {
  private object: PlacedObject;
  private onAdd: (obj: PlacedObject) => void;
  private onRemove: (id: string) => void;

  constructor({ object, onAdd, onRemove }: PlaceObjectCommandPayload) {
    this.object = object;
    this.onAdd = onAdd;
    this.onRemove = onRemove;
  }

  execute(): void {
    this.onAdd(this.object);
  }

  undo(): void {
    this.onRemove(this.object.id);
  }

  redo(): void {
    this.onAdd(this.object);
  }

  getMetadata(): CommandMetadata {
    return {
      type: this.object.type === 'tree' ? 'tree' : 'flower',
      color: this.object.color ?? undefined,
      date: new Date().toISOString(),
    };
  }
}
