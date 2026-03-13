import { Metadata } from 'next';
import PitchDeck from './PitchDeck';

export const metadata: Metadata = {
  title: 'Partner With Us | Prop Firm P&L Tracker — Bank-Verified Trading Data',
  description:
    'The only bank-verified prop trading P&L tracker. We\'re looking for our first integration partner. White-label, license, or acquire.',
  robots: 'noindex, nofollow',
};

export default function PartnerPage() {
  return <PitchDeck />;
}
