'use client';

import React from 'react';
import { PNLReport, formatCurrency, formatDate } from '@/lib/pnl-calculations';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';

interface TransactionsTabProps {
  transactionsWithAssignments: PNLReport['transactions'];
  manualAssignments: Record<string, string>;
  needsAssignmentTransactions: PNLReport['transactions'];
  selectedTransactionIds: Set<string>;
  onToggleTransaction: (id: string) => void;
  onSelectAllTransactions: (ids: string[]) => void;
  onDeselectAllTransactions: () => void;
  onOpenAssignmentModal: (transactionId: string) => void;
  onOpenBulkAssignModal: () => void;
  onDismissTransaction: (transactionId: string) => void;
  onBulkDismiss: (ids: Set<string>) => void;
  selectedFirms: string[];
  transactionView: 'payouts' | 'purchases' | 'needs-assignment' | 'find-missing';
  onTransactionViewChange: (view: 'payouts' | 'purchases' | 'needs-assignment' | 'find-missing') => void;
}

export function TransactionsTab({
  transactionsWithAssignments,
  manualAssignments,
  needsAssignmentTransactions,
  selectedTransactionIds,
  onToggleTransaction,
  onSelectAllTransactions,
  onDeselectAllTransactions,
  onOpenAssignmentModal,
  onOpenBulkAssignModal,
  onDismissTransaction,
  onBulkDismiss,
  selectedFirms,
  transactionView,
  onTransactionViewChange,
}: TransactionsTabProps) {
  // transactionsWithAssignments is already date-filtered by ReportContent
  const filteredTransactions = transactionsWithAssignments
    .filter(txn => {
      if (txn.pending) return false;
      const matchesView = transactionView === 'payouts'
        ? txn.match.type === 'deposit'
        : transactionView === 'purchases'
        ? txn.match.type === 'fee'
        : transactionView === 'needs-assignment'
        ? needsAssignmentTransactions.some(t => t.id === txn.id)
        : false;
      const matchesFirm = selectedFirms.length === 0 ||
        (txn.match.firmName && selectedFirms.includes(txn.match.firmName));
      return matchesView && matchesFirm;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex bg-terminal-bg rounded-lg p-1 gap-1 border border-terminal-border overflow-x-auto dark-scroll">
          <button
            onClick={() => onTransactionViewChange('payouts')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium font-mono rounded-md transition-colors whitespace-nowrap ${
              transactionView === 'payouts'
                ? 'bg-profit/20 text-profit border border-profit/30'
                : 'text-terminal-muted hover:bg-terminal-card-hover'
            }`}
          >
            Payouts
          </button>
          <button
            onClick={() => onTransactionViewChange('purchases')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium font-mono rounded-md transition-colors whitespace-nowrap ${
              transactionView === 'purchases'
                ? 'bg-loss-dim text-loss border border-loss/30'
                : 'text-terminal-muted hover:bg-terminal-card-hover'
            }`}
          >
            Purchases
          </button>
          <button
            onClick={() => onTransactionViewChange('needs-assignment')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium font-mono rounded-md transition-colors relative whitespace-nowrap ${
              transactionView === 'needs-assignment'
                ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30'
                : 'text-terminal-muted hover:bg-terminal-card-hover'
            }`}
          >
            Needs Assignment
            {needsAssignmentTransactions.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono font-medium bg-accent-amber/30 text-accent-amber rounded-full">
                {needsAssignmentTransactions.length}
              </span>
            )}
          </button>
        </div>
        <div className="text-xs sm:text-sm font-mono text-terminal-muted">
          {filteredTransactions.length} {transactionView === 'payouts' ? 'payouts' : transactionView === 'purchases' ? 'purchases' : 'transactions'}
        </div>
      </div>

      {/* Transactions Table */}
      {transactionView === 'needs-assignment' ? (
        <div className="space-y-6">
          {selectedTransactionIds.size > 0 && (
            <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-medium font-mono text-accent-blue">
                  {selectedTransactionIds.size} transaction{selectedTransactionIds.size > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onDeselectAllTransactions}
                  className="px-3 py-1.5 text-xs sm:text-sm text-terminal-muted hover:text-terminal-text hover:bg-terminal-card-hover rounded-lg transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => onBulkDismiss(selectedTransactionIds)}
                  className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-terminal-muted hover:text-terminal-text border border-terminal-border hover:bg-terminal-card-hover rounded-lg transition-colors font-medium"
                >
                  Dismiss
                </button>
                <button
                  onClick={onOpenBulkAssignModal}
                  className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-profit text-terminal-bg rounded-lg transition-colors font-medium hover:bg-profit/90"
                >
                  Assign
                </button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-terminal-border bg-terminal-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-terminal-bg border-b border-terminal-border">
                  <tr>
                    <th className="px-4 py-3 text-center w-12">
                      <input
                        type="checkbox"
                        checked={needsAssignmentTransactions.length > 0 && selectedTransactionIds.size === needsAssignmentTransactions.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onSelectAllTransactions(needsAssignmentTransactions.map(t => t.id));
                          } else {
                            onDeselectAllTransactions();
                          }
                        }}
                        className="w-4 h-4 rounded border-terminal-border bg-terminal-bg cursor-pointer accent-profit"
                        title="Select all"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Date</th>
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Description</th>
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Type</th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Amount</th>
                    <th className="px-4 py-3 text-center text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {needsAssignmentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-terminal-muted font-mono">
                        No transactions need assignment.
                      </td>
                    </tr>
                  ) : (
                    needsAssignmentTransactions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((txn) => {
                        const assignedFirm = manualAssignments[txn.id] || txn.match.firmName;
                        const isSelected = selectedTransactionIds.has(txn.id);
                        return (
                          <tr
                            key={txn.id}
                            className={`border-b border-terminal-border/50 hover:bg-terminal-card-hover transition-colors cursor-pointer ${isSelected ? 'bg-accent-blue/10' : ''}`}
                            onClick={() => onToggleTransaction(txn.id)}
                          >
                            <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onToggleTransaction(txn.id)}
                                className="w-4 h-4 rounded border-terminal-border bg-terminal-bg cursor-pointer accent-profit"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-terminal-text">{formatDate(txn.date)}</td>
                            <td className="px-4 py-3 text-sm text-terminal-text max-w-md truncate" title={txn.name}>
                              {txn.name}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                                txn.match.type === 'deposit'
                                  ? 'bg-profit-dim text-profit'
                                  : 'bg-loss-dim text-loss'
                              }`}>
                                {txn.match.type === 'deposit' ? 'Deposit' : 'Fee'}
                              </span>
                            </td>
                            <td className={`px-4 py-3 text-sm text-right font-semibold font-number ${
                              txn.isIncome ? 'text-profit' : 'text-loss'
                            }`}>
                              {formatCurrency(txn.amount)}
                            </td>
                            <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => onOpenAssignmentModal(txn.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium font-mono text-accent-blue hover:text-accent-blue/80 hover:bg-accent-blue/10 rounded transition-colors touch-manipulation"
                                >
                                  <span>✏️</span>
                                  {assignedFirm ? 'Edit' : 'Assign'}
                                </button>
                                <button
                                  onClick={() => onDismissTransaction(txn.id)}
                                  className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium font-mono text-terminal-muted hover:text-loss hover:bg-loss-dim rounded transition-colors touch-manipulation"
                                  title="Not a prop firm transaction"
                                >
                                  <span>✕</span>
                                  Dismiss
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-terminal-border bg-terminal-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-terminal-bg border-b border-terminal-border">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Date</th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Description</th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Firm</th>
                  <th className="px-4 py-3 text-right text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Amount</th>
                  <th className="px-4 py-3 text-center text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Confidence</th>
                  <th className="px-4 py-3 text-center text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-terminal-muted font-mono">
                      No {transactionView === 'payouts' ? 'payouts' : 'purchases'} found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((txn) => {
                    const assignedFirm = manualAssignments[txn.id] || txn.match.firmName;
                    return (
                      <tr key={txn.id} className="border-b border-terminal-border/50 hover:bg-terminal-card-hover transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-terminal-text">{formatDate(txn.date)}</td>
                        <td className="px-4 py-3 text-sm text-terminal-text max-w-md truncate" title={txn.name}>
                          {txn.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {assignedFirm ? (
                            <span className="inline-flex items-center px-2 py-0.5 bg-terminal-bg border border-terminal-border text-terminal-text rounded text-[10px] font-mono font-medium">
                              {assignedFirm}
                            </span>
                          ) : (
                            <span className="text-terminal-muted text-xs font-mono">Unassigned</span>
                          )}
                        </td>
                        <td className={`px-4 py-3 text-sm text-right font-semibold font-number ${
                          transactionView === 'payouts' ? 'text-profit' : 'text-loss'
                        }`}>
                          {formatCurrency(txn.amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <ConfidenceBadge confidence={txn.match.confidence} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => onOpenAssignmentModal(txn.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium font-mono text-accent-blue hover:text-accent-blue/80 hover:bg-accent-blue/10 rounded transition-colors touch-manipulation"
                          >
                            <span>✏️</span>
                            {assignedFirm ? 'Edit' : 'Assign'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
