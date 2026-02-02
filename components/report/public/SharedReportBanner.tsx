'use client';

import Image from 'next/image';

interface SharedReportBannerProps {
  displayName?: string | null;
  onGetStarted: () => void;
}

export function SharedReportBanner({ displayName, onGetStarted }: SharedReportBannerProps) {
  return (
    <div className="border-b border-profit/20" style={{ background: 'linear-gradient(to right, rgba(0,230,118,0.1), rgba(0,230,118,0.05), #0e0e14)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="relative flex h-5 w-5">
              <Image src="/logo.svg" alt="" width={20} height={20} className="object-contain" />
            </span>
            <span className="text-xs font-mono font-semibold text-profit tracking-tight">
              Prop PNL
            </span>
          </div>
          <span className="text-terminal-border hidden sm:inline">·</span>
          <span className="text-xs font-mono text-terminal-muted truncate hidden sm:inline">
            {displayName
              ? `${displayName} shared their trading report with you`
              : `You're viewing a shared trading report`
            }
          </span>
        </div>
        <button
          onClick={onGetStarted}
          className="px-3 py-1 text-[11px] font-mono font-medium text-profit border border-profit/30 hover:bg-profit/10 rounded-md transition-colors flex-shrink-0 whitespace-nowrap"
        >
          Create yours free
        </button>
      </div>
    </div>
  );
}
