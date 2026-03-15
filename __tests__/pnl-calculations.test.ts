import { describe, it, expect } from 'vitest';
import {
  calculatePNLReport,
  calculatePerFirmBreakdown,
  formatCurrency,
  formatDate,
  formatMonth,
  type RawFinancialData,
  type TransactionWithMatch,
} from '@/lib/pnl-calculations';

// ---- Helpers to build mock data ----

function makeTellerData(
  overrides: Partial<RawFinancialData> = {},
): RawFinancialData {
  return {
    accounts: overrides.accounts ?? [],
    transactions: overrides.transactions ?? [],
    fetched_at: '2025-06-01T00:00:00Z',
    date_range: { start: '2025-01-01', end: '2025-06-01' },
    provider: 'teller',
    ...overrides,
  };
}

function tellerAccount(id = 'acc_1', balance = '5000.00') {
  return {
    id,
    enrollment_id: 'enrl_1',
    name: 'Checking',
    type: 'depository',
    subtype: 'checking',
    last_four: '1234',
    balances: { available: balance, ledger: balance },
    institution: { name: 'TestBank' },
  };
}

function tellerTxn(
  id: string,
  amount: string,
  description: string,
  date: string,
  status = 'posted',
) {
  return {
    id,
    account_id: 'acc_1',
    amount,
    date,
    description,
    details: { counterparty: { name: description }, category: null },
    status,
    running_balance: null,
  };
}

// ---- Tests ----

