'use client';

import React from 'react';

interface QuickDatePresetsProps {
  onPresetSelect: (preset: 'ytd' | 'all' | 'last30' | 'last90') => void;
}

export function QuickDatePresets({ onPresetSelect }: QuickDatePresetsProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 gap-1 text-xs">
      <button
        onClick={() => onPresetSelect('ytd')}
        className="px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700 touch-manipulation"
        title="Year to Date"
      >
        YTD
      </button>
      <button
        onClick={() => onPresetSelect('last30')}
        className="px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700 touch-manipulation"
        title="Last 30 Days"
      >
        30D
      </button>
      <button
        onClick={() => onPresetSelect('last90')}
        className="px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700 touch-manipulation"
        title="Last 90 Days"
      >
        90D
      </button>
      <button
        onClick={() => onPresetSelect('all')}
        className="px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700 touch-manipulation"
        title="All Time"
      >
        All
      </button>
    </div>
  );
}
