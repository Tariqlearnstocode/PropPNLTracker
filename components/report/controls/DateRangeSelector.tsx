'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DateRangeSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 md:gap-2 bg-white border border-gray-300 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm">
      <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="border-none text-xs md:text-sm focus:outline-none w-24 md:w-auto"
      />
      <span className="text-gray-400 hidden sm:inline">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="border-none text-xs md:text-sm focus:outline-none w-24 md:w-auto"
      />
    </div>
  );
}
