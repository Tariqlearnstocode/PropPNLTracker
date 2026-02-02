'use client';

import React from 'react';

interface StreakModuleProps {
  stats: {
    currentWinStreak: number;
    longestWinStreak: number;
    currentLossStreak: number;
    winRate: number;
    totalProfitableMonths: number;
    totalUnprofitableMonths: number;
  };
}

export function StreakModule({ stats }: StreakModuleProps) {
  return (
    <div className="rounded-xl border border-terminal-border bg-terminal-card p-5">
      <h3 className="text-xs font-mono uppercase tracking-widest text-terminal-muted mb-4">
        Win/Loss Streaks
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-profit-dim border border-profit/20 p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Current Win Streak</div>
          <div className="text-3xl font-bold font-number text-profit">{stats.currentWinStreak}</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mt-1">Consecutive profitable months</div>
        </div>
        <div className="rounded-lg bg-profit-dim border border-profit/20 p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Longest Win Streak</div>
          <div className="text-2xl font-bold font-number text-profit">{stats.longestWinStreak}</div>
        </div>
        <div className="rounded-lg bg-loss-dim border border-loss/20 p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Current Loss Streak</div>
          <div className="text-3xl font-bold font-number text-loss">{stats.currentLossStreak}</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mt-1">Consecutive losing months</div>
        </div>
        <div className="rounded-lg bg-terminal-bg border border-terminal-border p-3.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mb-1">Win Rate</div>
          <div className="text-2xl font-bold font-number text-terminal-text">{stats.winRate.toFixed(1)}%</div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-terminal-muted mt-1">
            {stats.totalProfitableMonths}W / {stats.totalUnprofitableMonths}L
          </div>
        </div>
      </div>
    </div>
  );
}
