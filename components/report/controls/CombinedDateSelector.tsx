'use client';

import React, { useState, useRef, useEffect } from 'react';
import { formatDate } from '@/lib/pnl-calculations';

interface CombinedDateSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onDatePreset: (preset: 'ytd' | 'all' | 'last30' | 'last90') => void;
}

export function CombinedDateSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onDatePreset,
}: CombinedDateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<'ytd' | 'all' | 'last30' | 'last90' | 'custom'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePresetClick = (preset: 'ytd' | 'all' | 'last30' | 'last90') => {
    setSelectedPreset(preset);
    onDatePreset(preset);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedPreset === 'ytd') return 'YTD';
    if (selectedPreset === 'last30') return 'Last 30 days';
    if (selectedPreset === 'last90') return 'Last 90 days';
    if (selectedPreset === 'all') return 'All time';
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-terminal-card border border-terminal-border rounded-lg px-2.5 py-1.5 text-sm hover:bg-terminal-card-hover transition-colors"
      >
        <span className="text-terminal-muted">📅</span>
        <span className="text-terminal-text font-mono text-xs">{getDisplayText()}</span>
        <span className={`text-terminal-muted transition-transform inline-block ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-terminal-card border border-terminal-border rounded-lg shadow-xl z-50 min-w-[280px]">
          <div className="p-2">
            {/* Quick Presets */}
            <div className="mb-3">
              <div className="text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest px-2 py-1 mb-1">Quick Presets</div>
              <div className="space-y-0.5">
                {([
                  { key: 'all', label: 'All time' },
                  { key: 'ytd', label: 'Year to Date' },
                  { key: 'last30', label: 'Last 30 days' },
                  { key: 'last90', label: 'Last 90 days' },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handlePresetClick(key)}
                    className={`w-full text-left px-3 py-2 text-sm font-mono rounded-md transition-colors ${
                      selectedPreset === key
                        ? 'bg-profit-dim text-profit'
                        : 'text-terminal-text hover:bg-terminal-card-hover'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="border-t border-terminal-border pt-3">
              <div className="text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest px-2 py-1 mb-2">Custom Range</div>
              <div className="space-y-2 px-2">
                <div>
                  <label className="block text-[11px] font-mono text-terminal-muted mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      onStartDateChange(e.target.value);
                      setSelectedPreset('custom');
                    }}
                    className="w-full px-3 py-2 text-sm font-mono bg-terminal-bg border border-terminal-border text-terminal-text rounded-md focus:outline-none focus:ring-2 focus:ring-profit/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-terminal-muted mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      onEndDateChange(e.target.value);
                      setSelectedPreset('custom');
                    }}
                    className="w-full px-3 py-2 text-sm font-mono bg-terminal-bg border border-terminal-border text-terminal-text rounded-md focus:outline-none focus:ring-2 focus:ring-profit/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
