'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toasts/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTellerConnect } from 'teller-connect-react';
import Link from 'next/link';
import Image from 'next/image';

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
      } catch {
      }
    }
    fetchTellerConfig();
  }, []);

  // Handle Teller Connect success
  const onTellerSuccess = useCallback(async (enrollment: { accessToken: string }) => {
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
          router.push(`/report/${data.accounts[0].report_token}`);
        } else {
          router.push('/');
        }
      } else {
        throw new Error(data.error || 'Failed to fetch PNL data');
      }
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process bank account data',
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
    selectAccount: 'multiple',
    products: ['transactions', 'balance'],
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

  // Signup gate when not authenticated
  if (!user) {
    return (
      <section
        className="min-h-screen flex items-center justify-center py-24 border-t border-profit/20 px-4 bg-gradient-nav"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-profit mb-6 leading-tight whitespace-nowrap">
            Connect your bank → see your P&L.
          </h2>
          <p className="text-xl text-terminal-text mb-6 max-w-2xl mx-auto">
            Real P&L in ~60 seconds. Plans from $14.95/mo. Cancel anytime.
          </p>
          <p className="text-sm text-terminal-muted mb-8 max-w-xl mx-auto font-mono">
            Sign up → connect bank → get your report. That&apos;s it.
          </p>
          <button
            onClick={openSignupModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank
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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-hero"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <Image src="/logo.svg" alt="" width={28} height={28} className="object-contain" />
          <span className="text-lg font-mono font-semibold text-profit tracking-tight">Prop PNL</span>
        </div>

        {/* Main Card */}
        <div className="bg-terminal-card rounded-2xl border border-terminal-border overflow-hidden">
          {/* Header section */}
          <div className="px-6 pt-6 pb-4 border-b border-terminal-border">
            <p className="text-[11px] font-mono text-terminal-muted uppercase tracking-widest mb-1.5">
              Connect Your Bank
            </p>
            <p className="text-lg font-semibold text-terminal-text">
              Prop Firm P&L Tracker
            </p>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-terminal-border flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-terminal-text truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Trader'}
              </p>
              <p className="text-xs text-terminal-muted truncate">{user.email}</p>
            </div>
            <span className="text-[11px] font-mono text-terminal-muted border border-terminal-border rounded-full px-2.5 py-0.5 flex-shrink-0">
              You
            </span>
          </div>

          {/* Tip + CTA */}
          <div className="px-6 py-6">
            <p className="text-sm text-terminal-muted text-center mb-6 leading-relaxed">
              Connect the bank account where your prop firm payouts and fees hit for the most accurate results.
            </p>

            <button
              onClick={handleConnectBank}
              disabled={connecting || !ready || !tellerConfig}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-profit text-terminal-bg font-semibold rounded-xl hover:bg-profit/90 disabled:opacity-50 disabled:cursor-not-allowed text-base transition-colors"
            >
              {connecting ? (
                <>
                  <span>⏳</span>
                  Connecting...
                </>
              ) : (
                <>
                  Connect Your Bank
                  <span>→</span>
                </>
              )}
            </button>

            {!ready && tellerConfig && (
              <p className="text-xs text-terminal-muted text-center mt-3">Initializing secure connection...</p>
            )}
          </div>

          {/* Security footer */}
          <div className="px-6 py-4 border-t border-terminal-border flex items-start gap-3">
            <span className="text-lg flex-shrink-0 mt-0.5">🔒</span>
            <p className="text-xs text-terminal-muted leading-relaxed">
              Secured by Teller with bank-level 256-bit encryption. Read-only access for transaction data only.{' '}
              <Link href="/security" className="text-profit hover:text-profit/80 underline">
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