describe('calculatePNLReport', () => {
  it('returns zeroed summary for empty data', () => {
    const report = calculatePNLReport(makeTellerData());

    expect(report.summary.totalDeposits).toBe(0);
    expect(report.summary.totalFees).toBe(0);
    expect(report.summary.netPNL).toBe(0);
    expect(report.summary.accountCount).toBe(0);
    expect(report.summary.transactionCount).toBe(0);
    expect(report.summary.matchedCount).toBe(0);
    expect(report.summary.unmatchedCount).toBe(0);
    expect(report.monthlyBreakdown).toHaveLength(0);
    expect(report.perFirmBreakdown).toHaveLength(0);
  });

  it('classifies FTMO deposit (positive amount = income in Teller)', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '500.00', 'FTMO Payout', '2025-03-15'),
      ],
    });

    const report = calculatePNLReport(raw);

    expect(report.summary.totalDeposits).toBe(500);
    expect(report.summary.totalFees).toBe(0);
    expect(report.summary.netPNL).toBe(500);
    expect(report.summary.matchedCount).toBe(1);
  });

  it('classifies FTMO fee (negative amount = outgoing in Teller)', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '-200.00', 'FTMO Challenge Fee', '2025-03-10'),
      ],
    });

    const report = calculatePNLReport(raw);

    expect(report.summary.totalDeposits).toBe(0);
    expect(report.summary.totalFees).toBe(200);
    expect(report.summary.netPNL).toBe(-200);
  });

  it('calculates net PNL across multiple firms', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '1000.00', 'FTMO Payout', '2025-03-10'),
        tellerTxn('t2', '-300.00', 'FTMO Challenge', '2025-03-05'),
        tellerTxn('t3', '800.00', 'Topstep Payout', '2025-04-12'),
        tellerTxn('t4', '-150.00', 'Topstep Fee', '2025-04-01'),
      ],
    });

    const report = calculatePNLReport(raw);

    expect(report.summary.totalDeposits).toBe(1800);
    expect(report.summary.totalFees).toBe(450);
    expect(report.summary.netPNL).toBe(1350);
    expect(report.summary.matchedCount).toBe(4);
    expect(report.perFirmBreakdown).toHaveLength(2);
  });

  it('handles zero-fee transactions', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '0.00', 'FTMO Something', '2025-03-10'),
      ],
    });

    const report = calculatePNLReport(raw);
    // Amount 0 means isIncome is false (0 is not > 0), so it's classified as fee with amount 0
    expect(report.summary.totalFees).toBe(0);
    expect(report.summary.netPNL).toBe(0);
  });

  it('produces negative PNL when fees exceed deposits', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '100.00', 'FTMO Payout', '2025-03-10'),
        tellerTxn('t2', '-500.00', 'FTMO Challenge', '2025-03-05'),
        tellerTxn('t3', '-300.00', 'FTMO Subscription', '2025-03-01'),
      ],
    });

    const report = calculatePNLReport(raw);

    expect(report.summary.totalDeposits).toBe(100);
    expect(report.summary.totalFees).toBe(800);
    expect(report.summary.netPNL).toBe(-700);
  });

  it('excludes pending transactions from calculations', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '500.00', 'FTMO Payout', '2025-03-10', 'posted'),
        tellerTxn('t2', '999.00', 'FTMO Payout', '2025-03-12', 'pending'),
      ],
    });

    const report = calculatePNLReport(raw);

    expect(report.summary.totalDeposits).toBe(500);
    expect(report.summary.transactionCount).toBe(2); // Both counted in total
    expect(report.summary.matchedCount).toBe(1); // Only posted counted in matched
  });

  it('groups transactions by month correctly', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '500.00', 'FTMO Payout', '2025-03-15'),
        tellerTxn('t2', '300.00', 'FTMO Payout', '2025-03-20'),
        tellerTxn('t3', '700.00', 'FTMO Payout', '2025-04-10'),
      ],
    });

    const report = calculatePNLReport(raw);

    expect(report.monthlyBreakdown).toHaveLength(2);

    const march = report.monthlyBreakdown.find((m) => m.month === '2025-03');
    const april = report.monthlyBreakdown.find((m) => m.month === '2025-04');

    expect(march?.deposits).toBe(800);
    expect(april?.deposits).toBe(700);
  });

  it('calculates running total across months', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '500.00', 'FTMO Payout', '2025-01-15'),
        tellerTxn('t2', '-200.00', 'FTMO Fee', '2025-02-10'),
        tellerTxn('t3', '300.00', 'FTMO Payout', '2025-03-05'),
      ],
    });

    const report = calculatePNLReport(raw);

    expect(report.monthlyBreakdown[0].runningTotal).toBe(500); // Jan: 500
    expect(report.monthlyBreakdown[1].runningTotal).toBe(300); // Feb: 500 - 200
    expect(report.monthlyBreakdown[2].runningTotal).toBe(600); // Mar: 300 + 300
  });

  it('applies manual assignments to unmatched transactions', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '1000.00', 'Rise Works Payment', '2025-03-10'),
      ],
    });

    // Without assignment, Rise is treated as a payment processor (unmatched)
    const reportBefore = calculatePNLReport(raw);
    expect(reportBefore.summary.matchedCount).toBe(0);

    // With assignment, it becomes a deposit
    const reportAfter = calculatePNLReport(raw, { t1: 'FTMO' });
    expect(reportAfter.summary.matchedCount).toBe(1);
    expect(reportAfter.summary.totalDeposits).toBe(1000);
    expect(reportAfter.perFirmBreakdown[0].firmName).toBe('FTMO');
  });

  it('aggregates account balances', () => {
    const raw = makeTellerData({
      accounts: [
        tellerAccount('acc_1', '3000.00'),
        tellerAccount('acc_2', '2000.00'),
      ],
      transactions: [],
    });

    const report = calculatePNLReport(raw);

    expect(report.summary.totalBalance).toBe(5000);
    expect(report.summary.totalAvailable).toBe(5000);
    expect(report.summary.accountCount).toBe(2);
  });

  it('sorts transactions by date descending (newest first)', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '100.00', 'FTMO Payout', '2025-01-01'),
        tellerTxn('t2', '200.00', 'FTMO Payout', '2025-06-01'),
        tellerTxn('t3', '300.00', 'FTMO Payout', '2025-03-15'),
      ],
    });

    const report = calculatePNLReport(raw);

    expect(report.transactions[0].id).toBe('t2');
    expect(report.transactions[1].id).toBe('t3');
    expect(report.transactions[2].id).toBe('t1');
  });

  it('calculates monthsOfData from transaction date range', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '100.00', 'FTMO Payout', '2025-01-15'),
        tellerTxn('t2', '100.00', 'FTMO Payout', '2025-04-10'),
      ],
    });

    const report = calculatePNLReport(raw);

    expect(report.summary.monthsOfData).toBe(4); // Jan, Feb, Mar, Apr
  });
});

