import Link from 'next/link';
import { Metadata } from 'next';
import { GUIDES } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Prop Firm Trading Guide | How Prop Firms Work, Fees & Real P&L',
  description:
    'Everything you need to know about prop firm costs, profitability, and tracking your real P&L. A free, comprehensive guide for prop traders at every level.',
  openGraph: {
    title: 'Prop Firm Trading Guide | Prop PNL',
    description:
      'Free guide covering how prop firms work, every fee they charge, and how to calculate your real profit and loss. Written for serious prop traders.',
  },
};

export default function GuideHubPage() {
  const sortedGuides = [...GUIDES].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <section
        className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,230,118,0.06) 0%, rgba(0,230,118,0.02) 30%, #0a0a0f 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-mono text-profit mb-4 tracking-wide uppercase">
              Free Guide
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              Prop Firm Trading Guide
            </h1>
            <p className="text-lg text-terminal-muted max-w-2xl mx-auto">
              Everything you need to know about prop firm costs, profitability,
              and tracking your real P&L.
            </p>
          </div>
        </div>
      </section>

      {/* Guide List */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {sortedGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guide/${guide.slug}`}
                    className="block bg-terminal-card rounded-lg border border-terminal-border p-6 sm:p-8 hover:border-profit/30 transition-colors group"
                  >
                    <div className="flex items-start gap-5">
                      {/* Number badge */}
                      <div className="flex-shrink-0 w-12 h-12 bg-profit text-terminal-bg rounded-full flex items-center justify-center text-xl font-bold font-mono">
                        {guide.order}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl flex-shrink-0">{guide.icon}</span>
                          <h2 className="text-xl sm:text-2xl font-bold text-terminal-text group-hover:text-profit transition-colors">
                            {guide.title}
                          </h2>
                        </div>
                        <p className="text-terminal-muted mb-4 leading-relaxed">
                          {guide.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-sm text-terminal-muted font-mono">
                            <span>⏱️</span>
                            {guide.readTime}
                          </span>
                          <span className="flex items-center gap-1 text-sm font-mono text-profit group-hover:gap-2 transition-all">
                            Read guide
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 border-t border-profit/20"
        style={{
          background:
            'linear-gradient(to right, rgba(0,230,118,0.1), rgba(0,230,118,0.05), #0e0e14)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-6 leading-tight">
            Ready to see your real numbers?
          </h2>
          <p className="text-lg text-terminal-muted mb-8 max-w-2xl mx-auto">
            Connect your bank and get your bank-verified prop firm P&L in about
            60 seconds. No spreadsheets. No manual entry.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank — Free
            <span>→</span>
          </Link>
          <p className="text-xs text-terminal-muted font-mono mt-4">
            No card required · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
