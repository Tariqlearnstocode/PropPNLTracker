import Link from 'next/link';

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20 bg-gradient-hero"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: headline + CTA only */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-terminal-text mb-5 leading-[1.1] tracking-tight">
              Are you actually profitable?
              <span className="block mt-2 text-profit whitespace-nowrap">Your bank knows.</span>
            </h1>
            <p className="text-lg text-terminal-muted max-w-lg mx-auto lg:mx-0 mb-3">
              We connect to your bank and track real payouts and fees. No manual entry. No missing costs. Just your true prop firm P&L.
            </p>
            <p className="text-sm text-terminal-muted/90 max-w-lg mx-auto lg:mx-0 mb-8">
              Topstep, Apex, Tradeify, Rise and more. ~60 seconds to set up.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors w-full sm:w-auto justify-center"
              >
                Get Your Real P&L
                <span>→</span>
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center px-5 py-2.5 font-mono text-xs font-medium text-profit border border-profit/30 hover:bg-profit/10 rounded-lg transition-colors"
              >
                View Plans
              </Link>
            </div>
            <p className="text-xs text-terminal-muted font-mono">
              Plans from $14.95/mo · Cancel anytime
            </p>
            {/* Trust + SEO: security + supported firms */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mt-8 text-xs text-terminal-muted font-mono">
              <span className="flex items-center gap-1.5"><span className="text-profit">✓</span> Read-only</span>
              <span className="flex items-center gap-1.5"><span className="text-profit">✓</span> Encrypted</span>
              <span className="flex items-center gap-1.5"><span className="text-profit">✓</span> 50 Firms Supported</span>
            </div>
          </div>

          {/* Right: dashboard preview — mirrors real product */}
          <HeroDashboardPreview />
        </div>
      </div>
    </section>
  );
}

