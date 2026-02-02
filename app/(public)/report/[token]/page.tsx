import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ReportContent from './ReportContent';
import { calculatePNLReport } from '@/lib/pnl-calculations';
import type { PNLReport } from '@/lib/pnl-calculations';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { getURL } from '@/utils/helpers';
import type { Metadata } from 'next';

// TypeScript: This file imports PNL calculations and report content components

interface PageProps {
  params: Promise<{ token: string }>;
}

/**
 * Generate dynamic OpenGraph metadata for social sharing previews.
 * Uses the admin Supabase client so that OG crawlers (which are unauthenticated)
 * can still trigger metadata generation with real report stats.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const siteUrl = getURL();

  // Default metadata used as fallback
  const defaultMetadata: Metadata = {
    title: 'Prop Trading Report | Prop PNL',
    description: 'View this prop trading performance report on Prop PNL.',
    openGraph: {
      title: 'Prop Trading Report | Prop PNL',
      description: 'View this prop trading performance report on Prop PNL.',
      url: `${siteUrl}/report/${token}`,
      siteName: 'Prop PNL',
      images: [
        {
          url: `${siteUrl}/api/og/report?token=${token}`,
          width: 1200,
          height: 630,
          alt: 'Prop Trading Report',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Prop Trading Report | Prop PNL',
      description: 'View this prop trading performance report on Prop PNL.',
      images: [`${siteUrl}/api/og/report?token=${token}`],
    },
  };

  try {
    // Use admin client to fetch report data (OG crawlers are unauthenticated)
    const { data: report, error } = await supabaseAdmin
      .from('pnl_reports')
      .select('raw_teller_data, pnl_data, manual_assignments, status')
      .eq('report_token', token)
      .single();

    if (error || !report || report.status !== 'completed') {
      return defaultMetadata;
    }

    // Calculate PNL data
    let pnlData: PNLReport | null = null;
    const manualAssignments = report.manual_assignments || {};

    if (report.raw_teller_data) {
      pnlData = calculatePNLReport(report.raw_teller_data, manualAssignments);
    } else if (report.pnl_data) {
      pnlData = report.pnl_data as PNLReport;
    }

    if (!pnlData) {
      return defaultMetadata;
    }

    // Build a dynamic description with key stats
    const { summary, perFirmBreakdown } = pnlData;
    const netPNL = summary.netPNL;
    const sign = netPNL >= 0 ? '+' : '-';
    const formattedPNL = `${sign}$${Math.abs(netPNL).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    const firmCount = perFirmBreakdown.length;
    const roi = summary.totalFees > 0
      ? `${netPNL >= 0 ? '+' : ''}${((netPNL / summary.totalFees) * 100).toFixed(0)}%`
      : 'N/A';

    const description = `Net P&L: ${formattedPNL} | ${firmCount} Firm${firmCount !== 1 ? 's' : ''} | ${roi} ROI`;

    const ogImageUrl = `${siteUrl}/api/og/report?token=${token}`;

    return {
      title: 'Prop Trading Report | Prop PNL',
      description,
      openGraph: {
        title: 'Prop Trading Report | Prop PNL',
        description,
        url: `${siteUrl}/report/${token}`,
        siteName: 'Prop PNL',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: 'Prop Trading Report',
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Prop Trading Report | Prop PNL',
        description,
        images: [ogImageUrl],
      },
    };
  } catch {
    return defaultMetadata;
  }
}

interface PNLReportRow {
  id: string;
  user_id: string;
  report_token: string;
  account_id: string;
  raw_teller_data: any;
  pnl_data: PNLReport | null;
  manual_assignments: Record<string, string> | null;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  display_name: string | null;
  share_slug: string | null;
}

export default async function ReportPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();
  
  // Require authentication - check if user is logged in
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (!user || authError) {
    // Redirect to landing page if not authenticated
    redirect('/');
  }

  // Fetch PNL report by token - ensure user owns this report
  const { data: report, error } = await supabase
    .from('pnl_reports')
    .select('*')
    .eq('report_token', token)
    .eq('user_id', user.id) // Ensure user owns this report
    .single();

  if (error || !report) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
        <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-loss-dim rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-loss" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-9V5a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-terminal-text mb-2">Report Not Found</h1>
          <p className="text-terminal-muted mb-4">
            This PNL report could not be found.
          </p>
          <Link 
            href="/"
            className="inline-block px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const reportData = report as PNLReportRow;

  // Check if report is completed
  if (reportData.status !== 'completed') {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
        <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-accent-amber/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-accent-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-terminal-text mb-2">Report Not Ready</h1>
          <p className="text-terminal-muted">
            This PNL report is still being processed. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  // Always recalculate from raw data to ensure accuracy
  // Stored pnl_data might be from an older version with calculation bugs
  let pnlData: PNLReport | null = null;
  const rawData = reportData.raw_teller_data;
  
  // Load manual assignments from database (default to empty object if null)
  const manualAssignments = reportData.manual_assignments || {};

  // Recalculate from raw data if available (ensures calculations are always correct)
  if (rawData) {
    pnlData = calculatePNLReport(rawData, manualAssignments);
  } else if (reportData.pnl_data) {
    // Fallback to stored data if no raw data available
    pnlData = reportData.pnl_data;
    
    // Ensure all transactions have match property (in case stored data is incomplete)
    if (pnlData && pnlData.transactions) {
      pnlData.transactions = pnlData.transactions.map(txn => {
        if (!txn.match) {
          return {
            ...txn,
            match: {
              type: 'unmatched' as const,
              firmName: null,
              confidence: 'low' as const,
            },
          };
        }
        return txn;
      });
    }
  }

  if (!pnlData) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
        <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-loss-dim rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-loss" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-terminal-text mb-2">Report Error</h1>
          <p className="text-terminal-muted">
            This report could not be processed. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  // Get connected account info for refresh capability (Sync button)
  let canRefreshDaily = false;
  let lastRefreshAttempt: string | null = null;
  const { data: connectedAccount } = await supabaseAdmin
    .from('connected_accounts')
    .select('can_refresh_daily, last_refresh_attempt')
    .eq('user_id', user.id)
    .eq('account_id', reportData.account_id)
    .single();

  if (connectedAccount) {
    canRefreshDaily = connectedAccount.can_refresh_daily || false;
    lastRefreshAttempt = connectedAccount.last_refresh_attempt || null;
  }

  return (
    <ReportContent
      report={{
        id: reportData.id,
        user_id: reportData.user_id,
        report_token: reportData.report_token,
        account_id: reportData.account_id,
        created_at: reportData.created_at,
        updated_at: reportData.updated_at,
        display_name: reportData.display_name,
        share_slug: reportData.share_slug ?? null,
      }}
      pnlData={pnlData}
      canRefreshDaily={canRefreshDaily}
      lastRefreshAttempt={lastRefreshAttempt}
    />
  );
}
