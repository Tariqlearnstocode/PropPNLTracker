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
  {
    slug: 'prop-firm-payout-processors-explained',
    title: 'Prop Firm Payout Processors Explained: Rise, Wise, Stripe and More',
    description:
      'How prop firm payouts actually reach your bank — Rise, Wise, Stripe, PayPal and direct transfers explained, with what each looks like on your bank statement.',
    date: '2025-05-20',
    readTime: '9 min read',
    tags: ['education', 'payouts', 'processors'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You passed the challenge, traded the funded account, and requested a payout. Then what? The money does not teleport from your prop firm&apos;s bank account to yours. It passes through a payout processor — a third-party company that handles the actual movement of funds. Which processor a firm uses determines how fast you get paid, what fees are deducted, and critically, what the deposit looks like on your bank statement.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          That last point matters more than most traders realize. When you are trying to track your real P&L — whether in a spreadsheet or through bank-connected software — the name on the deposit is often not the prop firm&apos;s name. It is the processor&apos;s name. And if you trade with three firms that all pay through Rise, you get three deposits that all say &quot;Riseworks&quot; with no indication of which firm sent the money. This is where tracking breaks down.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is how the payout chain works and what to expect from each major processor.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">How the Payout Chain Works</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The flow is straightforward in concept: <strong className="text-profit">Prop Firm → Payout Processor → Your Bank</strong>. But each step has its own timeline, fees, and complications.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          When you request a withdrawal from your prop firm dashboard, the firm initiates a payment through their chosen processor. The processor receives the funds from the firm (or holds them in escrow ahead of time), converts currency if needed, deducts any processing fees, and then sends the remaining amount to your bank account via ACH, wire transfer, or local bank rails depending on the processor and your country.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The entire process typically takes <span className="font-mono text-profit">1-7 business days</span> from the time you hit &quot;withdraw&quot; to the time the money appears in your bank. First payouts are almost always slower due to additional KYC verification at the processor level. After that, subsequent payouts are faster because the processor already has your information on file.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Rise (Riseworks)</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Rise — formerly known as Riseworks — is the most common payout processor in the prop trading industry. It was originally built for paying remote contractors and freelancers, and prop firms adopted it because it handles international payments, tax form generation (1099s), and compliance in one platform.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Firms that use Rise:</strong> Topstep, Apex Trader Funding, Earn2Trade, and many smaller futures prop firms. If you trade futures, there is a strong chance your payout comes through Rise.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">What it looks like on your bank statement:</strong> Deposits from Rise typically appear as <span className="font-mono text-profit">&quot;Riseworks&quot;</span>, <span className="font-mono text-profit">&quot;Riseworks Inc&quot;</span>, or <span className="font-mono text-profit">&quot;Rise&quot;</span>. The description field may include a reference number but rarely mentions the prop firm by name. If you receive payouts from both Topstep and Apex, both show up as &quot;Riseworks&quot; on your statement — making it impossible to tell them apart from the bank transaction alone.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Fees:</strong> Rise typically charges <span className="font-mono text-profit">$0-$3</span> for US ACH transfers. International transfers may incur currency conversion fees of <span className="font-mono text-profit">1-3%</span>. Some firms absorb the Rise fee entirely; others pass it through to the trader. Rise also handles your 1099-NEC at year-end if you earned over $600 through the platform.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Speed:</strong> US ACH deposits typically arrive in <span className="font-mono text-profit">2-4 business days</span>. International payments can take <span className="font-mono text-profit">3-7 business days</span> depending on the destination country and banking system.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Wise (formerly TransferWise)</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Wise is a global money transfer platform that specializes in international payments with competitive exchange rates. Forex prop firms based outside the US — particularly European firms — tend to favor Wise because it handles cross-border payments efficiently.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Firms that use Wise:</strong> FTMO, The5ers, and several other forex-focused prop firms based in Europe and Israel. Some firms give traders the choice between Wise and a direct bank wire.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">What it looks like on your bank statement:</strong> Deposits appear as <span className="font-mono text-profit">&quot;Wise&quot;</span>, <span className="font-mono text-profit">&quot;Wise Payments Limited&quot;</span>, or sometimes <span className="font-mono text-profit">&quot;TransferWise&quot;</span> on older banking systems. The reference field occasionally includes the sender&apos;s name (the prop firm), but this is inconsistent. Most traders see a Wise deposit and have to cross-reference the amount and timing with their firm&apos;s dashboard to identify which payout it was.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Fees:</strong> Wise is known for transparency. Fees are typically <span className="font-mono text-profit">0.5-1.5%</span> of the transfer amount, including currency conversion. A <span className="font-mono text-profit">$2,000</span> payout from FTMO (converted from CZK or EUR to USD) might arrive as <span className="font-mono text-profit">$1,975-$1,990</span> after Wise fees. The fee structure is clearly shown before you accept the transfer.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Speed:</strong> Wise transfers to US bank accounts typically arrive in <span className="font-mono text-profit">1-3 business days</span>. Transfers to some countries can be near-instant if Wise has local banking partnerships.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Stripe</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Stripe is primarily a payment processing platform for businesses, not a payout processor per se. However, some newer prop firms use Stripe Connect to handle both incoming challenge fees and outgoing payouts through the same system. This is less common for payouts than Rise or Wise, but you may encounter it.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">What it looks like on your bank statement:</strong> Stripe payouts usually appear as <span className="font-mono text-profit">&quot;Stripe&quot;</span> or <span className="font-mono text-profit">&quot;Stripe Transfer&quot;</span>, though some firms configure Stripe to show their own business name. The inconsistency here is the biggest problem — you might see &quot;Stripe&quot; from one firm and the firm&apos;s actual name from another, even though both use Stripe under the hood.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Fees:</strong> Stripe charges businesses roughly <span className="font-mono text-profit">2.9% + $0.30</span> per transaction for incoming payments. Payout fees to connected accounts (traders) are typically <span className="font-mono text-profit">$0-$2</span> for US bank transfers. Most firms absorb Stripe&apos;s fees rather than passing them to traders.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">PayPal</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A handful of prop firms still offer PayPal as a payout option, though it is becoming less common. PayPal&apos;s higher fees and buyer-protection disputes have made many firms move away from it.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">What it looks like on your bank statement:</strong> If you withdraw from PayPal to your bank, it appears as <span className="font-mono text-profit">&quot;PayPal Transfer&quot;</span> or <span className="font-mono text-profit">&quot;PayPal&quot;</span>. The original sender (the prop firm) is visible in your PayPal account but not on the bank statement — adding another layer of confusion for tracking.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Fees:</strong> PayPal&apos;s business payment fees can run <span className="font-mono text-profit">2-5%</span> depending on the countries involved and whether currency conversion is needed. This makes it the most expensive option for prop firm payouts. Withdrawing from PayPal to your bank is free but takes <span className="font-mono text-profit">1-3 business days</span>.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Direct Bank Transfer (Wire / ACH)</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Some larger or more established prop firms offer direct bank transfers — either domestic ACH or international wire — without going through a third-party processor. This is the most straightforward option for the trader but the most expensive for the firm, which is why fewer firms offer it.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">What it looks like on your bank statement:</strong> Direct wires usually show the sending firm&apos;s actual name or their bank&apos;s name. This is the clearest option for tracking because you can see <span className="font-mono text-profit">&quot;FTMO s.r.o.&quot;</span> or <span className="font-mono text-profit">&quot;Topstep LLC&quot;</span> directly on the statement.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Fees:</strong> Incoming domestic ACH transfers are usually free. International wires can incur fees of <span className="font-mono text-profit">$15-$50</span> at your receiving bank, plus the sending bank&apos;s fees. Some intermediary banks also take a cut on international wires, so a $2,000 wire might arrive as $1,950.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Why This Matters for Tracking Your P&L</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is the core problem: if you trade with Topstep, Apex, and FTMO simultaneously, your bank statement might show three deposits labeled <span className="font-mono text-profit">&quot;Riseworks&quot;</span>, <span className="font-mono text-profit">&quot;Riseworks&quot;</span>, and <span className="font-mono text-profit">&quot;Wise&quot;</span>. None of them mention the firm by name. On the expense side, your challenge fees might show as charges to the firm&apos;s website domain, the firm&apos;s legal entity name, or even the payment processor they use for incoming payments.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you are tracking your P&L manually, you have to cross-reference every single deposit with your firm dashboards to figure out which payout came from where. For one firm, this is manageable. For three or four firms with overlapping payout dates, it becomes a genuine headache. Most traders give up on accurate per-firm tracking within a couple of months.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          The irony of payout processors: they make it easier for firms to pay you, but harder for you to track what you were paid.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">How Bank-Connected Tracking Solves This</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Bank-connected P&L tools like Prop PNL are built to handle exactly this problem. When you connect your bank, the software reads the raw transaction data — including the processor name, amount, date, and any reference codes — and maps it back to the correct prop firm. It knows that &quot;Riseworks&quot; deposits on certain dates align with your Topstep or Apex payout schedule. It knows that &quot;Wise Payments Limited&quot; is likely an FTMO payout when the amount matches your profit split.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This automatic categorization eliminates the manual cross-referencing that makes spreadsheet tracking so fragile. You see a clean, per-firm breakdown of payouts and fees without having to decode processor names yourself.
        </p>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            Stop decoding bank statements manually
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Prop PNL auto-identifies Rise, Wise, and Stripe payouts and maps them to your prop firms. See your real P&L per firm in 60 seconds.
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
    slug: 'prop-firm-reset-fees',
    title: 'Prop Firm Reset Fees: How Much Are You Really Spending on Resets?',
    description:
      'Reset fees are the silent killer of prop trading profitability. Here is exactly how much they cost and how fast they add up.',
    date: '2025-05-15',
    readTime: '8 min read',
    tags: ['costs', 'fees', 'profitability'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You blew the challenge. Hit the drawdown limit on day four, or broke a rule you forgot about, or the market gapped against you overnight. It happens. The firm sends you an email: &quot;Reset your account for just $99 and try again.&quot; It sounds reasonable. It is cheaper than buying a whole new challenge. So you click the button, pay the fee, and start over.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Then it happens again. And again. Each time, the $99 feels small in isolation. But reset fees are the silent killer of prop trading profitability. They compound faster than most traders realize, and they are the single largest hidden cost in the prop firm business model. Let us do the math.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">What Resets Are and Why They Exist</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A reset restores your evaluation account to its starting balance and clears any rule violations so you can attempt the challenge again. It is essentially a discounted do-over. Instead of purchasing an entirely new challenge at full price, you pay a fraction of the original cost.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          From the firm&apos;s perspective, resets are extremely profitable. The infrastructure cost of resetting a simulated account is near zero — it is a database operation. The <span className="font-mono text-profit">$50-$150</span> reset fee is almost pure margin. This is why firms make the reset process so seamless: one click, instant restart, minimal friction. They want you to reset. It is a significant revenue stream.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          From the trader&apos;s perspective, the appeal is obvious. You already know the platform, the rules, and the evaluation structure. Starting over with a reset feels like picking up where you left off rather than beginning from scratch. But this convenience has a price that extends well beyond the stated fee.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Typical Reset Costs by Firm</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Reset fees scale with account size. Here are approximate ranges for common firms and account levels:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Topstep ($50K account):</strong> Resets are effectively built into the monthly subscription model. Each new month is a fresh evaluation at <span className="font-mono text-profit">$49-$99/month</span> depending on account size.</li>
          <li><strong className="text-profit">Apex Trader Funding ($50K-$300K):</strong> Reset fees range from <span className="font-mono text-profit">$80 to $170</span> depending on the account tier. During promotional periods, both challenges and resets can be significantly discounted.</li>
          <li><strong className="text-profit">FTMO ($50K-$200K):</strong> FTMO calls it a &quot;Free Retry&quot; under certain conditions, but if you fail Phase 1 badly, you need to repurchase. A new $100K challenge costs <span className="font-mono text-profit">$540</span>. There is no cheap reset — you buy a new challenge.</li>
          <li><strong className="text-profit">The5ers:</strong> Evaluation reset fees vary by program, typically <span className="font-mono text-profit">$75-$150</span> for their standard challenge accounts.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The average reset fee across the industry lands around <span className="font-mono text-profit">$80-$120</span> for a mid-sized account. That number seems manageable. Until you see what happens over time.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Compounding Math: A Realistic Example</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Meet a hypothetical trader — call them Trader A. They purchased a $100K challenge at Apex for <span className="font-mono text-profit">$250</span> during a promotional period. Solid strategy, decent execution, but they keep clipping the trailing drawdown limit during volatile sessions. Here is their reset history over six months:
        </p>
        <div className="bg-terminal-card rounded-lg border border-terminal-border p-6 mb-6 font-mono text-sm">
          <div className="space-y-2">
            <div className="flex justify-between text-terminal-text">
              <span>Month 1: Challenge purchase</span>
              <span className="text-red-400">- $250</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Month 1: Reset #1</span>
              <span className="text-red-400">- $100</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Month 2: Reset #2</span>
              <span className="text-red-400">- $100</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Month 2: Reset #3</span>
              <span className="text-red-400">- $100</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Month 3: Reset #4</span>
              <span className="text-red-400">- $100</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Month 3: Reset #5</span>
              <span className="text-red-400">- $100</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Month 4: Reset #6</span>
              <span className="text-red-400">- $100</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Month 5: Reset #7 (passed!)</span>
              <span className="text-red-400">- $100</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Month 5: Activation fee</span>
              <span className="text-red-400">- $130</span>
            </div>
            <div className="border-t border-terminal-border mt-3 pt-3 flex justify-between font-bold text-terminal-text">
              <span>Total spent before first trade</span>
              <span className="text-red-400">$1,080</span>
            </div>
          </div>
        </div>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Trader A spent <strong className="text-profit">$1,080</strong> to get funded on a $100K account. The original challenge was $250. The seven resets at $100 each added $700 — nearly <strong className="text-profit">three times the original challenge cost</strong>. Plus the activation fee. This is not an unusual scenario. Many traders need 3-8 resets before passing, and some need more than 10.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Now multiply this across firms. If Trader A is also running a second challenge at a different firm with similar reset patterns, the total can easily reach <span className="font-mono text-profit">$2,000-$3,000</span> in combined challenge and reset fees before a single funded trade is executed.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Resets Plus Everything Else</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Reset fees do not exist in isolation. They stack on top of your other ongoing costs:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Data feeds:</strong> You pay <span className="font-mono text-profit">$11-$130/month</span> for market data whether you are resetting or not. Each month you spend resetting is another month of data feed charges on an evaluation account that earns nothing.</li>
          <li><strong className="text-profit">Platform subscriptions:</strong> NinjaTrader at <span className="font-mono text-profit">$75/month</span> or similar keeps billing while you reset and reattempt.</li>
          <li><strong className="text-profit">Subscription-model firms:</strong> At Topstep, each month of the Trading Combine is effectively a reset — you pay the monthly fee to keep evaluating. Three months of attempts at $99/month is $297 in &quot;resets&quot; even though it is not labeled that way.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Over six months with data feeds ($130/month) and platform costs ($75/month), Trader A adds <span className="font-mono text-profit">$1,230</span> in infrastructure costs to the $1,080 in challenge and reset fees. The total cost of getting funded: <strong className="text-profit">$2,310</strong>. That is the break-even number their funded account needs to exceed before they are truly profitable.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Psychology of &quot;Just One More Reset&quot;</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Resets exploit a well-known cognitive bias: the <strong className="text-profit">sunk cost fallacy</strong>. You have already spent $250 on the challenge and $300 on three resets. If you walk away now, that $550 is gone with nothing to show for it. But if you reset one more time for $100, you might pass and recoup everything. The logic feels airtight in the moment.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The problem is that this logic applies equally to reset #4, #5, #6, and #10. At every stage, you have sunk more cost and the emotional pressure to &quot;make it worth it&quot; increases. Each reset raises your break-even point, which means you need to earn more from the funded account to justify the total investment. And each reset that follows a failure may indicate that something fundamental about your strategy or risk management needs to change — not just a fresh start at the same challenge.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          If you have reset the same challenge more than 5 times, the problem is probably not bad luck. Something structural needs to change — your strategy, your risk parameters, or potentially the firm&apos;s rules themselves.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">When Resets Stop Making Financial Sense</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          There is a point where resetting becomes more expensive than buying a new challenge at a different firm — or even reconsidering your approach entirely. Here is a simple framework:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">After 3 resets:</strong> Evaluate honestly. What caused each failure? If it was the same issue each time, a reset will not fix it. You need practice, rule adjustment, or a different firm.</li>
          <li><strong className="text-profit">After 5 resets:</strong> Compare your total spend to the cost of a full new challenge at a different firm. A fresh challenge with different rules might suit your trading style better. Five resets at $100 ($500) plus the original challenge ($250) equals $750 — enough to buy a premium challenge at almost any firm.</li>
          <li><strong className="text-profit">After 8+ resets:</strong> Step back to demo trading for a month. The cost of resets has likely exceeded $1,000, and the funded account will need to generate significant profit just to break even. It is cheaper to practice for free and come back sharper.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">How to Track Reset Spending Accurately</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The biggest issue with resets is that traders lose count. They remember the big challenge purchase but forget whether they reset three times or five. Over a year of trading with multiple firms, the total can be shocking when you finally add it up.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your bank account does not forget. Every reset fee shows up as a debit — usually to the firm&apos;s website or payment processor. Bank-connected tracking catches every single one and categorizes it as a prop firm expense. When you see the cumulative total displayed on a screen, it hits differently than individual $100 charges spread across months.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Knowing your exact reset spend also changes behavior. Traders who can see they have spent <span className="font-mono text-profit">$800</span> on resets at one firm are more likely to pause and reassess than traders who vaguely remember &quot;a few resets.&quot; Visibility creates accountability.
        </p>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            See your total reset spend in seconds
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Prop PNL connects to your bank and totals every challenge fee, reset, and payout automatically. No more guessing how much you have spent.
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
    slug: 'prop-firm-profit-split-explained',
    title: 'What Is a Prop Firm Profit Split? How Payouts Actually Work',
    description:
      'Prop firm profit splits explained — what 80/20 and 90/10 really mean, when splits change, and how to calculate your actual take-home after the split.',
    date: '2025-05-10',
    readTime: '7 min read',
    tags: ['education', 'payouts', 'profitability'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          You made <span className="font-mono text-profit">$5,000</span> in profit on your funded account. How much of that do you actually keep? The answer depends on your profit split — and it is not as straightforward as it sounds. Profit splits are the mechanism prop firms use to divide trading profits between the firm and the trader. Most traders know the headline number (80/20, 90/10) but miss the details that determine their actual take-home.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">What a Profit Split Is</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A profit split is the percentage of your funded account&apos;s trading profit that goes to you versus the firm. An <span className="font-mono text-profit">80/20</span> split means you keep 80% of the profit and the firm takes 20%. A <span className="font-mono text-profit">90/10</span> split means you keep 90%.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The split applies to your <strong className="text-profit">gross trading profit</strong> — the gains in your funded account above the starting balance. If your account started at $100,000 and you grew it to $105,000, your gross profit is $5,000. At an 80/20 split, the firm pays you <span className="font-mono text-profit">$4,000</span> and keeps $1,000.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This sounds simple, but a few nuances change the real math significantly.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Common Split Structures Across Firms</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Profit splits vary by firm and often change over time as you prove consistency:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">FTMO:</strong> Starts at <span className="font-mono text-profit">80/20</span>. After meeting their scaling plan requirements (10% profit over four months with no violations), you move to <span className="font-mono text-profit">90/10</span>. The 90/10 split is the maximum.</li>
          <li><strong className="text-profit">Topstep:</strong> Starts at <span className="font-mono text-profit">80/20</span> for your first <span className="font-mono text-profit">$10,000</span> in total payouts. After $10K in cumulative payouts, you move to <span className="font-mono text-profit">90/10</span> permanently.</li>
          <li><strong className="text-profit">Apex Trader Funding:</strong> Split varies depending on promotions and account type, typically ranging from <span className="font-mono text-profit">75/25</span> to <span className="font-mono text-profit">90/10</span>. Their promotional accounts sometimes start at lower splits.</li>
          <li><strong className="text-profit">The5ers:</strong> Starts at <span className="font-mono text-profit">80/20</span> and scales up to <span className="font-mono text-profit">100/0</span> (you keep everything) at higher tier levels. Reaching 100/0 requires significant milestones and account growth.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The trend across the industry is toward higher trader splits. Competition has pushed most reputable firms to offer 80/20 as a floor, with a path to 90/10. Firms advertising 90/10 or 100/0 from day one usually compensate with higher challenge fees or stricter rules.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">How Scaling Plans Change Your Split</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Most firms offer a scaling plan — a structured path to larger accounts and better splits. The idea is that as you prove you can manage the account responsibly, you earn more favorable terms. Here is how scaling works at FTMO as a concrete example:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Start with a $100,000 account at 80/20</li>
          <li>After 4 months of profitable trading (minimum 10% profit), your account scales to <span className="font-mono text-profit">$125,000</span> and your split moves to <span className="font-mono text-profit">90/10</span></li>
          <li>Continue hitting milestones and the account can grow to <span className="font-mono text-profit">$200,000</span>, <span className="font-mono text-profit">$400,000</span>, and eventually up to <span className="font-mono text-profit">$2,000,000</span></li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The scaling plan means your effective split improves over time — but only if you maintain consistency. One violation can reset your scaling progress, depending on the firm&apos;s rules.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Math on What You Actually Take Home</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Let us walk through three scenarios to show how the split affects real dollar amounts:
        </p>
        <div className="bg-terminal-card rounded-lg border border-terminal-border p-6 mb-6 font-mono text-sm">
          <div className="space-y-2">
            <div className="text-terminal-muted text-xs mb-2">Scenario 1: $5,000 profit on 80/20</div>
            <div className="flex justify-between text-terminal-text">
              <span>Your share (80%)</span>
              <span className="text-profit">$4,000</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Firm&apos;s share (20%)</span>
              <span className="text-red-400">$1,000</span>
            </div>
            <div className="border-t border-terminal-border mt-3 pt-3 text-terminal-muted text-xs mb-2">Scenario 2: $5,000 profit on 90/10</div>
            <div className="flex justify-between text-terminal-text">
              <span>Your share (90%)</span>
              <span className="text-profit">$4,500</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Firm&apos;s share (10%)</span>
              <span className="text-red-400">$500</span>
            </div>
            <div className="border-t border-terminal-border mt-3 pt-3 text-terminal-muted text-xs mb-2">Scenario 3: $5,000 profit on 75/25</div>
            <div className="flex justify-between text-terminal-text">
              <span>Your share (75%)</span>
              <span className="text-profit">$3,750</span>
            </div>
            <div className="flex justify-between text-terminal-text">
              <span>Firm&apos;s share (25%)</span>
              <span className="text-red-400">$1,250</span>
            </div>
          </div>
        </div>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The difference between 75/25 and 90/10 on a $5,000 profit is <strong className="text-profit">$750</strong>. Over a year of consistent trading with monthly payouts in that range, you are talking about <span className="font-mono text-profit">$9,000</span> more in your pocket at the better split. The split matters.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Why the Split Percentage Alone Does Not Tell the Whole Story</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is where most comparisons go wrong. Traders look at splits in isolation — &quot;Firm A offers 90/10 and Firm B offers 80/20, so Firm A is obviously better.&quot; But the split is only one variable. The total cost structure determines your real take-home.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Consider two firms:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Firm A:</strong> 90/10 split, but the challenge costs $600, resets are $150, and the drawdown rules are tight (leading to more resets).</li>
          <li><strong className="text-profit">Firm B:</strong> 80/20 split, but the challenge costs $250, resets are $80, and the drawdown rules are more forgiving.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If Firm A requires 4 resets to pass and Firm B requires 1 reset, the total cost to get funded at Firm A is <span className="font-mono text-profit">$1,200</span> ($600 + 4 x $150) versus <span className="font-mono text-profit">$330</span> ($250 + 1 x $80) at Firm B. The $870 difference in getting-funded cost offsets many months of the better split.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          A 90/10 split with $1,200 in sunk costs is worse than an 80/20 split with $330 in sunk costs until you have earned enough in payouts for the split difference to make up the gap. Do the math for your specific situation.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">How Fees Reduce Your Effective Split</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your effective split is not the number on the firm&apos;s marketing page. It is what you actually keep after all costs are deducted. Here is a realistic example:
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A trader with a $100K account at 80/20 earns <span className="font-mono text-profit">$5,000</span> in gross profit. Their payout is $4,000. But to reach this point, they spent:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Challenge fee: <span className="font-mono text-profit">$350</span></li>
          <li>Two resets: <span className="font-mono text-profit">$200</span></li>
          <li>Two months of data feeds: <span className="font-mono text-profit">$260</span></li>
          <li>Activation fee: <span className="font-mono text-profit">$130</span></li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Total expenses: <span className="font-mono text-profit">$940</span>. Net take-home from that $5,000 in trading profit: <strong className="text-profit">$3,060</strong>. That is an effective split of <span className="font-mono text-profit">61/39</span> — not 80/20. The firm&apos;s 20% share was $1,000, but your fees added another $940 in costs. Your actual take-home rate on the gross profit was 61.2%.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The effective split improves over time as your initial costs are amortized across more payouts. By the third or fourth payout, the per-payout cost drops significantly. But that first payout almost always delivers a much lower effective split than the headline number.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Calculating Your Real Numbers</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          To know your actual effective split, you need two numbers: total money deposited into your bank from a specific firm, and total money debited from your bank to that firm (or its processor). The ratio between these tells you what you are really keeping.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Tracking this manually means combing through bank statements, matching Riseworks and Wise deposits to the right firms, and adding up every challenge fee and reset that may have been charged months ago. It is doable for one firm. It becomes unsustainable across three or four.
        </p>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            See your real effective split per firm
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Prop PNL shows total payouts vs. total costs for each firm — so you know your actual take-home rate, not just the headline split.
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
    slug: 'treat-prop-trading-like-a-business',
    title: 'How to Treat Prop Trading Like a Business',
    description:
      'The traders who succeed long-term treat prop trading as a business, not a hobby. Here is what that actually looks like in practice.',
    date: '2025-05-05',
    readTime: '10 min read',
    tags: ['strategy', 'profitability', 'guide'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Ask any consistently profitable prop trader what separates them from the majority who lose money, and you will hear some version of the same answer: &quot;I treat it like a business.&quot; It sounds like a clich&eacute;. It is not. The difference between treating prop trading as a hobby and treating it as a business is the difference between vaguely hoping you are profitable and knowing your exact net margin to the dollar.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is what that actually looks like in practice — not the motivational poster version, but the real operational framework.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Mindset Shift: Trader to Business Owner</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A hobby trader thinks in terms of trades. &quot;I made $800 today.&quot; &quot;I lost $400 this morning.&quot; The frame of reference is the individual trade or the daily P&L on their trading platform.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A business-owner trader thinks in terms of operations. &quot;My cost to acquire this funded account was $680.&quot; &quot;This firm has generated $3,200 in payouts against $1,400 in total costs, giving me a net margin of 56%.&quot; &quot;My monthly overhead across all firms is $350, so I need at least that in monthly payouts to break even.&quot;
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The difference is not intelligence or talent. It is the frame. One frame leads to emotional reactions after each trade. The other leads to strategic decisions based on data. Every point that follows is a consequence of making this shift.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Track Income and Expenses — Not Just Wins and Losses</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your trading platform shows wins and losses. That is your <strong className="text-profit">gross performance</strong>. But a business tracks <strong className="text-profit">revenue and expenses</strong>. In prop trading terms:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Revenue:</strong> Every dollar deposited into your bank from prop firm payouts. This is your top-line income.</li>
          <li><strong className="text-profit">Cost of goods sold:</strong> Challenge fees, reset fees, and activation fees — the direct costs of acquiring and maintaining funded accounts.</li>
          <li><strong className="text-profit">Operating expenses:</strong> Data feeds, platform subscriptions, internet, hardware, education, and any other recurring costs.</li>
          <li><strong className="text-profit">Net profit:</strong> Revenue minus all costs. This is the only number that determines whether your business is viable.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A trader who made <span className="font-mono text-profit">$12,000</span> in payouts over six months feels great. A business owner who made $12,000 in revenue but spent $9,500 in costs knows the business generated <span className="font-mono text-profit">$2,500</span> in profit — a 20.8% net margin. Both are looking at the same bank account. Only one knows the real story.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Know Your Cost of Goods</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          In a traditional business, cost of goods sold (COGS) is what you spend to deliver your product. In prop trading, your &quot;product&quot; is a funded account that generates payouts. The cost of producing that product includes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Challenge fees:</strong> The initial cost to attempt getting funded. Budget <span className="font-mono text-profit">$150-$1,080</span> per attempt depending on the firm and account size.</li>
          <li><strong className="text-profit">Reset fees:</strong> The cost of each failed attempt. Budget <span className="font-mono text-profit">$80-$150</span> per reset, and assume 2-5 resets per challenge passed.</li>
          <li><strong className="text-profit">Activation fees:</strong> The cost to go live after passing. <span className="font-mono text-profit">$0-$500</span> depending on the firm.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Add these up per firm and you get your <strong className="text-profit">acquisition cost per funded account</strong>. If it cost you $780 to get funded at Topstep and $1,200 to get funded at FTMO, those are your unit economics. A business owner evaluates whether each unit (funded account) generates enough revenue to justify the acquisition cost — and how long it takes to recoup that cost.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Calculate ROI on Each Firm</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Return on investment is the most basic business metric, and most prop traders have never calculated it for a single firm. The formula is simple:
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          ROI = (Total Payouts from Firm - Total Costs Paid to Firm) / Total Costs Paid to Firm x 100
        </blockquote>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you spent <span className="font-mono text-profit">$1,500</span> total at FTMO (challenge + reset + activation) and received <span className="font-mono text-profit">$6,000</span> in payouts, your ROI is 300%. If you spent $800 at Apex and received $600 in payouts, your ROI is -25%. That second firm is a losing proposition — and you should either change your approach there or stop using it entirely.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Most traders never do this calculation because the data is scattered. Challenge fees are on credit card statements. Payouts arrive through Rise or Wise. Reset fees are buried in email receipts. Pulling it all together requires discipline — or automation.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Know Your Break-Even Point</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Every business needs to know its break-even point — the amount of revenue required to cover all costs. For a prop trader, this means adding up every dollar you have spent on prop trading (challenges, resets, data, platforms, everything) and knowing exactly how much you need in payouts to get to zero.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If your total lifetime spend on prop trading is <span className="font-mono text-profit">$4,500</span> and your total lifetime payouts are <span className="font-mono text-profit">$3,800</span>, you are <span className="font-mono text-profit">$700</span> away from break-even. That is not a failure — it is information. You know exactly where you stand and what you need. Compare this to the trader who &quot;thinks&quot; they are profitable because they received a couple of big payouts last month but has no idea what they have spent in total.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Conduct Regular P&L Reviews</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Every real business does monthly or quarterly financial reviews. As a prop trading business, you should do the same — at minimum once per month. Your monthly review should answer:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>How much did I receive in payouts this month?</li>
          <li>How much did I spend on challenges, resets, and fees this month?</li>
          <li>What is my net profit or loss for the month?</li>
          <li>Which firms are generating positive ROI and which are negative?</li>
          <li>What is my cumulative P&L year to date?</li>
          <li>Am I on track for my annual targets?</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This review takes 15 minutes if your data is organized. It takes 2 hours if you are digging through bank statements and email receipts. And it does not happen at all if you do not have a system — which is why most traders skip it.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Prepare for Taxes Like a Business</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Prop firm payouts are self-employment income. That means <span className="font-mono text-profit">15.3%</span> in self-employment tax on top of your regular income tax rate. It also means you can deduct legitimate business expenses — challenge fees, data feeds, platform costs, home office, equipment — against that income.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          But deductions only work if you have records. A business owner keeps receipts, categorizes expenses, and can hand their accountant a clean profit and loss statement. A hobby trader scrambles in April trying to remember what they spent 10 months ago. The difference can be thousands of dollars in missed deductions or underpayment penalties.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">When to Cut a Losing Firm vs. Double Down</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A real business kills underperforming product lines and doubles down on winners. The same logic applies to prop firms. If you have been trading at a firm for six months and the math shows a negative ROI after all costs, you need to ask hard questions:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Is the negative ROI because of my trading, or because the firm&apos;s rules do not suit my strategy?</li>
          <li>Would I be profitable at this firm if I changed my approach, or is it a structural mismatch?</li>
          <li>Is the money I am spending here better deployed at a different firm where my ROI is positive?</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          These are business decisions, not emotional ones. A trader emotionally attached to a firm (&quot;I have spent so much there, I cannot quit now&quot;) is making a sunk-cost decision. A business owner looks at forward ROI and allocates capital where it produces the best return.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Spreadsheet Trap</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Many traders try to build this business framework in a spreadsheet. It works at first. You create columns for each firm, rows for each transaction, formulas for totals. Month one looks clean. Month two is still manageable.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          By month four, the spreadsheet is stale. You forgot to log two reset fees, a data feed charge changed and you did not update it, and a payout from Wise is sitting unidentified because you do not remember which firm it came from. The spreadsheet becomes a source of anxiety rather than clarity — you know it is wrong, but fixing it requires an hour of forensic bank statement review.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Manual tracking breaks down at scale. One firm, maybe two — a spreadsheet can handle it. Three firms with monthly payouts, resets, subscriptions, and data feeds producing 30-50 transactions per month? You need a system that does not depend on your memory or discipline.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          The best system is the one that runs without you. Your bank records every transaction automatically. Build your tracking on top of that foundation, not on manual entry.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Build Systems, Not Habits</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A habit requires willpower every day. A system runs on its own. Businesses do not rely on the CEO remembering to check revenue — they have dashboards, accounting software, and automated reports. Your prop trading business should work the same way.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Connect your bank to tracking software that auto-categorizes prop firm transactions. Set up a monthly calendar reminder to review your P&L report (even if the data is already there — the review itself is the value). Use the per-firm breakdown to make allocation decisions quarterly. Export the data for your accountant at tax time.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is not complicated. It is just business. And the traders who run it like one are the traders who are still here — and still profitable — a year from now.
        </p>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            Run your prop trading business on real data
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Prop PNL connects to your bank and gives you the P&L dashboard your business needs. Per-firm ROI, monthly reviews, tax-ready exports.
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
    slug: 'build-verified-prop-trading-track-record',
    title: 'How to Build a Verified Prop Trading Track Record',
    description:
      'Screenshots can be faked. Here is how to build a prop trading track record that people actually trust — and why bank-verified proof matters.',
    date: '2025-04-28',
    readTime: '8 min read',
    tags: ['strategy', 'credibility', 'verification'],
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Every prop trading Discord, Twitter thread, and YouTube comment section has the same problem: screenshots. &quot;Look at my payout!&quot; followed by an image that could have been made in Photoshop in 30 seconds. Or a broker statement that could be a demo account. Or a dashboard screenshot with the URL conveniently cropped out.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The prop trading world has a credibility crisis. Everyone claims to be profitable. Very few can prove it. And the traders who <em>can</em> prove it — the ones with verified, tamper-proof track records — have an enormous advantage. Whether you want to build a following, sell a course, attract investors, or simply hold yourself accountable, a verified track record is the foundation.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is how to build one that people actually trust.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Why Track Records Matter</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A track record is proof of performance over time. It is the difference between &quot;trust me, I am profitable&quot; and &quot;here are 12 months of verified results.&quot; Depending on your goals, a credible track record serves different purposes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Accountability:</strong> The most underrated reason. When you know your results are being tracked and are visible, you trade differently. You take fewer impulsive trades. You follow your rules. The track record becomes a forcing function for discipline.</li>
          <li><strong className="text-profit">Coaching and education credibility:</strong> If you plan to teach, mentor, or sell a course, verified results are the difference between being taken seriously and being dismissed as another scammer. The bar is rising — audiences increasingly demand proof before paying for education.</li>
          <li><strong className="text-profit">Social media and following:</strong> Consistently sharing verified results builds an audience that trusts you. Unverified screenshots get likes but not loyalty. Verified results build reputation.</li>
          <li><strong className="text-profit">Investor interest:</strong> If you eventually want to manage capital or attract backing beyond prop firms, institutional investors will not look at screenshots. They want auditable records, ideally bank-verified, covering an extended period.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Problem with Screenshots</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Let us be direct about why screenshots are worthless as proof:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Trivially easy to fake:</strong> Browser developer tools let you change any number on any webpage in seconds. A &quot;$15,000 payout&quot; screenshot could have originally said $150. No technical skill required — a 12-year-old can do it.</li>
          <li><strong className="text-profit">No context:</strong> A screenshot of a $5,000 payout says nothing about the $4,000 in challenge fees and resets it took to get there. It is a single data point presented without the full picture.</li>
          <li><strong className="text-profit">No continuity:</strong> A screenshot is a moment in time. It does not show what happened before or after. A trader could post a winning month and omit the three losing months that preceded it.</li>
          <li><strong className="text-profit">Demo vs. live:</strong> Most trading platform screenshots look identical whether the account is live-funded or a demo. Without additional verification, there is no way to tell.</li>
          <li><strong className="text-profit">No ongoing verification:</strong> A screenshot posted in January cannot be updated or verified in March. It is a static claim with no mechanism for continuous proof.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The prop trading community knows this. That is why screenshot posts generate skepticism as often as they generate admiration. &quot;Proof or it didn&apos;t happen&quot; is a common reply — and for good reason.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Broker Statements vs. Bank Statements</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A step up from screenshots is sharing broker or firm statements — PDF documents showing your account history, trades, and P&L. These carry more weight than screenshots because they are harder (though not impossible) to forge. However, they have limitations:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Broker statements show gross performance</strong> — the trading P&L on the funded account. They do not show what you actually received after the profit split, and they do not include your costs (challenge fees, resets, data feeds).</li>
          <li><strong className="text-profit">Prop firm dashboards are not bank-verified.</strong> The firm controls what numbers appear. While reputable firms are honest, there is no independent third-party verification built in.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Bank statements</strong> are the gold standard because they represent an independent, third-party record of actual money movement. Your bank does not care about your marketing narrative. It records exactly what was deposited, exactly what was withdrawn, and when. A bank statement showing consistent deposits from Rise, Wise, or FTMO is nearly impossible to fake because the bank is a regulated institution with its own audit trail.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          A trading platform shows what you traded. A broker statement shows what you earned on paper. A bank statement shows what you actually received. Each level is more credible than the last.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">What &quot;Bank-Verified&quot; Actually Means</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          When we say &quot;bank-verified,&quot; we mean the financial data comes directly from a regulated banking institution through a secure, read-only API connection — not from screenshots, not from manual entry, and not from the prop firm itself.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is how it works technically: a service like Teller (the banking API Prop PNL uses) connects directly to your bank, reads your transaction history through an encrypted connection, and passes that data to the tracking platform. The trader cannot modify the data. The tracking platform cannot modify the data. It comes straight from the bank&apos;s records. This is the same type of connection used by financial institutions, accounting software, and lending platforms.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The result is a P&L report that is backed by bank data — not self-reported numbers, not screenshots, and not manually-entered figures. When someone views a bank-verified report, they know the payouts shown actually landed in a real bank account and the fees shown actually left it.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">How to Share Results Credibly</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          There are several ways to share your track record, ranked by credibility:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Screenshots (lowest credibility):</strong> Easy to produce, easy to fake, no ongoing verification. Useful for casual sharing but carries zero weight with serious audiences.</li>
          <li><strong className="text-profit">PDF exports of broker/firm statements (medium credibility):</strong> Harder to fake, includes more context, but static and does not include full cost picture. Better for one-time proof but does not build an ongoing narrative.</li>
          <li><strong className="text-profit">Public shareable links (high credibility):</strong> A link to a live, updating report that pulls from verified data. Viewers can see the track record is current, includes both income and expenses, and is backed by a verifiable data source. This is the format that works best for social media bios, coaching applications, and long-term credibility building.</li>
          <li><strong className="text-profit">Bank-verified shareable links (highest credibility):</strong> Same as above, but explicitly backed by bank-connected data through a regulated API. The viewer knows the numbers came from the trader&apos;s actual bank account, not from manual entry or self-reporting.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The best format depends on your audience. For Twitter followers, a public link they can check anytime is powerful. For potential coaching clients, a bank-verified report with months of history is persuasive. For investors, nothing less than bank-verified data with a long track record will be taken seriously.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Building Consistency Over Time</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A single great month is not a track record. Neither is a single great payout. What matters — to followers, investors, and to yourself — is <strong className="text-profit">consistency over time</strong>. A track record that shows 8 out of 12 months profitable, with controlled drawdowns and steady growth, is far more impressive than a single $20,000 month followed by silence.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is where the accountability function of a track record becomes its most valuable feature. When you know your results are being tracked month over month, you are less likely to take the risky all-or-nothing trade that could blow your account. You play for the long game because the long game is what the record shows.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Start building your track record now, even if the numbers are small. A trader with 6 months of modest but consistent bank-verified profits has more credibility than a trader with one impressive screenshot from last week.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">What Serious People Actually Look For</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Whether your audience is followers, students, or potential investors, here is what they look for in a credible track record:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Duration:</strong> Minimum 3-6 months. Anything less is too short to distinguish skill from luck. Twelve months or more is strongly preferred.</li>
          <li><strong className="text-profit">Net numbers, not gross:</strong> Show the P&L after all costs, not just payouts. Anyone can show deposits. Showing net profit after fees demonstrates real business acumen.</li>
          <li><strong className="text-profit">Consistency:</strong> Steady, repeatable results beat one-off big months. Low volatility in monthly returns suggests a real edge rather than gambling.</li>
          <li><strong className="text-profit">Verification source:</strong> Where does the data come from? Self-reported numbers carry minimal weight. Bank-connected data carries maximum weight.</li>
          <li><strong className="text-profit">Transparency about losses:</strong> A track record that shows bad months alongside good ones is more credible than one that is suspiciously clean. Real trading has drawdowns. Showing them builds trust.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Getting Started</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Building a verified track record is not something you do retroactively. You cannot go back and verify six months of screenshots after the fact. The best time to start is now — connect your bank, let the data accumulate, and in three to six months, you will have something that no screenshot can match: a continuous, bank-verified record of your prop trading results.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          When you are ready to share it — whether on social media, with potential coaching clients, or just to keep yourself honest — you will have a link that speaks for itself. No explanation needed. No &quot;trust me.&quot; Just the numbers, verified by your bank.
        </p>

        <div className="mt-12 p-6 bg-terminal-card rounded-lg border border-profit/20 text-center">
          <p className="text-terminal-text mb-4 text-lg font-semibold">
            Build your bank-verified track record
          </p>
          <p className="text-terminal-muted mb-6 text-sm">
            Prop PNL creates a shareable, bank-verified P&L report you can link anywhere. Start building your proof today.
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
