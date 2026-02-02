'use client';

import React, { useState, useMemo } from 'react';
import { PNLReport, formatDate, formatMonth, calculateTradingStats, calculatePerFirmBreakdown } from '@/lib/pnl-calculations';
import { safeNumber, exportToCSV, exportToPDF } from '@/lib/report-utils';

// UI Components
import { TabbedSection } from '@/components/report/ui/TabbedSection';

// Tab Components (4 tabs)
import { OverviewTab } from '@/components/report/tabs/OverviewTab';
import { FirmsTab } from '@/components/report/tabs/FirmsTab';
import { TransactionsTab } from '@/components/report/tabs/TransactionsTab';
import { AnalyticsTab } from '@/components/report/tabs/AnalyticsTab';

// Control Components
import { ReportHeader } from '@/components/report/controls/ReportHeader';

// Modal Components
import { AssignmentModal } from '@/components/report/modals/AssignmentModal';
import { BulkAssignModal } from '@/components/report/modals/BulkAssignModal';

// Hooks
import { useManualAssignments } from '@/components/report/hooks/useManualAssignments';
import { useDateRange } from '@/components/report/hooks/useDateRange';
import { useFirmFilter } from '@/components/report/hooks/useFirmFilter';

// Public view conversion components
import { ConversionPopup } from '@/components/report/public/ConversionPopup';
import { PublicInlineCTA } from '@/components/report/public/PublicInlineCTA';
import { SharedReportBanner } from '@/components/report/public/SharedReportBanner';
import { TransactionsTeaser } from '@/components/report/public/TransactionsTeaser';
import { AuthModal } from '@/components/AuthModal';

interface Props {
  report: {
    id: string;
    user_id: string;
    report_token: string;
    account_id: string;
    created_at: string;
    updated_at: string;
    display_name?: string | null;
  };
  pnlData: PNLReport;
  canRefreshDaily?: boolean;
  lastRefreshAttempt?: string | null;
  isPublicView?: boolean;
}


