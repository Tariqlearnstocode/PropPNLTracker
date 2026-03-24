'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  getCategoryLabel,
  getAllInPrice,
  getEvalPrice,
  getActivationFee,
  hasEvalDiscount,
  hasActivationDiscount,
  getPDRatio,
  getFundedValue,
  hasFundedDifferences,
  type FirmWithAccounts,
  type FirmAccount,
} from '@/lib/firms';

// ---------- TYPES ----------

type SortKey =
  | 'price'
  | 'maxDrawdown'
  | 'profitTarget'
  | 'pdRatio'
  | 'minDays'
  | 'profitSplit'
  | 'size';
type SortDir = 'asc' | 'desc';

/** One row in the compare table = one account + its parent firm */
interface AccountRow {
  firm: FirmWithAccounts;
  account: FirmAccount;
}

// ---------- HELPERS ----------

function parseSplit(split: string | null): number {
  if (!split) return 0;
  const parts = split.split('/');
  return parseInt(parts[0], 10) || 0;
}

function formatMoney(n: number): string {
  return '$' + n.toLocaleString();
}

/** Derive unique size values across all accounts */
function getUniqueSizes(rows: AccountRow[]): number[] {
  const set = new Set<number>();
  for (const r of rows) set.add(r.account.size);
  return Array.from(set).sort((a, b) => a - b);
}

/** Derive unique drawdown types across all accounts */
function getUniqueDrawdownTypes(rows: AccountRow[]): string[] {
  const set = new Set<string>();
  for (const r of rows) {
    if (r.account.drawdown_type) set.add(r.account.drawdown_type);
  }
  return Array.from(set).sort();
}

/** Check if an account has a consistency rule */
function hasConsistencyRule(account: FirmAccount): boolean {
  return !!account.consistency_rule && account.consistency_rule.toLowerCase() !== 'none';
}

/** Get value for the selected phase (eval or funded) */
function getPhaseDrawdown(account: FirmAccount, phase: 'eval' | 'funded'): number | null {
  if (phase === 'funded') return getFundedValue(account, 'max_drawdown', 'funded_max_drawdown') as number | null;
  return account.max_drawdown;
}

function getPhaseDrawdownType(account: FirmAccount, phase: 'eval' | 'funded'): string | null {
  if (phase === 'funded') return getFundedValue(account, 'drawdown_type', 'funded_drawdown_type') as string | null;
  return account.drawdown_type;
}

function getPhaseDailyLimit(account: FirmAccount, phase: 'eval' | 'funded'): number | null {
  if (phase === 'funded') return getFundedValue(account, 'daily_loss_limit', 'funded_daily_loss_limit') as number | null;
  return account.daily_loss_limit;
}

function getPhaseSplit(account: FirmAccount, phase: 'eval' | 'funded'): string | null {
  if (phase === 'funded') return getFundedValue(account, 'profit_split', 'funded_profit_split') as string | null;
  return account.profit_split;
}

function getPhaseConsistency(account: FirmAccount, phase: 'eval' | 'funded'): string | null {
  if (phase === 'funded') {
    const val = getFundedValue(account, 'consistency_rule', 'funded_consistency_rule') as string | null;
    return val;
  }
  return account.consistency_rule;
}

function hasPhaseConsistencyRule(account: FirmAccount, phase: 'eval' | 'funded'): boolean {
  const rule = getPhaseConsistency(account, phase);
  return !!rule && rule.toLowerCase() !== 'none';
}

// ---------- COMPONENT ----------

interface CompareClientProps {
  firms: FirmWithAccounts[];
}

