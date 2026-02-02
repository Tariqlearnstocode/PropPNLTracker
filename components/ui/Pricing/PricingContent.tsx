'use client';

import { useState } from 'react';

export function PricingContent() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/enterprise/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Failed to submit inquiry');
      } else {
        alert('Thank you! We\'ve received your inquiry and will contact you shortly. Check your email for a confirmation and demo scheduling link.');
        setEmail('');
      }
    } catch (error) {
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-terminal-text mb-3">Transparent Pricing</h1>
        <p className="text-lg text-terminal-text">
          Track your prop trading PNL automatically. Connect your bank and get instant insights.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Free Trial */}
        <div className="border-2 border-terminal-border rounded-xl p-6 hover:border-terminal-muted transition-colors">
          <div className="mb-4">
            <p className="text-sm font-medium text-terminal-muted mb-1">Free Trial</p>
            <div className="mt-2">
              <span className="text-3xl font-bold text-terminal-text">$0</span>
              <span className="text-terminal-text text-sm ml-1">forever</span>
            </div>
            <div className="text-xs text-terminal-muted mt-1">Try it free, no credit card required</div>
          </div>
          <div className="space-y-2 text-sm text-terminal-text mb-6">
            <div className="flex items-center gap-2">
              <span className="text-profit">✓</span>
              <span>1 bank account connection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-profit">✓</span>
              <span>3 months transaction history</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-profit">✓</span>
              <span>All core features</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-loss">✗</span>
              <span className="text-terminal-muted">Transaction updates</span>
            </div>
          </div>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full py-2.5 bg-profit hover:bg-profit/90 text-terminal-bg font-medium rounded-lg transition-colors"
          >
            Get Started Free
          </button>
        </div>

        {/* Pro - Most Popular */}
        <div className="border-2 border-profit rounded-xl p-6 relative bg-profit/10 hover:border-profit/80 transition-colors">
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 bg-profit text-terminal-bg text-xs font-medium rounded">
              ★ Most Popular
            </span>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-terminal-muted mb-1">Pro</p>
            <div className="mt-2">
              <span className="text-3xl font-bold text-terminal-text">$14.99</span>
              <span className="text-terminal-text text-sm ml-1">/month</span>
            </div>
            <div className="text-xs text-terminal-muted mt-1">$79/year (save 56%)</div>
          </div>
          <div className="space-y-2 text-sm text-terminal-text mb-6">
            <div className="flex items-center gap-2">
              <span className="text-profit">✓</span>
              <span>Up to 5 bank accounts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-profit">✓</span>
              <span>12 months transaction history</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-profit">✓</span>
              <span>Weekly transaction updates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-profit">✓</span>
              <span>All core features</span>
            </div>
          </div>
          <button
            onClick={async () => {
              const response = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceType: 'pro' }),
              });
              const result = await response.json();
              if (result.url) {
                window.location.href = result.url;
              }
            }}
            className="w-full py-2.5 bg-profit hover:bg-profit/90 text-terminal-bg font-medium rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>

        {/* One-Time Pull */}
        <div className="border-2 border-terminal-border rounded-xl p-6 hover:border-terminal-muted transition-colors">
          <div className="mb-4">
            <p className="text-sm font-medium text-terminal-muted mb-1">One-Time Pull</p>
            <div className="mt-2">
              <span className="text-3xl font-bold text-terminal-text">$19.99</span>
              <span className="text-terminal-text text-sm ml-1">one-time</span>
            </div>
            <div className="text-xs text-terminal-muted mt-1">No subscription, pay once</div>
          </div>
          <div className="space-y-2 text-sm text-terminal-text mb-6">
            <div className="flex items-center gap-2">
              <span className="text-profit">✓</span>
              <span>Up to 5 bank accounts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-profit">✓</span>
              <span>12 months transaction history</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-profit">✓</span>
              <span>All core features</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-loss">✗</span>
              <span className="text-terminal-muted">Transaction updates</span>
            </div>
          </div>
          <button
            onClick={async () => {
              const response = await fetch('/api/stripe/create-one-time-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
              });
              const result = await response.json();
              if (result.url) {
                window.location.href = result.url;
              }
            }}
            className="w-full py-2.5 bg-profit hover:bg-profit/90 text-terminal-bg font-medium rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Enterprise Section */}
      <div className="border-2 border-terminal-border rounded-xl p-6 bg-terminal-card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Features */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-profit text-terminal-bg text-xs font-medium rounded">
                ✔ Best for teams
              </span>
            </div>
            <h3 className="text-xl font-bold text-terminal-text mb-2">
              Enterprise
            </h3>
            <p className="text-sm text-terminal-text mb-1 font-medium">
              Custom plans for large organizations
            </p>
            <p className="text-sm text-terminal-muted mb-4">
              Custom plans for teams and organizations with advanced tracking needs.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-terminal-text">
              <div className="flex items-center gap-2">
                <span className="text-profit">✔</span>
                <span>Custom monthly limits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-profit">✔</span>
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-profit">✔</span>
                <span>Team access (multi-user)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-profit">✔</span>
                <span>API access (optional)</span>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-terminal-bg rounded-lg p-5 border border-terminal-border">
            <label htmlFor="enterprise-email" className="block text-sm font-medium text-terminal-text mb-2">
              Work email
            </label>
            <form onSubmit={handleEnterpriseSubmit} className="space-y-3">
              <input
                id="enterprise-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email"
                required
                className="w-full px-4 py-2.5 bg-terminal-bg border border-terminal-border rounded-lg focus:outline-none focus:ring-2 focus:ring-profit/30 focus:border-transparent text-terminal-text placeholder-terminal-muted"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-profit hover:bg-profit/90 disabled:bg-profit/40 text-terminal-bg font-medium rounded-lg transition-colors"
              >
                {submitting ? 'Submitting...' : 'Request pricing'}
              </button>
              <div className="text-center">
                <a
                  href={process.env.NEXT_PUBLIC_CALENDLY_LINK || 'https://calendly.com/your-calendly-link'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-profit hover:text-profit/80 hover:underline"
                >
                  Schedule a demo
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="mb-8 border-2 border-terminal-border rounded-xl overflow-hidden">
        <div className="bg-terminal-card-hover px-6 py-4 border-b border-terminal-border">
          <h3 className="text-lg font-semibold text-terminal-text">Feature Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-terminal-card-hover border-b border-terminal-border">
                <th className="px-6 py-3 text-left text-sm font-semibold text-terminal-text">Features</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-terminal-text">Free Trial</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-terminal-text">Pro</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-terminal-text">One-Time</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-terminal-text">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-terminal-border">
              {/* Core Features */}
              <tr className="bg-terminal-card">
                <td colSpan={5} className="px-6 py-2 bg-terminal-card-hover">
                  <span className="text-xs font-semibold text-terminal-muted uppercase tracking-wide">Core Features</span>
                </td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Bank account connections</td>
                <td className="px-6 py-3 text-center text-sm text-terminal-text">1</td>
                <td className="px-6 py-3 text-center text-sm text-terminal-text">Up to 5</td>
                <td className="px-6 py-3 text-center text-sm text-terminal-text">Up to 5</td>
                <td className="px-6 py-3 text-center text-sm text-terminal-text">Custom</td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Transaction history</td>
                <td className="px-6 py-3 text-center text-sm text-terminal-text">3 months</td>
                <td className="px-6 py-3 text-center text-sm text-terminal-text">12 months</td>
                <td className="px-6 py-3 text-center text-sm text-terminal-text">12 months</td>
                <td className="px-6 py-3 text-center text-sm text-terminal-text">12 months</td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Advanced prop firm matching</td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Monthly PNL breakdown</td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Per-prop-firm PNL breakdown</td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Enhanced dashboard with charts</td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">CSV/PDF export</td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Transaction search & filters</td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Shareable public link</td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Transaction updates</td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓ Weekly</span></td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓ Custom</span></td>
              </tr>

              {/* Enterprise Features */}
              <tr className="bg-terminal-card">
                <td colSpan={5} className="px-6 py-2 bg-terminal-card-hover">
                  <span className="text-xs font-semibold text-terminal-muted uppercase tracking-wide">Enterprise Features</span>
                </td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Custom account limits</td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Priority support</td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">Dedicated account manager</td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
              </tr>
              <tr className="bg-terminal-card">
                <td className="px-6 py-3 text-sm text-terminal-text">API access</td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
