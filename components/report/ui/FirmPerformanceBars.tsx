'use client';

import React from 'react';
import { PNLReport, formatCurrency } from '@/lib/pnl-calculations';

interface FirmPerformanceBarsProps {
  perFirmBreakdown: PNLReport['perFirmBreakdown'];
}

export function FirmPerformanceBars({ perFirmBreakdown }: FirmPerformanceBarsProps) {
  // Get top 3 firms by net PNL
  const topFirms = [...perFirmBreakdown]
    .sort((a, b) => b.netPNL - a.netPNL)
    .slice(0, 3);

  // Find the maximum absolute PNL for scaling
  const maxPNL = Math.max(
    ...topFirms.map(firm => Math.abs(firm.netPNL)),
    1 // Avoid division by zero
  );

  return (
    <div className="space-y-4">
      {topFirms.map((firm, index) => {
        const percentage = (Math.abs(firm.netPNL) / maxPNL) * 100;
        const isPositive = firm.netPNL >= 0;
        
        return (
          <div key={firm.firmName} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{firm.firmName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(firm.netPNL)}
                </span>
                <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isPositive
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
      {topFirms.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No firm data available</p>
      )}
    </div>
  );
}
