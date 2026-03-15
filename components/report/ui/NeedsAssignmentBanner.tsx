'use client';

interface NeedsAssignmentBannerProps {
  count: number;
  onReview: () => void;
}

export function NeedsAssignmentBanner({ count, onReview }: NeedsAssignmentBannerProps) {
  if (count === 0) return null;

  return (
    <div className="mb-4 bg-accent-amber/10 border border-accent-amber/30 rounded-xl p-4 flex items-start gap-3">
      <svg className="w-5 h-5 text-accent-amber flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
      <div className="flex-1">
        <div className="text-sm font-medium text-accent-amber mb-0.5">
          {count} transaction{count > 1 ? 's' : ''} need{count === 1 ? 's' : ''} assignment
        </div>
        <div className="text-xs font-mono text-terminal-muted">
          Unassigned transactions aren&apos;t included in your P&L. Assign them to a firm or dismiss if they&apos;re not prop firm related.
        </div>
      </div>
      <button
        onClick={onReview}
        className="px-3 py-1.5 text-xs font-mono font-medium text-accent-amber border border-accent-amber/30 hover:bg-accent-amber/20 rounded-lg transition-colors flex-shrink-0"
      >
        Review
      </button>
    </div>
  );
}
