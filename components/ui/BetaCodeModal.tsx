'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface BetaCodeModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export function BetaCodeModal({ isOpen, onSuccess }: BetaCodeModalProps) {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Request access state
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestName, setRequestName] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestHandle, setRequestHandle] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestName.trim() || !requestEmail.trim()) return;
    setRequestStatus('loading');
    try {
      const handle = requestHandle.trim() ? `X: ${requestHandle.trim()}` : 'No X handle provided';
      const msg = requestMessage.trim() || 'No message';
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: requestName.trim(),
          email: requestEmail.trim(),
          message: `Beta access request. ${handle}. ${msg}`,
        }),
      });

      if (response.ok) {
        setRequestStatus('success');
      } else {
        setRequestStatus('error');
      }
    } catch {
      setRequestStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

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
            className="w-full px-4 py-3 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text placeholder:text-terminal-muted/50 font-mono text-center text-lg tracking-wider focus:outline-none focus:border-profit/50 focus:ring-2 focus:ring-profit/20"
          />

          {status === 'error' && (
            <p className="text-sm text-loss text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !code.trim()}
            className="w-full py-3 bg-profit hover:bg-profit/90 disabled:bg-profit/40 text-white font-medium rounded-lg transition-colors"
          >
            {status === 'loading' ? 'Validating...' : 'Continue'}
          </button>
        </form>

        <div className="mt-6">
          {!showRequestForm ? (
            <button
              onClick={() => {
                setShowRequestForm(true);
                setRequestEmail(user?.email || '');
                setRequestName(user?.user_metadata?.full_name || '');
              }}
              className="w-full flex items-center justify-center gap-2 text-xs text-terminal-muted hover:text-profit transition-colors"
            >
              Need access? <span className="text-profit">Request a code</span> <span className="text-profit">↓</span>
            </button>
          ) : requestStatus === 'success' ? (
            <div className="text-center pt-4 border-t border-terminal-border">
              <p className="text-sm text-profit">Request sent! We&apos;ll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={handleRequestAccess} className="pt-4 border-t border-terminal-border space-y-3">
              <input
                type="text"
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                placeholder="Name"
                required
                className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border rounded-lg text-sm text-terminal-text placeholder:text-terminal-muted/50 focus:outline-none focus:border-profit/50"
              />
              <input
                type="email"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border rounded-lg text-sm text-terminal-text placeholder:text-terminal-muted/50 focus:outline-none focus:border-profit/50"
              />
              <input
                type="text"
                value={requestHandle}
                onChange={(e) => setRequestHandle(e.target.value)}
                placeholder="X handle (optional)"
                className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border rounded-lg text-sm text-terminal-text placeholder:text-terminal-muted/50 focus:outline-none focus:border-profit/50"
              />
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Message (optional)"
                rows={2}
                className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border rounded-lg text-sm text-terminal-text placeholder:text-terminal-muted/50 focus:outline-none focus:border-profit/50 resize-none"
              />
              <button
                type="submit"
                disabled={requestStatus === 'loading' || !requestName.trim() || !requestEmail.trim()}
                className="w-full py-2 text-sm font-medium text-profit border border-profit/30 hover:bg-profit/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {requestStatus === 'loading' ? 'Sending...' : 'Request Beta Access'}
              </button>
              {requestStatus === 'error' && (
                <p className="text-xs text-loss text-center">Something went wrong. Try again.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
