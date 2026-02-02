'use client';

import React from 'react';
import { formatCurrency, formatDate, formatMonth } from '@/lib/pnl-calculations';

interface BestWorstModuleProps {
  stats: {
    bestMonth?: { month: string; netPNL: number; deposits: number; fees: number } | null;
    worstMonth?: { month: string; netPNL: number; deposits: number; fees: number } | null;
    bestDay?: { date: string; netPNL: number; deposits: number } | null;
    largestPurchase?: { amount: number; date: string; firmName?: string | null } | null;
    bestFirm?: { firmName: string; netPNL: number } | null;
    worstFirm?: { firmName: string; netPNL: number } | null;
  };
}

export function BestWorstModule({ stats }: BestWorstModuleProps) {
  return (
    <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
      <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted mb-4">
        Best & Worst Performance
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.bestMonth && (
          <div className="rounded-lg bg-profit-dim border border-profit/20 p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Best Month</div>
            <div className="text-lg font-bold text-profit">{formatMonth(stats.bestMonth.month)}</div>
            <div className="text-2xl font-bold font-number text-profit mt-2">{formatCurrency(stats.bestMonth.netPNL)}</div>
            <div className="text-[11px] font-mono text-terminal-muted mt-1">
              {formatCurrency(stats.bestMonth.deposits)} deposits • {formatCurrency(stats.bestMonth.fees)} fees
            </div>
          </div>
        )}
        {stats.worstMonth && (
          <div className="rounded-lg bg-loss-dim border border-loss/20 p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Worst Month</div>
            <div className="text-lg font-bold text-loss">{formatMonth(stats.worstMonth.month)}</div>
            <div className="text-2xl font-bold font-number text-loss mt-2">{formatCurrency(stats.worstMonth.netPNL)}</div>
            <div className="text-[11px] font-mono text-terminal-muted mt-1">
              {formatCurrency(stats.worstMonth.deposits)} deposits • {formatCurrency(stats.worstMonth.fees)} fees
            </div>
          </div>
        )}
        {stats.bestDay && (
          <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Best Day</div>
            <div className="text-lg font-bold text-accent-blue">{formatDate(stats.bestDay.date)}</div>
            <div className="text-2xl font-bold font-number text-accent-blue mt-2">{formatCurrency(stats.bestDay.netPNL)}</div>
            <div className="text-[11px] font-mono text-terminal-muted mt-1">
              {formatCurrency(stats.bestDay.deposits)} in deposits
            </div>
          </div>
        )}
        {stats.largestPurchase && (
          <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Largest Purchase</div>
            <div className="text-lg font-bold font-number text-terminal-text">{formatCurrency(stats.largestPurchase.amount)}</div>
            <div className="text-[11px] font-mono text-terminal-muted mt-1">{formatDate(stats.largestPurchase.date)}</div>
            {stats.largestPurchase.firmName && (
              <div className="text-[11px] font-mono text-terminal-muted">{stats.largestPurchase.firmName}</div>
            )}
          </div>
        )}
        {stats.bestFirm && (
          <div className="rounded-lg bg-profit-dim border border-profit/20 p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Best Firm</div>
            <div className="text-lg font-bold text-profit">{stats.bestFirm.firmName}</div>
            <div className="text-xl font-bold font-number text-profit mt-2">{formatCurrency(stats.bestFirm.netPNL)}</div>
          </div>
        )}
        {stats.worstFirm && (
          <div className="rounded-lg bg-loss-dim border border-loss/20 p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Worst Firm</div>
            <div className="text-lg font-bold text-loss">{stats.worstFirm.firmName}</div>
            <div className="text-xl font-bold font-number text-loss mt-2">{formatCurrency(stats.worstFirm.netPNL)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
