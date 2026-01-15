/**
 * PNL calculation utilities for prop firm tracking
 * These functions take raw financial data (Teller) and compute PNL metrics
 * Calculations are done at display time, not stored
 */

// ============ PROP FIRM MATCHING PATTERNS ============

// Known prop firm names (case-insensitive matching)
const PROP_FIRM_NAMES = [
  // Already in list (keeping for reference)
  'ftmo',
  'topstep',
  'the5ers',
  'myforexfunds',
  'fundednext',
  'funded next',
  'apex trader funding',
  'apex',
  'surgetrader',
  'earn2trade',
  'funded trading plus',
  'the funded trader',
  'tft',
  'funded trading',
  'oneup trader',
  'blu sky',
  'bluesky',
  'elite trader funding',
  'city traders',
  'citytrader',
  'traders with edge',
  'twe',
  'the trading pit',
  'ttf',
  'smart prop trader',
  'smartprop',
  'funded engineer',
  'funding pips',
  'trade the pool',
  'funded trader plus',
  'ftplus',
  'the prop trading',
  'funded trading elite',
  'elite funding',
  'traders central',
  'funded trader academy',
  'the prop firm',
  'funded trader pro',
  'tradeify',
  'traders edge',
  'funded trader',
  'take profit trader',
  
  // Futures Space - New additions
  'my funded futures',
  'alpha futures',
  'daytraders',
  'daytraders.com',
  'legends trading',
  'funded futures network',
  'bulenox',
  'tradeday',
  'uprofit',
  'fundingticks',
  'dna funded',
  'lmi',
  'liberty market investments',
  'top one futures',
  
  // Forex Space - New additions
  'alpha capital',
  'maven',
  'brightfunded',
  'thinkcapital',
  'aquafunded',
  'blueberry funded',
  'e8 markets',
  'qt funded',
  'hantec trader',
  'blue guardian',
  'oanda',
  'oanda prop trader',
  'instant funding',
  'pipfarm',
  'audacity capital',
  'for traders',
  'finotive funding',
  'atfunded',
  
  // Crypto Space - New additions
  'hyrotrader',
];

// Payment processors commonly used by prop firms (Rise, Wise, and Skrill)
const PAYMENT_PROCESSORS = [
  'rise',
  'rise works',
  'skrill',
  'wise',
  'transferwise', // Wise was previously called TransferWise
];

// Patterns that suggest prop-firm-like transactions but aren't specific firm names
const PROP_FIRM_PATTERNS = [
  'funded',
  'funded trader',
  'funded trading',
  'prop firm',
  'prop trading',
  'trading firm',
  'challenge',
  'evaluation',
  'funded account',
  'futures',
];

// Fee/subscription indicators
const FEE_INDICATORS = [
  'challenge',
  'evaluation',
  'subscription',
  'fee',
  'payment',
  'charge',
  'cost',
  'monthly',
  'weekly',
  'annual',
];

export type TransactionType = 'deposit' | 'fee' | 'unmatched';
export type MatchConfidence = 'high' | 'medium' | 'low';

// ============ RAW DATA TYPES ============

export interface RawFinancialData {
  accounts: any[];
  transactions: any[];
  fetched_at: string;
  date_range: {
    start: string;
    end: string;
  };
  provider?: 'plaid' | 'teller';
}

// ============ NORMALIZED TYPES ============

export interface NormalizedAccount {
  id: string;
  name: string;
  officialName: string | null;
  type: string;
  subtype: string | null;
  mask: string | null;
  currentBalance: number | null;
  availableBalance: number | null;
  institution?: string;
}

export interface NormalizedTransaction {
  id: string;
  accountId: string;
  amount: number; // Always positive
  date: string;
  name: string;
  category: string | null;
  pending: boolean;
  isIncome: boolean;
  runningBalance: number | null;
}

// ============ REPORT TYPES ============

export interface TransactionMatch {
  type: TransactionType;
  firmName: string | null;
  confidence: MatchConfidence;
  needsAssignment?: boolean; // true if pattern-matched but no specific firm
}

export interface TransactionWithMatch extends NormalizedTransaction {
  match: TransactionMatch;
}

export interface MonthlyPNL {
  month: string; // YYYY-MM format
  deposits: number;
  fees: number;
  netPNL: number;
  runningTotal: number;
  transactionCount: number;
}

export interface FirmPNL {
  firmName: string;
  deposits: number;
  fees: number;
  netPNL: number;
  transactionCount: number;
  confidence: MatchConfidence;
}

export interface PNLReport {
  summary: {
    totalDeposits: number;
    totalFees: number;
    netPNL: number;
    totalBalance: number;
    totalAvailable: number;
    accountCount: number;
    transactionCount: number;
    matchedCount: number;
    unmatchedCount: number;
    monthsOfData: number;
  };
  accounts: NormalizedAccount[];
  monthlyBreakdown: MonthlyPNL[];
  perFirmBreakdown: FirmPNL[];
  transactions: TransactionWithMatch[];
  generatedAt: string;
}

// ============ NORMALIZATION FUNCTIONS ============

/**
 * Detect provider from raw data structure
 */
function detectProvider(rawData: RawFinancialData): 'plaid' | 'teller' {
  if (rawData.provider) return rawData.provider;
  
  // Teller accounts have 'enrollment_id' and 'last_four'
  if (rawData.accounts[0]?.enrollment_id || rawData.accounts[0]?.last_four) {
    return 'teller';
  }
  // Plaid accounts have 'account_id' and 'mask'
  return 'plaid';
}

