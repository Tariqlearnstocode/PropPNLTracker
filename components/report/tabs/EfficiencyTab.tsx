'use client';

import React from 'react';
import { ROIModule } from '../modules/ROIModule';
import { GrowthTrendsModule } from '../modules/GrowthTrendsModule';
import { FirmComparisonModule } from '../modules/FirmComparisonModule';

interface EfficiencyTabProps {
  tradingStats: any;
}

export function EfficiencyTab({ tradingStats }: EfficiencyTabProps) {
  return (
    <div className="space-y-6">
      <ROIModule stats={tradingStats.roiStats} />
      
      <GrowthTrendsModule stats={tradingStats.growthTrends} />
      
      <FirmComparisonModule stats={tradingStats.firmComparisonStats} />
    </div>
  );
}
