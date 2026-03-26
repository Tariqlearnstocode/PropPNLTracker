import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFirmBySlug, getFirmsWithAccounts } from '@/lib/firms.server';
import { getURL } from '@/utils/helpers';
import AlternativesContent from './AlternativesContent';
import ComparisonContent from './ComparisonContent';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = 3600;

const FIRM_SLUGS = [
  'topstep',
  'lucid-trading',
  'myfundedfutures',
  'tradeify',
  'alpha-futures',
  'fundednext-futures',
  'takeprofittrader',
  'apex-trader-funding',
  'aqua-futures',
];

interface PageProps {
  params: Promise<{ seoSlug: string }>;
}

type PageType =
  | { kind: 'alternatives'; firmSlug: string }
  | { kind: 'comparison'; slug1: string; slug2: string };

function parseSlug(seoSlug: string): PageType | null {
  // e.g. "topstep-alternatives"
  if (seoSlug.endsWith('-alternatives')) {
    const firmSlug = seoSlug.replace(/-alternatives$/, '');
    if (FIRM_SLUGS.includes(firmSlug)) {
      return { kind: 'alternatives', firmSlug };
    }
  }

  // e.g. "alpha-futures-vs-topstep"
  const vsIndex = seoSlug.indexOf('-vs-');
  if (vsIndex !== -1) {
    const slug1 = seoSlug.substring(0, vsIndex);
    const slug2 = seoSlug.substring(vsIndex + 4);
    if (slug1 && slug2) {
      return { kind: 'comparison', slug1, slug2 };
    }
  }

  return null;
}

function sortSlugsAlphabetically(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export async function generateStaticParams() {
  const params: Array<{ seoSlug: string }> = [];

  // Alternatives pages (9)
  for (const slug of FIRM_SLUGS) {
    params.push({ seoSlug: `${slug}-alternatives` });
  }

  // Vs comparison pages (36 unique pairs, alphabetically sorted)
  for (let i = 0; i < FIRM_SLUGS.length; i++) {
    for (let j = i + 1; j < FIRM_SLUGS.length; j++) {
      const [s1, s2] = sortSlugsAlphabetically(FIRM_SLUGS[i], FIRM_SLUGS[j]);
      params.push({ seoSlug: `${s1}-vs-${s2}` });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seoSlug } = await params;
  const parsed = parseSlug(seoSlug);
  if (!parsed) return {};

  const siteUrl = getURL();

  if (parsed.kind === 'alternatives') {
    const firm = await getFirmBySlug(parsed.firmSlug);
    if (!firm) return {};

    const title = `Best ${firm.name} Alternatives & Competitors (2026)`;
    const description = `Looking for ${firm.name} alternatives? Compare ${firm.name} against ${FIRM_SLUGS.length - 1} other verified futures prop firms by pricing, rules, and payouts.`;

    return {
      title,
      description,
      alternates: { canonical: `${siteUrl}/${seoSlug}` },
      openGraph: { title, description, url: `${siteUrl}/${seoSlug}`, type: 'website' },
      twitter: { card: 'summary_large_image', title, description },
    };
  }

  // Comparison
  const [firmA, firmB] = await Promise.all([
    getFirmBySlug(parsed.slug1),
    getFirmBySlug(parsed.slug2),
  ]);
  if (!firmA || !firmB) return { title: 'Firms Not Found' };

  const title = `${firmA.name} vs ${firmB.name}: Side-by-Side Comparison (2026)`;
  const description = `Compare ${firmA.name} and ${firmB.name} head to head. Pricing, drawdown rules, profit splits, and more.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/${seoSlug}` },
    openGraph: {
      title: `${firmA.name} vs ${firmB.name} | Prop PNL`,
      description,
      url: `${siteUrl}/${seoSlug}`,
      siteName: 'Prop PNL',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${firmA.name} vs ${firmB.name} | Prop PNL`,
      description,
      site: '@proppnl',
      creator: '@proppnl',
    },
  };
}

export default async function SeoPage({ params }: PageProps) {
  const { seoSlug } = await params;
  const parsed = parseSlug(seoSlug);

  if (!parsed) {
    notFound();
  }

  if (parsed.kind === 'alternatives') {
    const firm = await getFirmBySlug(parsed.firmSlug);
    if (!firm) notFound();

    const allFirms = await getFirmsWithAccounts();
    const alternatives = allFirms.filter((f) => f.slug !== parsed.firmSlug);

    return (
      <AlternativesContent
        firm={firm}
        alternatives={alternatives}
        seoSlug={seoSlug}
      />
    );
  }

  // Comparison page
  const [firmA, firmB] = await Promise.all([
    getFirmBySlug(parsed.slug1),
    getFirmBySlug(parsed.slug2),
  ]);

  if (!firmA || !firmB) {
    notFound();
  }

  return (
    <ComparisonContent
      firmA={firmA}
      firmB={firmB}
      seoSlug={seoSlug}
    />
  );
}
