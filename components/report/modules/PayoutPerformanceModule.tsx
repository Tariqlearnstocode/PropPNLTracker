'use client';

import React from 'react';
import { formatCurrency, formatDate } from '@/lib/pnl-calculations';

interface PayoutPerformanceModuleProps {
  stats: {
    totalPayouts: number;
    averagePayoutSize: number;
    payoutFrequency: number;
    largestPayout?: { amount: number; date: string; firmName?: string };
    smallestPayout?: { amount: number; date: string };
    averageDaysBetweenPayouts: number;
  };
}

export function PayoutPerformanceModule({ stats }: PayoutPerformanceModuleProps) {
  return (
    <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
      <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted mb-4">
        Payout Performance
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-lg bg-profit-dim border border-profit/10 p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Total Payouts</div>
          <div className="font-number text-2xl font-bold text-profit">{stats.totalPayouts}</div>
        </div>
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Avg Size</div>
          <div className="font-number text-xl font-bold text-terminal-text">{formatCurrency(stats.averagePayoutSize)}</div>
        </div>
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Frequency</div>
          <div className="font-number text-xl font-bold text-terminal-text">{stats.payoutFrequency.toFixed(1)}<span className="text-sm text-terminal-muted">/mo</span></div>
        </div>
        {stats.largestPayout && (
          <div className="rounded-lg bg-profit-dim border border-profit/20 p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">
              Largest
            </div>
            <div className="font-number text-xl font-bold text-profit">{formatCurrency(stats.largestPayout.amount)}</div>
            <div className="text-[10px] font-mono text-terminal-muted mt-1">{formatDate(stats.largestPayout.date)}</div>
            {stats.largestPayout.firmName && (
              <div className="text-[10px] font-mono text-terminal-muted">{stats.largestPayout.firmName}</div>
            )}
          </div>
        )}
        {stats.smallestPayout && (
          <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Smallest</div>
            <div className="font-number text-xl font-bold text-terminal-text">{formatCurrency(stats.smallestPayout.amount)}</div>
            <div className="text-[10px] font-mono text-terminal-muted mt-1">{formatDate(stats.smallestPayout.date)}</div>
          </div>
        )}
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Avg Gap</div>
          <div className="font-number text-xl font-bold text-terminal-text">{stats.averageDaysBetweenPayouts.toFixed(1)} <span className="text-sm text-terminal-muted">days</span></div>
        </div>
      </div>
    </div>
  );
}
