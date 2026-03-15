'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toasts/use-toast';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceType: 'one_time' | 'monthly' | 'lifetime') => {
    if (!user) {
      // Store the selected plan for after sign-in
      sessionStorage.setItem('pendingCheckout', priceType);
      // Close pricing modal and open auth modal
      onClose();
      // Small delay to ensure pricing modal closes first
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'signup' } }));
      }, 100);
      return;
    }

    setLoading(priceType);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: priceType }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create checkout session',
          variant: 'destructive',
        });
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to start checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  if (!isOpen) return null;

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
        toast({
          title: 'Error',
          description: result.error || 'Failed to submit inquiry',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Submitted!',
          description: 'Thank you! We\'ve received your inquiry and will contact you shortly. Check your email for a confirmation and demo scheduling link.',
        });
        setEmail('');
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit inquiry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-terminal-card rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-terminal-border">
        {/* Header */}
        <div className="sticky top-0 bg-terminal-card border-b border-terminal-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-terminal-text">Simple, Transparent Pricing</h2>
            <p className="text-sm text-terminal-muted mt-1">
              One report. Real numbers. Pick your plan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-terminal-card-hover rounded-lg transition-colors"
          >
            <span className="text-terminal-muted text-lg">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* One-Time */}
            <div className="border-2 border-terminal-border rounded-xl p-6 hover:border-terminal-muted transition-colors">
              <div className="mb-4">
                <p className="text-sm font-medium text-terminal-muted mb-1">One-Time</p>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-terminal-text">$39.99</span>
                </div>
                <div className="text-xs text-terminal-muted mt-1">Single snapshot report, no recurring updates</div>
              </div>
              <div className="space-y-2 text-sm text-terminal-text mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Up to 5 bank accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Up to 12 months history</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Exportable report</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Shareable link</span>
                </div>
              </div>
              <button
                onClick={() => handleCheckout('one_time')}
                disabled={loading === 'one_time'}
                className="w-full py-2.5 bg-terminal-text hover:bg-terminal-text/90 disabled:bg-terminal-muted text-terminal-bg font-medium rounded-lg transition-colors"
              >
                {loading === 'one_time' ? 'Loading...' : 'Get Snapshot Report'}
              </button>
            </div>

            {/* Monthly - Most Popular */}
            <div className="border-2 border-profit rounded-xl p-6 relative bg-profit/10 hover:border-profit/80 transition-colors">
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 bg-profit text-terminal-bg text-xs font-medium rounded">
                  POPULAR
                </span>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-terminal-muted mb-1">Monthly</p>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-terminal-text">$14.95</span>
                  <span className="text-terminal-text text-sm ml-1">/mo</span>
                </div>
                <div className="text-xs text-terminal-muted mt-1">Cancel anytime</div>
              </div>
              <div className="space-y-2 text-sm text-terminal-text mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Up to 5 bank accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Up to 12 months history</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Weekly transaction sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Always up to date</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Leaderboard eligible</span>
                </div>
              </div>
              <button
                onClick={() => handleCheckout('monthly')}
                disabled={loading === 'monthly'}
                className="w-full py-2.5 bg-profit hover:bg-profit/90 disabled:bg-profit/40 text-terminal-bg font-medium rounded-lg transition-colors"
              >
                {loading === 'monthly' ? 'Loading...' : 'Start Monthly Plan'}
              </button>
            </div>

            {/* Lifetime - Best Value */}
            <div className="border-2 border-terminal-border rounded-xl p-6 relative hover:border-terminal-muted transition-colors">
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 bg-terminal-text text-terminal-bg text-xs font-medium rounded">
                  BEST VALUE
                </span>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-terminal-muted mb-1">Lifetime</p>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-terminal-text">$199</span>
                </div>
                <div className="text-xs text-terminal-muted mt-1">One-time payment, permanent access</div>
              </div>
              <div className="space-y-2 text-sm text-terminal-text mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Everything in Monthly, forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Permanent weekly syncs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>No recurring charges — ever</span>
                </div>
              </div>
              <button
                onClick={() => handleCheckout('lifetime')}
                disabled={loading === 'lifetime'}
                className="w-full py-2.5 bg-profit hover:bg-profit/90 disabled:bg-profit/40 text-terminal-bg font-medium rounded-lg transition-colors"
              >
                {loading === 'lifetime' ? 'Loading...' : 'Get Lifetime Access'}
              </button>
            </div>
          </div>

          {/* Enterprise Section */}
          <div className="border-2 border-terminal-border rounded-xl p-6 bg-terminal-bg mb-8">
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
                  Volume pricing, team access, and compliance controls for high-throughput verification workflows.
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
              <div className="bg-terminal-card rounded-lg p-5 border border-terminal-border">
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
            <div className="bg-terminal-bg px-6 py-4 border-b border-terminal-border">
              <h3 className="text-lg font-semibold text-terminal-text">Feature Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-terminal-bg border-b border-terminal-border">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-terminal-text">Features</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-terminal-text">One-Time</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-terminal-text">Monthly</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-terminal-text">Lifetime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-terminal-border">
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Price</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-terminal-text">$39.99</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-terminal-text">$14.95/mo</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-terminal-text">$199</td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Bank accounts</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-text">Up to 5</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-text">Up to 5</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-text">Up to 5</td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Transaction history</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-text">Up to 12 months</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-text">Up to 12 months</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-text">Up to 12 months</td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Exportable report</td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Shareable link</td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Weekly transaction sync</td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Leaderboard eligible</td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Recurring charges</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-muted">None</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-text">Monthly</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-muted">None</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
