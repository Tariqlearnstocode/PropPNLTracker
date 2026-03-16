'use client';

import { useState } from 'react';

export function PricingSection() {
  const [betaCode, setBetaCode] = useState('');
  const [email, setEmail] = useState('');
  const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleBetaCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!betaCode.trim()) return;
    setCodeStatus('loading');
    try {
      const response = await fetch('/api/beta/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: betaCode.trim() }),
      });
      if (response.ok) {
        setCodeStatus('success');
        // Store beta access and redirect to signup
        sessionStorage.setItem('betaCode', betaCode.trim());
        window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'signup' } }));
      } else {
        setCodeStatus('error');
      }
    } catch {
      setCodeStatus('error');
    }
  };

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setWaitlistStatus('loading');
    try {
      const response = await fetch('/api/beta/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (response.ok) {
        setWaitlistStatus('success');
      } else {
        setWaitlistStatus('error');
      }
    } catch {
      setWaitlistStatus('error');
    }
  };

  return (
    <section id="pricing" className="py-24 bg-terminal-bg border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-terminal-muted">
            One report. Real numbers. Two options.
          </p>
        </div>

        {/* Beta Banner */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-profit/10 border border-profit/30 rounded-lg px-6 py-4 text-center">
            <div className="text-sm font-semibold text-profit mb-1 tracking-wide uppercase">Limited Beta</div>
            <p className="text-sm text-terminal-muted">
              We're testing with a small group before launch. Pricing shown is what it will be. Beta testers get free access.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Snapshot */}
          <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
            <div className="mb-6">
              <div className="text-3xl font-bold text-terminal-text mb-2">$39.99</div>
              <div className="text-lg font-semibold text-terminal-text mb-2">Snapshot</div>
              <div className="text-sm text-terminal-muted">One-time pull of your full history. No syncs, no recurring charges.</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Up to 5 bank accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Full transaction history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Exportable report</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Shareable link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terminal-muted mt-0.5 flex-shrink-0">✕</span>
                <span className="text-sm text-terminal-muted">No future syncs or updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terminal-muted mt-0.5 flex-shrink-0">✕</span>
                <span className="text-sm text-terminal-muted">No reconnection</span>
              </li>
            </ul>
            <div
              className="block w-full text-center px-4 py-2 bg-terminal-bg text-terminal-muted border-2 border-terminal-border rounded-md text-sm font-medium cursor-default opacity-60"
            >
              Coming Soon
            </div>
          </div>

          {/* Lifetime */}
          <div className="bg-profit/10 rounded-lg border-2 border-profit p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-profit text-terminal-bg px-3 py-1 rounded-full text-xs font-semibold">BEST VALUE</span>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-terminal-text mb-2">$97</div>
              <div className="text-sm text-terminal-muted mb-1">one-time payment</div>
              <div className="text-lg font-semibold text-terminal-text mb-2">Lifetime</div>
              <div className="text-sm text-terminal-muted">Your P&L, always up to date. One payment, forever.</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Up to 5 bank accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Full transaction history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Weekly automatic syncs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Reconnect anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Shareable link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Leaderboard eligible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">No recurring charges, ever</span>
              </li>
            </ul>
            <div
              className="block w-full text-center px-4 py-2 bg-profit/40 text-terminal-bg rounded-md text-sm font-medium cursor-default opacity-60"
            >
              Coming Soon
            </div>
          </div>
        </div>

        {/* Beta Code + Waitlist */}
        <div className="max-w-xl mx-auto mt-16 space-y-8">
          {/* Beta Code Input */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-terminal-text mb-2">Have a beta code?</h3>
            <p className="text-sm text-terminal-muted mb-4">Enter your code for free access during the beta.</p>
            <form onSubmit={handleBetaCode} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="text"
                value={betaCode}
                onChange={(e) => {
                  setBetaCode(e.target.value);
                  if (codeStatus !== 'idle') setCodeStatus('idle');
                }}
                placeholder="Enter code"
                className="flex-1 px-4 py-2 bg-terminal-card border border-terminal-border rounded-md text-sm text-terminal-text placeholder:text-terminal-muted/50 focus:outline-none focus:border-profit/50 font-mono"
              />
              <button
                type="submit"
                disabled={codeStatus === 'loading' || !betaCode.trim()}
                className="px-5 py-2 bg-profit hover:bg-profit/90 text-terminal-bg rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {codeStatus === 'loading' ? '...' : 'Submit'}
              </button>
            </form>
            {codeStatus === 'success' && (
              <p className="text-sm text-profit mt-2">You're in! Creating your account...</p>
            )}
            {codeStatus === 'error' && (
              <p className="text-sm text-loss mt-2">Invalid code. Check your code and try again.</p>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-terminal-border" />
            <span className="text-xs text-terminal-muted font-mono">or</span>
            <div className="flex-1 h-px bg-terminal-border" />
          </div>

          {/* Waitlist */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-terminal-text mb-2">Join the waitlist</h3>
            <p className="text-sm text-terminal-muted mb-4">Be the first to know when we launch.</p>
            {waitlistStatus === 'success' ? (
              <p className="text-sm text-profit">You're on the list. We'll be in touch.</p>
            ) : (
              <form onSubmit={handleWaitlist} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 px-4 py-2 bg-terminal-card border border-terminal-border rounded-md text-sm text-terminal-text placeholder:text-terminal-muted/50 focus:outline-none focus:border-profit/50"
                />
                <button
                  type="submit"
                  disabled={waitlistStatus === 'loading' || !email.trim()}
                  className="px-5 py-2 bg-terminal-card hover:bg-terminal-card-hover border border-terminal-border text-terminal-text rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {waitlistStatus === 'loading' ? '...' : 'Notify Me'}
                </button>
              </form>
            )}
            {waitlistStatus === 'error' && (
              <p className="text-sm text-loss mt-2">Something went wrong. Try again.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
