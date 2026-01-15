import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import ReportContent from './ReportContent';
import { calculatePNLReport } from '@/lib/pnl-calculations';
import type { PNLReport } from '@/lib/pnl-calculations';

// TypeScript: This file imports PNL calculations and report content components

interface PageProps {
  params: Promise<{ token: string }>;
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
}

export default async function ReportPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch PNL report by token
  const { data: report, error } = await supabase
    .from('pnl_reports')
    .select('*')
    .eq('report_token', token)
    .single();

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-9V5a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Report Not Found</h1>
          <p className="text-gray-600 mb-4">
            This PNL report could not be found.
          </p>
          <Link 
            href="/"
            className="inline-block px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const reportData = report as PNLReportRow;

  // Check if report is completed
  if (reportData.status !== 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Report Not Ready</h1>
          <p className="text-gray-600">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Report Error</h1>
          <p className="text-gray-600">
            This report could not be processed. Please contact support.
          </p>
        </div>
      </div>
    );
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
      }}
      pnlData={pnlData}
    />
  );
}
