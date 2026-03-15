/**
 * Demo leaderboard data for showcase purposes.
 * Each trader has monthly breakdowns by firm so we can filter by time period.
 */

export interface DemoTraderMonth {
  month: string; // YYYY-MM
  firms: Array<{
    firmName: string;
    deposits: number;
    fees: number;
  }>;
}

export interface DemoTrader {
  id: string;
  displayName: string;
  months: DemoTraderMonth[];
}

export const DEMO_TRADERS: DemoTrader[] = [
  {
    id: 'demo-1',
    displayName: 'TraderMike',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'FTMO', deposits: 2800, fees: 600 },
        { firmName: 'Topstep', deposits: 1500, fees: 400 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'FTMO', deposits: 3200, fees: 450 },
        { firmName: 'Topstep', deposits: 2100, fees: 350 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'FTMO', deposits: 1800, fees: 900 },
        { firmName: 'Topstep', deposits: 800, fees: 500 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'FTMO', deposits: 4100, fees: 550 },
        { firmName: 'Topstep', deposits: 2400, fees: 300 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'FTMO', deposits: 3600, fees: 400 },
        { firmName: 'Topstep', deposits: 1900, fees: 450 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'FTMO', deposits: 2900, fees: 350 },
        { firmName: 'Topstep', deposits: 1600, fees: 250 },
      ]},
    ],
  },
  {
    id: 'demo-2',
    displayName: 'SarahTrades',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'Apex', deposits: 3500, fees: 800 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'Apex', deposits: 4200, fees: 650 },
        { firmName: 'FTMO', deposits: 1200, fees: 300 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'Apex', deposits: 2800, fees: 500 },
        { firmName: 'FTMO', deposits: 900, fees: 250 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'Apex', deposits: 5100, fees: 700 },
        { firmName: 'FTMO', deposits: 1800, fees: 350 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'Apex', deposits: 3900, fees: 600 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'Apex', deposits: 2600, fees: 400 },
        { firmName: 'FTMO', deposits: 1100, fees: 200 },
      ]},
    ],
  },
  {
    id: 'demo-3',
    displayName: 'PropKingJD',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'Topstep', deposits: 4200, fees: 1800 },
        { firmName: 'Apex Trader Funding', deposits: 2800, fees: 1200 },
        { firmName: 'MyFundedFX', deposits: 1500, fees: 900 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'Topstep', deposits: 3800, fees: 1500 },
        { firmName: 'Apex Trader Funding', deposits: 3100, fees: 1100 },
        { firmName: 'MyFundedFX', deposits: 2000, fees: 850 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'Topstep', deposits: 2200, fees: 2100 },
        { firmName: 'Apex Trader Funding', deposits: 1800, fees: 1400 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'Topstep', deposits: 5000, fees: 1600 },
        { firmName: 'Apex Trader Funding', deposits: 3500, fees: 1000 },
        { firmName: 'MyFundedFX', deposits: 2200, fees: 700 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'Topstep', deposits: 4100, fees: 1300 },
        { firmName: 'Apex Trader Funding', deposits: 2700, fees: 900 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'Topstep', deposits: 3200, fees: 1100 },
        { firmName: 'Apex Trader Funding', deposits: 2400, fees: 800 },
      ]},
    ],
  },
  {
    id: 'demo-4',
    displayName: 'AlexFX_',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'Rise', deposits: 1800, fees: 400 },
        { firmName: 'FTMO', deposits: 2200, fees: 500 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'Rise', deposits: 2100, fees: 350 },
        { firmName: 'FTMO', deposits: 2500, fees: 450 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'Rise', deposits: 1500, fees: 600 },
        { firmName: 'FTMO', deposits: 1800, fees: 700 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'Rise', deposits: 2800, fees: 300 },
        { firmName: 'FTMO', deposits: 3100, fees: 400 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'Rise', deposits: 2400, fees: 350 },
        { firmName: 'FTMO', deposits: 2700, fees: 500 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'Rise', deposits: 1900, fees: 300 },
        { firmName: 'FTMO', deposits: 2300, fees: 400 },
      ]},
    ],
  },
  {
    id: 'demo-5',
    displayName: 'NightOwlTrader',
    months: [
      { month: '2025-11', firms: [
        { firmName: 'Topstep', deposits: 3800, fees: 600 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'Topstep', deposits: 4200, fees: 500 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'Topstep', deposits: 5500, fees: 550 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'Topstep', deposits: 4800, fees: 400 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'Topstep', deposits: 3900, fees: 450 },
      ]},
    ],
  },
  {
    id: 'demo-6',
    displayName: 'ChartMasterLee',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'FTMO', deposits: 1200, fees: 800 },
        { firmName: 'Apex', deposits: 900, fees: 500 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'FTMO', deposits: 1800, fees: 700 },
        { firmName: 'Apex', deposits: 1400, fees: 450 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'FTMO', deposits: 1500, fees: 650 },
        { firmName: 'Apex', deposits: 1100, fees: 400 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'FTMO', deposits: 2200, fees: 600 },
        { firmName: 'Apex', deposits: 1600, fees: 350 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'FTMO', deposits: 1900, fees: 550 },
        { firmName: 'Apex', deposits: 1300, fees: 300 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'FTMO', deposits: 1600, fees: 500 },
        { firmName: 'Apex', deposits: 1000, fees: 350 },
      ]},
    ],
  },
  {
    id: 'demo-7',
    displayName: 'TheScalper',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'Topstep', deposits: 900, fees: 150 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'Topstep', deposits: 1100, fees: 180 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'Topstep', deposits: 800, fees: 200 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'Topstep', deposits: 1400, fees: 160 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'Topstep', deposits: 1200, fees: 140 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'Topstep', deposits: 1050, fees: 130 },
      ]},
    ],
  },
  {
    id: 'demo-8',
    displayName: 'FundedTrader99',
    months: [
      { month: '2026-01', firms: [
        { firmName: 'FTMO', deposits: 800, fees: 450 },
        { firmName: 'Rise', deposits: 600, fees: 300 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'FTMO', deposits: 1400, fees: 400 },
        { firmName: 'Rise', deposits: 1100, fees: 250 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'FTMO', deposits: 1800, fees: 350 },
        { firmName: 'Rise', deposits: 1300, fees: 200 },
      ]},
    ],
  },
  {
    id: 'demo-9',
    displayName: 'SwingKingdom',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'Apex', deposits: 5200, fees: 2800 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'Apex', deposits: 6100, fees: 1500 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'Apex', deposits: 1200, fees: 3200 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'Apex', deposits: 7500, fees: 1800 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'Apex', deposits: 4800, fees: 2200 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'Apex', deposits: 3100, fees: 1600 },
      ]},
    ],
  },
  {
    id: 'demo-10',
    displayName: 'DayTradeDoug',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'Apex Trader Funding', deposits: 1200, fees: 500 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'Apex Trader Funding', deposits: 1400, fees: 550 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'Apex Trader Funding', deposits: 1100, fees: 600 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'Apex Trader Funding', deposits: 1600, fees: 500 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'Apex Trader Funding', deposits: 1500, fees: 480 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'Apex Trader Funding', deposits: 1300, fees: 450 },
      ]},
    ],
  },
  {
    id: 'demo-11',
    displayName: 'PropHustler',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'FTMO', deposits: 1800, fees: 1200 },
        { firmName: 'Topstep', deposits: 2200, fees: 1500 },
        { firmName: 'Rise', deposits: 1000, fees: 800 },
        { firmName: 'MyFundedFX', deposits: 800, fees: 600 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'FTMO', deposits: 2400, fees: 1100 },
        { firmName: 'Topstep', deposits: 2800, fees: 1300 },
        { firmName: 'Rise', deposits: 1400, fees: 700 },
        { firmName: 'MyFundedFX', deposits: 1200, fees: 550 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'FTMO', deposits: 1500, fees: 1400 },
        { firmName: 'Topstep', deposits: 1800, fees: 1600 },
        { firmName: 'Rise', deposits: 600, fees: 900 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'FTMO', deposits: 3200, fees: 1000 },
        { firmName: 'Topstep', deposits: 3500, fees: 1200 },
        { firmName: 'Rise', deposits: 1800, fees: 600 },
        { firmName: 'MyFundedFX', deposits: 1500, fees: 500 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'FTMO', deposits: 2800, fees: 900 },
        { firmName: 'Topstep', deposits: 3000, fees: 1100 },
        { firmName: 'Rise', deposits: 1600, fees: 550 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'FTMO', deposits: 2200, fees: 800 },
        { firmName: 'Topstep', deposits: 2600, fees: 1000 },
        { firmName: 'Rise', deposits: 1200, fees: 500 },
      ]},
    ],
  },
  {
    id: 'demo-12',
    displayName: 'QuietCapital',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'Rise', deposits: 1500, fees: 300 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'Rise', deposits: 1700, fees: 280 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'Rise', deposits: 1400, fees: 320 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'Rise', deposits: 2000, fees: 250 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'Rise', deposits: 1800, fees: 270 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'Rise', deposits: 1600, fees: 240 },
      ]},
    ],
  },
  {
    id: 'demo-13',
    displayName: 'MomentumJess',
    months: [
      { month: '2025-12', firms: [
        { firmName: 'FTMO', deposits: 600, fees: 500 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'FTMO', deposits: 1800, fees: 400 },
        { firmName: 'Topstep', deposits: 1200, fees: 300 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'FTMO', deposits: 2800, fees: 350 },
        { firmName: 'Topstep', deposits: 2000, fees: 280 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'FTMO', deposits: 3500, fees: 300 },
        { firmName: 'Topstep', deposits: 2600, fees: 250 },
      ]},
    ],
  },
  {
    id: 'demo-14',
    displayName: 'VeteranVince',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'Topstep', deposits: 3200, fees: 800 },
        { firmName: 'Apex', deposits: 2400, fees: 600 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'Topstep', deposits: 3800, fees: 750 },
        { firmName: 'Apex', deposits: 2800, fees: 550 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'Topstep', deposits: 2900, fees: 850 },
        { firmName: 'Apex', deposits: 2100, fees: 650 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'Topstep', deposits: 4200, fees: 700 },
        { firmName: 'Apex', deposits: 3100, fees: 500 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'Topstep', deposits: 3600, fees: 650 },
        { firmName: 'Apex', deposits: 2700, fees: 450 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'Topstep', deposits: 3000, fees: 600 },
        { firmName: 'Apex', deposits: 2300, fees: 400 },
      ]},
    ],
  },
  {
    id: 'demo-15',
    displayName: 'RookieRyan',
    months: [
      { month: '2026-02', firms: [
        { firmName: 'FTMO', deposits: 400, fees: 350 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'FTMO', deposits: 900, fees: 300 },
        { firmName: 'Topstep', deposits: 500, fees: 200 },
      ]},
    ],
  },
  {
    id: 'demo-16',
    displayName: 'ResetKing',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'FTMO', deposits: 0, fees: 450 },
        { firmName: 'MyFundedFX', deposits: 0, fees: 300 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'FTMO', deposits: 500, fees: 900 },
        { firmName: 'MyFundedFX', deposits: 0, fees: 350 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'FTMO', deposits: 0, fees: 600 },
        { firmName: 'MyFundedFX', deposits: 200, fees: 400 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'FTMO', deposits: 800, fees: 550 },
        { firmName: 'MyFundedFX', deposits: 0, fees: 300 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'FTMO', deposits: 0, fees: 450 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'FTMO', deposits: 0, fees: 450 },
        { firmName: 'MyFundedFX', deposits: 0, fees: 300 },
      ]},
    ],
  },
  {
    id: 'demo-17',
    displayName: 'ChallengeChaser',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'Topstep', deposits: 0, fees: 650 },
        { firmName: 'Apex Trader Funding', deposits: 0, fees: 400 },
        { firmName: 'Apex', deposits: 0, fees: 500 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'Topstep', deposits: 400, fees: 800 },
        { firmName: 'Apex Trader Funding', deposits: 0, fees: 400 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'Topstep', deposits: 0, fees: 700 },
        { firmName: 'Apex', deposits: 0, fees: 500 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'Topstep', deposits: 600, fees: 850 },
        { firmName: 'Apex Trader Funding', deposits: 0, fees: 400 },
        { firmName: 'Apex', deposits: 0, fees: 500 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'Topstep', deposits: 0, fees: 650 },
        { firmName: 'Apex Trader Funding', deposits: 300, fees: 400 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'Topstep', deposits: 0, fees: 650 },
      ]},
    ],
  },
  {
    id: 'demo-18',
    displayName: 'BagHolder_',
    months: [
      { month: '2025-11', firms: [
        { firmName: 'FTMO', deposits: 0, fees: 250 },
        { firmName: 'Rise', deposits: 0, fees: 200 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'FTMO', deposits: 0, fees: 250 },
        { firmName: 'Rise', deposits: 300, fees: 400 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'FTMO', deposits: 0, fees: 250 },
        { firmName: 'Rise', deposits: 0, fees: 200 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'FTMO', deposits: 0, fees: 250 },
        { firmName: 'Rise', deposits: 0, fees: 200 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'FTMO', deposits: 0, fees: 250 },
      ]},
    ],
  },
  {
    id: 'demo-19',
    displayName: 'TrialAndError',
    months: [
      { month: '2025-10', firms: [
        { firmName: 'Topstep', deposits: 200, fees: 500 },
        { firmName: 'FTMO', deposits: 0, fees: 300 },
      ]},
      { month: '2025-11', firms: [
        { firmName: 'Topstep', deposits: 0, fees: 500 },
        { firmName: 'FTMO', deposits: 0, fees: 300 },
        { firmName: 'MyFundedFX', deposits: 0, fees: 200 },
      ]},
      { month: '2025-12', firms: [
        { firmName: 'Topstep', deposits: 500, fees: 500 },
        { firmName: 'FTMO', deposits: 0, fees: 300 },
      ]},
      { month: '2026-01', firms: [
        { firmName: 'Topstep', deposits: 0, fees: 500 },
        { firmName: 'MyFundedFX', deposits: 0, fees: 200 },
      ]},
      { month: '2026-02', firms: [
        { firmName: 'Topstep', deposits: 300, fees: 500 },
        { firmName: 'FTMO', deposits: 0, fees: 300 },
      ]},
      { month: '2026-03', firms: [
        { firmName: 'Topstep', deposits: 0, fees: 500 },
      ]},
    ],
  },
];

