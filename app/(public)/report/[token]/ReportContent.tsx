'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PNLReport, formatDate, calculateTradingStats, calculatePerFirmBreakdown } from '@/lib/pnl-calculations';

// UI Components
import { TabbedSection } from '@/components/report/ui/TabbedSection';

// Tab Components (4 tabs)
import { OverviewTab } from '@/components/report/tabs/OverviewTab';
import { FirmsTab } from '@/components/report/tabs/FirmsTab';
import { TransactionsTab } from '@/components/report/tabs/TransactionsTab';
import { AnalyticsTab } from '@/components/report/tabs/AnalyticsTab';

// Control Components
import { ReportHeader } from '@/components/report/controls/ReportHeader';
import { VisibilityControls } from '@/components/report/controls/VisibilityControls';

// Modal Components
import { AssignmentModal } from '@/components/report/modals/AssignmentModal';
import { BulkAssignModal } from '@/components/report/modals/BulkAssignModal';

// Hooks
import { useManualAssignments } from '@/components/report/hooks/useManualAssignments';
import { useDateRange } from '@/components/report/hooks/useDateRange';
import { useFirmFilter } from '@/components/report/hooks/useFirmFilter';
import { useExportHandlers } from '@/components/report/hooks/useExportHandlers';

// Public view conversion components
import { ConversionPopup } from '@/components/report/public/ConversionPopup';
import { PublicInlineCTA } from '@/components/report/public/PublicInlineCTA';
import { TransactionsTeaser } from '@/components/report/public/TransactionsTeaser';
import { PublicCTABanner } from '@/components/report/public/PublicCTABanner';
import { AuthModal } from '@/components/AuthModal';
import { useReportNav } from '@/contexts/ReportNavContext';

// UI elements
import { NeedsAssignmentBanner } from '@/components/report/ui/NeedsAssignmentBanner';
import { SelectedFirmsDisplay } from '@/components/report/ui/SelectedFirmsDisplay';

interface Props {
  report: {
    id: string;
    user_id: string;
    report_token: string;
    account_id: string;
    created_at: string;
    updated_at: string;
    display_name?: string | null;
    share_slug?: string | null;
  };
  pnlData: PNLReport;
  canRefreshDaily?: boolean;
  lastRefreshAttempt?: string | null;
  isPublicView?: boolean;
}


