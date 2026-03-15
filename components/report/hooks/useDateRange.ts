'use client';

import { useState, useMemo } from 'react';
import { PNLReport, formatMonth } from '@/lib/pnl-calculations';

export function useDateRange(monthlyBreakdown: PNLReport['monthlyBreakdown']) {
  const today = new Date();

  // Default to "All Time" - find earliest month in data
  const earliestMonth = monthlyBreakdown[0]?.month;
  const defaultStart = earliestMonth
    ? `${earliestMonth.split('-')[0]}-${earliestMonth.split('-')[1]}-01`
    : new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);
  
  const setDatePreset = (preset: 'ytd' | 'all' | 'last30' | 'last90') => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    if (preset === 'ytd') {
      setStartDate(`${year}-01-01`);
      setEndDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    } else if (preset === 'all') {
      // Find earliest month
      const earliestMonth = monthlyBreakdown[0]?.month || `${year}-01-01`;
      const [eyear, emonth] = earliestMonth.split('-');
      setStartDate(`${eyear}-${emonth}-01`);
      setEndDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    } else if (preset === 'last30') {
      const start = new Date(today);
      start.setDate(start.getDate() - 30);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (preset === 'last90') {
      const start = new Date(today);
      start.setDate(start.getDate() - 90);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  };
  
  // Filter monthly breakdown by date range (include month if ANY part overlaps)
  // Also fill in missing months within the range so the current month always appears
  const filteredMonthlyBreakdown = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Build a map of existing monthly data
    const monthMap = new Map(monthlyBreakdown.map(m => [m.month, m]));

    // Generate all months in the date range
    const months: PNLReport['monthlyBreakdown'] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

    while (cursor <= endMonth) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthMap.get(key);
      if (existing) {
        months.push(existing);
      } else {
        // Insert an empty placeholder for months with no transactions
        months.push({
          month: key,
          deposits: 0,
          fees: 0,
          netPNL: 0,
          runningTotal: months.length > 0 ? months[months.length - 1].runningTotal : 0,
          transactionCount: 0,
        });
      }
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return months;
  }, [monthlyBreakdown, startDate, endDate]);
  
  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setDatePreset,
    filteredMonthlyBreakdown,
  };
}
