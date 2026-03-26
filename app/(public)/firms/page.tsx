import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import { getURL } from '@/utils/helpers';
import { getCategoryLabel, getAllInPrice, getEvalPrice, getActivationFee, hasEvalDiscount, type FirmWithAccounts } from '@/lib/firms';
import { getFirmsWithAccounts } from '@/lib/firms.server';
import { PromoCodeBadge } from '@/components/PromoCodeBadge';

export const dynamic = 'force-dynamic';

const siteUrl = getURL();

export const metadata: Metadata = {
  title: 'Best Prop Trading Firms 2026 | Compare Drawdowns, Fees & Payouts',
  description:
    'Compare the top prop trading firms side by side. Drawdown rules, evaluation pricing, profit splits, platforms, and payout processors — all in one place.',
  alternates: {
    canonical: `${siteUrl}/firms`,
  },
  openGraph: {
    title: 'Best Prop Trading Firms 2026 | Prop PNL',
    description:
      'Compare the top prop trading firms side by side. Drawdown rules, evaluation pricing, profit splits, and platforms.',
    url: `${siteUrl}/firms`,
    siteName: 'Prop PNL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Prop Trading Firms 2026 | Prop PNL',
    description:
      'Compare the top prop trading firms side by side. Drawdown rules, evaluation pricing, profit splits, and platforms.',
    site: '@proppnl',
    creator: '@proppnl',
  },
};

function buildFirmsListSchema(firms: FirmWithAccounts[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Prop Trading Firms 2026',
    description:
      'Directory of top prop trading firms with evaluation pricing, drawdown rules, profit splits, and platform support.',
    url: `${siteUrl}/firms`,
    numberOfItems: firms.length,
    itemListElement: firms.map((firm, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Organization',
        name: firm.name,
        url: firm.website ?? `${siteUrl}/firms/${firm.slug}`,
        ...(firm.logo_url ? { logo: firm.logo_url } : {}),
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
      },
    })),
  };
}

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a prop trading firm?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A prop trading firm (proprietary trading firm) funds traders with its own capital in exchange for a share of the profits. Traders pay for an evaluation challenge, and once they pass, they trade a funded account with the firm\'s money.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I choose the right prop firm?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Compare drawdown type (EOD, trailing, static), evaluation pricing, profit target, profit split, payout frequency, and supported platforms. Also consider consistency rules and maximum funded allocation.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between EOD and trailing drawdown?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'End-of-Day (EOD) drawdown resets to your closing balance each day, while trailing drawdown follows your equity high watermark in real time. EOD is generally more forgiving as intraday dips don\'t permanently move your drawdown floor.',
        },
      },
    ],
  };
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  return (
    <span className="inline-flex items-center gap-0.5 text-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={
            i < fullStars
              ? 'text-profit'
              : i === fullStars && hasHalf
                ? 'text-profit/50'
                : 'text-terminal-border'
          }
        >
          ★
        </span>
      ))}
    </span>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center text-xs font-mono px-2 py-0.5 rounded bg-terminal-bg border border-terminal-border text-terminal-muted">
      {children}
    </span>
  );
}

/** Priority order: ProjectX, Tradovate, Quantower first, then the rest */
function sortPlatforms(platforms: string[]): string[] {
  const priority = ['ProjectX', 'Tradovate', 'Quantower'];
  const prioritized = priority.filter((p) => platforms.includes(p));
  const rest = platforms.filter((p) => !priority.includes(p));
  return [...prioritized, ...rest];
}

function PlatformBadge({ name }: { name: string }) {
  return (
    <span
      className="inline-flex items-center justify-center px-2 h-8 rounded-md bg-terminal-bg border border-terminal-border text-xs font-mono text-terminal-muted whitespace-nowrap"
    >
      {name}
    </span>
  );
}

/** Derive unique account types from a firm's accounts */
function getAccountTypes(firm: FirmWithAccounts): string[] {
  return Array.from(new Set(firm.firm_accounts.map((a) => a.account_type)));
}

/** Derive unique drawdown types from a firm's accounts */
function getDrawdownTypes(firm: FirmWithAccounts): string[] {
  return Array.from(new Set(firm.firm_accounts.map((a) => a.drawdown_type).filter(Boolean))) as string[];
}

