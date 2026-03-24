import Link from 'next/link';
import { Metadata } from 'next';
import { FAQCategorized } from '@/components/FAQ';
import { faqCategories } from '@/lib/faq-data';

export const metadata: Metadata = {
  title: 'FAQ | Prop Firm P&L Tracker — Pricing, Security, How It Works',
  description:
    'Answers to the most common questions about Prop PNL. Learn how bank-verified P&L tracking works, what firms we support, pricing, security, and more.',
  openGraph: {
    title: 'Frequently Asked Questions — Prop PNL',
    description:
      'Everything you need to know about tracking your prop firm P&L with bank-verified data.',
  },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,230,118,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-profit/20 bg-profit/5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
            <span className="text-xs font-mono text-profit/80 tracking-wide">ANSWERS</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-terminal-text mb-6 leading-[1.1] tracking-tight">
            Frequently asked
            <span className="block text-profit">questions</span>
          </h1>
          <p className="text-lg text-terminal-muted max-w-xl mx-auto leading-relaxed">
            Everything you need to know about tracking your prop firm P&L with bank-verified data.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQCategorized categories={faqCategories} />
        </div>
      </section>

      <section className="py-20 border-t border-profit/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-terminal-text mb-4">
            Still have questions?
          </h2>
          <p className="text-terminal-muted mb-8 max-w-md mx-auto">
            The fastest way to see if Prop PNL is right for you is to try it. Your first report is free.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Get Your Real P&L — Free
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
