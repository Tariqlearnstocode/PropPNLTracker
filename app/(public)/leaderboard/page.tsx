import type { Metadata } from 'next';
import Script from 'next/script';
import { getURL } from '@/utils/helpers';
import LeaderboardContent from './LeaderboardContent';

const siteUrl = getURL();

export const metadata: Metadata = {
  title: 'Prop Trading Leaderboard | Real P&L Rankings',
  description:
    'See which prop traders are actually profitable. Rankings pulled from real bank data — not screenshots, not self-reported numbers.',
  alternates: {
    canonical: `${siteUrl}/leaderboard`,
  },
  openGraph: {
    title: 'Prop Trading Leaderboard | Real P&L Rankings',
    description:
      'See which prop traders are actually profitable. Rankings pulled from real bank data — not screenshots, not self-reported numbers.',
    url: `${siteUrl}/leaderboard`,
    siteName: 'Prop PNL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prop Trading Leaderboard | Real P&L Rankings',
    description:
      'See which prop traders are actually profitable. Rankings pulled from real bank data — not screenshots, not self-reported numbers.',
    site: '@proppnl',
    creator: '@proppnl',
  },
};

function buildLeaderboardSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Prop Trading Leaderboard',
    description:
      'Live rankings of prop traders by verified net P&L, pulled from real bank data.',
    url: `${siteUrl}/leaderboard`,
    mainEntity: {
      '@type': 'Dataset',
      name: 'Prop Trading P&L Rankings',
      description:
        'Bank-verified profit and loss rankings for prop traders across multiple firms. Updated in real time.',
      creator: {
        '@type': 'Organization',
        name: 'Prop PNL',
        url: siteUrl,
      },
      variableMeasured: [
        { '@type': 'PropertyValue', name: 'Net P&L', unitCode: 'USD' },
        { '@type': 'PropertyValue', name: 'Payouts', unitCode: 'USD' },
        { '@type': 'PropertyValue', name: 'Fees', unitCode: 'USD' },
      ],
    },
  };
}

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How are the prop trading rankings calculated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Rankings are based on verified net P&L (payouts minus fees) pulled directly from bank transaction data via Plaid. No screenshots or self-reported numbers.',
        },
      },
      {
        '@type': 'Question',
        name: 'How often is the leaderboard updated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The leaderboard updates in real time as new bank transactions are synced. Users can refresh their data at any time by reconnecting their bank.',
        },
      },
    ],
  };
}

export default function LeaderboardPage() {
  return (
    <>
      <Script
        id="leaderboard-dataset-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildLeaderboardSchema()),
        }}
      />
      <Script
        id="leaderboard-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
      />
      <LeaderboardContent />
    </>
  );
}
