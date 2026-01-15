'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/Toasts/use-toast';
import Link from 'next/link';
import { Plus, Check, TrendingUp, Wallet, Loader2 } from 'lucide-react';
import { PricingModal } from '@/components/ui/Pricing';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useTellerConnect } from 'teller-connect-react';

interface HomePageClientProps {
  initialReports: any[];
  initialConnectedAccounts: any[];
}

export default function HomePageClient({ 
  initialReports,
  initialConnectedAccounts
}: HomePageClientProps) {
  const { user } = useAuth();
  const [reports, setReports] = useState(initialReports);
  const [connectedAccounts, setConnectedAccounts] = useState(initialConnectedAccounts);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [tellerConfig, setTellerConfig] = useState<{ applicationId: string; environment: string } | null>(null);
  const { toast } = useToast();

  // Load Teller config on mount
  useEffect(() => {
    async function fetchTellerConfig() {
      try {
        const response = await fetch('/api/teller/init-connect');
        if (response.ok) {
          const data = await response.json();
          setTellerConfig({
            applicationId: data.applicationId,
            environment: data.environment,
          });
        }
      } catch (err) {
        console.error('Failed to load Teller configuration:', err);
      }
    }
    fetchTellerConfig();
  }, []);

  // Handle Teller Connect success
  const onTellerSuccess = useCallback(async (enrollment: any) => {
    if (!user) return;

    setConnecting(true);
    try {
      const response = await fetch('/api/pnl/fetch-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: enrollment.accessToken,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: 'Success!',
          description: 'Bank account connected and PNL report generated.',
        });
        // Refresh the page to show new reports
        window.location.reload();
      } else {
        throw new Error(data.error || 'Failed to fetch PNL data');
      }
    } catch (error: any) {
      console.error('Error fetching PNL data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process bank account data',
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
    }
  }, [user, toast]);

  // Teller Connect hook
  const { open, ready } = useTellerConnect({
    applicationId: tellerConfig?.applicationId || '',
    environment: (tellerConfig?.environment || 'sandbox') as 'sandbox' | 'development' | 'production',
    onSuccess: onTellerSuccess,
    onExit: () => {
      setConnecting(false);
    },
    selectAccount: 'multiple', // Allow selecting multiple accounts
    products: ['transactions', 'balance'], // Request transactions and balance
  });

  async function connectBankAccount() {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!tellerConfig) {
      toast({
        title: 'Error',
        description: 'Teller configuration not loaded. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (!ready) {
      toast({
        title: 'Loading',
        description: 'Teller Connect is initializing...',
      });
      return;
    }

    setConnecting(true);
    open();
  }

  const hasReports = reports.length > 0;
  const hasAccounts = connectedAccounts.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prop Firm PNL Tracker
          </h1>
          <p className="text-gray-600">
            Track your prop firm payouts and fees automatically. See your real profit and loss broken down by month.
          </p>
        </div>

        {/* Connect Bank Account Section */}
        {!hasAccounts && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                1 Click. Bank Verified Stats!!!
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your bank account to automatically track all prop firm payouts and fees. Get instant, accurate PNL reports.
              </p>
              <button
                onClick={connectBankAccount}
                disabled={connecting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Connect Bank Account
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Connected Accounts */}
        {hasAccounts && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Connected Accounts</h2>
              <button
                onClick={connectBankAccount}
                disabled={connecting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Account
              </button>
            </div>
            <div className="grid gap-4">
              {connectedAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">{account.account_name || 'Bank Account'}</div>
                    <div className="text-sm text-gray-500">
                      {account.account_type} • Last synced: {account.last_synced_at 
                        ? new Date(account.last_synced_at).toLocaleDateString()
                        : 'Never'}
                    </div>
                  </div>
                  <Link
                    href={`/report/${account.account_id}`}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    View Report →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PNL Reports */}
        {hasReports && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">PNL Reports</h2>
            <div className="grid gap-4">
              {reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/report/${report.report_token}`}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-semibold text-gray-900">PNL Report</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          report.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-700'
                            : report.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(report.created_at).toLocaleDateString()}
                      </div>
                      {report.pnl_data && (
                        <div className="mt-4 flex gap-6 text-sm">
                          {report.pnl_data.totalPNL !== undefined && (
                            <div>
                              <div className="text-gray-500">Total PNL</div>
                              <div className={`font-semibold ${
                                report.pnl_data.totalPNL >= 0 ? 'text-emerald-600' : 'text-red-600'
                              }`}>
                                ${report.pnl_data.totalPNL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-emerald-600 font-medium">
                      View →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State with Features */}
        {!hasReports && !hasAccounts && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What you get</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Automatic Tracking</h3>
                <p className="text-sm text-gray-600">
                  Automatically track all prop firm payouts and fees from your bank account.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Monthly Breakdown</h3>
                <p className="text-sm text-gray-600">
                  See your PNL broken down by month and by prop firm.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                  <Wallet className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Bank Verified</h3>
                <p className="text-sm text-gray-600">
                  All data is verified directly from your bank account.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
        onAuthSuccess={async () => {
          // User authenticated, refresh page
          window.location.reload();
        }}
      />

      {/* Pricing Modal */}
      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)}
      />
    </div>
  );
}
