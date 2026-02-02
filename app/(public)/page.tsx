import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, TrendingUp, Check, Wallet, BarChart3, Shield, Zap, Lock, Clock, FileText, Users, Database, LineChart, RefreshCw, Share2, X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Prop Firm P&L Tracker | Bank-Verified Payouts & Fees | Topstep, FTMO, Rise',
  description:
    'Track your prop firm P&L automatically. Connect your bank—we track payouts and fees from Topstep, FTMO, The5ers, Rise and more. Your true profit and loss in ~60 seconds. No spreadsheets.',
  openGraph: {
    title: 'Prop Firm P&L Tracker | Bank-Verified Payouts & Fees',
    description:
      'Track prop firm payouts and fees from Topstep, FTMO, Rise and more. Bank-verified P&L in ~60 seconds. No manual entry.',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Hero — minimal copy, two-column: message left, dashboard right */}
      <section
        className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20"
        style={{ background: 'linear-gradient(to bottom, rgba(0,230,118,0.06) 0%, rgba(0,230,118,0.02) 30%, #0a0a0f 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: headline + CTA only */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-terminal-text mb-5 leading-[1.1] tracking-tight">
                Prop firm P&L—
                <span className="block mt-2 text-profit">bank-verified.</span>
              </h1>
              <p className="text-lg text-terminal-muted max-w-lg mx-auto lg:mx-0 mb-3">
                Connect your bank. We track payouts and fees from Topstep, FTMO, The5ers, Rise and more—your true profit and loss in ~60 seconds.
              </p>
              <p className="text-sm text-terminal-muted/90 max-w-lg mx-auto lg:mx-0 mb-8">
                No spreadsheets. No manual entry. One connection.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
                <Link
                  href="/connect"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors w-full sm:w-auto justify-center"
                >
                  Connect Your Bank – Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-5 py-2.5 font-mono text-xs font-medium text-profit border border-profit/30 hover:bg-profit/10 rounded-lg transition-colors"
                >
                  View Plans
                </Link>
              </div>
              <p className="text-xs text-terminal-muted font-mono">
                No card required · Cancel anytime
              </p>
              {/* Trust + SEO: security + supported firms */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mt-8 text-xs text-terminal-muted font-mono">
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-profit" /> Teller</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-profit" /> Read-only</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-profit" /> Encrypted</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-profit" /> Topstep, FTMO, Rise, Wise</span>
              </div>
            </div>

            {/* Right: dashboard preview = visual break, less wall of text */}
            <div className="rounded-lg border border-profit/20 bg-terminal-card overflow-hidden shadow-xl">
              <div className="bg-terminal-card border-b border-terminal-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-terminal-muted" />
                  <div className="w-1.5 h-1.5 rounded-full bg-terminal-muted" />
                  <div className="w-1.5 h-1.5 rounded-full bg-terminal-muted" />
                </div>
                <div className="text-xs text-terminal-muted font-mono">prop-firm-pnl-tracker.com</div>
              </div>
              <div className="p-6 sm:p-8 bg-terminal-bg">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-terminal-card rounded border border-terminal-border p-4">
                    <div className="text-xl font-semibold text-terminal-text">$12,450</div>
                    <div className="text-xs text-terminal-muted">Total PNL</div>
                  </div>
                  <div className="bg-terminal-card rounded border border-terminal-border p-4">
                    <div className="text-xl font-semibold text-terminal-text">8</div>
                    <div className="text-xs text-terminal-muted">Firms</div>
                  </div>
                  <div className="bg-terminal-card rounded border border-terminal-border p-4">
                    <div className="text-xl font-semibold text-terminal-text">24</div>
                    <div className="text-xs text-terminal-muted">Months</div>
                  </div>
                </div>
                <div className="bg-terminal-card rounded border border-terminal-border p-6 h-48 flex items-center justify-center">
                  <LineChart className="w-16 h-16 text-terminal-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight text-center">
              Spreadsheets lie.
              <span className="block mt-2">Bank accounts don't.</span>
            </h2>
            <p className="text-lg text-terminal-text mb-8 text-center max-w-2xl mx-auto">
              Real money slips through when you guess. Resets, challenge fees, and subscriptions add up—most traders don&apos;t run the numbers until it&apos;s too late.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
                <div className="text-lg font-semibold text-terminal-text mb-2">Too many firms</div>
                <p className="text-terminal-text text-sm">
                  Tracking multiple prop firms in one place is a nightmare.
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
      <section className="py-24 bg-terminal-card border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              One click → Real P&L
            </h2>
            <p className="text-lg text-terminal-muted mb-8">
              Connect your bank. Get the numbers that actually matter—so you can stop guessing and start deciding.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Total payouts</div>
              <p className="text-terminal-text text-sm">Every dollar that hit your account—one place</p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Total fees paid</div>
              <p className="text-terminal-text text-sm">Resets, challenges, subs—so you see true cost</p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Net P&L</div>
              <p className="text-terminal-text text-sm">The number that matters. Bank-verified.</p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Monthly breakdown</div>
              <p className="text-terminal-text text-sm">Spot trends and see when you actually made money</p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Profit per firm</div>
              <p className="text-terminal-text text-sm">Which firms pay off—and which don&apos;t</p>
            </div>
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Zero manual entry</div>
              <p className="text-terminal-text text-sm">Bank-linked. Automatic. No spreadsheets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-4 leading-tight">
              Built for prop traders who want the truth
            </h2>
            <p className="text-lg text-terminal-muted">
              One dashboard. Real bank data. No spreadsheets.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
              <Zap className="w-8 h-8 text-profit mb-4" />
              <h3 className="text-xl font-semibold text-terminal-text mb-3">Auto-categorized</h3>
              <p className="text-terminal-text">
                Payouts vs. fees—we recognize Rise, Wise, Stripe and tag them so you don&apos;t have to.
              </p>
            </div>
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
              <Users className="w-8 h-8 text-accent-blue mb-4" />
              <h3 className="text-xl font-semibold text-terminal-text mb-3">Multi-account</h3>
              <p className="text-terminal-text">
                Up to 5 bank accounts in one view—see your full picture without switching tabs.
              </p>
            </div>
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
              <Share2 className="w-8 h-8 text-accent-purple mb-4" />
              <h3 className="text-xl font-semibold text-terminal-text mb-3">Shareable link</h3>
              <p className="text-terminal-text">
                One link to prove bank-verified P&L. Investors and followers see the real numbers.
              </p>
            </div>
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
              <FileText className="w-8 h-8 text-accent-amber mb-4" />
              <h3 className="text-xl font-semibold text-terminal-text mb-3">Export for taxes</h3>
              <p className="text-terminal-text">
                CSV or PDF in one tap—hand it to your accountant and done.
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
      <section className="py-24 bg-terminal-card border-t border-profit/10">
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
                Our engine automatically identifies payouts from Rise, Wise, and other major prop firms.
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
          <div className="mt-12 text-center">
            <p className="text-terminal-muted mb-4">Takes about 60 seconds. Your next step: connect your bank.</p>
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
            >
              Connect Your Bank – Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Shareable Link Feature */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
                Share your results
                <span className="block mt-2">without screenshots</span>
              </h2>
              <p className="text-lg text-terminal-text mb-8 leading-relaxed">
                Proof beats promises. A public link shows your real payouts, fees, and net P&L—no screenshots, no doubt.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-terminal-text">Build trust publicly</div>
                    <div className="text-terminal-text text-sm">Show followers and investors bank-verified results</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-terminal-text">Coaching & mentorship</div>
                    <div className="text-terminal-text text-sm">Credibility when you need to prove your track record</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-profit mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-terminal-text">Accountability</div>
                    <div className="text-terminal-text text-sm">Share progress with partners—one link, always current</div>
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
      <section className="py-24 bg-terminal-card border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              You stay in control
            </h2>
            <p className="text-lg text-terminal-text leading-relaxed">
              Your credentials never touch our servers. We use Teller (same tech as tax and finance apps)—read-only, so we can&apos;t move money or see your password.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-8 text-center">
              <Lock className="w-8 h-8 text-profit mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-terminal-text mb-2">Read-only</h3>
              <p className="text-terminal-text text-sm">
                We read transactions only. No withdrawals, no transfers, no payments—ever.
              </p>
            </div>

            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-8 text-center">
              <Shield className="w-8 h-8 text-profit mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-terminal-text mb-2">Encrypted</h3>
              <p className="text-terminal-text text-sm">
                Data encrypted at rest and in transit. Same standards banks use.
              </p>
            </div>

            <div className="bg-terminal-bg rounded-lg border border-terminal-border p-8 text-center">
              <Wallet className="w-8 h-8 text-profit mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-terminal-text mb-2">No stored logins</h3>
              <p className="text-terminal-text text-sm">
                We never store your bank login. Connect via Teller; disconnect anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-terminal-bg border-t border-profit/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              Start free. Upgrade when you&apos;re ready.
            </h2>
            <p className="text-lg text-terminal-muted">
              No credit card for the free report. Cancel Pro anytime.
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
                Connect Your Bank – Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-profit/10 rounded-lg border-2 border-profit p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-profit text-terminal-bg px-3 py-1 rounded-full text-xs font-semibold">POPULAR</span>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-terminal-text mb-2">$14.99<span className="text-lg font-normal text-terminal-muted">/mo</span></div>
                <div className="text-sm text-terminal-muted mb-1">or $79/year (save ~$100)</div>
                <div className="text-lg font-semibold text-terminal-text mb-2">Pro</div>
                <div className="text-sm text-terminal-muted">Weekly sync. Always up to date. Cancel anytime.</div>
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
                <div className="text-sm text-terminal-text">One payment. No subscription. Ideal for tax time.</div>
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
      <section className="py-24 bg-terminal-card border-t border-profit/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-12 text-center">
            FAQ
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">Do I need a credit card for the free report?</h3>
              <p className="text-terminal-text">
                No. Connect your bank, get your report. No card required. Add Pro later if you want weekly updates.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">Does this connect to my prop firm accounts?</h3>
              <p className="text-terminal-text">
                No—we connect to your bank. We track real payouts and real fees from your account.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">Is this secure?</h3>
              <p className="text-terminal-text">
                Yes. We use Teller (used by tax and finance apps). Read-only connection—we never see your password or store it. You can disconnect anytime.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-terminal-text mb-2">What firms do you support?</h3>
              <p className="text-terminal-text">
                We support most major prop firms and payout processors—including Rise, Wise, Topstep, FTMO, and The5ers.
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
                Yes. Cancel Pro anytime—no questions asked. Your free report stays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — gradient bookend with navbar */}
      <section
        className="py-24 border-t border-profit/20"
        style={{ background: 'linear-gradient(to right, rgba(0,230,118,0.1), rgba(0,230,118,0.05), #0e0e14)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            Stop guessing. Know your numbers.
            <span className="block mt-2 text-profit">Connect your bank → see your P&L.</span>
          </h2>
          <p className="text-xl text-terminal-text mb-6 max-w-2xl mx-auto">
            Real P&L in ~60 seconds. No credit card. Cancel anytime.
          </p>
          <p className="text-sm text-terminal-muted mb-8 max-w-xl mx-auto font-mono">
            Sign up → connect bank → get your report. That&apos;s it.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank – Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
