'use client';

import React from 'react';
import { PNLReport, formatCurrency } from '@/lib/pnl-calculations';

interface TopFirmsTableProps {
  perFirmBreakdown: PNLReport['perFirmBreakdown'];
}

export function TopFirmsTable({ perFirmBreakdown }: TopFirmsTableProps) {
  const topFirms = [...perFirmBreakdown]
    .sort((a, b) => b.netPNL - a.netPNL);

  return (
    <div className="overflow-x-auto dark-scroll">
      <table className="w-full">
        <thead>
          <tr className="border-b border-terminal-border">
            <th className="text-left py-2.5 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">#</th>
            <th className="text-left py-2.5 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Firm</th>
            <th className="text-right py-2.5 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Deposits</th>
            <th className="text-right py-2.5 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Fees</th>
            <th className="text-right py-2.5 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Net PNL</th>
            <th className="text-right py-2.5 px-3 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">ROI</th>
          </tr>
        </thead>
        <tbody>
          {topFirms.map((firm, index) => {
            const isPositive = firm.netPNL >= 0;
            const roi = firm.fees > 0 ? ((firm.netPNL / firm.fees) * 100) : 0;
            return (
              <tr
                key={firm.firmName}
                className="border-b border-terminal-border/50 hover:bg-terminal-card-hover transition-colors group"
              >
                <td className="py-3 px-3 font-mono text-xs text-terminal-muted">
                  {index + 1}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isPositive ? 'bg-profit' : 'bg-loss'
                    }`} />
                    <span className="text-sm font-medium text-terminal-text group-hover:text-white transition-colors">
                      {firm.firmName}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 font-number text-sm text-right text-profit/80">
                  +{formatCurrency(firm.deposits)}
                </td>
                <td className="py-3 px-3 font-number text-sm text-right text-loss/80">
                  -{formatCurrency(firm.fees)}
                </td>
                <td className={`py-3 px-3 font-number text-sm text-right font-bold ${
                  isPositive ? 'text-profit' : 'text-loss'
                }`}>
                  <div className="flex items-center justify-end gap-1">
                    {isPositive
                      ? <span className="text-sm">↗</span>
                      : <span className="text-sm">↘</span>
                    }
                    {isPositive ? '+' : ''}{formatCurrency(firm.netPNL)}
                  </div>
                </td>
                <td className={`py-3 px-3 font-number text-xs text-right font-semibold ${
                  roi >= 0 ? 'text-profit' : 'text-loss'
                }`}>
                  {roi >= 0 ? '+' : ''}{roi.toFixed(0)}%
                </td>
              </tr>
            );
          })}
          {topFirms.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-sm text-terminal-muted font-mono">
                No firm data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
