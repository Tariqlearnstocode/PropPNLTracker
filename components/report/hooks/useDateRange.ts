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
  const filteredMonthlyBreakdown = useMemo(() => {
    return monthlyBreakdown.filter(monthData => {
      const [year, monthNum] = monthData.month.split('-');
      const y = parseInt(year);
      const m = parseInt(monthNum) - 1;
      const monthStart = new Date(y, m, 1);
      const monthEnd = new Date(y, m + 1, 0); // last day of month
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Overlap: month starts before range ends AND month ends after range starts
      return monthStart <= end && monthEnd >= start;
    });
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
