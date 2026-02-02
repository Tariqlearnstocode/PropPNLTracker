'use client';

import React from 'react';

interface ConfidenceBadgeProps {
  confidence: 'high' | 'medium' | 'low';
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const styles = {
    high: 'bg-profit-dim text-profit border-profit/30',
    medium: 'bg-accent-amber/20 text-accent-amber border-accent-amber/30',
    low: 'bg-loss-dim text-loss border-loss/30',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${styles[confidence]}`}>
      {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
    </span>
  );
}
