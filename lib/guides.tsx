import { ReactNode } from 'react';

export interface Guide {
  slug: string;
  title: string;
  description: string;
  order: number;
  icon: string;
  readTime: string;
  content: () => ReactNode;
}

export const GUIDES: Guide[] = [
  {
    slug: 'how-prop-firms-work',
    title: 'How Prop Firms Work',
    description:
      'What proprietary trading firms are, how the evaluation model works, profit splits, and what every trader should understand before paying for a challenge.',
    order: 1,
    icon: '📖',
    readTime: '10 min read',
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Proprietary trading firms — &quot;prop firms&quot; — give traders access to funded accounts in exchange for a share of the profits. Instead of risking your own capital, you trade the firm&apos;s money and keep a percentage of what you earn. It sounds like a straightforward deal, and in many cases it is. But the modern prop firm landscape is more nuanced than the marketing suggests. Understanding how these firms actually operate is the first step toward making them work for you — or deciding they are not the right path.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Traditional Model vs. the Modern Model</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Traditional proprietary trading firms — think Jane Street, Optiver, or DRW — hire traders as employees, train them in-house, and let them trade the firm&apos;s capital on a salary plus bonus structure. These firms make money from the trading itself. They are selective, typically hiring from top universities, and traders never pay a dime to get started.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The modern &quot;retail prop firm&quot; model is fundamentally different. Firms like Topstep, FTMO, The5ers, Apex Trader Funding, and MyFundedFX operate on an evaluation-based system. Traders pay a fee to take a challenge, and if they pass, they receive a funded account. The firm takes a cut of profits (typically <strong className="text-profit">10-20%</strong>), and the trader keeps the rest.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This model has democratized access to capital. You do not need a finance degree or a connection at a hedge fund. Anyone can sign up, pay the evaluation fee, and attempt to prove they can trade profitably within the firm&apos;s rules.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">How Evaluations and Challenges Work</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Nearly every modern prop firm uses some variation of the challenge model. Here is how it typically works:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Step 1 — Pay the evaluation fee.</strong> This ranges from $50 for a small account ($25K) up to $1,000+ for large accounts ($200K-$400K). Most traders start with accounts in the $50K-$150K range, paying $150-$500.</li>
          <li><strong className="text-profit">Step 2 — Hit the profit target.</strong> You need to reach a specific profit target (often 8-10% of account size) within a set number of trading days while staying within drawdown limits.</li>
          <li><strong className="text-profit">Step 3 — Some firms have a second phase.</strong> FTMO, for example, runs a two-phase evaluation. The second phase typically has a lower profit target (5%) but the same drawdown rules.</li>
          <li><strong className="text-profit">Step 4 — Receive a funded account.</strong> Once you pass, you get a simulated funded account (more on this below). You trade under the same drawdown rules, but now your profits are real — paid out to your bank account.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The profit targets and drawdown limits vary by firm, but the structure is remarkably consistent across the industry. Most firms allow a maximum daily drawdown of 3-5% and a maximum trailing or static drawdown of 6-12%.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Simulated vs. Live Capital</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is one of the most misunderstood aspects of modern prop firms. The majority of retail prop firms do not give you access to real capital in the traditional sense. Instead, you trade on a simulated account that mirrors live market conditions. The firm then pays you a share of the simulated profits using their own revenue.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Some firms do route at least a portion of trades to live markets — Topstep, for example, has moved toward live futures accounts for funded traders. But many firms operate entirely on a simulated basis. This is not necessarily a red flag, but it is important to understand: the &quot;funded account&quot; is often a demo account with real profit payouts attached.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          The key question is not whether the account is simulated or live — it is whether the firm reliably pays out profits. A simulated account that pays consistently is more valuable than a live account at a firm that delays or denies withdrawals.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Profit Splits and Payouts</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Most firms offer profit splits between <strong className="text-profit">70/30 and 90/10</strong> in the trader&apos;s favor. Some firms start at 80/20 and scale up to 90/10 as you prove consistency. A few firms (Apex, for example) offer up to 100% of the first payout as a promotional incentive.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Payouts are typically available after a minimum trading period (often 14-30 days) and require a minimum profit threshold. Some firms pay via Rise, others via Wise, PayPal, or bank transfer. Payout frequency varies — biweekly is common, though some firms allow weekly or even on-demand withdrawals.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The profit split is the most visible cost of a prop firm relationship, but as we cover in our <a href="/guide/understanding-prop-firm-fees" className="text-profit underline hover:text-profit/80">guide on fees</a>, it is far from the only one.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Business Model: Why Most Firms Profit from Failures</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is the part that deserves honest discussion. The primary revenue source for most retail prop firms is <strong className="text-profit">evaluation fees</strong> — not trading profits. Industry data and firm disclosures suggest that somewhere between <strong className="text-profit">85-95% of traders fail</strong> evaluations or blow funded accounts. Those challenge fees are non-refundable.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This does not make prop firms a scam. Gyms profit from people who buy memberships and stop going. Test prep companies profit from students who do not improve their scores. The model works because a small percentage of traders are consistently profitable, and the firm earns money from both the evaluation fees and their cut of those traders&apos; profits.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          However, it does create an incentive structure worth understanding. Firms benefit when more people attempt challenges, regardless of whether those people are ready. Marketing budgets are large, social media promotions are aggressive, and discount codes are everywhere — all designed to get more traders through the door.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Key Differences Between Firms</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Not all prop firms are created equal. Here are the major dimensions where firms differ:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Asset class.</strong> Topstep and Apex focus on futures. FTMO supports forex, indices, and commodities. The5ers offers forex and metals. Your instrument determines your firm options.</li>
          <li><strong className="text-profit">Drawdown rules.</strong> Some firms use trailing drawdown (the most punishing), others use static or end-of-day drawdown. This single rule difference has a massive impact on your probability of passing.</li>
          <li><strong className="text-profit">Scaling plans.</strong> Some firms let you scale up your account size over time. The5ers, for example, has a scaling plan that can grow a $6K account to $4M. Others cap your account size permanently.</li>
          <li><strong className="text-profit">Payout reliability.</strong> This is the single most important factor. A firm with great rules means nothing if they delay or deny payouts. Research payout reviews carefully before committing.</li>
          <li><strong className="text-profit">Cost structure.</strong> Challenge fees, reset fees, activation fees, data fees — the total cost varies enormously. See our <a href="/guide/understanding-prop-firm-fees" className="text-profit underline hover:text-profit/80">complete fee breakdown</a>.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Is a Prop Firm Right for You?</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Prop firms make sense if you have a proven, consistent strategy but lack the capital to trade it at scale. They provide leverage without personal financial risk (beyond the evaluation fees). For a trader who can genuinely pass evaluations on the first or second attempt, the math works out favorably.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Prop firms are a poor fit if you are still learning to trade. Paying for challenge after challenge while developing your strategy is an expensive way to practice. If you are not yet consistently profitable on a personal account or in simulation, the evaluation fees will compound quickly with nothing to show for them.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The honest math: if you spend $1,500 on failed challenges before getting funded, you need to earn at least $1,500 in payouts before you break even. Many traders never reach that point. Tracking your <em>real</em> P&L — including every fee, reset, and failed challenge — is the only way to know whether prop firm trading is working for you as a business.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          Treat prop firm trading like a business. Track every dollar in and every dollar out. If the total is positive, you have a viable business. If it is not, the numbers will tell you that too — but only if you are tracking them.
        </blockquote>
      </>
    ),
  },
  {
    slug: 'understanding-prop-firm-fees',
    title: 'Understanding Prop Firm Fees',
    description:
      'Every fee prop firms charge — challenge fees, resets, activation fees, data feeds, commissions, and profit splits — and how a "$200 challenge" becomes $1,500+ in real costs.',
    order: 2,
    icon: '💰',
    readTime: '12 min read',
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Ask a prop firm trader how much they spend, and most will give you their challenge fee — &quot;$150 for a 50K account.&quot; Ask them to add up every fee they have actually paid, and the number is almost always much higher. The challenge fee is just the front door. Behind it sits a stack of recurring costs, one-time charges, and hidden fees that most traders never tally up until it is too late.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This guide breaks down every fee type in the prop firm ecosystem so you can calculate your true cost of doing business.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">1. Challenge and Evaluation Fees</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is the fee you pay to attempt the firm&apos;s evaluation. It is the most visible cost and the one every trader knows about.
        </p>
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b border-terminal-border">
              <th className="text-left py-3 px-4 text-terminal-muted text-sm font-mono">Account Size</th>
              <th className="text-left py-3 px-4 text-terminal-muted text-sm font-mono">Typical Fee Range</th>
              <th className="text-left py-3 px-4 text-terminal-muted text-sm font-mono">Example Firms</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">$25,000</td>
              <td className="py-3 px-4 text-terminal-text text-sm">$49 - $165</td>
              <td className="py-3 px-4 text-terminal-text text-sm">Topstep, Apex</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">$50,000</td>
              <td className="py-3 px-4 text-terminal-text text-sm">$149 - $299</td>
              <td className="py-3 px-4 text-terminal-text text-sm">Topstep, FTMO, Apex</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">$100,000</td>
              <td className="py-3 px-4 text-terminal-text text-sm">$299 - $540</td>
              <td className="py-3 px-4 text-terminal-text text-sm">FTMO, MyFundedFX</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">$200,000</td>
              <td className="py-3 px-4 text-terminal-text text-sm">$499 - $1,080</td>
              <td className="py-3 px-4 text-terminal-text text-sm">FTMO, The5ers</td>
            </tr>
          </tbody>
        </table>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">The critical detail:</strong> many firms run these as monthly subscriptions, not one-time payments. If you do not pass or cancel within the evaluation period, you are charged again. A $150/month challenge fee that takes three months to pass costs $450 — not $150. Always check whether your evaluation fee is one-time or recurring, and set a calendar reminder to cancel if needed.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">2. Reset Fees</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          When you breach a drawdown rule during an evaluation, your challenge is over. But most firms offer a &quot;reset&quot; option — pay a fee to restart your evaluation from scratch without buying a whole new challenge. Reset fees typically range from <strong className="text-profit">$59 to $169</strong> depending on account size.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is the uncomfortable truth: <strong className="text-profit">most traders need 2-4 resets before passing</strong> an evaluation. Some need far more. If you are paying $99 per reset on a $200 challenge, three resets means your total evaluation cost is $497 — almost 2.5x the sticker price.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Resets are one of the most significant hidden costs in prop trading. They are also one of the most psychologically dangerous — each reset feels small compared to the sunk cost of giving up, which encourages traders to keep spending.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">3. Activation Fees</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is the fee that catches the most traders off guard. Some firms charge an &quot;activation fee&quot; after you pass the evaluation to actually set up your funded account. This can range from <strong className="text-profit">$0 to $800+</strong> depending on the firm and account size.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Not all firms charge activation fees — Topstep and FTMO, for example, do not. But firms that do charge them often bury this detail in the terms of service. You pass a two-month evaluation, feel the rush of accomplishment, and then discover there is an $149 activation fee before you can trade your funded account. It is worth knowing about this fee before you start an evaluation, not after.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">4. Trading Platform Subscriptions</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Many futures prop firms provide platform access (NinjaTrader, Tradovate, etc.) for free during the evaluation phase. Once you are funded, the free access may end. NinjaTrader licenses run <strong className="text-profit">$75/month</strong> for the lease or a one-time purchase of $1,099. Tradovate charges $99/month for their premium tier.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Forex firms tend to use MetaTrader 4/5, which is free. But if you use premium tools, indicators, or third-party add-ons, those costs add up too. Some traders spend $50-$200/month on trading tools alone.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">5. Exchange and Data Feed Fees</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you trade futures, you need real-time market data. This is not optional. CME Group data fees run approximately <strong className="text-profit">$130/month</strong> for non-professional access to all four exchanges (CME, CBOT, NYMEX, COMEX). If you only trade one exchange (e.g., CME for ES/NQ), you can pay less — around $13-$28/month per exchange.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          During evaluations, some firms bundle data fees into the challenge cost. After funding, you often become responsible for these fees yourself. This is another cost that appears after you&apos;ve already committed to the firm.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">6. Trading Commissions</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Every trade you execute has a commission. For futures, this is typically <strong className="text-profit">$6 to $8 per round-trip</strong> (buy and sell) per contract. For micro contracts, it is around $0.50-$1.50 per round-trip.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Commissions may seem small per trade, but they compound fast. A trader who executes 10 round-trip trades per day on ES futures pays $60-$80/day in commissions — that is <strong className="text-profit">$1,200-$1,600/month</strong> just in commissions. For active traders, commissions can be the single largest ongoing cost.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">7. Profit Split</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The profit split is the percentage the firm keeps from your trading profits. Most firms take <strong className="text-profit">10-30%</strong> of your profits. On an 80/20 split, if you earn $5,000 in a month, the firm keeps $1,000 and you receive $4,000.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Some traders dismiss the profit split as &quot;the cost of doing business,&quot; and compared to the other fees on this list, it is actually one of the more fair costs — you only pay it when you are making money. But it is still real money that reduces your take-home.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">8. Withdrawal and Processing Fees</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Most firms charge <strong className="text-profit">$20-$50 per withdrawal</strong>, and some payment processors (Wise, Rise) add their own conversion or transfer fees on top. If you are withdrawing biweekly, that is $40-$100/month just in withdrawal processing.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          International traders face additional currency conversion fees, which can add 1-3% to every payout. This is another cost that rarely appears in the marketing materials.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Real Cost: A Complete Example</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Let us walk through a realistic scenario for a futures trader who signs up for a $50,000 account challenge:
        </p>
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b border-terminal-border">
              <th className="text-left py-3 px-4 text-terminal-muted text-sm font-mono">Cost Item</th>
              <th className="text-right py-3 px-4 text-terminal-muted text-sm font-mono">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">Challenge fee (recurring x 2 months)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$300</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">Reset fees (2 resets x $99)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$198</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">CME data feed (2 months during eval)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$56</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">Platform subscription post-funding (3 months)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$225</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">Data feed post-funding (3 months x $56)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$168</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">Trading commissions (5 months avg 8 RT/day)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$400</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">Withdrawal fees (3 payouts x $35)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$105</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">Profit split (20% of $3,000 profits)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$600</td>
            </tr>
            <tr className="border-b border-terminal-border">
              <td className="py-3 px-4 text-terminal-text text-sm font-bold">Total costs over 5 months</td>
              <td className="py-3 px-4 text-profit text-sm text-right font-bold">$2,052</td>
            </tr>
          </tbody>
        </table>
        <p className="text-terminal-text mb-6 leading-relaxed">
          In this example, the trader earned $3,000 in gross trading profits but spent $2,052 in total costs. Their real take-home is <strong className="text-profit">$948</strong> — not the $3,000 their trading platform shows, and not even the $2,400 after the profit split. The &quot;$150 challenge&quot; actually cost over $2,000 when you account for everything.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          Your trading platform shows your gross P&L. Your bank account shows your real P&L. The gap between those two numbers is where most traders lose track of whether they are actually profitable.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Why Traders Underestimate Total Costs</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Several psychological factors contribute to cost underestimation:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Anchoring on the challenge fee.</strong> When the advertised price is $150, every other cost feels like a minor add-on. But minor add-ons multiply.</li>
          <li><strong className="text-profit">Sunk cost fallacy.</strong> After spending $300 on challenges, a $99 reset feels like a small price to &quot;protect your investment.&quot; This thinking leads to escalating spend.</li>
          <li><strong className="text-profit">Scattered billing.</strong> Fees come from different sources — the prop firm, the platform provider, the data vendor, the payment processor. No single statement shows the total.</li>
          <li><strong className="text-profit">Focus on gross P&L.</strong> Traders celebrate a $2,000 profit month without subtracting the $500+ in monthly costs that reduce the real number.</li>
          <li><strong className="text-profit">Multiple firms simultaneously.</strong> Many traders run 2-5 accounts across different firms. Costs multiply, but they are tracked (if at all) in separate mental buckets.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The solution is straightforward but rarely practiced: track every dollar that leaves your bank account for prop firm-related expenses, and compare it to every dollar that comes in from payouts. That net number is your real P&L. Our <a href="/guide/calculating-your-real-pnl" className="text-profit underline hover:text-profit/80">next guide</a> walks through exactly how to calculate it.
        </p>
      </>
    ),
  },
  {
    slug: 'calculating-your-real-pnl',
    title: 'Calculating Your Real P&L',
    description:
      'How to calculate your true prop firm profit and loss — the difference between what your platform shows and what you actually keep, and why bank data is the only reliable source.',
    order: 3,
    icon: '🧮',
    readTime: '11 min read',
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Every prop firm trader has two P&L numbers. The first is the number on your trading platform — the gross profit from your trades. The second is the number in your bank account — the actual money you kept after every fee, split, and failed challenge. These two numbers are almost never the same, and the gap between them determines whether prop trading is a profitable business or an expensive hobby.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This guide walks through how to calculate your real P&L, the mistakes most traders make, and why your bank account is the ultimate source of truth.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Trading P&L vs. Business P&L</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Trading P&L</strong> is what your trading platform reports — the sum of your winning and losing trades. If you made $4,000 in winning trades and lost $1,500 in losing trades, your trading P&L is $2,500. This is the number most traders focus on, and it is the number they post on social media.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Business P&L</strong> is what you actually kept — total money received from prop firms minus total money paid to prop firms and related services. This includes payouts, challenge fees, resets, data feeds, platform costs, commissions, and every other dollar that moved between your bank and the prop firm ecosystem.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A trader with a $5,000 trading P&L who spent $6,000 on fees and failed challenges has a business P&L of <strong className="text-profit">negative $1,000</strong>. They are a profitable trader but an unprofitable business. This distinction is crucial, and most traders never make it.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          Being a good trader and running a profitable prop firm business are two different things. You can be excellent at the first and still fail at the second if your costs exceed your take-home.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Step-by-Step Calculation</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is the formula for your real prop firm P&L. It is simple in concept but requires discipline to track:
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Step 1: Total Inflows (Money Received)</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Add up every payout you have received from prop firms. This includes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Profit payouts (from funded accounts)</li>
          <li>Challenge fee refunds (some firms refund the challenge fee after your first payout)</li>
          <li>Promotional bonuses or referral payments</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Look at your bank statements and search for deposits from Rise, Wise, the prop firm&apos;s name, or their payment processor. Every deposit counts. For a 12-month calculation, sum all deposits for that period.
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Step 2: Total Outflows (Money Spent)</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Add up every payment you have made to prop firms and related services. This is the longer list:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Challenge/evaluation fees (including recurring charges)</li>
          <li>Reset fees</li>
          <li>Activation fees</li>
          <li>Platform subscriptions (NinjaTrader, Tradovate, etc.)</li>
          <li>Data feed fees (CME, exchange data)</li>
          <li>Monthly subscription fees to the prop firm</li>
          <li>Any tools or services purchased specifically for prop trading</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Note that trading commissions and the firm&apos;s profit split are typically deducted before your payout hits your bank, so they are already factored into your inflows. You do not need to double-count them. The key insight is: if money left your bank account for anything prop-firm related, it goes in the outflows column.
        </p>

        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Step 3: Subtract</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Real P&L = Total Inflows - Total Outflows</strong>
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          That is it. This number is your real, bank-verified profit or loss from prop firm trading. If it is positive, you are running a profitable business. If it is negative, you are paying more than you are earning — regardless of how good your trading P&L looks.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">A Worked Example</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Let us walk through a 6-month example for a trader using two prop firms:
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Inflows</h3>
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b border-terminal-border">
              <th className="text-left py-3 px-4 text-terminal-muted text-sm font-mono">Source</th>
              <th className="text-right py-3 px-4 text-terminal-muted text-sm font-mono">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">Topstep payout (March)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$1,200</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">Topstep payout (May)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$800</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">FTMO payout (April)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$2,100</td>
            </tr>
            <tr className="border-b border-terminal-border">
              <td className="py-3 px-4 text-terminal-text text-sm font-bold">Total inflows</td>
              <td className="py-3 px-4 text-profit text-sm text-right font-bold">$4,100</td>
            </tr>
          </tbody>
        </table>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Outflows</h3>
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b border-terminal-border">
              <th className="text-left py-3 px-4 text-terminal-muted text-sm font-mono">Expense</th>
              <th className="text-right py-3 px-4 text-terminal-muted text-sm font-mono">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">Topstep challenge fees (3x $150)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$450</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">Topstep reset fees (2x $99)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$198</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">FTMO challenge fee</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$540</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">FTMO challenge fee (failed first attempt)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$540</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">NinjaTrader license (6 months x $75)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$450</td>
            </tr>
            <tr className="border-b border-terminal-border/50">
              <td className="py-3 px-4 text-terminal-text text-sm">CME data (6 months x $28)</td>
              <td className="py-3 px-4 text-terminal-text text-sm text-right">$168</td>
            </tr>
            <tr className="border-b border-terminal-border">
              <td className="py-3 px-4 text-terminal-text text-sm font-bold">Total outflows</td>
              <td className="py-3 px-4 text-profit text-sm text-right font-bold">$2,346</td>
            </tr>
          </tbody>
        </table>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">Real P&L = $4,100 - $2,346 = $1,754</strong>
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This trader&apos;s combined trading P&L across their platforms might show $6,000+ in gross profits. But after the profit splits (already deducted from payouts) and all expenses, they actually kept $1,754. That is a <strong className="text-profit">70% reduction</strong> from the gross number. The trader is profitable — but the margin is much thinner than the platform P&L suggests.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Common Mistakes in P&L Calculation</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          These are the errors we see most often when traders try to calculate their real P&L:
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">1. Forgetting Failed Challenges</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The biggest mistake. When a challenge fails, many traders mentally write it off and stop counting the cost. But that $300 did not disappear — it is a real expense that reduces your overall P&L. If you attempted 5 challenges and passed 2, all 5 challenge fees belong in your outflows column.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">2. Not Counting Multiple Firms Together</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Many traders are profitable at one firm but hemorrhaging money at another. If you are up $2,000 at Topstep but down $3,000 in failed FTMO challenges, your combined P&L is negative $1,000. Calculating per-firm P&L is useful for strategy, but your overall business P&L must include all firms.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">3. Ignoring Recurring Costs</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Data feeds, platform subscriptions, and recurring challenge fees add up month after month. A $200/month cost basis means you need to earn at least $200/month in payouts just to break even — before you even start counting challenge and reset fees.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">4. Confusing Trading P&L with Business P&L</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your NinjaTrader or MetaTrader P&L has no concept of the $1,500 you spent on challenges to get that funded account. It only shows what happened inside the account. This is useful for evaluating your trading strategy, but it tells you nothing about whether your prop firm business is profitable.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">5. Cherry-Picking Time Periods</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A great month does not cancel out a bad quarter. Calculate your P&L over the entire period you have been prop trading — from your very first challenge fee to today. This is the only way to know your true all-time performance.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Why Bank Data Is the Most Accurate Source</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Manual tracking fails for a simple reason: humans forget things and make errors. You might forget about a reset fee from three months ago, misremember a challenge cost, or overlook a data feed charge that auto-renewed.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your bank account does not forget. Every payout that arrived is recorded as a deposit. Every fee you paid is recorded as a debit. The bank ledger is a complete, tamper-proof record of your prop firm finances. It does not care about your feelings, your narrative, or your social media brand — it just shows the numbers.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is why bank-based P&L tracking is fundamentally more reliable than manual spreadsheets:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Complete.</strong> Every transaction is captured — no forgotten fees, no missed resets.</li>
          <li><strong className="text-profit">Accurate.</strong> Dollar amounts are exact, pulled from official bank records.</li>
          <li><strong className="text-profit">Automatic.</strong> No manual entry means no human error.</li>
          <li><strong className="text-profit">Multi-firm.</strong> All prop firms deposit to and withdraw from the same bank account(s), so your total is inherently consolidated.</li>
          <li><strong className="text-profit">Verifiable.</strong> You can audit the numbers against your bank statements at any time.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">How Prop PNL Automates This</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Prop PNL connects to your bank account via a secure, read-only connection (powered by Teller). We automatically scan your transactions, identify deposits from prop firms (Rise, Wise, Topstep, FTMO, The5ers, and more), and categorize payments to those same firms as expenses.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The result is a dashboard showing your true net P&L — total payouts minus total costs — broken down by firm, by month, and over your entire trading history. No spreadsheet. No manual entry. No missing data. Just the real number, derived from your bank records.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          For traders managing multiple firms and accounts, this is particularly valuable. Instead of maintaining separate spreadsheets for each firm, you get one consolidated view showing exactly where you stand across your entire prop firm portfolio.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          The traders who succeed long-term in prop firms are the ones who know their real numbers. Not the trading platform numbers — the bank account numbers. That is the difference between running a business and gambling on hope.
        </blockquote>
      </>
    ),
  },
  {
    slug: 'choosing-the-right-prop-firm',
    title: 'Choosing the Right Prop Firm',
    description:
      'A framework for comparing prop firms based on your trading style, preferred markets, risk tolerance, and financial goals.',
    order: 4,
    icon: '🔍',
    readTime: '12 min read',
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          There are dozens of prop firms competing for your money, and every one of them claims to be the best. Flashy websites, discount codes, and influencer endorsements make it nearly impossible to compare firms on substance alone. The result is that most traders choose a prop firm based on whoever had the best coupon that week — not on whether the firm actually fits their trading style, market, and goals.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This guide gives you a structured framework for evaluating prop firms. Instead of asking &quot;which firm is the best,&quot; you will learn to ask &quot;which firm is the best <em>for me</em>.&quot; The answer depends on six factors, and working through them methodically will save you hundreds — possibly thousands — in wasted challenge fees at firms that were never a good fit.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 1: Know Your Market</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The first filter is the simplest: what do you trade? Not all prop firms support all asset classes, and the firms that dominate one market may not even offer another.
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Futures.</strong> If you trade ES, NQ, CL, or other CME products, your primary options include Topstep, Apex Trader Funding, Earn2Trade, and TakeProfitTrader. These firms are built around futures infrastructure — they provide exchange data, integrate with NinjaTrader or Tradovate, and their rules are designed for futures volatility.</li>
          <li><strong className="text-profit">Forex.</strong> If you trade currency pairs, FTMO and The5ers are among the most established names. MyFundedFX and a growing list of newer firms also operate in this space. They typically run on MetaTrader 4/5 or cTrader, and their drawdown rules are calibrated for forex pip movements.</li>
          <li><strong className="text-profit">Stocks and options.</strong> Fewer prop firms support equities directly, though firms like Trade The Pool have carved out this niche. Most traders wanting funded stock accounts have fewer options and should evaluate payout track records even more carefully.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you trade futures, there is no reason to evaluate forex-only firms — and vice versa. This single filter eliminates roughly half the market immediately.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 2: Understand Your Trading Style</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your trading style determines which firm rules will help you and which will destroy you. There are three broad categories:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Scalping (seconds to minutes).</strong> Scalpers need tight spreads, fast execution, and firms that allow high trade frequency. Some firms impose minimum holding times (e.g., trades must be open for at least 2 minutes) that make scalping impossible. Others restrict news trading, which eliminates many scalping setups. Check: Does the firm allow unlimited trades per day? Are there holding time minimums? Is news trading permitted?</li>
          <li><strong className="text-profit">Day trading (minutes to hours).</strong> Day traders need firms that do not require overnight holds and that have reasonable daily loss limits. Most prop firms are designed with day traders in mind, so the fit is usually good. Check: What is the daily loss limit? Are there consistency rules that penalize large single-day gains?</li>
          <li><strong className="text-profit">Swing trading (days to weeks).</strong> Swing traders need firms that allow holding positions overnight and, ideally, over weekends. Many futures prop firms require positions to be closed before the end of each session. FTMO and The5ers are more swing-friendly for forex, while most futures firms are not. Check: Can you hold overnight? Over weekends? Are there additional margin requirements for overnight positions?</li>
        </ul>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          The number one reason traders fail evaluations is not bad trading — it is trading a style that conflicts with the firm&apos;s rules. A swing trader at a no-overnight-holds firm is fighting with one hand tied behind their back.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 3: Evaluate Drawdown Rules</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Drawdown rules are the single most important structural difference between prop firms, and misunderstanding them is the fastest way to blow an account. There are three main types:
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Trailing Drawdown</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The drawdown limit follows your peak balance. If your account starts at $50,000 with a $2,500 trailing drawdown, your liquidation level starts at $47,500. If your balance reaches $52,000, your liquidation level rises to $49,500. It <em>never</em> moves down — only up. This means that even after a $2,000 profit day, one bad day could put you right at the liquidation level. Trailing drawdown is the most punishing rule type and the one that catches the most traders. <strong className="text-profit">Example: Apex Trader Funding uses trailing drawdown on evaluations.</strong>
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Static Drawdown</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The drawdown limit is fixed relative to your starting balance and never moves. If your account starts at $50,000 with a $3,000 static drawdown, your liquidation level is always $47,000 — regardless of how high your balance goes. You could grow the account to $60,000 and still have the same $47,000 floor. This gives traders much more breathing room. <strong className="text-profit">Example: The5ers uses static drawdown on some of their programs.</strong>
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">End-of-Day (EOD) Drawdown</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Similar to trailing drawdown, but the liquidation level only updates at the end of each trading day based on your closing balance — not your intraday peak. This is significantly more forgiving than real-time trailing drawdown because intraday swings do not ratchet up your floor. If you hit $53,000 intraday but close the day at $51,000, your liquidation level is based on $51,000, not $53,000. <strong className="text-profit">Example: Topstep uses EOD trailing drawdown on their funded accounts.</strong>
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The difference between trailing and static drawdown can mean the difference between surviving a normal losing streak and getting liquidated. If your strategy has high intraday volatility, trailing drawdown is your enemy. If you can manage tight risk, it is manageable. Know your strategy&apos;s typical drawdown profile before choosing a firm.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 4: Compare Evaluation Structures</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Firms use different evaluation formats, and each has trade-offs:
        </p>
        <table className="w-full text-sm mb-8">
          <thead>
            <tr>
              <th className="text-left text-terminal-muted font-mono py-2 px-3 border-b border-terminal-border">Structure</th>
              <th className="text-left text-terminal-muted font-mono py-2 px-3 border-b border-terminal-border">How It Works</th>
              <th className="text-left text-terminal-muted font-mono py-2 px-3 border-b border-terminal-border">Pros</th>
              <th className="text-left text-terminal-muted font-mono py-2 px-3 border-b border-terminal-border">Cons</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">1-Step</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Hit profit target once, get funded</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Faster to funding, simpler process</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Often stricter drawdown or higher target</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">2-Step</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Pass Phase 1 (higher target), then Phase 2 (lower target)</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">More relaxed rules per phase, industry standard</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Takes longer, more opportunities to fail</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Instant Funding</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">No evaluation — start trading funded immediately</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">No evaluation risk, immediate access</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Higher fees, lower profit splits, tighter rules</td>
            </tr>
          </tbody>
        </table>
        <p className="text-terminal-text mb-6 leading-relaxed">
          FTMO popularized the 2-step model: Phase 1 requires a <span className="font-mono text-profit">10%</span> profit target, Phase 2 requires <span className="font-mono text-profit">5%</span>, and both phases have the same drawdown limits. Topstep and Apex use 1-step evaluations for futures. The5ers offers instant funding programs alongside traditional evaluations at different price points.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          There is no universally &quot;better&quot; structure. A 1-step evaluation is faster but may have a more aggressive profit target. A 2-step evaluation gives you more time but doubles the chances of failing. Instant funding eliminates evaluation risk entirely but costs more upfront and usually comes with worse profit splits. Choose based on your risk tolerance and how much capital you want to put at risk before seeing a funded account.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 5: Check Payout Terms</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A prop firm is only as good as its payouts. The profit split percentage gets all the attention, but there are several other payout factors that matter just as much:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Profit split.</strong> Ranges from <span className="font-mono text-profit">70/30</span> to <span className="font-mono text-profit">90/10</span> across most firms, with some offering up to 100% on initial payouts as a promotion. Look at the standard split, not the promotional one.</li>
          <li><strong className="text-profit">Payout frequency.</strong> Biweekly is most common. Some firms offer weekly payouts, others only monthly. More frequent payouts reduce your risk — if the firm has financial trouble, you have already withdrawn more of your profits.</li>
          <li><strong className="text-profit">Minimum payout.</strong> Some firms require a minimum profit threshold (e.g., $100 or $200) before you can request a withdrawal. If you trade conservatively, this can delay your first payout significantly.</li>
          <li><strong className="text-profit">Payout processor.</strong> Rise, Wise, PayPal, bank wire — each has different processing times and fees. International traders should pay special attention to conversion rates and transfer fees, which can eat <span className="font-mono text-profit">1-3%</span> of every payout.</li>
          <li><strong className="text-profit">First payout waiting period.</strong> Many firms require you to trade for a minimum number of days (often 14-30) before your first payout is eligible. Factor this into your timeline.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Step 6: Calculate the Total Cost to Funding</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The challenge fee is not the cost to get funded — it is the <em>minimum</em> cost. The real cost includes everything you spend before receiving your first payout:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Challenge fee (potentially recurring monthly)</li>
          <li>Reset fees (most traders need at least one)</li>
          <li>Activation fees (if applicable)</li>
          <li>Data feed and platform costs during the evaluation</li>
          <li>The time cost of the evaluation period itself</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A $150 challenge that takes two attempts with one reset costs at least $350. Add two months of data fees and you are at $400+. Compare this to a firm with a $250 one-time challenge fee and free data — the &quot;cheaper&quot; firm ends up costing more. Always calculate the realistic total, assuming you will need at least one reset. Our <a href="/guide/understanding-prop-firm-fees" className="text-profit underline hover:text-profit/80">guide on fees</a> breaks down every cost type in detail.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Comparison Framework</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Use this table to compare any firms you are considering. Fill in the details for each firm and the right choice usually becomes obvious:
        </p>
        <table className="w-full text-sm mb-8">
          <thead>
            <tr>
              <th className="text-left text-terminal-muted font-mono py-2 px-3 border-b border-terminal-border">Criteria</th>
              <th className="text-left text-terminal-muted font-mono py-2 px-3 border-b border-terminal-border">What to Compare</th>
              <th className="text-left text-terminal-muted font-mono py-2 px-3 border-b border-terminal-border">Why It Matters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Asset class</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Futures, forex, stocks</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Must match what you trade</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Drawdown type</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Trailing vs static vs EOD</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Biggest factor in account survival</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Evaluation structure</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">1-step, 2-step, instant</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Affects time and cost to get funded</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Profit split</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">70/30 to 90/10</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Directly impacts your take-home</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Payout frequency</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Weekly, biweekly, monthly</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Reduces counterparty risk</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Total cost to funding</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Challenge + resets + data + activation</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">The real price tag, not the advertised one</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Payout track record</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Verified reviews, Trustpilot, community reports</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">The only thing that ultimately matters</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Red Flags to Watch For</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The prop firm industry is largely unregulated, which means bad actors exist. Here are the warning signs that should make you walk away:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Unclear or frequently changing rules.</strong> If the firm&apos;s terms of service are vague about drawdown calculations, or if they change the rules on funded accounts after you have passed, that is a major red flag. Reputable firms publish their rules clearly and do not modify them retroactively.</li>
          <li><strong className="text-profit">Delayed or denied payouts.</strong> Search for &quot;[firm name] payout problems&quot; before signing up. If you find a pattern of delayed withdrawals, requests for additional verification that drag on for weeks, or outright denials with thin justifications, move on.</li>
          <li><strong className="text-profit">No verifiable payout history.</strong> Legitimate firms like Topstep and FTMO publish payout statistics or have extensive third-party verification of payouts. If a firm has no verifiable payout history — just screenshots and influencer testimonials — treat it with extreme skepticism.</li>
          <li><strong className="text-profit">Unrealistic promotions.</strong> &quot;90% off challenge fees&quot; or &quot;100% profit split forever&quot; are not sustainable business models. Firms that rely on aggressive discounting to attract customers may be prioritizing volume over longevity.</li>
          <li><strong className="text-profit">No clear company information.</strong> A legitimate prop firm has a registered business entity, a physical address (not just a virtual office), and identifiable leadership. If you cannot find basic corporate information, that is a warning sign.</li>
        </ul>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          The best prop firm for you is not the one with the biggest discount — it is the one whose rules match your strategy, whose payouts are reliable, and whose total cost structure leaves you with a profitable business. Do the homework before you spend the money.
        </blockquote>
      </>
    ),
  },
  {
    slug: 'surviving-your-first-funded-account',
    title: 'Surviving Your First Funded Account',
    description:
      'What changes after you pass the evaluation, how to protect your funded account, and the mental shifts that separate survivors from blowups.',
    order: 5,
    icon: '🛡️',
    readTime: '11 min read',
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Passing a prop firm evaluation is an accomplishment. You proved you can hit a profit target within drawdown limits — something the vast majority of traders who attempt it cannot do. But here is the uncomfortable truth that most traders discover within the first two weeks: <strong className="text-profit">being funded is harder than getting funded</strong>. The evaluation tested your ability to generate returns. The funded account tests your ability to keep them.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The statistics are stark. Industry estimates suggest that <strong className="text-profit">60-80% of traders who pass evaluations lose their funded accounts</strong> within the first three months. The reasons are consistent: they trade the same way they did in the evaluation, they ignore the rule differences between eval and funded accounts, and they let the pressure of real money override the discipline that got them funded in the first place.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This guide covers everything that changes after you get funded and the specific habits that separate traders who survive from traders who blow up.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Mindset Shift: Evaluation vs. Funded</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          In the evaluation, your objective is to hit a profit target. You need to <em>make</em> money — a specific amount, within a specific timeframe. This incentivizes aggression. Bigger positions, more trades, pushing for those last few hundred dollars to clear the target. And it works, because the evaluation is disposable. If you blow it, you pay a reset fee and try again.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          In a funded account, the objective flips. You no longer need to hit a target — you need to <em>not lose</em> money. There is no profit target, no deadline, no finish line. The game changes from offense to defense. Your funded account is a long-term asset that generates income as long as it survives. Every dollar of drawdown you use is a dollar closer to losing that asset entirely.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          In the evaluation, you are trying to pass a test. In the funded account, you are trying to keep a job. The skills overlap, but the strategy should not be identical.
        </blockquote>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Rule Changes You Must Understand</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Many traders assume funded accounts have the same rules as evaluations. They often do not. Here are the most common differences:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Drawdown calculation changes.</strong> Some firms use trailing drawdown during the evaluation but switch to a different calculation method (or keep trailing but reset the high-water mark) once funded. Others maintain the same trailing drawdown, which means your liquidation level was already ratcheted up during the eval. Read the funded account terms carefully — they are not always the same document as the evaluation terms.</li>
          <li><strong className="text-profit">Trading hours restrictions.</strong> Some firms restrict trading during major news events (NFP, FOMC, CPI) on funded accounts even if they allowed it during the evaluation. Others restrict trading within the first or last minutes of a session. Violating these rules can result in immediate account termination regardless of your P&amp;L.</li>
          <li><strong className="text-profit">Consistency rules.</strong> Several firms have implemented &quot;consistency rules&quot; that require your daily P&amp;L to fall within certain parameters. For example, no single trading day can account for more than 30-40% of your total profits. This prevents traders from passing with one lucky day and then coasting. If your trading style produces occasional big wins followed by flat periods, consistency rules will be a problem.</li>
          <li><strong className="text-profit">Scaling restrictions.</strong> Funded accounts may start with lower position size limits than what you had during the evaluation. You might need to trade profitably for several weeks before the firm allows you to use the same contract sizes you traded in the eval.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Position Sizing: The Most Common Mistake</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Most traders who pass an evaluation immediately start trading the same position sizes in their funded account. This is almost always a mistake. Here is why:
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          During the evaluation, you had a clear profit target and a disposable account. If you blew it, you paid a reset fee. The risk/reward of trading aggressively made sense — you were trying to hit a number, and the downside was a $100 reset fee, not a lost income stream.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Your funded account is different. The cost of losing it is not a reset fee — it is the loss of a revenue-generating asset plus all the time and money you spent getting funded. If you spent $500 on challenges and resets to get a $50,000 funded account, and that account generates $1,000-$2,000/month in payouts, losing it costs you far more than $500.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          <strong className="text-profit">The recommendation is simple: start your funded account at 50% of your evaluation position size.</strong> If you traded 3 contracts of ES during the eval, start with 1-2 contracts funded. If you traded 2 lots of EUR/USD, start with 1 lot. You can always scale up after proving you can be consistent at the smaller size. You cannot undo a blown account.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The First Week: Your Survival Protocol</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The first five trading days of a funded account set the tone for everything that follows. Here is a specific protocol that maximizes your chances of surviving the critical early period:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Day 1-2:</strong> Trade at <span className="font-mono text-profit">25-50%</span> of your normal size. The goal is not to make money — it is to get comfortable with the platform, the rules, and the psychological reality of trading a funded account. Take your normal setups, but smaller.</li>
          <li><strong className="text-profit">Day 3-5:</strong> If the first two days went well, increase to <span className="font-mono text-profit">50-75%</span> of your normal size. Continue taking only your highest-conviction setups. Avoid revenge trading if you have a losing day.</li>
          <li><strong className="text-profit">Week 2 onward:</strong> If you are green for the first week, consider moving to full size — but only if the drawdown buffer is healthy. If you used a significant portion of your drawdown in week 1, stay at reduced size until you rebuild the cushion.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This approach costs you some potential profit in the first week. It also dramatically reduces the probability of blowing the account before you even get a feel for it. The math is clear: a slightly smaller first week is a tiny price to pay for account longevity.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Payout Strategy: Take Profits Early</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Once you are eligible for your first payout (usually after 14-30 trading days), request it as soon as possible — even if the amount is small. There are three reasons:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">It proves the system works.</strong> Until money hits your bank account, the funded account is theoretical income. Your first payout converts it from theory to reality, which is a significant psychological milestone.</li>
          <li><strong className="text-profit">It reduces counterparty risk.</strong> Money in the firm&apos;s account is money at risk. Money in your bank account is yours. Firms can change rules, have financial difficulties, or shut down. Regular withdrawals protect your earnings.</li>
          <li><strong className="text-profit">It builds confidence.</strong> Seeing a $500 deposit from your prop firm hits different than seeing a $500 P&amp;L number on a screen. That confidence carries over into your trading — you trade more calmly because you know the process works.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Do not make the mistake of &quot;letting it ride&quot; and trying to build a massive balance before withdrawing. That is the evaluation mindset leaking into your funded account. The funded account is a cash flow machine — withdraw regularly and let it keep producing.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Drawdown Management: Your Daily Framework</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Managing drawdown is not just about staying above the liquidation level — it is about maintaining enough buffer that a normal losing streak does not put you at risk. Here is a practical daily framework:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Know your daily loss limit.</strong> Most firms set this at <span className="font-mono text-profit">2-4%</span> of account size. But your personal limit should be tighter — ideally <span className="font-mono text-profit">50-60%</span> of the firm&apos;s daily limit. If the firm allows a $1,500 daily loss, set your own limit at $750-$900. This gives you a buffer for slippage, commissions, and the occasional unexpected move.</li>
          <li><strong className="text-profit">Track your drawdown buffer.</strong> Always know the distance between your current balance and your liquidation level. If your buffer drops below <span className="font-mono text-profit">50%</span> of the maximum allowed drawdown, reduce position sizes immediately. If it drops below <span className="font-mono text-profit">30%</span>, stop trading for the day — or the week.</li>
          <li><strong className="text-profit">Stop after 2 consecutive losers.</strong> Two losing trades in a row means something is off — either the market conditions do not match your setup, or your execution is deteriorating. Step away for at least 30 minutes. If the next trade is also a loser, you are done for the day.</li>
          <li><strong className="text-profit">Stop at 30% of your daily loss limit.</strong> If your personal daily loss limit is $900 and you are down $270, pause and reassess. You still have room to trade, but the trajectory is wrong. Many blown accounts start with &quot;I&apos;ll take one more trade to get back to even.&quot;</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Mental Game: Managing Pressure</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The funded account introduces a type of psychological pressure that most traders underestimate: the pressure of real money at stake combined with rules that can end the opportunity permanently. Three specific mental traps to watch for:
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Fear of Losing the Account</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This manifests as hesitation on valid setups, cutting winners too early, and avoiding trading altogether on days when you &quot;do not want to risk it.&quot; The antidote is to recognize that not trading is itself a form of risk — you have ongoing costs (data, platform) whether you trade or not, and you need positive P&amp;L to justify maintaining the account.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Overconfidence After Passing</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The flip side: some traders feel invincible after passing the evaluation and immediately start taking more risk. They increase size, trade outside their setup, or try new strategies on the funded account. This is how the majority of first-week blowups happen. The evaluation proved you can trade one specific way — do not deviate from it.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Revenge Trading After a Loss</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Losing money on a funded account feels different than losing money on an evaluation. The emotional response — frustration, urgency to recover, anger — is amplified because the stakes are real. If you catch yourself increasing position size after a loss, trading a setup you would normally skip, or thinking &quot;I just need to get back to even,&quot; stop trading immediately. Close the platform. Walk away. The account will be there tomorrow.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Scaling Up: Growing Your Funded Account</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Many prop firms offer scaling plans that increase your account size and contract limits over time. The typical requirements include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Trading profitably for a consecutive period (often 2-3 months)</li>
          <li>Meeting minimum trading day requirements</li>
          <li>Maintaining consistency metrics (no single day accounting for too large a share of profits)</li>
          <li>Staying within drawdown limits with a healthy buffer</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Scaling is where funded accounts become genuinely lucrative. A trader who starts with a $50,000 account and scales to $200,000 over six months has quadrupled their earning potential without paying another challenge fee. But scaling requires patience and consistency — exactly the traits that the funded account environment is designed to test.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          The traders who survive their first funded account treat it like a marathon, not a sprint. They trade smaller than they think they should, withdraw profits earlier than they want to, and walk away from the screen more often than feels productive. That discipline is what keeps the account alive long enough for compounding to do its work.
        </blockquote>
      </>
    ),
  },
  {
    slug: 'managing-multiple-prop-firm-accounts',
    title: 'Managing Multiple Prop Firm Accounts',
    description:
      'How to run multiple prop firm accounts profitably — strategy, organization, and tracking across firms without losing control.',
    order: 6,
    icon: '📊',
    readTime: '10 min read',
    content: () => (
      <>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Once a trader passes their first funded account, the natural next question is: &quot;Should I get more?&quot; The logic seems sound — if one funded account generates $1,500/month, three accounts could generate $4,500/month. And unlike growing a single account, adding new funded accounts does not require scaling approval from the firm or proving months of consistency. You just pass another evaluation.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Running multiple prop firm accounts is one of the most common strategies among serious prop traders. It is also one of the easiest ways to turn a profitable operation into a losing one if you do not manage the complexity it creates. This guide covers why traders use multiple accounts, how to organize them effectively, and where the strategy breaks down.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Why Traders Use Multiple Firms</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          There are four legitimate reasons to spread your trading across multiple prop firms:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Capital diversification.</strong> If one firm changes its rules, delays payouts, or shuts down, you are not wiped out. Your other funded accounts continue generating income. This is the same principle behind not putting all your money in one stock — counterparty risk is real in the prop firm world.</li>
          <li><strong className="text-profit">More effective capital.</strong> Instead of waiting months for one firm to scale you from $50K to $200K, you can run four $50K accounts across different firms and have $200K in funded capital now. The cost is more challenge fees, but the time savings can be significant.</li>
          <li><strong className="text-profit">Different rules suit different strategies.</strong> You might scalp on a firm with lenient trading restrictions and swing trade on a firm with static drawdown. Matching your strategies to the firms whose rules support them is smarter than forcing one strategy to fit one firm&apos;s constraints.</li>
          <li><strong className="text-profit">Payout optimization.</strong> Different firms have different payout schedules. With accounts across three firms, you might receive payouts every week instead of every two weeks, improving your cash flow.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Organizational Challenge</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Running a single prop firm account is simple. You know your rules, your drawdown, your payout schedule. Running three, four, or five accounts across different firms creates a matrix of complexity:
        </p>
        <table className="w-full text-sm mb-8">
          <thead>
            <tr>
              <th className="text-left text-terminal-muted font-mono py-2 px-3 border-b border-terminal-border">Factor</th>
              <th className="text-left text-terminal-muted font-mono py-2 px-3 border-b border-terminal-border">1 Account</th>
              <th className="text-left text-terminal-muted font-mono py-2 px-3 border-b border-terminal-border">4 Accounts (2 Firms)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Drawdown rules to track</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">1 set</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">2 different rule sets, 4 separate drawdown levels</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Payout schedules</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">1 schedule</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">2 different schedules, 4 separate thresholds</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Trading platforms</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">1 platform</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Potentially 2 different platforms</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Monthly fee tracking</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Simple</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">4 challenge/subscription fees + data + platform</td>
            </tr>
            <tr>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Payout processors</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">1 processor</td>
              <td className="text-terminal-text py-2 px-3 border-b border-terminal-border">Potentially 2-3 different processors</td>
            </tr>
          </tbody>
        </table>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Each account is a separate business unit with its own rules, its own P&amp;L, and its own risk profile. Managing them effectively requires systems — not just skill.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Copy Trading vs. Independent Accounts</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          When running multiple accounts, traders typically choose one of two approaches:
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Copy Trading (Same Trades Across Accounts)</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Using a trade copier to duplicate your trades across multiple accounts is the most common approach. You execute once, and the copier replicates the trade on all connected accounts. This reduces execution burden and ensures consistency.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          However, copy trading has a critical caveat: <strong className="text-profit">not all firms allow it</strong>, and some firms explicitly prohibit &quot;group trading&quot; or require that each account be traded independently. Violating this rule can result in account termination and forfeiture of profits. Before using a copier, verify each firm&apos;s specific policy on trade copying and automated execution. Also note that copy trading across firms with different rules (e.g., different position size limits or trading hours) requires careful configuration to avoid rule violations on any individual account.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Independent Accounts (Different Strategies or Timing)</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Some traders run genuinely independent strategies across different firms — scalping on one, swing trading on another. This provides true diversification but requires significantly more time and mental bandwidth. The risk is spreading yourself too thin: four independent strategies need four sets of analysis, four separate attention windows, and four emotional states to manage.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Most traders find the sweet spot is somewhere in between: copy trading their core strategy across 2-3 accounts at the same firm type, while running a separate strategy on 1-2 accounts at a different firm type.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Keeping Track: The Payment Processor Maze</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          One of the most underappreciated challenges of multiple accounts is tracking the money. Each firm may use a different payout processor, and the transaction descriptions in your bank statements are rarely clear:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Rise:</strong> Used by several futures firms. Deposits may appear as &quot;Rise&quot; or &quot;Riseworks&quot; in your bank statement, sometimes without specifying which prop firm the payout is from.</li>
          <li><strong className="text-profit">Wise (TransferWise):</strong> Common for international payouts. Deposits appear as &quot;Wise&quot; transfers, and if you have payouts from multiple firms through Wise, distinguishing between them requires cross-referencing dates and amounts.</li>
          <li><strong className="text-profit">Stripe:</strong> Some firms process payouts via Stripe. The bank statement description may show the firm name or just &quot;Stripe&quot; — it varies.</li>
          <li><strong className="text-profit">PayPal:</strong> A few firms still offer PayPal payouts. These are the easiest to track since PayPal provides sender details, but PayPal fees can eat into your payout.</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          On the outflow side, challenge fees and subscriptions show up as charges to each firm individually, but data feeds and platform subscriptions are separate vendors entirely. After a few months of running multiple accounts, your bank statement looks like a puzzle — deposits from three different payment processors, charges to four different firms, and recurring fees to two platform vendors.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">When More Accounts Hurt You</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          More accounts are not always better. Here are the scenarios where adding accounts becomes counterproductive:
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Spreading Too Thin</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you are manually trading (not copy trading), each account requires its own attention during market hours. Managing four accounts manually means four charts, four order entry windows, and four sets of drawdown levels to track in real time. Many traders find that beyond 2-3 manually traded accounts, their execution quality drops significantly. Mistakes increase — wrong lot size on the wrong account, forgetting to close a position before the session ends, or accidentally violating a rule that only applies to one specific firm.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Inconsistent Execution</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Even with a copier, latency differences between accounts can create inconsistent fills. Your primary account gets filled at the intended price, but the copied accounts fill at slightly worse prices. Over hundreds of trades, this slippage adds up and can mean the difference between profitability and breakeven on the secondary accounts.
        </p>
        <h3 className="text-xl font-semibold text-terminal-text mt-8 mb-3">Paying Fees on Idle Accounts</h3>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is the most common trap. A trader signs up for five funded accounts, actively trades two or three, and lets the others sit idle — but the monthly fees (data, platform, subscription) continue regardless. If you are paying $200/month in overhead for an account you trade twice a week, the math does not work. Every account must justify its costs through consistent trading activity and payouts.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Break-Even Calculation</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Before adding another account, calculate the break-even point. This is the monthly payout you need from the new account to justify its existence. Add up all recurring costs for the additional account:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Monthly challenge/subscription fee (if applicable): <span className="font-mono text-profit">$0-$150</span></li>
          <li>Additional data feed costs (if the new firm requires a separate feed): <span className="font-mono text-profit">$0-$130</span></li>
          <li>Platform costs (if the new firm uses a different platform): <span className="font-mono text-profit">$0-$99</span></li>
          <li>Withdrawal fees per payout: <span className="font-mono text-profit">$20-$50</span></li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If the additional account costs $175/month in overhead, you need to generate at least $175/month in net payouts (after profit split) just to break even. If your average monthly payout per account is $800, the math works comfortably. If it is $200, you are operating on razor-thin margins where one bad month wipes out several good months of profit.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          A useful benchmark: each additional account should be able to generate at least <strong className="text-profit">3x its monthly overhead</strong> in expected payouts. Below that, the risk-adjusted return is not worth the complexity.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">The Financial Tracking Problem</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Here is where multi-account management becomes genuinely difficult: tracking the actual P&amp;L across all of it. Consider a trader with funded accounts at Topstep, Apex, and FTMO. In any given month, they might have:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li>Two payouts from Topstep via Rise</li>
          <li>One payout from Apex via Rise (same processor, different firm)</li>
          <li>One payout from FTMO via Wise</li>
          <li>A challenge fee charged by Apex for a new evaluation</li>
          <li>A monthly NinjaTrader subscription</li>
          <li>CME data feed charges</li>
          <li>A reset fee at Topstep for a new account attempt</li>
        </ul>
        <p className="text-terminal-text mb-6 leading-relaxed">
          That is seven or more transactions across three firms, two payment processors, and two vendors — in a single month. Over six months, that is 40+ transactions that need to be categorized, attributed to the right firm, and tallied to produce a real P&amp;L. Doing this in a spreadsheet is possible, but the probability of missing transactions, miscategorizing charges, or simply falling behind increases with every account you add.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          Most traders solve this problem by not solving it. They have a vague sense that &quot;things are going well&quot; based on the payouts they remember receiving, without accounting for the fees they have forgotten about. The result is a gap between perceived profitability and actual profitability that widens as the number of accounts grows.
        </p>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Building a Sustainable Multi-Account Operation</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          If you decide that multiple accounts are right for your situation, here are the principles that make the strategy work long-term:
        </p>
        <ul className="list-disc list-inside space-y-2 text-terminal-text mb-6 ml-4">
          <li><strong className="text-profit">Start with two accounts, not five.</strong> Add your second account only after your first has been consistently profitable for at least two months. Add a third only after the first two are both generating regular payouts. Slow scaling protects you from overcommitting.</li>
          <li><strong className="text-profit">Standardize where possible.</strong> Use the same platform across firms that support it. Use the same trading strategy on accounts with similar rules. The more variables you standardize, the less complexity you have to manage.</li>
          <li><strong className="text-profit">Track everything from day one.</strong> The financial tracking problem only gets harder over time. Whether you use a spreadsheet, an app, or bank-connected tracking, start tracking from your very first challenge fee. Retroactively reconstructing six months of transaction history across four firms is a nightmare.</li>
          <li><strong className="text-profit">Cut underperforming accounts.</strong> Not every account will work out. If an account at a specific firm has been consistently unprofitable — or if the overhead costs are not being justified by the payouts — close it. The sunk cost of the challenge fee is gone either way. Continuing to pay monthly fees on a losing account makes the loss worse.</li>
          <li><strong className="text-profit">Consolidate payout processors.</strong> Where possible, route payouts through the same processor to simplify tracking. If two firms both offer Rise, use Rise for both rather than splitting between Rise and Wise.</li>
        </ul>

        <h2 className="text-2xl font-bold text-terminal-text mt-12 mb-4">Solving the Tracking Problem</h2>
        <p className="text-terminal-text mb-6 leading-relaxed">
          The tracking problem is the core operational challenge of multi-account prop trading. Payouts from multiple firms land in your bank through different processors. Fees leave your bank under different vendor names. And the only place all of this data exists in one place is your bank account itself.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          This is exactly what Prop PNL was built for. By connecting your bank account, Prop PNL automatically identifies every prop firm payout and every prop firm expense — across all firms, all processors, all vendors. Instead of reconciling a spreadsheet with 40 transactions per month, you get a single dashboard showing your real P&amp;L per firm and in aggregate, updated automatically as transactions flow through your bank.
        </p>
        <p className="text-terminal-text mb-6 leading-relaxed">
          For traders managing one account, manual tracking is tedious but doable. For traders managing three, four, or five accounts across multiple firms, automated bank-connected tracking is the difference between knowing your numbers and guessing at them.
        </p>
        <blockquote className="border-l-2 border-profit/30 pl-4 italic text-terminal-muted mb-6">
          Multiple prop firm accounts multiply your earning potential — but they also multiply your complexity, your costs, and your opportunity for errors. The traders who make it work are the ones who treat multi-account management as an operations problem, not just a trading problem. Know your numbers across every account, or the accounts will eventually know you.
        </blockquote>
      </>
    ),
  },
];
