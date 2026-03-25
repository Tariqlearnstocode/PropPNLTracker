import { Metadata } from 'next';
import Script from 'next/script';
import { getURL } from '@/utils/helpers';
import { homepageFAQs } from '@/lib/faq-data';
import { getFirmsWithAccounts } from '@/lib/firms.server';
import type { FirmWithAccounts } from '@/lib/firms';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ShareableLinkSection } from '@/components/landing/ShareableLinkSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { FirmDirectorySection } from '@/components/landing/FirmDirectorySection';
import { ActiveDealsSection } from '@/components/landing/ActiveDealsSection';
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
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Prop PNL — Prop Firm P&L Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prop Firm P&L Tracker | Real Bank Data',
    description:
      'Prop firm P&L tracker that pulls real payouts and fees directly from your bank. Works with Topstep, FTMO, Apex, Rise. Set up in 60 seconds.',
    site: '@proppnl',
    creator: '@proppnl',
    images: [`${siteUrl}/twitter-image`],
  },
};

function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Prop PNL',
    url: siteUrl,
    description:
      'Prop firm P&L tracker that pulls real payouts and fees directly from your bank.',
    publisher: {
      '@type': 'Organization',
      name: 'Prop PNL',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.svg`,
      },
    },
  };
}

function buildSoftwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Prop PNL',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: siteUrl,
    description:
      'Track your prop firm profit and loss with real bank data. Auto-detects payouts and fees from 47+ prop firms.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Snapshot',
        price: '39.99',
        priceCurrency: 'USD',
        description: 'Single report with up to 5 bank accounts and 12 months of history.',
      },
      {
        '@type': 'Offer',
        name: 'Lifetime',
        price: '97',
        priceCurrency: 'USD',
        description: 'Daily syncs, reconnect anytime, leaderboard eligibility — permanent access.',
      },
    ],
    featureList: [
      'Bank-verified P&L tracking',
      'Auto-detection of 47+ prop firms',
      'Shareable public P&L link',
      'CSV and PDF export',
      'Up to 5 bank accounts',
    ],
  };
}

function buildFirmListSchema(firms: FirmWithAccounts[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Verified Futures Prop Firms',
    description: 'Curated list of vetted futures prop trading firms with pricing, rules, and ratings.',
    numberOfItems: firms.length,
    itemListElement: firms.map((firm, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Organization',
        name: firm.name,
        url: firm.website ?? `${siteUrl}/firms/${firm.slug}`,
        ...(firm.logo_url ? { logo: firm.logo_url } : {}),
        ...(firm.rating
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: firm.rating,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
      },
    })),
  };
}

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homepageFAQs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export default async function LandingPage() {
  const firms = await getFirmsWithAccounts();

  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteSchema()) }}
      />
      <Script
        id="software-app-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareAppSchema()) }}
      />
      <Script
        id="homepage-firms-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFirmListSchema(firms)) }}
      />
      <Script
        id="homepage-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
      />
      <div className="min-h-screen bg-terminal-bg">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ShareableLinkSection />
        <SecuritySection />
        <FirmDirectorySection firms={firms} />
        <ActiveDealsSection firms={firms} />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </div>
    </>
  );
}
