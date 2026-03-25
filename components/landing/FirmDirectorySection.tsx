import Link from 'next/link';
import type { FirmWithAccounts } from '@/lib/firms';

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  return (
    <span className="inline-flex items-center gap-0.5 text-profit" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill={i < full ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
          {i === full && half ? (
            <>
              <defs><clipPath id={`half-${i}`}><rect x="0" y="0" width="10" height="20" /></clipPath></defs>
              <path clipPath={`url(#half-${i})`} fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </>
          ) : (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          )}
        </svg>
      ))}
      <span className="ml-1 text-sm font-mono text-terminal-muted">{rating}</span>
    </span>
  );
}

export function FirmDirectorySection({ firms }: { firms: FirmWithAccounts[] }) {
  // Show top firms by rating, limit to 6
  const topFirms = firms.slice(0, 6);

  return (
    <section className="py-24 bg-terminal-bg border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-terminal-text mb-4 leading-tight">
            Compare top futures prop firms
          </h2>
          <p className="text-lg text-terminal-muted">
            Side-by-side rules, pricing, drawdown types, and profit splits — updated weekly.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topFirms.map((firm) => {
            const evalAccounts = firm.firm_accounts.filter(a => a.account_type === 'evaluation');
            const lowestPrice = evalAccounts.length > 0
              ? Math.min(...evalAccounts.map(a => a.price ?? Infinity))
              : null;
            const splitValues = [...new Set(evalAccounts.map(a => a.profit_split).filter(Boolean))];

            return (
              <Link
                key={firm.slug}
                href={`/firms/${firm.slug}`}
                className="bg-terminal-card rounded-lg border border-terminal-border p-5 hover:border-profit/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gray-900 border border-terminal-border flex items-center justify-center overflow-hidden">
                    {firm.logo_url ? (
                      <img src={firm.logo_url} alt={`${firm.name} logo`} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-xs font-bold font-mono text-profit">{firm.name.slice(0, 2)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-terminal-text font-semibold group-hover:text-profit transition-colors truncate">
                      {firm.name}
                    </h3>
                    {firm.rating && <StarRating rating={firm.rating} />}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-mono">
                  {lowestPrice != null && lowestPrice !== Infinity && (
                    <span className="text-terminal-muted">From <span className="text-profit">${lowestPrice}</span></span>
                  )}
                  {splitValues.length > 0 && (
                    <span className="text-terminal-muted">Split: <span className="text-profit">{splitValues.join(', ')}</span></span>
                  )}
                  <span className="text-terminal-muted">{evalAccounts.length} plan{evalAccounts.length !== 1 ? 's' : ''}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 text-profit hover:text-profit/80 font-semibold transition-colors"
          >
            View detailed comparison
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
