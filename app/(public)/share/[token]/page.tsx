import Link from 'next/link';
import ReportContent from '../../report/[token]/ReportContent';
import { calculatePNLReport } from '@/lib/pnl-calculations';
import type { PNLReport } from '@/lib/pnl-calculations';
import { getReportBySlugOrToken } from '@/lib/report-resolver';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { getURL } from '@/utils/helpers';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const siteUrl = getURL();

  const defaultMetadata: Metadata = {
    title: 'Prop Trading Report | Prop PNL',
    description: 'View this prop trading performance report on Prop PNL.',
    openGraph: {
      title: 'Prop Trading Report | Prop PNL',
      description: 'View this prop trading performance report on Prop PNL.',
      url: `${siteUrl}/share/${token}`,
      siteName: 'Prop PNL',
      images: [{ url: `${siteUrl}/api/og/report?token=${token}`, width: 1200, height: 630, alt: 'Prop Trading Report' }],
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
    const report = await getReportBySlugOrToken(supabaseAdmin, token);
    if (!report || (report as { status: string }).status !== 'completed') return defaultMetadata;

    let pnlData: PNLReport | null = null;
    const manualAssignments = (report as { manual_assignments?: object }).manual_assignments || {};

    if ((report as { raw_teller_data?: unknown }).raw_teller_data) {
      pnlData = calculatePNLReport((report as { raw_teller_data: unknown }).raw_teller_data, manualAssignments);
    } else if ((report as { pnl_data?: PNLReport }).pnl_data) {
      pnlData = (report as { pnl_data: PNLReport }).pnl_data;
    }

    if (!pnlData) return defaultMetadata;

    const { summary, perFirmBreakdown } = pnlData;
    const netPNL = summary.netPNL;
    const sign = netPNL >= 0 ? '+' : '-';
    const formattedPNL = `${sign}$${Math.abs(netPNL).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    const firmCount = perFirmBreakdown.length;
    const roi = summary.totalFees > 0
      ? `${netPNL >= 0 ? '+' : ''}${((netPNL / summary.totalFees) * 100).toFixed(0)}%`
      : 'N/A';
    const description = `Net P&L: ${formattedPNL} | ${firmCount} Firm${firmCount !== 1 ? 's' : ''} | ${roi} ROI`;
    const reportRow = report as { display_name?: string | null };
    const title = reportRow.display_name
      ? `${reportRow.display_name}'s Trading Report | Prop PNL`
      : 'Prop Trading Report | Prop PNL';

    return {
      ...defaultMetadata,
      title,
      description,
      openGraph: { ...defaultMetadata.openGraph as object, title, description },
      twitter: { ...defaultMetadata.twitter as object, title, description },
    };
  } catch {
    return defaultMetadata;
  }
}

export default async function SharePage({ params }: PageProps) {
  const { token } = await params;

  const report = await getReportBySlugOrToken(supabaseAdmin, token);

  if (!report) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
        <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 text-center max-w-md">
          <h1 className="text-xl font-semibold text-terminal-text mb-2">Report Not Found</h1>
          <p className="text-terminal-muted mb-4">This report doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="inline-block px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg rounded-lg transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if ((report as { status: string }).status !== 'completed') {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
        <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 text-center max-w-md">
          <h1 className="text-xl font-semibold text-terminal-text mb-2">Report Not Ready</h1>
          <p className="text-terminal-muted">This report is still being processed.</p>
        </div>
      </div>
    );
  }

  const reportRow = report as {
    id: string;
    user_id: string;
    report_token: string;
    account_id: string | null;
    created_at: string;
    updated_at: string;
    display_name: string | null;
    share_slug: string | null;
    raw_teller_data?: unknown;
    pnl_data?: PNLReport;
    manual_assignments?: object;
  };
  let pnlData: PNLReport | null = null;
  const manualAssignments = reportRow.manual_assignments || {};

  if (reportRow.raw_teller_data) {
    pnlData = calculatePNLReport(reportRow.raw_teller_data, manualAssignments);
  } else if (reportRow.pnl_data) {
    pnlData = reportRow.pnl_data;
    if (pnlData && pnlData.transactions) {
      pnlData.transactions = pnlData.transactions.map((txn: any) => {
        if (!txn.match) {
          return { ...txn, match: { type: 'unmatched' as const, firmName: null, confidence: 'low' as const } };
        }
        return txn;
      });
    }
  }

  if (!pnlData) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
        <div className="bg-terminal-card rounded-2xl border border-terminal-border p-8 text-center max-w-md">
          <h1 className="text-xl font-semibold text-terminal-text mb-2">Report Error</h1>
          <p className="text-terminal-muted">This report could not be processed.</p>
        </div>
      </div>
    );
  }

  return (
    <ReportContent
      report={{
        id: reportRow.id,
        user_id: reportRow.user_id,
        report_token: reportRow.report_token,
        account_id: reportRow.account_id,
        created_at: reportRow.created_at,
        updated_at: reportRow.updated_at,
        display_name: reportRow.display_name || null,
        share_slug: reportRow.share_slug || null,
      }}
      pnlData={pnlData}
      isPublicView
    />
  );
}
