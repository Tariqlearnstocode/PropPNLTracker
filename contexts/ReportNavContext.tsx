'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ReportNavValue = {
  displayName: string | null;
  onGetStarted: () => void;
} | null;

const ReportNavContext = createContext<{
  reportNav: ReportNavValue;
  setReportNav: (v: ReportNavValue) => void;
}>({
  reportNav: null,
  setReportNav: () => {},
});

export function ReportNavProvider({ children }: { children: ReactNode }) {
  const [reportNav, setReportNav] = useState<ReportNavValue>(null);
  return (
    <ReportNavContext.Provider value={{ reportNav, setReportNav }}>
      {children}
    </ReportNavContext.Provider>
  );
}

export function useReportNav() {
  return useContext(ReportNavContext);
}
