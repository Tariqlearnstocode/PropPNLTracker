import { Metadata } from 'next';
import { getFirmsWithAccounts } from '@/lib/firms.server';
import { CompareClient } from './compare-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Prop Firm Compare: Find the Right Challenge | Prop PNL',
  description:
    'Compare top prop firms side by side. Review pricing, payout rules, drawdown limits, and platform options to choose the best fit for your strategy.',
  openGraph: {
    title: 'Prop Firm Compare | Prop PNL',
    description:
      'Compare top prop firms side by side. Review pricing, drawdown limits, and payout rules.',
  },
};

export default async function ComparePage() {
  const firms = await getFirmsWithAccounts();

  return <CompareClient firms={firms} />;
}
