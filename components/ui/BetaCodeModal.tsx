'use client';

import { useState } from 'react';

interface BetaCodeModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export function BetaCodeModal({ isOpen, onSuccess }: BetaCodeModalProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/beta/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Invalid code');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative bg-terminal-card rounded-2xl max-w-md w-full border border-terminal-border p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-profit/10 border border-profit/20 rounded-full mb-4">
            <span className="text-[11px] font-mono font-medium text-profit uppercase tracking-wider">
              Private Beta
            </span>
          </div>
          <h2 className="text-2xl font-bold text-terminal-text mb-2">Enter your beta code</h2>
          <p className="text-sm text-terminal-muted">
            Prop PNL is in private beta. Enter your code to get free access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              if (status === 'error') setStatus('idle');
            }}
            placeholder="BETA-XXXX"
            autoFocus
            className="w-full px-4 py-3 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text placeholder:text-terminal-muted/50 font-mono text-center text-lg tracking-widest focus:outline-none focus:border-profit/50 focus:ring-2 focus:ring-profit/20"
          />

          {status === 'error' && (
            <p className="text-sm text-loss text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !code.trim()}
            className="w-full py-3 bg-profit hover:bg-profit/90 disabled:bg-profit/40 text-terminal-bg font-medium rounded-lg transition-colors"
          >
            {status === 'loading' ? 'Validating...' : 'Continue'}
          </button>
        </form>

        <p className="text-center text-xs text-terminal-muted mt-6">
          No code?{' '}
          <a
            href="https://x.com/praborntrade"
            target="_blank"
            rel="noopener noreferrer"
            className="text-profit hover:text-profit/80"
          >
            Request access on X
          </a>
        </p>
      </div>
    </div>
  );
}
