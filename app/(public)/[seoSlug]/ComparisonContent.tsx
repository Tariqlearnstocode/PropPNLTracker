import Link from 'next/link';
import Script from 'next/script';
import { getURL } from '@/utils/helpers';
import {
  getEvalPrice,
  hasEvalDiscount,
  getActivationFee,
  hasActivationDiscount,
  type FirmWithAccounts,
} from '@/lib/firms';
import { PromoCodeBadge } from '@/components/PromoCodeBadge';

const siteUrl = getURL();

function formatMoney(n: number): string {
  return '$' + n.toLocaleString();
}

function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'profit' | 'muted' | 'warning';
}) {
  const colors = {
    default: 'bg-terminal-bg border-terminal-border text-terminal-muted',
    profit: 'bg-profit/10 border-profit/20 text-profit',
    muted: 'bg-terminal-card border-terminal-border text-terminal-muted',
    warning: 'bg-accent-amber/10 border-accent-amber/20 text-accent-amber',
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-mono px-2 py-0.5 rounded border ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

function FirmCard({ firm }: { firm: FirmWithAccounts }) {
  return (
    <div className="bg-terminal-card border border-terminal-border rounded-lg p-6">
      {/* Logo & Name */}
      <div className="mb-6">
        {firm.logo_url ? (
          <div className="mb-3 bg-gray-900 rounded p-3 inline-block">
            <img
              src={firm.logo_url}
              alt={firm.name}
              className="h-16 object-contain"
            />
          </div>
        ) : (
          <div className="mb-3 bg-gray-900 rounded p-3 inline-block h-20 w-20 flex items-center justify-center">
            <span className="text-terminal-muted text-xs font-mono">Logo</span>
          </div>
        )}
        <h2 className="text-xl font-bold text-terminal-text mt-3">{firm.name}</h2>
      </div>

      {/* Rating */}
      {firm.rating != null && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => {
              const rating = firm.rating!;
              return (
                <span
                  key={i}
                  className={`text-lg ${
                    i < Math.floor(rating)
                      ? 'text-profit'
                      : i === Math.floor(rating) &&
                          rating - Math.floor(rating) >= 0.3
                        ? 'text-profit/50'
                        : 'text-terminal-border'
                  }`}
                >
                  ★
                </span>
              );
            })}
          </span>
          <span className="text-terminal-muted text-sm font-mono ml-2">
            {firm.rating.toFixed(1)}/5
          </span>
        </div>
      )}

      {/* Key Details */}
      <div className="space-y-3 text-sm">
        {firm.country && (
          <div>
            <span className="text-terminal-muted">Country:</span>
            <span className="ml-2 text-terminal-text font-mono">{firm.country}</span>
          </div>
        )}
        {firm.founded_year && (
          <div>
            <span className="text-terminal-muted">Founded:</span>
            <span className="ml-2 text-terminal-text font-mono">{firm.founded_year}</span>
          </div>
        )}
        {firm.platforms && firm.platforms.length > 0 && (
          <div>
            <span className="text-terminal-muted">Platforms:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {firm.platforms.map((platform) => (
                <Badge key={platform}>{platform}</Badge>
              ))}
            </div>
          </div>
        )}
        {firm.payout_methods && firm.payout_methods.length > 0 && (
          <div>
            <span className="text-terminal-muted">Payout Methods:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {firm.payout_methods.map((method) => (
                <Badge key={method} variant="profit">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {firm.profit_split_note && (
          <div>
            <span className="text-terminal-muted">Profit Split:</span>
            <span className="ml-2 text-terminal-text font-mono text-xs">
              {firm.profit_split_note}
            </span>
          </div>
        )}
      </div>

      {/* Link to firm page */}
      <Link
        href={`/firms/${firm.slug}`}
        className="mt-6 inline-block text-profit hover:text-profit/80 text-sm font-mono underline"
      >
        View full details →
      </Link>
    </div>
  );
}

function getMatchingAccountSizes(
  firmA: FirmWithAccounts,
  firmB: FirmWithAccounts
): number[] {
  const sizesA = new Set(firmA.firm_accounts.map((a) => a.size));
  const sizesB = new Set(firmB.firm_accounts.map((a) => a.size));
  const matching = Array.from(sizesA).filter((size) => sizesB.has(size));
  return matching.sort((a, b) => a - b);
}

function AccountSizeComparison({
  firmA,
  firmB,
  size,
}: {
  firmA: FirmWithAccounts;
  firmB: FirmWithAccounts;
  size: number;
}) {
  const accountA = firmA.firm_accounts.find((a) => a.size === size);
  const accountB = firmB.firm_accounts.find((a) => a.size === size);

  if (!accountA || !accountB) return null;

  return (
    <div key={size} className="mb-8">
      <h3 className="text-lg font-bold text-terminal-text mb-4">
        ${(size / 1000).toFixed(0)}K Account
      </h3>

      {/* Eval Comparison */}
      <div className="mb-6">
        <h4 className="text-sm font-mono text-terminal-muted mb-3 uppercase tracking-wide">
          Evaluation Phase
        </h4>
        <div className="overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full text-xs bg-gradient-hero">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-card">
                <th className="text-left text-terminal-muted font-mono font-medium px-4 py-3">
                  Metric
                </th>
                <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3">
                  {firmA.name}
                </th>
                <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3">
                  {firmB.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Eval Price */}
              <tr className="border-b border-terminal-border bg-terminal-bg">
                <td className="px-4 py-3 text-terminal-muted font-mono">Eval Price</td>
                <td className="px-3 py-3 text-center font-mono">
                  {hasEvalDiscount(accountA) ? (
                    <>
                      <span className="text-terminal-muted line-through text-xs">
                        {formatMoney(accountA.price ?? 0)}
                      </span>
                      <span className="text-profit font-medium ml-1 block">
                        {formatMoney(getEvalPrice(accountA))}
                      </span>
                    </>
                  ) : (
                    <span className="text-profit font-medium">
                      {formatMoney(accountA.price ?? 0)}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-center font-mono">
                  {hasEvalDiscount(accountB) ? (
                    <>
                      <span className="text-terminal-muted line-through text-xs">
                        {formatMoney(accountB.price ?? 0)}
                      </span>
                      <span className="text-profit font-medium ml-1 block">
                        {formatMoney(getEvalPrice(accountB))}
                      </span>
                    </>
                  ) : (
                    <span className="text-profit font-medium">
                      {formatMoney(accountB.price ?? 0)}
                    </span>
                  )}
                </td>
              </tr>

              {/* Activation Fee */}
              <tr className="border-b border-terminal-border bg-terminal-card/50">
                <td className="px-4 py-3 text-terminal-muted font-mono">Activation Fee</td>
                <td className="px-3 py-3 text-center font-mono">
                  {(accountA.activation_fee ?? 0) === 0 &&
                  !hasActivationDiscount(accountA) ? (
                    <span className="text-profit font-medium">Free</span>
                  ) : hasActivationDiscount(accountA) ? (
                    <>
                      <span className="text-terminal-muted line-through text-xs">
                        {formatMoney(accountA.activation_fee ?? 0)}
                      </span>
                      <span className="text-profit font-medium ml-1 block">
                        {getActivationFee(accountA) === 0
                          ? 'Free'
                          : formatMoney(getActivationFee(accountA))}
                      </span>
                    </>
                  ) : (
                    <span className="text-terminal-text">
                      {formatMoney(accountA.activation_fee ?? 0)}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-center font-mono">
                  {(accountB.activation_fee ?? 0) === 0 &&
                  !hasActivationDiscount(accountB) ? (
                    <span className="text-profit font-medium">Free</span>
                  ) : hasActivationDiscount(accountB) ? (
                    <>
                      <span className="text-terminal-muted line-through text-xs">
                        {formatMoney(accountB.activation_fee ?? 0)}
                      </span>
                      <span className="text-profit font-medium ml-1 block">
                        {getActivationFee(accountB) === 0
                          ? 'Free'
                          : formatMoney(getActivationFee(accountB))}
                      </span>
                    </>
                  ) : (
                    <span className="text-terminal-text">
                      {formatMoney(accountB.activation_fee ?? 0)}
                    </span>
                  )}
                </td>
              </tr>

              {/* Profit Target */}
              <tr className="border-b border-terminal-border bg-terminal-bg">
                <td className="px-4 py-3 text-terminal-muted font-mono">Profit Target</td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountA.profit_target ? formatMoney(accountA.profit_target) : '—'}
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountB.profit_target ? formatMoney(accountB.profit_target) : '—'}
                </td>
              </tr>

              {/* Max Drawdown */}
              <tr className="border-b border-terminal-border bg-terminal-card/50">
                <td className="px-4 py-3 text-terminal-muted font-mono">Max Drawdown</td>
                <td className="px-3 py-3 text-center">
                  <div className="font-mono text-terminal-text">
                    {accountA.max_drawdown ? formatMoney(accountA.max_drawdown) : '—'}
                  </div>
                  {accountA.drawdown_type && (
                    <Badge
                      variant={accountA.drawdown_type === 'EOD' ? 'profit' : 'warning'}
                    >
                      {accountA.drawdown_type}
                    </Badge>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="font-mono text-terminal-text">
                    {accountB.max_drawdown ? formatMoney(accountB.max_drawdown) : '—'}
                  </div>
                  {accountB.drawdown_type && (
                    <Badge
                      variant={accountB.drawdown_type === 'EOD' ? 'profit' : 'warning'}
                    >
                      {accountB.drawdown_type}
                    </Badge>
                  )}
                </td>
              </tr>

              {/* Daily Loss Limit */}
              <tr className="border-b border-terminal-border bg-terminal-bg">
                <td className="px-4 py-3 text-terminal-muted font-mono">Daily Loss Limit</td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountA.daily_loss_limit ? formatMoney(accountA.daily_loss_limit) : '—'}
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountB.daily_loss_limit ? formatMoney(accountB.daily_loss_limit) : '—'}
                </td>
              </tr>

              {/* Max Contracts */}
              <tr className="border-b border-terminal-border bg-terminal-card/50">
                <td className="px-4 py-3 text-terminal-muted font-mono">Max Contracts</td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountA.max_contract_size ?? '—'}
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountB.max_contract_size ?? '—'}
                </td>
              </tr>

              {/* Profit Split */}
              <tr className="border-b border-terminal-border bg-terminal-bg">
                <td className="px-4 py-3 text-terminal-muted font-mono">Profit Split</td>
                <td className="px-3 py-3 text-center font-mono text-profit font-medium">
                  {accountA.profit_split ?? '—'}
                </td>
                <td className="px-3 py-3 text-center font-mono text-profit font-medium">
                  {accountB.profit_split ?? '—'}
                </td>
              </tr>

              {/* Consistency Rule */}
              <tr className="border-b border-terminal-border bg-terminal-card/50">
                <td className="px-4 py-3 text-terminal-muted font-mono">Consistency Rule</td>
                <td className="px-3 py-3 text-center font-mono">
                  {accountA.consistency_rule &&
                  accountA.consistency_rule.toLowerCase() !== 'none' ? (
                    <span className="text-accent-amber">{accountA.consistency_rule}</span>
                  ) : (
                    <span className="text-profit">None</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center font-mono">
                  {accountB.consistency_rule &&
                  accountB.consistency_rule.toLowerCase() !== 'none' ? (
                    <span className="text-accent-amber">{accountB.consistency_rule}</span>
                  ) : (
                    <span className="text-profit">None</span>
                  )}
                </td>
              </tr>

              {/* Min Days to Pass */}
              <tr className="border-b border-terminal-border bg-terminal-bg">
                <td className="px-4 py-3 text-terminal-muted font-mono">Min Days to Pass</td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountA.min_days_to_pass ?? '—'}
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountB.min_days_to_pass ?? '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Comparison */}
      <div>
        <h4 className="text-sm font-mono text-terminal-muted mb-3 uppercase tracking-wide">
          Payout Details
        </h4>
        <div className="overflow-x-auto rounded-lg border border-terminal-border">
          <table className="w-full text-xs bg-gradient-hero">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-card">
                <th className="text-left text-terminal-muted font-mono font-medium px-4 py-3">
                  Metric
                </th>
                <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3">
                  {firmA.name}
                </th>
                <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3">
                  {firmB.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Min Payout */}
              <tr className="border-b border-terminal-border bg-terminal-bg">
                <td className="px-4 py-3 text-terminal-muted font-mono">Min Payout</td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountA.min_payout_amount
                    ? formatMoney(accountA.min_payout_amount)
                    : '—'}
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountB.min_payout_amount
                    ? formatMoney(accountB.min_payout_amount)
                    : '—'}
                </td>
              </tr>

              {/* Max Payout */}
              <tr className="border-b border-terminal-border bg-terminal-card/50">
                <td className="px-4 py-3 text-terminal-muted font-mono">Max Payout</td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountA.max_payout_amount
                    ? formatMoney(accountA.max_payout_amount)
                    : '—'}
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountB.max_payout_amount
                    ? formatMoney(accountB.max_payout_amount)
                    : '—'}
                </td>
              </tr>

              {/* Days to Payout */}
              <tr className="border-b border-terminal-border bg-terminal-bg">
                <td className="px-4 py-3 text-terminal-muted font-mono">Days to Payout</td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountA.days_to_payout ? `${accountA.days_to_payout} days` : '—'}
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {accountB.days_to_payout ? `${accountB.days_to_payout} days` : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PromoSection({
  firmA,
  firmB,
}: {
  firmA: FirmWithAccounts;
  firmB: FirmWithAccounts;
}) {
  const promosA = Array.from(
    new Set(
      firmA.firm_accounts
        .filter((a) => a.promo_code && a.promo_expires)
        .map((a) => a.promo_code!)
    )
  );
  const promosB = Array.from(
    new Set(
      firmB.firm_accounts
        .filter((a) => a.promo_code && a.promo_expires)
        .map((a) => a.promo_code!)
    )
  );

  if (promosA.length === 0 && promosB.length === 0) return null;

  return (
    <div className="bg-terminal-card border border-terminal-border rounded-lg p-6 mb-8">
      <h3 className="text-lg font-bold text-terminal-text mb-4">Active Promo Codes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-terminal-muted font-mono text-sm mb-3">
            {firmA.name}
          </h4>
          {promosA.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {promosA.map((code) => (
                <PromoCodeBadge key={code} code={code} />
              ))}
            </div>
          ) : (
            <span className="text-terminal-muted text-sm">No active promos</span>
          )}
        </div>
        <div>
          <h4 className="text-terminal-muted font-mono text-sm mb-3">
            {firmB.name}
          </h4>
          {promosB.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {promosB.map((code) => (
                <PromoCodeBadge key={code} code={code} />
              ))}
            </div>
          ) : (
            <span className="text-terminal-muted text-sm">No active promos</span>
          )}
        </div>
      </div>
    </div>
  );
}

function buildComparisonSchema(
  firmA: FirmWithAccounts,
  firmB: FirmWithAccounts,
  seoSlug: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ComparisonChart',
    name: `${firmA.name} vs ${firmB.name} Comparison`,
    description: `Side-by-side comparison of ${firmA.name} and ${firmB.name} prop firms`,
    url: `${siteUrl}/${seoSlug}`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Organization',
          name: firmA.name,
          url: `${siteUrl}/firms/${firmA.slug}`,
          ...(firmA.logo_url ? { logo: firmA.logo_url } : {}),
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Organization',
          name: firmB.name,
          url: `${siteUrl}/firms/${firmB.slug}`,
          ...(firmB.logo_url ? { logo: firmB.logo_url } : {}),
        },
      },
    ],
  };
}

