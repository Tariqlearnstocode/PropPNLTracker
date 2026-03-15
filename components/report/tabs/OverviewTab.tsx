'use client';

import React, { useState } from 'react';
import { PNLReport, formatCurrency, formatMonth, formatDate, type TradingStats } from '@/lib/pnl-calculations';
import { MonthlyPNLHeatmap } from '../ui/MonthlyPNLHeatmap';
import { TopFirmsTable } from '../ui/TopFirmsTable';

interface OverviewTabProps {
  filteredMonthlyBreakdown: PNLReport['monthlyBreakdown'];
  filteredFirmBreakdown: PNLReport['perFirmBreakdown'];
  allFirmBreakdown: PNLReport['perFirmBreakdown'];
  tradingStats: TradingStats;
  displayPNL: number;
  displayDeposits: number;
  displayFees: number;
  selectedFirmsCount: number;
  totalFirmsCount: number;
}

export function OverviewTab({
  filteredMonthlyBreakdown,
  filteredFirmBreakdown,
  allFirmBreakdown,
  tradingStats,
  displayPNL,
  displayDeposits,
  displayFees,
  selectedFirmsCount,
  totalFirmsCount,
}: OverviewTabProps) {
  const [showMonthlyDetail, setShowMonthlyDetail] = useState(false);
  const isProfit = displayPNL >= 0;
  const netMargin = displayDeposits > 0 ? ((displayPNL / displayDeposits) * 100) : 0;

  // Use filtered firm breakdown (respects firm filter), fall back to all firms
  const firmsToShow = filteredFirmBreakdown.length > 0 ? filteredFirmBreakdown : allFirmBreakdown;

  return (
    <div className="space-y-4">
      {/* === HERO: Net PNL (left) + Deposits/Fees compact (right) === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left: Net PNL */}
        <div className="relative overflow-hidden rounded-xl border border-terminal-border bg-terminal-card p-6 md:p-8">
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.07] blur-[100px] pointer-events-none ${isProfit ? 'bg-profit' : 'bg-loss'}`}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-terminal-muted">
                Net PNL
              </span>
              {selectedFirmsCount > 0 && (
                <span className="text-[10px] font-mono text-terminal-muted">
                  · {selectedFirmsCount} of {totalFirmsCount} firms
                </span>
              )}
            </div>

            <div className={`font-number text-5xl md:text-6xl font-extrabold tracking-tight mb-4 ${isProfit ? 'text-profit profit-glow' : 'text-loss loss-glow'}`}>
              {isProfit ? '+' : ''}{formatCurrency(displayPNL)}
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <span className={`font-number text-sm font-semibold px-2.5 py-1 rounded ${
                netMargin >= 0 ? 'text-profit bg-profit-dim' : 'text-loss bg-loss-dim'
              }`}>
                {netMargin >= 0 ? '+' : ''}{netMargin.toFixed(1)}% margin
              </span>

              <span className="text-xs font-mono text-terminal-muted ml-auto">
                {totalFirmsCount} firm{totalFirmsCount !== 1 ? 's' : ''} tracked
              </span>
            </div>
          </div>
        </div>

        {/* Right: Deposits & Fees — compact */}
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-6 md:p-8 flex flex-col justify-center">
          <div className="space-y-5">
            {/* Deposits */}
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted">Deposits</span>
                <span className="font-number text-xs text-terminal-muted">
                  {tradingStats.activityStats.totalPayouts} payouts
                </span>
              </div>
              <div className="font-number text-2xl font-bold text-profit">
                +{formatCurrency(displayDeposits)}
              </div>
            </div>

            <div className="border-t border-terminal-border" />

            {/* Fees */}
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted">Fees Paid</span>
                <span className="font-number text-xs text-terminal-muted">
                  {tradingStats.activityStats.totalPurchases} purchases
                </span>
              </div>
              <div className="font-number text-2xl font-bold text-loss">
                -{formatCurrency(displayFees)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === ROW 2: Biggest Payout / Best Firm / Worst Firm === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Biggest Payout
          </div>
          {tradingStats.payoutPerformanceStats?.largestPayout ? (
            <>
              <div className="font-number text-3xl font-bold text-profit">
                {formatCurrency(tradingStats.payoutPerformanceStats.largestPayout.amount)}
              </div>
              <div className="text-xs font-mono text-terminal-muted mt-1">
                {tradingStats.payoutPerformanceStats.largestPayout.firmName ?? 'Unknown'} {' \u00b7 '} {formatDate(tradingStats.payoutPerformanceStats.largestPayout.date)}
              </div>
            </>
          ) : (
            <div className="font-number text-3xl font-bold text-terminal-muted">---</div>
          )}
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Best Firm
          </div>
          {tradingStats.bestWorstStats?.bestFirm ? (
            <>
              <div className="font-number text-3xl font-bold text-profit">
                {tradingStats.bestWorstStats.bestFirm.firmName}
              </div>
              <div className="text-xs font-mono text-profit mt-1">
                {formatCurrency(tradingStats.bestWorstStats.bestFirm.netPNL)} net
              </div>
            </>
          ) : (
            <div className="font-number text-3xl font-bold text-terminal-muted">---</div>
          )}
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Worst Firm
          </div>
          {tradingStats.bestWorstStats?.worstFirm ? (
            <>
              <div className="font-number text-3xl font-bold text-loss">
                {tradingStats.bestWorstStats.worstFirm.firmName}
              </div>
              <div className="text-xs font-mono text-loss mt-1">
                {formatCurrency(tradingStats.bestWorstStats.worstFirm.netPNL)} net
              </div>
            </>
          ) : (
            <div className="font-number text-3xl font-bold text-terminal-muted">---</div>
          )}
        </div>
      </div>

      {/* === ROW 3: Monthly Heatmap + Expandable Detail Table === */}
      <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted">Monthly PNL</h3>
          <span className="text-[11px] font-mono text-terminal-muted">
            {filteredMonthlyBreakdown.length} {filteredMonthlyBreakdown.length === 1 ? 'month' : 'months'}
          </span>
        </div>
        <MonthlyPNLHeatmap monthlyBreakdown={filteredMonthlyBreakdown} />

        {/* Expandable monthly detail table */}
        <button
          onClick={() => setShowMonthlyDetail(!showMonthlyDetail)}
          className="flex items-center gap-1.5 mt-4 pt-3 border-t border-terminal-border w-full text-left text-[11px] font-mono uppercase tracking-wider text-terminal-muted hover:text-terminal-text transition-colors"
        >
          {showMonthlyDetail ? <span className="text-sm">▲</span> : <span className="text-sm">▼</span>}
          {showMonthlyDetail ? 'Hide' : 'Show'} monthly breakdown
        </button>

        {showMonthlyDetail && (
          <div className="mt-3 overflow-x-auto dark-scroll">
            <table className="w-full">
              <thead>
                <tr className="border-b border-terminal-border">
                  <th className="text-left py-2 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Month</th>
                  <th className="text-right py-2 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Deposits</th>
                  <th className="text-right py-2 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Fees</th>
                  <th className="text-right py-2 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Net PNL</th>
                  <th className="text-right py-2 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Running Total</th>
                  <th className="text-right py-2 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Txns</th>
                </tr>
              </thead>
              <tbody>
                {filteredMonthlyBreakdown.map((month) => (
                  <tr key={month.month} className="border-b border-terminal-border/50 hover:bg-terminal-card-hover transition-colors">
                    <td className="py-2.5 px-3 text-sm font-medium text-terminal-text">{formatMonth(month.month)}</td>
                    <td className="py-2.5 px-3 font-number text-sm text-right text-profit/80">+{formatCurrency(month.deposits)}</td>
                    <td className="py-2.5 px-3 font-number text-sm text-right text-loss/80">-{formatCurrency(month.fees)}</td>
                    <td className={`py-2.5 px-3 font-number text-sm text-right font-semibold ${month.netPNL >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {month.netPNL >= 0 ? '+' : ''}{formatCurrency(month.netPNL)}
                    </td>
                    <td className={`py-2.5 px-3 font-number text-sm text-right ${month.runningTotal >= 0 ? 'text-profit/70' : 'text-loss/70'}`}>
                      {formatCurrency(month.runningTotal)}
                    </td>
                    <td className="py-2.5 px-3 font-number text-xs text-right text-terminal-muted">{month.transactionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* === ROW 4: Firm Rankings (all firms) === */}
      <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted">Firm Rankings</h3>
          <span className="text-[11px] font-mono text-terminal-muted">
            {firmsToShow.length} firm{firmsToShow.length !== 1 ? 's' : ''}
          </span>
        </div>
        <TopFirmsTable perFirmBreakdown={firmsToShow} />
      </div>
    </div>
  );
}
