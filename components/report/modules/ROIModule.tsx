'use client';

import React from 'react';
import { formatCurrency, formatMonth } from '@/lib/pnl-calculations';

interface ROIModuleProps {
  stats: {
    roi: number;
    returnPerDollar: number;
    profitMargin: number;
    costPerPayout: number;
    breakEvenDate?: string | null;
  };
}

export function ROIModule({ stats }: ROIModuleProps) {
  return (
    <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
      <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted mb-4">
        ROI & Efficiency
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">ROI</div>
          <div className="text-2xl font-bold font-number text-accent-blue">{stats.roi.toFixed(1)}%</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mt-1">Return on fees</div>
        </div>
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Return per $</div>
          <div className="text-2xl font-bold font-number text-profit">${stats.returnPerDollar.toFixed(2)}</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mt-1">Per dollar spent</div>
        </div>
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Profit Margin</div>
          <div className="text-2xl font-bold font-number text-accent-purple">{stats.profitMargin.toFixed(1)}%</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mt-1">Of total deposits</div>
        </div>
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Cost per Payout</div>
          <div className="text-xl font-bold font-number text-terminal-text">{formatCurrency(stats.costPerPayout)}</div>
        </div>
        {stats.breakEvenDate && (
          <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Break-Even</div>
            <div className="text-sm font-bold font-number text-accent-amber">{formatMonth(stats.breakEvenDate)}</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mt-1">Fees = Deposits</div>
          </div>
        )}
      </div>
    </div>
  );
}
