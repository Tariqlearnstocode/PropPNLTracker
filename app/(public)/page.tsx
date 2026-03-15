import { Metadata } from 'next';
import { getURL } from '@/utils/helpers';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ShareableLinkSection } from '@/components/landing/ShareableLinkSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';

const siteUrl = getURL();

export const metadata: Metadata = {
  title: 'Prop Firm P&L Tracker | Bank-Verified Payouts & Fees | Topstep, FTMO, Rise',
  description:
    'Track your prop firm P&L automatically. Connect your bank and we track payouts and fees from Topstep, FTMO, The5ers, Rise and more. Your true profit and loss in ~60 seconds. No spreadsheets.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Prop Firm P&L Tracker | Bank-Verified Payouts & Fees',
    description:
      'Track prop firm payouts and fees from Topstep, FTMO, Rise and more. Bank-verified P&L in ~60 seconds. No manual entry.',
    url: siteUrl,
    siteName: 'Prop PNL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prop Firm P&L Tracker | Bank-Verified Payouts & Fees',
    description:
      'Track prop firm payouts and fees from Topstep, FTMO, Rise and more. Bank-verified P&L in ~60 seconds. No manual entry.',
    site: '@proppnl',
    creator: '@proppnl',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ShareableLinkSection />
      <SecuritySection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
