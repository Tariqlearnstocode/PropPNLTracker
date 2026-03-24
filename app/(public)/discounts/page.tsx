import { Metadata } from 'next';
import Script from 'next/script';
import { getFirmsWithAccounts } from '@/lib/firms.server';
import { hasDiscount, getEvalPrice, type FirmWithAccounts } from '@/lib/firms';
import { DiscountsClient } from './discounts-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Prop Firm Discounts & Promo Codes (March 2026) | Prop PNL',
  description:
    'Active prop firm discount codes and deals for March 2026. Save on evaluations from top futures prop firms like TakeProfitTrader, MyFundedFutures, Tradeify, and more.',
  openGraph: {
    title: 'Prop Firm Discounts & Promo Codes | Prop PNL',
    description:
      'Active prop firm discount codes and deals. Save on evaluations from top futures prop firms.',
  },
};

function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are these prop firm discount codes verified?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We test each code against the firm\'s checkout page before listing it. Codes are removed or updated when they expire.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use multiple promo codes on one purchase?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most prop firms only accept one promo code per checkout. However, some deals combine an eval discount with an activation fee waiver automatically.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the cheapest prop firm challenge right now?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The answer changes as firms rotate promos. Check the deals table for current discounted prices across all firms and account sizes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I pick a prop firm based on price alone?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. A cheap eval with tight drawdown rules and a high reset frequency will cost more in the long run. Factor in drawdown type, consistency rules, minimum trading days, and profit split.',
        },
      },
    ],
  };
}

function buildOffersSchema(firms: FirmWithAccounts[]) {
  const offers = [];
  for (const firm of firms) {
    for (const account of firm.firm_accounts) {
      if (!account.is_active || !hasDiscount(account)) continue;
      offers.push({
        '@type': 'Offer',
        name: `${firm.name} ${account.plan_name} ${account.size_label}`,
        price: getEvalPrice(account),
        priceCurrency: 'USD',
        seller: { '@type': 'Organization', name: firm.name, url: firm.website },
        ...(account.promo_code ? { description: `Use code ${account.promo_code}` } : {}),
      });
    }
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Prop Firm Deals & Promo Codes',
    description: 'Active discount codes and deals for prop firm evaluations.',
    itemListElement: offers,
  };
}

export default async function DealsPage() {
  const firms = await getFirmsWithAccounts();

  return (
    <>
      <Script
        id="deals-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
      />
      <Script
        id="deals-offers-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOffersSchema(firms)) }}
      />
      <DiscountsClient firms={firms} />
    </>
  );
}
