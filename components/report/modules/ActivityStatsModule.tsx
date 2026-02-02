'use client';

import React from 'react';
import { formatCurrency } from '@/lib/pnl-calculations';

interface ActivityStatsModuleProps {
  stats: {
    totalPurchases: number;
    totalPayouts: number;
    purchaseToPayoutRatio: number;
    averagePurchaseSize: number;
    averagePayoutSize: number;
    activeMonths: number;
  };
}

export function ActivityStatsModule({ stats }: ActivityStatsModuleProps) {
  return (
    <div className="bg-terminal-card rounded-xl shadow-sm border border-terminal-border p-6">
      <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted mb-4">
        Activity Stats
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-profit-dim to-profit-muted rounded-lg p-4">
          <div className="text-sm text-terminal-text mb-1">Total Purchases</div>
          <div className="text-2xl font-bold text-profit">{stats.totalPurchases.toLocaleString()}</div>
          <div className="text-xs text-terminal-muted mt-1">Challenges & fees</div>
        </div>
        <div className="bg-gradient-to-br from-accent-blue/10 to-accent-blue/20 rounded-lg p-4">
          <div className="text-sm text-terminal-text mb-1">Total Payouts</div>
          <div className="text-2xl font-bold text-accent-blue">{stats.totalPayouts.toLocaleString()}</div>
          <div className="text-xs text-terminal-muted mt-1">Successful payouts</div>
        </div>
        <div className="bg-gradient-to-br from-accent-purple/10 to-accent-purple/20 rounded-lg p-4">
          <div className="text-sm text-terminal-text mb-1">Purchase/Payout Ratio</div>
          <div className="text-2xl font-bold text-accent-purple">{stats.purchaseToPayoutRatio.toFixed(2)}x</div>
          <div className="text-xs text-terminal-muted mt-1">Purchases per payout</div>
        </div>
        <div className="bg-terminal-bg rounded-lg p-4">
          <div className="text-sm text-terminal-text mb-1">Avg Purchase Size</div>
          <div className="text-xl font-bold text-terminal-text">{formatCurrency(stats.averagePurchaseSize)}</div>
        </div>
        <div className="bg-terminal-bg rounded-lg p-4">
          <div className="text-sm text-terminal-text mb-1">Avg Payout Size</div>
          <div className="text-xl font-bold text-terminal-text">{formatCurrency(stats.averagePayoutSize)}</div>
        </div>
        <div className="bg-terminal-bg rounded-lg p-4">
          <div className="text-sm text-terminal-text mb-1">Active Months</div>
          <div className="text-xl font-bold text-terminal-text">{stats.activeMonths}</div>
        </div>
      </div>
    </div>
  );
}
