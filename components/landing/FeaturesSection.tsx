export function FeaturesSection() {
  return (
    <section className="py-24 bg-terminal-bg border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-4 leading-tight">
            Built for prop traders who want the truth
          </h2>
          <p className="text-lg text-terminal-muted">
            One dashboard. Real bank data. No spreadsheets.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
            <span className="text-3xl block mb-4">⚡</span>
            <h3 className="text-xl font-semibold text-terminal-text mb-3">Auto-categorized</h3>
            <p className="text-terminal-text">
              Payouts vs. fees: we recognize Rise, Wise, Stripe and tag them so you don&apos;t have to.
            </p>
          </div>
          <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
            <span className="text-3xl block mb-4">👥</span>
            <h3 className="text-xl font-semibold text-terminal-text mb-3">Multi-account</h3>
            <p className="text-terminal-text">
              Up to 5 bank accounts in one view. See your full picture without switching tabs.
            </p>
          </div>
          <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
            <span className="text-3xl block mb-4">🔗</span>
            <h3 className="text-xl font-semibold text-terminal-text mb-3">Shareable link</h3>
            <p className="text-terminal-text">
              One link to prove bank-verified P&L. Investors and followers see the real numbers.
            </p>
          </div>
          <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
            <span className="text-3xl block mb-4">📄</span>
            <h3 className="text-xl font-semibold text-terminal-text mb-3">Export for taxes</h3>
            <p className="text-terminal-text">
              CSV or PDF in one tap. Hand it to your accountant and done.
            </p>
          </div>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-terminal-text">
            <span className="text-profit">✓</span>
            <span>Monthly P&L breakdown</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-terminal-text">
            <span className="text-profit">✓</span>
            <span>Per-prop-firm profit breakdown</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-terminal-text">
            <span className="text-profit">✓</span>
            <span>Automatic prop firm matching</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-terminal-text">
            <span className="text-profit">✓</span>
            <span>Charts + dashboard</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-terminal-text">
            <span className="text-profit">✓</span>
            <span>Export CSV/PDF</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-terminal-text">
            <span className="text-profit">✓</span>
            <span>Shareable public P&L link</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-terminal-text">
            <span className="text-profit">✓</span>
            <span>Transaction search & filters</span>
          </div>
        </div>
      </div>
    </section>
  );
}
