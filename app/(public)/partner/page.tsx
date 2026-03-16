import { Metadata } from 'next';
import { getURL } from '@/utils/helpers';
import PitchDeck from './PitchDeck';

const siteUrl = getURL();

export const metadata: Metadata = {
  title: { absolute: 'Partner With Prop PNL | Trading Data API' },
  description:
    'Integrate verified prop trading P&L data into your platform. White-label, license, or API access to real payout data from connected bank accounts.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Partner With Prop PNL | Trading Data API',
    description:
      'Integrate verified prop trading P&L data into your platform. White-label, license, or API access to real payout data from connected bank accounts.',
    url: `${siteUrl}/partner`,
    siteName: 'Prop PNL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partner With Prop PNL | Trading Data API',
    description:
      'Integrate verified prop trading P&L data into your platform. White-label, license, or API access to real payout data from connected bank accounts.',
    site: '@proppnl',
    creator: '@proppnl',
  },
};

export default function PartnerPage() {
  return <PitchDeck />;
}
