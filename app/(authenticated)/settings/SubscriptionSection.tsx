'use client';

import Link from 'next/link';

interface SubscriptionData {
  hasSubscription: boolean;
  plan: string;
  status: string | null;
  isLifetime?: boolean;
}

interface SubscriptionSectionProps {
  subscription: SubscriptionData | null;
  loading: boolean;
  formatDate: (dateString: string | null) => string;
}

const planLabels: Record<string, string> = {
  snapshot: 'Snapshot',
  one_time: 'Snapshot',
  lifetime: 'Lifetime',
  none: 'No Plan',
};

const statusLabels: Record<string, { label: string; className: string }> = {
  lifetime: { label: 'Lifetime', className: 'bg-profit/20 text-profit' },
  snapshot: { label: 'Active', className: 'bg-profit/20 text-profit' },
  one_time: { label: 'Active', className: 'bg-profit/20 text-profit' },
};

export function SubscriptionSection({ subscription, loading }: SubscriptionSectionProps) {
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
            {plan === 'lifetime' && (
              <div>
                <label className="text-sm text-terminal-muted mb-1 block">Access</label>
                <p className="text-terminal-text text-sm font-medium">Permanent, never expires</p>
              </div>
            )}

            {(plan === 'snapshot' || plan === 'one_time') && (
              <div>
                <label className="text-sm text-terminal-muted mb-1 block">Access</label>
                <p className="text-terminal-text text-sm font-medium">Single snapshot report</p>
              </div>
            )}

            <div>
              <label className="text-sm text-terminal-muted mb-1 block">Price</label>
              <p className="text-terminal-text text-sm font-medium">
                {(plan === 'snapshot' || plan === 'one_time') && '$39.99 (one-time)'}
                {plan === 'lifetime' && '$97 (one-time)'}
              </p>
            </div>
          </div>

          {/* Upgrade CTA for snapshot users */}
          {(plan === 'snapshot' || plan === 'one_time') && (
            <div className="pt-2">
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg font-medium rounded-lg text-sm transition-colors"
              >
                Upgrade to Lifetime — $97
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
