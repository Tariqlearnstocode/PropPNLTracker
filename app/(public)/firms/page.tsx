import Link from 'next/link';
import { Metadata } from 'next';
import { firms, payoutProcessors, getCategoryLabel, getFirmsByProcessor } from '@/lib/firms';

export const metadata: Metadata = {
  title: 'Supported Prop Firms | Prop PNL - P&L Tracker',
  description:
    'See all prop trading firms supported by Prop PNL. We auto-detect payouts and fees from Topstep, FTMO, Apex, Rise, and 15+ more firms. Track your true P&L.',
  openGraph: {
    title: 'Supported Prop Firms | Prop PNL',
    description:
      'Auto-detect payouts and fees from Topstep, FTMO, Apex, Rise, and 15+ more prop firms. Bank-verified P&L tracking.',
  },
};

export default function FirmsPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Hero */}
      <section
        className="pt-20 pb-16 sm:pt-28 sm:pb-20"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,230,118,0.06) 0%, rgba(0,230,118,0.02) 30%, #0a0a0f 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-mono text-profit mb-4 tracking-wide uppercase">
            Supported Firms
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            Supported Prop Firms
          </h1>
          <p className="text-lg text-terminal-muted max-w-2xl mx-auto">
            Prop PNL auto-detects payouts and fees from these prop trading firms
            when you connect your bank. No manual entry required.
          </p>
        </div>
      </section>

      {/* Firms Grid */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-terminal-text mb-2">
              All Firms
            </h2>
            <p className="text-terminal-muted">
              {firms.length} prop firms and counting
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {firms.map((firm) => (
              <Link
                key={firm.slug}
                href={`/firms/${firm.slug}`}
                className="bg-terminal-card rounded-lg border border-terminal-border p-6 hover:border-profit/30 hover:bg-terminal-card-hover transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-terminal-text group-hover:text-profit transition-colors">
                      {firm.name}
                    </h3>
                    <span className="inline-block mt-1 text-xs font-mono px-2 py-0.5 rounded bg-profit/10 text-profit border border-profit/20">
                      {getCategoryLabel(firm.category)}
                    </span>
                  </div>
                  <span className="text-terminal-muted group-hover:text-profit transition-colors mt-1">→</span>
                </div>
                <p className="text-sm text-terminal-muted mb-4 line-clamp-2">
                  {firm.description}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-terminal-muted">
                  <span className="flex items-center gap-1">
                    <span>💳</span>
                    {firm.payoutProcessor}
                  </span>
                  {firm.detection === 'auto' ? (
                    <span className="flex items-center gap-1 text-profit">
                      <span>✓</span>
                      Auto-detected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span>🏷️</span>
                      Manual tag
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Payout Processors */}
      <section className="py-24 bg-terminal-card border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              Payout Processors
            </h2>
            <p className="text-lg text-terminal-muted">
              We detect transactions from these payout processors automatically.
              When a payout arrives from Rise, Wise, or others, Prop PNL
              categorizes it instantly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payoutProcessors
              .filter((p) => p.firmsUsing.length > 0)
              .map((processor) => {
                const processorFirms = getFirmsByProcessor(processor.slug);
                return (
                  <div
                    key={processor.slug}
                    className="bg-terminal-bg rounded-lg border border-terminal-border p-8"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl text-profit">⚡</span>
                      <h3 className="text-xl font-semibold text-terminal-text">
                        {processor.name}
                      </h3>
                    </div>
                    <p className="text-sm text-terminal-muted mb-6">
                      {processor.description}
                    </p>
                    <div>
                      <p className="text-xs font-mono text-terminal-muted mb-2 uppercase tracking-wide">
                        Firms using this processor
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {processorFirms.map((firm) => (
                          <Link
                            key={firm.slug}
                            href={`/firms/${firm.slug}`}
                            className="text-xs px-2 py-1 rounded bg-terminal-card border border-terminal-border text-terminal-text hover:border-profit/30 hover:text-profit transition-colors"
                          >
                            {firm.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl block mx-auto mb-6 text-center">🏢</span>
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            Don&apos;t see your firm?
          </h2>
          <p className="text-lg text-terminal-muted mb-4 max-w-2xl mx-auto">
            We likely still detect it. Prop PNL recognizes transactions from
            most prop firms and payout processors automatically. Connect your
            bank and we&apos;ll find them.
          </p>
          <p className="text-sm text-terminal-muted mb-8 font-mono">
            Any unrecognized transactions can be manually tagged in seconds.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank - Free
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
