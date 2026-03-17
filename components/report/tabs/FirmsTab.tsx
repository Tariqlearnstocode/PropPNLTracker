'use client';

import React, { useMemo } from 'react';
import { PNLReport, formatCurrency } from '@/lib/pnl-calculations';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

const axisTickStyle = { fill: '#6b6b80', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' };

function formatAxisDollar(v: number): string {
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v.toFixed(0)}`;
}

interface FirmsTabProps {
  filteredFirmBreakdown: PNLReport['perFirmBreakdown'];
  allFirmBreakdown: PNLReport['perFirmBreakdown'];
  selectedFirms: string[];
  onToggleFirm: (firmName: string) => void;
}

export function FirmsTab({ filteredFirmBreakdown, allFirmBreakdown, selectedFirms, onToggleFirm }: FirmsTabProps) {
  // Show filtered firms if filter is active, otherwise all
  const firms = selectedFirms.length > 0
    ? [...filteredFirmBreakdown].sort((a, b) => b.netPNL - a.netPNL)
    : [...allFirmBreakdown].sort((a, b) => b.netPNL - a.netPNL);

  // Calculate totals
  const totalDeposits = firms.reduce((sum, f) => sum + f.deposits, 0);
  const totalFees = firms.reduce((sum, f) => sum + f.fees, 0);
  const totalPNL = firms.reduce((sum, f) => sum + f.netPNL, 0);
  const totalTxns = firms.reduce((sum, f) => sum + f.transactionCount, 0);

  // Chart data — sorted by netPNL descending
  const firmChartData = useMemo(() => {
    return firms.map((f) => ({
      name: f.firmName,
      value: f.netPNL,
    }));
  }, [firms]);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Total Firms</div>
          <div className="font-number text-2xl font-bold text-terminal-text">{firms.length}</div>
        </div>
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Total Deposits</div>
          <div className="font-number text-2xl font-bold text-profit">+{formatCurrency(totalDeposits)}</div>
        </div>
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Total Fees</div>
          <div className="font-number text-2xl font-bold text-loss">-{formatCurrency(totalFees)}</div>
        </div>
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Net PNL</div>
          <div className={`font-number text-2xl font-bold ${totalPNL >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalPNL >= 0 ? '+' : ''}{formatCurrency(totalPNL)}
          </div>
        </div>
      </div>

      {/* Firm Performance Bar Chart */}
      {firmChartData.length > 0 && (
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted">Firm Performance</h3>
            <span className="text-[11px] font-mono text-terminal-muted">
              {firmChartData.length} firm{firmChartData.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={Math.max(firmChartData.length * 44, 120)}>
            <BarChart
              data={firmChartData}
              layout="vertical"
              margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={axisTickStyle}
                axisLine={{ stroke: '#1e1e2a' }}
                tickLine={false}
                tickFormatter={formatAxisDollar}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ ...axisTickStyle, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111118',
                  border: '1px solid #1e1e2a',
                  borderRadius: 8,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                }}
                labelStyle={{ color: '#6b6b80' }}
                itemStyle={{ color: '#e4e4ed' }}
                formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Net P&L']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {firmChartData.map((entry, index) => (
                  <Cell
                    key={`firm-${index}`}
                    fill={entry.value >= 0 ? '#00e676' : '#ff5252'}
                    fillOpacity={0.8}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  content={({ x, y, width, height, value }) => {
                    const numVal = Number(value ?? 0);
                    const isNeg = numVal < 0;
                    const labelX = isNeg
                      ? (Number(x) - 8)
                      : (Number(x) + Number(width) + 8);
                    return (
                      <text
                        x={labelX}
                        y={Number(y) + Number(height) / 2}
                        textAnchor={isNeg ? 'end' : 'start'}
                        dominantBaseline="central"
                        style={{
                          fill: '#e4e4ed',
                          fontSize: 11,
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(numVal)}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Firm table */}
      <div className="rounded-xl border border-terminal-border bg-terminal-card">
        <div className="overflow-x-auto dark-scroll">
          <table className="w-full">
            <thead>
              <tr className="border-b border-terminal-border">
                <th className="text-left py-3 px-4 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">#</th>
                <th className="text-left py-3 px-4 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Firm Name</th>
                <th className="text-right py-3 px-4 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Net PNL</th>
                <th className="text-right py-3 px-4 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Deposits</th>
                <th className="text-right py-3 px-4 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Fees</th>
                <th className="text-right py-3 px-4 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">ROI</th>
                <th className="text-right py-3 px-4 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Txns</th>
                <th className="text-center py-3 px-4 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Match</th>
                <th className="text-center py-3 px-4 text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Filter</th>
              </tr>
            </thead>
            <tbody>
              {firms.map((firm, index) => {
                const isPositive = firm.netPNL >= 0;
                const roi = firm.fees > 0 ? ((firm.netPNL / firm.fees) * 100) : 0;
                const isSelected = selectedFirms.includes(firm.firmName);

                return (
                  <tr
                    key={firm.firmName}
                    className={`border-b border-terminal-border/50 hover:bg-terminal-card-hover transition-colors group ${
                      isSelected ? 'bg-profit-dim/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-xs text-terminal-muted">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          isPositive ? 'bg-profit' : 'bg-loss'
                        }`} />
                        <span className="text-sm font-medium text-terminal-text group-hover:text-white transition-colors">
                          {firm.firmName}
                        </span>
                      </div>
                    </td>
                    <td className={`py-3 px-4 font-number text-sm text-right font-bold ${
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
                    <td className="py-3 px-4 font-number text-sm text-right text-profit/80">
                      +{formatCurrency(firm.deposits)}
                    </td>
                    <td className="py-3 px-4 font-number text-sm text-right text-loss/80">
                      -{formatCurrency(firm.fees)}
                    </td>
                    <td className={`py-3 px-4 font-number text-xs text-right font-semibold ${
                      roi >= 0 ? 'text-profit' : 'text-loss'
                    }`}>
                      {roi >= 0 ? '+' : ''}{roi.toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 font-number text-xs text-right text-terminal-muted">
                      {firm.transactionCount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <ConfidenceBadge confidence={firm.confidence} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleFirm(firm.firmName)}
                        className={`px-3 py-1 text-[11px] font-mono font-medium rounded transition-colors ${
                          isSelected
                            ? 'bg-profit/20 text-profit border border-profit/30 hover:bg-profit/30'
                            : 'bg-terminal-bg text-terminal-muted border border-terminal-border hover:text-terminal-text hover:bg-terminal-card-hover'
                        }`}
                      >
                        {isSelected ? 'Active' : 'Filter'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {firms.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-sm text-terminal-muted font-mono">
                    No firm data available
                  </td>
                </tr>
              )}
            </tbody>
            {/* Totals row */}
            {firms.length > 0 && (
              <tfoot>
                <tr className="border-t border-terminal-border bg-terminal-bg/50">
                  <td className="py-3 px-4" />
                  <td className="py-3 px-4 text-sm font-semibold text-terminal-text">Total</td>
                  <td className={`py-3 px-4 font-number text-sm text-right font-bold ${totalPNL >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {totalPNL >= 0 ? '+' : ''}{formatCurrency(totalPNL)}
                  </td>
                  <td className="py-3 px-4 font-number text-sm text-right font-semibold text-profit">
                    +{formatCurrency(totalDeposits)}
                  </td>
                  <td className="py-3 px-4 font-number text-sm text-right font-semibold text-loss">
                    -{formatCurrency(totalFees)}
                  </td>
                  <td className="py-3 px-4" />
                  <td className="py-3 px-4 font-number text-xs text-right font-semibold text-terminal-text">
                    {totalTxns}
                  </td>
                  <td className="py-3 px-4" />
                  <td className="py-3 px-4" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
