import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prop PNL vs Alternatives | Compare Prop Firm P&L Trackers',
  description:
    'Compare Prop PNL to Prop Firm Tracker, spreadsheets, and trading journals. The only P&L tracker that connects to your bank.',
  openGraph: {
    title: 'Prop PNL vs Alternatives | Compare Prop Firm P&L Trackers',
    description:
      'Compare Prop PNL to Prop Firm Tracker, spreadsheets, and trading journals. The only P&L tracker that connects to your bank.',
  },
};

type CellValue = 'check' | 'x' | 'minus' | string;

interface ComparisonRow {
  feature: string;
  propPnl: CellValue;
  propFirmTracker: CellValue;
  spreadsheet: CellValue;
  nothing: CellValue;
}

const rows: ComparisonRow[] = [
  {
    feature: 'Data source',
    propPnl: 'Bank (automatic)',
    propFirmTracker: 'Manual entry',
    spreadsheet: 'Manual entry',
    nothing: 'N/A',
  },
  {
    feature: 'Setup time',
    propPnl: '~60 seconds',
    propFirmTracker: 'Hours',
    spreadsheet: 'Hours',
    nothing: 'N/A',
  },
  {
    feature: 'Missed transactions',
    propPnl: 'Impossible',
    propFirmTracker: 'Common',
    spreadsheet: 'Common',
    nothing: 'All missed',
  },
  {
    feature: 'Multi-firm tracking',
    propPnl: 'check',
    propFirmTracker: 'Manual tagging',
    spreadsheet: 'Manual',
    nothing: 'minus',
  },
  {
    feature: 'Fee tracking',
    propPnl: 'check',
    propFirmTracker: 'Manual logging',
    spreadsheet: 'Manual',
    nothing: 'minus',
  },
  {
    feature: 'Shareable proof',
    propPnl: 'Bank-verified link',
    propFirmTracker: 'Screenshot',
    spreadsheet: 'Screenshot',
    nothing: 'minus',
  },
  {
    feature: 'Tax export',
    propPnl: 'CSV / PDF',
    propFirmTracker: 'PDF',
    spreadsheet: 'Manual',
    nothing: 'minus',
  },
  {
    feature: 'Updates',
    propPnl: 'Weekly (Pro)',
    propFirmTracker: 'Manual refresh',
    spreadsheet: 'Manual',
    nothing: 'x',
  },
  {
    feature: 'Price',
    propPnl: 'Free / $14.99/mo',
    propFirmTracker: '$5/mo',
    spreadsheet: 'Free',
    nothing: 'Free',
  },
];

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (value === 'check') {
    return (
      <span className="inline-flex items-center justify-center text-profit text-lg">
        ✓
      </span>
    );
  }
  if (value === 'x') {
    return (
      <span className="inline-flex items-center justify-center text-terminal-muted text-lg">
        ✕
      </span>
    );
  }
  if (value === 'minus') {
    return (
      <span className="inline-flex items-center justify-center text-terminal-muted text-lg">
        –
      </span>
    );
  }
  return (
    <span className={highlight ? 'text-profit font-medium' : 'text-terminal-muted'}>
      {value}
    </span>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Hero */}
      <section
        className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,230,118,0.06) 0%, rgba(0,230,118,0.02) 30%, #0a0a0f 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-terminal-text mb-5 leading-[1.1] tracking-tight">
            How Prop PNL compares
          </h1>
          <p className="text-lg text-terminal-muted max-w-2xl mx-auto">
            The only prop firm P&L tracker that connects to your bank. Here&apos;s
            how that changes everything.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-12 text-center">
            Feature-by-feature comparison
          </h2>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-terminal-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-terminal-border bg-terminal-card">
                  <th className="text-left text-terminal-muted font-mono font-medium px-6 py-4 w-[200px]">
                    Feature
                  </th>
                  <th className="text-center font-mono font-medium px-6 py-4 text-profit">
                    Prop PNL
                  </th>
                  <th className="text-center text-terminal-muted font-mono font-medium px-6 py-4">
                    Prop Firm Tracker
                  </th>
                  <th className="text-center text-terminal-muted font-mono font-medium px-6 py-4">
                    Spreadsheet
                  </th>
                  <th className="text-center text-terminal-muted font-mono font-medium px-6 py-4">
                    Nothing
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-terminal-border last:border-b-0 ${
                      i % 2 === 0 ? 'bg-terminal-bg' : 'bg-terminal-card/50'
                    }`}
                  >
                    <td className="text-left text-terminal-text font-medium px-6 py-4">
                      {row.feature}
                    </td>
                    <td className="text-center px-6 py-4">
                      <Cell value={row.propPnl} highlight />
                    </td>
                    <td className="text-center px-6 py-4">
                      <Cell value={row.propFirmTracker} />
                    </td>
                    <td className="text-center px-6 py-4">
                      <Cell value={row.spreadsheet} />
                    </td>
                    <td className="text-center px-6 py-4">
                      <Cell value={row.nothing} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card layout */}
          <div className="md:hidden space-y-6">
            {rows.map((row) => (
              <div
                key={row.feature}
                className="bg-terminal-card rounded-lg border border-terminal-border p-5"
              >
                <div className="text-sm font-mono text-terminal-muted mb-3">
                  {row.feature}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-profit/5 border border-profit/20 rounded-md px-3 py-2">
                    <div className="text-[10px] font-mono text-profit mb-1 uppercase tracking-wider">
                      Prop PNL
                    </div>
                    <div className="text-sm">
                      <Cell value={row.propPnl} highlight />
                    </div>
                  </div>
                  <div className="bg-terminal-bg rounded-md px-3 py-2">
                    <div className="text-[10px] font-mono text-terminal-muted mb-1 uppercase tracking-wider">
                      Prop Firm Tracker
                    </div>
                    <div className="text-sm">
                      <Cell value={row.propFirmTracker} />
                    </div>
                  </div>
                  <div className="bg-terminal-bg rounded-md px-3 py-2">
                    <div className="text-[10px] font-mono text-terminal-muted mb-1 uppercase tracking-wider">
                      Spreadsheet
                    </div>
                    <div className="text-sm">
                      <Cell value={row.spreadsheet} />
                    </div>
                  </div>
                  <div className="bg-terminal-bg rounded-md px-3 py-2">
                    <div className="text-[10px] font-mono text-terminal-muted mb-1 uppercase tracking-wider">
                      Nothing
                    </div>
                    <div className="text-sm">
                      <Cell value={row.nothing} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why bank data wins */}
      <section className="py-24 bg-terminal-card border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-4 text-center">
            Why bank data wins
          </h2>
          <p className="text-terminal-muted text-center max-w-2xl mx-auto mb-12">
            Connecting to your bank isn&apos;t just convenient — it&apos;s a
            fundamentally better source of truth.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <span className="text-3xl block mb-4">⚡</span>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">
                Nothing gets missed
              </h3>
              <p className="text-terminal-muted text-sm">
                Every dollar in and out is captured automatically — even fees you
                forgot about, resets you didn&apos;t log, and subscriptions that
                slipped through.
              </p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <span className="text-3xl block mb-4">🛡️</span>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">
                No human error
              </h3>
              <p className="text-terminal-muted text-sm">
                Manual entry means missed resets, forgotten subscriptions, and
                wrong amounts. Bank data is exact — no typos, no guessing, no
                &ldquo;I&apos;ll add it later.&rdquo;
              </p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <span className="text-3xl block mb-4">✓</span>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">
                Proof, not promises
              </h3>
              <p className="text-terminal-muted text-sm">
                A bank-verified P&L link beats any screenshot. Investors,
                followers, and accountability partners can see real numbers — not
                numbers you typed in yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Honest trade-offs */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-4 text-center">
            Honest trade-offs
          </h2>
          <p className="text-terminal-muted text-center max-w-2xl mx-auto mb-12">
            Prop PNL isn&apos;t for everyone. Here&apos;s what we don&apos;t do —
            and why.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
              <span className="text-3xl block mb-4 text-terminal-muted">🚫</span>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">
                We don&apos;t connect to prop firm platforms
              </h3>
              <p className="text-terminal-muted text-sm">
                We connect to your bank instead. Prop firm dashboards show
                trading stats — your bank shows the real money. Payouts that
                actually hit your account, fees that actually left it.
              </p>
            </div>
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
              <span className="text-3xl block mb-4 text-terminal-muted">⚠️</span>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">
                We don&apos;t track individual trades
              </h3>
              <p className="text-terminal-muted text-sm">
                We track business P&L — payouts vs. costs — not trade-by-trade
                journal entries. If you need a trading journal, tools like
                TradesViz are great for that. We solve a different problem.
              </p>
            </div>
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
              <span className="text-3xl block mb-4 text-terminal-muted">🌐</span>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">
                We need a US bank account
              </h3>
              <p className="text-terminal-muted text-sm">
                Teller, our bank connection provider, currently supports US
                banks. We&apos;re working on expanding to more regions — but
                right now, this is a US-only tool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 border-t border-profit/20"
        style={{
          background:
            'linear-gradient(to right, rgba(0,230,118,0.1), rgba(0,230,118,0.05), #0e0e14)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            Ready to see your real numbers?
          </h2>
          <p className="text-xl text-terminal-muted mb-8 max-w-2xl mx-auto">
            Connect your bank and get your P&L in ~60 seconds. No spreadsheets.
            No manual entry. Just the truth.
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
