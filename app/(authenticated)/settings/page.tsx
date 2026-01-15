'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toasts/use-toast';
import { 
  Settings, 
  User, 
  Mail, 
  Wallet, 
  Trash2, 
  Plus, 
  ArrowRight, 
  AlertTriangle,
  Calendar,
  FileText,
  Loader2,
  BarChart3
} from 'lucide-react';

interface ConnectedAccount {
  id: string;
  account_id: string;
  account_name: string | null;
  account_type: string | null;
  last_synced_at: string | null;
  created_at: string;
  reports: Array<{
    report_token: string;
    created_at: string;
    updated_at: string;
  }>;
  reportCount: number;
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // Fetch connected accounts and report token
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account and connected bank accounts</p>
            </div>
            {reportToken && (
              <Link
                href={`/report/${reportToken}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex-shrink-0"
              >
                <BarChart3 className="w-4 h-4" />
                Back to Report
              </Link>
            )}
          </div>
        </div>

        {/* Account Information Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>

            {user.user_metadata?.name && (
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <User className="w-4 h-4" />
                  Name
                </label>
                <p className="text-gray-900">{user.user_metadata.name}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" />
                Member Since
              </label>
              <p className="text-gray-900">
                {formatDate(user.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Connected Accounts Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Connected Bank Accounts</h2>
            </div>
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No bank accounts connected</p>
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Connect Your First Account
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {account.account_name || 'Bank Account'}
                        </h3>
                        {account.account_type && (
                          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                            {account.account_type}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {account.reportCount} report{account.reportCount !== 1 ? 's' : ''}
                        </p>
                        {account.reports.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap mt-2">
                            {account.reports.map((report, idx) => (
                              <Link
                                key={report.report_token}
                                href={`/report/${report.report_token}`}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100 transition-colors"
                              >
                                View Report
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            ))}
                          </div>
                        )}
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Last synced: {formatDate(account.last_synced_at)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDeleteAccountConfirm(account.account_id)}
                      disabled={deletingAccountId === account.account_id}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Delete account"
                    >
                      {deletingAccountId === account.account_id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteAccountConfirm === account.account_id && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-900 mb-1">Delete Account?</h4>
                          <p className="text-sm text-red-700">
                            This will permanently delete this bank account and all associated PNL reports. 
                            This action cannot be undone.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteAccount(account.account_id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition-colors"
                        >
                          Delete Account
                        </button>
                        <button
                          onClick={() => setShowDeleteAccountConfirm(null)}
                          className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm border border-gray-300 transition-colors"
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

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Delete Account</h3>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>

              {!showDeleteUserConfirm ? (
                <button
                  onClick={() => setShowDeleteUserConfirm(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition-colors"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-900 mb-3">
                      <strong>Warning:</strong> This will permanently delete:
                    </p>
                    <ul className="text-sm text-red-700 space-y-1 list-disc list-inside mb-3">
                      <li>Your user account</li>
                      <li>All connected bank accounts</li>
                      <li>All PNL reports</li>
                      <li>All transaction data</li>
                    </ul>
                    <p className="text-sm text-red-900 font-medium mb-3">
                      Type <strong>DELETE</strong> to confirm:
                    </p>
                    <input
                      type="text"
                      value={deleteUserConfirmation}
                      onChange={(e) => setDeleteUserConfirmation(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDeleteUserAccount}
                        disabled={deleteUserConfirmation !== 'DELETE' || deletingUser}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingUser ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
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
                        className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm border border-gray-300 transition-colors disabled:opacity-50"
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
