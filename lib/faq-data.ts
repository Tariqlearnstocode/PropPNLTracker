export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQCategory = {
  category: string;
  faqs: FAQItem[];
};

export const faqCategories: FAQCategory[] = [
  {
    category: 'Getting Started',
    faqs: [
      {
        question: 'What is Prop PNL and how does it work?',
        answer:
          'Prop PNL is a P&L tracker built specifically for prop firm traders. Instead of manually logging payouts and fees in a spreadsheet, you connect your bank account and we automatically pull your transaction history. Our engine identifies deposits from prop firms and payout processors like Rise, Wise, and Stripe, categorizes them as payouts or fees, and calculates your true net profit and loss across all firms. The whole process takes about 60 seconds.',
      },
      {
        question: 'How do I get started?',
        answer:
          'Sign up, pick a plan, and connect your bank. Your full P&L report is generated in about 60 seconds. We offer a One-Time snapshot for $39.99, a Monthly plan at $14.95/mo with weekly syncs, and a Lifetime plan for $199 with permanent access.',
      },
      {
        question: 'How long does it take to set up?',
        answer:
          'About 60 seconds. You create an account, click "Connect Your Bank," authenticate with your bank through Teller\u2019s secure widget, and your report is generated instantly. There is no manual data entry, no CSV uploads, and no configuration required.',
      },
    ],
  },
  {
    category: 'How It Works',
    faqs: [
      {
        question: 'Does Prop PNL connect to my prop firm accounts?',
        answer:
          'No\u2014we connect to your bank account, not your prop firm platform. This is intentional. Prop firm dashboards show your gross trading performance, but your bank account shows the real money: payouts that actually hit your account and fees that actually left it. That is the number that matters for calculating true profitability.',
      },
      {
        question: 'What prop firms and payout processors do you support?',
        answer:
          'We auto-detect transactions from 47+ prop firms including Topstep, FTMO, Apex Trader Funding, Apex, Earn2Trade, Bulenox, TradeDay, TakeProfitTrader, Tradeify, FundedNext, Leeloo, Elite Trader Funding, MyFundedFutures, and many more. We also recognize all major payout processors: Rise (Riseworks), Wise (TransferWise), PayPal, Stripe, and direct bank transfers. If a transaction is not automatically detected, you can manually assign it to a firm in your dashboard.',
      },
      {
        question:
          'Does this track individual trades or just payouts and fees?',
        answer:
          'Prop PNL tracks your business-level P&L\u2014payouts received versus fees and costs paid\u2014not trade-by-trade journal entries. We solve a different problem than trading journals like TradesViz or Tradervue. Think of it this way: your trading journal tracks how you trade, while Prop PNL tracks whether your prop firm trading is actually profitable as a business after all costs.',
      },
      {
        question: 'What if a transaction is not automatically categorized?',
        answer:
          'You can manually assign any unrecognized transaction to a specific prop firm directly in your dashboard. This ensures your P&L stays accurate even if a firm uses an unusual payment description or a processor we have not seen before. Once assigned, the transaction is immediately reflected in your report.',
      },
    ],
  },
  {
    category: 'Pricing & Plans',
    faqs: [
      {
        question: 'What are the pricing plans?',
        answer:
          'We offer three options. One-Time: $39.99, a single snapshot report with up to 5 bank accounts and up to 12 months of history\u2014ideal for tax time. Monthly: $14.95/mo, includes up to 5 bank accounts, up to 12 months of history, weekly automatic transaction syncs, and leaderboard eligibility. Cancel anytime. Lifetime: $199 one-time payment, everything in Monthly forever with no recurring charges. All plans include the full dashboard, charts, per-firm breakdowns, CSV/PDF export, and a shareable public P&L link.',
      },
      {
        question: 'Can I cancel my Pro subscription?',
        answer:
          'Yes. Cancel anytime\u2014no questions asked, no cancellation fees. Payments are processed through Stripe, and you can manage your subscription from your account settings.',
      },
    ],
  },
  {
    category: 'Security & Privacy',
    faqs: [
      {
        question: 'Is connecting my bank account safe?',
        answer:
          'Yes. We use Teller, a financial data provider that is SOC 2 Type II and PCI DSS certified\u2014the same technology used by major tax and finance apps. Your bank login credentials are never stored on our servers. The connection is strictly read-only, meaning we can only view transactions and balances. We cannot move money, initiate transfers, or access your full account numbers. Access tokens are deleted immediately after fetching your data, and bank connections are disconnected right after use.',
      },
      {
        question: 'What data do you store and how is it protected?',
        answer:
          'We store your transaction history and calculated P&L reports. All data is encrypted at rest with AES-256 and in transit with TLS 1.3. We only store the last 4 digits of account numbers. Our database uses Postgres Row Level Security, which means even if there were a bug in our application code, the database itself prevents access to other users\u2019 data. We comply with GDPR and CCPA, and you can request deletion of all your data at any time.',
      },
    ],
  },
  {
    category: 'Features & Sharing',
    faqs: [
      {
        question: 'What is the shareable P&L link?',
        answer:
          'Every Prop PNL report comes with a unique public link you can share with anyone\u2014followers, investors, coaching clients, or accountability partners. The link shows your bank-verified total payouts, total fees, net P&L, and monthly breakdowns. Unlike screenshots, it is always current and cannot be faked. You can also customize your link with a personal slug and share directly to X (Twitter) or LinkedIn.',
      },
      {
        question: 'Can I export my data for taxes?',
        answer:
          'Yes. Every plan supports CSV and PDF export. You can download your full transaction history, monthly P&L breakdowns, and per-firm summaries in a format your accountant can use directly. The One-Time plan at $39.99 is specifically designed for traders who just need a clean export for tax season without an ongoing subscription.',
      },
      {
        question: 'Can I connect multiple bank accounts?',
        answer:
          'All plans support up to 5 bank accounts, and all transactions are aggregated into a single unified dashboard. This is useful if you receive payouts to different accounts or use separate accounts for different firms.',
      },
    ],
  },
  {
    category: 'Limitations',
    faqs: [
      {
        question: 'Does Prop PNL work outside the United States?',
        answer:
          'Currently, no. Teller, our bank connection provider, supports US banks only. We are working on expanding to more regions, but right now Prop PNL requires a US bank account. If your prop firm payouts are deposited into a US bank account, it will work regardless of where you are located.',
      },
      {
        question: 'How accurate are the P&L calculations?',
        answer:
          'Our calculations are based on actual bank transaction data, which makes them inherently more accurate than manual tracking. However, P&L figures are estimates based on transaction pattern matching. Limitations include: transactions deposited into accounts you have not connected, delayed transaction data from your bank, or unusual payment descriptions we do not automatically recognize. You can manually assign any unrecognized transactions to maintain accuracy. We always recommend verifying figures independently for official tax reporting.',
      },
    ],
  },
];

/** Curated subset for the homepage — the questions that matter most for conversion */
export const homepageFAQs: FAQItem[] = [
  faqCategories[0].faqs[0], // What is Prop PNL
  faqCategories[0].faqs[1], // Credit card needed?
  faqCategories[1].faqs[0], // Connect to prop firm accounts?
  faqCategories[3].faqs[0], // Is it safe?
  faqCategories[2].faqs[0], // Pricing plans
  faqCategories[1].faqs[1], // Supported firms
];
