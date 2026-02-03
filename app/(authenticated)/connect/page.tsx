'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toasts/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTellerConnect } from 'teller-connect-react';
import Link from 'next/link';

function openSignupModal() {
  window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'signup' } }));
}

export default function ConnectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const [tellerConfig, setTellerConfig] = useState<{ applicationId: string; environment: string } | null>(null);
  const hasOpenedModal = useRef(false);

  // Open signup modal once when unauthenticated (no redirect)
  useEffect(() => {
    if (!user && !hasOpenedModal.current) {
      hasOpenedModal.current = true;
      openSignupModal();
    }
  }, [user]);

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

  // Signup gate when not authenticated — same copy/styling as landing final CTA
  if (!user) {
    return (
      <section
        className="min-h-screen flex items-center justify-center py-24 border-t border-profit/20 px-4"
        style={{ background: 'linear-gradient(to right, rgba(0,230,118,0.1), rgba(0,230,118,0.05), #0e0e14)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-profit mb-6 leading-tight whitespace-nowrap">
            Connect your bank → see your P&L.
          </h2>
          <p className="text-xl text-terminal-text mb-6 max-w-2xl mx-auto">
            Real P&L in ~60 seconds. No credit card. Cancel anytime.
          </p>
          <p className="text-sm text-terminal-muted mb-8 max-w-xl mx-auto font-mono">
            Sign up → connect bank → get your report. That&apos;s it.
          </p>
          <button
            onClick={openSignupModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank – Free
            <span>→</span>
          </button>
          <p className="mt-6">
            <Link href="/" className="text-sm font-mono text-terminal-muted hover:text-profit transition-colors">
              Back to home
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-4">
            Connect Your Bank Account
          </h1>
          <p className="text-lg text-terminal-muted max-w-2xl mx-auto">
            Securely connect your bank account to automatically track all prop firm payouts and fees.
            Get instant, accurate PNL reports.
          </p>
        </div>

        {/* Main Connect Card */}
        <div className="bg-terminal-card rounded-xl border border-terminal-border p-8 sm:p-12 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-profit-dim rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👛</span>
            </div>

            <h2 className="text-2xl font-bold text-terminal-text mb-4">
              1 Click. Bank Verified Stats!!!
            </h2>

            <p className="text-terminal-muted mb-8">
              We&apos;ll securely connect to your bank account and automatically analyze all transactions
              to identify prop firm payouts and fees. Your bank credentials are never stored.
            </p>

            <button
              onClick={handleConnectBank}
              disabled={connecting || !ready || !tellerConfig}
              className="inline-flex items-center gap-3 px-8 py-4 bg-profit text-terminal-bg font-semibold rounded-lg hover:bg-profit/90 disabled:opacity-50 disabled:cursor-not-allowed text-lg transition-colors mb-6"
            >
              {connecting ? (
                <>
                  <span>⏳</span>
                  Connecting...
                </>
              ) : (
                <>
                  <span>👛</span>
                  Connect Bank Account
                  <span>→</span>
                </>
              )}
            </button>

            {!ready && tellerConfig && (
              <p className="text-sm text-terminal-muted">Initializing secure connection...</p>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
            <div className="w-12 h-12 bg-profit-dim rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl text-profit">🛡️</span>
            </div>
            <h3 className="font-semibold text-terminal-text mb-2">Secure & Private</h3>
            <p className="text-sm text-terminal-muted">
              Bank credentials are never stored. Direct API connection via Teller.
            </p>
          </div>

          <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
            <div className="w-12 h-12 bg-profit-dim rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl text-profit">📈</span>
            </div>
            <h3 className="font-semibold text-terminal-text mb-2">Automatic Tracking</h3>
            <p className="text-sm text-terminal-muted">
              Automatically detects prop firm transactions from 50+ firms.
            </p>
          </div>

          <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
            <div className="w-12 h-12 bg-profit-dim rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl text-profit">✓</span>
            </div>
            <h3 className="font-semibold text-terminal-text mb-2">Instant Reports</h3>
            <p className="text-sm text-terminal-muted">
              Get your PNL report immediately after connecting.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-terminal-muted">
          <p>
            By connecting your bank account, you agree to our{' '}
            <Link href="/security" className="text-profit hover:text-profit/90 underline">
              security
            </Link>{' '}
            and{' '}
            <Link href="/disclaimers" className="text-profit hover:text-profit/90 underline">
              disclaimers
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