export default function ReportContent({ report, pnlData, canRefreshDaily = false, lastRefreshAttempt = null, isPublicView = false }: Props) {
  const { summary, monthlyBreakdown, perFirmBreakdown, transactions, accounts } = pnlData;
  const [activeTab, setActiveTab] = useState<'overview' | 'firms' | 'transactions' | 'analytics'>('overview');
  const [transactionView, setTransactionView] = useState<'payouts' | 'purchases' | 'needs-assignment' | 'find-missing'>('payouts');
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<Set<string>>(new Set());
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedTransactionForAssignment, setSelectedTransactionForAssignment] = useState<string | null>(null);
  const [bulkAssignModalOpen, setBulkAssignModalOpen] = useState(false);
  const [ctaDismissed, setCtaDismissed] = useState(false);
  const [displayName, setDisplayName] = useState(report.display_name || '');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleGetStarted = () => setAuthModalOpen(true);

  // Use custom hooks
  const dateRange = useDateRange(monthlyBreakdown);
  const {
    manualAssignments,
    transactionsWithAssignments,
    needsAssignmentTransactions,
    saveManualAssignment,
    removeManualAssignment,
    bulkAssign,
    dismissTransaction,
    bulkDismiss,
  } = useManualAssignments(report.id, transactions);

  // Filter transactions by date range FIRST (so firm breakdown respects date filter)
  const filteredTransactions = useMemo(() => {
    return transactionsWithAssignments.filter(txn => {
      if (txn.pending) return false;
      const txnDate = new Date(txn.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);
      return txnDate >= start && txnDate <= end;
    });
  }, [transactionsWithAssignments, dateRange.startDate, dateRange.endDate]);

  // Recompute per-firm breakdown from date-filtered transactions
  const dateFilteredFirmBreakdown = useMemo(() => {
    return calculatePerFirmBreakdown(filteredTransactions);
  }, [filteredTransactions]);

  const firmFilter = useFirmFilter(
    dateFilteredFirmBreakdown,
    dateRange.filteredMonthlyBreakdown,
    manualAssignments
  );

  // Build a filtered PNLReport for tradingStats so analytics respect filters
  const filteredPnlData = useMemo((): PNLReport => {
    const firmNames = firmFilter.selectedFirms;
    let txns = filteredTransactions;
    if (firmNames.length > 0) {
      txns = txns.filter(t => t.match.firmName && firmNames.includes(t.match.firmName));
    }
    return {
      ...pnlData,
      transactions: txns,
      monthlyBreakdown: dateRange.filteredMonthlyBreakdown,
      perFirmBreakdown: firmFilter.filteredFirmBreakdown,
      summary: {
        ...pnlData.summary,
        totalDeposits: firmFilter.filteredDeposits,
        totalFees: firmFilter.filteredFees,
        netPNL: firmFilter.filteredPNL,
      },
    };
  }, [pnlData, filteredTransactions, dateRange.filteredMonthlyBreakdown, firmFilter]);

  // Calculate trading stats from FILTERED data
  const tradingStats = useMemo(() => calculateTradingStats(filteredPnlData), [filteredPnlData]);

  // Calculate display values
  const displayPNL = firmFilter.filteredPNL;
  const displayDeposits = firmFilter.filteredDeposits;
  const displayFees = firmFilter.filteredFees;

  // Export handlers
  const dateStamp = new Date().toISOString().split('T')[0];

  // Get the currently filtered transactions (respects date + firm filters)
  const exportTransactions = useMemo(() => {
    const firmNames = firmFilter.selectedFirms;
    let txns = filteredTransactions.filter(t => t.match.type === 'deposit' || t.match.type === 'fee');
    if (firmNames.length > 0) {
      txns = txns.filter(t => t.match.firmName && firmNames.includes(t.match.firmName));
    }
    return txns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredTransactions, firmFilter.selectedFirms]);

  const formatTxnRow = (t: typeof exportTransactions[0]) => ({
    Date: t.date.split('T')[0],
    Type: t.match.type === 'deposit' ? 'Payout' : 'Purchase',
    Amount: t.match.type === 'deposit' ? t.amount : -t.amount,
    Firm: t.match.firmName ?? 'Unassigned',
    Description: t.name,
  });

  const handleExportTransactions = () => {
    exportToCSV(exportTransactions.map(formatTxnRow), `transactions-${dateStamp}.csv`);
  };

  const handleExportPurchases = () => {
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
  };

  const handleExportPayouts = () => {
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
  };

  const handleExportMonthlySummary = () => {
    const csvData = dateRange.filteredMonthlyBreakdown.map(month => ({
      Month: formatMonth(month.month),
      Deposits: month.deposits,
      Fees: month.fees,
      'Net PNL': month.netPNL,
      'Running Total': month.runningTotal,
      Transactions: month.transactionCount,
    }));
    exportToCSV(csvData, `monthly-summary-${dateStamp}.csv`);
  };

  const handleExportFirmBreakdown = () => {
    const firms = firmFilter.selectedFirms.length > 0
      ? firmFilter.filteredFirmBreakdown
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
  };

  const handleExportPDF = () => {
    exportToPDF();
  };

  // Display name handler
  const handleSaveDisplayName = async (name: string) => {
    setDisplayName(name);
    try {
      await fetch('/api/pnl/display-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: report.id, displayName: name }),
      });
    } catch (e) {
      console.error('Failed to save display name', e);
    }
  };

  // Refresh handler
  const handleRefreshData = async () => {
    try {
      const response = await fetch('/api/pnl/refresh-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: report.account_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to refresh data');
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  };

  // Modal handlers
  const handleOpenAssignmentModal = (transactionId: string) => {
    setSelectedTransactionForAssignment(transactionId);
    setAssignmentModalOpen(true);
  };

  const handleCloseAssignmentModal = () => {
    setAssignmentModalOpen(false);
    setSelectedTransactionForAssignment(null);
  };

  const handleBulkAssignComplete = async (firmName: string): Promise<boolean> => {
    const success = await bulkAssign(selectedTransactionIds, firmName);
    if (success) {
      setSelectedTransactionIds(new Set());
      setBulkAssignModalOpen(false);
    }
    return success ?? false;
  };

  const selectedTransaction = transactions.find(t => t.id === selectedTransactionForAssignment) || null;

  return (
    <div className="min-h-screen text-terminal-text" style={{ backgroundColor: '#0a0a0f' }}>
      <div className="sticky top-0 z-50 border-b border-terminal-border shadow-[0_1px_0_0_rgba(0,230,118,0.08)]" style={{ backgroundColor: '#0e0e14' }}>
        <SharedReportBanner
          displayName={displayName || report.display_name}
          onGetStarted={handleGetStarted}
        />
        <ReportHeader
          report={report}
          accounts={accounts}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onStartDateChange={dateRange.setStartDate}
          onEndDateChange={dateRange.setEndDate}
          onDatePreset={dateRange.setDatePreset}
          allFirmNames={firmFilter.allFirmNames}
          selectedFirms={firmFilter.selectedFirms}
          onToggleFirm={firmFilter.toggleFirm}
          onClearFirms={() => firmFilter.setSelectedFirms([])}
          onExportTransactions={handleExportTransactions}
          onExportPurchases={handleExportPurchases}
          onExportPayouts={handleExportPayouts}
          onExportMonthlySummary={handleExportMonthlySummary}
          onExportFirmBreakdown={handleExportFirmBreakdown}
          onExportPDF={handleExportPDF}
          needsAssignmentCount={0}
          tabs={['Overview', 'Firms', 'Transactions', 'Analytics']}
          activeTab={
            activeTab === 'overview' ? 'Overview' :
            activeTab === 'firms' ? 'Firms' :
            activeTab === 'transactions' ? 'Transactions' :
            'Analytics'
          }
          onTabChange={(tab) => {
            const tabMap: Record<string, 'overview' | 'firms' | 'transactions' | 'analytics'> = {
              'Overview': 'overview',
              'Firms': 'firms',
              'Transactions': 'transactions',
              'Analytics': 'analytics',
            };
            setActiveTab(tabMap[tab] || 'overview');
          }}
          canRefreshDaily={true}
          lastRefreshAttempt={null}
          onRefreshData={handleRefreshData}
          displayName={displayName}
          onGetStarted={handleGetStarted}
          shareUrl={typeof window !== 'undefined' ? `${window.location.origin}/share/${report.report_token}` : ''}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">

        {/* Needs Assignment Banner */}
        {!isPublicView && needsAssignmentTransactions.length > 0 && (
          <div className="mb-4 bg-accent-amber/10 border border-accent-amber/30 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-accent-amber flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            <div className="flex-1">
              <div className="text-sm font-medium text-accent-amber mb-0.5">
                {needsAssignmentTransactions.length} transaction{needsAssignmentTransactions.length > 1 ? 's' : ''} need{needsAssignmentTransactions.length === 1 ? 's' : ''} assignment
              </div>
              <div className="text-xs font-mono text-terminal-muted">
                Unassigned transactions aren&apos;t included in your P&L. Assign them to a firm or dismiss if they&apos;re not prop firm related.
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('transactions');
                setTransactionView('needs-assignment');
              }}
              className="px-3 py-1.5 text-xs font-mono font-medium text-accent-amber border border-accent-amber/30 hover:bg-accent-amber/20 rounded-lg transition-colors flex-shrink-0"
            >
              Review
            </button>
          </div>
        )}

        {/* Selected Firms Display */}
        {firmFilter.selectedFirms.length > 0 && (
          <div className="mb-4 bg-profit-dim border border-profit/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-medium text-terminal-muted uppercase tracking-wider">
                  Filtering {firmFilter.selectedFirms.length} firm{firmFilter.selectedFirms.length > 1 ? 's' : ''}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {firmFilter.selectedFirms.map(firmName => (
                    <button
                      key={firmName}
                      onClick={() => firmFilter.toggleFirm(firmName)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-profit/20 text-profit border border-profit/30 rounded text-xs font-mono font-medium hover:bg-profit/30 transition-colors"
                    >
                      {firmName}
                      <span className="ml-0.5 opacity-60">×</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => firmFilter.setSelectedFirms([])}
                className="px-3 py-1.5 text-xs text-terminal-muted hover:text-terminal-text font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <TabbedSection>
          {activeTab === 'overview' && (
            <>
              <OverviewTab
                filteredMonthlyBreakdown={dateRange.filteredMonthlyBreakdown}
                filteredFirmBreakdown={firmFilter.filteredFirmBreakdown}
                allFirmBreakdown={dateFilteredFirmBreakdown}
                tradingStats={tradingStats}
                displayPNL={displayPNL}
                displayDeposits={displayDeposits}
                displayFees={displayFees}
                selectedFirmsCount={firmFilter.selectedFirms.length}
                totalFirmsCount={dateFilteredFirmBreakdown.length}
              />
              {isPublicView && (
                <PublicInlineCTA
                  message="Want to see your own P&L breakdown like this?"
                  ctaText="Get your report"
                  onGetStarted={handleGetStarted}
                />
              )}
            </>
          )}

          {activeTab === 'firms' && (
            <>
              <FirmsTab
                filteredFirmBreakdown={firmFilter.filteredFirmBreakdown}
                allFirmBreakdown={dateFilteredFirmBreakdown}
                selectedFirms={firmFilter.selectedFirms}
                onToggleFirm={firmFilter.toggleFirm}
              />
              {isPublicView && (
                <PublicInlineCTA
                  message="Compare your own firm performance side by side"
                  ctaText="Track my firms"
                  onGetStarted={handleGetStarted}
                />
              )}
            </>
          )}

          {activeTab === 'transactions' && (
            isPublicView ? (
              <TransactionsTeaser
                transactionCount={transactions.length}
                onGetStarted={handleGetStarted}
              />
            ) : (
            <TransactionsTab
              transactionsWithAssignments={filteredTransactions}
              manualAssignments={manualAssignments}
              needsAssignmentTransactions={needsAssignmentTransactions}
              selectedTransactionIds={selectedTransactionIds}
              onToggleTransaction={(id) => {
                const newSelected = new Set(selectedTransactionIds);
                if (newSelected.has(id)) {
                  newSelected.delete(id);
                } else {
                  newSelected.add(id);
                }
                setSelectedTransactionIds(newSelected);
              }}
              onSelectAllTransactions={(ids) => {
                setSelectedTransactionIds(new Set(ids));
              }}
              onDeselectAllTransactions={() => {
                setSelectedTransactionIds(new Set());
              }}
              onOpenAssignmentModal={(transactionId) => {
                setSelectedTransactionForAssignment(transactionId);
                setAssignmentModalOpen(true);
              }}
              onOpenBulkAssignModal={() => {
                setBulkAssignModalOpen(true);
              }}
              onDismissTransaction={dismissTransaction}
              onBulkDismiss={async (ids) => {
                await bulkDismiss(ids);
                setSelectedTransactionIds(new Set());
              }}
              selectedFirms={firmFilter.selectedFirms}
              transactionView={transactionView}
              onTransactionViewChange={setTransactionView}
            />
            )
          )}

          {activeTab === 'analytics' && (
            <>
              <AnalyticsTab tradingStats={tradingStats} />
              {isPublicView && (
                <PublicInlineCTA
                  message="Get these analytics for your own trading data"
                  ctaText="Analyze my trades"
                  onGetStarted={handleGetStarted}
                />
              )}
            </>
          )}
        </TabbedSection>

        {/* Assignment Modal */}
        <AssignmentModal
          isOpen={assignmentModalOpen}
          onClose={handleCloseAssignmentModal}
          transaction={selectedTransaction}
          perFirmBreakdown={perFirmBreakdown}
          manualAssignments={manualAssignments}
          onSave={saveManualAssignment}
          onRemove={removeManualAssignment}
        />

        {/* Bulk Assign Modal */}
        <BulkAssignModal
          isOpen={bulkAssignModalOpen}
          onClose={() => setBulkAssignModalOpen(false)}
          selectedCount={selectedTransactionIds.size}
          allFirmNames={firmFilter.allFirmNames}
          onAssign={handleBulkAssignComplete}
        />

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-terminal-border text-center text-xs text-terminal-muted">
          <p className="mb-1 font-mono">
            Generated {formatDate(pnlData.generatedAt)} · Prop PNL
          </p>
          <p className="opacity-60">
            For informational purposes only. Not financial advice.
          </p>
        </div>
      </div>

      {/* Upgraded CTA Banner for public viewers */}
      {isPublicView && !ctaDismissed && (
        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-profit/20 bg-terminal-card/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <p className="text-xs text-terminal-text font-mono font-medium">
                {displayName
                  ? `Get your own P&L report like ${displayName}. Free — no card.`
                  : 'See your own P&L breakdown — connect your bank in 60 seconds'
                }
              </p>
              <span className="text-[10px] text-terminal-muted font-mono hidden sm:inline flex-shrink-0">
                Free · No credit card
              </span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleGetStarted}
                className="px-4 py-1.5 text-xs font-mono font-medium text-terminal-bg bg-profit hover:bg-profit/90 rounded-md transition-colors"
              >
                Get Started Free
              </button>
              <button
                onClick={() => setCtaDismissed(true)}
                className="p-1 text-terminal-muted hover:text-terminal-text transition-colors"
                aria-label="Dismiss banner"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll-triggered conversion popup */}
      {isPublicView && (
        <ConversionPopup
          displayName={displayName || report.display_name}
          onGetStarted={handleGetStarted}
        />
      )}

      {/* Auth modal for in-page sign-up */}
      {isPublicView && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode="signup"
        />
      )}
    </div>
  );
}
