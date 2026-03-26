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
import { PromoCodeBadge } from '@/components/PromoCodeBadge';

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

/** Derive unique firms across all accounts, sorted alphabetically */
function getUniqueFirms(rows: AccountRow[]): { slug: string; name: string }[] {
  const map = new Map<string, string>();
  for (const r of rows) {
    if (!map.has(r.firm.slug)) map.set(r.firm.slug, r.firm.name);
  }
  return Array.from(map.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
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
  const [firmFilter, setFirmFilter] = useState<string | null>(null);
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
  const [firmOpen, setFirmOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [crOpen, setCrOpen] = useState(false);
  const firmRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const ddRef = useRef<HTMLDivElement>(null);
  const crRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (firmRef.current && !firmRef.current.contains(e.target as Node)) setFirmOpen(false);
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) setSizeOpen(false);
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDdOpen(false);
      if (crRef.current && !crRef.current.contains(e.target as Node)) setCrOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Available filter values
  const uniqueFirms = useMemo(() => getUniqueFirms(allRows), [allRows]);
  const uniqueSizes = useMemo(() => getUniqueSizes(allRows), [allRows]);
  const uniqueDrawdownTypes = useMemo(() => getUniqueDrawdownTypes(allRows), [allRows]);

  // Filtered + sorted rows
  const filteredRows = useMemo(() => {
    let rows = [...allRows];

    if (firmFilter !== null) {
      rows = rows.filter((r) => r.firm.slug === firmFilter);
    }
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
  }, [allRows, firmFilter, sizeFilter, drawdownFilter, consistencyFilter, phase, sortKey, sortDir]);

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
    (firmFilter !== null ? 1 : 0) +
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
              {/* Firm filter */}
              <div className="relative" ref={firmRef}>
                <button
                  onClick={() => { setFirmOpen(!firmOpen); setSizeOpen(false); setDdOpen(false); setCrOpen(false); }}
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

              {/* Account Size filter */}
              <div className="relative" ref={sizeRef}>
                <button
                  onClick={() => { setSizeOpen(!sizeOpen); setFirmOpen(false); setDdOpen(false); setCrOpen(false); }}
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
                  onClick={() => { setDdOpen(!ddOpen); setFirmOpen(false); setSizeOpen(false); setCrOpen(false); }}
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
                  onClick={() => { setCrOpen(!crOpen); setFirmOpen(false); setSizeOpen(false); setDdOpen(false); }}
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
                    setFirmFilter(null);
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
                <table className="w-full text-sm bg-gradient-hero">
                  {phase === 'eval' ? (
                    <>
                      <thead>
                        <tr className="border-b border-terminal-border bg-terminal-card">
                          <th className="text-left text-terminal-muted font-mono font-medium px-4 py-3 min-w-[200px] whitespace-nowrap">Firm / Plan</th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit whitespace-nowrap" onClick={() => handleSort('size')}>Size <SortIcon col="size" /></th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit whitespace-nowrap" onClick={() => handleSort('price')}>Eval Price <SortIcon col="price" /></th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Activation</th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit whitespace-nowrap" onClick={() => handleSort('profitTarget')}>Profit Target <SortIcon col="profitTarget" /></th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit whitespace-nowrap" onClick={() => handleSort('maxDrawdown')}>Max Drawdown <SortIcon col="maxDrawdown" /></th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit whitespace-nowrap" onClick={() => handleSort('profitSplit')}>Split <SortIcon col="profitSplit" /></th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">DLL</th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit whitespace-nowrap" onClick={() => handleSort('minDays')}>Min Days <SortIcon col="minDays" /></th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Consistency</th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Max Contracts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRows.map((row, i) => {
                          const dd = getPhaseDrawdown(row.account, 'eval');
                          const ddType = getPhaseDrawdownType(row.account, 'eval');
                          const dll = getPhaseDailyLimit(row.account, 'eval');
                          const hasRule = hasPhaseConsistencyRule(row.account, 'eval');
                          const consistency = getPhaseConsistency(row.account, 'eval');
                          const split = getPhaseSplit(row.account, 'eval');

                          return (
                            <tr
                              key={`${row.firm.slug}-${row.account.id}`}
                              className={`border-b border-terminal-border last:border-b-0 ${
                                i % 2 === 0 ? 'bg-terminal-bg' : 'bg-terminal-card/50'
                              } hover:bg-terminal-card-hover transition-colors`}
                            >
                              <td className="px-4 py-3.5">
                                <Link href={`/firms/${row.firm.slug}`} className="flex items-center gap-3 group">
                                  <div className="flex-shrink-0 w-9 h-9 rounded-md bg-gray-900 border border-terminal-border flex items-center justify-center overflow-hidden">
                                    {row.firm.logo_url ? (
                                      <img src={row.firm.logo_url} alt={`${row.firm.name} logo`} className="w-full h-full object-contain p-1" />
                                    ) : (
                                      <span className="text-xs font-bold font-mono text-profit">{row.firm.name.slice(0, 2)}</span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-terminal-text font-medium group-hover:text-profit transition-colors block text-sm">{row.firm.name}</span>
                                    <span className="text-[10px] font-mono text-terminal-muted">{row.account.plan_name}</span>
                                  </div>
                                </Link>
                              </td>
                              <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">{row.account.size_label}</td>
                              <td className="px-3 py-3.5 text-center font-mono text-sm">
                                {hasEvalDiscount(row.account) ? (
                                  <>
                                    <span className="text-terminal-muted line-through text-xs">{formatMoney(row.account.price ?? 0)}</span>
                                    <span className="text-profit font-medium ml-1">{formatMoney(getEvalPrice(row.account))}</span>
                                    {row.account.promo_code && (
                                      <div className="mt-1"><PromoCodeBadge code={row.account.promo_code} /></div>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-profit font-medium">{formatMoney(row.account.price ?? 0)}</span>
                                )}
                              </td>
                              <td className="px-3 py-3.5 text-center font-mono text-sm">
                                {(row.account.activation_fee ?? 0) === 0 && !hasActivationDiscount(row.account) ? (
                                  <span className="text-profit font-medium">Free</span>
                                ) : hasActivationDiscount(row.account) ? (
                                  <>
                                    <span className="text-terminal-muted line-through text-xs">{formatMoney(row.account.activation_fee ?? 0)}</span>
                                    <span className="text-profit font-medium ml-1">{getActivationFee(row.account) === 0 ? 'Free' : formatMoney(getActivationFee(row.account))}</span>
                                  </>
                                ) : (
                                  <span className="text-terminal-text">{formatMoney(row.account.activation_fee ?? 0)}</span>
                                )}
                              </td>
                              <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">{row.account.profit_target ? formatMoney(row.account.profit_target) : '—'}</td>
                              <td className="px-3 py-3.5 text-center font-mono text-sm">
                                <div className="text-terminal-text">{dd ? formatMoney(dd) : '—'}</div>
                                {ddType && (
                                  <span className={`text-[10px] font-mono ${ddType === 'EOD' ? 'text-profit' : 'text-accent-amber'}`}>{ddType}</span>
                                )}
                              </td>
                              <td className="px-3 py-3.5 text-center font-mono text-profit text-sm">{split ?? '—'}</td>
                              <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">{dll ? formatMoney(dll) : '—'}</td>
                              <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">{row.account.min_days_to_pass ?? '—'}</td>
                              <td className="px-3 py-3.5 text-center font-mono text-sm">
                                {hasRule ? <span className="text-accent-amber">{consistency}</span> : <span className="text-profit">None</span>}
                              </td>
                              <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">{row.account.max_contract_size ?? '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </>
                  ) : (
                    <>
                      <thead>
                        <tr className="border-b border-terminal-border bg-terminal-card">
                          <th className="text-left text-terminal-muted font-mono font-medium px-4 py-3 min-w-[200px] whitespace-nowrap">Firm / Plan</th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit whitespace-nowrap" onClick={() => handleSort('size')}>Size <SortIcon col="size" /></th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Drawdown Mode</th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Consistency</th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Max Contracts</th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 cursor-pointer hover:text-profit whitespace-nowrap" onClick={() => handleSort('profitSplit')}>Split <SortIcon col="profitSplit" /></th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Scaling Rule</th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Min Profit/Day</th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Max Payout</th>
                          <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Days to Payout</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRows.map((row, i) => {
                          const ddType = getPhaseDrawdownType(row.account, 'funded');
                          const hasRule = hasPhaseConsistencyRule(row.account, 'funded');
                          const consistency = getPhaseConsistency(row.account, 'funded');
                          const maxContracts = getFundedValue(row.account, 'max_contract_size', 'funded_max_contract_size') as string | null;
                          const split = getPhaseSplit(row.account, 'funded');
                          const scalingRule = getFundedValue(row.account, 'scaling_rule', 'funded_scaling_rule') as string | null;

                          return (
                            <tr
                              key={`${row.firm.slug}-${row.account.id}`}
                              className={`border-b border-terminal-border last:border-b-0 ${
                                i % 2 === 0 ? 'bg-terminal-bg' : 'bg-terminal-card/50'
                              } hover:bg-terminal-card-hover transition-colors`}
                            >
                              <td className="px-4 py-3.5">
                                <Link href={`/firms/${row.firm.slug}`} className="flex items-center gap-3 group">
                                  <div className="flex-shrink-0 w-9 h-9 rounded-md bg-gray-900 border border-terminal-border flex items-center justify-center overflow-hidden">
                                    {row.firm.logo_url ? (
                                      <img src={row.firm.logo_url} alt={`${row.firm.name} logo`} className="w-full h-full object-contain p-1" />
                                    ) : (
                                      <span className="text-xs font-bold font-mono text-profit">{row.firm.name.slice(0, 2)}</span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-terminal-text font-medium group-hover:text-profit transition-colors block text-sm">{row.firm.name}</span>
                                    <span className="text-[10px] font-mono text-terminal-muted">{row.account.plan_name}</span>
                                  </div>
                                </Link>
                              </td>
                              <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">{row.account.size_label}</td>
                              <td className="px-3 py-3.5 text-center text-sm">
                                {ddType ? (
                                  <span className={`text-xs font-mono ${ddType === 'EOD' ? 'text-profit' : 'text-accent-amber'}`}>{ddType}</span>
                                ) : <span className="text-terminal-muted">—</span>}
                              </td>
                              <td className="px-3 py-3.5 text-center font-mono text-sm">
                                {hasRule ? (
                                  <span className="text-accent-amber">{consistency}</span>
                                ) : <span className="text-profit">None</span>}
                              </td>
                              <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">{maxContracts ?? '—'}</td>
                              <td className="px-3 py-3.5 text-center font-mono text-profit text-sm">{split ?? '—'}</td>
                              <td className="px-3 py-3.5 text-center text-sm text-terminal-text">{scalingRule ?? '—'}</td>
                              <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">{row.account.min_profit_per_day ? formatMoney(row.account.min_profit_per_day) : '—'}</td>
                              <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">{row.account.max_payout_amount ? formatMoney(row.account.max_payout_amount) : '—'}</td>
                              <td className="px-3 py-3.5 text-center font-mono text-terminal-text text-sm">{row.account.days_to_payout ? `${row.account.days_to_payout} day${row.account.days_to_payout > 1 ? 's' : ''}` : '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </>
                  )}
                </table>
              </div>

              {/* Mobile card view */}
              <div className="lg:hidden space-y-3">
                {filteredRows.map((row) => {
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
                          <div className="w-9 h-9 rounded-md bg-gray-900 border border-terminal-border flex items-center justify-center overflow-hidden">
                            {row.firm.logo_url ? (
                              <img src={row.firm.logo_url} alt={`${row.firm.name} logo`} className="w-full h-full object-contain p-1" />
                            ) : (
                              <span className="text-xs font-bold font-mono text-profit">{row.firm.name.slice(0, 2)}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-terminal-text font-semibold text-sm">{row.firm.name}</h3>
                            <span className="text-[10px] font-mono text-terminal-muted">{row.account.plan_name} · {row.account.size_label}</span>
                          </div>
                        </div>
                        {hasRule ? (
                          <span className="text-[10px] font-mono text-accent-amber">{consistency}</span>
                        ) : (
                          <span className="text-[10px] font-mono text-profit">None</span>
                        )}
                      </div>

                      {/* Stats grid — different for eval vs funded */}
                      {phase === 'eval' ? (
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
                            <span className="font-mono text-terminal-text">{dd ? formatMoney(dd) : '—'}</span>
                            {ddType && (
                              <span className={`block text-[10px] font-mono ${ddType === 'EOD' ? 'text-profit' : 'text-accent-amber'}`}>{ddType}</span>
                            )}
                          </div>
                          <div className="bg-terminal-bg rounded px-3 py-2">
                            <span className="text-terminal-muted block mb-0.5">Target</span>
                            <span className="font-mono text-terminal-text">{row.account.profit_target ? formatMoney(row.account.profit_target) : '—'}</span>
                          </div>
                          <div className="bg-terminal-bg rounded px-3 py-2">
                            <span className="text-terminal-muted block mb-0.5">Split</span>
                            <span className="font-mono text-profit">{split ?? '—'}</span>
                          </div>
                          <div className="bg-terminal-bg rounded px-3 py-2">
                            <span className="text-terminal-muted block mb-0.5">Min Days</span>
                            <span className="font-mono text-terminal-text">{row.account.min_days_to_pass ?? '—'}</span>
                          </div>
                          {row.account.promo_code && (
                            <div className="bg-accent-amber/5 rounded px-3 py-2 col-span-3 flex items-center justify-between">
                              <span className="text-terminal-muted text-xs">Promo Code</span>
                              <PromoCodeBadge code={row.account.promo_code} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-terminal-bg rounded px-3 py-2">
                            <span className="text-terminal-muted block mb-0.5">Drawdown</span>
                            <span className="font-mono text-terminal-text">{ddType ?? '—'}</span>
                          </div>
                          <div className="bg-terminal-bg rounded px-3 py-2">
                            <span className="text-terminal-muted block mb-0.5">Split</span>
                            <span className="font-mono text-profit">{split ?? '—'}</span>
                          </div>
                          <div className="bg-terminal-bg rounded px-3 py-2">
                            <span className="text-terminal-muted block mb-0.5">Max Contracts</span>
                            <span className="font-mono text-terminal-text">{(getFundedValue(row.account, 'max_contract_size', 'funded_max_contract_size') as string | null) ?? '—'}</span>
                          </div>
                          <div className="bg-terminal-bg rounded px-3 py-2">
                            <span className="text-terminal-muted block mb-0.5">Scaling</span>
                            <span className="font-mono text-terminal-text">{(getFundedValue(row.account, 'scaling_rule', 'funded_scaling_rule') as string | null) ?? '—'}</span>
                          </div>
                          <div className="bg-terminal-bg rounded px-3 py-2">
                            <span className="text-terminal-muted block mb-0.5">Max Payout</span>
                            <span className="font-mono text-terminal-text">{row.account.max_payout_amount ? formatMoney(row.account.max_payout_amount) : '—'}</span>
                          </div>
                          <div className="bg-terminal-bg rounded px-3 py-2">
                            <span className="text-terminal-muted block mb-0.5">Payout Days</span>
                            <span className="font-mono text-terminal-text">{row.account.days_to_payout ? `${row.account.days_to_payout}d` : '—'}</span>
                          </div>
                        </div>
                      )}
                    </Link>
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
              How to compare prop firms in 2026
            </h2>
            <p className="text-terminal-muted mt-2 text-[15px]">
              The cheapest evaluation is not always the best deal. What matters
              is whether the drawdown rules, profit split, and payout structure
              match how you actually trade.
            </p>
          </div>

          {/* Drawdown types: 3-card grid */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-terminal-text mb-5">
              Prop firm drawdown types explained
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-terminal-card rounded-lg border border-terminal-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-accent-amber" />
                  <h4 className="font-semibold text-terminal-text text-sm">Trailing drawdown</h4>
                </div>
                <p className="text-sm text-terminal-muted leading-relaxed">
                  Your loss limit moves up as your account equity increases, but
                  never comes back down. A $150K account that peaks at $154,500
                  in open equity permanently raises the floor to $150,000. Your
                  real buffer shrinks from $4,500 to $2,000 even if you close at
                  $152,000. Punishing for traders with big winning sessions
                  followed by pullbacks.
                </p>
                <p className="text-xs font-mono text-terminal-muted mt-3">Used by: Topstep, Apex</p>
              </div>
              <div className="bg-terminal-card rounded-lg border border-profit/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-profit" />
                  <h4 className="font-semibold text-terminal-text text-sm">End-of-day (EOD)</h4>
                </div>
                <p className="text-sm text-terminal-muted leading-relaxed">
                  Drawdown only recalculates at end of day based on your closing
                  balance. Intraday swings do not count. Dip $3,000 during a
                  session and close flat? Your drawdown has not moved. This gives
                  swing traders and position holders significantly more breathing
                  room.
                </p>
                <p className="text-xs font-mono text-terminal-muted mt-3">Used by: Alpha Futures, Lucid, FundedNext</p>
              </div>
              <div className="bg-terminal-card rounded-lg border border-terminal-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-accent-blue" />
                  <h4 className="font-semibold text-terminal-text text-sm">Static drawdown</h4>
                </div>
                <p className="text-sm text-terminal-muted leading-relaxed">
                  Your loss floor is fixed below your starting balance and never
                  moves. Start with $100K and a $5,000 static drawdown, and your
                  floor stays at $95,000 even if your account grows to $120,000.
                  The most generous type because your buffer only grows over
                  time. Less common.
                </p>
                <p className="text-xs font-mono text-terminal-muted mt-3">Used by: TopOne Trader (2-step)</p>
              </div>
            </div>
          </div>

          {/* Two-column: deep editorial left, key concepts right */}
          <div className="grid lg:grid-cols-3 gap-8 mb-14">
            <div className="lg:col-span-2 space-y-5 text-terminal-muted leading-relaxed text-[15px]">
              <h3 className="text-lg font-semibold text-terminal-text">
                Price vs. total cost to get funded
              </h3>
              <p>
                Sticker price tells you almost nothing. A $50 challenge with
                tight trailing drawdown and a 15-day minimum can easily cost
                $300+ in resets before you pass. A $150 challenge with EOD
                drawdown and rules that match your strategy might be cheaper
                overall. When comparing, add up the eval price, likely resets,
                activation fee, and data feed charges you pay every month while
                attempting. That total is what it actually costs to get funded.
              </p>

              <h3 className="text-lg font-semibold text-terminal-text pt-2">
                Profit split: what it means and what to watch for
              </h3>
              <p>
                Profit splits range from 75/25 to 95/5 across the industry. A
                higher number looks better on paper, but some firms offset
                generous splits with higher eval fees, tighter drawdown rules,
                or slower payout schedules. A firm offering 80/20 with weekly
                payouts and relaxed rules can net you more than one advertising
                90/10 with biweekly payouts and a consistency rule that caps
                your best days.
              </p>

              <h3 className="text-lg font-semibold text-terminal-text pt-2">
                Max payout limits and scaling
              </h3>
              <p>
                Most firms cap how much you can withdraw per payout cycle,
                especially early on. Your first payout might be limited to
                $2,000 or $5,000 regardless of how much profit you have made.
                Topstep gives you 100% of your first $10,000, then moves to
                90/10. If you plan to scale, account limits matter too. Apex
                allows up to 20 accounts. MFFU allows up to 10. Running five
                $50K accounts at a firm with relaxed rules might generate more
                total income than a single $150K account with tighter
                restrictions.
              </p>

              <h3 className="text-lg font-semibold text-terminal-text pt-2">
                Days to payout: how fast you actually get paid
              </h3>
              <p>
                Profit split and payout speed are two different things. You can
                have a 90/10 split and still wait 30 days to see money in your
                bank account. Most firms require 5 to 14 trading days before
                your first withdrawal. After that, Topstep pays weekly. Alpha
                Futures pays every 14 days on Standard, every 5 winning days on
                Zero and Advanced. MFFU runs a 14-day cycle. First payouts are
                almost always slower due to extra KYC verification.
              </p>

              <h3 className="text-lg font-semibold text-terminal-text pt-2">
                Consistency rules and why they matter
              </h3>
              <p>
                A consistency rule limits how much of your total profit can come
                from a single trading day. A common version is &quot;no single day
                can exceed 40-50% of your total net profits.&quot; Not all firms
                have them. Some apply it only during eval and drop it once
                funded. Others keep it active, which affects how aggressively
                you can trade after passing. If you tend to have one or two
                outsized winning days per month, pay close attention to this
                rule.
              </p>

              <h3 className="text-lg font-semibold text-terminal-text pt-2">
                News trading, algos, and scalping restrictions
              </h3>
              <p>
                Most firms allow news trading, but some restrict it to one
                direction during high-impact events (Apex) or ban it outright
                during specific windows. Algorithmic trading is allowed at most
                firms as long as you run your own strategy on your own accounts.
                Copy trading and signal services are almost universally banned.
                Scalping is generally permitted, but several firms prohibit
                micro-scalping (trades under 5-10 seconds or fewer than 4-10
                ticks).
              </p>
            </div>

            {/* Sidebar: quick reference cards */}
            <div className="space-y-4">
              {[
                {
                  label: 'Total cost formula',
                  text: 'Eval price + resets + activation fee + monthly data feeds = real cost to get funded.',
                },
                {
                  label: 'Profit split reality',
                  text: '80/20 with weekly payouts and loose rules often nets more than 90/10 with biweekly payouts and tight consistency rules.',
                },
                {
                  label: 'Scaling tip',
                  text: 'Five $50K accounts at a relaxed firm can outperform one $150K account with tighter restrictions.',
                },
                {
                  label: 'Payout timing',
                  text: 'First payouts take longer (KYC). After that: weekly (Topstep), every 5 days (Alpha Zero), or 14-day cycles (MFFU).',
                },
                {
                  label: 'Consistency check',
                  text: 'If your best days are 2-3x your average, firms with 40-50% consistency rules will flag you. Look for "None" in the table.',
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
                href="/discounts"
                className="flex items-center justify-between bg-profit/5 border border-profit/20 rounded-lg p-4 group hover:bg-profit/10 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-terminal-text group-hover:text-profit transition-colors">Active discount codes</p>
                  <p className="text-xs text-terminal-muted">Save on evaluations</p>
                </div>
                <span className="text-profit text-lg group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* FAQ grid */}
          <div className="border-t border-terminal-border pt-10">
            <p className="text-xs font-mono text-profit uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl font-bold text-terminal-text mb-8">
              Frequently asked questions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  q: 'How many prop firms are listed here?',
                  a: `We track ${firms.length} prop trading firms with detailed data on every evaluation plan, account size, drawdown rule, profit split, consistency rule, and payout structure. Futures first, forex coming soon.`,
                },
                {
                  q: 'How often is pricing and rule data updated?',
                  a: 'We verify data directly from firm websites and help centers. Prop firms change pricing and rules frequently, so we review regularly. If you spot something outdated, let us know.',
                },
                {
                  q: 'Trailing vs. EOD vs. static drawdown?',
                  a: 'Trailing moves your loss floor up as equity peaks (even intraday). EOD only recalculates at end of day. Static sets a fixed floor that never moves. See the drawdown cards above for details.',
                },
                {
                  q: 'What is a consistency rule?',
                  a: 'It limits how much profit can come from a single day. For example, 40% means no single day can account for more than 40% of total net profit. Some firms only enforce it during eval.',
                },
                {
                  q: 'What is an activation fee?',
                  a: 'A separate charge some firms require after you pass the evaluation, before trading the funded account. Ranges from $0 to $200+. Some refund it with your first payout.',
                },
                {
                  q: 'Can I use algos or EAs?',
                  a: 'Most firms allow algorithmic trading if you run your own strategy on your own accounts. Copy trading and signal services are almost universally banned. Check micro-scalping rules per firm.',
                },
                {
                  q: 'Which prop firm is the cheapest?',
                  a: 'Depends on account size and what you count as "cost." Factor in resets, activation fees, and data feeds. Use the table above to sort by price at your preferred size.',
                },
                {
                  q: 'Best prop firm for beginners?',
                  a: 'Look for EOD drawdown (more forgiving), no consistency rule in eval, and low minimum trading days. Filter by drawdown type in the table above.',
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
            href="/discounts"
            className="bg-terminal-card border border-terminal-border rounded-lg p-4 hover:border-profit/50 transition-colors text-center"
          >
            <span className="block text-sm font-mono text-profit font-medium">Active Deals</span>
            <span className="block text-xs text-terminal-muted mt-1">Promo codes & discounts</span>
          </Link>
          <Link
            href="/firms"
            className="bg-terminal-card border border-terminal-border rounded-lg p-4 hover:border-profit/50 transition-colors text-center"
          >
            <span className="block text-sm font-mono text-profit font-medium">All Firms</span>
            <span className="block text-xs text-terminal-muted mt-1">Full firm directory</span>
          </Link>
        </div>
      </div>

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