describe('firm name matching', () => {
  it('matches known prop firm names case-insensitively', () => {
    const firms = ['FTMO', 'topstep', 'Apex', 'Apex Trader Funding'];

    for (const firm of firms) {
      const raw = makeTellerData({
        accounts: [tellerAccount()],
        transactions: [
          tellerTxn('t1', '100.00', `${firm} payout`, '2025-03-10'),
        ],
      });
      const report = calculatePNLReport(raw);
      expect(report.summary.matchedCount).toBe(1);
    }
  });

  it('treats Rise as a payment processor (unmatched, needsAssignment)', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '500.00', 'Rise Payment', '2025-03-10'),
      ],
    });

    const report = calculatePNLReport(raw);
    const txn = report.transactions[0];

    expect(txn.match.type).toBe('unmatched');
    expect(txn.match.needsAssignment).toBe(true);
  });

  it('treats Wise and Skrill as payment processors', () => {
    const processors = ['Wise Transfer', 'Skrill Payment', 'TransferWise'];

    for (const proc of processors) {
      const raw = makeTellerData({
        accounts: [tellerAccount()],
        transactions: [
          tellerTxn('t1', '100.00', proc, '2025-03-10'),
        ],
      });
      const report = calculatePNLReport(raw);
      expect(report.transactions[0].match.type).toBe('unmatched');
      expect(report.transactions[0].match.needsAssignment).toBe(true);
    }
  });

  it('marks unrelated transactions as unmatched without needsAssignment', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '-50.00', 'Amazon Purchase', '2025-03-10'),
      ],
    });

    const report = calculatePNLReport(raw);
    const txn = report.transactions[0];

    expect(txn.match.type).toBe('unmatched');
    expect(txn.match.needsAssignment).toBe(false);
  });

  it('flags pattern-matched transactions with needsAssignment', () => {
    const raw = makeTellerData({
      accounts: [tellerAccount()],
      transactions: [
        tellerTxn('t1', '-50.00', 'Some Funded Account Service', '2025-03-10'),
      ],
    });

    const report = calculatePNLReport(raw);
    const txn = report.transactions[0];

    expect(txn.match.type).toBe('unmatched');
    expect(txn.match.needsAssignment).toBe(true);
  });
});

describe('Plaid provider normalization', () => {
  it('detects Plaid format and normalizes amounts (positive = outgoing)', () => {
    const raw: RawFinancialData = {
      accounts: [
        {
          account_id: 'plaid_acc_1',
          name: 'Checking',
          official_name: 'Primary Checking',
          type: 'depository',
          subtype: 'checking',
          mask: '5678',
          balances: { current: 4000, available: 3500 },
        },
      ],
      transactions: [
        {
          transaction_id: 'pt1',
          account_id: 'plaid_acc_1',
          amount: -1000, // Negative in Plaid = money IN
          date: '2025-03-10',
          merchant_name: 'FTMO',
          name: 'FTMO Payout',
          category: ['Transfer'],
          pending: false,
        },
        {
          transaction_id: 'pt2',
          account_id: 'plaid_acc_1',
          amount: 300, // Positive in Plaid = money OUT
          date: '2025-03-05',
          merchant_name: 'FTMO',
          name: 'FTMO Challenge',
          category: ['Service'],
          pending: false,
        },
      ],
      fetched_at: '2025-06-01T00:00:00Z',
      date_range: { start: '2025-01-01', end: '2025-06-01' },
      provider: 'plaid',
    };

    const report = calculatePNLReport(raw);

    expect(report.summary.totalDeposits).toBe(1000);
    expect(report.summary.totalFees).toBe(300);
    expect(report.summary.netPNL).toBe(700);
    expect(report.accounts[0].mask).toBe('5678');
  });
});

