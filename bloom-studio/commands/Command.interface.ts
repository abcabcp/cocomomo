export interface CommandMetadata {
  type: 'flower' | 'tree';
  thumbnailUrl?: string;
  category?: string;
  color?: string;
  date: string;
}

export interface ICommand {
  execute(): void;

  undo(): void;

  redo?(): void;

  getMetadata?(): CommandMetadata;
}
