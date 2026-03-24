'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  getEvalPrice,
  getActivationFee,
  hasEvalDiscount,
  hasActivationDiscount,
  hasDiscount,
  type FirmWithAccounts,
  type FirmAccount,
} from '@/lib/firms';
import { PromoCodeBadge } from '@/components/PromoCodeBadge';

// ---------- TYPES ----------

type SortKey = 'savings' | 'price' | 'size' | 'split';
type SortDir = 'asc' | 'desc';

interface DealRow {
  firm: FirmWithAccounts;
  account: FirmAccount;
}

// ---------- HELPERS ----------

function formatMoney(n: number): string {
  return '$' + n.toLocaleString();
}

function getSavings(account: FirmAccount): number {
  const originalEval = account.price ?? 0;
  const originalFee = account.activation_fee ?? 0;
  const discountedEval = getEvalPrice(account);
  const discountedFee = getActivationFee(account);
  return (originalEval - discountedEval) + (originalFee - discountedFee);
}

function parseSplit(split: string | null): number {
  if (!split) return 0;
  const parts = split.split('/');
  return parseInt(parts[0], 10) || 0;
}

function getUniqueFirms(rows: DealRow[]): { slug: string; name: string }[] {
  const map = new Map<string, string>();
  for (const r of rows) {
    if (!map.has(r.firm.slug)) map.set(r.firm.slug, r.firm.name);
  }
  return Array.from(map.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getUniqueSizes(rows: DealRow[]): number[] {
  const set = new Set<number>();
  for (const r of rows) set.add(r.account.size);
  return Array.from(set).sort((a, b) => a - b);
}

// ---------- COMPONENT ----------

interface DiscountsClientProps {
  firms: FirmWithAccounts[];
}

export function DiscountsClient({ firms }: DiscountsClientProps) {
  // All rows with a discount or promo code
  const allRows: DealRow[] = useMemo(() => {
    const rows: DealRow[] = [];
    for (const firm of firms) {
      for (const account of firm.firm_accounts) {
        if (!account.is_active) continue;
        if (!hasDiscount(account) && !account.promo_code) continue;
        rows.push({ firm, account });
      }
    }
    return rows;
  }, [firms]);

  // Filter state
  const [firmFilter, setFirmFilter] = useState<string | null>(null);
  const [sizeFilter, setSizeFilter] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('savings');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Dropdowns
  const [firmOpen, setFirmOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const firmRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (firmRef.current && !firmRef.current.contains(e.target as Node)) setFirmOpen(false);
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) setSizeOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Available filter values
  const uniqueFirms = useMemo(() => getUniqueFirms(allRows), [allRows]);
  const uniqueSizes = useMemo(() => getUniqueSizes(allRows), [allRows]);

  // Filtered + sorted rows
  const filteredRows = useMemo(() => {
    let rows = [...allRows];

    if (firmFilter !== null) {
      rows = rows.filter((r) => r.firm.slug === firmFilter);
    }
    if (sizeFilter !== null) {
      rows = rows.filter((r) => r.account.size === sizeFilter);
    }

    rows.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortKey) {
        case 'savings':
          aVal = getSavings(a.account);
          bVal = getSavings(b.account);
          break;
        case 'price':
          aVal = getEvalPrice(a.account) + getActivationFee(a.account);
          bVal = getEvalPrice(b.account) + getActivationFee(b.account);
          break;
        case 'size':
          aVal = a.account.size;
          bVal = b.account.size;
          break;
        case 'split':
          aVal = parseSplit(a.account.profit_split);
          bVal = parseSplit(b.account.profit_split);
          break;
        default:
          aVal = 0;
          bVal = 0;
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return rows;
  }, [allRows, firmFilter, sizeFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'savings' || key === 'split' ? 'desc' : 'asc');
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <span className="text-terminal-border ml-1">↕</span>;
    return (
      <span className="text-profit ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
    );
  };

  const activeFilterCount =
    (firmFilter !== null ? 1 : 0) +
    (sizeFilter !== null ? 1 : 0);

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Hero */}
      <div className="border-b border-terminal-border bg-gradient-hero-short">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-bold text-terminal-text">
                Prop Firm <span className="text-profit">Discounts</span>
              </h1>
            </div>
            <p className="text-xs text-terminal-muted">
              Active discount codes and promos — updated March 2026.
            </p>
          </div>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-4 py-2 bg-profit hover:bg-profit/90 text-white font-mono font-medium rounded-lg text-xs transition-colors"
          >
            Full Compare
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[57px] z-30 border-b border-terminal-border bg-terminal-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-3 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Firm filter */}
              <div className="relative" ref={firmRef}>
                <button
                  onClick={() => { setFirmOpen(!firmOpen); setSizeOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
                    firmFilter !== null
                      ? 'border-profit/50 text-profit bg-profit/10'
                      : 'border-terminal-border text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  <span>{firmFilter !== null ? uniqueFirms.find((f) => f.slug === firmFilter)?.name ?? 'Firm' : 'Firm'}</span>
                  <span className="text-[10px]">{firmOpen ? '▲' : '▼'}</span>
                </button>
                {firmOpen && (
                  <div className="absolute left-0 top-full mt-1 w-52 bg-terminal-card border border-terminal-border rounded-lg shadow-xl z-40 overflow-hidden max-h-64 overflow-y-auto">
                    <button
                      onClick={() => { setFirmFilter(null); setFirmOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                        firmFilter === null ? 'text-profit bg-profit/10' : 'text-terminal-text hover:bg-black/5'
                      }`}
                    >
                      All Firms
                    </button>
                    {uniqueFirms.map((f) => (
                      <button
                        key={f.slug}
                        onClick={() => { setFirmFilter(f.slug); setFirmOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors border-t border-terminal-border/50 ${
                          firmFilter === f.slug ? 'text-profit bg-profit/10' : 'text-terminal-text hover:bg-black/5'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Size filter */}
              <div className="relative" ref={sizeRef}>
                <button
                  onClick={() => { setSizeOpen(!sizeOpen); setFirmOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
                    sizeFilter !== null
                      ? 'border-profit/50 text-profit bg-profit/10'
                      : 'border-terminal-border text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  <span>{sizeFilter !== null ? formatMoney(sizeFilter) : 'Account Size'}</span>
                  <span className="text-[10px]">{sizeOpen ? '▲' : '▼'}</span>
                </button>
                {sizeOpen && (
                  <div className="absolute left-0 top-full mt-1 w-36 bg-terminal-card border border-terminal-border rounded-lg shadow-xl z-40 overflow-hidden">
                    <button
                      onClick={() => { setSizeFilter(null); setSizeOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                        sizeFilter === null ? 'text-profit bg-profit/10' : 'text-terminal-text hover:bg-black/5'
                      }`}
                    >
                      All Sizes
                    </button>
                    {uniqueSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSizeFilter(s); setSizeOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors border-t border-terminal-border/50 ${
                          sizeFilter === s ? 'text-profit bg-profit/10' : 'text-terminal-text hover:bg-black/5'
                        }`}
                      >
                        {formatMoney(s)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setFirmFilter(null);
                    setSizeFilter(null);
                  }}
                  className="px-2 py-1.5 text-[11px] font-mono text-loss hover:text-loss/80 transition-colors"
                >
                  Clear ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Result count */}
            <span className="text-[11px] font-mono text-terminal-muted">
              {filteredRows.length} deal{filteredRows.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <section className="bg-terminal-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {filteredRows.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-terminal-muted text-lg">No deals match your filters. Try adjusting or clearing them.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto rounded-lg border border-terminal-border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-terminal-border bg-terminal-card">
                      <th className="text-left text-terminal-muted font-mono font-medium px-4 py-3 text-sm min-w-[220px]">Firm / Plan</th>
                      <th
                        className="text-center text-terminal-muted font-mono font-medium px-3 py-3 text-sm min-w-[100px] cursor-pointer hover:text-profit"
                        onClick={() => handleSort('size')}
                      >
                        Size <SortIcon col="size" />
                      </th>
                      <th
                        className="text-center text-terminal-muted font-mono font-medium px-3 py-3 text-sm min-w-[120px] cursor-pointer hover:text-profit"
                        onClick={() => handleSort('price')}
                      >
                        Eval Price <SortIcon col="price" />
                      </th>
                      <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 text-sm min-w-[100px]">Activation</th>
                      <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 text-sm min-w-[100px]">All-In Cost</th>
                      <th
                        className="text-center text-terminal-muted font-mono font-medium px-3 py-3 text-sm min-w-[100px] cursor-pointer hover:text-profit"
                        onClick={() => handleSort('savings')}
                      >
                        You Save <SortIcon col="savings" />
                      </th>
                      <th
                        className="text-center text-terminal-muted font-mono font-medium px-3 py-3 text-sm min-w-[90px] cursor-pointer hover:text-profit"
                        onClick={() => handleSort('split')}
                      >
                        Split <SortIcon col="split" />
                      </th>
                      <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 text-sm min-w-[120px]">Promo Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, i) => {
                      const savings = getSavings(row.account);
                      const allInCost = getEvalPrice(row.account) + getActivationFee(row.account);
                      return (
                        <tr
                          key={`${row.firm.slug}-${row.account.id}`}
                          className={`border-b border-terminal-border last:border-b-0 ${
                            i % 2 === 0 ? 'bg-terminal-bg' : 'bg-terminal-card/50'
                          } hover:bg-terminal-card-hover transition-colors`}
                        >
                          <td className="px-4 py-4">
                            <Link href={`/firms/${row.firm.slug}`} className="flex items-center gap-3 group">
                              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-terminal-card border border-terminal-border flex items-center justify-center overflow-hidden">
                                {row.firm.logo_url ? (
                                  <img src={row.firm.logo_url} alt={`${row.firm.name} logo`} className="w-full h-full object-contain p-1" />
                                ) : (
                                  <span className="text-sm font-bold font-mono text-profit">{row.firm.name.slice(0, 2)}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="text-terminal-text font-medium group-hover:text-profit transition-colors block">{row.firm.name}</span>
                                <span className="text-xs font-mono text-terminal-muted">{row.account.plan_name}</span>
                              </div>
                            </Link>
                          </td>
                          <td className="px-3 py-4 text-center font-mono text-terminal-muted text-sm">{row.account.size_label}</td>
                          <td className="px-3 py-4 text-center font-mono text-sm">
                            {hasEvalDiscount(row.account) ? (
                              <>
                                <span className="text-terminal-muted/60 line-through text-xs">{formatMoney(row.account.price ?? 0)}</span>
                                <span className="text-terminal-text font-medium ml-1">{formatMoney(getEvalPrice(row.account))}</span>
                              </>
                            ) : (
                              <span className="text-terminal-text">{formatMoney(row.account.price ?? 0)}</span>
                            )}
                          </td>
                          <td className="px-3 py-4 text-center font-mono text-sm">
                            {(row.account.activation_fee ?? 0) === 0 && !hasActivationDiscount(row.account) ? (
                              <span className="text-terminal-muted">Free</span>
                            ) : hasActivationDiscount(row.account) ? (
                              <>
                                <span className="text-terminal-muted/60 line-through text-xs">{formatMoney(row.account.activation_fee ?? 0)}</span>
                                <span className="text-terminal-text font-medium ml-1">{getActivationFee(row.account) === 0 ? 'Free' : formatMoney(getActivationFee(row.account))}</span>
                              </>
                            ) : (
                              <span className="text-terminal-text">{formatMoney(row.account.activation_fee ?? 0)}</span>
                            )}
                          </td>
                          <td className="px-3 py-4 text-center font-mono text-sm">
                            <span className="text-terminal-text font-semibold">{formatMoney(allInCost)}</span>
                          </td>
                          <td className="px-3 py-4 text-center font-mono text-sm">
                            {savings > 0 ? (
                              <span className="text-profit font-semibold">{formatMoney(savings)}</span>
                            ) : (
                              <span className="text-terminal-muted">—</span>
                            )}
                          </td>
                          <td className="px-3 py-4 text-center font-mono text-terminal-muted text-sm">
                            {row.account.profit_split ?? '—'}
                          </td>
                          <td className="px-3 py-4 text-center">
                            {row.account.promo_code ? (
                              <PromoCodeBadge code={row.account.promo_code} />
                            ) : (
                              <span className="text-terminal-muted text-xs">Auto-applied</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {filteredRows.map((row) => {
                  const savings = getSavings(row.account);
                  return (
                    <div
                      key={`m-${row.firm.slug}-${row.account.id}`}
                      className="bg-terminal-card rounded-lg border border-terminal-border p-4"
                    >
                      <Link href={`/firms/${row.firm.slug}`} className="flex items-center gap-3 mb-3 group">
                        <div className="flex-shrink-0 w-9 h-9 rounded-md bg-terminal-bg border border-terminal-border flex items-center justify-center overflow-hidden">
                          {row.firm.logo_url ? (
                            <img src={row.firm.logo_url} alt={`${row.firm.name} logo`} className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-xs font-bold font-mono text-profit">{row.firm.name.slice(0, 2)}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-terminal-text font-medium group-hover:text-profit transition-colors block text-sm">{row.firm.name}</span>
                          <span className="text-[10px] font-mono text-terminal-muted">{row.account.plan_name} · {row.account.size_label}</span>
                        </div>
                        {savings > 0 && (
                          <span className="text-profit font-mono font-semibold text-sm">Save {formatMoney(savings)}</span>
                        )}
                      </Link>

                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div className="bg-terminal-bg rounded px-3 py-2">
                          <span className="block text-terminal-muted mb-0.5">Eval</span>
                          {hasEvalDiscount(row.account) ? (
                            <>
                              <span className="text-terminal-muted/60 line-through text-[10px]">{formatMoney(row.account.price ?? 0)}</span>
                              <span className="block text-terminal-text font-medium">{formatMoney(getEvalPrice(row.account))}</span>
                            </>
                          ) : (
                            <span className="text-terminal-text">{formatMoney(row.account.price ?? 0)}</span>
                          )}
                        </div>
                        <div className="bg-terminal-bg rounded px-3 py-2">
                          <span className="block text-terminal-muted mb-0.5">Activation</span>
                          {(row.account.activation_fee ?? 0) === 0 && !hasActivationDiscount(row.account) ? (
                            <span className="text-terminal-muted">Free</span>
                          ) : hasActivationDiscount(row.account) ? (
                            <>
                              <span className="text-terminal-muted/60 line-through text-[10px]">{formatMoney(row.account.activation_fee ?? 0)}</span>
                              <span className="block text-terminal-text font-medium">{getActivationFee(row.account) === 0 ? 'Free' : formatMoney(getActivationFee(row.account))}</span>
                            </>
                          ) : (
                            <span className="text-terminal-text">{formatMoney(row.account.activation_fee ?? 0)}</span>
                          )}
                        </div>
                        <div className="bg-terminal-bg rounded px-3 py-2">
                          <span className="block text-terminal-muted mb-0.5">All-In Cost</span>
                          <span className="text-terminal-text font-semibold">{formatMoney(getEvalPrice(row.account) + getActivationFee(row.account))}</span>
                        </div>
                        <div className="bg-terminal-bg rounded px-3 py-2">
                          <span className="block text-terminal-muted mb-0.5">Split</span>
                          <span className="text-terminal-muted">{row.account.profit_split ?? '—'}</span>
                        </div>
                      </div>

                      {row.account.promo_code && (
                        <div className="mt-3 pt-3 border-t border-terminal-border">
                          <PromoCodeBadge code={row.account.promo_code} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Editorial + FAQ combined section */}
      <section className="py-12 border-t border-terminal-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-10">
            <p className="text-xs font-mono text-profit uppercase tracking-widest mb-2">Guide</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-terminal-text">
              How to use prop firm discount codes
            </h2>
          </div>

          {/* Two-column: editorial left, tips right */}
          <div className="grid lg:grid-cols-3 gap-8 mb-14">
            <div className="lg:col-span-2 space-y-5 text-terminal-muted leading-relaxed text-[15px]">
              <p>
                Most prop firm promo codes are applied at checkout on the firm&apos;s
                website. Copy the code from the table above, go to the firm&apos;s
                pricing page, select your account size, and paste the code before
                payment. The discount is usually applied instantly to the eval
                price, the activation fee, or both.
              </p>

              <h3 className="text-lg font-semibold text-terminal-text pt-2">
                Where do these promo codes come from?
              </h3>
              <p>
                Prop firms distribute discount codes through affiliate partners,
                social media promotions, seasonal sales, and direct partnerships.
                We verify each code listed here against the firm&apos;s checkout page
                before adding it. Codes change frequently. Some are permanent
                (always active), others expire after a set date or limited number
                of uses. We update this page regularly and remove expired codes
                as soon as we catch them.
              </p>

              <h3 className="text-lg font-semibold text-terminal-text pt-2">
                Stacking discounts and activation fee waivers
              </h3>
              <p>
                Some codes discount the eval price only. Others waive the
                activation fee entirely, which can save you $100-$200 on top of
                the eval discount. A few firms let you stack an eval discount
                with an activation waiver for the best total savings. Check the
                &quot;You Save&quot; column in the table above for the combined total at
                each account size.
              </p>

              <h3 className="text-lg font-semibold text-terminal-text pt-2">
                Cheapest prop firm evaluations right now
              </h3>
              <p>
                The cheapest eval price changes depending on which firms are
                running promos. Use the table above and sort by savings to find
                the best deal at your preferred account size. Keep in mind that
                the cheapest evaluation is not always the best value. A $50
                challenge with tight trailing drawdown may cost you $300 in
                resets, while a $150 challenge with EOD drawdown and rules that
                fit your style might be cheaper overall. Check our{' '}
                <Link href="/compare" className="text-profit hover:underline">
                  full comparison table
                </Link>{' '}
                to see drawdown types, consistency rules, and payout structures
                alongside pricing.
              </p>

              <h3 className="text-lg font-semibold text-terminal-text pt-2">
                How often do prop firm prices change?
              </h3>
              <p>
                Frequently. Firms run holiday sales, flash promotions, and
                seasonal discounts throughout the year. Some firms (like Apex
                Trader Funding) are known for aggressive promotional pricing
                that changes weekly. Others keep stable base prices but rotate
                promo codes every month. Bookmark this page and check back
                before purchasing any evaluation.
              </p>

              <h3 className="text-lg font-semibold text-terminal-text pt-2">
                What to check before buying a discounted eval
              </h3>
              <p>
                A discounted price does not mean it is the right firm for you.
                Before purchasing, check what drawdown type the firm uses
                (trailing, EOD, or static), whether there is a consistency rule,
                how many minimum trading days are required, and what the
                activation fee is on top of the eval price. A $79 eval with a
                $149 activation fee is really a $228 total. A $159 eval with no
                activation fee is cheaper overall. Always calculate the all-in
                cost, not just the discount.
              </p>

              <h3 className="text-lg font-semibold text-terminal-text pt-2">
                Why activation fee waivers are the best deals
              </h3>
              <p>
                Activation fees are charged after you pass the evaluation, not
                before. This means you only pay them if you succeed. But they
                add $85 to $200+ to your total cost and are easy to forget when
                comparing prices. A promo that waives the activation fee
                entirely (like TakeProfitTrader&apos;s NOFEE40 code) saves you money
                on the back end, which is often more impactful than a small
                percentage off the eval. When two deals look similar, the one
                that eliminates the activation fee is usually the better value.
              </p>
            </div>

            {/* Sidebar: tips + cross-links */}
            <div className="space-y-4">
              {[
                {
                  label: 'How to apply a code',
                  text: 'Copy the code, go to the firm\'s pricing page, select your account size, and paste it at checkout. Discount applies instantly.',
                },
                {
                  label: 'Check all-in cost',
                  text: 'Eval price + activation fee = what you actually pay to get funded. Some "cheap" evals have expensive activation fees.',
                },
                {
                  label: 'Stacking saves more',
                  text: 'Some codes discount the eval and waive the activation fee. Look at combined savings in the "You Save" column.',
                },
                {
                  label: 'Prices change often',
                  text: 'Firms run flash sales, seasonal promos, and rotating codes. Bookmark this page and check before purchasing.',
                },
                {
                  label: 'Cheap is not always best',
                  text: 'A $50 eval with tight drawdown can cost $300+ in resets. A $150 eval with rules that fit your style may be cheaper overall.',
                },
              ].map((tip) => (
                <div
                  key={tip.label}
                  className="bg-terminal-card rounded-lg border border-terminal-border p-4"
                >
                  <p className="text-xs font-mono text-profit mb-1.5">{tip.label}</p>
                  <p className="text-sm text-terminal-muted leading-relaxed">{tip.text}</p>
                </div>
              ))}
              <Link
                href="/compare"
                className="flex items-center justify-between bg-profit/5 border border-profit/20 rounded-lg p-4 group hover:bg-profit/10 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-terminal-text group-hover:text-profit transition-colors">Full comparison table</p>
                  <p className="text-xs text-terminal-muted">Drawdowns, splits, rules</p>
                </div>
                <span className="text-profit text-lg group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/firms"
                className="flex items-center justify-between bg-terminal-card border border-terminal-border rounded-lg p-4 group hover:border-profit/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-terminal-text group-hover:text-profit transition-colors">Firm directory</p>
                  <p className="text-xs text-terminal-muted">Detailed firm profiles</p>
                </div>
                <span className="text-terminal-muted text-lg group-hover:text-profit group-hover:translate-x-1 transition-all">→</span>
              </Link>
            </div>
          </div>

          {/* FAQ grid */}
          <div className="border-t border-terminal-border pt-10">
            <p className="text-xs font-mono text-profit uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl font-bold text-terminal-text mb-8">
              Common questions about prop firm discounts
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  q: 'Are these discount codes verified?',
                  a: 'Yes. We test each code against the firm\'s checkout page before listing it. Codes are removed or updated when they expire. If you find one that no longer works, let us know.',
                },
                {
                  q: 'Can I use multiple promo codes?',
                  a: 'Most firms accept one code per checkout. Some deals combine an eval discount with an activation fee waiver automatically. The "You Save" column shows the total combined savings.',
                },
                {
                  q: 'Do codes work on all account sizes?',
                  a: 'Depends on the code. Some apply a flat dollar discount, others a percentage that scales with account size. We list the discounted price per size so you see exactly what you\'ll pay.',
                },
                {
                  q: 'When do promo codes expire?',
                  a: 'It varies. Some are permanent. Others run for a limited time. We include expiration dates when firms publish them. Check back regularly as new deals appear frequently.',
                },
                {
                  q: 'What is the cheapest eval right now?',
                  a: 'Changes as firms rotate promos. Use the table above to see current prices. Sort by savings to find the biggest discounts at your preferred account size.',
                },
                {
                  q: 'Should I pick a firm based on price alone?',
                  a: 'No. Factor in drawdown type (trailing vs. EOD vs. static), consistency rules, minimum days, and profit split. A cheap eval with tight rules costs more in resets. Use our compare page for the full picture.',
                },
                {
                  q: 'What is an activation fee?',
                  a: 'A separate charge some firms require after you pass the evaluation. Ranges from $0 to $200+. Some refund it with your first payout, others do not. Always add it to the eval price for the real cost.',
                },
                {
                  q: 'Are these affiliate codes?',
                  a: 'Some are affiliate codes, some are public promotions. The discount you receive is the same regardless. We list them because they save you money on evaluations you were going to buy anyway.',
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="bg-terminal-card rounded-lg border border-terminal-border p-5"
                >
                  <h3 className="text-terminal-text font-semibold text-sm mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-terminal-muted text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-terminal-text mb-3">
            Already funded? Track your real P&L.
          </h2>
          <p className="text-terminal-muted text-sm mb-6 max-w-md mx-auto">
            Connect your bank and see every payout, every fee, and your true net
            profit across all your prop firms. Takes about 60 seconds.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-profit hover:bg-profit/90 text-white font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