export function CompareClient({ firms }: CompareClientProps) {
  // Flatten all firm accounts into rows
  const allRows: AccountRow[] = useMemo(() => {
    const rows: AccountRow[] = [];
    for (const firm of firms) {
      for (const account of firm.firm_accounts) {
        if (!account.is_active) continue;
        rows.push({ firm, account });
      }
    }
    return rows;
  }, [firms]);

  // Filter state
  const [sizeFilter, setSizeFilter] = useState<number | null>(null);
  const [drawdownFilter, setDrawdownFilter] = useState<string | null>(null);
  const [consistencyFilter, setConsistencyFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [phase, setPhase] = useState<'eval' | 'funded'>('eval');
  const [sortKey, setSortKey] = useState<SortKey>('price');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Check if any accounts have funded differences
  const hasFundedData = useMemo(
    () => allRows.some((r) => hasFundedDifferences(r.account)),
    [allRows]
  );

  // Dropdowns
  const [sizeOpen, setSizeOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [crOpen, setCrOpen] = useState(false);
  const sizeRef = useRef<HTMLDivElement>(null);
  const ddRef = useRef<HTMLDivElement>(null);
  const crRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) setSizeOpen(false);
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDdOpen(false);
      if (crRef.current && !crRef.current.contains(e.target as Node)) setCrOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Available filter values
  const uniqueSizes = useMemo(() => getUniqueSizes(allRows), [allRows]);
  const uniqueDrawdownTypes = useMemo(() => getUniqueDrawdownTypes(allRows), [allRows]);

  // Filtered + sorted rows
  const filteredRows = useMemo(() => {
    let rows = [...allRows];

    if (sizeFilter !== null) {
      rows = rows.filter((r) => r.account.size === sizeFilter);
    }
    if (drawdownFilter !== null) {
      rows = rows.filter((r) => r.account.drawdown_type === drawdownFilter);
    }
    if (consistencyFilter === 'yes') {
      rows = rows.filter((r) => hasPhaseConsistencyRule(r.account, phase));
    } else if (consistencyFilter === 'no') {
      rows = rows.filter((r) => !hasPhaseConsistencyRule(r.account, phase));
    }

    rows.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortKey) {
        case 'price':
          aVal = getEvalPrice(a.account) + getActivationFee(a.account);
          bVal = getEvalPrice(b.account) + getActivationFee(b.account);
          break;
        case 'size':
          aVal = a.account.size;
          bVal = b.account.size;
          break;
        case 'maxDrawdown':
          aVal = getPhaseDrawdown(a.account, phase) ?? 0;
          bVal = getPhaseDrawdown(b.account, phase) ?? 0;
          break;
        case 'profitTarget':
          aVal = a.account.profit_target ?? 0;
          bVal = b.account.profit_target ?? 0;
          break;
        case 'pdRatio':
          aVal = getPDRatio(a.account) ?? 999;
          bVal = getPDRatio(b.account) ?? 999;
          break;
        case 'minDays':
          aVal = a.account.min_days_to_pass ?? 999;
          bVal = b.account.min_days_to_pass ?? 999;
          break;
        case 'profitSplit':
          aVal = parseSplit(getPhaseSplit(a.account, phase));
          bVal = parseSplit(getPhaseSplit(b.account, phase));
          break;
        default:
          aVal = 0;
          bVal = 0;
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return rows;
  }, [allRows, sizeFilter, drawdownFilter, consistencyFilter, phase, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'profitSplit' ? 'desc' : 'asc');
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
    (sizeFilter !== null ? 1 : 0) +
    (drawdownFilter !== null ? 1 : 0) +
    (consistencyFilter !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Hero — compact inline bar (matches Leaderboard) */}
      <div className="border-b border-terminal-border bg-gradient-hero-short">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-bold text-terminal-text">
                Prop Firm <span className="text-profit">Compare</span>
              </h1>
            </div>
            <p className="text-xs text-terminal-muted">
              Compare every account tier side by side — pricing, drawdown, rules, and profit splits.
            </p>
          </div>
          <Link
            href="/firms"
            className="inline-flex items-center gap-2 px-4 py-2 bg-profit hover:bg-profit/90 text-white font-mono font-medium rounded-lg text-xs transition-colors"
          >
            Browse All Firms
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[57px] z-30 border-b border-terminal-border bg-terminal-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-3 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Account Size filter */}
              <div className="relative" ref={sizeRef}>
                <button
                  onClick={() => { setSizeOpen(!sizeOpen); setDdOpen(false); setCrOpen(false); }}
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

              {/* Drawdown Type filter */}
              <div className="relative" ref={ddRef}>
                <button
                  onClick={() => { setDdOpen(!ddOpen); setSizeOpen(false); setCrOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
                    drawdownFilter !== null
                      ? 'border-profit/50 text-profit bg-profit/10'
                      : 'border-terminal-border text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  <span>{drawdownFilter ?? 'Drawdown Type'}</span>
                  <span className="text-[10px]">{ddOpen ? '▲' : '▼'}</span>
                </button>
                {ddOpen && (
                  <div className="absolute left-0 top-full mt-1 w-36 bg-terminal-card border border-terminal-border rounded-lg shadow-xl z-40 overflow-hidden">
                    <button
                      onClick={() => { setDrawdownFilter(null); setDdOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                        drawdownFilter === null ? 'text-profit bg-profit/10' : 'text-terminal-text hover:bg-black/5'
                      }`}
                    >
                      All Types
                    </button>
                    {uniqueDrawdownTypes.map((d) => (
                      <button
                        key={d}
                        onClick={() => { setDrawdownFilter(d); setDdOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors border-t border-terminal-border/50 ${
                          drawdownFilter === d ? 'text-profit bg-profit/10' : 'text-terminal-text hover:bg-black/5'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Consistency Rule filter */}
              <div className="relative" ref={crRef}>
                <button
                  onClick={() => { setCrOpen(!crOpen); setSizeOpen(false); setDdOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
                    consistencyFilter !== 'all'
                      ? 'border-profit/50 text-profit bg-profit/10'
                      : 'border-terminal-border text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  <span>
                    {consistencyFilter === 'all'
                      ? 'Consistency Rule'
                      : consistencyFilter === 'yes'
                        ? 'Has Consistency Rule'
                        : 'No Consistency Rule'}
                  </span>
                  <span className="text-[10px]">{crOpen ? '▲' : '▼'}</span>
                </button>
                {crOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-terminal-card border border-terminal-border rounded-lg shadow-xl z-40 overflow-hidden">
                    {(['all', 'yes', 'no'] as const).map((val) => (
                      <button
                        key={val}
                        onClick={() => { setConsistencyFilter(val); setCrOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${val !== 'all' ? 'border-t border-terminal-border/50' : ''} ${
                          consistencyFilter === val ? 'text-profit bg-profit/10' : 'text-terminal-text hover:bg-black/5'
                        }`}
                      >
                        {val === 'all' ? 'All' : val === 'yes' ? 'Has Consistency Rule' : 'No Consistency Rule'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Phase toggle (only show if funded data exists) */}
              {hasFundedData && (
                <div className="flex items-center rounded-lg border border-terminal-border overflow-hidden">
                  <button
                    onClick={() => setPhase('eval')}
                    className={`px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                      phase === 'eval'
                        ? 'bg-profit text-white'
                        : 'text-terminal-muted hover:text-terminal-text'
                    }`}
                  >
                    Eval
                  </button>
                  <button
                    onClick={() => setPhase('funded')}
                    className={`px-3 py-1.5 text-xs font-mono font-medium transition-colors border-l border-terminal-border ${
                      phase === 'funded'
                        ? 'bg-profit text-white'
                        : 'text-terminal-muted hover:text-terminal-text'
                    }`}
                  >
                    Funded
                  </button>
                </div>
              )}

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setSizeFilter(null);
                    setDrawdownFilter(null);
                    setConsistencyFilter('all');
                  }}
                  className="px-2 py-1.5 text-[11px] font-mono text-loss hover:text-loss/80 transition-colors"
                >
                  Clear ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Result count */}
            <span className="text-[11px] font-mono text-terminal-muted">
              {filteredRows.length} account{filteredRows.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <section className="bg-terminal-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {filteredRows.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-terminal-muted text-lg">
                No accounts match your filters. Try adjusting or clearing them.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto rounded-lg border border-terminal-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-terminal-border bg-terminal-card">
                      <th className="text-left text-terminal-muted font-mono font-medium px-4 py-3 min-w-[200px]">
                        Firm / Plan
                      </th>
                      <th
                        className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit min-w-[90px]"
                        onClick={() => handleSort('size')}
                      >
                        Size <SortIcon col="size" />
                      </th>
                      <th
                        className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit min-w-[90px]"
                        onClick={() => handleSort('price')}
                      >
                        Eval Price <SortIcon col="price" />
                      </th>
                      <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 min-w-[90px]">
                        Activation
                      </th>
                      <th
                        className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit min-w-[110px]"
                        onClick={() => handleSort('maxDrawdown')}
                      >
                        Max DD <SortIcon col="maxDrawdown" />
                      </th>
                      <th
                        className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit min-w-[100px]"
                        onClick={() => handleSort('profitTarget')}
                      >
                        Target <SortIcon col="profitTarget" />
                      </th>
                      <th
                        className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit min-w-[70px]"
                        onClick={() => handleSort('pdRatio')}
                      >
                        P/D <SortIcon col="pdRatio" />
                      </th>
                      <th
                        className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit min-w-[80px]"
                        onClick={() => handleSort('profitSplit')}
                      >
                        Split <SortIcon col="profitSplit" />
                      </th>
                      <th
                        className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit min-w-[70px]"
                        onClick={() => handleSort('minDays')}
                      >
                        Days <SortIcon col="minDays" />
                      </th>
                      <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 min-w-[120px]">
                        Consistency
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, i) => {
                      const pdRatio = getPDRatio(row.account);
                      const hasRule = hasPhaseConsistencyRule(row.account, phase);
                      const dd = getPhaseDrawdown(row.account, phase);
                      const ddType = getPhaseDrawdownType(row.account, phase);
                      const split = getPhaseSplit(row.account, phase);
                      const consistency = getPhaseConsistency(row.account, phase);

                      return (
                        <tr
                          key={`${row.firm.slug}-${row.account.id}`}
                          className={`border-b border-terminal-border last:border-b-0 ${
                            i % 2 === 0 ? 'bg-terminal-bg' : 'bg-terminal-card/50'
                          } hover:bg-terminal-card-hover transition-colors`}
                        >
                          {/* Firm + Plan */}
                          <td className="px-4 py-3.5">
                            <Link
                              href={`/firms/${row.firm.slug}`}
                              className="flex items-center gap-3 group"
                            >
                              <div className="flex-shrink-0 w-9 h-9 rounded-md bg-terminal-card border border-terminal-border flex items-center justify-center overflow-hidden">
                                {row.firm.logo_url ? (
                                  <img src={row.firm.logo_url} alt={`${row.firm.name} logo`} className="w-full h-full object-contain p-1" />
                                ) : (
                                  <span className="text-xs font-bold font-mono text-profit">
                                    {row.firm.name.slice(0, 2)}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="text-terminal-text font-medium group-hover:text-profit transition-colors block text-sm">
                                  {row.firm.name}
                                </span>
                                <span className="text-[10px] font-mono text-terminal-muted">
                                  {row.account.plan_name}
                                </span>
                              </div>
                            </Link>
                          </td>

                          {/* Size */}
                          <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">
                            {row.account.size_label}
                          </td>

                          {/* Eval Price */}
                          <td className="px-3 py-3.5 text-center font-mono text-sm">
                            {hasEvalDiscount(row.account) ? (
                              <>
                                <span className="text-terminal-muted line-through text-xs">{formatMoney(row.account.price ?? 0)}</span>
                                <span className="text-profit font-medium ml-1">{formatMoney(getEvalPrice(row.account))}</span>
                                {row.account.promo_code && (
                                  <span className="block text-[10px] text-accent-amber">{row.account.promo_code}</span>
                                )}
                              </>
                            ) : (
                              <span className="text-profit font-medium">{formatMoney(row.account.price ?? 0)}</span>
                            )}
                          </td>

                          {/* Activation Fee */}
                          <td className="px-3 py-3.5 text-center font-mono text-sm">
                            {(row.account.activation_fee ?? 0) === 0 && !hasActivationDiscount(row.account) ? (
                              <span className="text-profit font-medium">Free</span>
                            ) : hasActivationDiscount(row.account) ? (
                              <>
                                <span className="text-terminal-muted line-through text-xs">{formatMoney(row.account.activation_fee ?? 0)}</span>
                                <span className="text-profit font-medium ml-1">
                                  {getActivationFee(row.account) === 0 ? 'Free' : formatMoney(getActivationFee(row.account))}
                                </span>
                              </>
                            ) : (
                              <span className="text-terminal-text">{formatMoney(row.account.activation_fee ?? 0)}</span>
                            )}
                          </td>

                          {/* Max Drawdown */}
                          <td className="px-3 py-3.5 text-center font-mono text-sm">
                            <div className="text-terminal-text">
                              {dd ? formatMoney(dd) : 'N/A'}
                            </div>
                            {ddType && (
                              <span className={`text-[10px] font-mono ${
                                ddType === 'EOD' ? 'text-profit' : 'text-accent-amber'
                              }`}>
                                {ddType}
                              </span>
                            )}
                          </td>

                          {/* Profit Target */}
                          <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">
                            {row.account.profit_target ? formatMoney(row.account.profit_target) : 'N/A'}
                          </td>

                          {/* P/D Ratio */}
                          <td className="px-3 py-3.5 text-center font-mono text-sm">
                            {pdRatio !== null ? (
                              <span className={pdRatio <= 1.5 ? 'text-profit font-medium' : 'text-terminal-text'}>
                                {pdRatio.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-terminal-muted">—</span>
                            )}
                          </td>

                          {/* Profit Split */}
                          <td className="px-3 py-3.5 text-center font-mono text-profit text-sm">
                            {split ?? 'N/A'}
                          </td>

                          {/* Min Days */}
                          <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">
                            {row.account.min_days_to_pass ?? 'N/A'}
                          </td>

                          {/* Consistency Rule */}
                          <td className="px-3 py-3.5 text-center font-mono text-sm">
                            {hasRule ? (
                              <span className="text-accent-amber">{consistency}</span>
                            ) : (
                              <span className="text-profit">None</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile card view */}
              <div className="lg:hidden space-y-3">
                {filteredRows.map((row) => {
                  const pdRatio = getPDRatio(row.account);
                  const hasRule = hasPhaseConsistencyRule(row.account, phase);
                  const consistency = getPhaseConsistency(row.account, phase);
                  const dd = getPhaseDrawdown(row.account, phase);
                  const ddType = getPhaseDrawdownType(row.account, phase);
                  const split = getPhaseSplit(row.account, phase);

                  return (
                    <Link
                      key={`${row.firm.slug}-${row.account.id}-mobile`}
                      href={`/firms/${row.firm.slug}`}
                      className="block bg-terminal-card rounded-lg border border-terminal-border p-4 hover:border-profit/30 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-terminal-bg border border-terminal-border flex items-center justify-center overflow-hidden">
                            {row.firm.logo_url ? (
                              <img src={row.firm.logo_url} alt={`${row.firm.name} logo`} className="w-full h-full object-contain p-1" />
                            ) : (
                              <span className="text-xs font-bold font-mono text-profit">
                                {row.firm.name.slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-terminal-text font-semibold text-sm">
                              {row.firm.name}
                            </h3>
                            <span className="text-[10px] font-mono text-terminal-muted">
                              {row.account.plan_name} · {row.account.size_label}
                            </span>
                          </div>
                        </div>
                        {hasRule ? (
                          <span className="text-[10px] font-mono text-accent-amber">
                            {consistency}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-profit">
                            None
                          </span>
                        )}
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-terminal-bg rounded px-3 py-2">
                          <span className="text-terminal-muted block mb-0.5">Eval Price</span>
                          {hasEvalDiscount(row.account) ? (
                            <>
                              <span className="font-mono text-terminal-muted line-through text-[10px]">{formatMoney(row.account.price ?? 0)}</span>
                              <span className="font-mono text-profit font-medium ml-1">{formatMoney(getEvalPrice(row.account))}</span>
                            </>
                          ) : (
                            <span className="font-mono text-profit font-medium">{formatMoney(row.account.price ?? 0)}</span>
                          )}
                        </div>
                        <div className="bg-terminal-bg rounded px-3 py-2">
                          <span className="text-terminal-muted block mb-0.5">Activation</span>
                          <span className="font-mono text-terminal-text">
                            {(row.account.activation_fee ?? 0) === 0 && !hasActivationDiscount(row.account)
                              ? <span className="text-profit">Free</span>
                              : hasActivationDiscount(row.account)
                                ? <><span className="line-through text-[10px]">{formatMoney(row.account.activation_fee ?? 0)}</span> <span className="text-profit">{getActivationFee(row.account) === 0 ? 'Free' : formatMoney(getActivationFee(row.account))}</span></>
                                : formatMoney(row.account.activation_fee ?? 0)
                            }
                          </span>
                        </div>
                        <div className="bg-terminal-bg rounded px-3 py-2">
                          <span className="text-terminal-muted block mb-0.5">Max DD</span>
                          <span className="font-mono text-terminal-text">
                            {dd ? formatMoney(dd) : 'N/A'}
                          </span>
                          {ddType && (
                            <span className={`block text-[10px] font-mono ${
                              ddType === 'EOD' ? 'text-profit' : 'text-accent-amber'
                            }`}>
                              {ddType}
                            </span>
                          )}
                        </div>
                        <div className="bg-terminal-bg rounded px-3 py-2">
                          <span className="text-terminal-muted block mb-0.5">Split</span>
                          <span className="font-mono text-profit">
                            {split ?? 'N/A'}
                          </span>
                        </div>
                        <div className="bg-terminal-bg rounded px-3 py-2">
                          <span className="text-terminal-muted block mb-0.5">Target</span>
                          <span className="font-mono text-terminal-text">
                            {row.account.profit_target ? formatMoney(row.account.profit_target) : 'N/A'}
                          </span>
                        </div>
                        <div className="bg-terminal-bg rounded px-3 py-2">
                          <span className="text-terminal-muted block mb-0.5">P/D Ratio</span>
                          <span className={`font-mono ${pdRatio !== null && pdRatio <= 1.5 ? 'text-profit' : 'text-terminal-text'}`}>
                            {pdRatio !== null ? pdRatio.toFixed(1) : '—'}
                          </span>
                        </div>
                        <div className="bg-terminal-bg rounded px-3 py-2">
                          <span className="text-terminal-muted block mb-0.5">Days</span>
                          <span className="font-mono text-terminal-text">
                            {row.account.min_days_to_pass ?? 'N/A'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Editorial section */}
      <section className="py-12 bg-terminal-card border-t border-terminal-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-terminal-text mb-4">
            How To Compare Prop Firms Effectively
          </h2>
          <div className="space-y-4 text-terminal-muted leading-relaxed">
            <p>
              Choosing the right prop firm is not about finding the cheapest
              challenge. It is about finding the combination of drawdown rules,
              profit split, payout speed, and platform support that matches how
              you actually trade.
            </p>
            <p>
              <strong className="text-profit">Drawdown type</strong> is the most
              important factor. Trailing drawdown moves your loss limit up as
              your account peaks — even intraday. End-of-day (EOD) drawdown only
              recalculates at close, giving swing traders more room. Know which
              type fits your strategy before committing.
            </p>
            <p>
              <strong className="text-profit">Price vs. value</strong> matters
              more than price alone. A $50 challenge with a 15-day minimum and
              tight drawdown may cost more in resets than a $150 challenge with
              generous rules you can pass on the first try.
            </p>
            <p>
              <strong className="text-profit">Profit split</strong> ranges from
              75/25 to 95/5. Higher splits sound better, but check whether the
              firm compensates with higher fees, tighter rules, or slower
              payouts.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-terminal-bg border-t border-terminal-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-terminal-text mb-8">
            Prop Firm Compare FAQ
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'How many prop firms can I compare here?',
                a: `We currently list ${firms.length} prop firms across futures and forex, with data on account sizes, pricing, drawdown rules, profit splits, and platforms.`,
              },
              {
                q: 'How often is this data updated?',
                a: 'We review and update pricing, rules, and firm data regularly. Prop firms change their offerings frequently — if you spot outdated info, let us know.',
              },
              {
                q: 'What is P/D ratio?',
                a: 'Profit target divided by max drawdown. A ratio of 1.5 means you need to make 1.5x your allowed loss to pass. Lower ratios are generally easier.',
              },
              {
                q: 'Which drawdown type is better?',
                a: 'It depends on your style. EOD drawdown gives more room for intraday swings. Trailing drawdown is stricter but often comes with lower fees. Neither is universally better.',
              },
              {
                q: 'What is a consistency rule?',
                a: 'A consistency rule limits how much of your total profit can come from a single day. For example, "no day can exceed 40% of total profit" means you need steady performance, not one lucky trade. Some firms apply it only in eval, others in funded too.',
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="text-terminal-text font-semibold mb-2">
                  {faq.q}
                </h3>
                <p className="text-terminal-muted text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 sm:p-12 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-terminal-text mb-3">
            Track your real P&L across every firm
          </h2>
          <p className="text-terminal-muted mb-6">
            Connect your bank and Prop PNL auto-detects payouts and fees from
            all the firms above. See your true net P&L in 60 seconds.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-white font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank — Free <span>→</span>
          </Link>
          <p className="text-xs text-terminal-muted font-mono mt-4">
            No card required · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
