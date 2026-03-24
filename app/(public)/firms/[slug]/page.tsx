import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { getURL } from '@/utils/helpers';
import { getCategoryLabel, getAllInPrice, getEvalPrice, getActivationFee, hasEvalDiscount, type FirmAccount, type FirmWithAccounts } from '@/lib/firms';
import { getFirmBySlug } from '@/lib/firms.server';
import { AccountTable } from './account-table';

export const dynamic = 'force-dynamic';

const siteUrl = getURL();

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const firm = await getFirmBySlug(slug);
  if (!firm) return { title: 'Firm Not Found' };

  return {
    title: `${firm.name} Review | Drawdown Rules, Pricing & Payouts | Prop PNL`,
    description: `${firm.name} prop firm review. Compare ${firm.name} evaluation pricing, drawdown rules, consistency rules, profit splits, and payout details.`,
    alternates: {
      canonical: `${siteUrl}/firms/${firm.slug}`,
    },
    openGraph: {
      title: `${firm.name} Review | Prop PNL`,
      description: `${firm.name} prop firm details — pricing, drawdown, rules, and payouts.`,
      url: `${siteUrl}/firms/${firm.slug}`,
      siteName: 'Prop PNL',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${firm.name} Review | Prop PNL`,
      description: `${firm.name} prop firm details — pricing, drawdown, rules, and payouts.`,
      site: '@proppnl',
      creator: '@proppnl',
    },
  };
}

function buildOrganizationSchema(firm: FirmWithAccounts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: firm.name,
    url: firm.website ?? `${siteUrl}/firms/${firm.slug}`,
    ...(firm.logo_url ? { logo: firm.logo_url } : {}),
    ...(firm.founded_year ? { foundingDate: `${firm.founded_year}` } : {}),
    ...(firm.country ? { address: { '@type': 'PostalAddress', addressCountry: firm.country } } : {}),
    ...(firm.rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: firm.rating,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

function buildBreadcrumbSchema(firmName: string, firmSlug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Firms',
        item: `${siteUrl}/firms`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: firmName,
        item: `${siteUrl}/firms/${firmSlug}`,
      },
    ],
  };
}

function buildFaqSchema(firmName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${firmName} a legit prop firm?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We track real bank-verified payouts from ${firmName} traders on our leaderboard. Check the data to see actual payout history and trader performance.`,
        },
      },
      {
        '@type': 'Question',
        name: `What drawdown rules does ${firmName} use?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${firmName}'s drawdown rules vary by account type and size. See the account table above for exact drawdown limits and type (EOD, Trailing, or Static) for each plan.`,
        },
      },
    ],
  };
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-lg ${
            i < fullStars
              ? 'text-profit'
              : i === fullStars && hasHalf
                ? 'text-profit/50'
                : 'text-terminal-border'
          }`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'profit' | 'muted' }) {
  const colors = {
    default: 'bg-terminal-bg border-terminal-border text-terminal-muted',
    profit: 'bg-profit/10 border-profit/20 text-profit',
    muted: 'bg-terminal-card border-terminal-border text-terminal-muted',
  };
  return (
    <span className={`inline-flex items-center text-xs font-mono px-2 py-0.5 rounded border ${colors[variant]}`}>
      {children}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-terminal-border/50 last:border-0">
      <span className="text-terminal-muted font-mono text-sm w-40 flex-shrink-0">{label}</span>
      <span className="text-terminal-text text-sm">{value}</span>
    </div>
  );
}

function RuleStatus({ value }: { value: string | null }) {
  if (!value) return <span className="text-terminal-muted text-sm">N/A</span>;
  const isAllowed = value.toLowerCase().startsWith('allowed') || value.toLowerCase() === 'true';
  const isNotAllowed = value.toLowerCase().startsWith('not allowed') || value.toLowerCase() === 'false';
  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm ${isAllowed ? 'text-profit' : isNotAllowed ? 'text-loss' : 'text-terminal-muted'}`}>
        {isAllowed ? '✓' : isNotAllowed ? '✗' : '—'}
      </span>
      <span className="text-terminal-text text-sm">{value === 'true' ? 'Allowed' : value === 'false' ? 'Not allowed' : value}</span>
    </div>
  );
}

