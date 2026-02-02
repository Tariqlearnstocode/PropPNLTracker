'use client';

import React, { useState } from 'react';
import { Download, ChevronDown, FileDown, FileText, Receipt, DollarSign, Building2, CalendarDays } from 'lucide-react';

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
        <Download className="w-3.5 h-3.5 text-terminal-muted" />
        <span>Export</span>
        <ChevronDown className={`w-3.5 h-3.5 text-terminal-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
              <FileDown className="w-4 h-4 text-terminal-muted" />,
              onExportTransactions,
            )}
            {menuItem(
              'Purchases Only',
              'Fees & expenses for accounting',
              <Receipt className="w-4 h-4 text-loss/70" />,
              onExportPurchases,
            )}
            {menuItem(
              'Payouts Only',
              'Deposits & income received',
              <DollarSign className="w-4 h-4 text-profit/70" />,
              onExportPayouts,
            )}
            {menuItem(
              'Monthly Summary',
              'Monthly P&L breakdown',
              <CalendarDays className="w-4 h-4 text-terminal-muted" />,
              onExportMonthlySummary,
            )}
            {menuItem(
              'Firm Breakdown',
              'Per-firm P&L and ROI',
              <Building2 className="w-4 h-4 text-terminal-muted" />,
              onExportFirmBreakdown,
            )}
            <div className="border-t border-terminal-border">
              {menuItem(
                'Print / Save PDF',
                'Print current view',
                <FileText className="w-4 h-4 text-terminal-muted" />,
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