export default function ReportContent({ report, pnlData, canRefreshDaily = false, lastRefreshAttempt = null, isPublicView = false }: Props) {
  const { summary, monthlyBreakdown, perFirmBreakdown, transactions, accounts } = pnlData;
  const { setReportNav } = useReportNav();
  const [activeTab, setActiveTab] = useState<'overview' | 'firms' | 'transactions' | 'analytics'>('overview');
  const [transactionView, setTransactionView] = useState<'payouts' | 'purchases' | 'needs-assignment' | 'find-missing'>('payouts');
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<Set<string>>(new Set());
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedTransactionForAssignment, setSelectedTransactionForAssignment] = useState<string | null>(null);
  const [bulkAssignModalOpen, setBulkAssignModalOpen] = useState(false);
  const [ctaDismissed, setCtaDismissed] = useState(false);
  const [displayName, setDisplayName] = useState(report.display_name || '');
  const [shareSlug, setShareSlug] = useState(report.share_slug ?? null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isPublicToggle, setIsPublicToggle] = useState(false);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(false);
  const [togglingPublic, setTogglingPublic] = useState(false);
  const [togglingLeaderboard, setTogglingLeaderboard] = useState(false);

  const handleGetStarted = useCallback(() => setAuthModalOpen(true), []);

  const handleShareSlugSave = useCallback(async (slug: string | null) => {
    const res = await fetch('/api/pnl/share-slug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId: report.id, shareSlug: slug || '' }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to update');
    }
    setShareSlug(slug || null);
  }, [report.id]);

  // When public view, feed navbar (SharedReportBanner-style) via context so GlobalNavbar can render it
  useEffect(() => {
    if (isPublicView) {
      setReportNav({
        displayName: displayName || report.display_name || null,
        onGetStarted: handleGetStarted,
      });
      return () => setReportNav(null);
    }
  }, [isPublicView, displayName, report.display_name, setReportNav, handleGetStarted]);

  // Fetch visibility preferences (owner view only)
  useEffect(() => {
    if (isPublicView) return;
    Promise.all([
      fetch('/api/pnl/public-toggle').then(r => r.ok ? r.json() : null),
      fetch('/api/pnl/leaderboard-toggle').then(r => r.ok ? r.json() : null),
    ]).then(([pubData, lbData]) => {
      if (pubData) setIsPublicToggle(pubData.isPublic ?? false);
      if (lbData) setShowOnLeaderboard(lbData.showOnLeaderboard ?? false);
    }).catch(() => {});
  }, [isPublicView]);

  const handleTogglePublic = async () => {
    if (togglingPublic) return;
    setTogglingPublic(true);
    const newValue = !isPublicToggle;
    try {
      const res = await fetch('/api/pnl/public-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: newValue }),
      });
      if (res.ok) setIsPublicToggle(newValue);
    } catch {}
    setTogglingPublic(false);
  };

  const handleToggleLeaderboard = async () => {
    if (togglingLeaderboard) return;
    setTogglingLeaderboard(true);
    const newValue = !showOnLeaderboard;
    try {
      const res = await fetch('/api/pnl/leaderboard-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showOnLeaderboard: newValue }),
      });
      if (res.ok) setShowOnLeaderboard(newValue);
    } catch {}
    setTogglingLeaderboard(false);
  };

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
  const {
    handleExportTransactions,
    handleExportPurchases,
    handleExportPayouts,
    handleExportMonthlySummary,
    handleExportFirmBreakdown,
    handleExportPDF,
  } = useExportHandlers({
    filteredTransactions,
    selectedFirms: firmFilter.selectedFirms,
    filteredMonthlyBreakdown: dateRange.filteredMonthlyBreakdown,
    filteredFirmBreakdown: firmFilter.filteredFirmBreakdown,
    dateFilteredFirmBreakdown,
  });

  // Display name handler
  const handleSaveDisplayName = async (name: string) => {
    setDisplayName(name);
    try {
      await fetch('/api/pnl/display-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: report.id, displayName: name }),
      });
    } catch {
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
    } catch (error: unknown) {
      throw error;
    }
  };

  // Modal handlers
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
    <div className="min-h-screen text-terminal-text bg-terminal-bg">
      <div className="sticky top-0 z-50 border-b border-terminal-border shadow-[0_1px_0_0_rgba(0,230,118,0.08)] bg-terminal-header">
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
          needsAssignmentCount={isPublicView ? 0 : needsAssignmentTransactions.length}
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
          canRefreshDaily={!isPublicView}
          lastRefreshAttempt={isPublicView ? null : lastRefreshAttempt}
          onRefreshData={isPublicView ? undefined : handleRefreshData}
          displayName={displayName}
          onGetStarted={isPublicView ? handleGetStarted : undefined}
          shareUrl={typeof window !== 'undefined' ? (isPublicView ? window.location.href : `${window.location.origin}/share/${shareSlug || report.report_token}`) : ''}
          isPublicView={isPublicView}
          reportId={report.id}
          shareSlug={shareSlug}
          onShareSlugSave={!isPublicView ? handleShareSlugSave : undefined}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">

        {/* Visibility Controls */}
        {!isPublicView && (
          <VisibilityControls
            displayName={displayName}
            onDisplayNameChange={setDisplayName}
            onSaveDisplayName={handleSaveDisplayName}
            isPublicToggle={isPublicToggle}
            onTogglePublic={handleTogglePublic}
            togglingPublic={togglingPublic}
            showOnLeaderboard={showOnLeaderboard}
            onToggleLeaderboard={handleToggleLeaderboard}
            togglingLeaderboard={togglingLeaderboard}
          />
        )}

        {/* Needs Assignment Banner */}
        {!isPublicView && (
          <NeedsAssignmentBanner
            count={needsAssignmentTransactions.length}
            onReview={() => {
              setActiveTab('transactions');
              setTransactionView('needs-assignment');
            }}
          />
        )}

        {/* Selected Firms Display */}
        <SelectedFirmsDisplay
          selectedFirms={firmFilter.selectedFirms}
          onToggleFirm={firmFilter.toggleFirm}
          onClearFirms={() => firmFilter.setSelectedFirms([])}
        />

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
                transactionCount={transactions.filter(t => t.match.type === 'deposit' || t.match.type === 'fee').length}
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
        <PublicCTABanner
          displayName={displayName}
          onGetStarted={handleGetStarted}
          onDismiss={() => setCtaDismissed(true)}
        />
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
