import { supabaseAdmin } from '@/utils/supabase/admin';
import { getReportBySlugOrToken } from '@/lib/report-resolver';
import { calculatePNLReport } from '@/lib/pnl-calculations';
import type { PNLReport, RawFinancialData } from '@/lib/pnl-calculations';

export function formatDollar(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}$${formatted}`;
}

export function formatROI(totalFees: number, netPNL: number): string {
  if (totalFees === 0) return 'N/A';
  const roi = (netPNL / totalFees) * 100;
  const sign = roi >= 0 ? '+' : '';
  return `${sign}${roi.toFixed(0)}%`;
}

export interface OGReportData {
  netPNL: number;
  isPositive: boolean;
  firmCount: number;
  totalPayouts: number;
  roi: string;
}

export async function fetchReportData(token: string): Promise<OGReportData | null> {
  const report = await getReportBySlugOrToken(supabaseAdmin, token);
  if (!report || (report as unknown as { status: string }).status !== 'completed') {
    return null;
  }

  let pnlData: PNLReport | null = null;
  const manualAssignments = ((report as unknown as { manual_assignments?: Record<string, string> }).manual_assignments || {}) as Record<string, string>;

  if ((report as unknown as { raw_teller_data?: RawFinancialData }).raw_teller_data) {
    pnlData = calculatePNLReport((report as unknown as { raw_teller_data: RawFinancialData }).raw_teller_data, manualAssignments);
  } else if ((report as unknown as { pnl_data?: PNLReport }).pnl_data) {
    pnlData = (report as unknown as { pnl_data: PNLReport }).pnl_data;
  }

  if (!pnlData) {
    return null;
  }

  const { summary, perFirmBreakdown } = pnlData;

  return {
    netPNL: summary.netPNL,
    isPositive: summary.netPNL >= 0,
    firmCount: perFirmBreakdown.length,
    totalPayouts: summary.totalDeposits,
    roi: formatROI(summary.totalFees, summary.netPNL),
  };
}
