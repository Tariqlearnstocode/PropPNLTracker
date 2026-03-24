'use client';

import React from 'react';
import { formatMonth } from '@/lib/pnl-calculations';

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: 'all' | 'matched' | 'unmatched' | 'deposits' | 'fees';
  onFilterChange: (filter: 'all' | 'matched' | 'unmatched' | 'deposits' | 'fees') => void;
  monthlyData: {
    sortedMonths: string[];
  };
  selectedMonthIndex: number;
  onMonthChange: (index: number) => void;
}

export function TransactionFilters({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  monthlyData,
  selectedMonthIndex,
  onMonthChange,
}: TransactionFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-muted text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-terminal-border rounded-lg bg-terminal-bg text-terminal-text placeholder:text-terminal-muted focus:ring-2 focus:ring-profit/50 focus:border-profit/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'matched', 'unmatched', 'deposits', 'fees'] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === f
                  ? 'bg-profit text-white'
                  : 'bg-terminal-card-hover text-terminal-text hover:bg-black/5'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {monthlyData.sortedMonths.map((month, idx) => (
          <button
            key={month}
            onClick={() => onMonthChange(idx)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              idx === selectedMonthIndex
                ? 'bg-profit text-white'
                : 'bg-terminal-card-hover text-terminal-text hover:bg-black/5'
            }`}
          >
            {formatMonth(month)}
          </button>
        ))}
      </div>
    </div>
  );
}
