export function SolutionSection() {
  return (
    <section className="py-24 bg-terminal-card border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            One click → Real P&L
          </h2>
          <p className="text-lg text-terminal-muted mb-8">
            Connect your bank. Get the numbers that actually matter, so you can stop guessing and start deciding.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
            <div className="text-lg font-semibold text-terminal-text mb-2">Total payouts</div>
            <p className="text-terminal-text text-sm">Every dollar that hit your account, in one place</p>
          </div>
          <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
            <div className="text-lg font-semibold text-terminal-text mb-2">Total fees paid</div>
            <p className="text-terminal-text text-sm">Resets, challenges, subs. So you see true cost</p>
          </div>
          <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
            <div className="text-lg font-semibold text-terminal-text mb-2">Net P&L</div>
            <p className="text-terminal-text text-sm">The number that matters. Bank-verified.</p>
          </div>
          <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
            <div className="text-lg font-semibold text-terminal-text mb-2">Monthly breakdown</div>
            <p className="text-terminal-text text-sm">Spot trends and see when you actually made money</p>
          </div>
          <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
            <div className="text-lg font-semibold text-terminal-text mb-2">Profit per firm</div>
            <p className="text-terminal-text text-sm">Which firms pay off, and which don&apos;t</p>
          </div>
          <div className="bg-terminal-bg rounded-lg border border-terminal-border p-6">
            <div className="text-lg font-semibold text-terminal-text mb-2">Zero manual entry</div>
            <p className="text-terminal-text text-sm">Bank-linked. Automatic. No spreadsheets.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
