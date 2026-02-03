import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { firms, getFirmBySlug, getCategoryLabel } from '@/lib/firms';

interface FirmPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return firms.map((firm) => ({
    slug: firm.slug,
  }));
}

export async function generateMetadata({ params }: FirmPageProps): Promise<Metadata> {
  const { slug } = await params;
  const firm = getFirmBySlug(slug);

  if (!firm) {
    return {
      title: 'Firm Not Found | Prop PNL',
    };
  }

  return {
    title: `Track Your ${firm.name} P&L | Prop PNL`,
    description: `Automatically track ${firm.name} payouts and fees with Prop PNL. Bank-verified P&L for ${getCategoryLabel(firm.category).toLowerCase()} traders. ${firm.description}`,
    openGraph: {
      title: `Track Your ${firm.name} P&L | Prop PNL`,
      description: `Bank-verified P&L tracking for ${firm.name}. Auto-detect payouts via ${firm.payoutProcessor} and fees.`,
    },
  };
}

export default async function FirmPage({ params }: FirmPageProps) {
  const { slug } = await params;
  const firm = getFirmBySlug(slug);

  if (!firm) {
    notFound();
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/firms"
            className="inline-flex items-center gap-2 text-sm text-terminal-muted hover:text-profit transition-colors mb-8"
          >
            <span>←</span>
            All Supported Firms
          </Link>
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-mono px-2 py-0.5 rounded bg-profit/10 text-profit border border-profit/20 mb-4">
              {getCategoryLabel(firm.category)}
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              {firm.name} P&L Tracking
            </h1>
            <p className="text-lg text-terminal-muted max-w-2xl">
              {firm.description}
            </p>
          </div>
        </div>
      </section>

      {/* Firm Details */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Details */}
            <div>
              <h2 className="text-3xl font-bold text-terminal-text mb-8">
                Firm Details
              </h2>
              <div className="space-y-6">
                <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-profit">📊</span>
                    <h3 className="font-semibold text-terminal-text">
                      Category
                    </h3>
                  </div>
                  <p className="text-terminal-muted ml-8">
                    {getCategoryLabel(firm.category)} trading
                  </p>
                </div>

                <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-profit">👛</span>
                    <h3 className="font-semibold text-terminal-text">
                      Payout Processor
                    </h3>
                  </div>
                  <p className="text-terminal-muted ml-8">
                    {firm.payoutProcessor}
                  </p>
                </div>

                <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-profit">💳</span>
                    <h3 className="font-semibold text-terminal-text">
                      Fee Processor
                    </h3>
                  </div>
                  <p className="text-terminal-muted ml-8">
                    {firm.feeProcessor}
                  </p>
                </div>

                <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    {firm.detection === 'auto' ? (
                      <span className="text-profit">✓</span>
                    ) : (
                      <span className="text-terminal-muted">🏷️</span>
                    )}
                    <h3 className="font-semibold text-terminal-text">
                      Detection
                    </h3>
                  </div>
                  <p className="text-terminal-muted ml-8">
                    {firm.detection === 'auto'
                      ? 'Auto-detected from bank transactions'
                      : 'Manual tagging required'}
                  </p>
                </div>

                <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-profit">↗️</span>
                    <h3 className="font-semibold text-terminal-text">
                      Website
                    </h3>
                  </div>
                  <a
                    href={firm.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-profit hover:underline ml-8 text-sm"
                  >
                    {firm.website.replace('https://', '')}
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Fees + Detection */}
            <div>
              <h2 className="text-3xl font-bold text-terminal-text mb-8">
                Typical Fees
              </h2>
              <div className="bg-terminal-card rounded-lg border border-terminal-border p-8 mb-8">
                <p className="text-sm text-terminal-muted mb-4 font-mono uppercase tracking-wide">
                  Costs Prop PNL tracks for {firm.name}
                </p>
                <ul className="space-y-3">
                  {firm.typicalFees.map((fee, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-terminal-text text-sm">{fee}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-terminal-text mb-8">
                How We Detect {firm.name}
              </h2>
              <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
                <p className="text-terminal-text text-sm leading-relaxed mb-4">
                  When you connect your bank account, Prop PNL scans your
                  transaction history for deposits and charges associated with{' '}
                  {firm.name}.
                </p>
                <p className="text-terminal-text text-sm leading-relaxed mb-4">
                  <strong className="text-profit">Payouts</strong> from{' '}
                  {firm.name} appear in your bank as deposits from{' '}
                  <span className="font-mono text-profit">
                    {firm.payoutProcessor}
                  </span>
                  . We match these against known patterns to auto-categorize
                  them as {firm.name} payouts.
                </p>
                <p className="text-terminal-text text-sm leading-relaxed">
                  <strong className="text-profit">Fees</strong> (challenges,
                  subscriptions, resets) are charged via{' '}
                  <span className="font-mono text-profit">
                    {firm.feeProcessor}
                  </span>{' '}
                  and appear as debits. We detect and tag these automatically so
                  you see the true cost of trading with {firm.name}.
                </p>
              </div>
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
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            Track Your {firm.name} P&L
            <span className="block mt-2 text-profit">Free</span>
          </h2>
          <p className="text-lg text-terminal-muted mb-4 max-w-2xl mx-auto">
            Connect your bank and see every {firm.name} payout, fee, and your
            true net profit in about 60 seconds.
          </p>
          <p className="text-sm text-terminal-muted mb-8 font-mono">
            No credit card required. No manual entry.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
            >
              Track Your {firm.name} P&L - Free
              <span>→</span>
            </Link>
            <Link
              href="/firms"
              className="inline-flex items-center px-5 py-2.5 font-mono text-xs font-medium text-profit border border-profit/30 hover:bg-profit/10 rounded-lg transition-colors"
            >
              View All Firms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
