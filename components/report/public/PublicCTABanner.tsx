'use client';

interface PublicCTABannerProps {
  displayName: string | null | undefined;
  onGetStarted: () => void;
  onDismiss: () => void;
}

export function PublicCTABanner({ displayName, onGetStarted, onDismiss }: PublicCTABannerProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-profit/20 bg-terminal-card/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <p className="text-xs text-terminal-text font-mono font-medium">
            {displayName
              ? `Get your own P&L report like ${displayName}.`
              : 'See your own P&L breakdown — connect your bank in 60 seconds'
            }
          </p>
          <span className="text-[10px] text-terminal-muted font-mono hidden sm:inline flex-shrink-0">
            Snapshot from $39.99
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onGetStarted}
            className="px-4 py-1.5 text-xs font-mono font-medium text-terminal-bg bg-profit hover:bg-profit/90 rounded-md transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={onDismiss}
            className="p-1 text-terminal-muted hover:text-terminal-text transition-colors"
            aria-label="Dismiss banner"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