/**
 * Normalize accounts from either provider
 */
function normalizeAccounts(accounts: any[], provider: 'plaid' | 'teller'): NormalizedAccount[] {
  if (provider === 'teller') {
    return accounts.map((acc) => ({
      id: acc.id,
      name: acc.name || 'Unknown Account',
      officialName: null,
      type: acc.type || 'depository',
      subtype: acc.subtype || null,
      mask: acc.last_four || null,
      currentBalance: acc.balances?.ledger ? parseFloat(acc.balances.ledger) : null,
      availableBalance: acc.balances?.available ? parseFloat(acc.balances.available) : null,
      institution: acc.institution?.name || null,
    }));
  }
  
  // Plaid format
  return accounts.map((acc) => ({
    id: acc.account_id,
    name: acc.name || 'Unknown Account',
    officialName: acc.official_name || null,
    type: acc.type || 'depository',
    subtype: acc.subtype || null,
    mask: acc.mask || null,
    currentBalance: acc.balances?.current ?? null,
    availableBalance: acc.balances?.available ?? null,
    institution: undefined,
  }));
}

/**
 * Normalize transactions from either provider
 */
function normalizeTransactions(transactions: any[], provider: 'plaid' | 'teller'): NormalizedTransaction[] {
  if (provider === 'teller') {
    return transactions.map((t) => {
      const amount = parseFloat(t.amount);
      // In Teller: positive amount = money IN (deposit), negative amount = money OUT (fee)
      const isIncome = amount > 0;
      
      return {
        id: t.id,
        accountId: t.account_id,
        amount: Math.abs(amount),
        date: t.date,
        // Use description first - it contains the FULL transaction text
        name: t.description || t.details?.counterparty?.name || 'Unknown',
        category: t.details?.category || null,
        pending: t.status === 'pending',
        isIncome,
        runningBalance: t.running_balance ? parseFloat(t.running_balance) : null,
      };
    });
  }
  
  // Plaid format
  return transactions.map((t) => {
    // In Plaid: positive amount = money out, negative amount = money in
    const isIncome = t.amount < 0;
    
    return {
      id: t.transaction_id,
      accountId: t.account_id,
      amount: Math.abs(t.amount),
      date: t.date,
      name: t.merchant_name || t.name || 'Unknown',
      category: t.category?.[0] || null,
      pending: t.pending || false,
      isIncome,
      runningBalance: null, // Plaid doesn't provide running balance
    };
  });
}

// ============ PROP FIRM MATCHING FUNCTIONS ============

/**
 * Detect if a transaction name contains prop-firm-like patterns
 */
function detectPropFirmPattern(name: string): boolean {
  const lowerName = name.toLowerCase();
  return PROP_FIRM_PATTERNS.some(pattern => lowerName.includes(pattern));
}

/**
 * Extract prop firm name from transaction description
 * Note: Payment processors are NOT returned here - they're treated as patterns
 */
function extractFirmName(name: string): string | null {
  const lowerName = name.toLowerCase();
  
  // Check for exact prop firm name matches
  for (const firmName of PROP_FIRM_NAMES) {
    if (lowerName.includes(firmName)) {
      // Return the original casing from the transaction if possible
      // Otherwise return a formatted version
      const matchIndex = lowerName.indexOf(firmName);
      if (matchIndex !== -1) {
        const matchedText = name.substring(matchIndex, matchIndex + firmName.length);
        // Try to capitalize properly
        return matchedText.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
      }
    }
  }
  
  // Payment processors are NOT returned as firm names - they're treated as patterns
  // See classifyPropFirmTransaction() for payment processor handling
  
  return null;
}

/**
 * Detect if a transaction is a payment processor (Rise, Wise, Skrill)
 */
function detectPaymentProcessor(name: string): boolean {
  const lowerName = name.toLowerCase();
  // Check "rise works" first since it contains "rise"
  if (lowerName.includes('rise works')) return true;
  if (lowerName.includes('rise')) return true;
  // Check "transferwise" first since it contains "wise"
  if (lowerName.includes('transferwise')) return true;
  if (lowerName.includes('wise')) return true;
  if (lowerName.includes('skrill')) return true;
  return false;
}

/**
 * Classify a transaction as deposit, fee, or unmatched
 */
function classifyPropFirmTransaction(name: string, isIncome: boolean): TransactionMatch {
  const lowerName = name.toLowerCase();
  
  // Check for payment processors FIRST - treat them as patterns (unmatched + needsAssignment)
  if (detectPaymentProcessor(name)) {
    return {
      type: 'unmatched',
      firmName: null,
      confidence: 'low',
      needsAssignment: true,
    };
  }
  
  // Extract firm name - if no match, check for patterns
  const firmName = extractFirmName(name);
  if (!firmName) {
    // No firm name match - check for patterns
    const hasPattern = detectPropFirmPattern(name);
    return { 
      type: 'unmatched', 
      firmName: null, 
      confidence: 'low',
      needsAssignment: hasPattern,
    };
  }
  
  // We have a firm name match (not a payment processor)
  // Determine match type for confidence
  const matchedPropFirm = PROP_FIRM_NAMES.some(firm => lowerName.includes(firm));
  
  if (isIncome) {
    // Incoming money = deposit/payout from prop firm
    return {
      type: 'deposit',
      firmName,
      confidence: matchedPropFirm ? 'high' : 'medium',
    };
  } else {
    // Outgoing money = fee to prop firm
    const hasFeeIndicators = FEE_INDICATORS.some(ind => lowerName.includes(ind));
    const baseConfidence = matchedPropFirm ? 'high' : 'medium';
    
    return {
      type: 'fee',
      firmName,
      // Boost confidence if fee indicators present (helps confirm it's actually a fee)
      confidence: hasFeeIndicators && matchedPropFirm ? 'high' : baseConfidence,
    };
  }
}

