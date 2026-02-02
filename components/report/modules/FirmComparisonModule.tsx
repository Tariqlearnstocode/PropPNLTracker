'use client';

import React from 'react';
import { formatCurrency } from '@/lib/pnl-calculations';

interface FirmComparisonModuleProps {
  stats: {
    mostProfitableFirm?: { firmName: string; netPNL: number } | null;
    bestROIFirm?: { firmName: string; roi: number; netPNL: number } | null;
    mostActiveFirm?: { firmName: string; transactionCount: number } | null;
    averagePayoutPerFirm: number;
    firmSuccessRate: Array<{ firmName: string; payouts: number; purchases: number; successRate: number }>;
  };
}

export function FirmComparisonModule({ stats }: FirmComparisonModuleProps) {
  return (
    <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
      <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted mb-4">
        Firm Comparison
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.mostProfitableFirm && (
          <div className="rounded-lg bg-profit-dim border border-profit/20 p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Most Profitable</div>
            <div className="text-lg font-bold text-profit truncate" title={stats.mostProfitableFirm.firmName}>
              {stats.mostProfitableFirm.firmName}
            </div>
            <div className="text-2xl font-bold font-number text-profit mt-2">
              {formatCurrency(stats.mostProfitableFirm.netPNL)}
            </div>
          </div>
        )}
        {stats.bestROIFirm && (
          <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Best ROI</div>
            <div className="text-lg font-bold text-accent-blue truncate" title={stats.bestROIFirm.firmName}>
              {stats.bestROIFirm.firmName}
            </div>
            <div className="text-2xl font-bold font-number text-accent-blue mt-2">
              {stats.bestROIFirm.roi.toFixed(1)}%
            </div>
            <div className="text-[11px] font-mono text-terminal-muted mt-1">
              {formatCurrency(stats.bestROIFirm.netPNL)} net
            </div>
          </div>
        )}
        {stats.mostActiveFirm && (
          <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Most Active</div>
            <div className="text-lg font-bold text-terminal-text truncate" title={stats.mostActiveFirm.firmName}>
              {stats.mostActiveFirm.firmName}
            </div>
            <div className="text-xl font-bold font-number text-terminal-text mt-2">
              {stats.mostActiveFirm.transactionCount} transactions
            </div>
          </div>
        )}
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Avg Payout/Firm</div>
          <div className="text-xl font-bold font-number text-terminal-text">{formatCurrency(stats.averagePayoutPerFirm)}</div>
        </div>
      </div>
      {stats.firmSuccessRate.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-mono uppercase tracking-widest text-terminal-muted mb-2">Firm Success Rates</div>
          <div className="space-y-2">
            {stats.firmSuccessRate
              .sort((a, b) => b.successRate - a.successRate)
              .slice(0, 5)
              .map((firm, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-terminal-bg border border-terminal-border p-3">
                  <div className="flex-1">
                    <div className="font-medium text-terminal-text truncate">{firm.firmName}</div>
                    <div className="text-[11px] font-mono text-terminal-muted">{firm.payouts} payouts / {firm.purchases} purchases</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-number text-profit">{firm.successRate.toFixed(1)}%</div>
                    <div className="text-[11px] font-mono text-terminal-muted">Success rate</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
