import type { Metadata } from 'next';
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

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
