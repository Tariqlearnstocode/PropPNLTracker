import Link from 'next/link';

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-terminal-card border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            Three steps to the truth
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-profit text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold text-terminal-text mb-3">Connect</h3>
            <p className="text-terminal-text">
              Securely link your bank account via Teller (same tech used by major tax apps).
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-profit text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold text-terminal-text mb-3">Sync</h3>
            <p className="text-terminal-text">
              Our engine automatically identifies payouts from Rise, Wise, and other major prop firms.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-profit text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold text-terminal-text mb-3">Analyze</h3>
            <p className="text-terminal-text">
              View your net P&L, monthly breakdowns, and performance by firm.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-terminal-muted mb-4">Takes about 60 seconds. Your next step: connect your bank.</p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-profit hover:bg-profit/90 text-white font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
