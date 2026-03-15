import Link from 'next/link';

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-terminal-bg border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            Start free. Upgrade when you&apos;re ready.
          </h2>
          <p className="text-lg text-terminal-muted">
            No credit card for the free report. Cancel Pro anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Trial */}
          <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
            <div className="mb-6">
              <div className="text-3xl font-bold text-terminal-text mb-2">$0</div>
              <div className="text-lg font-semibold text-terminal-text mb-2">Free Trial</div>
              <div className="text-sm text-terminal-text">Full report. No updates.</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">1 bank account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">3 months history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Full dashboard + breakdowns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terminal-muted mt-0.5 flex-shrink-0">✕</span>
                <span className="text-sm text-terminal-muted">No transaction updates</span>
              </li>
            </ul>
            <Link
              href="/connect"
              className="block w-full text-center px-4 py-2 bg-terminal-bg hover:bg-terminal-card-hover text-terminal-muted hover:text-terminal-text border-2 border-terminal-border rounded-md text-sm font-medium transition-colors"
            >
              Connect Your Bank – Free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-profit/10 rounded-lg border-2 border-profit p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-profit text-terminal-bg px-3 py-1 rounded-full text-xs font-semibold">POPULAR</span>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-terminal-text mb-2">$14.99<span className="text-lg font-normal text-terminal-muted">/mo</span></div>
              <div className="text-sm text-terminal-muted mb-1">or $79/year (save ~$100)</div>
              <div className="text-lg font-semibold text-terminal-text mb-2">Pro</div>
              <div className="text-sm text-terminal-muted">Weekly sync. Always up to date. Cancel anytime.</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Up to 5 bank accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">12 month history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Weekly transaction updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Always up to date</span>
              </li>
            </ul>
            <Link
              href="/connect"
              className="block w-full text-center px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg rounded-md text-sm font-medium transition-colors"
            >
              Go Pro
            </Link>
          </div>

          {/* One-Time Pull */}
          <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
            <div className="mb-6">
              <div className="text-3xl font-bold text-terminal-text mb-2">$19.99</div>
              <div className="text-lg font-semibold text-terminal-text mb-2">One-Time Pull</div>
              <div className="text-sm text-terminal-text">One payment. No subscription. Ideal for tax time.</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Up to 5 bank accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">12 month history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Exportable report</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Single instant snapshot</span>
              </li>
            </ul>
            <Link
              href="/connect"
              className="block w-full text-center px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg rounded-md text-sm font-medium transition-colors"
            >
              Get One-Time Sync
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
