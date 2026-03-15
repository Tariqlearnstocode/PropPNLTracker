'use client';

interface DangerZoneSectionProps {
  showDeleteUserConfirm: boolean;
  onShowDeleteUserConfirm: () => void;
  onCancelDeleteUser: () => void;
  deleteUserConfirmation: string;
  onDeleteUserConfirmationChange: (value: string) => void;
  deletingUser: boolean;
  onDeleteUserAccount: () => void;
}

export function DangerZoneSection({
  showDeleteUserConfirm,
  onShowDeleteUserConfirm,
  onCancelDeleteUser,
  deleteUserConfirmation,
  onDeleteUserConfirmationChange,
  deletingUser,
  onDeleteUserAccount,
}: DangerZoneSectionProps) {
  return (
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
              onClick={onShowDeleteUserConfirm}
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
                  onChange={(e) => onDeleteUserConfirmationChange(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border text-terminal-text rounded-lg focus:outline-none focus:ring-2 focus:ring-loss/30 mb-3"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={onDeleteUserAccount}
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
                    onClick={onCancelDeleteUser}
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
  );
}
