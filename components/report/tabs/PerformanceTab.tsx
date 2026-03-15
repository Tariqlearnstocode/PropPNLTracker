'use client';

import React, { useState } from 'react';
import { DailyPNLCalendar } from '../ui/DailyPNLCalendar';
import { BestWorstModule } from '../modules/BestWorstModule';
import { StreakModule } from '../modules/StreakModule';
import { DayOfWeekPatternsModule } from '../modules/DayOfWeekPatternsModule';
import type { TradingStats } from '@/lib/pnl-calculations';

interface PerformanceTabProps {
  tradingStats: TradingStats;
}

export function PerformanceTab({ tradingStats }: PerformanceTabProps) {
  const [calendarMonth, setCalendarMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  
  return (
    <div className="space-y-6">
      <DailyPNLCalendar 
        dailyPNL={tradingStats.dailyPNL} 
        selectedMonth={calendarMonth}
        onMonthChange={setCalendarMonth}
      />
      
      <BestWorstModule stats={tradingStats.bestWorstStats} />
      
      <StreakModule stats={tradingStats.streakStats} />
      
      <DayOfWeekPatternsModule stats={tradingStats.dayOfWeekStats} />
    </div>
  );
}
