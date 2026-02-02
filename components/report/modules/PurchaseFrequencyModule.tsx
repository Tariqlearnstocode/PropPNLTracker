'use client';

import React from 'react';
import { formatCurrency, formatDate } from '@/lib/pnl-calculations';

interface PurchaseFrequencyModuleProps {
  stats: {
    topPurchaseDays: Array<{ date: string; count: number; totalAmount: number }>;
    averagePurchaseSize: number;
    mostCommonPurchaseAmount: number;
    purchaseFrequencyDistribution: Array<{ range: string; count: number }>;
  };
}

export function PurchaseFrequencyModule({ stats }: PurchaseFrequencyModuleProps) {
  return (
    <div className="bg-terminal-card rounded-xl shadow-sm border border-terminal-border p-6">
      <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted mb-4">
        Purchase Frequency
      </h3>
      <div className="mb-4">
        <div className="text-sm text-terminal-text mb-2">Top Purchase Days</div>
        <div className="space-y-2">
          {stats.topPurchaseDays.slice(0, 5).map((day, i) => (
            <div key={i} className="flex items-center justify-between bg-terminal-bg rounded-lg p-3">
              <div>
                <div className="font-medium text-terminal-text">{formatDate(day.date)}</div>
                <div className="text-xs text-terminal-muted">{day.count} purchases</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-terminal-text">{formatCurrency(day.totalAmount)}</div>
                <div className="text-xs text-terminal-muted">Total</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-terminal-bg rounded-lg p-4">
          <div className="text-sm text-terminal-text mb-1">Avg Purchase</div>
          <div className="text-xl font-bold text-terminal-text">{formatCurrency(stats.averagePurchaseSize)}</div>
        </div>
        <div className="bg-terminal-bg rounded-lg p-4">
          <div className="text-sm text-terminal-text mb-1">Most Common</div>
          <div className="text-xl font-bold text-terminal-text">{formatCurrency(stats.mostCommonPurchaseAmount)}</div>
        </div>
        <div className="bg-terminal-bg rounded-lg p-4">
          <div className="text-sm text-terminal-text mb-1">Distribution</div>
          <div className="text-xs text-terminal-muted">
            {stats.purchaseFrequencyDistribution.map((d) => `${d.range}: ${d.count}`).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
}
