'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toasts/use-toast';

interface SubscriptionData {
  hasSubscription: boolean;
  plan: string;
  status: string | null;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  isLifetime?: boolean;
}

interface SubscriptionSectionProps {
  subscription: SubscriptionData | null;
  loading: boolean;
  formatDate: (dateString: string | null) => string;
}

const planLabels: Record<string, string> = {
  one_time: 'One-Time Snapshot',
  monthly: 'Monthly',
  lifetime: 'Lifetime',
  none: 'No Plan',
};

const statusLabels: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-profit/20 text-profit' },
  lifetime: { label: 'Lifetime', className: 'bg-profit/20 text-profit' },
  one_time: { label: 'Active', className: 'bg-profit/20 text-profit' },
  past_due: { label: 'Past Due', className: 'bg-yellow-500/20 text-yellow-400' },
  canceled: { label: 'Canceled', className: 'bg-loss/20 text-loss' },
};

export function SubscriptionSection({ subscription, loading, formatDate }: SubscriptionSectionProps) {
  const { toast } = useToast();
  const [managingBilling, setManagingBilling] = useState(false);

  const handleManageBilling = async () => {
    setManagingBilling(true);
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to open billing portal',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to open billing portal',
        variant: 'destructive',
      });
    } finally {
      setManagingBilling(false);
    }
  };

  const plan = subscription?.plan || 'none';
  const status = subscription?.status || null;
  const statusInfo = status ? statusLabels[status] || { label: status, className: 'bg-terminal-border text-terminal-muted' } : null;

  return (
    <div className="bg-terminal-card rounded-xl border border-terminal-border p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-profit-dim rounded-lg flex items-center justify-center">
          <span className="text-profit text-lg">💳</span>
        </div>
        <h2 className="text-xl font-semibold text-terminal-text">Subscription</h2>
      </div>

      {loading ? (
        <div className="text-terminal-muted text-sm">Loading...</div>
      ) : !subscription?.hasSubscription ? (
        <div className="space-y-3">
          <p className="text-terminal-muted text-sm">No active plan.</p>
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg font-medium rounded-lg text-sm transition-colors"
          >
            View Plans
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Plan + Status row */}
          <div className="flex items-center gap-3">
            <div>
              <label className="text-sm font-medium text-terminal-muted mb-1 block">Plan</label>
              <p className="text-terminal-text font-semibold text-lg">
                {planLabels[plan] || plan}
              </p>
            </div>
            {statusInfo && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium mt-4 ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
            )}
          </div>

          {/* Plan details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-terminal-border">
            {plan === 'monthly' && subscription.currentPeriodEnd && (
              <div>
                <label className="text-sm text-terminal-muted mb-1 block">
                  {subscription.cancelAtPeriodEnd ? 'Access Until' : 'Next Billing Date'}
                </label>
                <p className="text-terminal-text text-sm font-medium">
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            )}

            {plan === 'monthly' && subscription.cancelAtPeriodEnd && (
              <div>
                <p className="text-yellow-400 text-sm">
                  Your subscription is set to cancel at the end of the current period.
                </p>
              </div>
            )}

            {plan === 'lifetime' && (
              <div>
                <label className="text-sm text-terminal-muted mb-1 block">Access</label>
                <p className="text-terminal-text text-sm font-medium">Permanent, never expires</p>
              </div>
            )}

            {plan === 'one_time' && (
              <div>
                <label className="text-sm text-terminal-muted mb-1 block">Access</label>
                <p className="text-terminal-text text-sm font-medium">Single snapshot report</p>
              </div>
            )}

            <div>
              <label className="text-sm text-terminal-muted mb-1 block">Price</label>
              <p className="text-terminal-text text-sm font-medium">
                {plan === 'one_time' && '$39.99'}
                {plan === 'monthly' && '$14.95/mo'}
                {plan === 'lifetime' && '$199 (one-time)'}
              </p>
            </div>
          </div>

          {/* Manage billing (monthly only) */}
          {plan === 'monthly' && (
            <div className="pt-2">
              <button
                onClick={handleManageBilling}
                disabled={managingBilling}
                className="px-4 py-2 text-sm font-medium text-terminal-text border border-terminal-border rounded-lg hover:bg-terminal-border/20 transition-colors disabled:opacity-50"
              >
                {managingBilling ? 'Loading...' : 'Manage Billing'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
