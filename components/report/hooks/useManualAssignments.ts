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
      } catch {
      }
    };
    loadAssignments();
  }, [reportId]);
  
  // Only unmatched transactions that need assignment can be modified.
  // Already auto-matched transactions are locked to preserve report integrity.
  const isEditable = (transactionId: string): boolean => {
    const txn = transactions.find(t => t.id === transactionId);
    if (!txn) return false;
    return txn.match.type === 'unmatched' && txn.match.needsAssignment === true;
  };

  // Save manual assignments to database
  const saveManualAssignment = async (transactionId: string, firmName: string) => {
    if (!isEditable(transactionId)) return;
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
      }
    } catch {
      // Revert on error
      setManualAssignments(previousAssignments);
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
      }
    } catch {
      // Revert on error
      setManualAssignments(previousAssignments);
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
        alert('Failed to save assignments. Please try again.');
        return false;
      }
      return true;
    } catch {
      // Revert on error
      setManualAssignments(previousAssignments);
      alert('Failed to save assignments. Please try again.');
      return false;
    }
  };
  
  // Dismiss a transaction (mark as not a prop firm transaction)
  const dismissTransaction = async (transactionId: string) => {
    if (!isEditable(transactionId)) return;
    return saveManualAssignment(transactionId, '__dismissed__');
  };

  // Bulk dismiss transactions
  const bulkDismiss = async (transactionIds: Set<string>) => {
    if (transactionIds.size === 0) return;

    const previousAssignments = manualAssignments;
    const newAssignments = { ...manualAssignments };
    // Filter to only editable transactions
    const editableIds = Array.from(transactionIds).filter(isEditable);
    editableIds.forEach(id => {
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
      }
    } catch {
      setManualAssignments(previousAssignments);
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
      if (assignedFirm && txn.match.type === 'unmatched' && txn.match.needsAssignment) {
        // Convert unmatched transaction to deposit/fee when assigned (matches server-side logic)
        // Only allowed for transactions that genuinely need assignment
        return {
          ...txn,
          match: {
            type: (txn.isIncome ? 'deposit' : 'fee') as 'deposit' | 'fee',
            firmName: assignedFirm,
            confidence: 'high' as const,
            needsAssignment: false,
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