// ============ CALCULATION FUNCTIONS ============

/**
 * Group transactions by month (YYYY-MM format)
 */
function groupByMonth(transactions: TransactionWithMatch[]): Record<string, TransactionWithMatch[]> {
  const grouped: Record<string, TransactionWithMatch[]> = {};
  
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!grouped[monthKey]) grouped[monthKey] = [];
    grouped[monthKey].push(t);
  });
  
  return grouped;
}

/**
 * Group matched transactions by firm name
 */
function groupByFirm(transactions: TransactionWithMatch[]): Record<string, TransactionWithMatch[]> {
  const grouped: Record<string, TransactionWithMatch[]> = {};
  
  transactions.forEach((t) => {
    if (t.match.type !== 'unmatched' && t.match.firmName) {
      const firmName = t.match.firmName;
      if (!grouped[firmName]) grouped[firmName] = [];
      grouped[firmName].push(t);
    }
  });
  
  return grouped;
}

/**
 * Calculate monthly PNL breakdown
 */
function calculateMonthlyBreakdown(transactions: TransactionWithMatch[]): MonthlyPNL[] {
  const monthlyGroups = groupByMonth(transactions);
  const months = Object.keys(monthlyGroups).sort(); // Oldest first for running total
  
  let runningTotal = 0;
  const monthlyPNL: MonthlyPNL[] = months.map((month) => {
    const monthTransactions = monthlyGroups[month];
    
    const deposits = monthTransactions
      .filter(t => t.match.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const fees = monthTransactions
      .filter(t => t.match.type === 'fee')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netPNL = deposits - fees;
    runningTotal += netPNL;
    
    return {
      month,
      deposits,
      fees,
      netPNL,
      runningTotal,
      transactionCount: monthTransactions.length,
    };
  });
  
  return monthlyPNL;
}

/**
 * Calculate per-firm PNL breakdown
 */
function calculatePerFirmBreakdown(transactions: TransactionWithMatch[]): FirmPNL[] {
  const firmGroups = groupByFirm(transactions);
  const firms = Object.keys(firmGroups);
  
  const firmPNL: FirmPNL[] = firms.map((firmName) => {
    const firmTransactions = firmGroups[firmName];
    
    const deposits = firmTransactions
      .filter(t => t.match.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const fees = firmTransactions
      .filter(t => t.match.type === 'fee')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netPNL = deposits - fees;
    
    // Determine overall confidence (use highest confidence from transactions)
    const confidences = firmTransactions.map(t => t.match.confidence);
    const confidence: MatchConfidence = confidences.includes('high') 
      ? 'high' 
      : confidences.includes('medium') 
        ? 'medium' 
        : 'low';
    
    return {
      firmName,
      deposits,
      fees,
      netPNL,
      transactionCount: firmTransactions.length,
      confidence,
    };
  });
  
  // Sort by net PNL (highest first)
  return firmPNL.sort((a, b) => b.netPNL - a.netPNL);
}

/**
 * Calculate months of data available
 */
function calculateMonthsOfData(transactions: NormalizedTransaction[]): number {
  if (transactions.length === 0) return 0;
  
  const dates = transactions
    .map(t => new Date(t.date))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());
  
  if (dates.length === 0) return 0;
  
  const earliest = dates[0];
  const latest = dates[dates.length - 1];
  
  const monthsDiff = (latest.getFullYear() - earliest.getFullYear()) * 12 + 
                     (latest.getMonth() - earliest.getMonth());
  
  return Math.max(1, monthsDiff + 1); // At least 1 month
}

// ============ MAIN CALCULATION FUNCTION ============

/**
 * Calculate PNL report from raw financial data
 * Supports both Plaid and Teller data formats
 * @param rawData - Raw financial data from provider
 * @param manualAssignments - Optional manual assignments: { transactionId: firmName }
 */
export function calculatePNLReport(
  rawData: RawFinancialData,
  manualAssignments?: Record<string, string>
): PNLReport {
  const provider = detectProvider(rawData);
  
  // Normalize data to common format
  const accounts = normalizeAccounts(rawData.accounts, provider);
  const transactions = normalizeTransactions(rawData.transactions, provider);
  
  // Classify all transactions
  let transactionsWithMatches: TransactionWithMatch[] = transactions.map((t) => ({
    ...t,
    match: classifyPropFirmTransaction(t.name, t.isIncome),
  }));
  
  // Apply manual assignments BEFORE calculations
  // Convert unmatched transactions with assignments to deposit/fee
  if (manualAssignments && Object.keys(manualAssignments).length > 0) {
    transactionsWithMatches = transactionsWithMatches.map((t) => {
      const assignedFirm = manualAssignments[t.id];
      if (assignedFirm && t.match.type === 'unmatched') {
        // Convert unmatched transaction to deposit/fee based on isIncome
        return {
          ...t,
          match: {
            type: t.isIncome ? 'deposit' : 'fee',
            firmName: assignedFirm,
            confidence: 'high' as const,
            needsAssignment: false,
          },
        };
      }
      return t;
    });
  }
  
  // Filter out pending transactions for calculations
  const nonPendingTransactions = transactionsWithMatches.filter(t => !t.pending);
  
  // Calculate totals
  const matchedTransactions = nonPendingTransactions.filter(t => t.match.type !== 'unmatched');
  const unmatchedTransactions = nonPendingTransactions.filter(t => t.match.type === 'unmatched');
  
  const totalDeposits = matchedTransactions
    .filter(t => t.match.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalFees = matchedTransactions
    .filter(t => t.match.type === 'fee')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netPNL = totalDeposits - totalFees;
  
  // Account balances
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);
  const totalAvailable = accounts.reduce((sum, acc) => sum + (acc.availableBalance || 0), 0);
  
  // Calculate monthly breakdown
  const monthlyBreakdown = calculateMonthlyBreakdown(nonPendingTransactions);
  
  // Calculate per-firm breakdown
  const perFirmBreakdown = calculatePerFirmBreakdown(nonPendingTransactions);
  
  // Calculate months of data
  const monthsOfData = calculateMonthsOfData(transactions);
  
  // Sort all transactions by date (newest first)
  const sortedTransactions = [...transactionsWithMatches]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return {
    summary: {
      totalDeposits,
      totalFees,
      netPNL,
      totalBalance,
      totalAvailable,
      accountCount: accounts.length,
      transactionCount: transactions.length,
      matchedCount: matchedTransactions.length,
      unmatchedCount: unmatchedTransactions.length,
      monthsOfData,
    },
    accounts,
    monthlyBreakdown,
    perFirmBreakdown,
    transactions: sortedTransactions,
    generatedAt: new Date().toISOString(),
  };
}

// ============ FORMATTING UTILITIES ============

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format month label (YYYY-MM) to readable format
 */
export function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ============ STATS CALCULATION FUNCTIONS ============

export interface DailyPNL {
  date: string; // YYYY-MM-DD
  deposits: number;
  fees: number;
  netPNL: number;
  purchaseCount: number;
  payoutCount: number;
}

export interface ActivityStats {
  totalPurchases: number;
  totalPayouts: number;
  purchaseToPayoutRatio: number;
  averagePurchaseSize: number;
  averagePayoutSize: number;
  activeMonths: number;
}

export interface BestWorstStats {
  bestMonth: { month: string; netPNL: number; deposits: number; fees: number } | null;
  worstMonth: { month: string; netPNL: number; deposits: number; fees: number } | null;
  bestDay: { date: string; netPNL: number; deposits: number } | null;
  largestPurchase: { date: string; amount: number; firmName: string | null } | null;
  bestFirm: { firmName: string; netPNL: number } | null;
  worstFirm: { firmName: string; netPNL: number } | null;
}

export interface DayOfWeekStats {
  day: string; // Monday, Tuesday, etc.
  totalPNL: number;
  purchaseCount: number;
  payoutCount: number;
  averagePNL: number;
}

export interface ROIStats {
  roi: number; // (Total PNL / Total Fees) * 100
  returnPerDollar: number; // Net PNL / Total Fees
  profitMargin: number; // (Net PNL / Total Deposits) * 100
  breakEvenDate: string | null; // Date when cumulative fees = cumulative deposits
  costPerPayout: number; // Total Fees / Total Payouts
}

export interface StreakStats {
  currentWinStreak: number; // Consecutive profitable months
  longestWinStreak: number;
  currentLossStreak: number;
  longestLossStreak: number;
  winRate: number; // Profitable months / total months
  totalProfitableMonths: number;
  totalUnprofitableMonths: number;
}

export interface PurchaseFrequencyStats {
  topPurchaseDays: Array<{ date: string; count: number; totalAmount: number }>;
  averagePurchaseSize: number;
  mostCommonPurchaseAmount: number;
  purchaseFrequencyDistribution: Array<{ range: string; count: number }>;
}

export interface PayoutPerformanceStats {
  totalPayouts: number;
  averagePayoutSize: number;
  largestPayout: { date: string; amount: number; firmName: string | null } | null;
  smallestPayout: { date: string; amount: number; firmName: string | null } | null;
  payoutFrequency: number; // Payouts per month
  averageDaysBetweenPayouts: number;
}

export interface GrowthTrends {
  monthOverMonthGrowth: Array<{ month: string; growth: number; netPNL: number }>;
  averageMonthlyPNL: number;
  projectedAnnualPNL: number;
  growthVelocity: number; // Acceleration/deceleration
  cumulativePNL: Array<{ month: string; cumulative: number }>;
}

export interface FirmComparisonStats {
  mostProfitableFirm: { firmName: string; netPNL: number } | null;
  bestROIFirm: { firmName: string; roi: number; netPNL: number; fees: number } | null;
  mostActiveFirm: { firmName: string; transactionCount: number } | null;
  averagePayoutPerFirm: number;
  firmSuccessRate: Array<{ firmName: string; successRate: number; payouts: number; purchases: number }>;
}

export interface TradingStats {
  dailyPNL: DailyPNL[];
  activityStats: ActivityStats;
  bestWorstStats: BestWorstStats;
  dayOfWeekStats: DayOfWeekStats[];
  roiStats: ROIStats;
  streakStats: StreakStats;
  purchaseFrequencyStats: PurchaseFrequencyStats;
  payoutPerformanceStats: PayoutPerformanceStats;
  growthTrends: GrowthTrends;
  firmComparisonStats: FirmComparisonStats;
}

/**
 * Calculate daily PNL breakdown
 */
function calculateDailyPNL(transactions: TransactionWithMatch[]): DailyPNL[] {
  const dailyData: Record<string, DailyPNL> = {};
  
  const nonPendingTransactions = transactions.filter(t => !t.pending);
  
  nonPendingTransactions.forEach(txn => {
    const date = txn.date.split('T')[0]; // Get YYYY-MM-DD
    
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        deposits: 0,
        fees: 0,
        netPNL: 0,
        purchaseCount: 0,
        payoutCount: 0,
      };
    }
    
    if (txn.match.type === 'deposit') {
      dailyData[date].deposits += txn.amount;
      dailyData[date].payoutCount += 1;
    } else if (txn.match.type === 'fee') {
      dailyData[date].fees += txn.amount;
      dailyData[date].purchaseCount += 1;
    }
  });
  
  // Calculate net PNL for each day
  Object.values(dailyData).forEach(day => {
    day.netPNL = day.deposits - day.fees;
  });
  
  return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate activity statistics
 */
