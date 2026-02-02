'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface BulkAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  allFirmNames: string[];
  onAssign: (firmName: string) => Promise<boolean>;
}

export function BulkAssignModal({
  isOpen,
  onClose,
  selectedCount,
  allFirmNames,
  onAssign,
}: BulkAssignModalProps) {
  const [bulkAssignFirmName, setBulkAssignFirmName] = useState('');

  if (!isOpen) return null;

  const handleAssign = async () => {
    if (bulkAssignFirmName.trim()) {
      const success = await onAssign(bulkAssignFirmName.trim());
      if (success) {
        setBulkAssignFirmName('');
        onClose();
      }
    }
  };

  const handleClose = () => {
    setBulkAssignFirmName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-terminal-card border border-terminal-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-terminal-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-terminal-text">
              Assign {selectedCount} Transaction{selectedCount > 1 ? 's' : ''}
            </h2>
            <button
              onClick={handleClose}
              className="text-terminal-muted hover:text-terminal-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
              Firm Name
            </label>
            <input
              type="text"
              value={bulkAssignFirmName}
              onChange={(e) => setBulkAssignFirmName(e.target.value)}
              placeholder="Enter firm name..."
              className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border text-terminal-text rounded-lg focus:ring-2 focus:ring-profit/50 focus:border-profit/50 placeholder:text-terminal-muted"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && bulkAssignFirmName.trim()) {
                  handleAssign();
                }
              }}
            />
            <p className="mt-2 text-xs font-mono text-terminal-muted">
              Select from existing firms or enter a new firm name
            </p>
          </div>

          {allFirmNames.length > 0 && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
                Or select existing firm:
              </label>
              <select
                value={bulkAssignFirmName}
                onChange={(e) => setBulkAssignFirmName(e.target.value)}
                className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border text-terminal-text rounded-lg focus:ring-2 focus:ring-profit/50 focus:border-profit/50"
              >
                <option value="">Select a firm...</option>
                {allFirmNames.map(firm => (
                  <option key={firm} value={firm}>{firm}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-terminal-border bg-terminal-bg flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-terminal-card border border-terminal-border text-terminal-muted hover:text-terminal-text rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!bulkAssignFirmName.trim()}
            className="px-4 py-2 bg-profit text-terminal-bg rounded-lg transition-colors disabled:bg-terminal-card disabled:border disabled:border-terminal-border disabled:text-terminal-muted disabled:cursor-not-allowed font-medium flex items-center gap-2 hover:bg-profit/90"
          >
            <Save className="w-4 h-4" />
            Assign All
          </button>
        </div>
      </div>
    </div>
  );
}
