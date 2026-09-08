import { ICommand } from '../../commands/Command.interface';
import { PlacedObject } from '../../core/types/garden.types';

export type ObjectMove = {
  id: string;
  from: PlacedObject['position'];
  to: PlacedObject['position'];
};

export class MoveObjectsCommand implements ICommand {
  constructor(
    private moves: ObjectMove[],
    private update: (id: string, patch: Partial<PlacedObject>) => void,
  ) {}

  execute(): void {
    for (const m of this.moves) this.update(m.id, { position: m.to });
  }

  undo(): void {
    for (const m of this.moves) this.update(m.id, { position: m.from });
  }
}
