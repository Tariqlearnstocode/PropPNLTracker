'use client';

import React, { useMemo } from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PNLReport, formatCurrency, formatMonth } from '@/lib/pnl-calculations';

interface MonthlyPNLChartProps {
  monthlyBreakdown: PNLReport['monthlyBreakdown'];
}

export function MonthlyPNLChart({ monthlyBreakdown }: MonthlyPNLChartProps) {
  const chartData = useMemo(() => {
    return monthlyBreakdown.map(month => ({
      month: formatMonth(month.month).split(' ')[0],
      fullMonth: formatMonth(month.month),
      deposits: month.deposits,
      fees: month.fees,
      netPNL: month.netPNL,
      runningTotal: month.runningTotal,
    }));
  }, [monthlyBreakdown]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullMonth || label}
        />
        <Legend />
        <Area type="monotone" dataKey="deposits" stroke="#10b981" fillOpacity={1} fill="url(#colorDeposits)" name="Deposits" />
        <Area type="monotone" dataKey="fees" stroke="#ef4444" fillOpacity={1} fill="url(#colorFees)" name="Fees" />
        <Line type="monotone" dataKey="runningTotal" stroke="#3b82f6" strokeWidth={2} dot={false} name="Running Total" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
