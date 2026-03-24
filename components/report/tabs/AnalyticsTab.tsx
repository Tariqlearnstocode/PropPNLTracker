'use client';

import React, { useState, useMemo } from 'react';
import { TradingStats, formatCurrency, formatDate, formatMonth } from '@/lib/pnl-calculations';
import { DailyPNLCalendar } from '../ui/DailyPNLCalendar';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface AnalyticsTabProps {
  tradingStats: TradingStats;
}

// ---- Helpers ----

function shortMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function shortDay(dayName: string): string {
  return dayName.substring(0, 3);
}

function formatAxisDollar(v: number): string {
  if (Math.abs(v) >= 1000) {
    return `$${(v / 1000).toFixed(0)}k`;
  }
  return `$${v.toFixed(0)}`;
}

function formatAxisDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}`;
  }
  return dateStr;
}

// Shared axis/tooltip props
const axisTickStyle = { fill: '#6b7280', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' };
const xAxisProps = {
  tick: axisTickStyle,
  axisLine: { stroke: '#e5e7eb' },
  tickLine: false as const,
};
const yAxisProps = {
  tick: axisTickStyle,
  axisLine: false as const,
  tickLine: false as const,
};
const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 12,
  },
  labelStyle: { color: '#6b7280' },
  itemStyle: { color: '#111827' },
};

// ---- Component ----

export function AnalyticsTab({ tradingStats }: AnalyticsTabProps) {
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  );

  // Derived day-of-week stats
  const dayOfWeekDerived = useMemo(() => {
    const stats = tradingStats.dayOfWeekStats;
    if (!stats || stats.length === 0) {
      return { mostActive: null, mostProfitable: null, leastProfitable: null };
    }

    const mostActive = stats.reduce((best, day) => {
      const dayTotal = day.purchaseCount + day.payoutCount;
      const bestTotal = best.purchaseCount + best.payoutCount;
      return dayTotal > bestTotal ? day : best;
    });

    const mostProfitable = stats.reduce((best, day) =>
      day.averagePNL > best.averagePNL ? day : best
    );

    const leastProfitable = stats.reduce((worst, day) =>
      day.averagePNL < worst.averagePNL ? day : worst
    );

    return { mostActive, mostProfitable, leastProfitable };
  }, [tradingStats.dayOfWeekStats]);

  // Derive worst day from dailyPNL (not in BestWorstStats)
  const worstDay = useMemo(() => {
    const daily = tradingStats.dailyPNL;
    if (!daily || daily.length === 0) return null;
    return daily.reduce((worst, day) => day.netPNL < worst.netPNL ? day : worst);
  }, [tradingStats.dailyPNL]);

  // Current streak (win or loss)
  const currentStreak = useMemo(() => {
    const s = tradingStats.streakStats;
    if (s.currentWinStreak > 0) {
      return { value: s.currentWinStreak, label: 'Winning', type: 'win' as const };
    }
    if (s.currentLossStreak > 0) {
      return { value: s.currentLossStreak, label: 'Losing', type: 'loss' as const };
    }
    return { value: 0, label: 'None', type: 'neutral' as const };
  }, [tradingStats.streakStats]);

  const { activityStats, bestWorstStats, roiStats, streakStats, growthTrends } = tradingStats;
  const totalTransactions = activityStats.totalPurchases + activityStats.totalPayouts;

  // Average growth rate from monthOverMonthGrowth
  const avgGrowthRate = useMemo(() => {
    const data = growthTrends.monthOverMonthGrowth;
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, m) => acc + m.growth, 0);
    return sum / data.length;
  }, [growthTrends.monthOverMonthGrowth]);

  // ---- Chart data ----

  // Cumulative PNL from dailyPNL (running total)
  const cumulativeChartData = useMemo(() => {
    const daily = tradingStats.dailyPNL;
    if (!daily || daily.length === 0) return [];
    let cumulative = 0;
    return daily.map((d) => {
      cumulative += d.netPNL;
      return { date: d.date, cumulativePNL: cumulative };
    });
  }, [tradingStats.dailyPNL]);

  // Net Daily PNL bar chart data
  const dailyBarData = useMemo(() => {
    const daily = tradingStats.dailyPNL;
    if (!daily || daily.length === 0) return [];
    return daily.map((d) => ({
      date: d.date,
      value: d.netPNL,
    }));
  }, [tradingStats.dailyPNL]);

  // Monthly PNL bar chart data — derive from dailyPNL grouped by month
  const monthlyBarData = useMemo(() => {
    const daily = tradingStats.dailyPNL;
    if (!daily || daily.length === 0) return [];
    const monthMap: Record<string, number> = {};
    daily.forEach((d) => {
      const monthKey = d.date.substring(0, 7);
      monthMap[monthKey] = (monthMap[monthKey] || 0) + d.netPNL;
    });
    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, value]) => ({ month, value }));
  }, [tradingStats.dailyPNL]);

  // Day-of-week horizontal bar chart data
  const dayOfWeekBarData = useMemo(() => {
    const stats = tradingStats.dayOfWeekStats;
    if (!stats || stats.length === 0) return [];
    return stats.map((d) => ({
      day: shortDay(d.day),
      value: d.averagePNL,
    }));
  }, [tradingStats.dayOfWeekStats]);

  // Biggest payout from payoutPerformanceStats
  const biggestPayout = tradingStats.payoutPerformanceStats.largestPayout;
  const bestFirm = bestWorstStats.bestFirm;
  const worstFirm = bestWorstStats.worstFirm;

  return (
    <div className="space-y-3">

      {/* 0. Biggest Payout / Best Firm / Worst Firm — headline stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Biggest Payout
          </div>
          {biggestPayout ? (
            <>
              <div className="font-number text-2xl sm:text-3xl font-bold text-profit">
                {formatCurrency(biggestPayout.amount)}
              </div>
              <div className="text-xs font-mono text-terminal-muted mt-1">
                {biggestPayout.firmName ?? 'Unknown'} {' \u00b7 '} {formatDate(biggestPayout.date)}
              </div>
            </>
          ) : (
            <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-muted">---</div>
          )}
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Best Firm
          </div>
          {bestFirm ? (
            <>
              <div className="font-number text-2xl sm:text-3xl font-bold text-profit">
                {bestFirm.firmName}
              </div>
              <div className="text-xs font-mono text-profit mt-1">
                {formatCurrency(bestFirm.netPNL)} net
              </div>
            </>
          ) : (
            <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-muted">---</div>
          )}
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Worst Firm
          </div>
          {worstFirm ? (
            <>
              <div className="font-number text-2xl sm:text-3xl font-bold text-loss">
                {worstFirm.firmName}
              </div>
              <div className="text-xs font-mono text-loss mt-1">
                {formatCurrency(worstFirm.netPNL)} net
              </div>
            </>
          ) : (
            <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-muted">---</div>
          )}
        </div>
      </div>

      {/* 1. HERO: Cumulative P&L (full width — the screenshot) */}
      <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-4">
          Cumulative P&L
        </h3>
        {cumulativeChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={cumulativeChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e676" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00e676" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                {...xAxisProps}
                tickFormatter={formatAxisDate}
                interval="preserveStartEnd"
              />
              <YAxis
                {...yAxisProps}
                tickFormatter={formatAxisDollar}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Cumulative P&L']}
                labelFormatter={(label: string) => formatDate(label)}
              />
              <Area
                type="monotone"
                dataKey="cumulativePNL"
                stroke="#00e676"
                fill="url(#greenGradient)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#00e676', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[320px] text-terminal-muted text-sm font-mono">
            No data available
          </div>
        )}
      </div>

      {/* 2. Best Day / Worst Day — extremes flex + Pratfall Effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Best Day
          </div>
          {bestWorstStats.bestDay ? (
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
              <div>
                <div className="font-number text-2xl sm:text-3xl font-bold text-profit">
                  {formatCurrency(bestWorstStats.bestDay.netPNL)}
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-xs sm:text-sm font-mono text-terminal-muted">
                  {formatDate(bestWorstStats.bestDay.date)}
                </div>
                <div className="text-xs font-mono text-terminal-muted mt-0.5">
                  {formatCurrency(bestWorstStats.bestDay.deposits)} in deposits
                </div>
              </div>
            </div>
          ) : (
            <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-muted">---</div>
          )}
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Worst Day
          </div>
          {worstDay ? (
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
              <div>
                <div className="font-number text-2xl sm:text-3xl font-bold text-loss">
                  {formatCurrency(worstDay.netPNL)}
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-xs sm:text-sm font-mono text-terminal-muted">
                  {formatDate(worstDay.date)}
                </div>
                <div className="text-xs font-mono text-terminal-muted mt-0.5">
                  {formatCurrency(worstDay.fees)} in purchases
                </div>
              </div>
            </div>
          ) : (
            <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-muted">---</div>
          )}
        </div>
      </div>

      {/* 3. Win Rate / Profit Factor / Streak — credibility stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Win Rate
          </div>
          <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-text">
            {streakStats.winRate.toFixed(1)}%
          </div>
          <div className="text-xs font-mono text-terminal-muted mt-1">
            {streakStats.totalProfitableMonths}W / {streakStats.totalUnprofitableMonths}L months
          </div>
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Profit Factor
          </div>
          <div className={`font-number text-2xl sm:text-3xl font-bold ${roiStats.returnPerDollar >= 1 ? 'text-profit' : 'text-loss'}`}>
            {roiStats.returnPerDollar.toFixed(2)}x
          </div>
          <div className="text-xs font-mono text-terminal-muted mt-1">
            return per dollar spent
          </div>
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Current Streak
          </div>
          <div className={`font-number text-2xl sm:text-3xl font-bold ${
            currentStreak.type === 'win' ? 'text-profit' :
            currentStreak.type === 'loss' ? 'text-loss' :
            'text-terminal-muted'
          }`}>
            {currentStreak.value}
          </div>
          <div className="text-xs font-mono text-terminal-muted mt-1">
            {currentStreak.label} {currentStreak.value === 1 ? 'month' : 'months'}
            {' \u00b7 '} best: {streakStats.longestWinStreak}
          </div>
        </div>
      </div>

      {/* 4. Avg Payout / Avg Purchase / ROI — consistency proof */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Avg Payout Size
          </div>
          <div className="font-number text-2xl sm:text-3xl font-bold text-profit">
            {formatCurrency(activityStats.averagePayoutSize)}
          </div>
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Avg Purchase Size
          </div>
          <div className="font-number text-2xl sm:text-3xl font-bold text-loss">
            {formatCurrency(activityStats.averagePurchaseSize)}
          </div>
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Return on Investment
          </div>
          <div className={`font-number text-2xl sm:text-3xl font-bold ${roiStats.roi >= 0 ? 'text-profit' : 'text-loss'}`}>
            {roiStats.roi.toFixed(1)}%
          </div>
          <div className="text-xs font-mono text-terminal-muted mt-1">
            {formatCurrency(roiStats.returnPerDollar)} per dollar spent
          </div>
        </div>
      </div>

      {/* 5. Best Month / Worst Month */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Best Month
          </div>
          {bestWorstStats.bestMonth ? (
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
              <div>
                <div className="font-number text-2xl sm:text-3xl font-bold text-profit">
                  {formatCurrency(bestWorstStats.bestMonth.netPNL)}
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-xs sm:text-sm font-mono text-terminal-muted">
                  {formatMonth(bestWorstStats.bestMonth.month)}
                </div>
                <div className="text-xs font-mono text-terminal-muted mt-0.5">
                  {formatCurrency(bestWorstStats.bestMonth.deposits)} deposits {' \u00b7 '} {formatCurrency(bestWorstStats.bestMonth.fees)} fees
                </div>
              </div>
            </div>
          ) : (
            <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-muted">---</div>
          )}
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Worst Month
          </div>
          {bestWorstStats.worstMonth ? (
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
              <div>
                <div className="font-number text-2xl sm:text-3xl font-bold text-loss">
                  {formatCurrency(bestWorstStats.worstMonth.netPNL)}
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-xs sm:text-sm font-mono text-terminal-muted">
                  {formatMonth(bestWorstStats.worstMonth.month)}
                </div>
                <div className="text-xs font-mono text-terminal-muted mt-0.5">
                  {formatCurrency(bestWorstStats.worstMonth.deposits)} deposits {' \u00b7 '} {formatCurrency(bestWorstStats.worstMonth.fees)} fees
                </div>
              </div>
            </div>
          ) : (
            <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-muted">---</div>
          )}
        </div>
      </div>

      {/* 6. Net Daily P&L | Monthly P&L — visual charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Net Daily P&L Bar Chart */}
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-4">
            Net Daily P&L
          </h3>
          {dailyBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dailyBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="date"
                  {...xAxisProps}
                  tickFormatter={formatAxisDate}
                  interval="preserveStartEnd"
                />
                <YAxis
                  {...yAxisProps}
                  tickFormatter={formatAxisDollar}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Net P&L']}
                  labelFormatter={(label: string) => formatDate(label)}
                />
                <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={8}>
                  {dailyBarData.map((entry, index) => (
                    <Cell
                      key={`daily-${index}`}
                      fill={entry.value >= 0 ? '#00e676' : '#ff5252'}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-terminal-muted text-sm font-mono">
              No data available
            </div>
          )}
        </div>

        {/* Monthly PNL Bar Chart */}
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-4">
            Monthly P&L
          </h3>
          {monthlyBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="month"
                  {...xAxisProps}
                  tickFormatter={shortMonth}
                />
                <YAxis
                  {...yAxisProps}
                  tickFormatter={formatAxisDollar}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Net P&L']}
                  labelFormatter={(label: string) => formatMonth(label)}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={32}>
                  {monthlyBarData.map((entry, index) => (
                    <Cell
                      key={`monthly-${index}`}
                      fill={entry.value >= 0 ? '#00e676' : '#ff5252'}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-terminal-muted text-sm font-mono">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* 7. Day-of-Week Highlights (3 cols) — fun/tweetable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Most Active Day
          </div>
          <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-text">
            {dayOfWeekDerived.mostActive?.day ?? '---'}
          </div>
          {dayOfWeekDerived.mostActive && (
            <div className="text-xs font-mono text-terminal-muted mt-1">
              {dayOfWeekDerived.mostActive.payoutCount + dayOfWeekDerived.mostActive.purchaseCount} total transactions
              {' \u00b7 '}
              {dayOfWeekDerived.mostActive.payoutCount} payouts, {dayOfWeekDerived.mostActive.purchaseCount} purchases
            </div>
          )}
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Most Profitable Day
          </div>
          <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-text">
            {dayOfWeekDerived.mostProfitable?.day ?? '---'}
          </div>
          {dayOfWeekDerived.mostProfitable && (
            <div className="text-xs font-mono text-profit mt-1">
              avg {formatCurrency(dayOfWeekDerived.mostProfitable.averagePNL)}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Least Profitable Day
          </div>
          <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-text">
            {dayOfWeekDerived.leastProfitable?.day ?? '---'}
          </div>
          {dayOfWeekDerived.leastProfitable && (
            <div className="text-xs font-mono text-loss mt-1">
              avg {formatCurrency(dayOfWeekDerived.leastProfitable.averagePNL)}
            </div>
          )}
        </div>
      </div>

      {/* 8. Day-of-Week Avg P&L chart (full width) */}
      <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-4">
          Day-of-Week Avg P&L
        </h3>
        {dayOfWeekBarData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={dayOfWeekBarData}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <XAxis
                type="number"
                {...xAxisProps}
                tickFormatter={formatAxisDollar}
              />
              <YAxis
                type="category"
                dataKey="day"
                {...yAxisProps}
                width={36}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Avg P&L']}
              />
              <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={24}>
                {dayOfWeekBarData.map((entry, index) => (
                  <Cell
                    key={`dow-${index}`}
                    fill={entry.value >= 0 ? '#00e676' : '#ff5252'}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[220px] text-terminal-muted text-sm font-mono">
            No data available
          </div>
        )}
      </div>

      {/* 9. Growth Trends (3 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Avg Monthly PNL
          </div>
          <div className={`font-number text-2xl sm:text-3xl font-bold ${growthTrends.averageMonthlyPNL >= 0 ? 'text-profit' : 'text-loss'}`}>
            {formatCurrency(growthTrends.averageMonthlyPNL)}
          </div>
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Monthly Growth Rate
          </div>
          <div className={`font-number text-2xl sm:text-3xl font-bold ${avgGrowthRate >= 0 ? 'text-profit' : 'text-loss'}`}>
            {avgGrowthRate >= 0 ? '+' : ''}{avgGrowthRate.toFixed(1)}%
          </div>
          <div className="text-xs font-mono text-terminal-muted mt-1">
            velocity: {growthTrends.growthVelocity >= 0 ? '+' : ''}{growthTrends.growthVelocity.toFixed(1)}%
          </div>
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Projected Annual PNL
          </div>
          <div className={`font-number text-2xl sm:text-3xl font-bold ${growthTrends.projectedAnnualPNL >= 0 ? 'text-profit' : 'text-loss'}`}>
            {formatCurrency(growthTrends.projectedAnnualPNL)}
          </div>
        </div>
      </div>

      {/* 10. Activity Totals (3 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Total Transactions
          </div>
          <div className="font-number text-2xl sm:text-3xl font-bold text-terminal-text">
            {totalTransactions.toLocaleString()}
          </div>
          <div className="text-xs font-mono text-terminal-muted mt-1">
            {activityStats.activeMonths} active months
          </div>
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Total Payouts
          </div>
          <div className="font-number text-2xl sm:text-3xl font-bold text-profit">
            {activityStats.totalPayouts.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Total Purchases
          </div>
          <div className="font-number text-2xl sm:text-3xl font-bold text-loss">
            {activityStats.totalPurchases.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 11. Daily PNL Calendar (full width) */}
      <DailyPNLCalendar
        dailyPNL={tradingStats.dailyPNL}
        selectedMonth={calendarMonth}
        onMonthChange={setCalendarMonth}
      />
    </div>
  );
}
