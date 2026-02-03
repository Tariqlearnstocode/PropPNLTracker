export default function DisclaimersPage() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-terminal-card rounded-xl border border-terminal-border p-8 md:p-12">

          <h1 className="text-3xl font-bold text-terminal-text mb-2">Disclaimers & Limitations</h1>
          <p className="text-terminal-muted text-sm mb-8">Last updated: January 8, 2026</p>

          <hr className="border-terminal-border mb-8" />

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-terminal-text mb-4">1. Purpose of This Report</h2>
            <p className="text-terminal-text leading-relaxed mb-4">
              This report is provided for informational purposes only. It presents profit and loss (PNL) data derived from bank account information that you voluntarily authorized for access through a third-party financial data provider.
            </p>
            <p className="text-terminal-text leading-relaxed">
              The report is intended to assist you in tracking your prop trading PNL across multiple firms. It does not provide financial advice, tax guidance, or trading recommendations.
            </p>
          </section>

          <hr className="border-terminal-border mb-8" />

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-terminal-text mb-4">2. No Financial Advice or Recommendations</h2>
            <p className="text-terminal-text leading-relaxed mb-4">
              We do not provide financial advice, trading recommendations, or tax guidance.
            </p>
            <p className="text-terminal-text leading-relaxed mb-4">
              This report does not constitute:
            </p>
            <ul className="list-disc list-inside text-terminal-text space-y-2 ml-4 mb-4">
              <li>Investment advice</li>
              <li>Tax advice or tax preparation</li>
              <li>Trading recommendations</li>
              <li>Financial planning</li>
              <li>Legal advice</li>
            </ul>
            <p className="text-terminal-text leading-relaxed">
              All decisions made using this report are solely your responsibility.
            </p>
          </section>

          <hr className="border-terminal-border mb-8" />

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-terminal-text mb-4">3. Not a Financial Institution</h2>
            <p className="text-terminal-text leading-relaxed mb-4">
              We are not a financial institution, broker-dealer, or investment advisor as defined under applicable securities laws.
            </p>
            <p className="text-terminal-text leading-relaxed">
              We do not provide financial services, execute trades, hold funds, or provide investment advice. This report should not be relied upon as a substitute for professional financial or tax advice.
            </p>
          </section>

          <hr className="border-terminal-border mb-8" />

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-terminal-text mb-4">4. Source of Data & User Authorization</h2>
            <p className="text-terminal-text leading-relaxed mb-4">
              All information in this report is based on financial account data that you explicitly authorized for access.
            </p>
            <p className="text-terminal-text leading-relaxed">
              We do not collect data without your consent and do not access accounts, institutions, or information that you did not choose to connect.
            </p>
          </section>

          <hr className="border-terminal-border mb-8" />

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-terminal-text mb-4">5. Data Limitations & PNL Estimates</h2>
            <p className="text-terminal-text leading-relaxed mb-4">
              PNL figures shown in this report are estimates based on detected transactions and pattern matching from connected financial accounts.
            </p>
            <p className="text-terminal-text leading-relaxed mb-4">
              Limitations include, but are not limited to:
            </p>
            <ul className="list-disc list-inside text-terminal-text space-y-2 ml-4 mb-4">
              <li>Transactions not deposited into a connected account</li>
              <li>Transactions deposited into accounts not linked by you</li>
              <li>Mismatched or incorrectly categorized transactions</li>
              <li>Incomplete or delayed transaction data from financial institutions</li>
              <li>Prop firm matching may not capture all firms or payment processors</li>
            </ul>
            <p className="text-terminal-text leading-relaxed">
              We do not verify prop firm legitimacy, payout accuracy, or transaction completeness.
            </p>
          </section>

          <hr className="border-terminal-border mb-8" />

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-terminal-text mb-4">6. Accuracy & No Warranties</h2>
            <p className="text-terminal-text leading-relaxed mb-4">
              The report is provided &quot;as is&quot; and &quot;as available.&quot;
            </p>
            <p className="text-terminal-text leading-relaxed mb-4">
              We make no representations or warranties, express or implied, regarding the accuracy, completeness, reliability, or timeliness of the information contained in this report.
            </p>
            <p className="text-terminal-text leading-relaxed">
              Financial institutions ultimately control the availability and accuracy of transaction data, and discrepancies may occur.
            </p>
          </section>

          <hr className="border-terminal-border mb-8" />

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-terminal-text mb-4">7. Limitation of Liability</h2>
            <p className="text-terminal-text leading-relaxed mb-4">
              To the maximum extent permitted by law, we are not liable for any losses, damages, claims, or decisions arising from or related to the use of this report.
            </p>
            <p className="text-terminal-text leading-relaxed mb-4">
              This includes, without limitation:
            </p>
            <ul className="list-disc list-inside text-terminal-text space-y-2 ml-4">
              <li>Trading decisions</li>
              <li>Financial decisions</li>
              <li>Tax reporting decisions</li>
              <li>Reliance on estimated PNL figures</li>
            </ul>
          </section>

          <hr className="border-terminal-border mb-8" />

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-terminal-text mb-4">8. Role Clarification</h2>
            <p className="text-terminal-text leading-relaxed mb-4">
              We are not:
            </p>
            <ul className="list-disc list-inside text-terminal-text space-y-2 ml-4 mb-4">
              <li>A prop trading firm</li>
              <li>A financial advisor</li>
              <li>A tax preparer</li>
              <li>A broker-dealer</li>
              <li>A government agency</li>
            </ul>
            <p className="text-terminal-text leading-relaxed">
              Our role is limited to presenting factual, user-authorized financial data in a summarized format for PNL tracking purposes.
            </p>
          </section>

          <hr className="border-terminal-border mb-8" />

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-terminal-text mb-4">9. Responsibility of the User</h2>
            <p className="text-terminal-text leading-relaxed mb-4">
              You are solely responsible for:
            </p>
            <ul className="list-disc list-inside text-terminal-text space-y-2 ml-4">
              <li>Interpreting the information in this report</li>
              <li>Ensuring compliance with all applicable laws and regulations</li>
              <li>Making any trading, financial, or tax decisions</li>
              <li>Verifying the accuracy of PNL calculations for tax purposes</li>
            </ul>
          </section>

          <hr className="border-terminal-border mb-8" />

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-terminal-text mb-4">10. Questions or Corrections</h2>
            <p className="text-terminal-text leading-relaxed">
              If you believe information in this report is incomplete or inaccurate, please review your connected accounts and transaction matching. We do not guarantee 100% accuracy in transaction categorization or prop firm matching.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
