import { Metadata } from 'next';
import { getURL } from '@/utils/helpers';
import PitchDeck from './PitchDeck';

const siteUrl = getURL();

export const metadata: Metadata = {
  title: 'Partner With Us | Bank-Verified Trading Data',
  description:
    'The only bank-verified prop trading P&L tracker. We\'re looking for our first integration partner. White-label, license, or acquire.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Partner With Prop PNL | Bank-Verified Trading Data',
    description:
      'The only bank-verified prop trading P&L tracker. Partnership opportunities: white-label, license, or acquire.',
    url: `${siteUrl}/partner`,
    siteName: 'Prop PNL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partner With Prop PNL | Bank-Verified Trading Data',
    description:
      'The only bank-verified prop trading P&L tracker. Partnership opportunities: white-label, license, or acquire.',
    site: '@proppnl',
    creator: '@proppnl',
  },
};

export default function PartnerPage() {
  return <PitchDeck />;
}
