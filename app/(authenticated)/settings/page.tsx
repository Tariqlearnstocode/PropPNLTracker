'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toasts/use-toast';
import { AccountInfoSection } from './AccountInfoSection';
import { SubscriptionSection } from './SubscriptionSection';
import { SharingVisibilitySection } from './SharingVisibilitySection';
import { ConnectedAccountsSection } from './ConnectedAccountsSection';
import { DangerZoneSection } from './DangerZoneSection';

interface ConnectedAccount {
  id: string;
  account_id: string;
  account_name: string | null;
  account_type: string | null;
  last_synced_at: string | null;
  created_at: string;
}

export default function SettingsPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState<string | null>(null);
  const [showDeleteUserConfirm, setShowDeleteUserConfirm] = useState(false);
  const [deleteUserConfirmation, setDeleteUserConfirmation] = useState('');
  const [deletingUser, setDeletingUser] = useState(false);
  const [reportToken, setReportToken] = useState<string | null>(null);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(false);
  const [togglingLeaderboard, setTogglingLeaderboard] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [togglingPublic, setTogglingPublic] = useState(false);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [savingDisplayName, setSavingDisplayName] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{
    hasSubscription: boolean;
    plan: string;
    status: string | null;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    isLifetime?: boolean;
  } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // Fetch connected accounts, report token, and leaderboard preference
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        // Fetch accounts
        const accountsResponse = await fetch('/api/accounts/list');
        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();
          setAccounts(accountsData.accounts || []);
        } else {
          throw new Error('Failed to fetch accounts');
        }

        // Fetch report token
        const tokenResponse = await fetch('/api/user/report-token');
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          setReportToken(tokenData.reportToken || null);
        }

        // Fetch leaderboard preference
        const leaderboardResponse = await fetch('/api/pnl/leaderboard-toggle');
        if (leaderboardResponse.ok) {
          const lbData = await leaderboardResponse.json();
          setShowOnLeaderboard(lbData.showOnLeaderboard ?? false);
        }

        // Fetch subscription status
        const subResponse = await fetch('/api/stripe/subscription-status');
        if (subResponse.ok) {
          const subData = await subResponse.json();
          setSubscription(subData);
        }

        // Fetch public/sharing preferences
        const publicResponse = await fetch('/api/pnl/public-toggle');
        if (publicResponse.ok) {
          const pubData = await publicResponse.json();
          setReportId(pubData.reportId ?? null);
          setIsPublic(pubData.isPublic ?? false);
          setShareSlug(pubData.shareSlug ?? null);
          setDisplayName(pubData.displayName ?? '');
        }
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to load account data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, toast]);

  const handleToggleLeaderboard = async () => {
    if (togglingLeaderboard) return;
    setTogglingLeaderboard(true);
    const newValue = !showOnLeaderboard;
    try {
      const response = await fetch('/api/pnl/leaderboard-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showOnLeaderboard: newValue }),
      });
      if (response.ok) {
        setShowOnLeaderboard(newValue);
        toast({
          title: newValue ? 'Leaderboard Enabled' : 'Leaderboard Disabled',
          description: newValue
            ? 'Your report will appear on the public leaderboard.'
            : 'Your report has been removed from the leaderboard.',
        });
      } else {
        throw new Error('Failed to update');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update leaderboard preference',
        variant: 'destructive',
      });
    } finally {
      setTogglingLeaderboard(false);
    }
  };

  const handleTogglePublic = async () => {
    if (togglingPublic) return;
    setTogglingPublic(true);
    const newValue = !isPublic;
    try {
      const response = await fetch('/api/pnl/public-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: newValue }),
      });
      if (response.ok) {
        setIsPublic(newValue);
        toast({
          title: newValue ? 'Report is Public' : 'Report is Private',
          description: newValue
            ? 'Your report is now accessible via your share link.'
            : 'Your report is now private.',
        });
      } else {
        throw new Error('Failed to update');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update sharing preference',
        variant: 'destructive',
      });
    } finally {
      setTogglingPublic(false);
    }
  };

  const handleSaveDisplayName = async () => {
    if (savingDisplayName || !reportId) return;
    setSavingDisplayName(true);
    try {
      const response = await fetch('/api/pnl/display-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, displayName: displayName.trim() || null }),
      });
      if (response.ok) {
        toast({ title: 'Display name updated' });
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save display name',
        variant: 'destructive',
      });
    } finally {
      setSavingDisplayName(false);
    }
  };

  const handleCopyShareLink = () => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const url = shareSlug ? `${base}/share/${shareSlug}` : `${base}/share/${reportToken}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2000);
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2000);
    });
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (deletingAccountId) return;

    setDeletingAccountId(accountId);
    try {
      const response = await fetch('/api/accounts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Account deleted successfully',
        });
        setAccounts(accounts.filter(acc => acc.account_id !== accountId));
      } else {
        throw new Error(data.error || 'Failed to delete account');
      }
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete account',
        variant: 'destructive',
      });
    } finally {
      setDeletingAccountId(null);
      setShowDeleteAccountConfirm(null);
    }
  };

  const handleDeleteUserAccount = async () => {
    if (deleteUserConfirmation !== 'DELETE' || deletingUser) return;

    setDeletingUser(true);
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: deleteUserConfirmation }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Account Deleted',
          description: 'Your account has been deleted successfully',
        });
        setTimeout(() => {
          router.push('/');
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(data.error || 'Failed to delete account');
      }
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete account',
        variant: 'destructive',
      });
      setDeletingUser(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <span className="text-4xl block text-profit">⏳</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-terminal-text mb-2">Settings</h1>
              <p className="text-terminal-muted">Manage your account and connected bank accounts</p>
            </div>
            {reportToken && (
              <Link
                href={`/report/${reportToken}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg font-medium rounded-lg transition-colors flex-shrink-0"
              >
                <span>📊</span>
                Back to Report
              </Link>
            )}
          </div>
        </div>

        <AccountInfoSection
          email={user.email}
          name={user.user_metadata?.name}
          createdAt={user.created_at}
          formatDate={formatDate}
        />

        <SubscriptionSection
          subscription={subscription}
          loading={loading}
          formatDate={formatDate}
        />

        {reportToken && (
          <SharingVisibilitySection
            reportToken={reportToken}
            isPublic={isPublic}
            togglingPublic={togglingPublic}
            onTogglePublic={handleTogglePublic}
            shareSlug={shareSlug}
            copiedShareLink={copiedShareLink}
            onCopyShareLink={handleCopyShareLink}
            displayName={displayName}
            onDisplayNameChange={setDisplayName}
            savingDisplayName={savingDisplayName}
            onSaveDisplayName={handleSaveDisplayName}
            showOnLeaderboard={showOnLeaderboard}
            togglingLeaderboard={togglingLeaderboard}
            onToggleLeaderboard={handleToggleLeaderboard}
          />
        )}

        <ConnectedAccountsSection
          loading={loading}
          accounts={accounts}
          deletingAccountId={deletingAccountId}
          showDeleteAccountConfirm={showDeleteAccountConfirm}
          onShowDeleteConfirm={setShowDeleteAccountConfirm}
          onCancelDeleteConfirm={() => setShowDeleteAccountConfirm(null)}
          onDeleteAccount={handleDeleteAccount}
          formatDate={formatDate}
        />

        <DangerZoneSection
          showDeleteUserConfirm={showDeleteUserConfirm}
          onShowDeleteUserConfirm={() => setShowDeleteUserConfirm(true)}
          onCancelDeleteUser={() => {
            setShowDeleteUserConfirm(false);
            setDeleteUserConfirmation('');
          }}
          deleteUserConfirmation={deleteUserConfirmation}
          onDeleteUserConfirmationChange={setDeleteUserConfirmation}
          deletingUser={deletingUser}
          onDeleteUserAccount={handleDeleteUserAccount}
        />
      </div>
    </div>
  );
}
