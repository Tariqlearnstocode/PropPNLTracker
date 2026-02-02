'use client';

import { X } from 'lucide-react';
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

  const handleCheckout = async (priceType: 'per_verification' | 'starter' | 'pro') => {
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
      let response;
      if (priceType === 'per_verification') {
        // One-time payment checkout
        response = await fetch('/api/stripe/create-one-time-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // Subscription checkout
        response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: priceType }),
        });
      }

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
    } catch (error) {
      console.error('Checkout error:', error);
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
            <h2 className="text-2xl font-bold text-terminal-text">Transparent Pricing</h2>
            <p className="text-sm text-terminal-muted mt-1">
              No hidden fees. No surprises. Only pay for successful verifications.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-terminal-card-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-terminal-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Per Verification */}
            <div className="border-2 border-terminal-border rounded-xl p-6 hover:border-terminal-muted transition-colors">
              <div className="mb-4">
                <p className="text-sm font-medium text-terminal-muted mb-1">Pay as you go</p>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-terminal-text">$14.99</span>
                  <span className="text-terminal-text text-sm ml-1">per verification</span>
                </div>
                <div className="text-xs text-terminal-muted mt-1">$14.99 per verification</div>
              </div>
              <div className="space-y-2 text-sm text-terminal-text mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>No monthly commitment</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Pay only for what you use</span>
                </div>
              </div>
              <button
                onClick={() => handleCheckout('per_verification')}
                className="w-full py-2.5 bg-terminal-text hover:bg-terminal-text/90 text-terminal-bg font-medium rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Starter */}
            <div className="border-2 border-terminal-border rounded-xl p-6 hover:border-terminal-muted transition-colors">
              <div className="mb-4">
                <p className="text-sm font-medium text-terminal-muted mb-1">Small teams</p>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-terminal-text">$59</span>
                  <span className="text-terminal-text text-sm ml-1">/month</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-terminal-text mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>10 verifications included</span>
                </div>
                <div className="text-xs text-terminal-muted ml-5">$5.90 per verification</div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Overage: $8.99 per additional</span>
                </div>
              </div>
              <button
                onClick={() => handleCheckout('starter')}
                disabled={loading === 'starter'}
                className="w-full py-2.5 bg-profit hover:bg-profit/90 disabled:bg-profit/40 text-terminal-bg font-medium rounded-lg transition-colors"
              >
                {loading === 'starter' ? 'Loading...' : 'Get Started'}
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
                <p className="text-sm font-medium text-terminal-muted mb-1">Growing teams</p>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-terminal-text">$199</span>
                  <span className="text-terminal-text text-sm ml-1">/month</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-terminal-text mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>50 verifications included</span>
                </div>
                <div className="text-xs text-terminal-muted ml-5">$3.98 per verification</div>
                <div className="flex items-center gap-2">
                  <span className="text-profit">✓</span>
                  <span>Overage: $4.99 per additional</span>
                </div>
              </div>
              <button
                onClick={() => handleCheckout('pro')}
                disabled={loading === 'pro'}
                className="w-full py-2.5 bg-terminal-text hover:bg-terminal-text/90 disabled:bg-terminal-muted text-terminal-bg font-medium rounded-lg transition-colors"
              >
                {loading === 'pro' ? 'Loading...' : 'Get Started'}
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
                    <th className="px-6 py-3 text-left text-sm font-semibold text-terminal-text">Pricing</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-terminal-text">Per Verification</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-terminal-text">Starter</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-terminal-text">Pro</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-terminal-text">Enterprise</th>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Verifications included per month</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-muted">Pay as you go</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-terminal-text">10</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-terminal-text">50</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-terminal-text">Custom</td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Cost per report</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-terminal-text">$14.99</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-terminal-text">$5.90</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-terminal-text">$3.98</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-muted">Custom</td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Cost per overage</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-muted">—</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-terminal-text">$8.99</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-terminal-text">$4.99</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-muted">Custom</td>
                  </tr>
                  </thead>
                <tbody className="divide-y divide-terminal-border">
                  {/* Core Features */}
                  <tr className="bg-terminal-card">
                    <td colSpan={5} className="px-6 py-2 bg-terminal-bg">
                      <span className="text-xs font-semibold text-terminal-muted uppercase tracking-wide">Core Features</span>
                    </td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Transaction history</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-text">3 months</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-text">12 months</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-text">12 months</td>
                    <td className="px-6 py-3 text-center text-sm text-terminal-text">12 months</td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Bank-connected income verification</td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Applicant-authorized data access</td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Primary income source detection</td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Payroll vs P2P classification</td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Confidence scoring</td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>

                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Secure data handling (encrypted, auto-deleted)</td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">PDF export</td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>

                  {/* Subscription Features */}
                  <tr className="bg-terminal-card">
                    <td colSpan={5} className="px-6 py-2 bg-terminal-bg">
                      <span className="text-xs font-semibold text-terminal-muted uppercase tracking-wide">Subscription Features</span>
                    </td>
                  </tr>



                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Email verification link to applicant</td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Send invitation reminders</td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Completion notifications (email)</td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Multi-user team access</td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>

                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Verification archive (1 year)</td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-profit">✓</span></td>
                  </tr>
                  <tr className="bg-terminal-card opacity-60">
                    <td className="px-6 py-3 text-sm text-terminal-text flex items-center gap-2">
                      Analytics dashboard
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-900/30 text-yellow-500 rounded">Coming soon</span>
                    </td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                  </tr>
                  <tr className="bg-terminal-card opacity-60">
                    <td className="px-6 py-3 text-sm text-terminal-text flex items-center gap-2">
                      Co-applicant verification
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-900/30 text-yellow-500 rounded">Coming soon</span>
                    </td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                    <td className="px-6 py-3 text-center"><span className="text-terminal-muted">—</span></td>
                  </tr>

                  {/* Enterprise Features */}
                  <tr className="bg-terminal-card">
                    <td colSpan={5} className="px-6 py-2 bg-terminal-bg">
                      <span className="text-xs font-semibold text-terminal-muted uppercase tracking-wide">Enterprise Features</span>
                    </td>
                  </tr>
                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">Custom reports</td>
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
                    <td className="px-6 py-3 text-sm text-terminal-text">Custom branding (logo on verifications)</td>
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

                  <tr className="bg-terminal-card">
                    <td className="px-6 py-3 text-sm text-terminal-text">White-label solution</td>
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
      </div>
    </div>
  );
}
