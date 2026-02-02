'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatMonth } from '@/lib/pnl-calculations';

interface GrowthTrendsModuleProps {
  stats: {
    monthOverMonthGrowth: Array<{ month: string; growth: number; netPNL: number }>;
    averageMonthlyPNL: number;
    projectedAnnualPNL: number;
    growthVelocity: number;
  };
}

export function GrowthTrendsModule({ stats }: GrowthTrendsModuleProps) {
  const chartData = stats.monthOverMonthGrowth.map((g) => ({
    month: formatMonth(g.month).split(' ')[0],
    fullMonth: formatMonth(g.month),
    growth: g.growth,
    netPNL: g.netPNL,
  }));

  return (
    <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
      <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted mb-4">
        Growth Trends
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Avg Monthly PNL</div>
          <div className="text-xl font-bold font-number text-terminal-text">{formatCurrency(stats.averageMonthlyPNL)}</div>
        </div>
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Projected Annual</div>
          <div className="text-xl font-bold font-number text-accent-blue">{formatCurrency(stats.projectedAnnualPNL)}</div>
        </div>
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Growth Velocity</div>
          <div className={`text-xl font-bold font-number ${stats.growthVelocity >= 0 ? 'text-profit' : 'text-loss'}`}>
            {stats.growthVelocity >= 0 ? '+' : ''}{stats.growthVelocity.toFixed(1)}%
          </div>
        </div>
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Months Tracked</div>
          <div className="text-xl font-bold font-number text-terminal-text">{stats.monthOverMonthGrowth.length + 1}</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2a" />
          <XAxis dataKey="month" stroke="#6b6b80" fontSize={12} />
          <YAxis stroke="#6b6b80" fontSize={12} tickFormatter={(value) => `${value.toFixed(0)}%`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111118', border: '1px solid #1e1e2a', borderRadius: '8px', color: '#e4e4ed' }}
            formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(1)}%` : ''}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullMonth || label}
          />
          <Bar dataKey="growth" fill="#448aff" name="MoM Growth %" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