/** Aggregated trader data for leaderboard display */
export interface LeaderboardEntry {
  id: string;
  displayName: string;
  netPNL: number;
  totalDeposits: number;
  totalFees: number;
  roi: number; // percentage
  firmNames: string[];
  firmBreakdown: Array<{
    firmName: string;
    deposits: number;
    fees: number;
    netPNL: number;
  }>;
}

/** Aggregate a trader's data for a given set of months */
function aggregateTrader(trader: DemoTrader, monthFilter?: (month: string) => boolean): LeaderboardEntry {
  const relevantMonths = monthFilter
    ? trader.months.filter(m => monthFilter(m.month))
    : trader.months;

  const firmMap = new Map<string, { deposits: number; fees: number }>();

  for (const month of relevantMonths) {
    for (const firm of month.firms) {
      const existing = firmMap.get(firm.firmName) || { deposits: 0, fees: 0 };
      existing.deposits += firm.deposits;
      existing.fees += firm.fees;
      firmMap.set(firm.firmName, existing);
    }
  }

  const firmBreakdown = Array.from(firmMap.entries())
    .map(([firmName, data]) => ({
      firmName,
      deposits: data.deposits,
      fees: data.fees,
      netPNL: data.deposits - data.fees,
    }))
    .sort((a, b) => b.netPNL - a.netPNL);

  const totalDeposits = firmBreakdown.reduce((sum, f) => sum + f.deposits, 0);
  const totalFees = firmBreakdown.reduce((sum, f) => sum + f.fees, 0);
  const netPNL = totalDeposits - totalFees;
  const roi = totalFees > 0 ? (netPNL / totalFees) * 100 : 0;

  return {
    id: trader.id,
    displayName: trader.displayName,
    netPNL,
    totalDeposits,
    totalFees,
    roi,
    firmNames: firmBreakdown.map(f => f.firmName),
    firmBreakdown,
  };
}

export function getLeaderboardData(period: 'allTime' | 'monthly' | 'ytd'): LeaderboardEntry[] {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentYear = now.getFullYear();

  let monthFilter: ((month: string) => boolean) | undefined;

  if (period === 'monthly') {
    monthFilter = (month) => month === currentMonth;
  } else if (period === 'ytd') {
    monthFilter = (month) => month >= `${currentYear}-01` && month <= currentMonth;
  }

  return DEMO_TRADERS
    .map(trader => aggregateTrader(trader, monthFilter))
    .filter(entry => entry.totalDeposits > 0 || entry.totalFees > 0);
}
