import { ICommand, CommandMetadata } from './Command.interface';

type HistoryChangeListener = () => void;

export class CommandHistory {
  private past: ICommand[] = [];
  private future: ICommand[] = [];
  private readonly maxSize: number;
  private listeners: Set<HistoryChangeListener> = new Set();
  private version = 0;

  constructor() {
    this.maxSize = 200;
  }

  subscribe(listener: HistoryChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.version++;
    this.listeners.forEach(listener => listener());
  }

  getVersion(): number {
    return this.version;
  }

  execute(command: ICommand): void {
    command.execute();
    this.past.push(command);

    if (this.past.length > this.maxSize) {
      this.past.shift();
    }
    this.future = [];
    this.notifyListeners();
  }

  push(command: ICommand): void {
    this.past.push(command);

    if (this.past.length > this.maxSize) {
      this.past.shift();
    }
    this.future = [];
    this.notifyListeners();
  }

  undo(): void {
    const command = this.past.pop();
    if (command) {
      command.undo();
      this.future.push(command);
      this.notifyListeners();
    }
  }

  redo(): void {
    const command = this.future.pop();
    if (command) {
      if (command.redo) {
        command.redo();
      } else {
        command.execute();
      }
      this.past.push(command);
      this.notifyListeners();
    }
  }

  clear(): void {
    this.past = [];
    this.future = [];
    this.notifyListeners();
  }

  canUndo(): boolean {
    return this.past.length > 0;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }

  getStatus(): { pastCount: number; futureCount: number } {
    return {
      pastCount: this.past.length,
      futureCount: this.future.length,
    };
  }

  getHistory(): CommandMetadata[] {
    return this.past
      .map(command => command.getMetadata?.())
      .filter((meta): meta is CommandMetadata => meta !== undefined);
  }

  getRecentHistory(count = 10): CommandMetadata[] {
    return this.getHistory().slice(-count).reverse();
  }
}

export const commandHistory = new CommandHistory();
