'use client';

interface VisibilityControlsProps {
  displayName: string;
  onDisplayNameChange: (name: string) => void;
  onSaveDisplayName: (name: string) => void;
  isPublicToggle: boolean;
  onTogglePublic: () => void;
  togglingPublic: boolean;
  showOnLeaderboard: boolean;
  onToggleLeaderboard: () => void;
  togglingLeaderboard: boolean;
}

export function VisibilityControls({
  displayName,
  onDisplayNameChange,
  onSaveDisplayName,
  isPublicToggle,
  onTogglePublic,
  togglingPublic,
  showOnLeaderboard,
  onToggleLeaderboard,
  togglingLeaderboard,
}: VisibilityControlsProps) {
  return (
    <div className="mb-4 bg-terminal-card border border-terminal-border rounded-xl px-4 py-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-[11px] font-mono text-terminal-muted uppercase tracking-wider">Visibility</span>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-terminal-muted">Display name</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              onBlur={() => onSaveDisplayName(displayName)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSaveDisplayName(displayName); }}
              placeholder="Anonymous"
              className="w-32 px-2 py-1 text-xs font-mono bg-terminal-bg border border-terminal-border rounded text-terminal-text placeholder:text-terminal-muted/50 focus:outline-none focus:border-profit"
            />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <span className="text-xs font-mono text-terminal-muted">Public link</span>
            <button
              onClick={onTogglePublic}
              disabled={togglingPublic}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isPublicToggle ? 'bg-profit' : 'bg-terminal-border'
              } ${togglingPublic ? 'opacity-50' : ''}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                isPublicToggle ? 'translate-x-[18px]' : 'translate-x-[3px]'
              }`} />
            </button>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <span className="text-xs font-mono text-terminal-muted">Leaderboard</span>
            <button
              onClick={onToggleLeaderboard}
              disabled={togglingLeaderboard}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                showOnLeaderboard ? 'bg-profit' : 'bg-terminal-border'
              } ${togglingLeaderboard ? 'opacity-50' : ''}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                showOnLeaderboard ? 'translate-x-[18px]' : 'translate-x-[3px]'
              }`} />
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}
