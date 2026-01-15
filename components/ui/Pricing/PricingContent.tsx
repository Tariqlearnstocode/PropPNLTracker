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
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Transparent Pricing</h1>
        <p className="text-lg text-gray-600">
          Track your prop trading PNL automatically. Connect your bank and get instant insights.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Free Trial */}
        <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500 mb-1">Free Trial</p>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">$0</span>
              <span className="text-gray-600 text-sm ml-1">forever</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Try it free, no credit card required</div>
          </div>
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>1 bank account connection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>3 months transaction history</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>All core features</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500">✗</span>
              <span className="text-gray-400">Transaction updates</span>
            </div>
          </div>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
          >
            Get Started Free
          </button>
        </div>

        {/* Pro - Most Popular */}
        <div className="border-2 border-emerald-500 rounded-xl p-6 relative bg-emerald-50/30 hover:border-emerald-600 transition-colors">
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded">
              ★ Most Popular
            </span>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500 mb-1">Pro</p>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">$14.99</span>
              <span className="text-gray-600 text-sm ml-1">/month</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">$79/year (save 56%)</div>
          </div>
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>Up to 5 bank accounts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>12 months transaction history</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>Weekly transaction updates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
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
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>

        {/* One-Time Pull */}
        <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500 mb-1">One-Time Pull</p>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">$19.99</span>
              <span className="text-gray-600 text-sm ml-1">one-time</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">No subscription, pay once</div>
          </div>
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>Up to 5 bank accounts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>12 months transaction history</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span>All core features</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500">✗</span>
              <span className="text-gray-400">Transaction updates</span>
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
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Enterprise Section */}
      <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Features */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded">
                ✔ Best for teams
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Enterprise
            </h3>
            <p className="text-sm text-gray-600 mb-1 font-medium">
              Custom plans for large organizations
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Custom plans for teams and organizations with advanced tracking needs.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✔</span>
                <span>Custom monthly limits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✔</span>
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✔</span>
                <span>Team access (multi-user)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✔</span>
                <span>API access (optional)</span>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <label htmlFor="enterprise-email" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-medium rounded-lg transition-colors"
              >
                {submitting ? 'Submitting...' : 'Request pricing'}
              </button>
              <div className="text-center">
                <a
                  href={process.env.NEXT_PUBLIC_CALENDLY_LINK || 'https://calendly.com/your-calendly-link'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Schedule a demo
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="mb-8 border-2 border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Feature Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Features</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Free Trial</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Pro</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">One-Time</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Core Features */}
              <tr className="bg-white">
                <td colSpan={5} className="px-6 py-2 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Core Features</span>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Bank account connections</td>
                <td className="px-6 py-3 text-center text-sm text-gray-700">1</td>
                <td className="px-6 py-3 text-center text-sm text-gray-700">Up to 5</td>
                <td className="px-6 py-3 text-center text-sm text-gray-700">Up to 5</td>
                <td className="px-6 py-3 text-center text-sm text-gray-700">Custom</td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Transaction history</td>
                <td className="px-6 py-3 text-center text-sm text-gray-700">3 months</td>
                <td className="px-6 py-3 text-center text-sm text-gray-700">12 months</td>
                <td className="px-6 py-3 text-center text-sm text-gray-700">12 months</td>
                <td className="px-6 py-3 text-center text-sm text-gray-700">12 months</td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Advanced prop firm matching</td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Monthly PNL breakdown</td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Per-prop-firm PNL breakdown</td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Enhanced dashboard with charts</td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">CSV/PDF export</td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Transaction search & filters</td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Shareable public link</td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Transaction updates</td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓ Weekly</span></td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓ Custom</span></td>
              </tr>
              
              {/* Enterprise Features */}
              <tr className="bg-white">
                <td colSpan={5} className="px-6 py-2 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Enterprise Features</span>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Custom account limits</td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Priority support</td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">Dedicated account manager</td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-3 text-sm text-gray-700">API access</td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-gray-400">—</span></td>
                <td className="px-6 py-3 text-center"><span className="text-emerald-500">✓</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
