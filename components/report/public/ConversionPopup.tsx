'use client';

import { useState, useEffect } from 'react';

interface ConversionPopupProps {
  displayName?: string | null;
  onGetStarted: () => void;
}

export function ConversionPopup({ displayName, onGetStarted }: ConversionPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('prop-pnl-popup-dismissed')) {
      setIsDismissed(true);
      return;
    }

    let timeOnPage = 0;
    let hasScrolledEnough = false;

    const checkScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const scrollPercent = window.scrollY / docHeight;
      if (scrollPercent > 0.4) {
        hasScrolledEnough = true;
      }
    };

    const ticker = setInterval(() => {
      timeOnPage++;
      if (timeOnPage >= 8 && hasScrolledEnough) {
        setIsVisible(true);
        clearInterval(ticker);
        window.removeEventListener('scroll', checkScroll);
      }
    }, 1000);

    window.addEventListener('scroll', checkScroll, { passive: true });

    return () => {
      clearInterval(ticker);
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('prop-pnl-popup-dismissed', 'true');
  };

  const handleCTA = () => {
    handleDismiss();
    onGetStarted();
  };

  if (isDismissed || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-terminal-card border border-terminal-border rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl animate-slide-up">
        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-terminal-muted hover:text-terminal-text transition-colors"
        >
          <span className="text-lg">✕</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-profit/10 border border-profit/20 rounded-full mb-4">
            <span className="text-profit">📈</span>
            <span className="text-[11px] font-mono font-medium text-profit uppercase tracking-wider">
              Prop PNL
            </span>
          </div>
          <h3 className="text-lg font-semibold text-terminal-text mb-2">
            {displayName
              ? `${displayName} tracks their P&L with Prop PNL`
              : 'Smart traders track their P&L'
            }
          </h3>
          <p className="text-sm text-terminal-muted leading-relaxed">
            Stop guessing your numbers. Get the same real-time breakdown you just saw — for your own accounts.
          </p>
        </div>

        {/* Value props */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-profit/10 flex items-center justify-center flex-shrink-0">
              <span className="text-profit text-lg">⚡</span>
            </div>
            <div>
              <div className="text-sm font-medium text-terminal-text">Connect in 60 seconds</div>
              <div className="text-xs text-terminal-muted">Link your bank, see your P&L instantly</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-profit/10 flex items-center justify-center flex-shrink-0">
              <span className="text-profit text-lg">🔐</span>
            </div>
            <div>
              <div className="text-sm font-medium text-terminal-text">Bank-level security</div>
              <div className="text-xs text-terminal-muted">Read-only access. Your data stays yours.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-profit/10 flex items-center justify-center flex-shrink-0">
              <span className="text-profit text-lg">📈</span>
            </div>
            <div>
              <div className="text-sm font-medium text-terminal-text">Automatic firm detection</div>
              <div className="text-xs text-terminal-muted">We identify your prop firms and categorize payouts</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleCTA}
          className="w-full py-3 px-4 bg-profit hover:bg-profit/90 text-white font-semibold rounded-lg transition-colors text-sm"
        >
          Start Tracking My P&L
        </button>
        <p className="text-center text-[11px] text-terminal-muted mt-2.5 font-mono">
          Snapshot from $39.99 · Lifetime $97
        </p>
      </div>
    </div>
  );
}
