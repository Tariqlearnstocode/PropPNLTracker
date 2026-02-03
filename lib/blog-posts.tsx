import { ReactNode } from 'react';
import Link from 'next/link';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  content: () => ReactNode;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'true-cost-of-prop-firm-trading',
    title: 'The True Cost of Prop Firm Trading',
    description:
      'Challenge fees, resets, data feeds, platform subs — the full fee stack that determines whether prop trading is actually profitable for you.',
    date: '2026-01-28',
    readTime: '9 min read',
    tags: ['fees', 'profitability', 'guide'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Prop trading firms sell a compelling pitch: put up a few hundred dollars for a challenge, prove you can trade, and get access to a funded account with tens or hundreds of thousands of dollars in buying power. The upside is real. But the cost structure is deeper than most traders realize when they sign up for their first evaluation.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is not an argument against prop firms. They provide genuine opportunity. But if you do not understand the full fee stack, you cannot accurately calculate whether you are profitable. And according to a PipFarm survey, <strong className="text-profit">traders spend $4,270 on average before receiving their first payout</strong>. That number is not a typo.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Let us walk through every cost, layer by layer, so you can see the real picture.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Challenge and Evaluation Fees</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Every prop firm journey starts with an evaluation. You pay an upfront fee for the right to prove your trading skills in a simulated environment. These fees vary by account size and firm:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>A <span className="font-mono text-profit">$50,000</span> account evaluation at Topstep typically costs <span className="font-mono text-profit">$49/month</span> (as a subscription) or around <span className="font-mono text-profit">$165</span> for a one-time challenge at firms like FTMO.</li>
          <li>A <span className="font-mono text-profit">$100,000</span> challenge at FTMO runs about <span className="font-mono text-profit">$540</span>.</li>
          <li>A <span className="font-mono text-profit">$200,000</span> challenge can cost <span className="font-mono text-profit">$1,080</span> or more.</li>
          <li>Some firms like The5ers offer instant funding programs starting around <span className="font-mono text-profit">$260</span> for smaller accounts.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is the part most traders underestimate: the pass rate. Industry estimates vary, but the consensus is that only <strong className="text-profit">4% to 20%</strong> of traders pass their first evaluation, depending on the firm and the rules. That means most traders pay the challenge fee multiple times before they ever get funded.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Reset Fees</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          When you blow a challenge (hit the drawdown limit, break a rule, or simply run out of time), many firms offer a reset option. Instead of paying the full challenge fee again, you can reset your account for a reduced price.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Reset fees typically range from <span className="font-mono text-profit">$59 to $169</span>, depending on the account size and firm. It sounds cheaper than repurchasing the full challenge, and it is. But most traders need <strong className="text-profit">2 to 4 resets</strong> before passing. Some need more. At <span className="font-mono text-profit">$99</span> per reset with three resets, that is an additional <span className="font-mono text-profit">$297</span> on top of the original challenge fee.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          Budget for 2-4 resets per challenge. If you are running challenges at multiple firms simultaneously, multiply accordingly.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Activation Fees</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You passed the challenge. Congratulations. But some firms charge an activation fee to actually start trading the live funded account. These fees range from <span className="font-mono text-profit">$0</span> at firms like Topstep (which refunds the activation fee with your first payout) to as much as <span className="font-mono text-profit">$500-$800</span> at some lesser-known firms. Always check whether the activation fee is refundable or a sunk cost.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Platform and Data Feed Subscriptions</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is where costs quietly compound every single month, whether you are actively trading or not:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Trading platform fees:</strong> NinjaTrader lifetime license costs around $1,100, or you can lease it for $75/month. TradingView Pro runs $13-$60/month. Rithmic access can be $25-$30/month through some firms.</li>
          <li><strong className="text-profit">Data feed fees:</strong> Real-time CME market data is roughly $11-$16/month per exchange. If you trade futures across multiple exchanges, this adds up to around <span className="font-mono text-profit">$130/month</span> in combined data fees.</li>
          <li><strong className="text-profit">Firm-specific monthly fees:</strong> Some firms charge a monthly subscription to keep your evaluation active. Topstep, for example, charges a recurring monthly fee for their Trading Combine.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A trader running two platforms with full market data can easily spend <span className="font-mono text-profit">$150-$250 per month</span> on infrastructure alone, regardless of whether they trade or not.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Commissions and Trading Costs</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Once you are live-funded, you pay commissions on every trade. These vary by firm and instrument, but for futures, expect roughly <span className="font-mono text-profit">$3.00-$5.00 per round turn</span> per contract. If you trade 10 contracts per day, that is <span className="font-mono text-profit">$30-$50/day</span> in commissions, or <span className="font-mono text-profit">$600-$1,000/month</span> for an active trader.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Some firms also charge exchange fees on top of commissions. These are small per trade but add up with volume.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Profit Split</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You earned money in the funded account. But you do not keep all of it. Most prop firms take a cut:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>FTMO offers an <span className="font-mono text-profit">80/20</span> split (you keep 80%), scaling to 90/10.</li>
          <li>Topstep offers <span className="font-mono text-profit">90/10</span> after an initial period at 80/20.</li>
          <li>The5ers starts at <span className="font-mono text-profit">80/20</span> and scales up.</li>
          <li>Some newer firms advertise 90/10 or even 100/0 splits, but often have higher fees elsewhere.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          On a <span className="font-mono text-profit">$5,000</span> gross profit with an 80/20 split, your actual payout is <span className="font-mono text-profit">$4,000</span>. That missing $1,000 is easy to forget when you are tracking your P&L.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Withdrawal Fees</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          When you request a payout, you may pay wire transfer or processing fees. Firms that pay through Rise or Wise typically charge <span className="font-mono text-profit">$0-$5</span>, but direct bank wires can run <span className="font-mono text-profit">$25-$50</span>. Some firms also impose minimum withdrawal amounts or waiting periods.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">How These Fees Compound Across Firms</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Most serious prop traders do not work with just one firm. They run challenges at two or three simultaneously to increase their odds. Here is what that looks like:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>3 challenges at <span className="font-mono text-profit">$200</span> each = <span className="font-mono text-profit">$600</span></li>
          <li>2 resets per challenge at <span className="font-mono text-profit">$99</span> = <span className="font-mono text-profit">$594</span></li>
          <li>6 months of data feeds at <span className="font-mono text-profit">$130/mo</span> = <span className="font-mono text-profit">$780</span></li>
          <li>Platform subscription for 6 months = <span className="font-mono text-profit">$450</span></li>
          <li>Activation fee = <span className="font-mono text-profit">$150</span></li>
          <li>Commissions over 3 months of funded trading = <span className="font-mono text-profit">$1,800</span></li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Total: <strong className="text-profit">$4,374</strong>. And that is a conservative scenario where you pass one challenge on the third attempt and start earning. The PipFarm survey average of <span className="font-mono text-profit">$4,270</span> before first payout aligns almost exactly.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Stat That Matters</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          According to industry data, roughly <strong className="text-profit">60% of prop firm traders never reach profitability</strong> when all costs are factored in. Not because they cannot trade, but because the fee structure erodes their edge. The traders who succeed are the ones who know their numbers cold: exactly how much they have spent, exactly how much they have earned, and exactly what their net P&L is after every line item.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you are tracking payouts in your head, or glancing at your trading platform balance and calling that your profit, you are almost certainly overestimating your returns. The only number that matters is what actually landed in your bank account, minus what left it.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">What To Do About It</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          None of this means you should avoid prop trading. It means you should treat it like a business. Every business tracks revenue and expenses. Your challenge fees, resets, data feeds, and commissions are business expenses. Your payouts are revenue. The difference is your real profit.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Stop guessing. Connect your bank and see the actual number.
        </p>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            See your true prop firm P&L in 60 seconds
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Prop PNL connects to your bank and auto-tracks every payout and fee. No spreadsheets.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank - Free
          </Link>
        </div>
      </>
    ),
  },
  {
    slug: 'are-you-actually-profitable',
    title: 'Are You Actually Profitable? How to Calculate Your Real Prop Firm P&L',
    description:
      'The difference between gross trading P&L and net business P&L is often thousands of dollars. Here is how to calculate the number that actually matters.',
    date: '2026-01-21',
    readTime: '8 min read',
    tags: ['profitability', 'guide', 'pnl'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A trader posts a screenshot in a Discord server: &quot;$8,000 payout this month.&quot; The replies flood in with congratulations. But behind that number is a story nobody is asking about. How much did it cost to earn that $8,000?
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          In prop firm trading, there is a massive gap between gross trading P&L (the profit on your funded account) and net business P&L (what actually stays in your bank account after every expense). This article walks through exactly how to calculate the number that matters and why most traders avoid doing it.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Gross P&L vs. Net P&L: Two Very Different Numbers</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your prop firm dashboard shows your gross trading profit. This is the raw performance of your trades in the funded account. It is a useful metric for evaluating your trading strategy, but it is not your actual income.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your net P&L is what your bank account says. It factors in the profit split the firm takes, every fee you have paid, and every cost of doing business. The gap between these two numbers is often thousands of dollars. Sometimes it is the difference between being profitable and losing money.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">A Real-World Calculation Example</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Let us follow a trader through six months of prop firm trading. This is a composite example, but the numbers reflect real patterns.
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">The Income Side</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Over six months, this trader received <strong className="text-profit">three payouts totaling $8,000</strong> deposited into their bank account. From the outside and on social media, this looks like a successful trading operation.
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">The Expense Side</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Now let us look at what left the bank account during those same six months:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Challenge fees:</strong> The trader ran evaluations at two firms. One $200K challenge at $540, one $100K challenge at $350, plus a second $100K at a different firm for $250. Total: <span className="font-mono text-profit">$2,400</span> (includes some failed attempts purchased outright).</li>
          <li><strong className="text-profit">Reset fees:</strong> Before passing, the trader reset challenges 6 times at approximately $100 each. Total: <span className="font-mono text-profit">$600</span>.</li>
          <li><strong className="text-profit">Data feeds and platform costs:</strong> $130/month for CME data plus a platform subscription, running for 6 months. Total: <span className="font-mono text-profit">$780</span>.</li>
          <li><strong className="text-profit">Commissions:</strong> Trading an average of 8 contracts per day at $4.00 per round turn, roughly 20 trading days per month, for the 3 months of funded trading. Total: <span className="font-mono text-profit">$240</span> (after the firm absorbs a portion).</li>
        </ul>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">The Math</h3>
        <div className="bg-terminal-card rounded-lg border border-terminal-border p-6 mb-6 font-mono text-sm">
          <div className="space-y-2">
            <div className="flex justify-between text-terminal-text">
              <span>Total Payouts (deposited)</span>
              <span className="text-profit">+ $8,000</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Challenge Fees</span>
              <span className="text-red-400">- $2,400</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Reset Fees</span>
              <span className="text-red-400">- $600</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Data Feeds &amp; Platform</span>
              <span className="text-red-400">- $780</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Commissions (net)</span>
              <span className="text-red-400">- $240</span>
            </div>
            <div className="border-t border-terminal-border mt-3 pt-3 flex justify-between font-bold text-terminal-text">
              <span>Real Net P&L</span>
              <span className="text-profit">$3,980</span>
            </div>
          </div>
        </div>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The trader made <strong className="text-profit">$3,980</strong> over six months, not $8,000. That is a <strong className="text-profit">50.3% reduction</strong> from what they thought they earned. Their effective hourly rate, if they spent 4 hours per day trading, is roughly <span className="font-mono text-profit">$7.65/hour</span>. Still profitable, and nothing to be ashamed of since many traders are net negative. But it is fundamentally different from what the payout screenshots suggest.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Why Most Traders Avoid This Math</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If the calculation is straightforward, why do so few traders actually do it? The answer is psychological, and it has a name: the <strong className="text-profit">ostrich effect</strong>.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The ostrich effect, documented in behavioral economics research by Karlsson, Loewenstein, and Seppi, describes the tendency to avoid negative information. Investors check their portfolios less frequently during market downturns. Dieters avoid the scale after a holiday weekend. And prop traders avoid adding up their total expenses because they suspect the answer might be uncomfortable.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Closely related is <strong className="text-profit">loss aversion</strong>. Research by Kahneman and Tversky shows that losses feel roughly twice as painful as equivalent gains feel good. A $500 payout feels great. But acknowledging a $500 challenge fee that went nowhere feels disproportionately worse. So the brain does what it does best: it avoids the comparison entirely.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The result is a kind of selective accounting. Traders remember the payouts vividly but file the fees as one-time costs that &quot;don&apos;t really count.&quot; Challenge fees become investments. Resets become learning experiences. Data feeds become necessary overhead that &quot;would exist anyway.&quot; Each rationalization is partially true, which makes the overall self-deception harder to notice.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Spreadsheet Problem</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Some traders do try to track everything manually. They build spreadsheets. The problem is threefold:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Maintenance burden:</strong> You have to remember to log every charge, every reset, every payout. Miss a $99 reset or a $15 data fee, and your P&L is wrong.</li>
          <li><strong className="text-profit">Categorization guesswork:</strong> Was that $250 charge from Topstep a challenge fee or a subscription renewal? Was the $180 from Rise a partial payout or something else? Bank statements do not always make this obvious.</li>
          <li><strong className="text-profit">Multiple accounts:</strong> If you trade with three firms and receive payouts through Wise, Rise, and direct wire, tracking all of it in one spreadsheet requires discipline that most people simply do not sustain for months.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The spreadsheet usually starts strong in January, gets spotty by March, and is abandoned by June. Sound familiar?
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Bank-Connected Tracking: The Automatic Alternative</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The most accurate source of truth for your prop firm P&L is not your trading platform, your firm&apos;s dashboard, or a spreadsheet you manually update. It is your bank account. Every real dollar flows through it. Payouts show up as deposits. Challenge fees, resets, data feeds, and platform subscriptions show up as debits. The bank does not forget, it does not rationalize, and it does not take a month off from logging.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is the principle behind bank-connected P&L tracking. When you link your bank account to a tool that understands prop firm transactions, it can automatically categorize deposits from Rise, Wise, FTMO, and Topstep as payouts, and charges going to those same entities as fees. The math happens automatically, and the number it produces is the only number that matters: your real net P&L.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">What Real P&L Tracking Changes</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          When traders finally see their real net number, several things tend to happen:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Better firm selection:</strong> You can compare actual profit per firm and drop the ones that cost more than they return.</li>
          <li><strong className="text-profit">Fewer impulsive resets:</strong> When you see the cumulative cost of resets, the next $99 hurts more and you think harder before hitting the button.</li>
          <li><strong className="text-profit">Accurate tax filing:</strong> Your net P&L is what you owe taxes on. Overreporting costs you money. Underreporting creates risk.</li>
          <li><strong className="text-profit">Honest self-assessment:</strong> You can decide whether prop trading is a viable income stream based on reality, not hope.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">How to Get Started</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You have two options. One: open a spreadsheet right now, pull up your bank statements for the past 6 months, and manually categorize every prop-firm-related transaction. This works but takes hours and requires ongoing discipline.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Two: connect your bank to Prop PNL and have it done automatically in about 60 seconds. We pull your transactions, identify prop firm payouts and fees, and show you the real number. No manual entry. No spreadsheet to maintain.
        </p>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            Find out your real number
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Connect your bank. Prop PNL auto-categorizes payouts vs. fees and shows your true net P&L.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank - Free
          </Link>
        </div>
      </>
    ),
  },
  {
    slug: 'prop-firm-taxes-guide',
    title: 'Prop Firm Taxes: What Every Trader Needs to Know',
    description:
      'Prop firm income is self-employment income. Here is what that means for your taxes, what you can deduct, and why accurate P&L records save you money.',
    date: '2026-01-14',
    readTime: '10 min read',
    tags: ['taxes', 'guide', 'compliance'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Tax season is the moment of truth for prop firm traders. It is when the gap between &quot;I think I made money&quot; and &quot;here is exactly what I owe&quot; becomes a real problem. If you have been trading funded accounts and receiving payouts, you have tax obligations that differ significantly from a traditional W-2 job. This guide covers what you need to know.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          Disclaimer: This article is educational information, not tax advice. Consult a qualified tax professional for your specific situation.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Prop Firm Income Is Self-Employment Income</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is the single most important thing to understand: when a prop firm pays you, that money is <strong className="text-profit">not W-2 employment income</strong>. You are not an employee of Topstep, FTMO, or The5ers. You are an independent contractor, and your payouts are classified as self-employment income.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          What this means practically:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>You will receive a <strong className="text-profit">1099-NEC</strong> (or 1099-MISC) from firms that pay you over $600 in a calendar year, not a W-2.</li>
          <li>No taxes are withheld from your payouts. The full amount hits your bank account, and it is your responsibility to set aside money for taxes.</li>
          <li>You may need to make <strong className="text-profit">quarterly estimated tax payments</strong> to the IRS (and your state) to avoid underpayment penalties.</li>
          <li>Some firms, especially those based outside the US, may not issue a 1099 at all. You are still legally required to report the income.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you received payouts through payment processors like Rise or Wise, track those carefully. The 1099 may come from the processor rather than the prop firm itself, and the descriptions may not clearly indicate they are trading payouts.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Self-Employment Tax: The 15.3% Surprise</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is the number that blindsides many first-time prop traders at tax time: <strong className="text-profit">15.3% self-employment tax</strong>.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          When you work a W-2 job, your employer pays half of your Social Security and Medicare taxes (7.65%), and the other half is deducted from your paycheck. As a self-employed trader, you pay both halves. The breakdown:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Social Security:</strong> 12.4% on net earnings up to <span className="font-mono text-profit">$168,600</span> (2026 cap)</li>
          <li><strong className="text-profit">Medicare:</strong> 2.9% on all net earnings (no cap)</li>
          <li><strong className="text-profit">Additional Medicare:</strong> 0.9% on earnings above $200,000 for single filers</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is on top of your regular federal income tax. So if you are in the 22% federal tax bracket and owe 15.3% in self-employment tax, your effective federal rate on prop firm income is roughly <span className="font-mono text-profit">37.3%</span> before state taxes. On $10,000 in net prop firm profit, that is approximately <span className="font-mono text-profit">$3,730</span> in federal taxes alone.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Many traders do not realize this until they file and receive an unexpectedly large tax bill. This is why setting aside <span className="font-mono text-profit">25-35%</span> of every payout for taxes is a common recommendation.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">What You Can Deduct</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The silver lining of self-employment status is that you can deduct legitimate business expenses against your prop firm income. These deductions reduce your taxable income (and therefore your self-employment tax base). Common deductible expenses for prop traders include:
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Challenge and Reset Fees</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Every challenge fee and reset fee you paid is a deductible business expense. This includes challenges you failed. If you spent <span className="font-mono text-profit">$3,000</span> on evaluations and resets during the year, that full amount reduces your taxable income. Keep receipts and transaction records for each one.
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Platform Subscriptions</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Monthly fees for trading platforms like NinjaTrader, TradingView, or Rithmic are deductible. If you paid <span className="font-mono text-profit">$75/month</span> for NinjaTrader for 12 months, that is a <span className="font-mono text-profit">$900</span> deduction. Annual or lifetime licenses are also deductible, though the timing of the deduction may vary (ask your accountant about Section 179 or amortization for larger purchases).
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Data Feed Fees</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          CME, NYSE, and other exchange data fees paid monthly are fully deductible. At roughly <span className="font-mono text-profit">$130/month</span>, this adds up to <span className="font-mono text-profit">$1,560/year</span> in deductions.
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Home Office Deduction</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you trade from a dedicated space in your home, you may qualify for the home office deduction. The simplified method allows a deduction of <span className="font-mono text-profit">$5 per square foot</span>, up to 300 square feet, for a maximum deduction of <span className="font-mono text-profit">$1,500</span>. The actual expense method can yield a larger deduction if your home office is a significant percentage of your home, but requires more documentation.
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Equipment and Internet</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Monitors, computers, desks, and chairs used for trading can be deducted or depreciated. If you use your internet connection primarily for trading, a portion of your monthly bill is deductible. Be reasonable with the percentage you claim, as the IRS expects business use to be substantiated.
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Education and Subscriptions</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Trading courses, coaching, books, and educational subscriptions directly related to your trading business are generally deductible. This includes mentorship programs, trading room subscriptions, and relevant newsletters.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">A Sample Tax Scenario</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Let us put this together with a concrete example:
        </p>
        <div className="bg-terminal-card rounded-lg border border-terminal-border p-6 mb-6 font-mono text-sm">
          <div className="space-y-2">
            <div className="flex justify-between text-terminal-text">
              <span>Gross Payouts Received</span>
              <span className="text-profit">$18,000</span>
            </div>
            <div className="border-t border-terminal-border mt-3 pt-3 text-terminal-muted text-xs mb-2">
              Deductions:
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Challenge &amp; Reset Fees</span>
              <span className="text-red-400">- $3,200</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Data Feeds (12 months)</span>
              <span className="text-red-400">- $1,560</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Platform Subscriptions</span>
              <span className="text-red-400">- $900</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Home Office (simplified)</span>
              <span className="text-red-400">- $1,500</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Equipment &amp; Internet</span>
              <span className="text-red-400">- $1,200</span>
            </div>
            <div className="border-t border-terminal-border mt-3 pt-3 flex justify-between font-bold text-terminal-text">
              <span>Taxable Net Profit</span>
              <span className="text-profit">$9,640</span>
            </div>
          </div>
        </div>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Without deductions, you would owe self-employment tax on $18,000 (roughly <span className="font-mono text-profit">$2,754</span> in SE tax alone). With proper deductions, you owe SE tax on $9,640 (roughly <span className="font-mono text-profit">$1,475</span>). That is a savings of about <strong className="text-profit">$1,279</strong> just from the self-employment tax difference, before even considering the reduction in income tax.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The takeaway: every deductible dollar you fail to document costs you roughly <span className="font-mono text-profit">$0.30-$0.40</span> in unnecessary taxes.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Why Accurate Records Matter</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Deductions only work if you can prove them. The IRS requires that business expenses be &quot;ordinary and necessary&quot; and supported by records. For prop traders, this means:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Transaction records:</strong> Bank and credit card statements showing each fee paid to prop firms, platform providers, and data vendors.</li>
          <li><strong className="text-profit">Income records:</strong> Documentation of every payout received, including the source and amount.</li>
          <li><strong className="text-profit">Categorization:</strong> Clear separation of payouts (income) from fees (expenses) so you or your accountant can prepare Schedule C accurately.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you trade with multiple firms and receive payouts through different processors, this documentation gets complicated quickly. A Wise deposit of $1,200 with a generic description does not obviously identify itself as an FTMO payout when you are reviewing bank statements nine months later.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Quarterly Estimated Payments</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you expect to owe more than <span className="font-mono text-profit">$1,000</span> in taxes for the year, the IRS expects you to make quarterly estimated tax payments. The deadlines are:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Q1: April 15</li>
          <li>Q2: June 15</li>
          <li>Q3: September 15</li>
          <li>Q4: January 15 of the following year</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Missing these payments can result in underpayment penalties. Having an up-to-date P&L throughout the year makes it much easier to estimate what you owe each quarter instead of scrambling at tax time.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">How Prop PNL Helps at Tax Time</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Prop PNL connects to your bank and automatically categorizes prop firm payouts and fees. This gives you:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Instant Schedule C data:</strong> Total income (payouts) and total expenses (fees) clearly separated and ready for your accountant.</li>
          <li><strong className="text-profit">CSV and PDF exports:</strong> Download your full transaction history in formats your accountant can work with directly.</li>
          <li><strong className="text-profit">Per-firm breakdown:</strong> See exactly how much each firm paid you and how much you paid them, which is essential if a 1099 amount does not match your records.</li>
          <li><strong className="text-profit">Year-round visibility:</strong> With Pro, your data updates weekly. When Q1 estimated payments are due, you already know your year-to-date P&L.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Common Mistakes to Avoid</h2>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Not reporting foreign firm payouts:</strong> If FTMO (Czech Republic) or another international firm pays you, that income is still taxable in the US. The absence of a 1099 does not mean the income is invisible to the IRS.</li>
          <li><strong className="text-profit">Confusing gross payouts with net income:</strong> You owe taxes on net profit (payouts minus deductible expenses), not gross payouts. But you need documentation to prove the deductions.</li>
          <li><strong className="text-profit">Missing the self-employment tax:</strong> Many new traders budget only for income tax and are shocked by the additional 15.3%. Always factor this in.</li>
          <li><strong className="text-profit">Not keeping records:</strong> &quot;I&apos;ll figure it out at tax time&quot; is the most expensive sentence in prop trading. Reconstructing a year of transactions from memory is painful and error-prone.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Bottom Line</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Prop firm trading creates real tax obligations. Self-employment tax alone adds 15.3% that many traders do not plan for. But proper expense tracking and deductions can significantly reduce what you owe. The key is accurate, categorized records of every payout received and every fee paid, maintained throughout the year rather than reconstructed in April.
        </p>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            Get your tax-ready P&L report
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Prop PNL auto-categorizes every payout and fee. Export a CSV or PDF for your accountant in one click.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank - Free
          </Link>
        </div>
      </>
    ),
  },
  {
    slug: 'how-to-choose-a-prop-firm',
    title: 'How to Choose the Right Prop Firm for Your Trading Style',
    description:
      'Futures vs forex, 1-step vs 2-step, trailing vs static drawdown — a practical guide to finding the prop firm that fits how you actually trade.',
    date: '2026-01-07',
    readTime: '10 min read',
    tags: ['prop firms', 'guide', 'beginners'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          There are over 100 prop trading firms operating right now, and that number keeps growing. Each one pitches itself as the best option for funded traders. But the reality is that no single firm is the best for everyone. The right firm depends on what you trade, how you trade, and what rules you can realistically follow without blowing up.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This guide breaks down the actual decision points that matter. Not marketing claims or affiliate rankings, but the structural differences between firms that determine whether you will succeed or fail with a specific provider.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Futures Firms vs. Forex Firms: The First Fork</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The biggest decision you will make is whether you want to trade futures or forex through your prop firm. This is not just an instrument preference — it determines which firms are available to you, the fee structure, the trading hours, and the regulatory environment.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Futures prop firms</strong> include Topstep, Apex Trader Funding, and Earn2Trade. These firms give you access to CME, CBOT, NYMEX, and COMEX products — think ES, NQ, CL, GC, and other major futures contracts. You trade on regulated exchanges through platforms like NinjaTrader, Tradovate, or Rithmic-connected software. Data feeds cost extra (<span className="font-mono text-profit">$11-$130/month</span> depending on exchange bundles), and commissions are typically <span className="font-mono text-profit">$3.00-$5.00</span> per round turn per contract.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Forex prop firms</strong> include FTMO, The5ers, MyForexFunds (or its successors), and a growing list of newer entrants. These firms offer currency pairs, indices, metals, and sometimes crypto through MetaTrader 4/5, cTrader, or DXtrade. Costs are embedded in the spread rather than explicit commissions, platform access is generally free, and there are no exchange data fees.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you already know what market you want to trade, this decision is made. If you are still deciding, consider that futures have more transparent pricing (you see exact commissions), while forex has lower upfront infrastructure costs but less transparency in execution quality.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Evaluation Types: 1-Step vs. 2-Step Challenges</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Most prop firms require you to pass an evaluation before you get funded. The two main structures are:
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">1-Step Evaluations</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You have a single phase to hit the profit target while respecting the drawdown rules. Once you pass, you move directly to a funded account. Firms like Topstep and Apex use this model. The advantage is speed — you can be funded in as few as <span className="font-mono text-profit">5-10 trading days</span> if you hit the target quickly. The downside is that some 1-step challenges have tighter drawdown limits to compensate for the shorter evaluation.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">2-Step Evaluations</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          FTMO popularized this model. Phase 1 has a higher profit target (usually <span className="font-mono text-profit">8-10%</span> of the account), and Phase 2 has a lower target (typically <span className="font-mono text-profit">5%</span>). You must pass both phases sequentially. This takes longer but often comes with more generous drawdown rules and higher account sizes. A 2-step evaluation at FTMO for a <span className="font-mono text-profit">$200,000</span> account costs around <span className="font-mono text-profit">$1,080</span>, with a profit target of $20,000 in Phase 1 and $10,000 in Phase 2.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Some firms also offer <strong className="text-profit">instant funding</strong> — you skip the evaluation entirely and start with a live funded account at a smaller size. The5ers offers this, starting around <span className="font-mono text-profit">$260</span> for a $6,000 account that scales up over time. This is ideal for traders who want to avoid the pressure of hitting a profit target on a deadline, but you start with significantly less buying power.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Drawdown Rules: The Detail That Blows Accounts</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Drawdown rules are the single most important detail in any prop firm&apos;s terms of service, and they are where most traders get tripped up. There are three main types:
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Trailing Drawdown</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your maximum loss limit moves up as your account equity increases but never moves back down. For example, Topstep&apos;s <span className="font-mono text-profit">$150,000</span> account starts with a <span className="font-mono text-profit">$4,500</span> trailing drawdown. If your account reaches $154,500 in open equity (even intraday), your drawdown floor permanently rises to $150,000. If the account then drops to $150,000, you are done. The trailing drawdown is especially punishing for traders who have large winning days followed by pullbacks. You can pass a challenge, see your account peak at $157,000, and then lose the account on a $7,000 drawdown that started from the high-water mark.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Static Drawdown (End-of-Day)</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your drawdown is measured from the initial account balance and only updates at end of day. This gives you more breathing room during intraday swings. If you start with $150,000 and a $4,500 drawdown, you can dip to $145,500 intraday without penalty as long as you close the day above that level. Some firms like FTMO use this approach, which tends to favor swing traders and traders who hold positions through volatility.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Static Drawdown (Absolute)</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The simplest type: your account cannot drop below a fixed level regardless of how high it goes. If you start at $100,000 with a <span className="font-mono text-profit">5%</span> max drawdown, your floor is always $95,000. Even if your account grows to $120,000, the floor stays at $95,000. This is the most generous drawdown type and is less common, but some firms offer it in their funded phase.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          Before committing to any firm, know exactly which drawdown type they use, when it resets, and whether it trails intraday or only at end of day. This one detail causes more blown accounts than bad trades.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Profit Splits and Payout Speed</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Profit splits range from <span className="font-mono text-profit">70/30</span> to <span className="font-mono text-profit">90/10</span> (your favor), with some firms advertising 100% payouts that have strings attached. The standard across major firms:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">FTMO:</strong> 80/20 split, scaling to 90/10 for consistent performers</li>
          <li><strong className="text-profit">Topstep:</strong> 90/10 after an initial period at 80/20 (first $10,000 in payouts)</li>
          <li><strong className="text-profit">Apex:</strong> 75/25 to 90/10 depending on the account and promo</li>
          <li><strong className="text-profit">The5ers:</strong> 80/20, scaling to 100/0 at higher tiers</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Payout speed varies significantly. Some firms process withdrawals in <span className="font-mono text-profit">24-48 hours</span>; others take <span className="font-mono text-profit">7-14 business days</span>. First payouts often have longer processing times due to KYC verification. After the first payout, most reputable firms can get money to you within a week through processors like Rise, Wise, or direct bank transfer.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Scaling Plans: The Long Game</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you plan to do this long-term, scaling plans matter. These dictate how your account size and profit split can grow over time:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">FTMO&apos;s scaling plan</strong> increases your account by 25% every four months if you hit a 10% profit target, up to $2,000,000.</li>
          <li><strong className="text-profit">The5ers</strong> scale from $6,000 all the way to $4,000,000 through milestones, though the path is long.</li>
          <li><strong className="text-profit">Topstep</strong> does not have a formal scaling plan in the traditional sense but allows you to run multiple accounts simultaneously.</li>
          <li><strong className="text-profit">Apex</strong> frequently runs promotions for larger account sizes and multiple accounts.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Day Traders vs. Swing Traders: What Matters Most</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your trading style should heavily influence your firm choice:
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">If you are a day trader</strong> (in and out within the same session), prioritize firms with tight spreads or low commissions, fast execution, and intraday trailing drawdown rules that give enough room for your stops. Futures firms like Topstep and Apex are popular with day traders because the commissions are transparent and the execution is exchange-based.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">If you are a swing trader</strong> (holding positions overnight or for multiple days), you need a firm that allows overnight and weekend holding. Many futures prop firms restrict or prohibit overnight holds. Forex firms like FTMO and The5ers are generally more accommodating for swing strategies, and their end-of-day drawdown calculations are friendlier for trades that need time to work.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Red Flags to Watch For</h2>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">No verified payout proof:</strong> If a firm cannot show consistent payouts to traders (through third-party verification or a public track record), be cautious.</li>
          <li><strong className="text-profit">Hidden rule changes:</strong> Some firms change rules after you purchase a challenge. Read the terms of service carefully and check community forums for complaints.</li>
          <li><strong className="text-profit">Unusually high profit targets:</strong> If the profit target seems unrealistic relative to the drawdown, the firm may be designed for you to fail.</li>
          <li><strong className="text-profit">Extremely aggressive promos:</strong> A <span className="font-mono text-profit">90% discount</span> on a challenge sounds great, but it often means the firm profits primarily from challenge fees rather than from successful traders.</li>
          <li><strong className="text-profit">Payout delays and excuses:</strong> Reputable firms pay on time. Consistent delays or unexplained holds on withdrawals are a serious warning sign.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">A Practical Decision Framework</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is a simple process for choosing your first (or next) prop firm:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Step 1:</strong> Decide on futures or forex based on your market knowledge and trading style.</li>
          <li><strong className="text-profit">Step 2:</strong> Filter by drawdown type. If trailing drawdown does not suit your strategy, eliminate those firms.</li>
          <li><strong className="text-profit">Step 3:</strong> Compare the total cost of getting funded — challenge fee, likely resets, activation, ongoing data feeds, and platform costs.</li>
          <li><strong className="text-profit">Step 4:</strong> Check the firm&apos;s payout track record. Look for reviews, community feedback, and verified payout data.</li>
          <li><strong className="text-profit">Step 5:</strong> Start with one firm. Do not run challenges at five firms simultaneously until you have proven you can pass and manage a funded account at one.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Choosing the right prop firm is not about finding the cheapest challenge or the highest profit split in isolation. It is about finding the combination of rules, costs, and structure that aligns with how you actually trade. The best firm is the one where you can follow the rules consistently without forcing yourself into a different trading style.
        </p>

        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          Once you are funded, tracking the real cost of each firm becomes just as important as choosing the right one. The firm that looks cheapest on paper may not be cheapest after factoring in resets, data fees, and payout processing.
        </blockquote>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            Track your real P&L across every firm
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Prop PNL connects to your bank and shows you the true cost and profit per firm. No spreadsheets required.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank - Free
          </Link>
        </div>
      </>
    ),
  },
  {
    slug: 'mistakes-that-blow-funded-accounts',
    title: '5 Mistakes That Get You Blown Out of a Funded Account',
    description:
      'You passed the challenge. Now the real test starts. These five mistakes end more funded accounts than bad market conditions ever will.',
    date: '2025-12-30',
    readTime: '8 min read',
    tags: ['funded accounts', 'risk management', 'mistakes'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Passing a prop firm challenge is hard. Only about <span className="font-mono text-profit">4-5%</span> of traders make it through on their first attempt. But here is the part nobody talks about enough: the average funded account lasts roughly <span className="font-mono text-profit">three weeks</span> before the trader violates a rule or hits the drawdown limit. Getting funded is not the finish line. It is where the real test begins.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          After talking to dozens of funded traders and analyzing community data, the same five mistakes show up over and over again. These are not exotic edge cases. They are predictable patterns that blow accounts with almost mechanical reliability. Here is what they are and how to avoid them.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Mistake #1: Oversizing After Passing the Challenge</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You traded 2 contracts of ES during the evaluation. You were disciplined, patient, and methodical. You passed. Now you have a <span className="font-mono text-profit">$150,000</span> funded account and the rules allow up to 15 contracts. On day one, you start trading 5, 8, or 10 contracts because — you reason — you have &quot;proven yourself&quot; and want to maximize your payouts.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is the most common account killer. The strategy that passed your challenge was calibrated for a specific position size. The risk per trade, the stop loss placement, the mental comfort with drawdowns — all of it was built around 2 contracts. When you triple or quadruple your size overnight, everything breaks.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          With 2 contracts on ES, a 10-point adverse move costs you <span className="font-mono text-profit">$1,000</span>. With 8 contracts, that same move costs <span className="font-mono text-profit">$4,000</span>. On a $150,000 account with a <span className="font-mono text-profit">$4,500</span> trailing drawdown, a single bad trade at 8 contracts can consume nearly your entire buffer. The math that felt safe at 2 contracts becomes catastrophic at 8.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">How to Avoid It</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Trade the funded account at the same size you used to pass the challenge for at least the first <span className="font-mono text-profit">2-4 weeks</span>. If you traded 2 contracts during the eval, trade 2 contracts funded. Only increase size after you have built a profit buffer that can absorb the larger drawdowns. A reasonable rule: increase by 1 contract for every <span className="font-mono text-profit">$2,000</span> in profit above your starting balance.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Mistake #2: Ignoring Trailing Drawdown Mechanics</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Trailing drawdown is the rule that kills the most funded accounts at firms like Topstep and Apex, and it works differently than most traders intuitively expect.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is a scenario. You have a <span className="font-mono text-profit">$150,000</span> account with a <span className="font-mono text-profit">$4,500</span> trailing drawdown. Your floor starts at $145,500. On Monday, you have a great day — your account peaks at <span className="font-mono text-profit">$154,200</span> in open equity during a trade. Even if you close the trade at $152,000, your drawdown floor has permanently moved up to <span className="font-mono text-profit">$149,700</span> (the peak of $154,200 minus $4,500). Your effective cushion from your current balance of $152,000 is now only <span className="font-mono text-profit">$2,300</span>, not $4,500.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Many traders do not realize the drawdown trails on <strong className="text-profit">open equity</strong>, not closed P&L. An unrealized gain during an intraday spike can permanently shrink your buffer. You can have a winning day and still lose half your available drawdown.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">How to Avoid It</h3>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Know exactly how your firm calculates trailing drawdown — open equity vs. closed P&L, intraday vs. end of day.</li>
          <li>Use a tracking tool or write down your current drawdown floor after every session.</li>
          <li>Consider scaling out of winners rather than letting the full position ride, since the trailing drawdown penalizes unrealized peaks.</li>
          <li>Be especially careful in the first few days of funded trading when your buffer is smallest.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Mistake #3: Revenge Trading After a Red Day</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You lose <span className="font-mono text-profit">$1,200</span> in the morning session. Your drawdown limit feels uncomfortably close. Instead of stopping for the day, you tell yourself &quot;I just need one good trade to get back to even.&quot; You re-enter the market, usually with larger size or looser stops, trying to recover the loss. The result, more often than not, is a second loss that compounds the first. Now you are down <span className="font-mono text-profit">$2,500</span> and your funded account is on life support.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Revenge trading is a well-documented behavioral pattern. After a loss, the brain experiences it as a threat, triggering the amygdala and shifting you from analytical thinking to emotional reaction. Your ability to read the market objectively is genuinely impaired. This is not a willpower problem — it is neurochemistry.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">How to Avoid It</h3>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Set a <strong className="text-profit">daily loss limit</strong> before the session starts. When you hit it, you are done for the day. No exceptions.</li>
          <li>A reasonable daily loss limit is <span className="font-mono text-profit">30-40%</span> of your trailing drawdown. On a $4,500 drawdown, that means stopping at $1,350-$1,800 in losses.</li>
          <li>Physically step away from the screen. Close the platform. The market will be there tomorrow.</li>
          <li>If you find yourself thinking &quot;I just need one more trade,&quot; that is the signal to stop immediately.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Mistake #4: Not Adjusting for News Events</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          FOMC announcements, CPI releases, Non-Farm Payrolls, GDP reports — these scheduled news events create massive volatility spikes that can move ES <span className="font-mono text-profit">30-50 points</span> in minutes. Many prop firms have specific rules about trading during news events (some ban it outright; others restrict position sizes), but even at firms that allow it, news trading in a funded account is disproportionately risky.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The problem is asymmetric. On your best news trade, you might make <span className="font-mono text-profit">$2,000</span>. On your worst, you might get slipped through your stop and lose <span className="font-mono text-profit">$3,000-$5,000</span> in seconds. When you only have $4,500 of drawdown room, that single slip can end the account. Professional prop firms can absorb these swings. Funded traders with tight drawdown limits cannot.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">How to Avoid It</h3>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Bookmark an economic calendar (ForexFactory or TradingEconomics) and check it every morning before trading.</li>
          <li>For high-impact events (FOMC, CPI, NFP), either sit out entirely or reduce your position size to <span className="font-mono text-profit">25%</span> of normal.</li>
          <li>Close all open positions at least <span className="font-mono text-profit">15 minutes</span> before a scheduled announcement.</li>
          <li>If your firm bans news trading, know the exact blackout windows. A violation can cost you the account even if the trade was profitable.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Mistake #5: Treating Funded Money Like It&apos;s Not Real</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is the most insidious mistake because it operates subconsciously. The funded account is not &quot;your&quot; money. It is the firm&apos;s capital (or a simulated version of it). This psychological distance makes traders take risks they would never take with their own savings.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Researchers call this the <strong className="text-profit">house money effect</strong>. In casino studies, gamblers who are playing with winnings (rather than their original stake) consistently make larger and riskier bets. The same dynamic plays out in funded accounts. &quot;It&apos;s not my money, so what do I have to lose?&quot; What you have to lose is the <span className="font-mono text-profit">$500-$2,000</span> you spent getting funded, plus the months of work it took to pass the challenge, plus the future payouts you would have earned from a properly managed account.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">How to Avoid It</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Reframe the funded account as <strong className="text-profit">your business asset</strong>. Calculate the total cost of getting funded: challenge fees, resets, data feeds, time invested. That is what you have at stake. If you spent $1,500 getting funded and the account can generate $2,000-$5,000 per month in payouts, blowing it is not a zero-cost event. It is a $1,500 loss plus the opportunity cost of months of future income.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Some traders find it helpful to write the total cost of getting funded on a sticky note and put it on their monitor. When temptation hits to take an impulsive trade, that number serves as a concrete reminder of what is actually at risk.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Common Thread</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          All five mistakes share a root cause: <strong className="text-profit">the rules of funded trading are different from the challenge</strong>, and most traders do not adjust. In the challenge, the goal is to hit a profit target. In the funded account, the goal flips — it becomes about protecting the account and extracting consistent payouts over time. The traders who survive are the ones who make that mental shift on day one.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          The challenge tests whether you can make money. The funded account tests whether you can keep it.
        </blockquote>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            Know exactly where you stand
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Prop PNL tracks every payout and fee automatically so you can see the real cost of each funded account.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank - Free
          </Link>
        </div>
      </>
    ),
  },
  {
    slug: 'futures-vs-forex-prop-firms',
    title: 'Futures vs Forex Prop Firms: Which Is Right for You?',
    description:
      'Market hours, fees, leverage, available firms — a direct comparison to help you decide between futures and forex prop trading.',
    date: '2025-12-23',
    readTime: '9 min read',
    tags: ['futures', 'forex', 'comparison'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you are considering prop firm trading, one of the first decisions you will face is whether to trade futures or forex. Both markets have thriving prop firm ecosystems, but they differ in meaningful ways — from market hours and fee structures to the firms themselves and the types of traders who succeed in each. This guide lays out the differences honestly so you can make an informed choice.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The short answer: neither is objectively better. The right choice depends on your schedule, trading style, risk tolerance, and experience. Here is the longer answer.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Market Hours and Session Structure</h2>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Futures</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Futures markets are open nearly 23 hours per day on weekdays, but the real action happens during specific sessions. The US session (<span className="font-mono text-profit">9:30 AM - 4:00 PM ET</span>) for equity index futures (ES, NQ, YM) has the highest volume and tightest spreads. The overnight session tends to be thinner with wider spreads and less predictable price action. Most futures prop firms restrict trading to specific hours or discourage overnight holds, which effectively limits you to the US session.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Forex</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Forex is a true <span className="font-mono text-profit">24/5</span> market, running from Sunday evening to Friday evening ET. The three main sessions — Asian (<span className="font-mono text-profit">7 PM - 4 AM ET</span>), London (<span className="font-mono text-profit">3 AM - 12 PM ET</span>), and New York (<span className="font-mono text-profit">8 AM - 5 PM ET</span>) — each have their own character. London and New York overlap is the highest-volume period for major pairs like EUR/USD and GBP/USD. Forex prop firms generally allow trading during any session, and many permit overnight and weekend holding.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Bottom line:</strong> If you have a day job and can only trade outside US market hours, forex gives you more flexibility. If you trade full-time during US hours, both markets work.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Fee Structures: Transparent vs. Embedded</h2>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Futures Costs</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Futures trading costs are explicit and itemized:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Commissions:</strong> <span className="font-mono text-profit">$3.00-$5.00</span> per round turn per contract. If you trade 10 contracts/day, that is $30-$50/day in commissions alone.</li>
          <li><strong className="text-profit">Exchange fees:</strong> Small per-contract fees (usually included in the commission quote from your firm).</li>
          <li><strong className="text-profit">Data feed fees:</strong> <span className="font-mono text-profit">$11-$130/month</span> depending on which exchanges you need. CME Level 1 data for ES/NQ is around $11/month; full bundle across exchanges runs higher.</li>
          <li><strong className="text-profit">Platform fees:</strong> NinjaTrader lease at $75/month, Tradovate subscriptions, or similar. Some firms include platform access; others do not.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Total monthly infrastructure cost for an active futures trader: <span className="font-mono text-profit">$100-$300/month</span> before you make a single trade.
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Forex Costs</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Forex costs are primarily embedded in the spread:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Spread:</strong> The difference between bid and ask. EUR/USD might have a <span className="font-mono text-profit">0.8-1.5 pip</span> spread depending on the broker and session. Each pip on a standard lot is $10, so a 1-pip spread costs $10 per round trip on one standard lot.</li>
          <li><strong className="text-profit">Commission (sometimes):</strong> Some accounts charge a small commission plus a tighter spread. ECN-style accounts might charge <span className="font-mono text-profit">$6-$7</span> per round turn per lot with raw spreads near zero.</li>
          <li><strong className="text-profit">Swap/rollover:</strong> If you hold positions overnight, you pay or receive a small interest charge depending on the currency pair and direction.</li>
          <li><strong className="text-profit">Platform fees:</strong> MetaTrader 4/5 and cTrader are generally free. No data feed charges.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Total monthly infrastructure cost for a forex trader: effectively <span className="font-mono text-profit">$0</span> in fixed costs. All costs are embedded in the trading itself.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          Futures costs are higher but transparent. Forex costs are lower upfront but harder to quantify precisely since they depend on spreads at the moment of execution.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Leverage and Margin</h2>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Futures</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Futures contracts have standardized margin requirements set by the exchanges. One ES contract controls approximately <span className="font-mono text-profit">$270,000</span> in notional value (at ES ~5400) with an intraday margin of roughly <span className="font-mono text-profit">$500-$1,000</span> at most brokers. That is effective leverage of <span className="font-mono text-profit">270:1 to 540:1</span>. Micro contracts (MES) at 1/10th the size offer a way to manage this leverage with smaller accounts.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          In prop firm accounts, your leverage is effectively capped by the contract limits the firm sets. A $50,000 account at Topstep might allow up to 5 ES contracts, which is still significant leverage.
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Forex</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Forex prop firms typically offer leverage between <span className="font-mono text-profit">1:30</span> and <span className="font-mono text-profit">1:100</span>, depending on the firm and the regulatory environment. A $100,000 account at 1:100 leverage gives you control of <span className="font-mono text-profit">$10,000,000</span> in notional value. In practice, responsible position sizing means you rarely use anywhere near the full leverage available. Most successful forex prop traders use effective leverage below <span className="font-mono text-profit">1:10</span> on any given trade.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Key difference:</strong> Futures leverage is controlled by contract count and feels more intuitive (1 contract = X dollars per point). Forex leverage is percentage-based and can be more confusing for beginners, leading to accidental oversizing.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Available Firms: Your Options</h2>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Top Futures Prop Firms</h3>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Topstep:</strong> The most established futures prop firm. 1-step evaluation, trailing drawdown, 80/20 to 90/10 profit split. Monthly subscription model for the evaluation.</li>
          <li><strong className="text-profit">Apex Trader Funding:</strong> Known for aggressive promotional pricing (challenges as low as $17 during sales). 1-step evaluation, trailing drawdown, multiple account options. Very popular among newer traders due to affordability.</li>
          <li><strong className="text-profit">Earn2Trade:</strong> Offers both a Trader Career Path (progressive evaluation) and standard challenges. Partners with real brokers for funded accounts.</li>
        </ul>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Top Forex Prop Firms</h3>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">FTMO:</strong> The gold standard for forex prop firms. 2-step evaluation, end-of-day drawdown, 80/20 to 90/10 profit split, scaling plan up to $2M. Based in Czech Republic.</li>
          <li><strong className="text-profit">The5ers:</strong> Offers instant funding (no evaluation) and a hyper-growth program. Unique scaling from small accounts to $4M+. Based in Israel.</li>
          <li><strong className="text-profit">Funded Next:</strong> 1-step and 2-step options, competitive pricing, express model for faster funding.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Which Trading Styles Suit Each Market</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Scalpers</strong> (holding for seconds to minutes): Both markets work, but futures offer more transparent fills on regulated exchanges. Forex scalpers need to be careful about spread widening during low-liquidity periods.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Day traders</strong> (in and out within one session): Futures are popular because the US session provides concentrated volume and clear open/close times. Forex day traders can choose any session but need to match their pairs to the active session.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Swing traders</strong> (holding for days to weeks): Forex is generally better here. Most futures prop firms restrict or prohibit overnight holds, while forex firms typically allow them. Swap fees on forex are usually small relative to the expected profit on a swing trade.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">News traders:</strong> Both markets react strongly to economic data. However, many prop firms restrict or ban trading around major news events, regardless of the market. Check the specific rules before planning a news-based strategy.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Account Sizes and Payouts</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Futures prop firm accounts typically range from <span className="font-mono text-profit">$25,000 to $300,000</span>. Most traders start with $50,000-$150,000 accounts. Payouts are processed through bank wire, ACH, or services like Rise.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Forex prop firm accounts range from <span className="font-mono text-profit">$5,000 to $400,000</span>, with scaling plans that can push accounts into seven figures over time. Payouts typically process through Rise, Wise, or direct bank transfer.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Both markets offer similar profit splits (80/20 to 90/10), and payout speed is comparable — typically <span className="font-mono text-profit">1-7 business days</span> after requesting a withdrawal, with first payouts sometimes taking longer.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Decision Matrix</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is a quick summary to help you decide:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Choose futures if:</strong> You prefer transparent fees, trade during US market hours, favor day trading or scalping, and are comfortable paying for data feeds and platforms.</li>
          <li><strong className="text-profit">Choose forex if:</strong> You want lower upfront costs, trade outside US hours, prefer swing trading, or want access to more diverse instruments (pairs, indices, metals).</li>
          <li><strong className="text-profit">Consider both if:</strong> You have experience in multiple markets and want to diversify your prop firm portfolio. Some traders run a futures account at Topstep and a forex account at FTMO simultaneously.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Whichever market you choose, the fundamentals of success remain the same: risk management, consistency, and a clear understanding of the total cost structure. The market matters less than your ability to trade it profitably within a prop firm&apos;s rules.
        </p>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            Track your P&L across futures and forex firms
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Whether you trade at Topstep, FTMO, or both — Prop PNL auto-tracks every payout and fee from your bank transactions.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank - Free
          </Link>
        </div>
      </>
    ),
  },
  {
    slug: 'after-passing-prop-firm-challenge',
    title: 'What Happens After You Pass a Prop Firm Challenge',
    description:
      'You passed the evaluation. Now what? Activation fees, KYC, platform setup, rule changes, and the mental shift that determines whether you keep the account.',
    date: '2025-12-16',
    readTime: '7 min read',
    tags: ['challenges', 'funded accounts', 'guide'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You hit the profit target. You respected the drawdown rules. The dashboard says &quot;Passed.&quot; After weeks or months of evaluating, it feels like the hard part is over. It is not. What happens between passing and actually trading a funded account involves several steps, some hidden costs, and a fundamental shift in how you need to approach the market.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This guide walks through everything that happens after you pass, so you know exactly what to expect and can avoid the surprises that catch most traders off guard.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 1: The Activation Fee</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Many firms charge an activation fee to transition you from the evaluation to the funded account. This is separate from the challenge fee you already paid. The range is significant:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Topstep:</strong> Charges an activation fee (currently around <span className="font-mono text-profit">$149</span>) but refunds it with your first payout.</li>
          <li><strong className="text-profit">FTMO:</strong> No separate activation fee. The challenge fee itself is refunded with your first profit split.</li>
          <li><strong className="text-profit">Apex:</strong> Activation fees vary by account size, typically <span className="font-mono text-profit">$85-$175</span>.</li>
          <li><strong className="text-profit">Smaller or newer firms:</strong> Some charge activation fees as high as <span className="font-mono text-profit">$500-$800</span> with no refund. This is a red flag worth investigating.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Always check the activation fee before purchasing a challenge. A $200 challenge that requires a $400 activation fee is really a $600 challenge. Factor this into your total cost analysis.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 2: KYC Verification</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Before you receive funded account credentials, you will need to complete Know Your Customer (KYC) verification. This typically requires:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Government-issued photo ID (passport or driver&apos;s license)</li>
          <li>Proof of address (utility bill or bank statement, usually less than 3 months old)</li>
          <li>Sometimes a selfie or video verification</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          KYC processing typically takes <span className="font-mono text-profit">1-3 business days</span> but can take longer if documents need resubmission. Have your documents ready before you pass so this does not delay your funding. Some traders have waited <span className="font-mono text-profit">1-2 weeks</span> for KYC approval at busy periods, which is frustrating when you are eager to start trading.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 3: The Trader Agreement</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You will be asked to sign a trader agreement or independent contractor agreement. <strong className="text-profit">Read this document carefully.</strong> It contains the rules of your funded account, which may differ from your evaluation rules. Key things to look for:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Drawdown rules:</strong> Some firms use different drawdown calculations in the funded phase than in the evaluation. The trailing drawdown might be tighter, or the daily loss limit might be lower.</li>
          <li><strong className="text-profit">Restricted instruments or hours:</strong> Your evaluation may have allowed trading any product, but the funded account might restrict certain contracts or sessions.</li>
          <li><strong className="text-profit">Consistency rules:</strong> Some firms require that no single day&apos;s profit exceeds a certain percentage of your total P&L. This means one massive green day can actually work against you if it looks like gambling rather than consistent execution.</li>
          <li><strong className="text-profit">Payout conditions:</strong> Minimum trading days before first withdrawal, minimum profit thresholds, and payout request windows.</li>
        </ul>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          The trader agreement is a contract. The rules in it override anything you read on the marketing page. If there is a conflict, the agreement wins.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 4: Getting Your Credentials and Platform Setup</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Once KYC is approved and the agreement is signed, you will receive login credentials for your funded account. For futures firms, this usually means a Rithmic or Tradovate login. For forex firms, it is a MetaTrader 4/5 or cTrader login.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is where some hidden costs appear:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Platform subscriptions:</strong> During the evaluation, some firms bundle platform access into the challenge fee. Once funded, you may need your own platform subscription. NinjaTrader at <span className="font-mono text-profit">$75/month</span>, for example, might now be your responsibility.</li>
          <li><strong className="text-profit">Data feed charges:</strong> Similarly, real-time market data that was included in the evaluation might now be a separate charge. CME data at <span className="font-mono text-profit">$11-$25/month</span> per exchange adds up when you trade products across multiple exchanges.</li>
          <li><strong className="text-profit">Connection fees:</strong> Some data providers charge a monthly connection fee on top of exchange fees. Rithmic connections can be <span className="font-mono text-profit">$25-$30/month</span> through certain providers.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Before your first funded trade, add up these new monthly costs. A funded account that costs <span className="font-mono text-profit">$150/month</span> just to keep active needs to generate at least that much in payouts to break even.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 5: Your First Trades and Early Restrictions</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Some firms impose restrictions during the early days of funded trading:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Minimum trading days:</strong> You might need to trade for <span className="font-mono text-profit">5-10 days</span> before requesting your first payout. This prevents traders from taking one big swing, cashing out, and disappearing.</li>
          <li><strong className="text-profit">Position size ramp-up:</strong> A few firms start you at reduced contract limits for the first week, then unlock full size. Check if your firm does this.</li>
          <li><strong className="text-profit">First payout waiting period:</strong> Some firms require <span className="font-mono text-profit">14-30 days</span> of funded trading before you can request your first withdrawal, regardless of profit.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          These restrictions are rarely deal-breakers, but they matter for your planning. If you expected to take a payout in week one and the firm requires 14 days, that changes your cash flow timeline.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 6: The Payout Schedule</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Once you are eligible, payout schedules vary by firm:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">FTMO:</strong> Payouts on a <span className="font-mono text-profit">monthly cycle</span>, typically 14 days after your cycle ends. You request, they process.</li>
          <li><strong className="text-profit">Topstep:</strong> Payouts can be requested once you meet minimum requirements. Processing is typically <span className="font-mono text-profit">2-5 business days</span>.</li>
          <li><strong className="text-profit">Apex:</strong> Twice-monthly payout windows with specific request dates.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your first payout will likely take the longest — <span className="font-mono text-profit">7-14 business days</span> is common for the initial withdrawal due to additional verification. Subsequent payouts are usually faster. Most firms pay through Rise, Wise, or direct bank transfer.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 7: Scaling Milestones</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you maintain profitability and follow the rules, many firms offer scaling opportunities:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">FTMO:</strong> 25% account increase every 4 months if you hit a 10% profit target, up to $2,000,000.</li>
          <li><strong className="text-profit">The5ers:</strong> Progressive milestones that can take a $6,000 account to $4,000,000 over time.</li>
          <li><strong className="text-profit">Topstep:</strong> Allows multiple simultaneous accounts rather than a single scaling path.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Scaling is the long game of prop trading. The traders who reach higher tiers are the ones who prioritize account preservation over aggressive profit targets.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Mental Shift: From Target to Protection</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is the most important part of the post-challenge transition, and it is entirely psychological.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          During the evaluation, your mindset was <strong className="text-profit">&quot;hit the target.&quot;</strong> You needed to reach a specific profit number within a specific timeframe. This naturally pushes toward aggressive trading — larger sizes, more trades, holding winners longer to maximize gains.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          In the funded account, the mindset must flip to <strong className="text-profit">&quot;protect the account.&quot;</strong> There is no profit target. There is no deadline. The goal is to extract consistent payouts over months and years without violating the drawdown. This means smaller position sizes, tighter risk per trade, and the discipline to stop trading on red days before the damage accumulates.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Traders who do not make this shift tend to blow the funded account within the first few weeks. They keep trading like they are in a challenge — oversized, aggressive, impatient — and the trailing drawdown catches them.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          The challenge asks: can you make money? The funded account asks: can you keep the account alive while making money slowly? They are fundamentally different games.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Checklist: After Passing Your Challenge</h2>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Check for activation fees and pay them promptly to avoid delays</li>
          <li>Complete KYC with clean, legible documents</li>
          <li>Read the trader agreement thoroughly — especially drawdown rules and payout conditions</li>
          <li>Set up your platform and data feeds; budget for new monthly costs</li>
          <li>Trade the same size you used in the evaluation for the first 2-4 weeks</li>
          <li>Set a daily loss limit at 30-40% of your trailing drawdown</li>
          <li>Know your payout schedule and minimum requirements before your first trade</li>
          <li>Track every cost — activation, platform, data, commissions — from day one</li>
        </ul>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            Track your funded account costs from day one
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Prop PNL connects to your bank and auto-tracks activation fees, platform costs, and payouts. Know your real P&L from the start.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank - Free
          </Link>
        </div>
      </>
    ),
  },
  {
    slug: 'why-most-prop-traders-fail',
    title: 'Why Most Prop Traders Fail (And How to Beat the Odds)',
    description:
      'Only 4-5% pass challenges, and most funded accounts last weeks. Here are the real reasons prop traders fail and what the successful minority does differently.',
    date: '2025-12-09',
    readTime: '11 min read',
    tags: ['profitability', 'psychology', 'strategy'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The numbers in prop trading are brutal when you look at them honestly. Across the industry, only about <span className="font-mono text-profit">4-5%</span> of traders pass their evaluation on the first attempt. Of those who get funded, the average account lasts roughly <span className="font-mono text-profit">3 weeks</span> before the trader either violates a rule or hits the maximum drawdown. And of the traders who do survive the initial funded period, approximately <span className="font-mono text-profit">60%</span> never reach net profitability when all costs are factored in.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          These are not numbers designed to scare you away. They are the reality of the business. And understanding why most traders fail is the first step toward being in the small percentage that does not.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Real Failure Rate</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Let us put the math in perspective. If you take 1,000 traders who purchase a prop firm challenge:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><span className="font-mono text-profit">~50</span> will pass the evaluation (5%)</li>
          <li><span className="font-mono text-profit">~30</span> of those will survive the first month funded</li>
          <li><span className="font-mono text-profit">~15</span> will still be funded after 3 months</li>
          <li><span className="font-mono text-profit">~6</span> will be net profitable after accounting for all fees</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          That is a <span className="font-mono text-profit">0.6%</span> success rate from start to sustained profitability. This does not mean prop trading is a scam — it means it is a genuinely difficult endeavor where most participants underestimate what is required.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Some firms have published their own data. FTMO reported that approximately <span className="font-mono text-profit">10%</span> of traders who start their challenge pass both phases. Topstep has indicated similar pass rates for their Trading Combine. The numbers are consistent: the vast majority do not make it.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Root Cause #1: Undercapitalization of the Business</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is the most overlooked reason for failure. Traders focus on the funded account capital (the $50,000 or $150,000 the firm provides) and forget that <strong className="text-profit">they are running a business</strong> that requires its own capital.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The business expenses of prop trading include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Challenge fees: <span className="font-mono text-profit">$150-$1,080</span> per attempt</li>
          <li>Reset fees: <span className="font-mono text-profit">$59-$169</span> per reset (budget for 2-4)</li>
          <li>Data feeds: <span className="font-mono text-profit">$11-$130/month</span></li>
          <li>Platform subscriptions: <span className="font-mono text-profit">$0-$75/month</span></li>
          <li>Activation fees: <span className="font-mono text-profit">$0-$500</span></li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A trader who budgets <span className="font-mono text-profit">$300</span> for &quot;one challenge&quot; and expects to be funded and profitable within a month is undercapitalized. Realistically, you should have <span className="font-mono text-profit">$2,000-$5,000</span> allocated to prop trading as a business expense before you expect to see returns. This covers multiple challenge attempts, the inevitable resets, and several months of infrastructure costs.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Traders who are undercapitalized put pressure on themselves to pass quickly, which leads to overleveraging, rushing setups, and taking trades they should skip. The financial pressure creates the psychological pressure that causes failure.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Root Cause #2: No Edge Before Taking the Challenge</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Many traders purchase a prop firm challenge as their entry point into trading, rather than as a tool to leverage an existing skill. They see the marketing — &quot;Trade $100,000 for just $250&quot; — and think the funded capital is the missing ingredient. It is not. The missing ingredient is a profitable trading strategy, and no amount of funded capital fixes that.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A trader with a genuine edge — a strategy that has been tested over hundreds of trades in a demo account with consistent positive expectancy — has a reasonable shot at passing a challenge and maintaining a funded account. A trader who is still experimenting with strategies, indicators, and timeframes is essentially paying the prop firm for a very expensive demo account.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          If you cannot consistently profit in a free demo account over 3 months, a paid challenge will not change the outcome. It will just add a financial loss to a skill deficit.
        </blockquote>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">What an Edge Actually Looks Like</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A trading edge is not a feeling or a favorite indicator. It is a measurable statistical advantage. Specifically:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>A <strong className="text-profit">win rate</strong> and <strong className="text-profit">risk-reward ratio</strong> that produce positive expected value over a large sample size (200+ trades minimum)</li>
          <li>A defined set of entry and exit rules that you can execute consistently without improvising</li>
          <li>Performance that holds up across different market conditions (trending, ranging, volatile, quiet)</li>
          <li>Results in a demo account that would pass the challenge rules you are considering</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you cannot clearly articulate your edge in two sentences, you probably do not have one yet. And that is fine — just develop it before spending money on challenges.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Root Cause #3: Treating It as Gambling</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Prop firm marketing, especially during aggressive promotional periods, can make challenges feel like lottery tickets. &quot;$17 for a shot at a $300,000 account!&quot; The framing is almost identical to gambling marketing: small risk, massive potential reward, emphasis on the upside.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Traders who buy into this framing treat the challenge accordingly. They take maximum risk because the entry cost was low, make impulsive trades because &quot;it&apos;s only $17,&quot; and when they blow the account, they buy another one. And another. And another.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Over time, these &quot;cheap&quot; challenges add up. Ten $17 challenges at Apex with a few resets each can easily reach <span className="font-mono text-profit">$500-$1,000</span>. Twenty attempts can hit <span className="font-mono text-profit">$2,000+</span>. At that point, the &quot;cheap&quot; challenge was more expensive than a single full-price evaluation at a firm with better rules.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The gambling mindset also shows up in position sizing. A trader who views the challenge as a lottery ticket is more likely to max out their contract limits, risk hitting the drawdown on a single trade, and hope for a big win to quickly hit the profit target. This is the exact opposite of the approach that leads to long-term funded account success.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Root Cause #4: Poor Risk Management</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is the most direct cause of blown accounts, and it manifests in several specific ways:
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">No Daily Loss Limit</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Many firms impose a daily loss limit (typically <span className="font-mono text-profit">1-2%</span> of the account). But even at firms that do not, you need your own. A trader with a $150,000 account and a $4,500 trailing drawdown who loses <span className="font-mono text-profit">$3,000</span> in one day has used up 67% of their buffer. If they trade the next day in a compromised mental state and lose another $1,500, the account is gone.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Inconsistent Position Sizing</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Trading 2 contracts on Monday, 8 on Tuesday, and 4 on Wednesday creates wildly different risk profiles each day. Professional risk management means consistent position sizing relative to the account balance and drawdown available. If your max risk per trade is <span className="font-mono text-profit">$500</span>, every trade should risk approximately $500. Not $500 on one trade and $2,000 on the next because you &quot;feel confident.&quot;
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">No Stop Losses</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Some traders argue that mental stops are sufficient. In a prop firm account with trailing drawdown, they are not. A single moment of freezing — staring at a position moving against you, hoping it will come back — can end the account. Hard stop losses placed at the time of entry are non-negotiable in funded accounts.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Root Cause #5: Ignoring Total Costs</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A trader who &quot;made $4,000 this month&quot; from payouts but spent $1,500 on challenge fees, resets, and data feeds actually made $2,500. If they also paid <span className="font-mono text-profit">$800</span> in commissions and the firm took a <span className="font-mono text-profit">20%</span> profit split, the real number is lower still. Many traders who believe they are profitable are actually breaking even or losing money because they only track the payout side and ignore the expense side.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is not just a bookkeeping issue — it is a strategic one. If you do not know your true P&L, you cannot make informed decisions about which firms to continue with, whether to increase or decrease the number of accounts you run, or whether prop trading is even the right path for you.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">What the Successful 5% Do Differently</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The traders who survive and profit from prop firms are not necessarily more talented. They are more disciplined and more realistic. Here is what they tend to do:
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">1. Smaller Position Sizes</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Successful prop traders rarely use more than <span className="font-mono text-profit">30-50%</span> of their allowed contract limit. On a $150,000 account that allows 15 ES contracts, they trade 3-5. This gives them room to be wrong multiple times without hitting the drawdown. It also makes the emotional impact of each trade smaller, which leads to better decision-making.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">2. Longer Track Record Before Challenges</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          They typically have <span className="font-mono text-profit">3-6 months</span> or more of demo trading data before spending money on a challenge. They know their win rate, average win, average loss, and expected drawdowns. They pick a challenge whose rules match their actual trading statistics, rather than choosing a challenge and trying to adapt their trading to fit.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">3. Fewer Firms at Once</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          While some traders run evaluations at <span className="font-mono text-profit">5-10</span> firms simultaneously, the most successful ones typically focus on <span className="font-mono text-profit">1-2</span> firms. This reduces complexity, cost, and the cognitive load of managing different rule sets. It is better to fully understand one firm&apos;s rules and master them than to spread yourself thin across many.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">4. They Track All Costs</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Every challenge fee, every reset, every data feed charge, every commission. They know their exact break-even point and their real net P&L at all times. This is not optional — it is the foundation of treating prop trading as a business rather than a hobby.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">5. They Have Rules and Follow Them</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Daily loss limits, maximum position sizes, minimum risk-reward ratios, mandatory stop losses, no trading during high-impact news. These are not suggestions — they are hard rules that are followed every single day, regardless of how they feel. The consistency of the process matters more than the outcome of any individual trade.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Mindset Shift: Business, Not Lottery</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The single biggest differentiator between traders who fail and traders who succeed in prop firms is how they frame the activity. Failed traders treat it like a lottery with cheap tickets and big potential payoffs. Successful traders treat it like a business with startup costs, operating expenses, and a margin they need to maintain.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Businesses track revenue and expenses. They calculate profit margins. They cut unprofitable product lines. They reinvest strategically. They do not make decisions based on hope or gut feeling.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you are spending money on prop firm challenges, you are running a business. The question is whether you are running it well. That starts with knowing your numbers — all of them, including the uncomfortable ones.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          You do not need to be in the top 1% of traders to profit from prop firms. You need to be in the top 5%, and the path there is paved with discipline, realistic expectations, and relentless cost awareness — not with talent or luck.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Know Your Real Numbers</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You cannot fix what you do not measure. The first step to beating the odds is knowing exactly where you stand: total spent, total earned, and the real difference between the two. Not an estimate. Not a feeling. The actual number from your bank account.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If that number is positive, you are ahead of the vast majority. If it is negative, you now have the clarity to decide whether to adjust your approach or reallocate your capital. Either way, the truth is more useful than the illusion.
        </p>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            See your real prop trading P&L
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Prop PNL connects to your bank and auto-tracks every payout and expense. No spreadsheets, no guessing — just the real number.
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-profit hover:bg-profit/90 text-terminal-bg font-mono font-medium rounded-lg text-sm transition-colors"
          >
            Connect Your Bank - Free
          </Link>
        </div>
      </>
    ),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
