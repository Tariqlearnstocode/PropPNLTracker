'use client';


interface ExportBlockedPopupProps {
  open: boolean;
  onClose: () => void;
  onGetStarted?: () => void;
}

export function ExportBlockedPopup({ open, onClose, onGetStarted }: ExportBlockedPopupProps) {
  if (!open) return null;

  const handleCTA = () => {
    onClose();
    onGetStarted?.();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-terminal-card border border-terminal-border rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-terminal-muted hover:text-terminal-text transition-colors"
        >
          <span className="text-lg">✕</span>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-terminal-muted/10 border border-terminal-border rounded-full mb-4">
            <span className="text-terminal-muted">⬇️</span>
            <span className="text-[11px] font-mono font-medium text-terminal-muted uppercase tracking-wider">
              Export
            </span>
          </div>
          <h3 className="text-lg font-semibold text-terminal-text mb-2">
            Create your own report to export
          </h3>
          <p className="text-sm text-terminal-muted leading-relaxed">
            You can&apos;t export this person&apos;s data. Get your own report to export transactions, payouts, and summaries.
          </p>
        </div>

        <button
          onClick={handleCTA}
          className="w-full py-3 px-4 bg-profit hover:bg-profit/90 text-white font-semibold rounded-lg transition-colors text-sm"
        >
          Get my report
        </button>
        <p className="text-center text-[11px] text-terminal-muted mt-2.5 font-mono">
          Snapshot from $39.99 · Lifetime $97
        </p>
      </div>
    </div>
  );
}