function formatMoney(n: number): string {
  return '$' + n.toLocaleString();
}

function PlatformBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center text-xs font-mono px-3 py-1.5 rounded-md bg-terminal-bg border border-terminal-border text-terminal-text">
      {name}
    </span>
  );
}

export default async function FirmDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const firm = await getFirmBySlug(slug);

  if (!firm) notFound();

  const accounts = firm.firm_accounts;
  const drawdownTypes = Array.from(new Set(accounts.map((a) => a.drawdown_type).filter(Boolean))) as string[];
  const accountTypes = Array.from(new Set(accounts.map((a) => a.account_type)));
  const cheapest = accounts.length > 0
    ? accounts.reduce((min, a) => (getEvalPrice(a) + getActivationFee(a)) < (getEvalPrice(min) + getActivationFee(min)) ? a : min)
    : null;

  // Use first account for firm-level rules (these are the same across all accounts)
  const sampleAccount = accounts[0] as FirmAccount | undefined;

  return (
    <>
      <Script
        id="firm-org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildOrganizationSchema(firm)),
        }}
      />
      <Script
        id="firm-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbSchema(firm.name, firm.slug)),
        }}
      />
      <Script
        id="firm-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqSchema(firm.name)),
        }}
      />
    <div className="min-h-screen bg-terminal-bg">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        <nav className="flex items-center gap-2 text-sm font-mono text-terminal-muted">
          <Link href="/" className="hover:text-profit transition-colors">Home</Link>
          <span>/</span>
          <Link href="/firms" className="hover:text-profit transition-colors">Firms</Link>
          <span>/</span>
          <span className="text-terminal-text">{firm.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Logo */}
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-terminal-card border border-terminal-border flex items-center justify-center overflow-hidden">
              {firm.logo_url ? (
                <img src={firm.logo_url} alt={`${firm.name} logo`} className="w-full h-full object-contain p-3" />
              ) : (
                <span className="text-3xl font-bold font-mono text-profit">
                  {firm.name.slice(0, 2)}
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-terminal-text">{firm.name}</h1>
                <Badge variant="profit">{getCategoryLabel(firm.category)}</Badge>
              </div>

              {firm.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-mono text-terminal-text">{firm.rating}</span>
                  <StarRating rating={firm.rating} />
                </div>
              )}

              {/* Quick stats */}
              <div className="flex flex-wrap gap-3">
                {cheapest && (
                  <div className="bg-terminal-card rounded-lg border border-terminal-border px-4 py-2">
                    <span className="block text-[10px] text-terminal-muted font-mono uppercase">From</span>
                    {hasEvalDiscount(cheapest) ? (
                      <>
                        <span className="text-terminal-muted font-mono line-through text-sm">{formatMoney(cheapest.price ?? 0)}</span>
                        <span className="text-profit font-mono font-bold ml-1">{formatMoney(getEvalPrice(cheapest))}</span>
                      </>
                    ) : (
                      <span className="text-profit font-mono font-bold">{formatMoney(cheapest.price ?? 0)}</span>
                    )}
                  </div>
                )}
                {firm.max_funded_allocation && (
                  <div className="bg-terminal-card rounded-lg border border-terminal-border px-4 py-2">
                    <span className="block text-[10px] text-terminal-muted font-mono uppercase">Max Funded</span>
                    <span className="text-terminal-text font-mono font-bold">{firm.max_funded_allocation}</span>
                  </div>
                )}
                {drawdownTypes.length > 0 && (
                  <div className="bg-terminal-card rounded-lg border border-terminal-border px-4 py-2">
                    <span className="block text-[10px] text-terminal-muted font-mono uppercase">Drawdown</span>
                    <span className="text-terminal-text font-mono font-bold">{drawdownTypes.join(', ')}</span>
                  </div>
                )}
                {accountTypes.length > 0 && (
                  <div className="bg-terminal-card rounded-lg border border-terminal-border px-4 py-2">
                    <span className="block text-[10px] text-terminal-muted font-mono uppercase">Account Types</span>
                    <span className="text-terminal-text font-mono font-bold capitalize">{accountTypes.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Visit site button */}
            {firm.website && (
              <a
                href={firm.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-profit hover:bg-profit/90 text-white font-mono font-medium rounded-lg text-sm transition-colors flex-shrink-0"
              >
                Visit {firm.name} <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Tabbed Account Table (eval ↔ funded) */}
          <div>
            <h2 className="text-2xl font-bold text-terminal-text mb-4">Accounts</h2>
            <AccountTable accounts={accounts} />
          </div>

          {/* Firm details + payout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Firm Details */}
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
              <h3 className="text-lg font-bold text-terminal-text mb-4">Firm Details</h3>
              <div className="space-y-0">
                <InfoRow label="Founded" value={firm.founded_year ? `${firm.founded_year}` : null} />
                <InfoRow label="Country" value={firm.country} />
                <InfoRow label="Founders" value={firm.founders} />
                <InfoRow label="Max Accounts" value={firm.max_funded_accounts ? `${firm.max_funded_accounts} funded accounts` : null} />
                <InfoRow label="Inactivity" value={firm.inactivity_rule} />
                <InfoRow label="Path to Live" value={firm.clear_path_to_live} />
                {sampleAccount && (
                  <>
                    <InfoRow label="News Trading" value={<RuleStatus value={sampleAccount.news_trading} />} />
                    <InfoRow label="Scalping" value={<RuleStatus value={sampleAccount.scalping_rules} />} />
                    <InfoRow label="Algo Trading" value={<RuleStatus value={sampleAccount.algorithmic_trading} />} />
                  </>
                )}
                <InfoRow label="Copy Trading" value={<RuleStatus value={firm.copy_trading} />} />
                {firm.last_verified && (
                  <InfoRow
                    label="Last Verified"
                    value={new Date(firm.last_verified).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  />
                )}
              </div>
            </div>

            {/* Payout & Platforms */}
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
              <h3 className="text-lg font-bold text-terminal-text mb-4">Payout Info</h3>
              <div className="space-y-0">
                <InfoRow label="Profit Split" value={firm.profit_split_note} />
                <InfoRow label="Frequency" value={firm.payout_frequency} />
                {firm.payout_methods.length > 0 && (
                  <InfoRow
                    label="Methods"
                    value={
                      <div className="flex flex-wrap gap-1.5">
                        {firm.payout_methods.map((m) => (
                          <Badge key={m}>{m}</Badge>
                        ))}
                      </div>
                    }
                  />
                )}
              </div>

              <h3 className="text-lg font-bold text-terminal-text mt-8 mb-4">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {firm.platforms.map((p) => (
                  <PlatformBadge key={p} name={p} />
                ))}
              </div>

              {(firm.support_email || firm.support_discord || firm.support_help_url) && (
                <>
                  <h3 className="text-lg font-bold text-terminal-text mt-8 mb-4">Support</h3>
                  <div className="space-y-0">
                    <InfoRow label="Email" value={firm.support_email} />
                    {firm.support_discord && (
                      <InfoRow
                        label="Discord"
                        value={
                          <a href={firm.support_discord} target="_blank" rel="noopener noreferrer" className="text-profit hover:underline">
                            Join Discord
                          </a>
                        }
                      />
                    )}
                    {firm.support_help_url && (
                      <InfoRow
                        label="Help Center"
                        value={
                          <a href={firm.support_help_url} target="_blank" rel="noopener noreferrer" className="text-profit hover:underline">
                            Visit Help Center
                          </a>
                        }
                      />
                    )}
                    <InfoRow label="Live Chat" value={firm.support_live_chat ? 'Available' : null} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-terminal-border">
            <Link
              href="/firms"
              className="text-sm font-mono text-terminal-muted hover:text-profit transition-colors"
            >
              ← Back to all firms
            </Link>
            <Link
              href="/compare"
              className="text-sm font-mono text-terminal-muted hover:text-profit transition-colors"
            >
              Compare {firm.name} with others →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 sm:p-12 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-terminal-text mb-3">
            Track your {firm.name} P&L
          </h2>
          <p className="text-terminal-muted mb-6">
            Connect your bank and see every {firm.name} payout, fee, and withdrawal
            in one verified report. Share it with a link.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-white font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank — Free <span>→</span>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
