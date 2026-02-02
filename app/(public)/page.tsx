import Link from 'next/link';
import { ArrowRight, TrendingUp, Check, Wallet, BarChart3, Shield, Zap, Lock, Clock, FileText, Users, Database, LineChart, RefreshCw, Share2, X } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-terminal-bg pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-terminal-text mb-6 leading-[1.1] tracking-tight">
              1-Click Bank-Verified
              <span className="block mt-2">Prop P&L</span>
            </h1>
            <p className="text-xl sm:text-2xl text-terminal-text max-w-2xl mx-auto mb-4 leading-relaxed">
              Stop guessing your profitability. Connect your bank, track every payout and fee, and see your real numbers in seconds.
            </p>
            <p className="text-base text-terminal-muted max-w-2xl mx-auto mb-8">
              We automatically match payouts + fees from Topstep, FTMO, The5ers, Rise, Wise and more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-medium rounded-md text-base transition-colors"
              >
                Connect Your Bank – It's Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-6 py-3 bg-terminal-card hover:bg-terminal-card-hover text-terminal-muted hover:text-terminal-text font-medium rounded-md text-base border border-terminal-border transition-colors"
              >
                See Example Report
              </Link>
            </div>
            <p className="text-sm text-terminal-muted italic">
              No manual entry. No spreadsheets. No BS.
            </p>
            <p className="text-sm text-terminal-muted mt-2">
              Weekly updates on Pro. Cancel anytime.
            </p>
          </div>

          {/* Trust Bar */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 px-4 py-4 bg-terminal-card rounded-lg border border-terminal-border">
              <div className="flex items-center gap-2 text-sm text-terminal-text">
                <Check className="w-4 h-4 text-profit" />
                <span>Bank connected via Teller</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-terminal-text">
                <Check className="w-4 h-4 text-profit" />
                <span>Credentials never stored</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-terminal-text">
                <Check className="w-4 h-4 text-profit" />
                <span>Read-only access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-terminal-text">
                <Check className="w-4 h-4 text-profit" />
                <span>Encrypted & private</span>
              </div>
            </div>
          </div>

          {/* Product Screenshot Area */}
          <div className="mt-12 rounded-lg border border-terminal-border bg-terminal-card overflow-hidden">
            <div className="bg-terminal-card border-b border-terminal-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-terminal-muted"></div>
                <div className="w-2 h-2 rounded-full bg-terminal-muted"></div>
                <div className="w-2 h-2 rounded-full bg-terminal-muted"></div>
              </div>
              <div className="text-sm text-terminal-muted font-mono">prop-firm-pnl-tracker.com</div>
            </div>
            <div className="p-12 bg-terminal-bg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-terminal-card rounded border border-terminal-border p-6">
                  <div className="text-2xl font-semibold text-terminal-text mb-1">$12,450</div>
                  <div className="text-sm text-terminal-muted">Total PNL</div>
                </div>
                <div className="bg-terminal-card rounded border border-terminal-border p-6">
                  <div className="text-2xl font-semibold text-terminal-text mb-1">8</div>
                  <div className="text-sm text-terminal-muted">Prop Firms</div>
                </div>
                <div className="bg-terminal-card rounded border border-terminal-border p-6">
                  <div className="text-2xl font-semibold text-terminal-text mb-1">24</div>
                  <div className="text-sm text-terminal-muted">Months Tracked</div>
                </div>
              </div>
              <div className="bg-terminal-card rounded border border-terminal-border p-8">
                <div className="h-64 bg-terminal-bg rounded border border-terminal-border flex items-center justify-center">
                  <LineChart className="w-20 h-20 text-terminal-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-terminal-bg border-t border-terminal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight text-center">
              Spreadsheets lie.
              <span className="block mt-2">Bank accounts don't.</span>
            </h2>
            <p className="text-lg text-terminal-text mb-8 text-center max-w-2xl mx-auto">
              Most prop traders think they are profitable until they calculate the cost of resets, challenge fees, and platform subscriptions.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
                <div className="text-lg font-semibold text-terminal-text mb-2">Too many firms</div>
                <p className="text-terminal-text text-sm">
                  Tracking FTMO, TopStep, and MyForexFunds in one place is a nightmare.
                </p>
              </div>
              <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
                <div className="text-lg font-semibold text-terminal-text mb-2">Hidden costs</div>
                <p className="text-terminal-text text-sm">
                  Those "small" $50 resets add up to thousands.
                </p>
              </div>
              <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
                <div className="text-lg font-semibold text-terminal-text mb-2">Manual labor</div>
                <p className="text-terminal-text text-sm">
                  You're a trader, not an accountant. Stop wasting hours on Excel.
                </p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <p className="text-xl text-terminal-muted italic">
                "I think I'm profitable… but I'm not really sure."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-terminal-card border-t border-terminal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              One click → Real P&L
            </h2>
            <p className="text-lg text-terminal-text mb-8">
              Connect your bank account and instantly get:
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Total payouts received</div>
              <p className="text-terminal-text text-sm">All prop firm payouts in one place</p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Total prop firm fees paid</div>
              <p className="text-terminal-text text-sm">Every challenge fee and subscription tracked</p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Net profit / loss</div>
              <p className="text-terminal-text text-sm">The real number, bank-verified</p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Monthly breakdown</div>
              <p className="text-terminal-text text-sm">See your performance over time</p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Profit per firm</div>
              <p className="text-terminal-text text-sm">Know which firms are actually profitable</p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Bank verified</div>
              <p className="text-terminal-text text-sm">Fully automated. No manual entry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-terminal-bg border-t border-terminal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              Built for the Professional Prop Trader
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
              <Zap className="w-8 h-8 text-profit mb-4" />
              <h3 className="text-xl font-semibold text-terminal-text mb-3">Automated Matching</h3>
              <p className="text-terminal-text">
                We recognize deposits from Rise, Wise, and Stripe, and categorize them as Payouts vs. Fees automatically.
              </p>
            </div>
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
              <Users className="w-8 h-8 text-accent-blue mb-4" />
              <h3 className="text-xl font-semibold text-terminal-text mb-3">Multi-Account Support</h3>
              <p className="text-terminal-text">
                Aggregate up to 5 different bank accounts into one unified dashboard.
              </p>
            </div>
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
              <Share2 className="w-8 h-8 text-accent-purple mb-4" />
              <h3 className="text-xl font-semibold text-terminal-text mb-3">Shareable Stats</h3>
              <p className="text-terminal-text">
                Generate a public link to prove your bank-verified P&L to investors or your community.
              </p>
            </div>
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
              <FileText className="w-8 h-8 text-accent-amber mb-4" />
              <h3 className="text-xl font-semibold text-terminal-text mb-3">One-Click Export</h3>
              <p className="text-terminal-text">
                Need your data for taxes? Export everything to CSV or PDF in one tap.
              </p>
            </div>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-terminal-text">
              <Check className="w-5 h-5 text-profit" />
              <span>Monthly P&L breakdown</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-terminal-text">
              <Check className="w-5 h-5 text-profit" />
              <span>Per-prop-firm profit breakdown</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-terminal-text">
              <Check className="w-5 h-5 text-profit" />
              <span>Automatic prop firm matching</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-terminal-text">
              <Check className="w-5 h-5 text-profit" />
              <span>Charts + dashboard</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-terminal-text">
              <Check className="w-5 h-5 text-profit" />
              <span>Export CSV/PDF</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-terminal-text">
              <Check className="w-5 h-5 text-profit" />
              <span>Shareable public P&L link</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-terminal-text">
              <Check className="w-5 h-5 text-profit" />
              <span>Transaction search & filters</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-terminal-card border-t border-terminal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 text-center">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              Three steps to the truth
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-profit text-terminal-bg rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-terminal-text mb-3">Connect</h3>
              <p className="text-terminal-text">
                Securely link your bank account via Teller (same tech used by major tax apps).
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-profit text-terminal-bg rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-terminal-text mb-3">Sync</h3>
              <p className="text-terminal-text">
                Our engine automatically identifies payouts from Rise, Wise, and 50+ prop firms.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-profit text-terminal-bg rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-terminal-text mb-3">Analyze</h3>
              <p className="text-terminal-text">
                View your net P&L, monthly breakdowns, and performance by firm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shareable Link Feature */}
      <section className="py-24 bg-terminal-bg border-t border-terminal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
                Share your results
                <span className="block mt-2">without screenshots</span>
              </h2>
              <p className="text-lg text-terminal-text mb-8 leading-relaxed">
                Generate a public P&L link that shows total payouts, total fees, net profit, and monthly breakdown.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-terminal-text">Traders sharing performance online</div>
                    <div className="text-terminal-text text-sm">Prove your bank-verified results to your community</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-terminal-text">Proof for coaching / mentorship</div>
                    <div className="text-terminal-text text-sm">Build credibility with verified P&L data</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-terminal-text">Accountability partners</div>
                    <div className="text-terminal-text text-sm">Share your progress with trusted partners</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
              <div className="mb-6">
                <div className="text-sm text-terminal-muted mb-2">Public Report Link</div>
                <div className="text-sm font-mono text-terminal-text bg-terminal-bg p-3 rounded border border-terminal-border break-all">
                  prop-firm-pnl-tracker.com/report/abc123
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between pb-3 border-b border-terminal-border">
                  <span className="text-sm text-terminal-text">Total Payouts</span>
                  <span className="text-sm font-semibold text-terminal-text">$15,200</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-terminal-border">
                  <span className="text-sm text-terminal-text">Total Fees</span>
                  <span className="text-sm font-semibold text-terminal-text">$2,750</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-terminal-border">
                  <span className="text-sm text-terminal-text">Net Profit</span>
                  <span className="text-lg font-semibold text-profit">$12,450</span>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-profit text-terminal-bg rounded-md text-sm font-medium hover:bg-profit/90 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Copy Share Link
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 bg-terminal-card border-t border-terminal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              Secure. Private. Bank-Level Encryption.
            </h2>
            <p className="text-lg text-terminal-text leading-relaxed">
              We never store your bank credentials. We use read-only API access to visualize your data so you can focus on the charts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-8 text-center">
              <Lock className="w-8 h-8 text-profit mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-terminal-text mb-2">Read-only access</h3>
              <p className="text-terminal-text text-sm">
                We only read your transaction data. No ability to move money or make payments.
              </p>
            </div>

            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-8 text-center">
              <Shield className="w-8 h-8 text-profit mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-terminal-text mb-2">Encrypted data</h3>
              <p className="text-terminal-text text-sm">
                All data is encrypted at rest and in transit following industry best practices.
              </p>
            </div>

            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-8 text-center">
              <Wallet className="w-8 h-8 text-profit mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-terminal-text mb-2">No stored credentials</h3>
              <p className="text-terminal-text text-sm">
                Your bank credentials are never stored. Direct API connection via Teller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-terminal-bg border-t border-terminal-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              Pick how you want to track
            </h2>
            <p className="text-lg text-terminal-text">
              Simple plans. No confusion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Trial */}
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
              <div className="mb-6">
                <div className="text-3xl font-bold text-terminal-text mb-2">$0</div>
                <div className="text-lg font-semibold text-terminal-text mb-2">Free Trial</div>
                <div className="text-sm text-terminal-text">Full report. No updates.</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-text">1 bank account</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-text">3 months history</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-text">Full dashboard + breakdowns</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-terminal-muted mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-muted">No transaction updates</span>
                </li>
              </ul>
              <Link
                href="/connect"
                className="block w-full text-center px-4 py-2 bg-terminal-bg hover:bg-terminal-card-hover text-terminal-muted hover:text-terminal-text border-2 border-terminal-border rounded-md text-sm font-medium transition-colors"
              >
                Try for Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-profit/10 rounded-lg border-2 border-profit p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-profit text-terminal-bg px-3 py-1 rounded-full text-xs font-semibold">POPULAR</span>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-terminal-text mb-2">$14.99<span className="text-lg font-normal text-terminal-muted">/mo</span></div>
                <div className="text-sm text-terminal-muted mb-1">or $79/year</div>
                <div className="text-lg font-semibold text-terminal-text mb-2">Pro</div>
                <div className="text-sm text-terminal-muted">Auto updates. Full tracking.</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-text">Up to 5 bank accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-text">12 month history</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-text">Weekly transaction updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-text">Always up to date</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg rounded-md text-sm font-medium transition-colors"
              >
                Go Pro
              </Link>
            </div>

            {/* One-Time Pull */}
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
              <div className="mb-6">
                <div className="text-3xl font-bold text-terminal-text mb-2">$19.99</div>
                <div className="text-lg font-semibold text-terminal-text mb-2">One-Time Pull</div>
                <div className="text-sm text-terminal-text">No subscription. Perfect for taxes.</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-text">Up to 5 bank accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-text">12 month history</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-text">Exportable report</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-terminal-text">Single instant snapshot</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center px-4 py-2 bg-profit hover:bg-profit/90 text-terminal-bg rounded-md text-sm font-medium transition-colors"
              >
                Get One-Time Sync
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-terminal-card border-t border-terminal-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-12 text-center">
            FAQ
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">Does this connect to my prop firm accounts?</h3>
              <p className="text-terminal-text">
                No — we connect to your bank. We track real payouts and real fees.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">Is this secure?</h3>
              <p className="text-terminal-text">
                Yes. We use Teller. Your login is never stored. Connection is read-only.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">What firms do you support?</h3>
              <p className="text-terminal-text">
                Most major firms + payout processors including Rise and Wise.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">How often does it update?</h3>
              <p className="text-terminal-text">
                Free Trial = no updates. Pro = updates weekly. One-time pull = snapshot report.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">Can I cancel?</h3>
              <p className="text-terminal-text">
                Yes — cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-terminal-bg border-t border-terminal-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            Stop using spreadsheets.
            <span className="block mt-2">Automate your PNL tracking.</span>
          </h2>
          <p className="text-xl text-terminal-text mb-10 max-w-2xl mx-auto">
            Connect your bank account and start tracking your prop firm PNL automatically. No credit card required to start.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-medium rounded-md text-base transition-colors"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
