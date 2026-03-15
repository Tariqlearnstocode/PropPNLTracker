import type { Metadata } from 'next';
import { getURL } from '@/utils/helpers';
import LeaderboardContent from './LeaderboardContent';

const siteUrl = getURL();

export const metadata: Metadata = {
  title: 'Prop Trading Leaderboard | Bank-Verified Rankings',
  description:
    'See who\'s actually profitable. Bank-verified prop trading leaderboard ranking traders by real P&L across FTMO, Topstep, The5ers, Rise and more.',
  alternates: {
    canonical: `${siteUrl}/leaderboard`,
  },
  openGraph: {
    title: 'Prop Trading Leaderboard | Bank-Verified Rankings',
    description:
      'Bank-verified prop trading rankings. See real P&L, ROI, and per-firm breakdowns across FTMO, Topstep, The5ers, Rise and more.',
    url: `${siteUrl}/leaderboard`,
    siteName: 'Prop PNL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prop Trading Leaderboard | Bank-Verified Rankings',
    description:
      'Bank-verified prop trading rankings. See real P&L, ROI, and per-firm breakdowns.',
    site: '@proppnl',
    creator: '@proppnl',
  },
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
