import { ICommand, CommandMetadata } from '../../commands/Command.interface';
import { PlacedObject } from '../../core/types/garden.types';

interface RemoveObjectCommandPayload {
  object: PlacedObject;
  onAdd: (obj: PlacedObject) => void;
  onRemove: (id: string) => void;
}

export class RemoveObjectCommand implements ICommand {
  private object: PlacedObject;
  private onAdd: (obj: PlacedObject) => void;
  private onRemove: (id: string) => void;

  constructor({ object, onAdd, onRemove }: RemoveObjectCommandPayload) {
    this.object = object;
    this.onAdd = onAdd;
    this.onRemove = onRemove;
  }

  execute(): void {
    this.onRemove(this.object.id);
  }

  undo(): void {
    this.onAdd(this.object);
  }

  redo(): void {
    this.onRemove(this.object.id);
  }

  getMetadata(): CommandMetadata {
    return {
      type:this.object.type === 'tree' ? 'tree' : 'flower',
      color: this.object.color ?? undefined,
      date: new Date().toISOString(),
    };
  }
}
