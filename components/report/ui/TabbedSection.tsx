'use client';

import React from 'react';

interface TabbedSectionProps {
  children: React.ReactNode;
}

export function TabbedSection({ children }: TabbedSectionProps) {
  return (
    <div className="min-h-[600px] pt-2 pb-4 md:pb-6">
      {children}
    </div>
  );
}
