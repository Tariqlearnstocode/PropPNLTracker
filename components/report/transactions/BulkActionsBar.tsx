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
    <div className="bg-terminal-card border border-terminal-border rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-terminal-text">
          {selectedCount} transaction{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-sm text-terminal-text hover:bg-terminal-card-hover rounded-lg transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onAssign}
          className="px-4 py-1.5 text-sm bg-profit hover:bg-profit/90 text-white rounded-lg transition-colors font-medium"
        >
          Assign Selected
        </button>
      </div>
    </div>
  );
}
