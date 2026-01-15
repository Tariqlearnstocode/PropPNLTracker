import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { ArrowRight, TrendingUp, Check, Wallet, BarChart3, Shield, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-50 pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Track Your Prop Firm PNL
              <span className="block text-emerald-600 mt-2">Automatically</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect your bank account and get instant, bank-verified PNL reports. 
              See your profit and loss broken down by month and by prop firm.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg text-lg border-2 border-gray-200 transition-colors"
              >
                View Pricing
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required to start
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to track your prop trading PNL
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Automated tracking, detailed breakdowns, and bank-verified data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                1-Click Bank Connection
              </h3>
              <p className="text-gray-600">
                Connect your bank account securely via Teller. Your credentials are never stored - direct API connection.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Automatic Matching
              </h3>
              <p className="text-gray-600">
                Automatically detects prop firm transactions from FTMO, TopStep, and 50+ other firms. No manual categorization needed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Detailed Breakdowns
              </h3>
              <p className="text-gray-600">
                Monthly PNL summaries, per-firm breakdowns, and interactive charts to understand your trading performance.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Multi-Account Support
              </h3>
              <p className="text-gray-600">
                Connect multiple bank accounts and see your combined PNL across all your prop trading activity.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pattern Matching
              </h3>
              <p className="text-gray-600">
                Intelligent pattern detection catches prop-firm transactions even when firm names aren't exact matches.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Bank-Verified Data
              </h3>
              <p className="text-gray-600">
                All data comes directly from your bank. No manual entry, no spreadsheets - just accurate, verified numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Bank</h3>
              <p className="text-gray-600">
                Securely connect your bank account via Teller. No passwords stored, direct API connection.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Automatic Analysis</h3>
              <p className="text-gray-600">
                We automatically identify prop firm transactions, categorize payouts and fees, and calculate your PNL.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">View Your Report</h3>
              <p className="text-gray-600">
                See your complete PNL breakdown by month and by prop firm. Interactive charts and detailed transaction views.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stop tracking manually. Start tracking automatically.
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join prop traders who are already automating their PNL tracking.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
