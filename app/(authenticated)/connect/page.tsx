'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toasts/use-toast';
import { Wallet, Loader2, ArrowRight, Check, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTellerConnect } from 'teller-connect-react';
import Link from 'next/link';

export default function ConnectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const [tellerConfig, setTellerConfig] = useState<{ applicationId: string; environment: string } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

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
        
        // Redirect to the report page (users typically have one report)
        if (data.reportToken) {
          router.push(`/report/${data.reportToken}`);
        } else if (data.accounts && data.accounts.length > 0 && data.accounts[0].report_token) {
          // Fallback: use first account's report token
          router.push(`/report/${data.accounts[0].report_token}`);
        } else {
          // Last resort: reload to show reports
          router.push('/');
        }
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
  }, [user, toast, router]);

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

  async function handleConnectBank() {
    if (!user) {
      router.push('/');
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

  // Show loading state if not authenticated (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Connect Your Bank Account
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Securely connect your bank account to automatically track all prop firm payouts and fees. 
            Get instant, accurate PNL reports.
          </p>
        </div>

        {/* Main Connect Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 sm:p-12 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-emerald-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1 Click. Bank Verified Stats!!!
            </h2>
            
            <p className="text-gray-600 mb-8">
              We'll securely connect to your bank account and automatically analyze all transactions 
              to identify prop firm payouts and fees. Your bank credentials are never stored.
            </p>

            <button
              onClick={handleConnectBank}
              disabled={connecting || !ready || !tellerConfig}
              className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg transition-colors shadow-lg hover:shadow-xl mb-6"
            >
              {connecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Connect Bank Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {!ready && tellerConfig && (
              <p className="text-sm text-gray-500">Initializing secure connection...</p>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-sm text-gray-600">
              Bank credentials are never stored. Direct API connection via Teller.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Automatic Tracking</h3>
            <p className="text-sm text-gray-600">
              Automatically detects prop firm transactions from 50+ firms.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Reports</h3>
            <p className="text-sm text-gray-600">
              Get your PNL report immediately after connecting.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            By connecting your bank account, you agree to our{' '}
            <Link href="/security" className="text-emerald-600 hover:text-emerald-700 underline">
              security
            </Link>{' '}
            and{' '}
            <Link href="/disclaimers" className="text-emerald-600 hover:text-emerald-700 underline">
              disclaimers
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
