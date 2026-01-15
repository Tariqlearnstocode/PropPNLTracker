import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { calculatePNLReport } from '@/lib/pnl-calculations';
import type { PNLReport } from '@/lib/pnl-calculations';

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

// Public share view - limited data, no transaction details
export default async function ShareReportPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch PNL report by token (no auth required for public shares)
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
            This shared PNL report could not be found.
          </p>
          <Link 
            href="/"
            className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (report.status !== 'completed' || !report.pnl_data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Report Not Ready</h1>
          <p className="text-gray-600 mb-4">
            This report is still being processed.
          </p>
          <Link 
            href="/"
            className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const pnlData = report.pnl_data;

  // Public view - only show summary data, no transaction details
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PNL Report Summary</h1>
            <p className="text-gray-600">
              Shared PNL report - Summary view only
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
              <div className="text-sm font-medium text-emerald-700 mb-1">Total Deposits</div>
              <div className="text-2xl font-bold text-emerald-900">
                ${pnlData.summary.totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="text-sm font-medium text-red-700 mb-1">Total Fees</div>
              <div className="text-2xl font-bold text-red-900">
                ${pnlData.summary.totalFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className={`rounded-lg p-6 border ${
              pnlData.summary.totalPNL >= 0 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                pnlData.summary.totalPNL >= 0 ? 'text-emerald-700' : 'text-red-700'
              }`}>
                Net PNL
              </div>
              <div className={`text-2xl font-bold ${
                pnlData.summary.totalPNL >= 0 ? 'text-emerald-900' : 'text-red-900'
              }`}>
                ${pnlData.summary.totalPNL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Monthly Summary Table (no transaction details) */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Monthly Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Month</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Deposits</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Fees</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Net PNL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pnlData.monthlyBreakdown.map((month) => (
                    <tr key={month.month} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{month.month}</td>
                      <td className="px-6 py-4 text-sm text-right text-emerald-600">
                        ${month.deposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-red-600">
                        ${month.fees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-4 text-sm text-right font-semibold ${
                        month.netPNL >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        ${month.netPNL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Want to track your own PNL?</h3>
            <p className="text-gray-600 mb-4">
              Create your own account and get detailed transaction views, filters, and more.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
