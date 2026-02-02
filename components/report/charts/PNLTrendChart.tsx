'use client';

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PNLReport, formatCurrency, formatMonth } from '@/lib/pnl-calculations';

interface PNLTrendChartProps {
  monthlyBreakdown: PNLReport['monthlyBreakdown'];
}

export function PNLTrendChart({ monthlyBreakdown }: PNLTrendChartProps) {
  const chartData = useMemo(() => {
    return monthlyBreakdown.map(month => ({
      month: formatMonth(month.month).split(' ')[0],
      fullMonth: formatMonth(month.month),
      netPNL: month.netPNL,
      runningTotal: month.runningTotal,
    }));
  }, [monthlyBreakdown]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullMonth || label}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="netPNL" 
          stroke="#8b5cf6" 
          strokeWidth={2} 
          dot={{ fill: '#8b5cf6', r: 4 }} 
          name="Monthly PNL"
        />
        <Line 
          type="monotone" 
          dataKey="runningTotal" 
          stroke="#3b82f6" 
          strokeWidth={2} 
          dot={false} 
          strokeDasharray="5 5"
          name="Running Total"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
