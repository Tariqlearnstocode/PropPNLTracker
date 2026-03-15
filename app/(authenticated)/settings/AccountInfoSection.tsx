'use client';

interface AccountInfoSectionProps {
  email: string | undefined;
  name: string | undefined;
  createdAt: string;
  formatDate: (dateString: string | null) => string;
}

export function AccountInfoSection({ email, name, createdAt, formatDate }: AccountInfoSectionProps) {
  return (
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
          <p className="text-terminal-text">{email}</p>
        </div>

        {name && (
          <div>
            <label className="text-sm font-medium text-terminal-text flex items-center gap-2 mb-1">
              <span>👤</span>
              Name
            </label>
            <p className="text-terminal-text">{name}</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-terminal-text flex items-center gap-2 mb-1">
            <span>📅</span>
            Member Since
          </label>
          <p className="text-terminal-text">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
