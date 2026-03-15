'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { PNLReport, formatCurrency } from '@/lib/pnl-calculations';

interface PerFirmChartProps {
  perFirmBreakdown: PNLReport['perFirmBreakdown'];
}

export function PerFirmChart({ perFirmBreakdown }: PerFirmChartProps) {
  const chartData = useMemo(() => {
    return perFirmBreakdown
      .slice(0, 8) // Top 8 firms for better visibility
      .map(firm => ({
        name: firm.firmName.length > 12 ? firm.firmName.substring(0, 12) + '...' : firm.firmName,
        fullName: firm.firmName,
        deposits: firm.deposits,
        fees: firm.fees,
        netPNL: firm.netPNL,
      }));
  }, [perFirmBreakdown]);

  // Find max value for scaling
  const maxValue = useMemo(() => {
    return Math.max(
      ...chartData.map(firm => Math.max(firm.deposits, firm.fees)),
      1000 // Minimum scale
    );
  }, [chartData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280" 
          fontSize={11}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          stroke="#6b7280" 
          fontSize={11}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            padding: '8px 12px'
          }}
          formatter={(value) => {
            return value !== undefined ? formatCurrency(Number(value)) : '';
          }}
          labelFormatter={(label, payload) => {
            return payload?.[0]?.payload?.fullName || label;
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="rect"
        />
        <Bar dataKey="deposits" fill="#10b981" name="Deposits" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`deposits-${index}`} fill="#10b981" />
          ))}
        </Bar>
        <Bar dataKey="fees" fill="#ef4444" name="Fees" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`fees-${index}`} fill="#ef4444" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
