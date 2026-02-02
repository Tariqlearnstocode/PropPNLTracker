'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { RefreshCw, Circle, Link, Pencil } from 'lucide-react';
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
  isPublicView?: boolean;
  displayName?: string;
  onSaveDisplayName?: (name: string) => void;
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
  isPublicView = false,
  displayName = '',
  onSaveDisplayName,
}: ReportHeaderProps) {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(displayName);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/share/${report.report_token}`;

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
  }, [toast, report.report_token]);

  const handleStartEditing = useCallback(() => {
    setNameDraft(displayName);
    setIsEditingName(true);
  }, [displayName]);

  const handleSaveName = useCallback(() => {
    setIsEditingName(false);
    const trimmed = nameDraft.trim();
    if (trimmed !== displayName) {
      onSaveDisplayName?.(trimmed);
    }
  }, [nameDraft, displayName, onSaveDisplayName]);

  const handleNameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      setNameDraft(displayName);
    }
  }, [handleSaveName, displayName]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

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
    <div className="sticky top-0 z-50 bg-terminal-bg/95 backdrop-blur-md border-b border-terminal-border">
      {/* Row 1: Status bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
        {/* Display name row — public view shows name prominently, owner can edit */}
        {(isPublicView && displayName) && (
          <div className="mb-1.5">
            <h1 className="text-sm font-semibold text-terminal-text tracking-tight">
              {displayName}&apos;s Trading Report
            </h1>
          </div>
        )}
        {!isPublicView && (
          <div className="mb-1.5">
            {isEditingName ? (
              <input
                ref={nameInputRef}
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleNameKeyDown}
                placeholder="Your trading name"
                maxLength={40}
                className="bg-transparent border-b border-profit/50 text-sm font-semibold text-terminal-text placeholder:text-terminal-muted/50 outline-none w-48 py-0.5"
              />
            ) : (
              <button
                onClick={handleStartEditing}
                className="flex items-center gap-1.5 group"
              >
                <span className="text-sm font-semibold text-terminal-text/80 group-hover:text-terminal-text transition-colors">
                  {displayName || 'Set display name'}
                </span>
                <Pencil className="w-3 h-3 text-terminal-muted/50 group-hover:text-terminal-muted transition-colors" />
              </button>
            )}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Circle className="w-2 h-2 fill-profit text-profit" />
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
            {canRefreshDaily && (
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
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Controls */}
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

            {!isPublicView && (
              <button
                onClick={handleShare}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-medium rounded-lg transition-colors ${
                  copied
                    ? 'bg-profit/20 text-profit border border-profit/30'
                    : 'bg-profit text-terminal-bg hover:bg-profit/90'
                }`}
                title="Copy shareable link"
              >
                <Link className="w-3 h-3" />
                {copied ? 'Copied!' : 'Share'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Tabs */}
      <div className="max-w-7xl mx-auto">
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
