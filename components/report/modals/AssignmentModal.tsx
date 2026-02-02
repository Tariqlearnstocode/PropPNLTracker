'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { PNLReport, formatCurrency, formatDate } from '@/lib/pnl-calculations';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PNLReport['transactions'][0] | null;
  perFirmBreakdown: PNLReport['perFirmBreakdown'];
  manualAssignments: Record<string, string>;
  onSave: (transactionId: string, firmName: string) => void;
  onRemove: (transactionId: string) => void;
}

export function AssignmentModal({
  isOpen,
  onClose,
  transaction,
  perFirmBreakdown,
  manualAssignments,
  onSave,
  onRemove,
}: AssignmentModalProps) {
  const [customFirmName, setCustomFirmName] = useState('');

  if (!isOpen || !transaction) return null;

  const currentFirm = manualAssignments[transaction.id] || transaction.match.firmName || '';
  const isExistingFirm = currentFirm && perFirmBreakdown.some(f => f.firmName === currentFirm);
  const displayFirmName = customFirmName || currentFirm;

  const handleSave = () => {
    if (displayFirmName.trim()) {
      onSave(transaction.id, displayFirmName.trim());
      setCustomFirmName('');
      onClose();
    }
  };

  const handleRemove = () => {
    onRemove(transaction.id);
    setCustomFirmName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-terminal-card border border-terminal-border rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-terminal-text">Assign to Prop Firm</h3>
          <button
            onClick={() => {
              setCustomFirmName('');
              onClose();
            }}
            className="text-terminal-muted hover:text-terminal-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-terminal-bg border border-terminal-border">
          <div className="text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-1">Transaction</div>
          <div className="text-sm font-medium text-terminal-text">{transaction.name}</div>
          <div className="text-xs font-mono text-terminal-muted mt-1">
            {formatDate(transaction.date)} • {formatCurrency(transaction.amount)}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Select Existing Firm
          </label>
          <select
            value={isExistingFirm ? displayFirmName : ''}
            onChange={(e) => {
              if (e.target.value) {
                setCustomFirmName(e.target.value);
              }
            }}
            className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border text-terminal-text rounded-lg focus:ring-2 focus:ring-profit/50 focus:border-profit/50"
          >
            <option value="">Choose a firm...</option>
            {perFirmBreakdown.map(firm => (
              <option key={firm.firmName} value={firm.firmName}>
                {firm.firmName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-terminal-muted mb-2">
            Or Enter Custom Firm Name
          </label>
          <input
            type="text"
            value={!isExistingFirm ? displayFirmName : ''}
            onChange={(e) => setCustomFirmName(e.target.value)}
            placeholder="Enter firm name..."
            className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border text-terminal-text rounded-lg focus:ring-2 focus:ring-profit/50 focus:border-profit/50 placeholder:text-terminal-muted"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!displayFirmName.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-profit text-terminal-bg font-medium rounded-lg transition-colors disabled:bg-terminal-card disabled:border disabled:border-terminal-border disabled:text-terminal-muted disabled:cursor-not-allowed hover:bg-profit/90 touch-manipulation"
          >
            <Save className="w-4 h-4" />
            Save Assignment
          </button>
          {manualAssignments[transaction.id] && (
            <button
              onClick={handleRemove}
              className="px-4 py-2 bg-loss-dim text-loss border border-loss/30 rounded-lg transition-colors hover:bg-loss/30 touch-manipulation"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
