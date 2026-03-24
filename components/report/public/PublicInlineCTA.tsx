'use client';


interface PublicInlineCTAProps {
  message: string;
  ctaText?: string;
  onGetStarted: () => void;
}

export function PublicInlineCTA({ message, ctaText = 'Start tracking', onGetStarted }: PublicInlineCTAProps) {
  return (
    <div className="my-6 mx-auto max-w-2xl">
      <div className="relative overflow-hidden rounded-xl border border-profit/20 bg-gradient-to-r from-profit/5 via-transparent to-profit/5 p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-terminal-muted font-mono">
            {message}
          </p>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium text-white bg-profit hover:bg-profit/90 rounded-lg transition-colors flex-shrink-0"
          >
            {ctaText}
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
