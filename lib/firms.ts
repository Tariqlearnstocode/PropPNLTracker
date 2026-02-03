export interface PropFirm {
  slug: string;
  name: string;
  payoutProcessor: string;
  feeProcessor: string;
  detection: 'auto' | 'manual';
  description: string;
  typicalFees: string[];
  website: string;
  category: 'futures' | 'forex' | 'stocks' | 'multi';
}

export interface PayoutProcessor {
  slug: string;
  name: string;
  description: string;
  firmsUsing: string[];
}

export const firms: PropFirm[] = [
  { slug: 'topstep', name: 'Topstep', payoutProcessor: 'Rise', feeProcessor: 'Stripe', detection: 'auto', description: 'One of the largest futures prop firms, offering funded accounts after passing a Trading Combine evaluation.', typicalFees: ['Monthly subscription ($49-$149/mo)', 'Reset fee ($99)', 'Data feed fees'], website: 'https://www.topstep.com', category: 'futures' },
  { slug: 'ftmo', name: 'FTMO', payoutProcessor: 'Direct Bank Transfer', feeProcessor: 'Credit card / crypto', detection: 'auto', description: 'A leading forex prop firm based in Prague, known for its two-step Challenge and Verification process.', typicalFees: ['Challenge fee ($155-$1,080)', 'Verification fee (included)', 'No recurring subscription'], website: 'https://www.ftmo.com', category: 'forex' },
  { slug: 'the5ers', name: 'The5%ers', payoutProcessor: 'Rise', feeProcessor: 'Credit card', detection: 'auto', description: 'A forex and metals prop firm offering instant funding and a scaling plan up to $4M in buying power.', typicalFees: ['Challenge fee ($95-$875)', 'No monthly subscription', 'No reset fees'], website: 'https://www.the5ers.com', category: 'forex' },
  { slug: 'apex-trader-funding', name: 'Apex Trader Funding', payoutProcessor: 'Rise', feeProcessor: 'Stripe', detection: 'auto', description: 'A popular futures prop firm with straightforward evaluation rules and frequent promotional pricing.', typicalFees: ['Monthly evaluation fee ($147-$657/mo)', 'Activation fee ($85)', 'Data feed fees'], website: 'https://www.apextraderfunding.com', category: 'futures' },
  { slug: 'myfundedfutures', name: 'MyFundedFutures', payoutProcessor: 'Rise', feeProcessor: 'Stripe', detection: 'auto', description: 'A futures prop firm focused on a simple one-step evaluation with fast payouts and trader-friendly rules.', typicalFees: ['Evaluation fee ($50-$300)', 'Reset fee', 'No monthly recurring fee'], website: 'https://www.myfundedfutures.com', category: 'futures' },
  { slug: 'earn2trade', name: 'Earn2Trade', payoutProcessor: 'Rise', feeProcessor: 'Credit card', detection: 'auto', description: 'A futures trading education and evaluation firm offering the Gauntlet Mini and Trader Career Path programs.', typicalFees: ['Monthly evaluation fee ($150-$350/mo)', 'Reset fee ($100)', 'Platform/data fees'], website: 'https://www.earn2trade.com', category: 'futures' },
  { slug: 'bulenox', name: 'Bulenox', payoutProcessor: 'Rise', feeProcessor: 'Stripe', detection: 'auto', description: 'A futures prop firm offering affordable evaluations with straightforward rules and Rise payouts.', typicalFees: ['Monthly evaluation fee ($115-$535/mo)', 'Activation fee ($98)', 'Reset fee'], website: 'https://www.bulenox.com', category: 'futures' },
  { slug: 'tradeday', name: 'TradeDay', payoutProcessor: 'Rise', feeProcessor: 'Stripe', detection: 'auto', description: 'A newer futures prop firm with competitive pricing, no daily drawdown limits, and fast evaluation passes.', typicalFees: ['Monthly evaluation fee ($99-$625/mo)', 'Activation fee', 'No reset fees'], website: 'https://www.tradeday.com', category: 'futures' },
  { slug: 'takeprofittrader', name: 'TakeProfitTrader', payoutProcessor: 'Rise', feeProcessor: 'Stripe', detection: 'auto', description: 'A futures evaluation firm known for its PRO account structure and quick same-day payouts via Rise.', typicalFees: ['Monthly evaluation fee ($150-$360/mo)', 'Activation fee ($130)', 'Reset fee ($99)'], website: 'https://www.takeprofittrader.com', category: 'futures' },
  { slug: 'tradeify', name: 'Tradeify', payoutProcessor: 'Rise', feeProcessor: 'Stripe', detection: 'auto', description: 'A futures prop firm offering a straightforward evaluation with no scaling rules and daily payouts.', typicalFees: ['Monthly evaluation fee ($100-$350/mo)', 'Activation fee', 'No reset fees'], website: 'https://www.tradeify.com', category: 'futures' },
  { slug: 'fundednext', name: 'FundedNext', payoutProcessor: 'Rise', feeProcessor: 'Credit card / crypto', detection: 'auto', description: 'A multi-asset prop firm supporting forex and futures, offering up to 95% profit splits and multiple evaluation models.', typicalFees: ['Challenge fee ($32-$999)', 'No monthly subscription', 'No reset fees'], website: 'https://www.fundednext.com', category: 'multi' },
  { slug: 'leeloo-trading', name: 'Leeloo Trading', payoutProcessor: 'Rise', feeProcessor: 'Stripe', detection: 'auto', description: 'A futures prop firm with multiple evaluation programs and an emphasis on trader development and risk management.', typicalFees: ['Monthly evaluation fee ($77-$675/mo)', 'Activation fee ($85)', 'Reset fee'], website: 'https://www.leelootrading.com', category: 'futures' },
  { slug: 'elite-trader-funding', name: 'Elite Trader Funding', payoutProcessor: 'Rise', feeProcessor: 'Stripe', detection: 'auto', description: 'A futures prop firm offering fast evaluations with simple rules and one of the lowest activation fees in the industry.', typicalFees: ['Monthly evaluation fee ($80-$690/mo)', 'Activation fee ($80)', 'Reset fee ($75)'], website: 'https://www.elitetraderfunding.com', category: 'futures' },
  { slug: 'blusky-trading', name: 'BluSky Trading', payoutProcessor: 'Rise', feeProcessor: 'Stripe', detection: 'auto', description: 'A futures prop firm offering evaluations with no minimum trading days and straightforward payout rules.', typicalFees: ['Monthly evaluation fee ($125-$535/mo)', 'Activation fee', 'Reset fee'], website: 'https://www.bluskytrading.com', category: 'futures' },
  { slug: 'surgetrader', name: 'SurgeTrader', payoutProcessor: 'Various', feeProcessor: 'Credit card', detection: 'auto', description: 'A multi-asset prop firm supporting forex, futures, and stocks with a one-phase audition process.', typicalFees: ['Audition fee ($200-$6,500)', 'No monthly subscription', 'No reset fees'], website: 'https://www.surgetrader.com', category: 'multi' },
  { slug: 'true-forex-funds', name: 'True Forex Funds', payoutProcessor: 'Rise', feeProcessor: 'Credit card / crypto', detection: 'auto', description: 'A forex prop firm offering one-step and two-step evaluation programs with up to 80% profit splits.', typicalFees: ['Challenge fee ($59-$899)', 'No monthly subscription', 'No reset fees'], website: 'https://www.trueforexfunds.com', category: 'forex' },
];

