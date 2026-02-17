'use client';

import { useState, useMemo } from 'react';
import { PNLReport } from '@/lib/pnl-calculations';
import { safeNumber } from '@/lib/report-utils';

export function useFirmFilter(
  perFirmBreakdown: PNLReport['perFirmBreakdown'],
  filteredMonthlyBreakdown: PNLReport['monthlyBreakdown'],
  manualAssignments: Record<string, string>
) {
  const [selectedFirms, setSelectedFirms] = useState<string[]>([]);
  
  const allFirmNames = useMemo(() => {
    const firms = perFirmBreakdown.map(f => f.firmName);
    // Add custom firms from manual assignments
    const customFirms = Object.values(manualAssignments).filter(f => f !== '__dismissed__' && !firms.includes(f));
    return [...firms, ...customFirms];
  }, [perFirmBreakdown, manualAssignments]);
  
  // Filter firms breakdown by selected firms
  const filteredFirmBreakdown = useMemo(() => {
    if (selectedFirms.length === 0) return perFirmBreakdown;
    return perFirmBreakdown.filter(firm => selectedFirms.includes(firm.firmName));
  }, [perFirmBreakdown, selectedFirms]);
  
  // Calculate filtered totals from firm breakdown (already date-filtered upstream)
  const filteredDeposits = useMemo(() => {
    const firms = selectedFirms.length > 0 ? filteredFirmBreakdown : perFirmBreakdown;
    return firms.reduce((sum, firm) => sum + safeNumber(firm.deposits), 0);
  }, [perFirmBreakdown, filteredFirmBreakdown, selectedFirms]);

  const filteredFees = useMemo(() => {
    const firms = selectedFirms.length > 0 ? filteredFirmBreakdown : perFirmBreakdown;
    return firms.reduce((sum, firm) => sum + safeNumber(firm.fees), 0);
  }, [perFirmBreakdown, filteredFirmBreakdown, selectedFirms]);
  
  const filteredPNL = safeNumber(filteredDeposits - filteredFees);
  
  const toggleFirm = (firmName: string) => {
    setSelectedFirms(prev => 
      prev.includes(firmName)
        ? prev.filter(f => f !== firmName)
        : [...prev, firmName]
    );
  };
  
  return {
    selectedFirms,
    setSelectedFirms,
    toggleFirm,
    allFirmNames,
    filteredFirmBreakdown,
    filteredDeposits,
    filteredFees,
    filteredPNL,
  };
}
