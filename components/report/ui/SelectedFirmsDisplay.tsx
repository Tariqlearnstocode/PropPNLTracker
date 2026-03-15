'use client';

interface SelectedFirmsDisplayProps {
  selectedFirms: string[];
  onToggleFirm: (firmName: string) => void;
  onClearFirms: () => void;
}

export function SelectedFirmsDisplay({ selectedFirms, onToggleFirm, onClearFirms }: SelectedFirmsDisplayProps) {
  if (selectedFirms.length === 0) return null;

  return (
    <div className="mb-4 bg-profit-dim border border-profit/20 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium text-terminal-muted uppercase tracking-wider">
            Filtering {selectedFirms.length} firm{selectedFirms.length > 1 ? 's' : ''}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedFirms.map(firmName => (
              <button
                key={firmName}
                onClick={() => onToggleFirm(firmName)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-profit/20 text-profit border border-profit/30 rounded text-xs font-mono font-medium hover:bg-profit/30 transition-colors"
              >
                {firmName}
                <span className="ml-0.5 opacity-60">×</span>
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onClearFirms}
          className="px-3 py-1.5 text-xs text-terminal-muted hover:text-terminal-text font-medium transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
