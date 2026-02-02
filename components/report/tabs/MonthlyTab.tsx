'use client';

import React from 'react';
import { PNLReport, formatCurrency, formatMonth } from '@/lib/pnl-calculations';

interface MonthlyTabProps {
  filteredMonthlyBreakdown: PNLReport['monthlyBreakdown'];
}

export function MonthlyTab({ filteredMonthlyBreakdown }: MonthlyTabProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Month</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Deposits</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Fees</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Net PNL</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Running Total</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Transactions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMonthlyBreakdown.map((month) => (
              <tr key={month.month} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatMonth(month.month)}</td>
                <td className="px-4 py-3 text-sm text-right text-emerald-600">{formatCurrency(month.deposits)}</td>
                <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(month.fees)}</td>
                <td className={`px-4 py-3 text-sm text-right font-semibold ${
                  month.netPNL >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {formatCurrency(month.netPNL)}
                </td>
                <td className={`px-4 py-3 text-sm text-right ${
                  month.runningTotal >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {formatCurrency(month.runningTotal)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-500">{month.transactionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
