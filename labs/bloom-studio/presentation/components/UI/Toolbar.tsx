'use client';

interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onCapture: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  objectCount: number;
  notice?: string;
}

function Action({
  onClick,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="pointer-events-auto transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-25"
    >
      {children}
    </button>
  );
}

export function Toolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onCapture,
  onSave,
  onLoad,
  onClear,
  objectCount,
  notice,
}: ToolbarProps) {
  return (
    <div className="flex flex-col items-start gap-2 md:items-end">
      <span className="text-[11px] uppercase tracking-[0.2em] opacity-60">
        {notice ?? ''}
        {!notice && (
          <>
            <span className="font-mono">{objectCount}</span>{' '}
            {objectCount === 1 ? 'object' : 'objects'}
          </>
        )}
      </span>
      <div className="flex gap-5">
        <Action onClick={onUndo} disabled={!canUndo} title="⌘Z">
          Undo
        </Action>
        <Action onClick={onRedo} disabled={!canRedo} title="⌘⇧Z">
          Redo
        </Action>
        <Action onClick={onLoad}>Load</Action>
        <Action onClick={onSave}>Save</Action>
        <Action onClick={onCapture}>Capture</Action>
        <Action onClick={onClear}>Clear</Action>
      </div>
    </div>
  );
}
