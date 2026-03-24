'use client';


interface TransactionsTeaserProps {
  transactionCount: number;
  onGetStarted: () => void;
}

export function TransactionsTeaser({ transactionCount, onGetStarted }: TransactionsTeaserProps) {
  return (
    <div className="relative min-h-[400px]">
      {/* Blurred fake transaction rows */}
      <div className="blur-[6px] select-none pointer-events-none opacity-50">
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 px-4 bg-terminal-card/50 rounded-lg border border-terminal-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-20 h-4 bg-terminal-muted/20 rounded" />
                <div className="w-40 h-4 bg-terminal-muted/15 rounded" />
                <div className="w-24 h-4 bg-terminal-muted/10 rounded" />
              </div>
              <div className={`w-20 h-4 rounded ${i % 3 === 0 ? 'bg-loss/20' : 'bg-profit/20'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6 bg-terminal-card border border-terminal-border rounded-2xl shadow-xl max-w-sm animate-fade-in">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-profit/10 mb-4">
            <span className="text-2xl text-profit">🔒</span>
          </div>
          <h3 className="text-base font-semibold text-terminal-text mb-2">
            {transactionCount > 0
              ? `${transactionCount} transactions tracked`
              : 'Detailed transactions'
            }
          </h3>
          <p className="text-sm text-terminal-muted mb-4 leading-relaxed">
            Every payout, purchase, and firm assignment — tracked automatically. Create your account to see yours.
          </p>
          <button
            onClick={onGetStarted}
            className="w-full py-2.5 px-4 bg-profit hover:bg-profit/90 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Track My Transactions
          </button>
          <p className="text-[11px] text-terminal-muted mt-2 font-mono">
            Snapshot from $39.99
          </p>
        </div>
      </div>
    </div>
  );
}
