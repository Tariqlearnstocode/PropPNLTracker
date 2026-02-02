'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/pnl-calculations';

interface DailyPNLCalendarProps {
  dailyPNL: Array<{ date: string; deposits: number; fees: number; netPNL: number; purchaseCount: number; payoutCount: number }>;
  selectedMonth: string; // YYYY-MM
  onMonthChange: (month: string) => void;
}

export function DailyPNLCalendar({ dailyPNL, selectedMonth, onMonthChange }: DailyPNLCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedMonth);

  const monthData = useMemo(() => {
    const [year, month] = currentMonth.split('-');
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    const firstDay = new Date(yearNum, monthNum - 1, 1);
    const lastDay = new Date(yearNum, monthNum, 0); // Day 0 of next month = last day of current month
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const monthPNL = dailyPNL.filter(d => d.date.startsWith(currentMonth));
    const totalPNL = monthPNL.reduce((sum, d) => sum + d.netPNL, 0);
    const totalPurchases = monthPNL.reduce((sum, d) => sum + d.purchaseCount, 0);
    const totalPayouts = monthPNL.reduce((sum, d) => sum + d.payoutCount, 0);

    // Compute max absolute PNL for intensity scaling
    const maxAbsPNL = monthPNL.reduce((max, d) => Math.max(max, Math.abs(d.netPNL)), 0);

    const calendarDays: Array<{ day: number; date: string | null; data: typeof monthPNL[0] | null }> = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push({ day: 0, date: null, data: null });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
      const dayData = monthPNL.find(d => d.date === dateStr) || null;
      calendarDays.push({ day, date: dateStr, data: dayData });
    }

    // Group into weeks
    const weeks: Array<Array<{ day: number; date: string | null; data: typeof monthPNL[0] | null }>> = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    return { weeks, totalPNL, totalPurchases, totalPayouts, maxAbsPNL };
  }, [currentMonth, dailyPNL]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = currentMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    if (direction === 'prev') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(newMonth);
    onMonthChange(newMonth);
  };

  const goToToday = () => {
    const today = new Date();
    const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(month);
    onMonthChange(month);
  };

  // Intensity-scaled background style for profit/loss cells
  // Uses rgba with a raised floor so even small values are clearly visible
  const getDayCellStyle = (netPNL: number, maxAbsPNL: number): React.CSSProperties => {
    if (netPNL === 0) {
      return { backgroundColor: 'rgba(30, 30, 42, 0.7)' };
    }

    const ratio = maxAbsPNL > 0 ? Math.abs(netPNL) / maxAbsPNL : 0;
    const alpha = 0.08 + ratio * 0.18;

    if (netPNL > 0) {
      return { backgroundColor: `rgba(0, 230, 118, ${alpha})` };
    }
    return { backgroundColor: `rgba(255, 82, 82, ${alpha})` };
  };

  return (
    <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-terminal-card-hover rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-terminal-text/60" />
          </button>
          <h3 className="text-sm font-mono uppercase tracking-widest text-terminal-text">
            {(() => {
              const [year, month] = currentMonth.split('-');
              const date = new Date(parseInt(year), parseInt(month) - 1, 1);
              return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            })()}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-terminal-card-hover rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-terminal-text/60" />
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm font-mono text-terminal-text hover:bg-terminal-card-hover rounded-lg transition-colors"
        >
          Today
        </button>
      </div>

      <div className="mb-4 text-center">
        <div className={`text-2xl font-bold font-number mb-1 ${monthData.totalPNL >= 0 ? 'text-profit' : 'text-loss'}`}>
          Monthly P/L: {formatCurrency(monthData.totalPNL)}
        </div>
        <div className="text-xs font-mono uppercase tracking-wider text-terminal-text/50">
          {monthData.totalPayouts} payouts &bull; {monthData.totalPurchases} purchases
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {/* Day headers -- brighter text for readability */}
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Week'].map((label) => (
          <div
            key={label}
            className="text-xs font-mono uppercase tracking-wider text-terminal-text/70 text-center py-2 font-semibold"
          >
            {label}
          </div>
        ))}

        {/* Calendar days */}
        {monthData.weeks.map((week, weekIdx) => (
          <React.Fragment key={`week-${weekIdx}`}>
            {week.map((day, dayIdx) => {
              if (day.day === 0) {
                return <div key={`empty-${weekIdx}-${dayIdx}`} className="h-20" />;
              }

              const hasData = day.data !== null;
              const netPNL = day.data?.netPNL || 0;
              const purchases = day.data?.purchaseCount || 0;
              const payouts = day.data?.payoutCount || 0;

              return (
                <div
                  key={day.date || `day-${weekIdx}-${dayIdx}`}
                  className={`h-20 rounded border transition-all ${
                    hasData
                      ? 'border-white/10 hover:border-white/25 cursor-pointer'
                      : 'border-terminal-border/40'
                  }`}
                  style={
                    hasData
                      ? getDayCellStyle(netPNL, monthData.maxAbsPNL)
                      : { backgroundColor: 'rgba(17, 17, 24, 0.6)' } // subtle neutral for no-data days
                  }
                  title={day.date ? `${day.date}: ${formatCurrency(netPNL)}` : ''}
                >
                  <div className="h-full flex flex-col p-1.5">
                    <div
                      className={`text-xs font-mono font-bold ${
                        hasData ? 'text-white' : 'text-terminal-text/40'
                      }`}
                    >
                      {day.day}
                    </div>
                    {hasData && (
                      <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="text-sm font-bold font-number leading-tight text-center text-white">
                          {formatCurrency(netPNL)}
                        </div>
                        <div className="text-[10px] font-mono mt-0.5 text-white/80">
                          {purchases}P / {payouts}D
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Week total */}
            <div
              key={`week-total-${weekIdx}`}
              className="h-20 border border-terminal-border/60 rounded flex flex-col items-center justify-center p-1.5"
              style={{ backgroundColor: 'rgba(17, 17, 24, 0.8)' }}
            >
              <div className="text-[11px] font-mono font-bold text-terminal-text/50 mb-1">W{weekIdx + 1}</div>
              {(() => {
                const weekPNL = week
                  .filter(d => d.data)
                  .reduce((sum, d) => sum + (d.data?.netPNL || 0), 0);
                const weekPurchases = week
                  .filter(d => d.data)
                  .reduce((sum, d) => sum + (d.data?.purchaseCount || 0), 0);
                const weekPayouts = week
                  .filter(d => d.data)
                  .reduce((sum, d) => sum + (d.data?.payoutCount || 0), 0);
                return (
                  <>
                    <div className={`text-xs font-bold font-number ${weekPNL >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {formatCurrency(weekPNL)}
                    </div>
                    <div className="text-[10px] font-mono text-terminal-text/40 mt-0.5">
                      {weekPayouts}D / {weekPurchases}P
                    </div>
                  </>
                );
              })()}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