/** Get the cheapest account for a firm (uses discounted prices) */
function getCheapestAccount(firm: FirmWithAccounts) {
  return firm.firm_accounts.reduce((min, a) => {
    const total = getEvalPrice(a) + getActivationFee(a);
    const minTotal = getEvalPrice(min) + getActivationFee(min);
    return total < minTotal ? a : min;
  }, firm.firm_accounts[0]);
}

/** Get unique promo codes across a firm's accounts */
function getPromoCodes(firm: FirmWithAccounts): string[] {
  const codes = new Set<string>();
  for (const a of firm.firm_accounts) {
    if (a.promo_code) codes.add(a.promo_code);
  }
  return Array.from(codes);
}

/** Get all unique profit splits across accounts */
function getUniqueProfitSplits(firm: FirmWithAccounts): string[] {
  const splits = firm.firm_accounts.map((a) => a.profit_split).filter(Boolean) as string[];
  return Array.from(new Set(splits));
}

export default async function FirmsPage() {
  const firms = await getFirmsWithAccounts();

  return (
    <>
      <Script
        id="firms-list-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFirmsListSchema(firms)),
        }}
      />
      <Script
        id="firms-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
      />
    <div className="min-h-screen bg-terminal-bg">
      {/* Hero — compact inline bar (matches Leaderboard) */}
      <div className="border-b border-terminal-border bg-gradient-hero-short">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-bold text-terminal-text">
                Prop <span className="text-profit">Firms</span>
              </h1>
            </div>
            <p className="text-xs text-terminal-muted">
              Compare prop firms by drawdown model, payout frequency, pricing, and platform support.
            </p>
          </div>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-4 py-2 bg-profit hover:bg-profit/90 text-white font-mono font-medium rounded-lg text-xs transition-colors"
          >
            Compare Side by Side
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Firms Grid */}
      <section className="py-8 bg-terminal-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {firms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-terminal-muted text-lg">
                Firms directory coming soon. We are verifying data for accuracy.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {firms.map((firm, index) => {
                const cheapest = firm.firm_accounts.length > 0 ? getCheapestAccount(firm) : null;
                const accountTypes = getAccountTypes(firm);
                const drawdownTypes = getDrawdownTypes(firm);
                const profitSplits = getUniqueProfitSplits(firm);
                const promoCodes = getPromoCodes(firm);

                const maxVisible = 3;
                const extraPlatforms =
                  firm.platforms.length > maxVisible
                    ? firm.platforms.length - maxVisible
                    : 0;

                return (
                  <Link
                    key={firm.slug}
                    href={`/firms/${firm.slug}`}
                    className="relative bg-terminal-card rounded-lg border border-terminal-border p-6 sm:p-8 hover:border-profit/30 transition-colors group"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-5">
                      {/* Logo */}
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-900 border border-terminal-border flex items-center justify-center overflow-hidden">
                        {firm.logo_url ? (
                          <img src={firm.logo_url} alt={`${firm.name} logo`} className="w-full h-full object-contain p-2" />
                        ) : (
                          <span className="text-xl sm:text-2xl font-bold font-mono text-profit">
                            {firm.name.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-terminal-text group-hover:text-profit transition-colors">
                          {firm.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          {firm.rating && (
                            <>
                              <span className="text-sm font-mono text-terminal-text">
                                {firm.rating}
                              </span>
                              <StarRating rating={firm.rating} />
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-terminal-muted group-hover:text-profit transition-colors text-xl mt-2 hidden sm:block">
                        →
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-sm">
                      {accountTypes.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-terminal-muted font-mono w-32 flex-shrink-0 whitespace-nowrap">
                            Account type
                          </span>
                          <div className="flex items-center gap-1.5">
                            {accountTypes.map((t) => (
                              <Badge key={t}>{t}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {drawdownTypes.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-terminal-muted font-mono w-32 flex-shrink-0 whitespace-nowrap">
                            Drawdown
                          </span>
                          <div className="flex items-center gap-1.5">
                            {drawdownTypes.map((d) => (
                              <Badge key={d}>{d}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {firm.max_funded_allocation && (
                        <div className="flex items-center gap-2">
                          <span className="text-terminal-muted font-mono w-32 flex-shrink-0 whitespace-nowrap">
                            Max Funded
                          </span>
                          <Badge>{firm.max_funded_allocation}</Badge>
                        </div>
                      )}
                      {profitSplits.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-terminal-muted font-mono w-32 flex-shrink-0 whitespace-nowrap">
                            Profit Split
                          </span>
                          <div className="flex items-center gap-1.5">
                            {profitSplits.map((s) => (
                              <span key={s} className="text-profit font-mono text-xs">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {cheapest && (
                        <div className="flex items-center gap-2">
                          <span className="text-terminal-muted font-mono w-32 flex-shrink-0 whitespace-nowrap">
                            From
                          </span>
                          <span className="font-mono text-xs">
                            {hasEvalDiscount(cheapest) ? (
                              <>
                                <span className="text-terminal-muted line-through">${cheapest.price}</span>
                                <span className="text-profit ml-1">${getEvalPrice(cheapest)}</span>
                              </>
                            ) : (
                              <span className="text-profit">${cheapest.price}</span>
                            )}
                            {(cheapest.activation_fee ?? 0) > 0 && (
                              <span className="text-terminal-muted"> + ${getActivationFee(cheapest)} fee</span>
                            )}
                          </span>
                        </div>
                      )}
                      {promoCodes.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-terminal-muted font-mono w-32 flex-shrink-0 whitespace-nowrap">
                            Promo
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {promoCodes.map((code) => (
                              <PromoCodeBadge key={code} code={code} />
                            ))}
                          </div>
                        </div>
                      )}
                      {firm.platforms.length > 0 && (() => {
                        const sorted = sortPlatforms(firm.platforms);
                        const visible = sorted.slice(0, maxVisible);
                        const extra = sorted.length > maxVisible ? sorted.length - maxVisible : 0;
                        return (
                          <div className="flex items-start gap-2">
                            <span className="text-terminal-muted font-mono w-32 flex-shrink-0 whitespace-nowrap pt-1.5">
                              Platforms
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {visible.map((p) => (
                                <PlatformBadge key={p} name={p} />
                              ))}
                              {extra > 0 && (
                                <span className="inline-flex items-center justify-center px-2 h-8 rounded-md bg-terminal-bg border border-terminal-border text-xs font-mono text-terminal-muted">
                                  +{extra}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Category tag + funded badge + payout */}
                    <div className="mt-5 pt-4 border-t border-terminal-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-profit/10 text-profit border border-profit/20">
                          {getCategoryLabel(firm.category)}
                        </span>
                      </div>
                      {firm.payout_methods.length > 0 && (
                        <span className="text-xs font-mono text-terminal-muted">
                          via {firm.payout_methods[0]}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Cross-links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/leaderboard"
            className="bg-terminal-card border border-terminal-border rounded-lg p-4 hover:border-profit/50 transition-colors text-center"
          >
            <span className="block text-sm font-mono text-profit font-medium">Leaderboard</span>
            <span className="block text-xs text-terminal-muted mt-1">See real trader results</span>
          </Link>
          <Link
            href="/compare"
            className="bg-terminal-card border border-terminal-border rounded-lg p-4 hover:border-profit/50 transition-colors text-center"
          >
            <span className="block text-sm font-mono text-profit font-medium">Compare Firms</span>
            <span className="block text-xs text-terminal-muted mt-1">Side-by-side breakdown</span>
          </Link>
          <Link
            href="/discounts"
            className="bg-terminal-card border border-terminal-border rounded-lg p-4 hover:border-profit/50 transition-colors text-center"
          >
            <span className="block text-sm font-mono text-profit font-medium">Active Deals</span>
            <span className="block text-xs text-terminal-muted mt-1">Promo codes & discounts</span>
          </Link>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 sm:p-12 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-terminal-text mb-3">
            Track your P&L across all these firms
          </h2>
          <p className="text-terminal-muted mb-6">
            Connect your bank and Prop PNL auto-detects payouts and fees from
            every firm on this page. See your real net P&L in 60 seconds.
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
