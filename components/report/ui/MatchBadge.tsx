'use client';

import React from 'react';

interface MatchBadgeProps {
  match: {
    type: 'deposit' | 'fee' | 'unmatched';
    firmName: string | null;
    confidence: 'high' | 'medium' | 'low';
  };
}

export function MatchBadge({ match }: MatchBadgeProps) {
  if (match.type === 'unmatched' || !match.firmName) {
    return <span className="text-xs text-terminal-muted">Unmatched</span>;
  }

  const typeStyles = {
    deposit: 'bg-profit-dim text-profit',
    fee: 'bg-loss-dim text-loss',
    unmatched: 'bg-terminal-card-hover text-terminal-text',
  };

  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${typeStyles[match.type]}`}>
        {match.type === 'deposit' ? 'Deposit' : 'Fee'}
      </span>
      <span className="text-xs text-terminal-text truncate" title={match.firmName}>
        {match.firmName}
      </span>
    </div>
  );
}
