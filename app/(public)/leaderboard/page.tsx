import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prop Firm P&L Leaderboard — Coming Soon | Prop PNL',
  description:
    'The first bank-verified prop firm leaderboard. Real traders ranked by real bank data — no screenshots, no self-reported numbers. Join the waitlist.',
  openGraph: {
    title: 'Prop Firm P&L Leaderboard — Coming Soon | Prop PNL',
    description:
      'Bank-verified prop firm rankings are coming. Real P&L, real traders, real bank data.',
  },
};

const mockLeaderboard = [
  { rank: 1, trader: 'Trader_4821', pnl: '$48,215', firms: 4, months: 18 },
  { rank: 2, trader: 'Trader_7390', pnl: '$31,842', firms: 3, months: 12 },
  { rank: 3, trader: 'Trader_1156', pnl: '$24,607', firms: 5, months: 24 },
  { rank: 4, trader: 'Trader_9284', pnl: '$19,330', firms: 2, months: 9 },
  { rank: 5, trader: 'Trader_5037', pnl: '$12,455', firms: 3, months: 6 },
];

const features = [
  {
    emoji: '🛡️',
    title: 'Bank-verified rankings',
    description:
      'Every number on the leaderboard comes from real bank data. No self-reported figures, no screenshots — just verified payouts and fees.',
  },
  {
    emoji: '👁️',
    title: 'Opt-in privacy',
    description:
      'You choose what to share. Stay anonymous as "Trader_XXXX," use a display name, or link to your public report. Full control.',
  },
  {
    emoji: '⏱️',
    title: 'Time filters',
    description:
      'Rankings by all time, last 12 months, or last 3 months. See who\'s performing now — not just who started earliest.',
  },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Hero */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Coming Soon badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-profit/10 border border-profit/30 rounded-full mb-8">
              <span className="text-lg">🏆</span>
              <span className="text-sm font-mono text-profit font-medium">Coming Soon</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-terminal-text mb-6 leading-[1.1] tracking-tight">
              The first{' '}
              <span className="text-profit">bank-verified</span>{' '}
              prop firm leaderboard.
            </h1>
            <p className="text-lg text-terminal-muted max-w-2xl mx-auto mb-12">
              Real traders. Real bank data. Real rankings. No screenshots. No self-reported numbers.
            </p>
          </div>
        </div>
      </section>

      {/* Mock Leaderboard Table */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-terminal-card rounded-lg border border-terminal-border overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-terminal-border bg-terminal-bg/50 text-xs font-mono text-terminal-muted uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Trader</div>
              <div className="col-span-3 text-right">Net P&L</div>
              <div className="col-span-2 text-center">Firms</div>
              <div className="col-span-2 text-center">Months</div>
            </div>

            {/* Mock rows with blur overlay */}
            <div className="relative">
              {mockLeaderboard.map((row) => (
                <div
                  key={row.rank}
                  className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-terminal-border last:border-b-0 items-center"
                >
                  <div className="col-span-1">
                    {row.rank <= 3 ? (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        row.rank === 1
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : row.rank === 2
                          ? 'bg-gray-400/20 text-gray-300'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {row.rank}
                      </div>
                    ) : (
                      <span className="text-terminal-muted font-mono text-sm pl-2">{row.rank}</span>
                    )}
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="font-mono text-terminal-text text-sm">{row.trader}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-profit/10 border border-profit/20 rounded text-[10px] font-mono text-profit">
                      <span>✅</span>
                      Verified
                    </span>
                  </div>
                  <div className="col-span-3 text-right font-mono text-profit font-semibold text-sm">
                    {row.pnl}
                  </div>
                  <div className="col-span-2 text-center font-mono text-terminal-muted text-sm">
                    {row.firms}
                  </div>
                  <div className="col-span-2 text-center font-mono text-terminal-muted text-sm">
                    {row.months}
                  </div>
                </div>
              ))}

              {/* Blur overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-terminal-card/60 to-terminal-card flex items-end justify-center pb-8">
                <div className="flex items-center gap-2 text-terminal-muted">
                  <span>🔒</span>
                  <span className="font-mono text-sm">Rankings launch soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time filter pills (inactive preview) */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {['All Time', '12 Months', '3 Months'].map((filter) => (
              <span
                key={filter}
                className={`px-4 py-1.5 rounded-full text-xs font-mono border ${
                  filter === 'All Time'
                    ? 'bg-profit/10 border-profit/30 text-profit'
                    : 'bg-terminal-card border-terminal-border text-terminal-muted'
                }`}
              >
                {filter}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-terminal-card border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-12 text-center">
            What&apos;s coming
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="bg-terminal-bg rounded-lg border border-terminal-border p-8 text-center">
                <span className="text-4xl block mb-4">{feature.emoji}</span>
                <h3 className="text-lg font-semibold text-terminal-text mb-3">{feature.title}</h3>
                <p className="text-terminal-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-5xl block mb-6">✉️</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-4">
            Get notified when the leaderboard launches
          </h2>
          <p className="text-terminal-muted mb-8">
            We&apos;ll email you once. No spam.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 bg-terminal-card border border-terminal-border rounded-lg text-terminal-text font-mono text-sm placeholder:text-terminal-muted/50 focus:outline-none focus:border-profit/50"
              disabled
            />
            <button
              className="px-6 py-3 bg-profit/20 text-profit border border-profit/30 rounded-lg font-mono text-sm font-medium cursor-not-allowed"
              disabled
            >
              Notify Me
            </button>
          </div>
          <p className="text-xs text-terminal-muted mt-3 font-mono">
            Waitlist coming soon
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-terminal-card border-t border-profit/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-5xl block mb-6">👑</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-4">
            While you wait, get your real P&L
          </h2>
          <p className="text-terminal-muted mb-8">
            Connect your bank and see your true prop firm profit and loss — the same bank-verified data that will power the leaderboard.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank — Free
            <span>→</span>
          </Link>
          <p className="text-xs text-terminal-muted font-mono mt-4">
            No card required · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
