export function ProblemSection() {
  return (
    <section className="py-24 bg-terminal-bg border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight text-center">
            Spreadsheets lie.
            <span className="block mt-2">Bank accounts don&apos;t.</span>
          </h2>
          <p className="text-lg text-terminal-text mb-8 text-center max-w-2xl mx-auto">
            Real money slips through when you guess. Resets, challenge fees, and subscriptions add up, and most traders don&apos;t run the numbers until it&apos;s too late.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Too many firms</div>
              <p className="text-terminal-text text-sm">
                Tracking multiple prop firms in one place is a nightmare.
              </p>
            </div>
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Hidden costs</div>
              <p className="text-terminal-text text-sm">
                Those &quot;small&quot; $50 resets add up to thousands.
              </p>
            </div>
            <div className="bg-terminal-card rounded-lg border border-terminal-border p-6">
              <div className="text-lg font-semibold text-terminal-text mb-2">Manual labor</div>
              <p className="text-terminal-text text-sm">
                You&apos;re a trader, not an accountant. Stop wasting hours on Excel.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-xl text-terminal-muted italic">
              &quot;I think I&apos;m profitable… but I&apos;m not really sure.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
