'use client';

import Link from 'next/link';

interface SharingVisibilitySectionProps {
  reportToken: string;
  isPublic: boolean;
  togglingPublic: boolean;
  onTogglePublic: () => void;
  shareSlug: string | null;
  copiedShareLink: boolean;
  onCopyShareLink: () => void;
  displayName: string;
  onDisplayNameChange: (name: string) => void;
  savingDisplayName: boolean;
  onSaveDisplayName: () => void;
  showOnLeaderboard: boolean;
  togglingLeaderboard: boolean;
  onToggleLeaderboard: () => void;
}

export function SharingVisibilitySection({
  reportToken,
  isPublic,
  togglingPublic,
  onTogglePublic,
  shareSlug,
  copiedShareLink,
  onCopyShareLink,
  displayName,
  onDisplayNameChange,
  savingDisplayName,
  onSaveDisplayName,
  showOnLeaderboard,
  togglingLeaderboard,
  onToggleLeaderboard,
}: SharingVisibilitySectionProps) {
  return (
    <div className="bg-terminal-card rounded-xl border border-terminal-border p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-profit-dim rounded-lg flex items-center justify-center">
          <span className="text-profit text-lg">&#x1F517;</span>
        </div>
        <h2 className="text-xl font-semibold text-terminal-text">Sharing & Visibility</h2>
      </div>

      <div className="space-y-5">
        {/* Public toggle */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-terminal-text mb-1">Public report link</p>
            <p className="text-xs text-terminal-muted">
              Allow anyone with your link to view your trading report.
            </p>
          </div>
          <button
            onClick={onTogglePublic}
            disabled={togglingPublic}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
              isPublic ? 'bg-profit' : 'bg-terminal-border'
            } ${togglingPublic ? 'opacity-50' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-terminal-bg transition-transform ${
                isPublic ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Share URL (only when public) */}
        {isPublic && (
          <div>
            <label className="text-sm font-medium text-terminal-text flex items-center gap-2 mb-2">
              Your share link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-terminal-border bg-terminal-bg">
                <span className="text-terminal-muted shrink-0">&#x1F517;</span>
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined'
                    ? `${window.location.origin}/share/${shareSlug || reportToken}`
                    : ''
                  }
                  className="flex-1 min-w-0 bg-transparent text-sm font-mono text-terminal-text outline-none"
                />
              </div>
              <button
                onClick={onCopyShareLink}
                className="px-3 py-2 text-xs font-mono font-medium rounded-lg bg-profit text-terminal-bg hover:bg-profit/90 transition-colors shrink-0"
              >
                {copiedShareLink ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard toggle */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-terminal-text mb-1">Show on public leaderboard</p>
            <p className="text-xs text-terminal-muted">
              Opt in to display your verified P&L on the{' '}
              <Link href="/leaderboard" className="text-profit hover:text-profit/80 underline">
                public leaderboard
              </Link>
              . Only your display name, net P&L, ROI, and firm names are shown.
            </p>
          </div>
          <button
            onClick={onToggleLeaderboard}
            disabled={togglingLeaderboard}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
              showOnLeaderboard ? 'bg-profit' : 'bg-terminal-border'
            } ${togglingLeaderboard ? 'opacity-50' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-terminal-bg transition-transform ${
                showOnLeaderboard ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Display name */}
        <div>
          <label className="text-sm font-medium text-terminal-text flex items-center gap-2 mb-1">
            Display name
          </label>
          <p className="text-xs text-terminal-muted mb-2">
            Shown on your public report and leaderboard. Leave blank to stay anonymous.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              placeholder="e.g. TraderMike"
              className="flex-1 px-3 py-2 text-sm font-mono bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text placeholder:text-terminal-muted focus:outline-none focus:border-profit"
            />
            <button
              onClick={onSaveDisplayName}
              disabled={savingDisplayName}
              className="px-3 py-2 text-xs font-mono font-medium rounded-lg border border-terminal-border text-terminal-text hover:bg-terminal-border/20 transition-colors disabled:opacity-50 shrink-0"
            >
              {savingDisplayName ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
