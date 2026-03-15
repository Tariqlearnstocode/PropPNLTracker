import { useMemo, useCallback } from 'react';
import { formatMonth } from '@/lib/pnl-calculations';
import { exportToCSV, exportToPDF } from '@/lib/report-utils';
import type { MonthlyPNL, FirmPNL } from '@/lib/pnl-calculations';

interface TransactionForExport {
  id: string;
  date: string;
  amount: number;
  name: string;
  match: {
    type: string;
    firmName?: string | null;
  };
}

interface UseExportHandlersArgs {
  filteredTransactions: TransactionForExport[];
  selectedFirms: string[];
  filteredMonthlyBreakdown: MonthlyPNL[];
  filteredFirmBreakdown: FirmPNL[];
  dateFilteredFirmBreakdown: FirmPNL[];
}

export function useExportHandlers({
  filteredTransactions,
  selectedFirms,
  filteredMonthlyBreakdown,
  filteredFirmBreakdown,
  dateFilteredFirmBreakdown,
}: UseExportHandlersArgs) {
  const dateStamp = new Date().toISOString().split('T')[0];

  const exportTransactions = useMemo(() => {
    let txns = filteredTransactions.filter(t => t.match.type === 'deposit' || t.match.type === 'fee');
    if (selectedFirms.length > 0) {
      txns = txns.filter(t => t.match.firmName && selectedFirms.includes(t.match.firmName));
    }
    return txns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredTransactions, selectedFirms]);

  const formatTxnRow = useCallback((t: typeof exportTransactions[0]) => ({
    Date: t.date.split('T')[0],
    Type: t.match.type === 'deposit' ? 'Payout' : 'Purchase',
    Amount: t.match.type === 'deposit' ? t.amount : -t.amount,
    Firm: t.match.firmName ?? 'Unassigned',
    Description: t.name,
  }), []);

  const handleExportTransactions = useCallback(() => {
    exportToCSV(exportTransactions.map(formatTxnRow), `transactions-${dateStamp}.csv`);
  }, [exportTransactions, formatTxnRow, dateStamp]);

  const handleExportPurchases = useCallback(() => {
    const purchases = exportTransactions.filter(t => t.match.type === 'fee');
    exportToCSV(
      purchases.map(t => ({
        Date: t.date.split('T')[0],
        Amount: t.amount,
        Firm: t.match.firmName ?? 'Unassigned',
        Description: t.name,
      })),
      `purchases-${dateStamp}.csv`,
    );
  }, [exportTransactions, dateStamp]);

  const handleExportPayouts = useCallback(() => {
    const payouts = exportTransactions.filter(t => t.match.type === 'deposit');
    exportToCSV(
      payouts.map(t => ({
        Date: t.date.split('T')[0],
        Amount: t.amount,
        Firm: t.match.firmName ?? 'Unassigned',
        Description: t.name,
      })),
      `payouts-${dateStamp}.csv`,
    );
  }, [exportTransactions, dateStamp]);

  const handleExportMonthlySummary = useCallback(() => {
    const csvData = filteredMonthlyBreakdown.map(month => ({
      Month: formatMonth(month.month),
      Deposits: month.deposits,
      Fees: month.fees,
      'Net PNL': month.netPNL,
      'Running Total': month.runningTotal,
      Transactions: month.transactionCount,
    }));
    exportToCSV(csvData, `monthly-summary-${dateStamp}.csv`);
  }, [filteredMonthlyBreakdown, dateStamp]);

  const handleExportFirmBreakdown = useCallback(() => {
    const firms = selectedFirms.length > 0
      ? filteredFirmBreakdown
      : dateFilteredFirmBreakdown;
    const csvData = [...firms]
      .sort((a, b) => b.netPNL - a.netPNL)
      .map(f => ({
        Firm: f.firmName,
        Deposits: f.deposits,
        Fees: f.fees,
        'Net PNL': f.netPNL,
        'ROI %': f.fees > 0 ? ((f.netPNL / f.fees) * 100).toFixed(1) : '0',
        Transactions: f.transactionCount,
      }));
    exportToCSV(csvData, `firm-breakdown-${dateStamp}.csv`);
  }, [selectedFirms, filteredFirmBreakdown, dateFilteredFirmBreakdown, dateStamp]);

  const handleExportPDF = useCallback(() => {
    exportToPDF();
  }, []);

  return {
    handleExportTransactions,
    handleExportPurchases,
    handleExportPayouts,
    handleExportMonthlySummary,
    handleExportFirmBreakdown,
    handleExportPDF,
  };
}
