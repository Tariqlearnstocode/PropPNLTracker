'use client';

import { useState, useEffect, useMemo } from 'react';
import { PNLReport } from '@/lib/pnl-calculations';

export function useManualAssignments(reportId: string, transactions: PNLReport['transactions']) {
  const [manualAssignments, setManualAssignments] = useState<Record<string, string>>({});
  
  // Load manual assignments from database
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const response = await fetch(`/api/pnl/assignments?reportId=${reportId}`);
        if (response.ok) {
          const data = await response.json();
          setManualAssignments(data.assignments || {});
        }
      } catch (e) {
        console.error('Failed to load manual assignments', e);
      }
    };
    loadAssignments();
  }, [reportId]);
  
  // Save manual assignments to database
  const saveManualAssignment = async (transactionId: string, firmName: string) => {
    const previousAssignments = manualAssignments;
    const newAssignments = { ...manualAssignments, [transactionId]: firmName };
    // Optimistically update UI
    setManualAssignments(newAssignments);
    
    try {
      const response = await fetch('/api/pnl/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          assignments: newAssignments,
        }),
      });
      
      if (!response.ok) {
        // Revert on error
        setManualAssignments(previousAssignments);
        console.error('Failed to save assignment');
      }
    } catch (e) {
      // Revert on error
      setManualAssignments(previousAssignments);
      console.error('Failed to save assignment', e);
    }
  };
  
  // Remove manual assignment
  const removeManualAssignment = async (transactionId: string) => {
    const previousAssignments = manualAssignments;
    const newAssignments = { ...manualAssignments };
    delete newAssignments[transactionId];
    // Optimistically update UI
    setManualAssignments(newAssignments);
    
    try {
      const response = await fetch('/api/pnl/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          assignments: newAssignments,
        }),
      });
      
      if (!response.ok) {
        // Revert on error
        setManualAssignments(previousAssignments);
        console.error('Failed to remove assignment');
      }
    } catch (e) {
      // Revert on error
      setManualAssignments(previousAssignments);
      console.error('Failed to remove assignment', e);
    }
  };
  
  // Bulk assign transactions
  const bulkAssign = async (transactionIds: Set<string>, firmName: string) => {
    if (!firmName.trim() || transactionIds.size === 0) return;
    
    const previousAssignments = manualAssignments;
    const newAssignments = { ...manualAssignments };
    transactionIds.forEach(transactionId => {
      newAssignments[transactionId] = firmName.trim();
    });
    
    // Optimistically update UI
    setManualAssignments(newAssignments);
    
    try {
      const response = await fetch('/api/pnl/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          assignments: newAssignments,
        }),
      });
      
      if (!response.ok) {
        // Revert on error
        setManualAssignments(previousAssignments);
        console.error('Failed to save bulk assignments');
        alert('Failed to save assignments. Please try again.');
        return false;
      }
      return true;
    } catch (e) {
      // Revert on error
      setManualAssignments(previousAssignments);
      console.error('Failed to save bulk assignments', e);
      alert('Failed to save assignments. Please try again.');
      return false;
    }
  };
  
  // Dismiss a transaction (mark as not a prop firm transaction)
  const dismissTransaction = async (transactionId: string) => {
    return saveManualAssignment(transactionId, '__dismissed__');
  };

  // Bulk dismiss transactions
  const bulkDismiss = async (transactionIds: Set<string>) => {
    if (transactionIds.size === 0) return;

    const previousAssignments = manualAssignments;
    const newAssignments = { ...manualAssignments };
    transactionIds.forEach(id => {
      newAssignments[id] = '__dismissed__';
    });

    setManualAssignments(newAssignments);

    try {
      const response = await fetch('/api/pnl/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          assignments: newAssignments,
        }),
      });

      if (!response.ok) {
        setManualAssignments(previousAssignments);
        console.error('Failed to dismiss transactions');
      }
    } catch (e) {
      setManualAssignments(previousAssignments);
      console.error('Failed to dismiss transactions', e);
    }
  };

  // Apply manual assignments to transactions for display
  // This provides immediate UI feedback before server recalculates
  const transactionsWithAssignments = useMemo(() => {
    return transactions.map(txn => {
      const assignedFirm = manualAssignments[txn.id];
      if (assignedFirm === '__dismissed__') {
        // Dismissed — mark as unmatched with needsAssignment false so it drops out of the list
        return {
          ...txn,
          match: {
            ...txn.match,
            type: 'unmatched' as const,
            needsAssignment: false,
          }
        };
      }
      if (assignedFirm && txn.match.type === 'unmatched') {
        // Convert unmatched transaction to deposit/fee when assigned (matches server-side logic)
        return {
          ...txn,
          match: {
            type: (txn.isIncome ? 'deposit' : 'fee') as 'deposit' | 'fee',
            firmName: assignedFirm,
            confidence: 'high' as const,
            needsAssignment: false,
          }
        };
      } else if (assignedFirm) {
        // Transaction already matched but firm name overridden
        return {
          ...txn,
          match: {
            ...txn.match,
            firmName: assignedFirm,
            confidence: 'high' as const,
          }
        };
      }
      return txn;
    });
  }, [transactions, manualAssignments]);
  
  // Get transactions that need assignment (pattern-matched or payment processors)
  const needsAssignmentTransactions = useMemo(() => {
    return transactionsWithAssignments.filter(txn => 
      !txn.pending && 
      txn.match.needsAssignment === true
    );
  }, [transactionsWithAssignments]);
  
  // Get truly unmatched transactions (not prop-firm related - like Chick-fil-A, Walmart)
  const unmatchedTransactions = useMemo(() => {
    return transactions.filter(txn => 
      !txn.pending && 
      txn.match.type === 'unmatched' && 
      !txn.match.needsAssignment // Only truly unrelated transactions
    );
  }, [transactions]);
  
  return {
    manualAssignments,
    transactionsWithAssignments,
    needsAssignmentTransactions,
    unmatchedTransactions,
    saveManualAssignment,
    removeManualAssignment,
    bulkAssign,
    dismissTransaction,
    bulkDismiss,
  };
}
