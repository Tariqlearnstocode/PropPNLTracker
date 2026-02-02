'use client';

import React from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  onClear: () => void;
  onAssign: () => void;
}

export function BulkActionsBar({ selectedCount, onClear, onAssign }: BulkActionsBarProps) {
  if (selectedCount === 0) return null;
  
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-purple-900">
          {selectedCount} transaction{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onAssign}
          className="px-4 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
        >
          Assign Selected
        </button>
      </div>
    </div>
  );
}