function HeroDashboardPreview() {
  return (
    <div className="rounded-lg border border-profit/20 bg-terminal-card overflow-hidden shadow-xl shadow-profit/5">
      {/* Browser chrome */}
      <div className="bg-terminal-card border-b border-terminal-border px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="text-[10px] text-terminal-muted font-mono tracking-wide">proppnl.com/report</div>
        <div className="w-12" />
      </div>

      <div className="p-4 sm:p-5 bg-terminal-bg space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-terminal-text font-semibold">Trading Report</span>
            <span className="flex items-center gap-1 text-[9px] font-mono text-profit"><span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse inline-block" />Live</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-terminal-muted px-2 py-0.5 rounded border border-terminal-border">YTD</span>
            <span className="text-[9px] font-mono text-terminal-muted px-2 py-0.5 rounded border border-terminal-border">All</span>
          </div>
        </div>

        {/* Hero stat cards */}
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-2 bg-terminal-card rounded border border-terminal-border p-3">
            <div className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest mb-1">Net PNL</div>
            <div className="text-2xl font-semibold font-mono text-profit leading-none">+$3,541</div>
            <div className="text-[9px] font-mono text-profit/60 mt-1">+12.4% margin</div>
          </div>
          <div className="bg-terminal-card rounded border border-terminal-border p-3">
            <div className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest mb-1">Deposits</div>
            <div className="text-sm font-semibold font-mono text-profit leading-none">+$32,141</div>
            <div className="text-[9px] font-mono text-terminal-muted mt-1">27 payouts</div>
          </div>
          <div className="bg-terminal-card rounded border border-terminal-border p-3">
            <div className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest mb-1">Fees</div>
            <div className="text-sm font-semibold font-mono text-loss leading-none">-$28,600</div>
            <div className="text-[9px] font-mono text-terminal-muted mt-1">164 purchases</div>
          </div>
          <div className="bg-terminal-card rounded border border-terminal-border p-3">
            <div className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest mb-1">Firms</div>
            <div className="text-sm font-semibold font-mono text-terminal-text leading-none">7</div>
            <div className="text-[9px] font-mono text-terminal-muted mt-1">tracked</div>
          </div>
        </div>

        {/* Monthly heatmap */}
        <div>
          <div className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest mb-1.5">Monthly PNL</div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { m: "Oct '25", v: -474, p: false },
              { m: "Nov '25", v: 1380, p: true },
              { m: "Dec '25", v: -856, p: false },
              { m: "Jan '26", v: 2940, p: true },
              { m: "Feb '26", v: 1125, p: true },
              { m: "Mar '26", v: -574, p: false },
              { m: "Apr", v: 0, p: null },
              { m: "May", v: 0, p: null },
            ].map((mo) => (
              <div
                key={mo.m}
                className="rounded border border-terminal-border px-2 py-1.5"
                style={{
                  background:
                    mo.p === true
                      ? `rgba(0, 230, 118, ${Math.min(0.15, (mo.v / 5000) * 0.15)})`
                      : mo.p === false
                      ? `rgba(255, 82, 82, ${Math.min(0.15, (Math.abs(mo.v) / 5000) * 0.15)})`
                      : 'transparent',
                }}
              >
                <div className="text-[8px] font-mono text-terminal-muted">{mo.m}</div>
                <div
                  className={`text-[10px] font-mono font-semibold ${
                    mo.p === true ? 'text-profit' : mo.p === false ? 'text-loss' : 'text-terminal-muted/30'
                  }`}
                >
                  {mo.p === null ? '—' : `${mo.v > 0 ? '+' : ''}$${Math.abs(mo.v).toLocaleString()}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini firm rankings */}
        <div>
          <div className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest mb-1.5">Firm Rankings</div>
          <div className="bg-terminal-card rounded border border-terminal-border overflow-hidden">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="border-b border-terminal-border text-terminal-muted">
                  <th className="text-left py-1.5 px-2 font-normal">#</th>
                  <th className="text-left py-1.5 px-2 font-normal">Firm</th>
                  <th className="text-right py-1.5 px-2 font-normal">Net PNL</th>
                  <th className="text-right py-1.5 px-2 font-normal">ROI</th>
                </tr>
              </thead>
              <tbody className="text-terminal-text">
                <tr className="border-b border-terminal-border/50">
                  <td className="py-1.5 px-2 text-terminal-muted">1</td>
                  <td className="py-1.5 px-2"><span className="inline-block w-1.5 h-1.5 rounded-full bg-profit mr-1.5" />Topstep</td>
                  <td className="py-1.5 px-2 text-right text-profit">+$5,616</td>
                  <td className="py-1.5 px-2 text-right text-profit">↗ 68%</td>
                </tr>
                <tr className="border-b border-terminal-border/50">
                  <td className="py-1.5 px-2 text-terminal-muted">2</td>
                  <td className="py-1.5 px-2"><span className="inline-block w-1.5 h-1.5 rounded-full bg-profit mr-1.5" />Apex</td>
                  <td className="py-1.5 px-2 text-right text-profit">+$2,430</td>
                  <td className="py-1.5 px-2 text-right text-profit">↗ 31%</td>
                </tr>
                <tr className="border-b border-terminal-border/50">
                  <td className="py-1.5 px-2 text-terminal-muted">3</td>
                  <td className="py-1.5 px-2"><span className="inline-block w-1.5 h-1.5 rounded-full bg-loss mr-1.5" />The5ers</td>
                  <td className="py-1.5 px-2 text-right text-loss">-$1,992</td>
                  <td className="py-1.5 px-2 text-right text-loss">↘ -38%</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2 text-terminal-muted">4</td>
                  <td className="py-1.5 px-2"><span className="inline-block w-1.5 h-1.5 rounded-full bg-loss mr-1.5" />MyFundedFX</td>
                  <td className="py-1.5 px-2 text-right text-loss">-$2,513</td>
                  <td className="py-1.5 px-2 text-right text-loss">↘ -54%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
