import Link from 'next/link';

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-terminal-bg border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-terminal-muted">
            One report. Real numbers. Pick your plan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* One-Time */}
          <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
            <div className="mb-6">
              <div className="text-3xl font-bold text-terminal-text mb-2">$39.99</div>
              <div className="text-lg font-semibold text-terminal-text mb-2">One-Time</div>
              <div className="text-sm text-terminal-muted">Single snapshot report. No recurring charges.</div>
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
                <span className="text-sm text-terminal-text">Shareable link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terminal-muted mt-0.5 flex-shrink-0">✕</span>
                <span className="text-sm text-terminal-muted">No recurring updates</span>
              </li>
            </ul>
            <Link
              href="/connect"
              className="block w-full text-center px-4 py-2 bg-terminal-bg hover:bg-terminal-card-hover text-terminal-muted hover:text-terminal-text border-2 border-terminal-border rounded-md text-sm font-medium transition-colors"
            >
              Get Snapshot Report
            </Link>
          </div>

          {/* Monthly */}
          <div className="bg-profit/10 rounded-lg border-2 border-profit p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-profit text-terminal-bg px-3 py-1 rounded-full text-xs font-semibold">POPULAR</span>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-terminal-text mb-2">$14.95<span className="text-lg font-normal text-terminal-muted">/mo</span></div>
              <div className="text-lg font-semibold text-terminal-text mb-2">Monthly</div>
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
                <span className="text-sm text-terminal-text">Weekly transaction sync</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Always up to date</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Shareable link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-terminal-text">Leaderboard eligible</span>
              </li>
            </ul>
            <Link
              href="/connect"
              className="block w-full text-center px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg rounded-md text-sm font-medium transition-colors"
            >
              Start Monthly Plan
            </Link>
          </div>

          {/* Lifetime */}
          <div className="bg-terminal-card rounded-lg border border-terminal-border p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-terminal-text text-terminal-bg px-3 py-1 rounded-full text-xs font-semibold">BEST VALUE</span>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-terminal-text mb-2">$199</div>
              <div className="text-sm text-terminal-muted mb-1">one-time payment</div>
              <div className="text-lg font-semibold text-terminal-text mb-2">Lifetime</div>
              <div className="text-sm text-terminal-muted">Everything in Monthly, forever. No recurring charges.</div>
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
                <span className="text-sm text-terminal-text">Permanent weekly syncs</span>
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
                <span className="text-sm text-terminal-text">No recurring charges — ever</span>
              </li>
            </ul>
            <Link
              href="/connect"
              className="block w-full text-center px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg rounded-md text-sm font-medium transition-colors"
            >
              Get Lifetime Access
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