function buildBreadcrumbSchema(
  firmAName: string,
  firmBName: string,
  seoSlug: string
) {
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
        name: 'Compare',
        item: `${siteUrl}/compare`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${firmAName} vs ${firmBName}`,
        item: `${siteUrl}/${seoSlug}`,
      },
    ],
  };
}

export default function ComparisonContent({
  firmA,
  firmB,
  seoSlug,
}: {
  firmA: FirmWithAccounts;
  firmB: FirmWithAccounts;
  seoSlug: string;
}) {
  const matchingSizes = getMatchingAccountSizes(firmA, firmB);

  return (
    <>
      <Script
        id="comparison-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildComparisonSchema(firmA, firmB, seoSlug)),
        }}
      />
      <Script
        id="comparison-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema(firmA.name, firmB.name, seoSlug)
          ),
        }}
      />

      <div className="min-h-screen bg-terminal-bg text-terminal-text">
        {/* Header */}
        <div className="border-b border-terminal-border bg-gradient-to-b from-terminal-card to-terminal-bg px-6 py-8 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Link
                href="/compare"
                className="text-profit hover:text-profit/80 text-sm font-mono inline-flex items-center gap-1"
              >
                ← Back to comparisons
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {firmA.name} <span className="text-terminal-muted">vs</span> {firmB.name}
            </h1>
            <p className="text-terminal-muted font-mono text-sm">
              Side-by-side comparison of evaluation accounts, pricing, and payout terms
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Firm Overview Cards */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-terminal-text mb-6 font-mono">
                Firm Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FirmCard firm={firmA} />
                <FirmCard firm={firmB} />
              </div>
            </section>

            {/* Promo Codes */}
            {(firmA.firm_accounts.some((a) => a.promo_code) ||
              firmB.firm_accounts.some((a) => a.promo_code)) && (
              <section className="mb-12">
                <PromoSection firmA={firmA} firmB={firmB} />
              </section>
            )}

            {/* Account Comparisons */}
            {matchingSizes.length > 0 ? (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-terminal-text mb-6 font-mono">
                  Account Comparison by Size
                </h2>
                <div className="space-y-12">
                  {matchingSizes.map((size) => (
                    <AccountSizeComparison
                      key={size}
                      firmA={firmA}
                      firmB={firmB}
                      size={size}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <section className="mb-12">
                <div className="bg-terminal-card border border-terminal-border rounded-lg p-6 text-center">
                  <p className="text-terminal-muted font-mono">
                    No matching account sizes found between {firmA.name} and {firmB.name}.
                  </p>
                </div>
              </section>
            )}

            {/* CTA to Individual Pages */}
            <section className="mb-12">
              <h2 className="text-lg font-bold text-terminal-text mb-4 font-mono">
                View Full Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href={`/firms/${firmA.slug}`}
                  className="block bg-terminal-card border border-terminal-border rounded-lg p-4 hover:border-profit/50 transition-colors"
                >
                  <div className="text-profit font-mono font-medium">{firmA.name}</div>
                  <p className="text-terminal-muted text-sm mt-1">
                    See all accounts, rules, and payouts
                  </p>
                </Link>
                <Link
                  href={`/firms/${firmB.slug}`}
                  className="block bg-terminal-card border border-terminal-border rounded-lg p-4 hover:border-profit/50 transition-colors"
                >
                  <div className="text-profit font-mono font-medium">{firmB.name}</div>
                  <p className="text-terminal-muted text-sm mt-1">
                    See all accounts, rules, and payouts
                  </p>
                </Link>
              </div>
            </section>

            {/* Back to comparisons */}
            <section className="text-center py-8">
              <Link
                href="/compare"
                className="text-profit hover:text-profit/80 font-mono text-sm inline-flex items-center gap-1"
              >
                Compare other firms →
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