describe('calculatePerFirmBreakdown', () => {
  it('groups by firm and sorts by net PNL descending', () => {
    const transactions: TransactionWithMatch[] = [
      {
        id: 't1',
        accountId: 'acc_1',
        amount: 1000,
        date: '2025-03-10',
        name: 'FTMO Payout',
        category: null,
        pending: false,
        isIncome: true,
        runningBalance: null,
        match: { type: 'deposit', firmName: 'FTMO', confidence: 'high' },
      },
      {
        id: 't2',
        accountId: 'acc_1',
        amount: 300,
        date: '2025-03-05',
        name: 'FTMO Fee',
        category: null,
        pending: false,
        isIncome: false,
        runningBalance: null,
        match: { type: 'fee', firmName: 'FTMO', confidence: 'high' },
      },
      {
        id: 't3',
        accountId: 'acc_1',
        amount: 200,
        date: '2025-03-12',
        name: 'Topstep Payout',
        category: null,
        pending: false,
        isIncome: true,
        runningBalance: null,
        match: { type: 'deposit', firmName: 'Topstep', confidence: 'high' },
      },
      {
        id: 't4',
        accountId: 'acc_1',
        amount: 500,
        date: '2025-03-01',
        name: 'Topstep Challenge',
        category: null,
        pending: false,
        isIncome: false,
        runningBalance: null,
        match: { type: 'fee', firmName: 'Topstep', confidence: 'high' },
      },
    ];

    const breakdown = calculatePerFirmBreakdown(transactions);

    expect(breakdown).toHaveLength(2);
    // FTMO: 1000 - 300 = 700 (higher)
    expect(breakdown[0].firmName).toBe('FTMO');
    expect(breakdown[0].netPNL).toBe(700);
    expect(breakdown[0].deposits).toBe(1000);
    expect(breakdown[0].fees).toBe(300);
    // Topstep: 200 - 500 = -300 (lower)
    expect(breakdown[1].firmName).toBe('Topstep');
    expect(breakdown[1].netPNL).toBe(-300);
  });

  it('skips unmatched transactions', () => {
    const transactions: TransactionWithMatch[] = [
      {
        id: 't1',
        accountId: 'acc_1',
        amount: 100,
        date: '2025-03-10',
        name: 'Random',
        category: null,
        pending: false,
        isIncome: true,
        runningBalance: null,
        match: { type: 'unmatched', firmName: null, confidence: 'low' },
      },
    ];

    const breakdown = calculatePerFirmBreakdown(transactions);
    expect(breakdown).toHaveLength(0);
  });

  it('determines confidence from highest transaction confidence', () => {
    const transactions: TransactionWithMatch[] = [
      {
        id: 't1',
        accountId: 'acc_1',
        amount: 100,
        date: '2025-03-10',
        name: 'FTMO',
        category: null,
        pending: false,
        isIncome: true,
        runningBalance: null,
        match: { type: 'deposit', firmName: 'FTMO', confidence: 'medium' },
      },
      {
        id: 't2',
        accountId: 'acc_1',
        amount: 50,
        date: '2025-03-05',
        name: 'FTMO',
        category: null,
        pending: false,
        isIncome: false,
        runningBalance: null,
        match: { type: 'fee', firmName: 'FTMO', confidence: 'high' },
      },
    ];

    const breakdown = calculatePerFirmBreakdown(transactions);
    expect(breakdown[0].confidence).toBe('high');
  });
});

describe('formatCurrency', () => {
  it('formats positive amounts', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats negative amounts', () => {
    expect(formatCurrency(-500)).toBe('-$500.00');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('formatMonth', () => {
  it('converts YYYY-MM to readable month/year', () => {
    const result = formatMonth('2025-03');
    expect(result).toBe('March 2025');
  });

  it('handles January correctly', () => {
    const result = formatMonth('2025-01');
    expect(result).toBe('January 2025');
  });

  it('handles December correctly', () => {
    const result = formatMonth('2025-12');
    expect(result).toBe('December 2025');
  });
});
