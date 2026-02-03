'use client';

import React, { useState, useRef, useEffect } from 'react';

interface FirmFilterProps {
  allFirmNames: string[];
  selectedFirms: string[];
  onToggleFirm: (firmName: string) => void;
  onClearFirms: () => void;
}

export function FirmFilter({
  allFirmNames,
  selectedFirms,
  onToggleFirm,
  onClearFirms,
}: FirmFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getDisplayText = () => {
    if (selectedFirms.length === 0) return 'All Firms';
    if (selectedFirms.length === 1) return selectedFirms[0];
    return `${selectedFirms.length} firms`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
          selectedFirms.length > 0
            ? 'bg-profit-dim border-profit/30 text-profit'
            : 'bg-terminal-card border-terminal-border text-terminal-text hover:bg-terminal-card-hover'
        }`}
      >
        <span className={selectedFirms.length > 0 ? 'text-profit' : 'text-terminal-muted'}>🔍</span>
        <span className="font-mono text-xs">{getDisplayText()}</span>
        <span className={`transition-transform inline-block ${selectedFirms.length > 0 ? 'text-profit/60' : 'text-terminal-muted'} ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-terminal-card border border-terminal-border rounded-lg shadow-xl z-50 min-w-[220px] max-h-[300px] overflow-y-auto dark-scroll">
          <div className="p-2">
            {selectedFirms.length > 0 && (
              <div className="mb-2 pb-2 border-b border-terminal-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-medium text-terminal-muted uppercase tracking-widest">Selected</span>
                  <button
                    onClick={() => {
                      onClearFirms();
                      setIsOpen(false);
                    }}
                    className="text-[11px] font-mono text-terminal-muted hover:text-terminal-text transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedFirms.map(firmName => (
                    <span
                      key={firmName}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-profit-dim text-profit border border-profit/20 rounded text-[11px] font-mono"
                    >
                      {firmName}
                      <button
                        onClick={() => onToggleFirm(firmName)}
                        className="hover:text-white transition-colors"
                      >
                        <span>✕</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-0.5">
              {allFirmNames.map(firmName => {
                const isSelected = selectedFirms.includes(firmName);
                return (
                  <button
                    key={firmName}
                    onClick={() => onToggleFirm(firmName)}
                    className={`w-full text-left px-3 py-2 text-sm font-mono rounded-md transition-colors ${
                      isSelected
                        ? 'bg-profit-dim text-profit'
                        : 'text-terminal-text hover:bg-terminal-card-hover'
                    }`}
                  >
                    {firmName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