function calculateActivityStats(transactions: TransactionWithMatch[], monthlyBreakdown: MonthlyPNL[]): ActivityStats {
  const nonPendingTransactions = transactions.filter(t => !t.pending);
  const purchases = nonPendingTransactions.filter(t => t.match.type === 'fee');
  const payouts = nonPendingTransactions.filter(t => t.match.type === 'deposit');
  
  const totalPurchases = purchases.length;
  const totalPayouts = payouts.length;
  const purchaseToPayoutRatio = totalPayouts > 0 ? totalPurchases / totalPayouts : 0;
  
  const totalPurchaseAmount = purchases.reduce((sum, t) => sum + t.amount, 0);
  const totalPayoutAmount = payouts.reduce((sum, t) => sum + t.amount, 0);
  
  const averagePurchaseSize = totalPurchases > 0 ? totalPurchaseAmount / totalPurchases : 0;
  const averagePayoutSize = totalPayouts > 0 ? totalPayoutAmount / totalPayouts : 0;
  
  const activeMonths = monthlyBreakdown.filter(m => m.transactionCount > 0).length;
  
  return {
    totalPurchases,
    totalPayouts,
    purchaseToPayoutRatio,
    averagePurchaseSize,
    averagePayoutSize,
    activeMonths,
  };
}

