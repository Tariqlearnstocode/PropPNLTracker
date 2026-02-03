'use client';

import { useState, useEffect } from 'react';

// Simple social icons (inline SVG for consistency)
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
  /** When provided, show "Customize link" section (auth view) */
  reportToken?: string;
  shareSlug?: string | null;
  onShareSlugSave?: (slug: string | null) => Promise<void>;
}

export function ShareModal({
  open,
  onClose,
  shareUrl,
  reportToken = '',
  shareSlug = null,
  onShareSlugSave,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [slug, setSlug] = useState(shareSlug ?? '');
  const [saving, setSaving] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSlug(shareSlug ?? '');
      setSlugError(null);
      setCopied(false);
    }
  }, [open, shareSlug]);

  const handleCopy = async () => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const encodedUrl = typeof window !== 'undefined' ? encodeURIComponent(shareUrl || window.location.href) : '';
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=My%20prop%20trading%20report`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const handleSaveSlug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onShareSlugSave) return;
    setSlugError(null);
    const value = slug.trim().toLowerCase();
    setSaving(true);
    try {
      await onShareSlugSave(value || null);
    } catch (err) {
      setSlugError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/` : '';
  const baseUrlNoProtocol = typeof window !== 'undefined' ? `${window.location.host}/share/` : '';
  const canCustomize = !!onShareSlugSave && !!reportToken;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-terminal-card border border-terminal-border rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-terminal-muted hover:text-terminal-text transition-colors"
        >
          <span className="text-lg">✕</span>
        </button>

        <h3 className="text-lg font-semibold text-terminal-text mb-4">Share</h3>

        <p className="text-xs font-mono text-terminal-muted uppercase tracking-wider mb-2">Share this link via</p>
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={handleCopy}
            className="w-10 h-10 rounded-full border border-terminal-border flex items-center justify-center text-terminal-muted hover:text-terminal-text hover:border-terminal-border-light transition-colors"
            title="Copy link"
          >
            <span>📋</span>
          </button>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-terminal-border flex items-center justify-center text-terminal-muted hover:text-terminal-text hover:border-terminal-border-light transition-colors"
            title="Share on X"
          >
            <TwitterIcon className="w-4 h-4" />
          </a>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-terminal-border flex items-center justify-center text-terminal-muted hover:text-terminal-text hover:border-terminal-border-light transition-colors"
            title="Share on LinkedIn"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>
        </div>

        <div className="border-t border-terminal-border pt-4">
          <p className="text-xs font-mono text-terminal-muted uppercase tracking-wider mb-2">Or copy link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-terminal-border bg-terminal-bg">
              <span className="text-terminal-muted shrink-0">🔗</span>
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 min-w-0 bg-transparent text-sm font-mono text-terminal-text outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 text-xs font-mono font-medium rounded-lg bg-profit text-terminal-bg hover:bg-profit/90 transition-colors shrink-0"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {canCustomize && (
          <form onSubmit={handleSaveSlug} className="mt-4 pt-4 border-t border-terminal-border">
            <p className="text-xs font-mono text-terminal-muted uppercase tracking-wider mb-2">Customize link</p>
            <p className="text-xs text-terminal-muted mb-2">
              Use a short slug (e.g. <span className="font-mono text-terminal-text">johns-trading</span>). Letters, numbers, hyphens only (2–50 chars).
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-terminal-muted font-mono shrink-0">{baseUrlNoProtocol}</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. johns-trading"
                className="flex-1 px-3 py-2 text-sm font-mono bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text placeholder:text-terminal-muted focus:outline-none focus:border-profit"
                autoComplete="off"
              />
            </div>
            {slugError && <p className="text-xs text-loss mb-2">{slugError}</p>}
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-terminal-border text-terminal-text hover:bg-terminal-border/20 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save custom link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
