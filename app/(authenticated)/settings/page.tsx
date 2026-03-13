'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toasts/use-toast';

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

        // Fetch public/sharing preferences
        const publicResponse = await fetch('/api/pnl/public-toggle');
        if (publicResponse.ok) {
          const pubData = await publicResponse.json();
          setReportId(pubData.reportId ?? null);
          setIsPublic(pubData.isPublic ?? false);
          setShareSlug(pubData.shareSlug ?? null);
          setDisplayName(pubData.displayName ?? '');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
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
        // Remove account from list
        setAccounts(accounts.filter(acc => acc.account_id !== accountId));
      } else {
        throw new Error(data.error || 'Failed to delete account');
      }
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete account',
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
        // Redirect to home (user will be signed out)
        setTimeout(() => {
          router.push('/');
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(data.error || 'Failed to delete account');
      }
    } catch (error: any) {
      console.error('Error deleting user account:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete account',
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

        {/* Account Information Section */}
        <div className="bg-terminal-card rounded-xl border border-terminal-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-profit-dim rounded-lg flex items-center justify-center">
              <span className="text-profit text-lg">👤</span>
            </div>
            <h2 className="text-xl font-semibold text-terminal-text">Account Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-terminal-text flex items-center gap-2 mb-1">
                <span>✉️</span>
                Email
              </label>
              <p className="text-terminal-text">{user.email}</p>
            </div>

            {user.user_metadata?.name && (
              <div>
                <label className="text-sm font-medium text-terminal-text flex items-center gap-2 mb-1">
                  <span>👤</span>
                  Name
                </label>
                <p className="text-terminal-text">{user.user_metadata.name}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-terminal-text flex items-center gap-2 mb-1">
                <span>📅</span>
                Member Since
              </label>
              <p className="text-terminal-text">
                {formatDate(user.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Sharing & Visibility */}
        {reportToken && (
          <div className="bg-terminal-card rounded-xl border border-terminal-border p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-profit-dim rounded-lg flex items-center justify-center">
                <span className="text-profit text-lg">&#x1F517;</span>
              </div>
              <h2 className="text-xl font-semibold text-terminal-text">Sharing & Visibility</h2>
            </div>

            <div className="space-y-5">
              {/* Public toggle */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-terminal-text mb-1">Public report link</p>
                  <p className="text-xs text-terminal-muted">
                    Allow anyone with your link to view your trading report.
                  </p>
                </div>
                <button
                  onClick={handleTogglePublic}
                  disabled={togglingPublic}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                    isPublic ? 'bg-profit' : 'bg-terminal-border'
                  } ${togglingPublic ? 'opacity-50' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Share URL (only when public) */}
              {isPublic && (
                <div>
                  <label className="text-sm font-medium text-terminal-text flex items-center gap-2 mb-2">
                    Your share link
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-terminal-border bg-terminal-bg">
                      <span className="text-terminal-muted shrink-0">&#x1F517;</span>
                      <input
                        type="text"
                        readOnly
                        value={typeof window !== 'undefined'
                          ? `${window.location.origin}/share/${shareSlug || reportToken}`
                          : ''
                        }
                        className="flex-1 min-w-0 bg-transparent text-sm font-mono text-terminal-text outline-none"
                      />
                    </div>
                    <button
                      onClick={handleCopyShareLink}
                      className="px-3 py-2 text-xs font-mono font-medium rounded-lg bg-profit text-terminal-bg hover:bg-profit/90 transition-colors shrink-0"
                    >
                      {copiedShareLink ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Display name */}
              <div>
                <label className="text-sm font-medium text-terminal-text flex items-center gap-2 mb-1">
                  Display name
                </label>
                <p className="text-xs text-terminal-muted mb-2">
                  Shown on your public report and leaderboard. Leave blank to stay anonymous.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. TraderMike"
                    className="flex-1 px-3 py-2 text-sm font-mono bg-terminal-bg border border-terminal-border rounded-lg text-terminal-text placeholder:text-terminal-muted focus:outline-none focus:border-profit"
                  />
                  <button
                    onClick={handleSaveDisplayName}
                    disabled={savingDisplayName}
                    className="px-3 py-2 text-xs font-mono font-medium rounded-lg border border-terminal-border text-terminal-text hover:bg-terminal-border/20 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {savingDisplayName ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connected Accounts Section */}
        <div className="bg-terminal-card rounded-xl border border-terminal-border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-profit-dim rounded-lg flex items-center justify-center">
                <span className="text-profit text-lg">🏦</span>
              </div>
              <h2 className="text-xl font-semibold text-terminal-text">Connected Bank Accounts</h2>
            </div>
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg font-medium rounded-lg text-sm transition-colors"
            >
              <span>➕</span>
              Add Account
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-profit text-xl">⏳</span>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl text-terminal-muted block mx-auto mb-4">🏦</span>
              <p className="text-terminal-muted mb-4">No bank accounts connected</p>
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg font-medium rounded-lg transition-colors"
              >
                <span>➕</span>
                Connect Your First Account
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="border border-terminal-border rounded-lg p-4 hover:border-terminal-border transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-terminal-text">
                          {account.account_name || 'Bank Account'}
                        </h3>
                        {account.account_type && (
                          <span className="px-2 py-1 text-xs font-medium text-terminal-muted bg-terminal-card-hover rounded">
                            {account.account_type}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-terminal-muted">
                        <p className="flex items-center gap-2">
                          <span>📅</span>
                          Last synced: {formatDate(account.last_synced_at)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDeleteAccountConfirm(account.account_id)}
                      disabled={deletingAccountId === account.account_id}
                      className="ml-4 p-2 text-loss hover:bg-loss-dim rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Delete account"
                    >
                      {deletingAccountId === account.account_id ? (
                        <span>⏳</span>
                      ) : (
                        <span className="text-lg">🗑️</span>
                      )}
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteAccountConfirm === account.account_id && (
                    <div className="mt-4 p-4 bg-loss-dim border border-loss/30 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-loss flex-shrink-0 mt-0.5">⚠️</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-loss mb-1">Delete Account?</h4>
                          <p className="text-sm text-loss/80">
                            This will permanently delete this bank account and all associated PNL reports.
                            This action cannot be undone.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteAccount(account.account_id)}
                          className="px-4 py-2 bg-loss hover:bg-loss/90 text-terminal-bg font-medium rounded-lg text-sm transition-colors"
                        >
                          Delete Account
                        </button>
                        <button
                          onClick={() => setShowDeleteAccountConfirm(null)}
                          className="px-4 py-2 bg-terminal-card hover:bg-terminal-card-hover text-terminal-muted hover:text-terminal-text font-medium rounded-lg text-sm border border-terminal-border transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard Section */}
        <div className="bg-terminal-card rounded-xl border border-terminal-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-profit-dim rounded-lg flex items-center justify-center">
              <span className="text-profit text-lg">&#x1F3C6;</span>
            </div>
            <h2 className="text-xl font-semibold text-terminal-text">Leaderboard</h2>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-terminal-text mb-1">Show on public leaderboard</p>
              <p className="text-xs text-terminal-muted">
                Opt in to display your bank-verified P&L on the{' '}
                <Link href="/leaderboard" className="text-profit hover:text-profit/80 underline">
                  public leaderboard
                </Link>
                . Only your display name, net P&L, ROI, and firm names are shown.
              </p>
            </div>
            <button
              onClick={handleToggleLeaderboard}
              disabled={togglingLeaderboard}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                showOnLeaderboard ? 'bg-profit' : 'bg-terminal-border'
              } ${togglingLeaderboard ? 'opacity-50' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showOnLeaderboard ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-terminal-card rounded-xl border border-loss/30 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-loss-dim rounded-lg flex items-center justify-center">
              <span className="text-loss">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-loss">Danger Zone</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-terminal-text mb-2">Delete Account</h3>
              <p className="text-sm text-terminal-muted mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>

              {!showDeleteUserConfirm ? (
                <button
                  onClick={() => setShowDeleteUserConfirm(true)}
                  className="px-4 py-2 bg-loss hover:bg-loss/90 text-terminal-bg font-medium rounded-lg text-sm transition-colors"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-loss-dim border border-loss/30 rounded-lg">
                    <p className="text-sm text-loss mb-3">
                      <strong>Warning:</strong> This will permanently delete:
                    </p>
                    <ul className="text-sm text-loss/80 space-y-1 list-disc list-inside mb-3">
                      <li>Your user account</li>
                      <li>All connected bank accounts</li>
                      <li>All PNL reports</li>
                      <li>All transaction data</li>
                    </ul>
                    <p className="text-sm text-loss font-medium mb-3">
                      Type <strong>DELETE</strong> to confirm:
                    </p>
                    <input
                      type="text"
                      value={deleteUserConfirmation}
                      onChange={(e) => setDeleteUserConfirmation(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border text-terminal-text rounded-lg focus:outline-none focus:ring-2 focus:ring-loss/30 mb-3"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDeleteUserAccount}
                        disabled={deleteUserConfirmation !== 'DELETE' || deletingUser}
                        className="px-4 py-2 bg-loss hover:bg-loss/90 text-terminal-bg font-medium rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingUser ? (
                          <span className="flex items-center gap-2">
                            <span>⏳</span>
                            Deleting...
                          </span>
                        ) : (
                          'Confirm Delete Account'
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteUserConfirm(false);
                          setDeleteUserConfirmation('');
                        }}
                        disabled={deletingUser}
                        className="px-4 py-2 bg-terminal-card hover:bg-terminal-card-hover text-terminal-muted hover:text-terminal-text font-medium rounded-lg text-sm border border-terminal-border transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
