export function SecuritySection() {
  return (
    <section className="py-24 bg-terminal-card border-t border-profit/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-terminal-text mb-6 leading-tight">
            You stay in control
          </h2>
          <p className="text-lg text-terminal-text leading-relaxed">
            Your credentials never touch our servers. We use Teller (same tech as tax and finance apps), read-only, so we can&apos;t move money or see your password.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-terminal-bg rounded-lg border border-terminal-border p-8 text-center">
            <span className="text-3xl block mx-auto mb-4 text-center">🔒</span>
            <h3 className="text-lg font-semibold text-terminal-text mb-2">Read-only</h3>
            <p className="text-terminal-text text-sm">
              We read transactions only. No withdrawals, no transfers, no payments. Ever.
            </p>
          </div>

          <div className="bg-terminal-bg rounded-lg border border-terminal-border p-8 text-center">
            <span className="text-3xl block mx-auto mb-4 text-center">🔐</span>
            <h3 className="text-lg font-semibold text-terminal-text mb-2">Encrypted</h3>
            <p className="text-terminal-text text-sm">
              Data encrypted at rest and in transit. Same standards banks use.
            </p>
          </div>

          <div className="bg-terminal-bg rounded-lg border border-terminal-border p-8 text-center">
            <span className="text-3xl block mx-auto mb-4 text-center">🙈</span>
            <h3 className="text-lg font-semibold text-terminal-text mb-2">No stored logins</h3>
            <p className="text-terminal-text text-sm">
              We never store your bank login. Connect via Teller; disconnect anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
