'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PNLReport, formatCurrency } from '@/lib/pnl-calculations';

interface FirmDonutChartProps {
  perFirmBreakdown: PNLReport['perFirmBreakdown'];
}

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

export function FirmDonutChart({ perFirmBreakdown }: FirmDonutChartProps) {
  const chartData = useMemo(() => {
    // Get top firms by absolute PNL value
    const sortedFirms = [...perFirmBreakdown]
      .filter(firm => Math.abs(firm.netPNL) > 0)
      .sort((a, b) => Math.abs(b.netPNL) - Math.abs(a.netPNL))
      .slice(0, 5); // Top 5 firms

    const totalPNL = sortedFirms.reduce((sum, firm) => sum + Math.abs(firm.netPNL), 0);

    return sortedFirms.map((firm, index) => ({
      name: firm.firmName,
      value: Math.abs(firm.netPNL),
      percentage: totalPNL > 0 ? (Math.abs(firm.netPNL) / totalPNL) * 100 : 0,
      netPNL: firm.netPNL,
      color: COLORS[index % COLORS.length],
    }));
  }, [perFirmBreakdown]);

  const totalPNL = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const topFirmsCount = chartData.length;
  const topFirmsPercentage = chartData.length > 0
    ? Math.round((chartData.reduce((sum, item) => sum + item.percentage, 0) / topFirmsCount) * 10) / 10
    : 0;

  return (
    <div className="relative h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#111118', border: '1px solid #1e1e2a', borderRadius: '8px', padding: '8px' }}
            formatter={(_value, _name, props) => {
              const data = props.payload as { netPNL: number; name: string } | undefined;
              if (!data) return [String(_value ?? ''), String(_name ?? '')];
              return [`${formatCurrency(data.netPNL)}`, data.name];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
        <div className="text-4xl font-bold text-terminal-text">{topFirmsCount}</div>
        <div className="text-sm text-terminal-text mt-1">Top Firms</div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-terminal-text">
          {topFirmsCount > 0 ? `${topFirmsCount} firms contributing to total PNL` : 'No firm data available'}
        </p>
      </div>
    </div>
  );
}
