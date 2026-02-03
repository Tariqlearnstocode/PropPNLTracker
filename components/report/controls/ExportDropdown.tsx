'use client';

import React, { useState } from 'react';

interface ExportDropdownProps {
  onExportTransactions: () => void;
  onExportPurchases: () => void;
  onExportPayouts: () => void;
  onExportMonthlySummary: () => void;
  onExportFirmBreakdown: () => void;
  onExportPDF: () => void;
}

export function ExportDropdown({
  onExportTransactions,
  onExportPurchases,
  onExportPayouts,
  onExportMonthlySummary,
  onExportFirmBreakdown,
  onExportPDF,
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItem = (
    label: string,
    subtitle: string,
    icon: React.ReactNode,
    handler: () => void,
    isLast = false,
  ) => (
    <button
      onClick={() => {
        handler();
        setIsOpen(false);
      }}
      className={`w-full text-left px-4 py-2.5 text-terminal-text hover:bg-terminal-card-hover flex items-start gap-3 touch-manipulation transition-colors ${
        isLast ? 'rounded-b-lg' : ''
      }`}
    >
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="text-sm font-mono">{label}</div>
        <div className="text-[10px] font-mono text-terminal-muted">{subtitle}</div>
      </div>
    </button>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-terminal-card border border-terminal-border hover:bg-terminal-card-hover text-terminal-text rounded-lg transition-colors text-xs font-mono"
      >
        <span className="text-terminal-muted">⬇️</span>
        <span>Export</span>
        <span className={`text-terminal-muted transition-transform inline-block ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-64 bg-terminal-card border border-terminal-border rounded-lg shadow-xl z-50">
            <div className="px-4 py-2 border-b border-terminal-border">
              <span className="text-[10px] font-mono uppercase tracking-widest text-terminal-muted">CSV Exports</span>
            </div>
            {menuItem(
              'All Transactions',
              'Every transaction with details',
              <span className="text-terminal-muted">📥</span>,
              onExportTransactions,
            )}
            {menuItem(
              'Purchases Only',
              'Fees & expenses for accounting',
              <span className="text-loss/70">🧾</span>,
              onExportPurchases,
            )}
            {menuItem(
              'Payouts Only',
              'Deposits & income received',
              <span className="text-profit/70">💰</span>,
              onExportPayouts,
            )}
            {menuItem(
              'Monthly Summary',
              'Monthly P&L breakdown',
              <span className="text-terminal-muted">📅</span>,
              onExportMonthlySummary,
            )}
            {menuItem(
              'Firm Breakdown',
              'Per-firm P&L and ROI',
              <span className="text-terminal-muted">🏢</span>,
              onExportFirmBreakdown,
            )}
            <div className="border-t border-terminal-border">
              {menuItem(
                'Print / Save PDF',
                'Print current view',
                <span className="text-terminal-muted">📄</span>,
                onExportPDF,
                true,
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
