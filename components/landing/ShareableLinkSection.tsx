import { CopyShareLinkButton } from '@/components/CopyShareLinkButton';

export function ShareableLinkSection() {
  return (
    <section className="py-24 bg-terminal-bg border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
              Share your results
              <span className="block mt-2">without screenshots</span>
            </h2>
            <p className="text-lg text-terminal-text mb-8 leading-relaxed">
              Proof beats promises. A public link shows your real payouts, fees, and net P&L. No screenshots, no doubt.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <div>
                  <div className="font-medium text-terminal-text">Build trust publicly</div>
                  <div className="text-terminal-text text-sm">Show followers and investors your real results</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <div>
                  <div className="font-medium text-terminal-text">Coaching & mentorship</div>
                  <div className="text-terminal-text text-sm">Credibility when you need to prove your track record</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-profit mt-0.5 flex-shrink-0">✓</span>
                <div>
                  <div className="font-medium text-terminal-text">Accountability</div>
                  <div className="text-terminal-text text-sm">Share progress with partners. One link, always current</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-terminal-card rounded-lg border border-terminal-border p-8">
            <div className="mb-6">
              <div className="text-sm text-terminal-muted mb-2">Public Report Link</div>
              <div className="text-sm font-mono text-terminal-text bg-terminal-bg p-3 rounded border border-terminal-border break-all">
                prop-firm-pnl-tracker.com/report/abc123
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between pb-3 border-b border-terminal-border">
                <span className="text-sm text-terminal-text">Total Payouts</span>
                <span className="text-sm font-semibold text-terminal-text">$15,200</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-terminal-border">
                <span className="text-sm text-terminal-text">Total Fees</span>
                <span className="text-sm font-semibold text-terminal-text">$2,750</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-terminal-border">
                <span className="text-sm text-terminal-text">Net Profit</span>
                <span className="text-lg font-semibold text-profit">$12,450</span>
              </div>
            </div>
            <CopyShareLinkButton />
          </div>
        </div>
      </div>
    </section>
  );
}
