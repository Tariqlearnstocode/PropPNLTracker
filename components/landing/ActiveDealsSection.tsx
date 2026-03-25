import Link from 'next/link';
import { PromoCodeBadge } from '@/components/PromoCodeBadge';
import { hasDiscount, getEvalPrice, type FirmWithAccounts } from '@/lib/firms';

interface DealRow {
  firm: FirmWithAccounts;
  lowestOriginal: number;
  lowestDiscounted: number;
  discountPct: number;
  promoCode: string | null;
}

export function ActiveDealsSection({ firms }: { firms: FirmWithAccounts[] }) {
  // Build one row per firm that has at least one discounted eval account
  const deals: DealRow[] = [];

  for (const firm of firms) {
    const discountedAccounts = firm.firm_accounts.filter(
      (a) => a.account_type === 'evaluation' && a.is_active && hasDiscount(a)
    );
    if (discountedAccounts.length === 0) continue;

    // Find cheapest discounted eval
    let lowestOriginal = Infinity;
    let lowestDiscounted = Infinity;
    let promoCode: string | null = null;
    let discountPct = 0;

    for (const a of discountedAccounts) {
      const discounted = getEvalPrice(a);
      if (discounted < lowestDiscounted) {
        lowestDiscounted = discounted;
        lowestOriginal = a.price ?? 0;
        promoCode = a.promo_code ?? null;
        discountPct = a.eval_discount_pct ?? (a.eval_discount_amount && a.price ? Math.round((a.eval_discount_amount / a.price) * 100) : 0);
      }
    }

    if (lowestDiscounted < Infinity) {
      deals.push({ firm, lowestOriginal, lowestDiscounted, discountPct, promoCode });
    }
  }

  if (deals.length === 0) return null;

  // Sort by discount percentage descending
  deals.sort((a, b) => b.discountPct - a.discountPct);

  return (
    <section className="py-24 bg-terminal-bg border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-terminal-text mb-4 leading-tight">
            Active prop firm discounts
          </h2>
          <p className="text-lg text-terminal-muted">
            Verified promo codes and deals — save on your next evaluation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map(({ firm, lowestOriginal, lowestDiscounted, discountPct, promoCode }) => (
            <div
              key={firm.slug}
              className="bg-terminal-card rounded-lg border border-terminal-border p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gray-900 border border-terminal-border flex items-center justify-center overflow-hidden">
                  {firm.logo_url ? (
                    <img src={firm.logo_url} alt={`${firm.name} logo`} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-xs font-bold font-mono text-profit">{firm.name.slice(0, 2)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <Link href={`/firms/${firm.slug}`} className="text-terminal-text font-semibold hover:text-profit transition-colors truncate block">
                    {firm.name}
                  </Link>
                  {discountPct > 0 && (
                    <span className="text-sm font-bold text-profit">{discountPct}% OFF</span>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-3 font-mono">
                <span className="text-terminal-muted line-through text-sm">${lowestOriginal}</span>
                <span className="text-profit font-bold text-lg">${lowestDiscounted}</span>
                <span className="text-terminal-muted text-xs">eval from</span>
              </div>

              {promoCode && (
                <div className="mt-2">
                  <PromoCodeBadge code={promoCode} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/discounts"
            className="inline-flex items-center gap-2 text-profit hover:text-profit/80 font-semibold transition-colors"
          >
            View all discount codes &amp; deals
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
