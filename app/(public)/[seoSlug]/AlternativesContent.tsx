import Link from 'next/link';
import Script from 'next/script';
import { getURL } from '@/utils/helpers';
import type { FirmWithAccounts } from '@/lib/firms';
import { getEvalPrice, hasDiscount } from '@/lib/firms';
import { PromoCodeBadge } from '@/components/PromoCodeBadge';

function formatMoney(n: number): string {
  return '$' + n.toLocaleString();
}

function getCheapestEvalPrice(firm: FirmWithAccounts): number {
  if (!firm.firm_accounts || firm.firm_accounts.length === 0) return 0;
  return Math.min(...firm.firm_accounts.map((a) => getEvalPrice(a)));
}

function getDrawdownLabel(firm: FirmWithAccounts): string {
  if (!firm.firm_accounts || firm.firm_accounts.length === 0) return 'Standard';
  const account = firm.firm_accounts[0];
  if (account.drawdown_type === 'Trailing') return 'Trailing';
  if (account.drawdown_type === 'EOD') return 'EOD';
  if (account.drawdown_type === 'Static') return 'Static';
  if (account.drawdown_type === 'Intraday') return 'Intraday';
  if (account.drawdown_type === 'RealTime') return 'Real-Time';
  return 'Standard';
}

function getBestProfitSplit(firm: FirmWithAccounts): string | null {
  if (!firm.firm_accounts || firm.firm_accounts.length === 0) return null;
  const splits = firm.firm_accounts
    .map((a) => a.profit_split)
    .filter((s): s is string => s !== null);
  return splits.length > 0 ? splits[0] : null;
}

function firmHasDiscount(firm: FirmWithAccounts): boolean {
  return firm.firm_accounts.some((a) => hasDiscount(a));
}

function getFirstPromoCode(firm: FirmWithAccounts): string | null {
  for (const a of firm.firm_accounts) {
    if (a.promo_code) return a.promo_code;
  }
  return null;
}

function getKeyDifferentiators(
  focusFirm: FirmWithAccounts,
  altFirm: FirmWithAccounts
): string[] {
  const differentiators: string[] = [];

  const focusEval = getCheapestEvalPrice(focusFirm);
  const altEval = getCheapestEvalPrice(altFirm);
  if (altEval < focusEval) {
    differentiators.push(`Cheaper evals (${formatMoney(altEval)} vs ${formatMoney(focusEval)})`);
  } else if (altEval > focusEval) {
    differentiators.push(`More expensive evals (${formatMoney(altEval)} vs ${formatMoney(focusEval)})`);
  }

  const focusDrawdown = getDrawdownLabel(focusFirm);
  const altDrawdown = getDrawdownLabel(altFirm);
  if (focusDrawdown !== altDrawdown) {
    differentiators.push(`${altDrawdown} drawdown`);
  }

  const focusSplit = getBestProfitSplit(focusFirm);
  const altSplit = getBestProfitSplit(altFirm);
  if (focusSplit && altSplit && focusSplit !== altSplit) {
    differentiators.push(`Profit split: ${altSplit}`);
  }

  if (firmHasDiscount(altFirm) && !firmHasDiscount(focusFirm)) {
    differentiators.push('Promo code available');
  }

  return differentiators.slice(0, 3);
}

function getComparisonUrl(slug1: string, slug2: string): string {
  const slugs = [slug1, slug2].sort();
  return `/${slugs.join('-vs-')}`;
}

