'use client';

import React, { useMemo, useId } from 'react';
import { PNLReport, formatCurrency } from '@/lib/pnl-calculations';

interface MonthlyPNLHeatmapProps {
  monthlyBreakdown: PNLReport['monthlyBreakdown'];
}

// Parse "YYYY-MM" as a local date (avoids UTC timezone shift)
function parseMonthKey(key: string): Date {
  const [year, month] = key.split('-');
  return new Date(parseInt(year), parseInt(month) - 1);
}

export function MonthlyPNLHeatmap({ monthlyBreakdown }: MonthlyPNLHeatmapProps) {
  const gridId = useId().replace(/:/g, '');

  const heatmapData = useMemo(() => {
    // Sort by month key string (YYYY-MM) — newest first, take last 12
    const sorted = [...monthlyBreakdown]
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);

    const pnlValues = sorted.map(m => m.netPNL);
    const minPNL = Math.min(...pnlValues, 0);
    const maxPNL = Math.max(...pnlValues, 0);

    return sorted.map(month => {
      // Zero-value cells: visible neutral background so they don't vanish
      let bgColor = 'rgba(50, 50, 68, 0.6)';
      let borderColor = 'rgba(60, 60, 80, 0.8)';
      let textColor = '#8a8aa0';
      let labelColor = '#8a8aa0';

      if (month.netPNL > 0) {
        const intensity = maxPNL > 0 ? Math.min(month.netPNL / maxPNL, 1) : 0;
        const alpha = 0.08 + intensity * 0.18;
        bgColor = `rgba(0, 230, 118, ${alpha})`;
        borderColor = `rgba(0, 230, 118, ${0.15 + intensity * 0.20})`;
        textColor = '#00e676';
        labelColor = '#e4e4ed';
      } else if (month.netPNL < 0) {
        const intensity = minPNL < 0 ? Math.min(Math.abs(month.netPNL) / Math.abs(minPNL), 1) : 0;
        const alpha = 0.08 + intensity * 0.18;
        bgColor = `rgba(255, 82, 82, ${alpha})`;
        borderColor = `rgba(255, 82, 82, ${0.15 + intensity * 0.20})`;
        textColor = '#ff5252';
        labelColor = '#e4e4ed';
      }

      return {
        ...month,
        bgColor,
        borderColor,
        textColor,
        labelColor,
      };
    });
  }, [monthlyBreakdown]);

  // Use 4 columns on sm+, 2 on mobile — capped by data length
  const cols = Math.min(heatmapData.length, 4);
  const mobileCols = Math.min(heatmapData.length, 2);

  return (
    <div className="space-y-3">
      <style>{`
        #${gridId} { grid-template-columns: repeat(${mobileCols}, minmax(0, 1fr)); }
        @media (min-width: 640px) { #${gridId} { grid-template-columns: repeat(${cols}, minmax(0, 1fr)); } }
      `}</style>
      <div id={gridId} className="grid gap-1.5 sm:gap-2">
        {heatmapData.map((month) => {
          const date = parseMonthKey(month.month);
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          const year = date.getFullYear().toString().slice(2);
          return (
            <div
              key={month.month}
              className="rounded-lg p-2.5 sm:p-3 transition-all duration-200 hover:scale-[1.02] cursor-pointer min-h-[60px] sm:min-h-[72px] flex flex-col justify-between"
              style={{
                background: month.bgColor,
                border: `1px solid ${month.borderColor}`,
              }}
              title={`${monthName} '${year}: ${formatCurrency(month.netPNL)}`}
            >
              <div
                className="text-[10px] font-mono uppercase tracking-wider font-medium"
                style={{ color: month.labelColor }}
              >
                {monthName} &apos;{year}
              </div>
              <div
                className="font-number text-sm font-bold mt-1"
                style={{ color: month.textColor }}
              >
                {month.netPNL >= 0 ? '+' : ''}{formatCurrency(month.netPNL)}
              </div>
            </div>
          );
        })}
      </div>
      {heatmapData.length === 0 && (
        <p className="text-sm text-terminal-muted text-center py-4 font-mono">No monthly data</p>
      )}
    </div>
  );
}
