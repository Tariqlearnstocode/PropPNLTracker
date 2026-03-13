import type { Metadata } from 'next';
import LeaderboardContent from './LeaderboardContent';

export const metadata: Metadata = {
  title: 'Prop Trading Leaderboard | Bank-Verified Rankings | Prop PNL',
  description:
    'See who\'s actually profitable. Bank-verified prop trading leaderboard ranking traders by real P&L across FTMO, Topstep, The5ers, Rise and more.',
  openGraph: {
    title: 'Prop Trading Leaderboard | Bank-Verified Rankings',
    description:
      'Bank-verified prop trading rankings. See real P&L, ROI, and per-firm breakdowns.',
  },
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
