import { Metadata } from 'next';
import { getURL } from '@/utils/helpers';
import PitchDeck from './PitchDeck';

const siteUrl = getURL();

export const metadata: Metadata = {
  title: { absolute: 'Partner With Prop PNL | Trading Data API' },
  description:
    'Bank-verified prop trading P&L data. Partner with Prop PNL to white-label, license, or integrate real payout data from Topstep, FTMO, Apex, Rise.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Partner With Prop PNL | Trading Data API',
    description:
      'Bank-verified prop trading P&L data. White-label, license, or integrate real payout data from Topstep, FTMO, Apex, Rise.',
    url: `${siteUrl}/partner`,
    siteName: 'Prop PNL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partner With Prop PNL | Trading Data API',
    description:
      'Bank-verified prop trading P&L data. White-label, license, or integrate real payout data from Topstep, FTMO, Apex, Rise.',
    site: '@proppnl',
    creator: '@proppnl',
  },
};

export default function PartnerPage() {
  return <PitchDeck />;
}
