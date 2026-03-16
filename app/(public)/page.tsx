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
  title: { absolute: 'Prop PNL | Prop Firm P&L Tracker' },
  description:
    'Prop firm P&L tracker that pulls real payouts and fees directly from your bank. Works with Topstep, FTMO, Apex, Rise. Set up in 60 seconds.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Prop Firm P&L Tracker | Real Bank Data',
    description:
      'Prop firm P&L tracker that pulls real payouts and fees directly from your bank. Works with Topstep, FTMO, Apex, Rise. Set up in 60 seconds.',
    url: siteUrl,
    siteName: 'Prop PNL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prop Firm P&L Tracker | Real Bank Data',
    description:
      'Prop firm P&L tracker that pulls real payouts and fees directly from your bank. Works with Topstep, FTMO, Apex, Rise. Set up in 60 seconds.',
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