export const payoutProcessors: PayoutProcessor[] = [
  { slug: 'rise', name: 'Rise (Riseworks)', description: 'The dominant payout processor for prop trading firms. Rise handles payouts for the majority of futures prop firms and an increasing number of forex firms. Funds appear as deposits from "Riseworks" or "Rise" in your bank statement.', firmsUsing: ['topstep', 'the5ers', 'apex-trader-funding', 'myfundedfutures', 'earn2trade', 'bulenox', 'tradeday', 'takeprofittrader', 'tradeify', 'fundednext', 'leeloo-trading', 'elite-trader-funding', 'blusky-trading', 'true-forex-funds'] },
  { slug: 'wise', name: 'Wise (TransferWise)', description: 'An international money transfer service used by some prop firms for cross-border payouts. Transactions appear as "Wise" or "TransferWise" on your bank statement.', firmsUsing: ['ftmo'] },
  { slug: 'stripe', name: 'Stripe', description: 'A payment processor primarily used by prop firms to collect evaluation and subscription fees. Charges appear as the firm name via Stripe on your bank statement.', firmsUsing: ['topstep', 'apex-trader-funding', 'myfundedfutures', 'bulenox', 'tradeday', 'takeprofittrader', 'tradeify', 'leeloo-trading', 'elite-trader-funding', 'blusky-trading'] },
  { slug: 'paypal', name: 'PayPal', description: 'An online payment platform occasionally used for prop firm fee collection. Transactions appear as "PayPal" followed by the firm name.', firmsUsing: [] },
  { slug: 'direct-bank-transfer', name: 'Direct Bank Transfer', description: 'Some prop firms send payouts directly via bank wire or ACH transfer. These appear as a direct deposit from the firm name on your bank statement.', firmsUsing: ['ftmo'] },
];

export function getFirmBySlug(slug: string): PropFirm | undefined {
  return firms.find((f) => f.slug === slug);
}

export function getFirmsByProcessor(processorSlug: string): PropFirm[] {
  const processor = payoutProcessors.find((p) => p.slug === processorSlug);
  if (!processor) return [];
  return firms.filter((f) => processor.firmsUsing.includes(f.slug));
}

export function getCategoryLabel(category: PropFirm['category']): string {
  switch (category) {
    case 'futures': return 'Futures';
    case 'forex': return 'Forex';
    case 'stocks': return 'Stocks';
    case 'multi': return 'Multi-Asset';
  }
}
