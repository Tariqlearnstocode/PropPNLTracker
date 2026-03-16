'use client';

import React, { useState, useCallback } from 'react';
import { formatDate } from '@/lib/pnl-calculations';
import { CombinedDateSelector } from './CombinedDateSelector';
import { FirmFilter } from './FirmFilter';
import { ExportDropdown } from './ExportDropdown';
import { ExportBlockedPopup } from '@/components/report/public/ExportBlockedPopup';
import { ShareModal } from '@/components/report/public/ShareModal';
import { useToast } from '@/components/ui/Toasts/use-toast';

interface ReportHeaderProps {
  report: {
    updated_at: string;
    report_token: string;
  };
  accounts: Array<{ id: string }>;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onDatePreset: (preset: 'ytd' | 'all' | 'last30' | 'last90') => void;
  allFirmNames: string[];
  selectedFirms: string[];
  onToggleFirm: (firmName: string) => void;
  onClearFirms: () => void;
  onExportTransactions: () => void;
  onExportPurchases: () => void;
  onExportPayouts: () => void;
  onExportMonthlySummary: () => void;
  onExportFirmBreakdown: () => void;
  onExportPDF: () => void;
  needsAssignmentCount?: number;
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  canRefreshDaily?: boolean;
  lastRefreshAttempt?: string | null;
  lastSyncedAt?: string | null;
  onRefreshData?: () => Promise<void>;
  displayName?: string;
  onGetStarted?: () => void;
  /** URL to copy when sharing (owner: /share/{slug or token}, viewer: current page URL) */
  shareUrl?: string;
  isPublicView?: boolean;
  reportId?: string;
  shareSlug?: string | null;
  onShareSlugSave?: (slug: string | null) => Promise<void>;
  enrollmentDisconnected?: boolean;
}

