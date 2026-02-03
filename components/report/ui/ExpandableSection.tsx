'use client';

import React, { useState } from 'react';

interface ExpandableSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function ExpandableSection({ title, defaultOpen = false, children }: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        {isOpen ? (
          <span className="text-gray-500 text-lg">▲</span>
        ) : (
          <span className="text-gray-500 text-lg">▼</span>
        )}
      </button>
      {isOpen && (
        <div className="border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}