/**
 * Calculate best/worst performance stats
 */
function calculateBestWorstStats(
  monthlyBreakdown: MonthlyPNL[],
  dailyPNL: DailyPNL[],
  transactions: TransactionWithMatch[],
  perFirmBreakdown: FirmPNL[]
): BestWorstStats {
  // Best/Worst Month
  const bestMonth = monthlyBreakdown.length > 0
    ? monthlyBreakdown.reduce((best, month) => month.netPNL > best.netPNL ? month : best)
    : null;
  const worstMonth = monthlyBreakdown.length > 0
    ? monthlyBreakdown.reduce((worst, month) => month.netPNL < worst.netPNL ? month : worst)
    : null;
  
  // Best Day
  const bestDay = dailyPNL.length > 0
    ? dailyPNL.reduce((best, day) => day.netPNL > best.netPNL ? day : best)
    : null;
  
  // Largest Purchase
  const nonPendingTransactions = transactions.filter(t => !t.pending);
  const purchases = nonPendingTransactions.filter(t => t.match.type === 'fee');
  const largestPurchase = purchases.length > 0
    ? purchases.reduce((largest, t) => t.amount > largest.amount ? t : largest)
    : null;
  
  // Best/Worst Firm
  const bestFirm = perFirmBreakdown.length > 0
    ? perFirmBreakdown.reduce((best, firm) => firm.netPNL > best.netPNL ? firm : best)
    : null;
  const worstFirm = perFirmBreakdown.length > 0
    ? perFirmBreakdown.reduce((worst, firm) => firm.netPNL < worst.netPNL ? firm : worst)
    : null;
  
  return {
    bestMonth: bestMonth ? {
      month: bestMonth.month,
      netPNL: bestMonth.netPNL,
      deposits: bestMonth.deposits,
      fees: bestMonth.fees,
    } : null,
    worstMonth: worstMonth ? {
      month: worstMonth.month,
      netPNL: worstMonth.netPNL,
      deposits: worstMonth.deposits,
      fees: worstMonth.fees,
    } : null,
    bestDay: bestDay ? {
      date: bestDay.date,
      netPNL: bestDay.netPNL,
      deposits: bestDay.deposits,
    } : null,
    largestPurchase: largestPurchase ? {
      date: largestPurchase.date,
      amount: largestPurchase.amount,
      firmName: largestPurchase.match.firmName,
    } : null,
    bestFirm: bestFirm ? {
      firmName: bestFirm.firmName,
      netPNL: bestFirm.netPNL,
    } : null,
    worstFirm: worstFirm ? {
      firmName: worstFirm.firmName,
      netPNL: worstFirm.netPNL,
    } : null,
  };
}

