import { Metadata } from 'next';
import Script from 'next/script';
import { getURL } from '@/utils/helpers';
import { getFirmsWithAccounts } from '@/lib/firms.server';
import { type FirmWithAccounts } from '@/lib/firms';
import { CompareClient } from './compare-client';

export const dynamic = 'force-dynamic';

const siteUrl = getURL();

export const metadata: Metadata = {
  title: 'Compare Prop Firms Side by Side (March 2026) | Prop PNL',
  description:
    'Compare top prop firms side by side. Review pricing, payout rules, drawdown limits, and platform options to choose the best fit for your strategy.',
  alternates: {
    canonical: `${siteUrl}/compare`,
  },
  openGraph: {
    title: 'Compare Prop Firms Side by Side | Prop PNL',
    description:
      'Compare top prop firms side by side. Review pricing, drawdown limits, and payout rules.',
    url: `${siteUrl}/compare`,
    siteName: 'Prop PNL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Prop Firms Side by Side | Prop PNL',
    description:
      'Compare top prop firms side by side. Review pricing, drawdown limits, and payout rules.',
    site: '@proppnl',
    creator: '@proppnl',
  },
};

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best prop firm for futures trading?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It depends on your trading style. Compare drawdown type (EOD vs trailing), profit targets, consistency rules, and pricing. Use our side-by-side comparison tool to find the best fit.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do prop firm drawdown rules differ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Prop firms use different drawdown models: End-of-Day (EOD) resets daily, Trailing follows your equity high, and Static stays fixed from your starting balance. EOD is generally considered the most forgiving.',
        },
      },
      {
        '@type': 'Question',
        name: 'What should I look for when comparing prop firms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Key factors include: evaluation price, drawdown type and limit, profit target, profit split, minimum trading days, consistency rules, payout frequency, and supported trading platforms.',
        },
      },
    ],
  };
}

function buildComparisonSchema(firms: FirmWithAccounts[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Prop Firm Comparison Tool',
    description:
      'Compare prop firm evaluations side by side — pricing, drawdown rules, profit targets, and payout splits.',
    url: `${siteUrl}/compare`,
    mainEntity: {
      '@type': 'ItemList',
      name: 'Prop Firms Compared',
      numberOfItems: firms.length,
      itemListElement: firms.map((firm, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Organization',
          name: firm.name,
          url: firm.website ?? `${siteUrl}/firms/${firm.slug}`,
          ...(firm.logo_url ? { logo: firm.logo_url } : {}),
        },
      })),
    },
  };
}

export default async function ComparePage() {
  const firms = await getFirmsWithAccounts();

  return (
    <>
      <Script
        id="compare-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
      />
      <Script
        id="compare-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildComparisonSchema(firms)),
        }}
      />
      <CompareClient firms={firms} />
    </>
  );
}
