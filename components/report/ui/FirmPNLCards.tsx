'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PNLReport, formatCurrency } from '@/lib/pnl-calculations';

interface FirmPNLCardsProps {
  perFirmBreakdown: PNLReport['perFirmBreakdown'];
}

export function FirmPNLCards({ perFirmBreakdown }: FirmPNLCardsProps) {
  const topFirms = [...perFirmBreakdown]
    .sort((a, b) => b.netPNL - a.netPNL)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {topFirms.map((firm) => {
        const isPositive = firm.netPNL >= 0;
        const roi = firm.fees > 0 ? ((firm.netPNL / firm.fees) * 100) : 0;

        return (
          <div
            key={firm.firmName}
            className="rounded-xl border border-terminal-border bg-terminal-card p-4 card-hover"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-terminal-text truncate" title={firm.firmName}>
                  {firm.firmName}
                </h4>
                <div className={`font-number text-xl font-bold mt-1.5 ${isPositive ? 'text-profit' : 'text-loss'}`}>
                  {isPositive ? '+' : ''}{formatCurrency(firm.netPNL)}
                </div>
              </div>
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${isPositive ? 'bg-profit-dim' : 'bg-loss-dim'}`}>
                {isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-profit" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-loss" />
                )}
              </div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-terminal-border">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-terminal-muted">Deposits</span>
                <span className="text-profit/80">+{formatCurrency(firm.deposits)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-terminal-muted">Fees</span>
                <span className="text-loss/80">-{formatCurrency(firm.fees)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-terminal-muted">ROI</span>
                <span className={`font-semibold ${roi >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {topFirms.length === 0 && (
        <div className="col-span-full text-center py-8 text-sm text-terminal-muted font-mono">
          No firm data available
        </div>
      )}
    </div>
  );
}
