import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { ArrowRight, TrendingUp, Check, Wallet, BarChart3, Shield, Zap, Lock, Clock, FileText, Users, Database, LineChart, RefreshCw, Share2, X } from 'lucide-react';

export default async function LandingPage() {
  // Check if user is authenticated - if so, redirect to their report or connect page
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    // User is authenticated - check if they have a report
    const { data: reportsData } = await supabase
      .from('pnl_reports')
      .select('report_token')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (reportsData && reportsData.length > 0 && reportsData[0].report_token) {
      // User has a report - redirect to it
      redirect(`/report/${reportsData[0].report_token}`);
    } else {
      // No report yet - redirect to connect page
      redirect('/connect');
    }
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              1-Click Bank-Verified
              <span className="block mt-2">Prop P&L</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
              Stop guessing your profitability. Connect your bank, track every payout and fee, and see your real numbers in seconds.
            </p>
            <p className="text-base text-gray-500 max-w-2xl mx-auto mb-8">
              We automatically match payouts + fees from Topstep, FTMO, The5ers, Rise, Wise and more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md text-base transition-colors"
              >
                Connect Your Bank – It's Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-md text-base border border-gray-300 transition-colors"
              >
                See Example Report
              </Link>
            </div>
            <p className="text-sm text-gray-500 italic">
              No manual entry. No spreadsheets. No BS.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Weekly updates on Pro. Cancel anytime.
            </p>
          </div>

          {/* Trust Bar */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 px-4 py-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-gray-900" />
                <span>Bank connected via Teller</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-gray-900" />
                <span>Credentials never stored</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-gray-900" />
                <span>Read-only access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-gray-900" />
                <span>Encrypted & private</span>
              </div>
            </div>
          </div>

          {/* Product Screenshot Area */}
          <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shadow-xl">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
              <div className="text-sm text-gray-500 font-mono">prop-firm-pnl-tracker.com</div>
            </div>
            <div className="p-12 bg-gradient-to-br from-gray-50 to-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded border border-gray-200 p-6">
                  <div className="text-2xl font-semibold text-gray-900 mb-1">$12,450</div>
                  <div className="text-sm text-gray-500">Total PNL</div>
                </div>
                <div className="bg-white rounded border border-gray-200 p-6">
                  <div className="text-2xl font-semibold text-gray-900 mb-1">8</div>
                  <div className="text-sm text-gray-500">Prop Firms</div>
                </div>
                <div className="bg-white rounded border border-gray-200 p-6">
                  <div className="text-2xl font-semibold text-gray-900 mb-1">24</div>
                  <div className="text-sm text-gray-500">Months Tracked</div>
                </div>
              </div>
              <div className="bg-white rounded border border-gray-200 p-8">
                <div className="h-64 bg-gray-50 rounded border border-gray-100 flex items-center justify-center">
                  <LineChart className="w-20 h-20 text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight text-center">
              Spreadsheets lie.
              <span className="block mt-2">Bank accounts don't.</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
              Most prop traders think they are profitable until they calculate the cost of resets, challenge fees, and platform subscriptions.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="text-lg font-semibold text-gray-900 mb-2">Too many firms</div>
                <p className="text-gray-600 text-sm">
                  Tracking FTMO, TopStep, and MyForexFunds in one place is a nightmare.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="text-lg font-semibold text-gray-900 mb-2">Hidden costs</div>
                <p className="text-gray-600 text-sm">
                  Those "small" $50 resets add up to thousands.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="text-lg font-semibold text-gray-900 mb-2">Manual labor</div>
                <p className="text-gray-600 text-sm">
                  You're a trader, not an accountant. Stop wasting hours on Excel.
                </p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <p className="text-xl text-gray-500 italic">
                "I think I'm profitable… but I'm not really sure."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              One click → Real P&L
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Connect your bank account and instantly get:
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">Total payouts received</div>
              <p className="text-gray-600 text-sm">All prop firm payouts in one place</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">Total prop firm fees paid</div>
              <p className="text-gray-600 text-sm">Every challenge fee and subscription tracked</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">Net profit / loss</div>
              <p className="text-gray-600 text-sm">The real number, bank-verified</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">Monthly breakdown</div>
              <p className="text-gray-600 text-sm">See your performance over time</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">Profit per firm</div>
              <p className="text-gray-600 text-sm">Know which firms are actually profitable</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-lg font-semibold text-gray-900 mb-2">Bank verified</div>
              <p className="text-gray-600 text-sm">Fully automated. No manual entry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Built for the Professional Prop Trader
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
              <Zap className="w-8 h-8 text-gray-900 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automated Matching</h3>
              <p className="text-gray-600">
                We recognize deposits from Rise, Wise, and Stripe, and categorize them as Payouts vs. Fees automatically.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
              <Users className="w-8 h-8 text-gray-900 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Account Support</h3>
              <p className="text-gray-600">
                Aggregate up to 5 different bank accounts into one unified dashboard.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
              <Share2 className="w-8 h-8 text-gray-900 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Shareable Stats</h3>
              <p className="text-gray-600">
                Generate a public link to prove your bank-verified P&L to investors or your community.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
              <FileText className="w-8 h-8 text-gray-900 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">One-Click Export</h3>
              <p className="text-gray-600">
                Need your data for taxes? Export everything to CSV or PDF in one tap.
              </p>
            </div>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-5 h-5 text-gray-900" />
              <span>Monthly P&L breakdown</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-5 h-5 text-gray-900" />
              <span>Per-prop-firm profit breakdown</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-5 h-5 text-gray-900" />
              <span>Automatic prop firm matching</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-5 h-5 text-gray-900" />
              <span>Charts + dashboard</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-5 h-5 text-gray-900" />
              <span>Export CSV/PDF</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-5 h-5 text-gray-900" />
              <span>Shareable public P&L link</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-5 h-5 text-gray-900" />
              <span>Transaction search & filters</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 text-center">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Three steps to the truth
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect</h3>
              <p className="text-gray-600">
                Securely link your bank account via Teller (same tech used by major tax apps).
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sync</h3>
              <p className="text-gray-600">
                Our engine automatically identifies payouts from Rise, Wise, and 50+ prop firms.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analyze</h3>
              <p className="text-gray-600">
                View your net P&L, monthly breakdowns, and performance by firm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shareable Link Feature */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Share your results
                <span className="block mt-2">without screenshots</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Generate a public P&L link that shows total payouts, total fees, net profit, and monthly breakdown.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Traders sharing performance online</div>
                    <div className="text-gray-600 text-sm">Prove your bank-verified results to your community</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Proof for coaching / mentorship</div>
                    <div className="text-gray-600 text-sm">Build credibility with verified P&L data</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Accountability partners</div>
                    <div className="text-gray-600 text-sm">Share your progress with trusted partners</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Public Report Link</div>
                <div className="text-sm font-mono text-gray-900 bg-white p-3 rounded border border-gray-200 break-all">
                  prop-firm-pnl-tracker.com/report/abc123
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Payouts</span>
                  <span className="text-sm font-semibold text-gray-900">$15,200</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Fees</span>
                  <span className="text-sm font-semibold text-gray-900">$2,750</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Net Profit</span>
                  <span className="text-lg font-semibold text-gray-900">$12,450</span>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Copy Share Link
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Secure. Private. Bank-Level Encryption.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We never store your bank credentials. We use read-only API access to visualize your data so you can focus on the charts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Lock className="w-8 h-8 text-gray-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Read-only access</h3>
              <p className="text-gray-600 text-sm">
                We only read your transaction data. No ability to move money or make payments.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Shield className="w-8 h-8 text-gray-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Encrypted data</h3>
              <p className="text-gray-600 text-sm">
                All data is encrypted at rest and in transit following industry best practices.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Wallet className="w-8 h-8 text-gray-900 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No stored credentials</h3>
              <p className="text-gray-600 text-sm">
                Your bank credentials are never stored. Direct API connection via Teller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Pick how you want to track
            </h2>
            <p className="text-lg text-gray-600">
              Simple plans. No confusion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Trial */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">$0</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">Free Trial</div>
                <div className="text-sm text-gray-600">Full report. No updates.</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">1 bank account</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">3 months history</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Full dashboard + breakdowns</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-500">No transaction updates</span>
                </li>
              </ul>
              <Link
                href="/connect"
                className="block w-full text-center px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 rounded-md text-sm font-medium transition-colors"
              >
                Try for Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gray-900 rounded-lg border-2 border-gray-900 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-semibold">POPULAR</span>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-2">$14.99<span className="text-lg font-normal text-gray-400">/mo</span></div>
                <div className="text-sm text-gray-300 mb-1">or $79/year</div>
                <div className="text-lg font-semibold text-white mb-2">Pro</div>
                <div className="text-sm text-gray-300">Auto updates. Full tracking.</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Up to 5 bank accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">12 month history</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Weekly transaction updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Always up to date</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-md text-sm font-medium transition-colors"
              >
                Go Pro
              </Link>
            </div>

            {/* One-Time Pull */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">$19.99</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">One-Time Pull</div>
                <div className="text-sm text-gray-600">No subscription. Perfect for taxes.</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Up to 5 bank accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">12 month history</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Exportable report</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Single instant snapshot</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md text-sm font-medium transition-colors"
              >
                Get One-Time Sync
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-12 text-center">
            FAQ
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Does this connect to my prop firm accounts?</h3>
              <p className="text-gray-600">
                No — we connect to your bank. We track real payouts and real fees.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is this secure?</h3>
              <p className="text-gray-600">
                Yes. We use Teller. Your login is never stored. Connection is read-only.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What firms do you support?</h3>
              <p className="text-gray-600">
                Most major firms + payout processors including Rise and Wise.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How often does it update?</h3>
              <p className="text-gray-600">
                Free Trial = no updates. Pro = updates weekly. One-time pull = snapshot report.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel?</h3>
              <p className="text-gray-600">
                Yes — cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Stop using spreadsheets.
            <span className="block mt-2">Automate your PNL tracking.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Connect your bank account and start tracking your prop firm PNL automatically. No credit card required to start.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md text-base transition-colors"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
