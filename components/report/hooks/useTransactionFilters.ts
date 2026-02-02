'use client';

import { useState, useMemo } from 'react';
import { PNLReport } from '@/lib/pnl-calculations';

export function useTransactionFilters(transactions: PNLReport['transactions']) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'matched' | 'unmatched' | 'deposits' | 'fees'>('all');
  
  // Group transactions by month
  const monthlyData = useMemo(() => {
    const grouped: Record<string, typeof transactions> = {};
    transactions.forEach((txn) => {
      const date = new Date(txn.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(txn);
    });
    const sortedMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    return { grouped, sortedMonths };
  }, [transactions]);

  const selectedMonth = monthlyData.sortedMonths[selectedMonthIndex];
  const allTransactionsForMonth = monthlyData.grouped[selectedMonth] || [];
  
  // Apply filters and search
  const filteredTransactions = useMemo(() => {
    let filtered = allTransactionsForMonth;
    
    if (filter === 'matched') {
      filtered = filtered.filter(t => t.match?.type && t.match.type !== 'unmatched');
    } else if (filter === 'unmatched') {
      filtered = filtered.filter(t => !t.match || t.match.type === 'unmatched');
    } else if (filter === 'deposits') {
      filtered = filtered.filter(t => t.match?.type === 'deposit');
    } else if (filter === 'fees') {
      filtered = filtered.filter(t => t.match?.type === 'fee');
    }
    
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.match?.firmName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [allTransactionsForMonth, filter, searchQuery]);

  const monthTotals = useMemo(() => {
    const nonPendingTransactions = allTransactionsForMonth.filter(t => !t.pending);
    const deposits = nonPendingTransactions
      .filter(t => t.match?.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    const fees = nonPendingTransactions
      .filter(t => t.match?.type === 'fee')
      .reduce((sum, t) => sum + t.amount, 0);
    const netPNL = deposits - fees;
    return { deposits, fees, netPNL };
  }, [allTransactionsForMonth]);
  
  return {
    searchQuery,
    setSearchQuery,
    selectedMonthIndex,
    setSelectedMonthIndex,
    filter,
    setFilter,
    monthlyData,
    filteredTransactions,
    monthTotals,
    selectedMonth,
  };
}
