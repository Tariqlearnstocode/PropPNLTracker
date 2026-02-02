'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, Circle, Link } from 'lucide-react';
import { formatDate } from '@/lib/pnl-calculations';
import { CombinedDateSelector } from './CombinedDateSelector';
import { FirmFilter } from './FirmFilter';
import { ExportDropdown } from './ExportDropdown';
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
  onRefreshData?: () => Promise<void>;
  displayName?: string;
  onGetStarted: () => void;
  /** URL to copy when sharing (owner: /share/{token}, viewer: current page URL) */
  shareUrl?: string;
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
  onRefreshData,
  displayName = '',
  onGetStarted,
  shareUrl = '',
}: ReportHeaderProps) {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Could not copy the link to clipboard.',
        variant: 'destructive',
      });
    }
  }, [toast, shareUrl]);

  // Check if already refreshed today
  const hasRefreshedToday = lastRefreshAttempt ? (() => {
    const lastRefresh = new Date(lastRefreshAttempt);
    const now = new Date();
    return (
      lastRefresh.getUTCFullYear() === now.getUTCFullYear() &&
      lastRefresh.getUTCMonth() === now.getUTCMonth() &&
      lastRefresh.getUTCDate() === now.getUTCDate()
    );
  })() : false;

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
    } catch (error: any) {
      toast({
        title: 'Refresh Failed',
        description: error.message || 'Failed to refresh data. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="sticky top-0 z-50 border-b border-terminal-border shadow-[0_1px_0_0_rgba(0,230,118,0.08)]" style={{ backgroundColor: '#0e0e14' }}>
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
        <div className="flex items-center justify-between flex-wrap gap-3 opacity-0 animate-fade-in stagger-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 animate-pulse">
                <Circle className="w-2 h-2 fill-profit text-profit drop-shadow-[0_0_6px_rgba(0,230,118,0.4)]" />
              </span>
              <span className="text-[11px] font-mono text-terminal-muted uppercase tracking-wider">
                Live
              </span>
            </div>
            <span className="text-[11px] font-mono text-terminal-muted">
              Updated {formatDate(report.updated_at)}
            </span>
            <span className="text-terminal-border">·</span>
            <span className="text-[11px] font-mono text-terminal-muted">
              {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGetStarted}
              className="px-4 py-1.5 text-xs font-mono font-medium rounded-lg bg-profit text-terminal-bg hover:bg-profit/90 transition-colors"
            >
              Get my report free
            </button>
            <button
              onClick={handleShare}
              title="Copy link"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-medium rounded-lg border transition-colors ${
                copied
                  ? 'border-profit/50 text-profit bg-profit/10'
                  : 'border-terminal-border text-terminal-muted hover:text-terminal-text hover:border-terminal-border-light'
              }`}
            >
              <Link className="w-3 h-3" />
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || hasRefreshedToday}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                isRefreshing || hasRefreshedToday
                  ? 'text-terminal-muted/50 cursor-not-allowed'
                  : 'text-profit hover:bg-profit-dim'
              }`}
              title={hasRefreshedToday ? `Already refreshed today` : 'Refresh transaction data'}
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Sync'}
            </button>
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
              onExportTransactions={onExportTransactions}
              onExportPurchases={onExportPurchases}
              onExportPayouts={onExportPayouts}
              onExportMonthlySummary={onExportMonthlySummary}
              onExportFirmBreakdown={onExportFirmBreakdown}
              onExportPDF={onExportPDF}
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
    </div>
  );
}
