'use client';

import Link from 'next/link';

interface ConnectedAccount {
  id: string;
  account_id: string;
  account_name: string | null;
  account_type: string | null;
  last_synced_at: string | null;
  created_at: string;
}

interface ConnectedAccountsSectionProps {
  loading: boolean;
  accounts: ConnectedAccount[];
  deletingAccountId: string | null;
  showDeleteAccountConfirm: string | null;
  onShowDeleteConfirm: (accountId: string) => void;
  onCancelDeleteConfirm: () => void;
  onDeleteAccount: (accountId: string) => void;
  formatDate: (dateString: string | null) => string;
}

export function ConnectedAccountsSection({
  loading,
  accounts,
  deletingAccountId,
  showDeleteAccountConfirm,
  onShowDeleteConfirm,
  onCancelDeleteConfirm,
  onDeleteAccount,
  formatDate,
}: ConnectedAccountsSectionProps) {
  return (
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
                  onClick={() => onShowDeleteConfirm(account.account_id)}
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
                      onClick={() => onDeleteAccount(account.account_id)}
                      className="px-4 py-2 bg-loss hover:bg-loss/90 text-terminal-bg font-medium rounded-lg text-sm transition-colors"
                    >
                      Delete Account
                    </button>
                    <button
                      onClick={onCancelDeleteConfirm}
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
  );
}