export default function AlternativesContent({
  firm,
  alternatives,
  seoSlug,
}: {
  firm: FirmWithAccounts;
  alternatives: FirmWithAccounts[];
  seoSlug: string;
}) {
  const focusEvalPrice = getCheapestEvalPrice(firm);
  const focusDrawdown = getDrawdownLabel(firm);
  const focusSplit = getBestProfitSplit(firm);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${firm.name} Alternatives`,
    description: `Compare ${firm.name} alternatives and competitors`,
    url: getURL(`/${seoSlug}`),
    itemListElement: alternatives.map((alt, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: alt.name,
      url: getURL(`/firms/${alt.slug}`),
    })),
  };

  return (
    <>
      <Script
        id="alternatives-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="min-h-screen bg-terminal-bg text-terminal-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-terminal-muted font-mono">
            <Link href="/firms" className="hover:text-terminal-text transition-colors">
              All Firms
            </Link>
            <span>/</span>
            <Link href={`/firms/${firm.slug}`} className="hover:text-terminal-text transition-colors">
              {firm.name}
            </Link>
            <span>/</span>
            <span>Alternatives</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-mono">
              Best {firm.name} Alternatives
            </h1>
            <p className="text-lg text-terminal-muted max-w-3xl leading-relaxed">
              Looking for an alternative to {firm.name}? Here&apos;s how {firm.name} compares to every other
              verified prop firm in our directory. Compare pricing, rules, profit splits, and payouts to
              find the best fit for your trading style.
            </p>
          </div>

          {/* Focus Firm Summary Card */}
          <div className="mb-16 bg-terminal-card border border-terminal-border rounded-lg p-8">
            <div className="flex items-start gap-6 mb-6">
              {firm.logo_url && (
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={firm.logo_url}
                      alt={firm.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold font-mono mb-2">{firm.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  {firm.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-profit font-mono font-bold">{firm.rating.toFixed(1)}</span>
                      <span className="text-terminal-muted text-sm">/5</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-terminal-bg rounded p-4">
                <div className="text-terminal-muted text-sm mb-2 font-mono">Cheapest Eval</div>
                <div className="text-xl font-bold font-mono text-profit">
                  {formatMoney(focusEvalPrice)}
                </div>
              </div>
              <div className="bg-terminal-bg rounded p-4">
                <div className="text-terminal-muted text-sm mb-2 font-mono">Profit Split</div>
                <div className="text-xl font-bold font-mono">
                  {focusSplit ?? 'Varies'}
                </div>
              </div>
              <div className="bg-terminal-bg rounded p-4">
                <div className="text-terminal-muted text-sm mb-2 font-mono">Drawdown Type</div>
                <div className="text-xl font-bold font-mono">{focusDrawdown}</div>
              </div>
              <div className="bg-terminal-bg rounded p-4">
                <div className="text-terminal-muted text-sm mb-2 font-mono">Platforms</div>
                <div className="text-xl font-bold font-mono">
                  {firm.platforms && firm.platforms.length > 0
                    ? firm.platforms.slice(0, 2).join(', ')
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Alternatives Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold font-mono mb-8">Compare with {alternatives.length} Alternatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternatives.map((alt) => {
                const altEvalPrice = getCheapestEvalPrice(alt);
                const priceDiff = altEvalPrice - focusEvalPrice;
                const differentiators = getKeyDifferentiators(firm, alt);
                const comparisonUrl = getComparisonUrl(firm.slug, alt.slug);
                const promoCode = getFirstPromoCode(alt);

                return (
                  <div
                    key={alt.id}
                    className="bg-terminal-card border border-terminal-border rounded-lg p-6 flex flex-col hover:border-terminal-text transition-colors"
                  >
                    <div className="mb-6">
                      {alt.logo_url && (
                        <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                          <img
                            src={alt.logo_url}
                            alt={alt.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold font-mono mb-2">{alt.name}</h3>
                      {alt.rating && (
                        <div className="flex items-center gap-2">
                          <span className="text-profit font-mono font-bold">{alt.rating.toFixed(1)}</span>
                          <span className="text-terminal-muted text-sm">/5</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-terminal-bg rounded p-4 mb-6">
                      <div className="text-terminal-muted text-sm mb-2 font-mono">Cheapest Eval</div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold font-mono text-profit">
                          {formatMoney(altEvalPrice)}
                        </div>
                        {priceDiff !== 0 && (
                          <div className={`text-sm font-mono ${priceDiff > 0 ? 'text-loss' : 'text-profit'}`}>
                            {priceDiff > 0 ? '+' : ''}
                            {formatMoney(priceDiff)}
                          </div>
                        )}
                      </div>
                    </div>

                    {promoCode && (
                      <div className="mb-4">
                        <PromoCodeBadge code={promoCode} />
                      </div>
                    )}

                    {differentiators.length > 0 && (
                      <div className="mb-6 flex-1">
                        <div className="text-terminal-muted text-sm mb-2 font-mono">Key Differences</div>
                        <ul className="space-y-1">
                          {differentiators.map((diff, idx) => (
                            <li key={idx} className="text-sm text-terminal-text">
                              • {diff}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-terminal-border mt-auto">
                      <Link
                        href={comparisonUrl}
                        className="px-4 py-2 bg-terminal-bg border border-terminal-border rounded text-sm font-mono text-terminal-text hover:bg-terminal-card transition-colors text-center"
                      >
                        Compare
                      </Link>
                      <Link
                        href={`/firms/${alt.slug}`}
                        className="px-4 py-2 bg-profit text-terminal-bg rounded font-mono text-sm font-bold hover:opacity-90 transition-opacity text-center"
                      >
                        View Firm
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-terminal-card border border-terminal-border rounded-lg p-8 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold font-mono mb-4">Want to Compare More Directly?</h2>
              <p className="text-terminal-muted mb-6">
                Head to our full comparison tool to analyze {firm.name} side-by-side with any other prop firm.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/compare"
                  className="px-6 py-3 bg-profit text-terminal-bg rounded font-mono font-bold hover:opacity-90 transition-opacity"
                >
                  Go to Comparisons
                </Link>
                <Link
                  href="/firms"
                  className="px-6 py-3 bg-terminal-bg border border-terminal-border text-terminal-text rounded font-mono font-bold hover:bg-terminal-card transition-colors"
                >
                  Browse All Firms
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center text-terminal-muted text-sm font-mono border-t border-terminal-border pt-8">
            <p>
              Last updated: {new Date().toLocaleDateString()}. Data based on official firm information and
              verified user reviews.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
