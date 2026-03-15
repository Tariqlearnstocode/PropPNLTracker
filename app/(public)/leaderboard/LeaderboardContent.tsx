'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getLeaderboardData, type LeaderboardEntry } from '@/lib/demo-leaderboard-data';

type Period = 'allTime' | 'monthly' | 'ytd';
type SortKey = 'netPNL' | 'roi';

function formatCurrency(value: number): string {
  return '$' + Math.abs(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg">&#x1F947;</span>;
  if (rank === 2) return <span className="text-lg">&#x1F948;</span>;
  if (rank === 3) return <span className="text-lg">&#x1F949;</span>;
  return <span className="text-sm font-mono text-terminal-muted">{rank}</span>;
}

export default function LeaderboardContent() {
  const [period, setPeriod] = useState<Period>('allTime');
  const [sortKey, setSortKey] = useState<SortKey>('netPNL');
  const [selectedFirm, setSelectedFirm] = useState<string | null>(null);
  const [firmDropdownOpen, setFirmDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFirmDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const entries = useMemo(() => getLeaderboardData(period), [period]);

  // Collect all unique firm names
  const allFirmNames = useMemo(() => {
    const firms = new Set<string>();
    for (const entry of entries) {
      for (const name of entry.firmNames) firms.add(name);
    }
    return Array.from(firms).sort();
  }, [entries]);

  // When a firm is selected, re-map entries to show only that firm's numbers
  const filtered = useMemo(() => {
    if (!selectedFirm) return entries;

    return entries
      .map((entry) => {
        const fb = entry.firmBreakdown.find((f) => f.firmName === selectedFirm);
        if (!fb) return null;
        const roi = fb.fees > 0 ? (fb.netPNL / fb.fees) * 100 : 0;
        return {
          ...entry,
          netPNL: fb.netPNL,
          totalDeposits: fb.deposits,
          totalFees: fb.fees,
          roi,
          firmNames: [selectedFirm],
          firmBreakdown: [fb],
        } satisfies LeaderboardEntry;
      })
      .filter(Boolean) as LeaderboardEntry[];
  }, [entries, selectedFirm]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === 'roi') return b.roi - a.roi;
      return b.netPNL - a.netPNL;
    });
  }, [filtered, sortKey]);

  const periodLabels: Record<Period, string> = {
    allTime: 'All Time',
    monthly: 'This Month',
    ytd: 'YTD',
  };

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Hero — compact inline bar */}
      <div
        className="border-b border-terminal-border bg-gradient-hero-short"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-bold text-terminal-text">
                Prop Trading <span className="text-profit">Leaderboard</span>
              </h1>
            </div>
            <p className="text-xs text-terminal-muted">
              No screenshots. No faking it. Payouts, fees, and P&L straight from the bank.
            </p>
          </div>
          {!user && (
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-xs transition-colors"
            >
              Join the Leaderboard
              <span>&#8594;</span>
            </Link>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-[57px] z-30 border-b border-terminal-border bg-terminal-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-3 py-3">
            {/* Time period */}
            <div className="flex items-center gap-1 bg-terminal-card rounded-lg border border-terminal-border p-1">
              {(['allTime', 'monthly', 'ytd'] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                    period === p
                      ? 'bg-profit text-terminal-bg'
                      : 'text-terminal-muted hover:text-terminal-text'
                  }`}
                >
                  {periodLabels[p]}
                </button>
              ))}
            </div>

            {/* Firm filter dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setFirmDropdownOpen(!firmDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
                  selectedFirm
                    ? 'border-profit/50 text-profit bg-profit/10'
                    : 'border-terminal-border text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <span>{selectedFirm || 'All Firms'}</span>
                <span className="text-[10px]">{firmDropdownOpen ? '\u25B2' : '\u25BC'}</span>
              </button>
              {firmDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-terminal-card border border-terminal-border rounded-lg shadow-xl z-40 overflow-hidden">
                  <button
                    onClick={() => { setSelectedFirm(null); setFirmDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                      !selectedFirm ? 'text-profit bg-profit/10' : 'text-terminal-text hover:bg-terminal-card-hover'
                    }`}
                  >
                    All Firms
                  </button>
                  {allFirmNames.map((firm) => (
                    <button
                      key={firm}
                      onClick={() => { setSelectedFirm(firm); setFirmDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors border-t border-terminal-border/50 ${
                        selectedFirm === firm ? 'text-profit bg-profit/10' : 'text-terminal-text hover:bg-terminal-card-hover'
                      }`}
                    >
                      {firm}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-terminal-card rounded-xl border border-terminal-border overflow-hidden">
          {/* Summary bar */}
          <div className="px-4 sm:px-6 py-4 border-b border-terminal-border flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-terminal-text font-semibold">
                {sorted.length} Trader{sorted.length !== 1 ? 's' : ''}
              </span>
              {selectedFirm && (
                <span className="text-[11px] font-mono text-profit">
                  {selectedFirm}
                </span>
              )}
              <span className="text-[11px] font-mono text-terminal-muted">
                Bank-verified rankings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-terminal-muted">Sort by:</span>
              <button
                onClick={() => setSortKey('netPNL')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors ${
                  sortKey === 'netPNL'
                    ? 'bg-profit/20 text-profit font-medium'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                Net P&L
              </button>
              <button
                onClick={() => setSortKey('roi')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors ${
                  sortKey === 'roi'
                    ? 'bg-profit/20 text-profit font-medium'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                ROI
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-terminal-border">
                  <th className="text-left py-3 px-4 sm:px-6 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest w-12">#</th>
                  <th className="text-left py-3 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Trader</th>
                  <th className="text-right py-3 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Net P&L</th>
                  <th className="text-right py-3 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest hidden sm:table-cell">Deposits</th>
                  <th className="text-right py-3 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest hidden sm:table-cell">Fees</th>
                  <th className="text-right py-3 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">ROI</th>
                  {!selectedFirm && (
                    <th className="text-right py-3 px-4 sm:px-6 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest hidden md:table-cell">Firms</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sorted.map((entry, i) => {
                  const rank = i + 1;
                  const isPositive = entry.netPNL >= 0;
                  return (
                    <tr
                      key={entry.id}
                      className={`border-b border-terminal-border/50 hover:bg-terminal-card-hover transition-colors ${
                        rank <= 3 ? 'bg-profit/[0.02]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <RankBadge rank={rank} />
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            isPositive ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                          }`}>
                            {entry.displayName[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-terminal-text">{entry.displayName}</span>
                        </div>
                      </td>
                      <td className={`py-3.5 px-3 font-mono text-sm text-right font-bold ${isPositive ? 'text-profit' : 'text-loss'}`}>
                        {isPositive ? '+' : '-'}{formatCurrency(entry.netPNL)}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-sm text-right text-profit/70 hidden sm:table-cell">
                        +{formatCurrency(entry.totalDeposits)}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-sm text-right text-loss/70 hidden sm:table-cell">
                        -{formatCurrency(entry.totalFees)}
                      </td>
                      <td className={`py-3.5 px-3 font-mono text-sm text-right font-semibold ${entry.roi >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {entry.roi >= 0 ? '+' : ''}{entry.roi.toFixed(0)}%
                      </td>
                      {!selectedFirm && (
                        <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {entry.firmNames.slice(0, 3).map((firm) => (
                              <span
                                key={firm}
                                className="inline-block px-2 py-0.5 text-[10px] font-mono text-terminal-muted border border-terminal-border rounded-full"
                              >
                                {firm}
                              </span>
                            ))}
                            {entry.firmNames.length > 3 && (
                              <span className="text-[10px] font-mono text-terminal-muted">
                                +{entry.firmNames.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={selectedFirm ? 6 : 7} className="py-12 text-center text-sm text-terminal-muted font-mono">
                      No data for this time period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 sm:p-12 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-terminal-text mb-3">
              Think you belong here?
            </h2>
            <p className="text-terminal-muted mb-6">
              Connect your bank, opt in, and let your real numbers do the talking.
            </p>
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
            >
              Get Your Real P&L
              <span>&#8594;</span>
            </Link>
            <p className="text-xs text-terminal-muted font-mono mt-4">
              Free report. Leaderboard opt-in optional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
