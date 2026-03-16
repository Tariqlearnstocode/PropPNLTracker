import Link from 'next/link';

export function CTASection() {
  return (
    <section
      className="py-24 border-t border-profit/20 bg-gradient-nav"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
          Stop guessing. Know your numbers.
          <span className="block mt-2 text-profit">Connect your bank → see your P&L.</span>
        </h2>
        <p className="text-xl text-terminal-text mb-6 max-w-2xl mx-auto">
          Real P&L in ~60 seconds. Snapshot from $39.99. No subscriptions.
        </p>
        <p className="text-sm text-terminal-muted mb-8 max-w-xl mx-auto font-mono">
          Sign up → connect bank → get your report. That&apos;s it.
        </p>
        <Link
          href="/connect"
          className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
        >
          Connect Your Bank
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
