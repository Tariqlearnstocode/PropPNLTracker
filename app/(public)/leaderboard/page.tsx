import type { Metadata } from 'next';
import { getURL } from '@/utils/helpers';
import LeaderboardContent from './LeaderboardContent';

const siteUrl = getURL();

export const metadata: Metadata = {
  title: 'Prop Trading Leaderboard | Bank-Verified Rankings',
  description:
    'Bank-verified prop trading leaderboard. See who\'s actually profitable with real P&L rankings across Topstep, FTMO, Apex, Rise. No self-reported data.',
  alternates: {
    canonical: `${siteUrl}/leaderboard`,
  },
  openGraph: {
    title: 'Prop Trading Leaderboard | Bank-Verified Rankings',
    description:
      'Bank-verified prop trading leaderboard. Real P&L, ROI, and per-firm breakdowns across Topstep, FTMO, Apex, Rise. No self-reported data.',
    url: `${siteUrl}/leaderboard`,
    siteName: 'Prop PNL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prop Trading Leaderboard | Bank-Verified Rankings',
    description:
      'Bank-verified prop trading leaderboard. Real P&L, ROI, and per-firm breakdowns across Topstep, FTMO, Apex, Rise. No self-reported data.',
    site: '@proppnl',
    creator: '@proppnl',
  },
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