export function ReportHeader({
  report,
  accounts,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onDatePreset,
  allFirmNames,
  selectedFirms,
  onToggleFirm,
  onClearFirms,
  onExportTransactions,
  onExportPurchases,
  onExportPayouts,
  onExportMonthlySummary,
  onExportFirmBreakdown,
  onExportPDF,
  needsAssignmentCount = 0,
  tabs,
  activeTab,
  onTabChange,
  canRefreshDaily = false,
  lastRefreshAttempt = null,
  lastSyncedAt = null,
  onRefreshData,
  displayName = '',
  onGetStarted,
  shareUrl = '',
  isPublicView = false,
  reportId,
  shareSlug = null,
  onShareSlugSave,
  enrollmentDisconnected = false,
}: ReportHeaderProps) {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportBlockedOpen, setExportBlockedOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleShare = useCallback(() => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (isPublicView) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
      return;
    }
    setShareModalOpen(true);
  }, [shareUrl, isPublicView]);

  // Check if already refreshed today (rate limit: once per UTC day)
  const lastRefreshDate = lastRefreshAttempt ? new Date(lastRefreshAttempt) : null;
  const now = new Date();
  const hasRefreshedToday = lastRefreshDate ? (
    lastRefreshDate.getUTCFullYear() === now.getUTCFullYear() &&
    lastRefreshDate.getUTCMonth() === now.getUTCMonth() &&
    lastRefreshDate.getUTCDate() === now.getUTCDate()
  ) : false;

  // "X ago" and "next refresh at" for when already refreshed today
  const refreshedAgoText = lastRefreshDate ? (() => {
    const ms = now.getTime() - lastRefreshDate.getTime();
    const mins = Math.floor(ms / 60000);
    const hours = Math.floor(ms / 3600000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    return formatDate(lastRefreshAttempt!);
  })() : '';
  const nextRefreshAt = lastRefreshDate ? (() => {
    const next = new Date(lastRefreshDate);
    next.setUTCDate(next.getUTCDate() + 1);
    next.setUTCHours(0, 0, 0, 0);
    return next.toLocaleString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' UTC';
  })() : '';
  const alreadyRefreshedMessage = hasRefreshedToday && refreshedAgoText && nextRefreshAt
    ? `Refreshed ${refreshedAgoText}. Next refresh at ${nextRefreshAt}.`
    : hasRefreshedToday
      ? 'Already refreshed today.'
      : '';

  const handleRefresh = async () => {
    if (!onRefreshData || isRefreshing || hasRefreshedToday) return;

    setIsRefreshing(true);
    try {
      await onRefreshData();
      toast({
        title: 'Refresh Successful',
        description: 'Your transaction data has been updated.',
      });
      window.location.reload();
    } catch (error: unknown) {
      toast({
        title: 'Refresh Failed',
        description: error instanceof Error ? error.message : 'Failed to refresh data. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="sticky top-0 z-50 border-b border-terminal-border shadow-[0_1px_0_0_rgba(0,230,118,0.08)] bg-terminal-header">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
        <div className="mb-3 opacity-0 animate-fade-in stagger-1">
          <h1 className="font-display font-semibold tracking-tight text-terminal-text text-xl md:text-2xl">
            {displayName ? (
              <>
                <span>{displayName}&apos;s Trading </span>
                <span className="text-profit">Report</span>
              </>
            ) : (
              <>
                <span>Trading </span>
                <span className="text-profit">Report</span>
              </>
            )}
          </h1>
        </div>
        {!isPublicView && enrollmentDisconnected && (
          <div className="mb-3 px-3 py-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 flex items-center justify-between gap-3 opacity-0 animate-fade-in stagger-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-yellow-400 text-sm shrink-0">&#x26A0;</span>
              <span className="text-[12px] font-mono text-yellow-300/90 truncate">
                Bank connection lost. Auto-sync is paused.
              </span>
            </div>
            <a
              href="/connect"
              className="shrink-0 px-3 py-1 text-[11px] font-mono font-medium rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors"
            >
              Reconnect
            </a>
          </div>
        )}
        <div className="flex items-center justify-between flex-wrap gap-3 opacity-0 animate-fade-in stagger-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {!isPublicView && enrollmentDisconnected ? (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-[11px] font-mono text-yellow-400 uppercase tracking-wider">
                    Disconnected
                  </span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2 animate-pulse">
                    <span className="inline-block w-2 h-2 rounded-full bg-profit drop-shadow-[0_0_6px_rgba(0,230,118,0.4)]" />
                  </span>
                  <span className="text-[11px] font-mono text-terminal-muted uppercase tracking-wider">
                    Live
                  </span>
                </>
              )}
            </div>
            <span className="text-[11px] font-mono text-terminal-muted">
              Last synced {lastSyncedAt ? formatDate(lastSyncedAt) : 'Never'}
            </span>
            {!isPublicView && (
              <>
                <span className="text-terminal-border">·</span>
                <span className="text-[11px] font-mono text-terminal-muted">
                  {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isPublicView && onGetStarted && (
              <button
                onClick={onGetStarted}
                className="px-4 py-1.5 text-xs font-mono font-medium rounded-lg bg-profit text-terminal-bg hover:bg-profit/90 transition-colors"
              >
                Get my report
              </button>
            )}
            <button
              onClick={handleShare}
              title={isPublicView ? 'Copy link' : 'Share'}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-medium rounded-lg border transition-colors ${
                copied
                  ? 'border-profit/50 text-profit bg-profit/10'
                  : 'border-terminal-border text-terminal-muted hover:text-terminal-text hover:border-terminal-border-light'
              }`}
            >
              <span className="text-xs">🔗</span>
              {copied ? 'Copied!' : 'Share'}
            </button>
            {!isPublicView && (
              <>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing || hasRefreshedToday}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                    isRefreshing || hasRefreshedToday
                      ? 'text-terminal-muted/50 cursor-not-allowed'
                      : 'text-profit hover:bg-profit-dim'
                  }`}
                  title={hasRefreshedToday ? alreadyRefreshedMessage : 'Refresh transaction data'}
                >
                  <span className={isRefreshing ? 'inline-block animate-spin text-sm' : 'text-sm'}>{isRefreshing ? '⏳' : '🔄'}</span>
                  {isRefreshing ? 'Syncing...' : 'Sync'}
                </button>
                {hasRefreshedToday && refreshedAgoText && nextRefreshAt && (
                  <span className="text-[10px] font-mono text-terminal-muted hidden sm:inline max-w-[200px] truncate" title={alreadyRefreshedMessage}>
                    Refreshed {refreshedAgoText} · Next at {nextRefreshAt}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <FirmFilter
            allFirmNames={allFirmNames}
            selectedFirms={selectedFirms}
            onToggleFirm={onToggleFirm}
            onClearFirms={onClearFirms}
          />

          <div className="flex items-center gap-2">
            <CombinedDateSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
              onDatePreset={onDatePreset}
            />

            <ExportDropdown
              onExportTransactions={isPublicView ? () => setExportBlockedOpen(true) : onExportTransactions}
              onExportPurchases={isPublicView ? () => setExportBlockedOpen(true) : onExportPurchases}
              onExportPayouts={isPublicView ? () => setExportBlockedOpen(true) : onExportPayouts}
              onExportMonthlySummary={isPublicView ? () => setExportBlockedOpen(true) : onExportMonthlySummary}
              onExportFirmBreakdown={isPublicView ? () => setExportBlockedOpen(true) : onExportFirmBreakdown}
              onExportPDF={isPublicView ? () => setExportBlockedOpen(true) : onExportPDF}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-terminal-border opacity-0 animate-fade-in stagger-3">
        <div className="flex items-center gap-0 px-4 md:px-6 overflow-x-auto dark-scroll">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`relative px-4 py-2.5 text-xs font-medium transition-all whitespace-nowrap uppercase tracking-wider ${
                  isActive
                    ? 'text-profit'
                    : 'text-terminal-muted hover:text-terminal-text'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {tab}
                  {tab === 'Transactions' && needsAssignmentCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-loss/20 text-loss text-[10px] font-mono font-bold leading-none">
                      {needsAssignmentCount}
                    </span>
                  )}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-profit" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {isPublicView && (
        <ExportBlockedPopup
          open={exportBlockedOpen}
          onClose={() => setExportBlockedOpen(false)}
          onGetStarted={onGetStarted}
        />
      )}
      {!isPublicView && (
        <ShareModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          shareUrl={shareUrl}
          reportToken={report.report_token}
          shareSlug={shareSlug}
          onShareSlugSave={onShareSlugSave}
        />
      )}
    </div>
  );
}