/**
 * Calculate day-of-week statistics
 */
function calculateDayOfWeekStats(dailyPNL: DailyPNL[]): DayOfWeekStats[] {
  const dayStats: Record<string, { totalPNL: number; purchaseCount: number; payoutCount: number; dayCount: number }> = {};
  
  dailyPNL.forEach(day => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (!dayStats[dayName]) {
      dayStats[dayName] = { totalPNL: 0, purchaseCount: 0, payoutCount: 0, dayCount: 0 };
    }
    
    dayStats[dayName].totalPNL += day.netPNL;
    dayStats[dayName].purchaseCount += day.purchaseCount;
    dayStats[dayName].payoutCount += day.payoutCount;
    dayStats[dayName].dayCount += 1;
  });
  
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return dayOrder.map(day => {
    const stats = dayStats[day] || { totalPNL: 0, purchaseCount: 0, payoutCount: 0, dayCount: 0 };
    return {
      day,
      totalPNL: stats.totalPNL,
      purchaseCount: stats.purchaseCount,
      payoutCount: stats.payoutCount,
      averagePNL: stats.dayCount > 0 ? stats.totalPNL / stats.dayCount : 0,
    };
  });
}

/**
 * Calculate ROI and efficiency metrics
 */
function calculateROIStats(
  totalDeposits: number,
  totalFees: number,
  netPNL: number,
  transactions: TransactionWithMatch[],
  monthlyBreakdown: MonthlyPNL[]
): ROIStats {
  const roi = totalFees > 0 ? (netPNL / totalFees) * 100 : 0;
  const returnPerDollar = totalFees > 0 ? netPNL / totalFees : 0;
  const profitMargin = totalDeposits > 0 ? (netPNL / totalDeposits) * 100 : 0;
  
  // Calculate break-even date (when cumulative fees = cumulative deposits)
  let cumulativeFees = 0;
  let cumulativeDeposits = 0;
  let breakEvenDate: string | null = null;
  
  const sortedMonths = [...monthlyBreakdown].sort((a, b) => a.month.localeCompare(b.month));
  for (const month of sortedMonths) {
    cumulativeFees += month.fees;
    cumulativeDeposits += month.deposits;
    if (cumulativeDeposits >= cumulativeFees && breakEvenDate === null) {
      breakEvenDate = month.month;
    }
  }
  
  const nonPendingTransactions = transactions.filter(t => !t.pending);
  const payouts = nonPendingTransactions.filter(t => t.match.type === 'deposit');
  const costPerPayout = payouts.length > 0 ? totalFees / payouts.length : 0;
  
  return {
    roi,
    returnPerDollar,
    profitMargin,
    breakEvenDate,
    costPerPayout,
  };
}

/**
 * Calculate win/loss streaks
 */
function calculateStreakStats(monthlyBreakdown: MonthlyPNL[]): StreakStats {
  if (monthlyBreakdown.length === 0) {
    return {
      currentWinStreak: 0,
      longestWinStreak: 0,
      currentLossStreak: 0,
      longestLossStreak: 0,
      winRate: 0,
      totalProfitableMonths: 0,
      totalUnprofitableMonths: 0,
    };
  }
  
  const sortedMonths = [...monthlyBreakdown].sort((a, b) => b.month.localeCompare(a.month)); // Newest first
  
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let longestWinStreak = 0;
  let longestLossStreak = 0;
  let totalProfitableMonths = 0;
  let totalUnprofitableMonths = 0;
  
  let tempWinStreak = 0;
  let tempLossStreak = 0;
  
  sortedMonths.forEach(month => {
    if (month.netPNL > 0) {
      totalProfitableMonths++;
      tempWinStreak++;
      tempLossStreak = 0;
      if (tempWinStreak > longestWinStreak) longestWinStreak = tempWinStreak;
      if (currentWinStreak === 0 && currentLossStreak === 0) {
        currentWinStreak = tempWinStreak;
      }
    } else if (month.netPNL < 0) {
      totalUnprofitableMonths++;
      tempLossStreak++;
      tempWinStreak = 0;
      if (tempLossStreak > longestLossStreak) longestLossStreak = tempLossStreak;
      if (currentWinStreak === 0 && currentLossStreak === 0) {
        currentLossStreak = tempLossStreak;
      }
    } else {
      tempWinStreak = 0;
      tempLossStreak = 0;
    }
  });
  
  const winRate = monthlyBreakdown.length > 0 
    ? (totalProfitableMonths / monthlyBreakdown.length) * 100 
    : 0;
  
  return {
    currentWinStreak,
    longestWinStreak,
    currentLossStreak,
    longestLossStreak,
    winRate,
    totalProfitableMonths,
    totalUnprofitableMonths,
  };
}

/**
 * Calculate purchase frequency statistics
 */
