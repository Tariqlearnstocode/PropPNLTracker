'use client';

import React from 'react';
import { formatCurrency } from '@/lib/pnl-calculations';

interface DepositsFeesBreakdownProps {
  deposits: number;
  fees: number;
}

export function DepositsFeesBreakdown({ deposits, fees }: DepositsFeesBreakdownProps) {
  const total = deposits + fees;
  const depositsPercentage = total > 0 ? (deposits / total) * 100 : 0;
  const feesPercentage = total > 0 ? (fees / total) * 100 : 0;
  const netPNL = deposits - fees;
  const netPNLPercentage = deposits > 0 ? (netPNL / deposits) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Center Metric - Net Margin */}
      <div className="text-center py-2">
        <div className={`font-number text-4xl font-extrabold mb-1 ${
          netPNLPercentage >= 0 ? 'text-profit' : 'text-loss'
        }`}>
          {netPNLPercentage >= 0 ? '+' : ''}{netPNLPercentage.toFixed(1)}%
        </div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted">Net Margin</div>
      </div>

      {/* Breakdown Bars */}
      <div className="space-y-4">
        {/* Deposits Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted">Deposits</span>
            <span className="font-number text-xs font-semibold text-profit">{formatCurrency(deposits)}</span>
          </div>
          <div className="w-full bg-terminal-border rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${depositsPercentage}%`,
                background: 'linear-gradient(90deg, #00e676, #69f0ae)',
              }}
            />
          </div>
        </div>

        {/* Fees Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted">Fees</span>
            <span className="font-number text-xs font-semibold text-loss">{formatCurrency(fees)}</span>
          </div>
          <div className="w-full bg-terminal-border rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${feesPercentage}%`,
                background: 'linear-gradient(90deg, #ff5252, #ff8a80)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Net PNL */}
      <div className="pt-4 border-t border-terminal-border">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted">Net PNL</span>
          <span className={`font-number text-base font-bold ${netPNL >= 0 ? 'text-profit' : 'text-loss'}`}>
            {netPNL >= 0 ? '+' : ''}{formatCurrency(netPNL)}
          </span>
        </div>
      </div>
    </div>
  );
}
