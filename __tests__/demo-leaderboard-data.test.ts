import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getLeaderboardData,
  DEMO_TRADERS,
  type LeaderboardEntry,
} from '@/lib/demo-leaderboard-data';

afterEach(() => {
  vi.useRealTimers();
});

function setFakeDate(dateStr: string) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(dateStr));
}

describe('getLeaderboardData', () => {
  describe('allTime', () => {
    it('returns entries for all traders with activity', () => {
      const data = getLeaderboardData('allTime');
      expect(data.length).toBeGreaterThan(0);
      expect(data.length).toBeLessThanOrEqual(DEMO_TRADERS.length);
    });

    it('each entry has required fields', () => {
      const data = getLeaderboardData('allTime');
      for (const entry of data) {
        expect(entry).toHaveProperty('id');
        expect(entry).toHaveProperty('displayName');
        expect(typeof entry.netPNL).toBe('number');
        expect(typeof entry.totalDeposits).toBe('number');
        expect(typeof entry.totalFees).toBe('number');
        expect(typeof entry.roi).toBe('number');
        expect(Array.isArray(entry.firmNames)).toBe(true);
        expect(Array.isArray(entry.firmBreakdown)).toBe(true);
      }
    });

    it('calculates netPNL as totalDeposits - totalFees', () => {
      const data = getLeaderboardData('allTime');
      for (const entry of data) {
        expect(entry.netPNL).toBe(entry.totalDeposits - entry.totalFees);
      }
    });

    it('calculates ROI as (netPNL / totalFees) * 100', () => {
      const data = getLeaderboardData('allTime');
      for (const entry of data) {
        if (entry.totalFees > 0) {
          const expectedRoi = (entry.netPNL / entry.totalFees) * 100;
          expect(entry.roi).toBeCloseTo(expectedRoi);
        } else {
          expect(entry.roi).toBe(0);
        }
      }
    });

    it('firmNames matches firmBreakdown firm names', () => {
      const data = getLeaderboardData('allTime');
      for (const entry of data) {
        const breakdownNames = entry.firmBreakdown.map((f) => f.firmName);
        expect(entry.firmNames).toEqual(breakdownNames);
      }
    });

    it('firm breakdown entries have correct netPNL', () => {
      const data = getLeaderboardData('allTime');
      for (const entry of data) {
        for (const firm of entry.firmBreakdown) {
          expect(firm.netPNL).toBe(firm.deposits - firm.fees);
        }
      }
    });

    it('firm breakdown is sorted by netPNL descending', () => {
      const data = getLeaderboardData('allTime');
      for (const entry of data) {
        for (let i = 1; i < entry.firmBreakdown.length; i++) {
          expect(entry.firmBreakdown[i - 1].netPNL).toBeGreaterThanOrEqual(
            entry.firmBreakdown[i].netPNL,
          );
        }
      }
    });
  });

  describe('monthly', () => {
    it('filters to current month only', () => {
      setFakeDate('2026-03-15T12:00:00Z');
      const data = getLeaderboardData('monthly');

      // Verify by manually checking trader data for 2026-03
      const tradersWithMarch = DEMO_TRADERS.filter((t) =>
        t.months.some((m) => m.month === '2026-03'),
      );

      // All returned entries should have data (deposits > 0 or fees > 0)
      for (const entry of data) {
        expect(entry.totalDeposits > 0 || entry.totalFees > 0).toBe(true);
      }

      // Should not include traders with no 2026-03 data
      expect(data.length).toBeLessThanOrEqual(tradersWithMarch.length);
    });

    it('returns empty or filtered set for a month with no data', () => {
      setFakeDate('2024-01-15T12:00:00Z');
      const data = getLeaderboardData('monthly');
      expect(data).toHaveLength(0);
    });
  });

  describe('ytd', () => {
    it('includes only months from start of current year to current month', () => {
      setFakeDate('2026-02-15T12:00:00Z');
      const data = getLeaderboardData('ytd');

      // YTD in Feb 2026 should include Jan 2026 and Feb 2026
      // Verify TraderMike (demo-1) for YTD: Jan + Feb 2026
      const mike = data.find((e) => e.id === 'demo-1');
      expect(mike).toBeDefined();

      // TraderMike Jan: FTMO 4100/550 + Topstep 2400/300
      // TraderMike Feb: FTMO 3600/400 + Topstep 1900/450
      const expectedDeposits = 4100 + 2400 + 3600 + 1900;
      const expectedFees = 550 + 300 + 400 + 450;
      expect(mike!.totalDeposits).toBe(expectedDeposits);
      expect(mike!.totalFees).toBe(expectedFees);
      expect(mike!.netPNL).toBe(expectedDeposits - expectedFees);
    });

    it('does not include previous year data', () => {
      setFakeDate('2026-01-15T12:00:00Z');
      const data = getLeaderboardData('ytd');

      // RookieRyan (demo-15) only has data in 2026-02 and 2026-03
      // In Jan 2026 YTD, RookieRyan should have no data
      const rookie = data.find((e) => e.id === 'demo-15');
      expect(rookie).toBeUndefined();
    });
  });

  describe('specific trader verification', () => {
    it('TraderMike allTime has both FTMO and Topstep', () => {
      const data = getLeaderboardData('allTime');
      const mike = data.find((e) => e.id === 'demo-1');
      expect(mike).toBeDefined();
      expect(mike!.firmNames).toContain('FTMO');
      expect(mike!.firmNames).toContain('Topstep');
      expect(mike!.firmBreakdown).toHaveLength(2);
    });

    it('ResetKing has negative netPNL allTime (more fees than deposits)', () => {
      const data = getLeaderboardData('allTime');
      const resetKing = data.find((e) => e.id === 'demo-16');
      expect(resetKing).toBeDefined();
      expect(resetKing!.netPNL).toBeLessThan(0);
    });

    it('NightOwlTrader has single firm (Topstep)', () => {
      const data = getLeaderboardData('allTime');
      const owl = data.find((e) => e.id === 'demo-5');
      expect(owl).toBeDefined();
      expect(owl!.firmNames).toEqual(['Topstep']);
    });
  });
});