function calculatePurchaseFrequencyStats(transactions: TransactionWithMatch[]): PurchaseFrequencyStats {
  const nonPendingTransactions = transactions.filter(t => !t.pending);
  const purchases = nonPendingTransactions.filter(t => t.match.type === 'fee');
  
  // Group purchases by date
  const purchasesByDate: Record<string, { count: number; totalAmount: number }> = {};
  purchases.forEach(p => {
    const date = p.date.split('T')[0];
    if (!purchasesByDate[date]) {
      purchasesByDate[date] = { count: 0, totalAmount: 0 };
    }
    purchasesByDate[date].count += 1;
    purchasesByDate[date].totalAmount += p.amount;
  });
  
  // Top purchase days
  const topPurchaseDays = Object.entries(purchasesByDate)
    .map(([date, data]) => ({ date, count: data.count, totalAmount: data.totalAmount }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Average purchase size
  const totalPurchaseAmount = purchases.reduce((sum, p) => sum + p.amount, 0);
  const averagePurchaseSize = purchases.length > 0 ? totalPurchaseAmount / purchases.length : 0;
  
  // Most common purchase amount (rounded to nearest $50)
  const purchaseAmounts = purchases.map(p => Math.round(p.amount / 50) * 50);
  const amountCounts: Record<number, number> = {};
  purchaseAmounts.forEach(amt => {
    amountCounts[amt] = (amountCounts[amt] || 0) + 1;
  });
  const mostCommonPurchaseAmount = Object.entries(amountCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 0;
  
  // Purchase frequency distribution
  const frequencyRanges = [
    { range: '$0-$50', min: 0, max: 50 },
    { range: '$50-$100', min: 50, max: 100 },
    { range: '$100-$200', min: 100, max: 200 },
    { range: '$200-$500', min: 200, max: 500 },
    { range: '$500+', min: 500, max: Infinity },
  ];
  
  const purchaseFrequencyDistribution = frequencyRanges.map(range => ({
    range: range.range,
    count: purchases.filter(p => p.amount >= range.min && p.amount < range.max).length,
  }));
  
  return {
    topPurchaseDays,
    averagePurchaseSize,
    mostCommonPurchaseAmount: Number(mostCommonPurchaseAmount),
    purchaseFrequencyDistribution,
  };
}

/**
 * Calculate payout performance statistics
 */
function calculatePayoutPerformanceStats(transactions: TransactionWithMatch[]): PayoutPerformanceStats {
  const nonPendingTransactions = transactions.filter(t => !t.pending);
  const payouts = nonPendingTransactions.filter(t => t.match.type === 'deposit');
  
  const totalPayouts = payouts.length;
  const totalPayoutAmount = payouts.reduce((sum, p) => sum + p.amount, 0);
  const averagePayoutSize = totalPayouts > 0 ? totalPayoutAmount / totalPayouts : 0;
  
  const largestPayout = payouts.length > 0
    ? payouts.reduce((largest, p) => p.amount > largest.amount ? p : largest)
    : null;
  const smallestPayout = payouts.length > 0
    ? payouts.reduce((smallest, p) => p.amount < smallest.amount ? p : smallest)
    : null;
  
  // Calculate payout frequency (payouts per month)
  const payoutDates = payouts.map(p => p.date.split('T')[0]);
  const uniqueMonths = new Set(payoutDates.map(d => d.substring(0, 7)));
  const uniqueMonthsArray = Array.from(uniqueMonths);
  const payoutFrequency = uniqueMonthsArray.length > 0 ? totalPayouts / uniqueMonthsArray.length : 0;
  
  // Calculate average days between payouts
  const uniquePayoutDates = Array.from(new Set(payoutDates));
  const sortedPayoutDates = uniquePayoutDates.sort();
  let totalDays = 0;
  for (let i = 1; i < sortedPayoutDates.length; i++) {
    const days = Math.floor(
      (new Date(sortedPayoutDates[i]).getTime() - new Date(sortedPayoutDates[i - 1]).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    totalDays += days;
  }
  const averageDaysBetweenPayouts = sortedPayoutDates.length > 1 
    ? totalDays / (sortedPayoutDates.length - 1) 
    : 0;
  
  return {
    totalPayouts,
    averagePayoutSize,
    largestPayout: largestPayout ? {
      date: largestPayout.date,
      amount: largestPayout.amount,
      firmName: largestPayout.match.firmName,
    } : null,
    smallestPayout: smallestPayout ? {
      date: smallestPayout.date,
      amount: smallestPayout.amount,
      firmName: smallestPayout.match.firmName,
    } : null,
    payoutFrequency,
    averageDaysBetweenPayouts,
  };
}

/**
 * Calculate growth trends
 */
function calculateGrowthTrends(monthlyBreakdown: MonthlyPNL[]): GrowthTrends {
  const sortedMonths = [...monthlyBreakdown].sort((a, b) => a.month.localeCompare(b.month));
  
  const monthOverMonthGrowth = sortedMonths.slice(1).map((month, i) => {
    const prevMonth = sortedMonths[i];
    const growth = prevMonth.netPNL !== 0 
      ? ((month.netPNL - prevMonth.netPNL) / Math.abs(prevMonth.netPNL)) * 100 
      : 0;
    return {
      month: month.month,
      growth,
      netPNL: month.netPNL,
    };
  });
  
  const totalPNL = sortedMonths.reduce((sum, m) => sum + m.netPNL, 0);
  const averageMonthlyPNL = sortedMonths.length > 0 ? totalPNL / sortedMonths.length : 0;
  const projectedAnnualPNL = averageMonthlyPNL * 12;
  
  // Calculate growth velocity (acceleration/deceleration)
  const recentGrowth = monthOverMonthGrowth.slice(-3);
  const earlierGrowth = monthOverMonthGrowth.slice(-6, -3);
  const recentAvg = recentGrowth.length > 0 
    ? recentGrowth.reduce((sum, g) => sum + g.growth, 0) / recentGrowth.length 
    : 0;
  const earlierAvg = earlierGrowth.length > 0 
    ? earlierGrowth.reduce((sum, g) => sum + g.growth, 0) / earlierGrowth.length 
    : 0;
  const growthVelocity = recentAvg - earlierAvg;
  
  // Calculate cumulative PNL
  let cumulative = 0;
  const cumulativePNL = sortedMonths.map(month => {
    cumulative += month.netPNL;
    return {
      month: month.month,
      cumulative,
    };
  });
  
  return {
    monthOverMonthGrowth,
    averageMonthlyPNL,
    projectedAnnualPNL,
    growthVelocity,
    cumulativePNL,
  };
}

/**
 * Calculate firm comparison statistics
 */
function calculateFirmComparisonStats(
  perFirmBreakdown: FirmPNL[],
  transactions: TransactionWithMatch[]
): FirmComparisonStats {
  if (perFirmBreakdown.length === 0) {
    return {
      mostProfitableFirm: null,
      bestROIFirm: null,
      mostActiveFirm: null,
      averagePayoutPerFirm: 0,
      firmSuccessRate: [],
    };
  }
  
  const mostProfitableFirm = perFirmBreakdown.reduce((best, firm) => 
    firm.netPNL > best.netPNL ? firm : best
  );
  
  // Best ROI firm (highest return on fees)
  const bestROIFirm = perFirmBreakdown
    .filter(f => f.fees > 0)
    .map(f => ({
      firmName: f.firmName,
      roi: (f.netPNL / f.fees) * 100,
      netPNL: f.netPNL,
      fees: f.fees,
    }))
    .reduce((best, firm) => firm.roi > best.roi ? firm : best, {
      firmName: perFirmBreakdown[0].firmName,
      roi: -Infinity,
      netPNL: 0,
      fees: 0,
    });
  
  const mostActiveFirm = perFirmBreakdown.reduce((most, firm) => 
    firm.transactionCount > most.transactionCount ? firm : most
  );
  
  const totalDeposits = perFirmBreakdown.reduce((sum, f) => sum + f.deposits, 0);
  const averagePayoutPerFirm = perFirmBreakdown.length > 0 
    ? totalDeposits / perFirmBreakdown.length 
    : 0;
  
  // Calculate success rate per firm (payouts vs purchases)
  const nonPendingTransactions = transactions.filter(t => !t.pending);
  const firmSuccessRate = perFirmBreakdown.map(firm => {
    const firmTransactions = nonPendingTransactions.filter(t => 
      t.match.firmName === firm.firmName
    );
    const payouts = firmTransactions.filter(t => t.match.type === 'deposit');
    const purchases = firmTransactions.filter(t => t.match.type === 'fee');
    const successRate = purchases.length > 0 
      ? (payouts.length / purchases.length) * 100 
      : 0;
    
    return {
      firmName: firm.firmName,
      successRate,
      payouts: payouts.length,
      purchases: purchases.length,
    };
  });
  
  return {
    mostProfitableFirm: {
      firmName: mostProfitableFirm.firmName,
      netPNL: mostProfitableFirm.netPNL,
    },
    bestROIFirm: bestROIFirm.roi > -Infinity ? {
      firmName: bestROIFirm.firmName,
      roi: bestROIFirm.roi,
      netPNL: bestROIFirm.netPNL,
      fees: bestROIFirm.fees,
    } : null,
    mostActiveFirm: {
      firmName: mostActiveFirm.firmName,
      transactionCount: mostActiveFirm.transactionCount,
    },
    averagePayoutPerFirm,
    firmSuccessRate,
  };
}

/**
 * Calculate all trading statistics
 */
export function calculateTradingStats(pnlReport: PNLReport): TradingStats {
  const { transactions, monthlyBreakdown, perFirmBreakdown, summary } = pnlReport;
  
  const dailyPNL = calculateDailyPNL(transactions);
  const activityStats = calculateActivityStats(transactions, monthlyBreakdown);
  const bestWorstStats = calculateBestWorstStats(monthlyBreakdown, dailyPNL, transactions, perFirmBreakdown);
  const dayOfWeekStats = calculateDayOfWeekStats(dailyPNL);
  const roiStats = calculateROIStats(
    summary.totalDeposits,
    summary.totalFees,
    summary.netPNL,
    transactions,
    monthlyBreakdown
  );
  const streakStats = calculateStreakStats(monthlyBreakdown);
  const purchaseFrequencyStats = calculatePurchaseFrequencyStats(transactions);
  const payoutPerformanceStats = calculatePayoutPerformanceStats(transactions);
  const growthTrends = calculateGrowthTrends(monthlyBreakdown);
  const firmComparisonStats = calculateFirmComparisonStats(perFirmBreakdown, transactions);
  
  return {
    dailyPNL,
    activityStats,
    bestWorstStats,
    dayOfWeekStats,
    roiStats,
    streakStats,
    purchaseFrequencyStats,
    payoutPerformanceStats,
    growthTrends,
    firmComparisonStats,
  };
}
