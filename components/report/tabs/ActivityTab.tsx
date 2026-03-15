'use client';

import React from 'react';
import { ActivityStatsModule } from '../modules/ActivityStatsModule';
import { PurchaseFrequencyModule } from '../modules/PurchaseFrequencyModule';
import { PayoutPerformanceModule } from '../modules/PayoutPerformanceModule';
import type { TradingStats } from '@/lib/pnl-calculations';

interface ActivityTabProps {
  tradingStats: TradingStats;
}

export function ActivityTab({ tradingStats }: ActivityTabProps) {
  return (
    <div className="space-y-6">
      <ActivityStatsModule stats={tradingStats.activityStats} />
      
      <PurchaseFrequencyModule stats={tradingStats.purchaseFrequencyStats} />
      
      <PayoutPerformanceModule stats={tradingStats.payoutPerformanceStats} />
    </div>
  );
}
