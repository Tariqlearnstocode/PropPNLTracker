'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/pnl-calculations';

interface DayOfWeekPatternsModuleProps {
  stats: Array<{
    day: string;
    totalPNL: number;
    averagePNL: number;
    purchaseCount: number;
    payoutCount: number;
  }>;
}

export function DayOfWeekPatternsModule({ stats }: DayOfWeekPatternsModuleProps) {
  const chartData = stats.map(day => ({
    day: day.day.substring(0, 3),
    fullDay: day.day,
    totalPNL: day.totalPNL,
    averagePNL: day.averagePNL,
    purchases: day.purchaseCount,
    payouts: day.payoutCount,
  }));

  return (
    <div className="bg-terminal-card rounded-xl shadow-sm border border-terminal-border p-6">
      <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted mb-4">
        Day-of-Week Patterns
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2a" />
          <XAxis dataKey="day" stroke="#6b6b80" fontSize={12} />
          <YAxis stroke="#6b6b80" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111118', border: '1px solid #1e1e2a', borderRadius: '8px' }}
            formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDay || label}
          />
          <Legend />
          <Bar dataKey="totalPNL" fill="#8b5cf6" name="Total PNL" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {stats.map(day => (
          <div key={day.day} className="bg-terminal-bg rounded-lg p-3">
            <div className="text-xs text-terminal-text mb-1">{day.day}</div>
            <div className={`text-lg font-bold ${day.averagePNL >= 0 ? 'text-profit' : 'text-loss'}`}>
              {formatCurrency(day.averagePNL)}
            </div>
            <div className="text-xs text-terminal-muted mt-1">
              {day.payoutCount}D / {day.purchaseCount}P
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
