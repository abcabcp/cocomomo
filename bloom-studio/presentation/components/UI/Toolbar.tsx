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
}

function ToolButton({
  onClick,
  disabled,
  children,
  variant = 'default',
  title,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'default' | 'danger' | 'accent';
  title?: string;
}) {
  const base = 'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all disabled:opacity-35 disabled:cursor-not-allowed';
  const variants = {
    default: 'border border-white/70 bg-white/70 text-slate-600 hover:bg-white hover:text-slate-700 shadow-[0_8px_22px_rgba(94,118,81,0.08)]',
    danger: 'border border-[#f0c7c7] bg-[#fff5f5] text-rose-500 hover:bg-[#ffeaea] shadow-[0_8px_22px_rgba(176,88,88,0.08)]',
    accent: 'border border-[#cde4c4] bg-[linear-gradient(180deg,#eff8ea,#e5f2df)] text-emerald-700 hover:bg-[linear-gradient(180deg,#f5fbf1,#e9f6e3)] shadow-[0_10px_26px_rgba(90,136,78,0.12)]',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${base} ${variants[variant]}`}
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
}: ToolbarProps) {
  return (
    <header className="flex flex-col gap-3 px-3 py-3 md:flex-row md:items-center md:justify-between md:px-5 md:py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-centㅅer justify-center rounded-2xl border border-white/75 bg-white/70 text-base shadow-[0_10px_30px_rgba(95,122,82,0.12)]">🌷</div>
        <div className="mr-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Garden editor</div>
          <div className="text-sm font-semibold text-slate-700">Bloom Studio</div>
        </div>
        <ToolButton onClick={onUndo} disabled={!canUndo} title="Undo (⌘Z)">
          <UndoIcon /> Undo
        </ToolButton>
        <ToolButton onClick={onRedo} disabled={!canRedo} title="Redo (⌘⇧Z)">
          <RedoIcon /> Redo
        </ToolButton>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <span className="rounded-full border border-white/70 bg-white/65 px-3 py-2 text-xs font-medium text-slate-500 shadow-[0_8px_20px_rgba(92,120,79,0.08)]">
          {objectCount} {objectCount === 1 ? 'object' : 'objects'}
        </span>
        <ToolButton onClick={onLoad} title="Load scene">
          <LoadIcon /> Load
        </ToolButton>
        <ToolButton onClick={onSave} variant="accent" title="Save scene">
          <SaveIcon /> Save
        </ToolButton>
        <ToolButton onClick={onCapture} variant="accent" title="Capture PNG">
          <CameraIcon /> Capture
        </ToolButton>
        <ToolButton onClick={onClear} variant="danger" title="Clear all">
          <TrashIcon /> Clear
        </ToolButton>
      </div>
    </header>
  );
}

function UndoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="m15 14 5-5-5-5" />
      <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function LoadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
