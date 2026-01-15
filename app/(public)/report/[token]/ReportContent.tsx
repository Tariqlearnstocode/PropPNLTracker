'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Download, ChevronLeft, ChevronRight, Search, TrendingUp, TrendingDown, DollarSign, CreditCard, BarChart3, FileText, Filter, MoreVertical, ChevronDown, ChevronUp, Calendar, Activity, Trophy, Target, Zap, TrendingDown as TrendingDownIcon, Award, Clock, Percent, ArrowUpRight, ArrowDownRight, FileDown, GitCompare, Edit2, X, Plus, Save, Link2, CheckCircle2, AlertCircle, CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';
import { PNLReport, formatCurrency, formatDate, formatMonth, calculateTradingStats } from '@/lib/pnl-calculations';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  report: {
    id: string;
    user_id: string;
    report_token: string;
    account_id: string;
    created_at: string;
    updated_at: string;
  };
  pnlData: PNLReport;
}

// Tabbed interface component
function TabbedSection({ children, tabs, activeTab, onTabChange }: { children: React.ReactNode, tabs: string[], activeTab: string, onTabChange: (tab: string) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 md:px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}

// Expandable section component
function ExpandableSection({ title, defaultOpen = false, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
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

// Metric card component with gradient
function MetricCard({ title, value, subtitle, trend, icon: Icon, gradient, className = '' }: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon?: React.ComponentType<{ className?: string }>;
  gradient?: string;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${gradient || 'text-gray-900'}`}>
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${gradient ? 'bg-gradient-to-br ' + gradient.split(' ')[0] : 'bg-gray-100'}`}>
            <Icon className="w-6 h-6 text-gray-700" />
          </div>
        )}
      </div>
      {trend && (
        <div className={`flex items-center text-sm ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend.value >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );
}

// Monthly PNL Chart Component
function MonthlyPNLChart({ monthlyBreakdown }: { monthlyBreakdown: PNLReport['monthlyBreakdown'] }) {
  const chartData = useMemo(() => {
    return monthlyBreakdown.map(month => ({
      month: formatMonth(month.month).split(' ')[0],
      fullMonth: formatMonth(month.month),
      deposits: month.deposits,
      fees: month.fees,
      netPNL: month.netPNL,
      runningTotal: month.runningTotal,
    }));
  }, [monthlyBreakdown]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullMonth || label}
        />
        <Legend />
        <Area type="monotone" dataKey="deposits" stroke="#10b981" fillOpacity={1} fill="url(#colorDeposits)" name="Deposits" />
        <Area type="monotone" dataKey="fees" stroke="#ef4444" fillOpacity={1} fill="url(#colorFees)" name="Fees" />
        <Line type="monotone" dataKey="runningTotal" stroke="#3b82f6" strokeWidth={2} dot={false} name="Running Total" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Per-Firm Bar Chart
function PerFirmChart({ perFirmBreakdown }: { perFirmBreakdown: PNLReport['perFirmBreakdown'] }) {
  const chartData = useMemo(() => {
    return perFirmBreakdown
      .slice(0, 10) // Top 10 firms
      .map(firm => ({
        name: firm.firmName.length > 15 ? firm.firmName.substring(0, 15) + '...' : firm.firmName,
        fullName: firm.firmName,
        deposits: firm.deposits,
        fees: firm.fees,
        netPNL: firm.netPNL,
      }));
  }, [perFirmBreakdown]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
        <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} width={120} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
        />
        <Legend />
        <Bar dataKey="deposits" fill="#10b981" name="Deposits" radius={[0, 4, 4, 0]} />
        <Bar dataKey="fees" fill="#ef4444" name="Fees" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// PNL Trend Line Chart
function PNLTrendChart({ monthlyBreakdown }: { monthlyBreakdown: PNLReport['monthlyBreakdown'] }) {
  const chartData = useMemo(() => {
    return monthlyBreakdown.map(month => ({
      month: formatMonth(month.month).split(' ')[0],
      fullMonth: formatMonth(month.month),
      netPNL: month.netPNL,
      runningTotal: month.runningTotal,
    }));
  }, [monthlyBreakdown]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullMonth || label}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="netPNL" 
          stroke="#8b5cf6" 
          strokeWidth={2} 
          dot={{ fill: '#8b5cf6', r: 4 }} 
          name="Monthly PNL"
        />
        <Line 
          type="monotone" 
          dataKey="runningTotal" 
          stroke="#3b82f6" 
          strokeWidth={2} 
          dot={false} 
          strokeDasharray="5 5"
          name="Running Total"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Daily PNL Calendar Component
function DailyPNLCalendar({ dailyPNL, selectedMonth, onMonthChange }: { 
  dailyPNL: Array<{ date: string; deposits: number; fees: number; netPNL: number; purchaseCount: number; payoutCount: number }>;
  selectedMonth: string; // YYYY-MM
  onMonthChange: (month: string) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(selectedMonth);
  
  const monthData = useMemo(() => {
    const [year, month] = currentMonth.split('-');
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    const firstDay = new Date(yearNum, monthNum - 1, 1);
    const lastDay = new Date(yearNum, monthNum, 0); // Day 0 of next month = last day of current month
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const monthPNL = dailyPNL.filter(d => d.date.startsWith(currentMonth));
    const totalPNL = monthPNL.reduce((sum, d) => sum + d.netPNL, 0);
    const totalPurchases = monthPNL.reduce((sum, d) => sum + d.purchaseCount, 0);
    const totalPayouts = monthPNL.reduce((sum, d) => sum + d.payoutCount, 0);
    
    const calendarDays: Array<{ day: number; date: string | null; data: typeof monthPNL[0] | null }> = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push({ day: 0, date: null, data: null });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
      const dayData = monthPNL.find(d => d.date === dateStr) || null;
      calendarDays.push({ day, date: dateStr, data: dayData });
    }
    
    // Group into weeks
    const weeks: Array<Array<{ day: number; date: string | null; data: typeof monthPNL[0] | null }>> = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }
    
    return { weeks, totalPNL, totalPurchases, totalPayouts };
  }, [currentMonth, dailyPNL]);
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = currentMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    if (direction === 'prev') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(newMonth);
    onMonthChange(newMonth);
  };
  
  const goToToday = () => {
    const today = new Date();
    const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(month);
    onMonthChange(month);
  };
  
  const getDayColor = (netPNL: number) => {
    if (netPNL > 0) return 'bg-emerald-500';
    if (netPNL < 0) return 'bg-red-500';
    return 'bg-gray-100';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {(() => {
              const [year, month] = currentMonth.split('-');
              const date = new Date(parseInt(year), parseInt(month) - 1, 1);
              return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            })()}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Today
        </button>
      </div>
      
      <div className="mb-4 text-center">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          Monthly P/L: {formatCurrency(monthData.totalPNL)}
        </div>
        <div className="text-sm text-gray-600">
          {monthData.totalPayouts} payouts • {monthData.totalPurchases} purchases
        </div>
      </div>
      
      <div className="grid grid-cols-8 gap-2">
        {/* Day headers */}
        <div className="text-xs font-semibold text-gray-600 text-center py-1.5">Su</div>
        <div className="text-xs font-semibold text-gray-600 text-center py-1.5">Mo</div>
        <div className="text-xs font-semibold text-gray-600 text-center py-1.5">Tu</div>
        <div className="text-xs font-semibold text-gray-600 text-center py-1.5">We</div>
        <div className="text-xs font-semibold text-gray-600 text-center py-1.5">Th</div>
        <div className="text-xs font-semibold text-gray-600 text-center py-1.5">Fr</div>
        <div className="text-xs font-semibold text-gray-600 text-center py-1.5">Sa</div>
        <div className="text-xs font-semibold text-gray-600 text-center py-1.5">Week</div>
        
        {/* Calendar days */}
        {monthData.weeks.map((week, weekIdx) => (
          <React.Fragment key={`week-${weekIdx}`}>
            {week.map((day, dayIdx) => {
              if (day.day === 0) {
                return <div key={`empty-${weekIdx}-${dayIdx}`} className="h-20"></div>;
              }
              
              const hasData = day.data !== null;
              const netPNL = day.data?.netPNL || 0;
              const purchases = day.data?.purchaseCount || 0;
              const payouts = day.data?.payoutCount || 0;
              
              return (
                <div
                  key={day.date || `day-${weekIdx}-${dayIdx}`}
                  className={`h-20 rounded border transition-all ${
                    hasData
                      ? `${getDayColor(netPNL)} text-white border-transparent hover:opacity-90 cursor-pointer`
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                  title={day.date ? `${day.date}: ${formatCurrency(netPNL)}` : ''}
                >
                  <div className="h-full flex flex-col p-1.5">
                    <div className={`text-xs font-semibold ${hasData ? 'text-white' : 'text-gray-400'}`}>
                      {day.day}
                    </div>
                    {hasData && (
                      <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="text-sm font-bold leading-tight text-center">
                          {formatCurrency(netPNL)}
                        </div>
                        <div className="text-[10px] mt-0.5 text-white/90">
                          {purchases}P / {payouts}D
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Week total */}
            <div key={`week-total-${weekIdx}`} className="h-20 bg-gray-50 border border-gray-200 rounded flex flex-col items-center justify-center p-1.5">
              <div className="text-xs font-semibold text-gray-700 mb-1">W{weekIdx + 1}</div>
              {(() => {
                const weekPNL = week
                  .filter(d => d.data)
                  .reduce((sum, d) => sum + (d.data?.netPNL || 0), 0);
                const weekPurchases = week
                  .filter(d => d.data)
                  .reduce((sum, d) => sum + (d.data?.purchaseCount || 0), 0);
                const weekPayouts = week
                  .filter(d => d.data)
                  .reduce((sum, d) => sum + (d.data?.payoutCount || 0), 0);
                return (
                  <>
                    <div className={`text-xs font-bold ${weekPNL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(weekPNL)}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {weekPayouts}D / {weekPurchases}P
                    </div>
                  </>
                );
              })()}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Activity Stats Module
function ActivityStatsModule({ stats }: { stats: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-600" />
        Activity Stats
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Purchases</div>
          <div className="text-2xl font-bold text-emerald-700">{stats.totalPurchases.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Challenges & fees</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Payouts</div>
          <div className="text-2xl font-bold text-blue-700">{stats.totalPayouts.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Successful payouts</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Purchase/Payout Ratio</div>
          <div className="text-2xl font-bold text-purple-700">{stats.purchaseToPayoutRatio.toFixed(2)}x</div>
          <div className="text-xs text-gray-500 mt-1">Purchases per payout</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Purchase Size</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.averagePurchaseSize)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Payout Size</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.averagePayoutSize)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Active Months</div>
          <div className="text-xl font-bold text-gray-900">{stats.activeMonths}</div>
        </div>
      </div>
    </div>
  );
}

// Best/Worst Performance Module
function BestWorstModule({ stats }: { stats: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-600" />
        Best & Worst Performance
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.bestMonth && (
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border-2 border-emerald-200">
            <div className="text-sm text-gray-600 mb-1">Best Month</div>
            <div className="text-lg font-bold text-emerald-700">{formatMonth(stats.bestMonth.month)}</div>
            <div className="text-2xl font-bold text-emerald-700 mt-2">{formatCurrency(stats.bestMonth.netPNL)}</div>
            <div className="text-xs text-gray-600 mt-1">
              {formatCurrency(stats.bestMonth.deposits)} deposits • {formatCurrency(stats.bestMonth.fees)} fees
            </div>
          </div>
        )}
        {stats.worstMonth && (
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-2 border-red-200">
            <div className="text-sm text-gray-600 mb-1">Worst Month</div>
            <div className="text-lg font-bold text-red-700">{formatMonth(stats.worstMonth.month)}</div>
            <div className="text-2xl font-bold text-red-700 mt-2">{formatCurrency(stats.worstMonth.netPNL)}</div>
            <div className="text-xs text-gray-600 mt-1">
              {formatCurrency(stats.worstMonth.deposits)} deposits • {formatCurrency(stats.worstMonth.fees)} fees
            </div>
          </div>
        )}
        {stats.bestDay && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Best Day</div>
            <div className="text-lg font-bold text-blue-700">{formatDate(stats.bestDay.date)}</div>
            <div className="text-2xl font-bold text-blue-700 mt-2">{formatCurrency(stats.bestDay.netPNL)}</div>
            <div className="text-xs text-gray-600 mt-1">
              {formatCurrency(stats.bestDay.deposits)} in deposits
            </div>
          </div>
        )}
        {stats.largestPurchase && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Largest Purchase</div>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(stats.largestPurchase.amount)}</div>
            <div className="text-xs text-gray-500 mt-1">{formatDate(stats.largestPurchase.date)}</div>
            {stats.largestPurchase.firmName && (
              <div className="text-xs text-gray-500">{stats.largestPurchase.firmName}</div>
            )}
          </div>
        )}
        {stats.bestFirm && (
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div className="text-sm text-gray-600 mb-1">Best Firm</div>
            <div className="text-lg font-bold text-emerald-700">{stats.bestFirm.firmName}</div>
            <div className="text-xl font-bold text-emerald-700 mt-2">{formatCurrency(stats.bestFirm.netPNL)}</div>
          </div>
        )}
        {stats.worstFirm && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-sm text-gray-600 mb-1">Worst Firm</div>
            <div className="text-lg font-bold text-red-700">{stats.worstFirm.firmName}</div>
            <div className="text-xl font-bold text-red-700 mt-2">{formatCurrency(stats.worstFirm.netPNL)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Day of Week Patterns Module
function DayOfWeekPatternsModule({ stats }: { stats: any[] }) {
  const chartData = stats.map(day => ({
    day: day.day.substring(0, 3),
    fullDay: day.day,
    totalPNL: day.totalPNL,
    averagePNL: day.averagePNL,
    purchases: day.purchaseCount,
    payouts: day.payoutCount,
  }));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        Day-of-Week Patterns
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDay || label}
          />
          <Legend />
          <Bar dataKey="totalPNL" fill="#8b5cf6" name="Total PNL" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {stats.map(day => (
          <div key={day.day} className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">{day.day}</div>
            <div className={`text-lg font-bold ${day.averagePNL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(day.averagePNL)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {day.payouts}D / {day.purchases}P
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ROI & Efficiency Module
function ROIModule({ stats }: { stats: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Percent className="w-5 h-5 text-blue-600" />
        ROI & Efficiency
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">ROI</div>
          <div className="text-2xl font-bold text-blue-700">{stats.roi.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">Return on fees</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Return per $</div>
          <div className="text-2xl font-bold text-emerald-700">${stats.returnPerDollar.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">Per dollar spent</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Profit Margin</div>
          <div className="text-2xl font-bold text-purple-700">{stats.profitMargin.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">Of total deposits</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Cost per Payout</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.costPerPayout)}</div>
        </div>
        {stats.breakEvenDate && (
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="text-sm text-gray-600 mb-1">Break-Even</div>
            <div className="text-sm font-bold text-amber-700">{formatMonth(stats.breakEvenDate)}</div>
            <div className="text-xs text-gray-500 mt-1">Fees = Deposits</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Win/Loss Streaks Module
function StreakModule({ stats }: { stats: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-600" />
        Win/Loss Streaks
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border-2 border-emerald-200">
          <div className="text-sm text-gray-600 mb-1">Current Win Streak</div>
          <div className="text-3xl font-bold text-emerald-700">{stats.currentWinStreak}</div>
          <div className="text-xs text-gray-500 mt-1">Consecutive profitable months</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="text-sm text-gray-600 mb-1">Longest Win Streak</div>
          <div className="text-2xl font-bold text-emerald-700">{stats.longestWinStreak}</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-2 border-red-200">
          <div className="text-sm text-gray-600 mb-1">Current Loss Streak</div>
          <div className="text-3xl font-bold text-red-700">{stats.currentLossStreak}</div>
          <div className="text-xs text-gray-500 mt-1">Consecutive losing months</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-gray-900">{stats.winRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.totalProfitableMonths}W / {stats.totalUnprofitableMonths}L
          </div>
        </div>
      </div>
    </div>
  );
}

// Purchase Frequency Module
function PurchaseFrequencyModule({ stats }: { stats: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-orange-600" />
        Purchase Frequency
      </h3>
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Top Purchase Days</div>
        <div className="space-y-2">
          {stats.topPurchaseDays.slice(0, 5).map((day: any, i: number) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div>
                <div className="font-medium text-gray-900">{formatDate(day.date)}</div>
                <div className="text-xs text-gray-500">{day.count} purchases</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{formatCurrency(day.totalAmount)}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Purchase</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.averagePurchaseSize)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Most Common</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.mostCommonPurchaseAmount)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Distribution</div>
          <div className="text-xs text-gray-500">
            {stats.purchaseFrequencyDistribution.map((d: any) => `${d.range}: ${d.count}`).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
}

// Payout Performance Module
function PayoutPerformanceModule({ stats }: { stats: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-emerald-600" />
        Payout Performance
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Payouts</div>
          <div className="text-2xl font-bold text-emerald-700">{stats.totalPayouts}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Payout Size</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.averagePayoutSize)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Payout Frequency</div>
          <div className="text-xl font-bold text-gray-900">{stats.payoutFrequency.toFixed(1)}/month</div>
        </div>
        {stats.largestPayout && (
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div className="text-sm text-gray-600 mb-1">Largest Payout</div>
            <div className="text-xl font-bold text-emerald-700">{formatCurrency(stats.largestPayout.amount)}</div>
            <div className="text-xs text-gray-500 mt-1">{formatDate(stats.largestPayout.date)}</div>
            {stats.largestPayout.firmName && (
              <div className="text-xs text-gray-500">{stats.largestPayout.firmName}</div>
            )}
          </div>
        )}
        {stats.smallestPayout && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Smallest Payout</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.smallestPayout.amount)}</div>
            <div className="text-xs text-gray-500 mt-1">{formatDate(stats.smallestPayout.date)}</div>
          </div>
        )}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Days Between</div>
          <div className="text-xl font-bold text-gray-900">{stats.averageDaysBetweenPayouts.toFixed(1)} days</div>
        </div>
      </div>
    </div>
  );
}

// Growth Trends Module
function GrowthTrendsModule({ stats }: { stats: any }) {
  const chartData = stats.monthOverMonthGrowth.map((g: any) => ({
    month: formatMonth(g.month).split(' ')[0],
    fullMonth: formatMonth(g.month),
    growth: g.growth,
    netPNL: g.netPNL,
  }));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        Growth Trends
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Monthly PNL</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.averageMonthlyPNL)}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Projected Annual</div>
          <div className="text-xl font-bold text-blue-700">{formatCurrency(stats.projectedAnnualPNL)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Growth Velocity</div>
          <div className={`text-xl font-bold ${stats.growthVelocity >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {stats.growthVelocity >= 0 ? '+' : ''}{stats.growthVelocity.toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Months Tracked</div>
          <div className="text-xl font-bold text-gray-900">{stats.monthOverMonthGrowth.length + 1}</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value.toFixed(0)}%`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(1)}%` : ''}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullMonth || label}
          />
          <Bar dataKey="growth" fill="#3b82f6" name="MoM Growth %" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Firm Comparison Module
function FirmComparisonModule({ stats }: { stats: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-indigo-600" />
        Firm Comparison
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.mostProfitableFirm && (
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border-2 border-emerald-200">
            <div className="text-sm text-gray-600 mb-1">Most Profitable</div>
            <div className="text-lg font-bold text-emerald-700 truncate" title={stats.mostProfitableFirm.firmName}>
              {stats.mostProfitableFirm.firmName}
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2">
              {formatCurrency(stats.mostProfitableFirm.netPNL)}
            </div>
          </div>
        )}
        {stats.bestROIFirm && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Best ROI</div>
            <div className="text-lg font-bold text-blue-700 truncate" title={stats.bestROIFirm.firmName}>
              {stats.bestROIFirm.firmName}
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-2">
              {stats.bestROIFirm.roi.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatCurrency(stats.bestROIFirm.netPNL)} net
            </div>
          </div>
        )}
        {stats.mostActiveFirm && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Most Active</div>
            <div className="text-lg font-bold text-gray-900 truncate" title={stats.mostActiveFirm.firmName}>
              {stats.mostActiveFirm.firmName}
            </div>
            <div className="text-xl font-bold text-gray-900 mt-2">
              {stats.mostActiveFirm.transactionCount} transactions
            </div>
          </div>
        )}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Payout/Firm</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(stats.averagePayoutPerFirm)}</div>
        </div>
      </div>
      {stats.firmSuccessRate.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">Firm Success Rates</div>
          <div className="space-y-2">
            {stats.firmSuccessRate
              .sort((a: any, b: any) => b.successRate - a.successRate)
              .slice(0, 5)
              .map((firm: any, i: number) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 truncate">{firm.firmName}</div>
                    <div className="text-xs text-gray-500">{firm.payouts} payouts / {firm.purchases} purchases</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">{firm.successRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Success rate</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Transaction History with Search
function TransactionHistory({ transactions }: { transactions: PNLReport['transactions'] }) {
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

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'matched', 'unmatched', 'deposits', 'fees'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {monthlyData.sortedMonths.map((month, idx) => (
          <button
            key={month}
            onClick={() => setSelectedMonthIndex(idx)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              idx === selectedMonthIndex
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {formatMonth(month)}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-gray-600">
          <div className="col-span-2">Date</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-2">Firm/Match</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2 text-right">Balance</div>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            filteredTransactions.map((txn, i) => (
              <div 
                key={i}
                className={`grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 text-sm hover:bg-gray-50 transition-colors ${
                  txn.pending ? 'opacity-60' : ''
                }`}
              >
                <div className="col-span-2 text-emerald-600 font-medium">
                  {new Date(txn.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </div>
                <div className="col-span-4 text-gray-900 truncate" title={txn.name}>
                  {txn.name}
                  {txn.pending && <span className="ml-2 text-xs text-amber-600">(pending)</span>}
                </div>
                <div className="col-span-2">
                  {txn.match && txn.match.type !== 'unmatched' ? (
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                      txn.match.type === 'deposit' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {txn.match.type === 'deposit' ? 'Deposit' : 'Fee'}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Unmatched</span>
                  )}
                </div>
                <div className={`col-span-2 text-right font-medium ${
                  txn.isIncome ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {txn.isIncome ? '+' : '-'}{formatCurrency(txn.amount)}
                </div>
                <div className="col-span-2 text-right text-gray-500 text-xs">
                  {txn.runningBalance !== null ? formatCurrency(txn.runningBalance) : '—'}
                </div>
              </div>
            ))
          )}
        </div>
        {/* Month Summary */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-between items-center text-sm font-medium">
          <span className="text-gray-700">Month Total ({formatMonth(selectedMonth)})</span>
          <div className="flex gap-6">
            <span className="text-emerald-600">{formatCurrency(monthTotals.deposits)}</span>
            <span className="text-red-600">{formatCurrency(monthTotals.fees)}</span>
            <span className={monthTotals.netPNL >= 0 ? 'text-emerald-600' : 'text-red-600'}>
              {formatCurrency(monthTotals.netPNL)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Match badge component
function MatchBadge({ match }: { match: { type: 'deposit' | 'fee' | 'unmatched'; firmName: string | null; confidence: 'high' | 'medium' | 'low' } }) {
  if (match.type === 'unmatched' || !match.firmName) {
    return <span className="text-xs text-gray-400">Unmatched</span>;
  }
  
  const typeStyles = {
    deposit: 'bg-emerald-100 text-emerald-700',
    fee: 'bg-red-100 text-red-700',
    unmatched: 'bg-gray-100 text-gray-600',
  };
  
  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${typeStyles[match.type]}`}>
        {match.type === 'deposit' ? 'Deposit' : 'Fee'}
      </span>
      <span className="text-xs text-gray-600 truncate" title={match.firmName}>
        {match.firmName}
      </span>
    </div>
  );
}

// Confidence badge component
function ConfidenceBadge({ confidence }: { confidence: 'high' | 'medium' | 'low' }) {
  const styles = {
    high: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-red-100 text-red-700 border-red-200',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${styles[confidence]}`}>
      {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
    </span>
  );
}

// Helper to safely handle NaN values
function safeNumber(value: number | null | undefined): number {
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }
  return value;
}

// Export functions
function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToPDF() {
  window.print();
}

export default function ReportContent({ report, pnlData }: Props) {
  const { summary, monthlyBreakdown, perFirmBreakdown, transactions, accounts } = pnlData;
  const [activeTab, setActiveTab] = useState<'overview' | 'monthly' | 'firms' | 'transactions' | 'performance' | 'activity' | 'efficiency' | 'compare'>('overview');
  
  // Transactions view state
  const [transactionView, setTransactionView] = useState<'payouts' | 'purchases' | 'needs-assignment' | 'find-missing'>('payouts');
  const [calendarMonth, setCalendarMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  
  // Date range filtering - default to last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [startDate, setStartDate] = useState<string>(thirtyDaysAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);
  
  // Comparison mode - uses same date selector, just stores a second period
  const [compareMode, setCompareMode] = useState(false);
  const [compareType, setCompareType] = useState<'time' | 'firm'>('time');
  const [comparePeriodStartDate, setComparePeriodStartDate] = useState<string>(() => {
    const today = new Date();
    const sixtyDaysAgo = new Date(today);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    return sixtyDaysAgo.toISOString().split('T')[0];
  });
  const [comparePeriodEndDate, setComparePeriodEndDate] = useState<string>(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return thirtyDaysAgo.toISOString().split('T')[0];
  });
  
  // Firm comparison - selected firms to compare
  const [compareFirms, setCompareFirms] = useState<string[]>([]);
  
  // Export dropdown
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  
  // Manual assignments for Rise/Wise payouts
  const [manualAssignments, setManualAssignments] = useState<Record<string, string>>({});
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedTransactionForAssignment, setSelectedTransactionForAssignment] = useState<string | null>(null);
  const [customFirmName, setCustomFirmName] = useState('');
  
  // Missing match search
  const [missingMatchSearchAmount, setMissingMatchSearchAmount] = useState<string>('');
  const [missingMatchSearchDescription, setMissingMatchSearchDescription] = useState<string>('');
  const [missingMatchSearchResults, setMissingMatchSearchResults] = useState<Array<{ transaction: typeof transactions[0]; potentialMatches: typeof transactions[0][] }>>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [matchingViewOpen, setMatchingViewOpen] = useState(false);
  const [selectedUnmatchedTransaction, setSelectedUnmatchedTransaction] = useState<string | null>(null);
  
  // Bulk selection for assignments
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<Set<string>>(new Set());
  const [bulkAssignModalOpen, setBulkAssignModalOpen] = useState(false);
  const [bulkAssignFirmName, setBulkAssignFirmName] = useState<string>('');
  
  // Load manual assignments from database
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const response = await fetch(`/api/pnl/assignments?reportId=${report.id}`);
        if (response.ok) {
          const data = await response.json();
          setManualAssignments(data.assignments || {});
        }
      } catch (e) {
        console.error('Failed to load manual assignments', e);
      }
    };
    loadAssignments();
  }, [report.id]);
  
  // Save manual assignments to database
  const saveManualAssignment = async (transactionId: string, firmName: string) => {
    const newAssignments = { ...manualAssignments, [transactionId]: firmName };
    // Optimistically update UI
    setManualAssignments(newAssignments);
    
    try {
      const response = await fetch('/api/pnl/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: report.id,
          assignments: newAssignments,
        }),
      });
      
      if (!response.ok) {
        // Revert on error
        setManualAssignments(manualAssignments);
        console.error('Failed to save assignment');
      }
    } catch (e) {
      // Revert on error
      setManualAssignments(manualAssignments);
      console.error('Failed to save assignment', e);
    }
  };
  
  // Remove manual assignment
  const removeManualAssignment = async (transactionId: string) => {
    const newAssignments = { ...manualAssignments };
    delete newAssignments[transactionId];
    // Optimistically update UI
    setManualAssignments(newAssignments);
    
    try {
      const response = await fetch('/api/pnl/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: report.id,
          assignments: newAssignments,
        }),
      });
      
      if (!response.ok) {
        // Revert on error
        setManualAssignments(manualAssignments);
        console.error('Failed to remove assignment');
      }
    } catch (e) {
      // Revert on error
      setManualAssignments(manualAssignments);
      console.error('Failed to remove assignment', e);
    }
  };
  
  // Bulk assign transactions
  const handleBulkAssign = async () => {
    if (!bulkAssignFirmName.trim() || selectedTransactionIds.size === 0) return;
    
    const newAssignments = { ...manualAssignments };
    selectedTransactionIds.forEach(transactionId => {
      newAssignments[transactionId] = bulkAssignFirmName.trim();
    });
    
    // Optimistically update UI
    setManualAssignments(newAssignments);
    setSelectedTransactionIds(new Set());
    setBulkAssignModalOpen(false);
    setBulkAssignFirmName('');
    
    try {
      const response = await fetch('/api/pnl/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: report.id,
          assignments: newAssignments,
        }),
      });
      
      if (!response.ok) {
        // Revert on error
        setManualAssignments(manualAssignments);
        console.error('Failed to save bulk assignments');
        alert('Failed to save assignments. Please try again.');
      }
    } catch (e) {
      // Revert on error
      setManualAssignments(manualAssignments);
      console.error('Failed to save bulk assignments', e);
      alert('Failed to save assignments. Please try again.');
    }
  };
  
  // Apply manual assignments to transactions for display
  // This provides immediate UI feedback before server recalculates
  const transactionsWithAssignments = useMemo(() => {
    return transactions.map(txn => {
      const assignedFirm = manualAssignments[txn.id];
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
  
  // Search for missing matches by amount and/or description
  // Searches ALL unmatched transactions (not just needsAssignment) to find transactions the algo missed
  const searchMissingMatches = () => {
    if (!missingMatchSearchAmount && !missingMatchSearchDescription.trim()) return;
    
    const searchAmount = missingMatchSearchAmount ? parseFloat(missingMatchSearchAmount) : null;
    const searchDescription = missingMatchSearchDescription.trim().toLowerCase();
    
    if (searchAmount !== null && (isNaN(searchAmount) || searchAmount <= 0)) return;
    
    // Find all unmatched transactions (use transactionsWithAssignments to exclude already assigned)
    const tolerance = 0.01;
    const allUnmatched = transactionsWithAssignments.filter(txn => 
      !txn.pending && 
      txn.match.type === 'unmatched'
    );
    
    // Filter by amount and/or description
    const matches = allUnmatched
      .filter(txn => {
        const matchesAmount = searchAmount === null || Math.abs(txn.amount - searchAmount) < tolerance;
        const matchesDescription = !searchDescription || txn.name.toLowerCase().includes(searchDescription);
        return matchesAmount && matchesDescription;
      })
      .map(txn => {
        // Find potential matches (other transactions with same amount)
        const potentialMatches = searchAmount !== null ? transactionsWithAssignments.filter(otherTxn => 
          otherTxn.id !== txn.id &&
          Math.abs(otherTxn.amount - searchAmount) < tolerance &&
          otherTxn.isIncome === txn.isIncome
        ) : [];
        
        return {
          transaction: txn,
          potentialMatches,
        };
      });
    
    setMissingMatchSearchResults(matches as Array<{ transaction: typeof transactions[0]; potentialMatches: typeof transactions[0][] }>);
    setHasSearched(true);
  };
  
  // Firm filtering
  const [selectedFirms, setSelectedFirms] = useState<string[]>([]);
  const allFirmNames = useMemo(() => {
    const firms = perFirmBreakdown.map(f => f.firmName);
    // Add custom firms from manual assignments
    const customFirms = Object.values(manualAssignments).filter(f => !firms.includes(f));
    return [...firms, ...customFirms];
  }, [perFirmBreakdown, manualAssignments]);
  
  // Filter monthly breakdown by date range
  const filteredMonthlyBreakdown = useMemo(() => {
    return monthlyBreakdown.filter(monthData => {
      const [year, monthNum] = monthData.month.split('-');
      const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return monthDate >= start && monthDate <= end;
    });
  }, [monthlyBreakdown, startDate, endDate]);
  
  // Filter firms breakdown by selected firms
  const filteredFirmBreakdown = useMemo(() => {
    if (selectedFirms.length === 0) return perFirmBreakdown;
    return perFirmBreakdown.filter(firm => selectedFirms.includes(firm.firmName));
  }, [perFirmBreakdown, selectedFirms]);
  
  // Calculate filtered totals based on date range and firm filter
  // If firms are selected, calculate from firm breakdown, otherwise use monthly breakdown
  const filteredDeposits = useMemo(() => {
    if (selectedFirms.length > 0) {
      // Calculate from selected firms, but need to filter transactions by date too
      // For now, use firm breakdown totals (which are all-time)
      // In a more sophisticated implementation, we'd filter transactions by date AND firm
      return filteredFirmBreakdown.reduce((sum, firm) => sum + safeNumber(firm.deposits), 0);
    }
    return filteredMonthlyBreakdown.reduce((sum, month) => {
      return sum + safeNumber(month.deposits);
    }, 0);
  }, [filteredMonthlyBreakdown, filteredFirmBreakdown, selectedFirms]);
  
  const filteredFees = useMemo(() => {
    if (selectedFirms.length > 0) {
      return filteredFirmBreakdown.reduce((sum, firm) => sum + safeNumber(firm.fees), 0);
    }
    return filteredMonthlyBreakdown.reduce((sum, month) => {
      return sum + safeNumber(month.fees);
    }, 0);
  }, [filteredMonthlyBreakdown, filteredFirmBreakdown, selectedFirms]);
  
  const filteredPNL = safeNumber(filteredDeposits - filteredFees);
  
  // Calculate all-time totals (for display when needed)
  const allTimeDeposits = safeNumber(summary.totalDeposits);
  const allTimeFees = safeNumber(summary.totalFees);
  const allTimePNL = safeNumber(summary.netPNL);
  
  const totalBalance = safeNumber(summary.totalBalance);
  // Calculate match rate from matched + unmatched (non-pending transactions)
  const nonPendingTransactions = summary.matchedCount + summary.unmatchedCount;
  const matchRate = nonPendingTransactions > 0 
    ? safeNumber((summary.matchedCount / nonPendingTransactions) * 100)
    : 0;

  // Calculate all trading statistics
  const tradingStats = useMemo(() => calculateTradingStats(pnlData), [pnlData]);
  
  // Comparison mode calculations - Period 2 uses comparePeriod dates
  const comparisonData = useMemo(() => {
    if (!compareMode || compareType !== 'time') return null;
    
    const compareMonthlyBreakdown = monthlyBreakdown.filter(monthData => {
      const [year, monthNum] = monthData.month.split('-');
      const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const start = new Date(comparePeriodStartDate);
      const end = new Date(comparePeriodEndDate);
      return monthDate >= start && monthDate <= end;
    });
    
    const compareDeposits = compareMonthlyBreakdown.reduce((sum, month) => sum + safeNumber(month.deposits), 0);
    const compareFees = compareMonthlyBreakdown.reduce((sum, month) => sum + safeNumber(month.fees), 0);
    const comparePNL = safeNumber(compareDeposits - compareFees);
    
    return {
      deposits: compareDeposits,
      fees: compareFees,
      netPNL: comparePNL,
      monthlyBreakdown: compareMonthlyBreakdown,
    };
  }, [compareMode, compareType, comparePeriodStartDate, comparePeriodEndDate, monthlyBreakdown]);
  
  // Firm comparison data
  const firmComparisonData = useMemo(() => {
    if (!compareMode || compareType !== 'firm' || compareFirms.length === 0) return null;
    
    return compareFirms.map(firmName => {
      const firm = perFirmBreakdown.find(f => f.firmName === firmName);
      if (!firm) return null;
      
      return {
        firmName: firm.firmName,
        deposits: firm.deposits,
        fees: firm.fees,
        netPNL: firm.netPNL,
        transactionCount: firm.transactionCount,
        confidence: firm.confidence,
      };
    }).filter(f => f !== null);
  }, [compareMode, compareType, compareFirms, perFirmBreakdown]);
  
  // Helper function to set date preset for comparison period
  const setCompareDatePreset = (preset: 'ytd' | 'all' | 'last30' | 'last90') => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    if (preset === 'ytd') {
      setComparePeriodStartDate(`${year}-01-01`);
      setComparePeriodEndDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    } else if (preset === 'all') {
      const earliestMonth = monthlyBreakdown[0]?.month || `${year}-01-01`;
      const [eyear, emonth] = earliestMonth.split('-');
      setComparePeriodStartDate(`${eyear}-${emonth}-01`);
      setComparePeriodEndDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    } else if (preset === 'last30') {
      const start = new Date(today);
      start.setDate(start.getDate() - 30);
      setComparePeriodStartDate(start.toISOString().split('T')[0]);
      setComparePeriodEndDate(today.toISOString().split('T')[0]);
    } else if (preset === 'last90') {
      const start = new Date(today);
      start.setDate(start.getDate() - 90);
      setComparePeriodStartDate(start.toISOString().split('T')[0]);
      setComparePeriodEndDate(today.toISOString().split('T')[0]);
    }
  };
  
  // Export handlers
  const handleExportCSV = () => {
    const csvData = filteredMonthlyBreakdown.map(month => ({
      Month: formatMonth(month.month),
      Deposits: month.deposits,
      Fees: month.fees,
      'Net PNL': month.netPNL,
      'Running Total': month.runningTotal,
      Transactions: month.transactionCount,
    }));
    exportToCSV(csvData, `pnl-report-${new Date().toISOString().split('T')[0]}.csv`);
  };
  
  const handleExportPDF = () => {
    exportToPDF();
  };

  // Use filtered values for display
  const displayDeposits = filteredDeposits;
  const displayFees = filteredFees;
  const displayPNL = filteredPNL;
  
  // Toggle firm selection
  const toggleFirm = (firmName: string) => {
    setSelectedFirms(prev => 
      prev.includes(firmName)
        ? prev.filter(f => f !== firmName)
        : [...prev, firmName]
    );
  };
  
  // Quick date presets
  const setDatePreset = (preset: 'ytd' | 'all' | 'last30' | 'last90') => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    if (preset === 'ytd') {
      setStartDate(`${year}-01-01`);
      setEndDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    } else if (preset === 'all') {
      // Find earliest month
      const earliestMonth = monthlyBreakdown[0]?.month || `${year}-01-01`;
      const [eyear, emonth] = earliestMonth.split('-');
      setStartDate(`${eyear}-${emonth}-01`);
      setEndDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    } else if (preset === 'last30') {
      const start = new Date(today);
      start.setDate(start.getDate() - 30);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (preset === 'last90') {
      const start = new Date(today);
      start.setDate(start.getDate() - 90);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prop Firm PNL Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Last updated {formatDate(report.updated_at)} • {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'} connected
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              {/* Date Range Filter */}
              <div className="flex items-center gap-1 md:gap-2 bg-white border border-gray-300 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm">
                <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-none text-xs md:text-sm focus:outline-none w-24 md:w-auto"
                />
                <span className="text-gray-400 hidden sm:inline">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-none text-xs md:text-sm focus:outline-none w-24 md:w-auto"
                />
              </div>
              
              {/* Quick Date Presets */}
              <div className="flex bg-gray-100 rounded-lg p-1 gap-1 text-xs">
                <button
                  onClick={() => setDatePreset('ytd')}
                  className="px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700 touch-manipulation"
                  title="Year to Date"
                >
                  YTD
                </button>
                <button
                  onClick={() => setDatePreset('last30')}
                  className="px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700 touch-manipulation"
                  title="Last 30 Days"
                >
                  30D
                </button>
                <button
                  onClick={() => setDatePreset('last90')}
                  className="px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700 touch-manipulation"
                  title="Last 90 Days"
                >
                  90D
                </button>
                <button
                  onClick={() => setDatePreset('all')}
                  className="px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700 touch-manipulation"
                  title="All Time"
                >
                  All
                </button>
              </div>
              
              {/* Firm Filter */}
              <div className="relative">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      toggleFirm(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Filter by Firm...</option>
                  {allFirmNames.map(firmName => (
                    <option key={firmName} value={firmName}>
                      {firmName}
                    </option>
                  ))}
                </select>
                {selectedFirms.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedFirms.length}
                  </div>
                )}
              </div>
              
              {selectedFirms.length > 0 && (
                <button
                  onClick={() => setSelectedFirms([])}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Clear Firms
                </button>
              )}
              
              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                  className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-xs md:text-sm font-medium touch-manipulation"
                >
                  <Download className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {exportDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setExportDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <button
                        onClick={() => {
                          handleExportCSV();
                          setExportDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg touch-manipulation"
                      >
                        <FileDown className="w-4 h-4" />
                        Export as CSV
                      </button>
                      <button
                        onClick={() => {
                          handleExportPDF();
                          setExportDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-b-lg touch-manipulation"
                      >
                        <FileText className="w-4 h-4" />
                        Export as PDF
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              {/* Comparison Mode Toggle */}
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm font-medium touch-manipulation ${
                  compareMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <GitCompare className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Compare</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <MetricCard
            title="PNL (Filtered)"
            value={displayPNL}
            subtitle={selectedFirms.length > 0 ? `${selectedFirms.length} firm(s) selected` : 'All firms'}
            icon={displayPNL >= 0 ? TrendingUp : TrendingDown}
            gradient={displayPNL >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600'}
            className={displayPNL >= 0 ? 'border-emerald-200' : 'border-red-200'}
          />
          <MetricCard
            title="Total Deposits"
            value={displayDeposits}
            subtitle={selectedFirms.length > 0 ? `${selectedFirms.length} firm(s)` : `From ${perFirmBreakdown.length} prop firms`}
            icon={DollarSign}
            gradient="from-emerald-400 to-emerald-500"
            className="border-emerald-200"
          />
          <MetricCard
            title="Total Fees"
            value={displayFees}
            subtitle={selectedFirms.length > 0 ? `${selectedFirms.length} firm(s)` : 'All firms'}
            icon={CreditCard}
            gradient="from-red-400 to-red-500"
            className="border-red-200"
          />
          <MetricCard
            title="Match Rate"
            value={`${Math.round(matchRate)}%`}
            subtitle={`${summary.matchedCount} of ${nonPendingTransactions} transactions`}
            icon={Activity}
            gradient="from-blue-400 to-blue-500"
            className="border-blue-200"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">Account Balance</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">Top Firm</div>
            <div className="text-lg font-semibold text-gray-900 truncate" title={perFirmBreakdown[0]?.firmName}>
              {perFirmBreakdown[0]?.firmName || 'N/A'}
            </div>
            {perFirmBreakdown[0] && (
              <div className="text-xs text-emerald-600 mt-1">
                {formatCurrency(perFirmBreakdown[0].netPNL)} net PNL
              </div>
            )}
          </div>
        </div>

        {/* Selected Firms Display */}
        {selectedFirms.length > 0 && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-900 mb-2">
                  Filtered by {selectedFirms.length} firm{selectedFirms.length > 1 ? 's' : ''}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedFirms.map(firmName => (
                    <button
                      key={firmName}
                      onClick={() => toggleFirm(firmName)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      {firmName}
                      <span className="ml-1">×</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedFirms([])}
                className="px-4 py-2 text-sm text-emerald-700 hover:text-emerald-900 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Comparison Mode UI */}
        {compareMode && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <GitCompare className="w-4 h-4" />
                Comparison Mode
              </h3>
              <button
                onClick={() => {
                  setCompareMode(false);
                  setCompareFirms([]);
                }}
                className="text-sm text-blue-700 hover:text-blue-900"
              >
                Close
              </button>
            </div>
            
            {/* Comparison Type Toggle */}
            <div className="flex bg-white rounded-lg p-1 gap-1 mb-4 border border-gray-200">
              <button
                onClick={() => setCompareType('time')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  compareType === 'time'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Time Periods
              </button>
              <button
                onClick={() => setCompareType('firm')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  compareType === 'firm'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Firms
              </button>
            </div>
            
            {compareType === 'time' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Period 1 (Current)</label>
                  <div className="text-sm text-gray-600 mb-2">
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </div>
                  <div className="text-xs text-gray-500">Uses date selector above</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Period 2 (Compare)</label>
                  <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={comparePeriodStartDate}
                      onChange={(e) => setComparePeriodStartDate(e.target.value)}
                      className="flex-1 border-none text-sm focus:outline-none"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="date"
                      value={comparePeriodEndDate}
                      onChange={(e) => setComparePeriodEndDate(e.target.value)}
                      className="flex-1 border-none text-sm focus:outline-none"
                    />
                  </div>
                  <div className="flex bg-gray-100 rounded-lg p-1 gap-1 text-xs">
                    <button
                      onClick={() => setCompareDatePreset('ytd')}
                      className="px-2 py-1 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700"
                    >
                      YTD
                    </button>
                    <button
                      onClick={() => setCompareDatePreset('last30')}
                      className="px-2 py-1 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700"
                    >
                      30D
                    </button>
                    <button
                      onClick={() => setCompareDatePreset('last90')}
                      className="px-2 py-1 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700"
                    >
                      90D
                    </button>
                    <button
                      onClick={() => setCompareDatePreset('all')}
                      className="px-2 py-1 text-xs font-medium rounded-md transition-colors hover:bg-white hover:shadow-sm text-gray-700"
                    >
                      All
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Select Firms to Compare</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {perFirmBreakdown.map(firm => {
                    const isSelected = compareFirms.includes(firm.firmName);
                    return (
                      <button
                        key={firm.firmName}
                        onClick={() => {
                          if (isSelected) {
                            setCompareFirms(compareFirms.filter(f => f !== firm.firmName));
                          } else {
                            setCompareFirms([...compareFirms, firm.firmName]);
                          }
                        }}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {firm.firmName}
                        {isSelected && <span className="ml-2">✓</span>}
                      </button>
                    );
                  })}
                </div>
                {compareFirms.length > 0 && (
                  <button
                    onClick={() => setCompareFirms([])}
                    className="text-xs text-blue-700 hover:text-blue-900 underline"
                  >
                    Clear Selection
                  </button>
                )}
                {compareFirms.length === 0 && (
                  <p className="text-sm text-gray-500">Select at least one firm to compare</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Main Content Tabs */}
        <TabbedSection
          tabs={['Overview', 'Monthly', 'Firms', 'Transactions', 'Performance', 'Activity', 'Efficiency', 'Compare']}
          activeTab={
            activeTab === 'overview' ? 'Overview' : 
            activeTab === 'monthly' ? 'Monthly' :
            activeTab === 'firms' ? 'Firms' :
            activeTab === 'transactions' ? 'Transactions' :
            activeTab === 'performance' ? 'Performance' : 
            activeTab === 'activity' ? 'Activity' : 
            activeTab === 'efficiency' ? 'Efficiency' : 
            'Compare'
          }
          onTabChange={(tab) => {
            const tabMap: Record<string, 'overview' | 'monthly' | 'firms' | 'transactions' | 'performance' | 'activity' | 'efficiency' | 'compare'> = {
              'Overview': 'overview',
              'Monthly': 'monthly',
              'Firms': 'firms',
              'Transactions': 'transactions',
              'Performance': 'performance',
              'Activity': 'activity',
              'Efficiency': 'efficiency',
              'Compare': 'compare',
            };
            setActiveTab(tabMap[tab] || 'overview');
          }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                  <div className="text-xs text-gray-600 mb-1">Total Purchases</div>
                  <div className="text-xl font-bold text-emerald-700">{tradingStats.activityStats.totalPurchases}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="text-xs text-gray-600 mb-1">Total Payouts</div>
                  <div className="text-xl font-bold text-blue-700">{tradingStats.activityStats.totalPayouts}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="text-xs text-gray-600 mb-1">Win Rate</div>
                  <div className="text-xl font-bold text-purple-700">{tradingStats.streakStats.winRate.toFixed(1)}%</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                  <div className="text-xs text-gray-600 mb-1">ROI</div>
                  <div className="text-xl font-bold text-amber-700">{tradingStats.roiStats.roi.toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <MonthlyPNLChart monthlyBreakdown={filteredMonthlyBreakdown} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Firms</h3>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <PerFirmChart perFirmBreakdown={filteredFirmBreakdown} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">PNL Trend</h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <PNLTrendChart monthlyBreakdown={filteredMonthlyBreakdown} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monthly' && (
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
          )}

          {activeTab === 'firms' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Firm Name</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Deposits</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Fees</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Net PNL</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Transactions</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Confidence</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Filter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {perFirmBreakdown.map((firm, i) => (
                      <tr 
                        key={i} 
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedFirms.includes(firm.firmName) ? 'bg-emerald-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900" title={firm.firmName}>
                          {firm.firmName}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-emerald-600">{formatCurrency(firm.deposits)}</td>
                        <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(firm.fees)}</td>
                        <td className={`px-4 py-3 text-sm text-right font-semibold ${
                          firm.netPNL >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(firm.netPNL)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-500">{firm.transactionCount}</td>
                        <td className="px-4 py-3 text-center">
                          <ConfidenceBadge confidence={firm.confidence} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleFirm(firm.firmName)}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                              selectedFirms.includes(firm.firmName)
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {selectedFirms.includes(firm.firmName) ? 'Filtered' : 'Filter'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {/* View Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setTransactionView('payouts')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      transactionView === 'payouts'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    Payouts
                  </button>
                  <button
                    onClick={() => setTransactionView('purchases')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      transactionView === 'purchases'
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    Purchases
                  </button>
                  <button
                    onClick={() => setTransactionView('needs-assignment')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors relative ${
                      transactionView === 'needs-assignment'
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    Needs Assignment
                    {needsAssignmentTransactions.length > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-700 text-white rounded-full">
                        {needsAssignmentTransactions.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setTransactionView('find-missing')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      transactionView === 'find-missing'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    Add Missing
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                    {(() => {
                      const filtered = transactionsWithAssignments.filter(txn => {
                        if (txn.pending) return false;
                        const matchesView = transactionView === 'payouts' 
                          ? txn.match.type === 'deposit'
                          : txn.match.type === 'fee';
                        const matchesDate = (() => {
                          const txnDate = new Date(txn.date);
                          const start = new Date(startDate);
                          const end = new Date(endDate);
                          return txnDate >= start && txnDate <= end;
                        })();
                        const matchesFirm = selectedFirms.length === 0 || 
                          (txn.match.firmName && selectedFirms.includes(txn.match.firmName));
                        return matchesView && matchesDate && matchesFirm;
                      });
                      return `${filtered.length} ${transactionView === 'payouts' ? 'payouts' : 'purchases'}`;
                    })()}
                </div>
              </div>
              
              {/* Needs Assignment View */}
              {transactionView === 'needs-assignment' ? (
                <div className="space-y-6">
                  {/* Bulk Actions Bar */}
                  {selectedTransactionIds.size > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-purple-900">
                          {selectedTransactionIds.size} transaction{selectedTransactionIds.size > 1 ? 's' : ''} selected
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTransactionIds(new Set())}
                          className="px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setBulkAssignModalOpen(true)}
                          className="px-4 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                        >
                          Assign Selected
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Transactions Needing Assignment Table */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            Transactions Needing Assignment
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Pattern-matched transactions and payment processors that need to be assigned to a specific prop firm.
                          </p>
                        </div>
                        {needsAssignmentTransactions.length > 0 && (
                          <button
                            onClick={() => {
                              if (selectedTransactionIds.size === needsAssignmentTransactions.length) {
                                setSelectedTransactionIds(new Set());
                              } else {
                                setSelectedTransactionIds(new Set(needsAssignmentTransactions.map(t => t.id)));
                              }
                            }}
                            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                          >
                            {selectedTransactionIds.size === needsAssignmentTransactions.length ? (
                              <>
                                <CheckSquare className="w-4 h-4" />
                                Deselect All
                              </>
                            ) : (
                              <>
                                <Square className="w-4 h-4" />
                                Select All
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 w-12">
                              <input
                                type="checkbox"
                                checked={needsAssignmentTransactions.length > 0 && selectedTransactionIds.size === needsAssignmentTransactions.length}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTransactionIds(new Set(needsAssignmentTransactions.map(t => t.id)));
                                  } else {
                                    setSelectedTransactionIds(new Set());
                                  }
                                }}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Deposits</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Withdrawals</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {needsAssignmentTransactions.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                No transactions need assignment. All pattern-matched transactions have been assigned.
                              </td>
                            </tr>
                          ) : (
                            needsAssignmentTransactions
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((txn) => {
                                const assignedFirm = manualAssignments[txn.id] || txn.match.firmName;
                                const isSelected = selectedTransactionIds.has(txn.id);
                                return (
                                  <tr key={txn.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-purple-50' : ''}`}>
                                    <td className="px-4 py-3 text-center">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                          const newSelected = new Set(selectedTransactionIds);
                                          if (e.target.checked) {
                                            newSelected.add(txn.id);
                                          } else {
                                            newSelected.delete(txn.id);
                                          }
                                          setSelectedTransactionIds(newSelected);
                                        }}
                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                      />
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{formatDate(txn.date)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 max-w-md truncate" title={txn.name}>
                                      {txn.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      {txn.match.type === 'unmatched' ? (
                                        <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                          Pattern Matched
                                        </span>
                                      ) : (
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                          txn.match.type === 'deposit'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                          {txn.match.type === 'deposit' ? 'Deposit' : 'Fee'}
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-emerald-600 font-semibold">
                                      {txn.isIncome ? formatCurrency(txn.amount) : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                                      {!txn.isIncome ? formatCurrency(txn.amount) : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <button
                                        onClick={() => {
                                          setSelectedTransactionForAssignment(txn.id);
                                          setCustomFirmName(assignedFirm || '');
                                          setAssignmentModalOpen(true);
                                        }}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors touch-manipulation"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                        {assignedFirm ? 'Edit' : 'Assign'}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : transactionView === 'find-missing' ? (
                /* Add Missing Matches View */
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Search className="w-5 h-5 text-purple-600" />
                          Add Missing Matches
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Search all unmatched transactions by amount and/or description to find prop-firm transactions that the algorithm didn't catch. Assign them to firms to include them in PNL calculations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 mb-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            step="0.01"
                            value={missingMatchSearchAmount}
                            onChange={(e) => {
                              setMissingMatchSearchAmount(e.target.value);
                              setHasSearched(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                searchMissingMatches();
                              }
                            }}
                            placeholder="Enter transaction amount (e.g., 1500.00)"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={missingMatchSearchDescription}
                            onChange={(e) => {
                              setMissingMatchSearchDescription(e.target.value);
                              setHasSearched(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                searchMissingMatches();
                              }
                            }}
                            placeholder="Enter description keywords (e.g., futures, funded)"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <button
                          onClick={searchMissingMatches}
                          disabled={!missingMatchSearchAmount && !missingMatchSearchDescription.trim()}
                          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 touch-manipulation"
                        >
                          <Search className="w-4 h-4" />
                          Search
                        </button>
                      </div>
                    </div>
                    
                    {(() => {
                      const allUnmatched = transactionsWithAssignments.filter(txn => 
                        !txn.pending && 
                        txn.match.type === 'unmatched'
                      );
                      return (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{allUnmatched.length}</span> unmatched transactions available to search
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Bulk Actions Bar for Search Results */}
                  {hasSearched && missingMatchSearchResults.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-purple-900">
                          {Array.from(selectedTransactionIds).filter(id => 
                            missingMatchSearchResults.some(r => r.transaction.id === id)
                          ).length} transaction{Array.from(selectedTransactionIds).filter(id => 
                            missingMatchSearchResults.some(r => r.transaction.id === id)
                          ).length !== 1 ? 's' : ''} selected
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const searchResultIds = new Set(missingMatchSearchResults.map(r => r.transaction.id));
                            const newSelected = new Set(selectedTransactionIds);
                            searchResultIds.forEach(id => newSelected.delete(id));
                            setSelectedTransactionIds(newSelected);
                          }}
                          className="px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
                        >
                          Clear Selection
                        </button>
                        {Array.from(selectedTransactionIds).some(id => 
                          missingMatchSearchResults.some(r => r.transaction.id === id)
                        ) && (
                          <button
                            onClick={() => setBulkAssignModalOpen(true)}
                            className="px-4 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                          >
                            Assign Selected
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Search Results Table */}
                  {hasSearched && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Search Results
                              {missingMatchSearchResults.length > 0 && ` (${missingMatchSearchResults.length})`}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {(() => {
                                const parts = [];
                                if (missingMatchSearchAmount) {
                                  parts.push(`Amount: ${formatCurrency(parseFloat(missingMatchSearchAmount))}`);
                                }
                                if (missingMatchSearchDescription.trim()) {
                                  parts.push(`Description: "${missingMatchSearchDescription.trim()}"`);
                                }
                                return parts.length > 0 ? parts.join(' • ') : 'Enter search criteria';
                              })()}
                            </p>
                          </div>
                          {missingMatchSearchResults.length > 0 && (
                            <button
                              onClick={() => {
                                const searchResultIds = new Set(missingMatchSearchResults.map(r => r.transaction.id));
                                if (Array.from(searchResultIds).every(id => selectedTransactionIds.has(id))) {
                                  const newSelected = new Set(selectedTransactionIds);
                                  searchResultIds.forEach(id => newSelected.delete(id));
                                  setSelectedTransactionIds(newSelected);
                                } else {
                                  const newSelected = new Set(selectedTransactionIds);
                                  searchResultIds.forEach(id => newSelected.add(id));
                                  setSelectedTransactionIds(newSelected);
                                }
                              }}
                              className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                            >
                              {Array.from(missingMatchSearchResults.map(r => r.transaction.id)).every(id => 
                                selectedTransactionIds.has(id)
                              ) ? (
                                <>
                                  <CheckSquare className="w-4 h-4" />
                                  Deselect All
                                </>
                              ) : (
                                <>
                                  <Square className="w-4 h-4" />
                                  Select All
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 w-12">
                                <input
                                  type="checkbox"
                                  checked={missingMatchSearchResults.length > 0 && missingMatchSearchResults.every(r => selectedTransactionIds.has(r.transaction.id))}
                                  onChange={(e) => {
                                    const searchResultIds = new Set(missingMatchSearchResults.map(r => r.transaction.id));
                                    const newSelected = new Set(selectedTransactionIds);
                                    if (e.target.checked) {
                                      searchResultIds.forEach(id => newSelected.add(id));
                                    } else {
                                      searchResultIds.forEach(id => newSelected.delete(id));
                                    }
                                    setSelectedTransactionIds(newSelected);
                                  }}
                                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Deposits</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Withdrawals</th>
                              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {missingMatchSearchResults.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                  {(() => {
                                    const parts = [];
                                    if (missingMatchSearchAmount) {
                                      parts.push(`amount ${formatCurrency(parseFloat(missingMatchSearchAmount))}`);
                                    }
                                    if (missingMatchSearchDescription.trim()) {
                                      parts.push(`description "${missingMatchSearchDescription.trim()}"`);
                                    }
                                    return parts.length > 0 
                                      ? `No unmatched transactions found matching ${parts.join(' and ')}`
                                      : 'Enter search criteria and click Search to find matching transactions';
                                  })()}
                                </td>
                              </tr>
                            ) : (
                              missingMatchSearchResults
                                .sort((a, b) => new Date(b.transaction.date).getTime() - new Date(a.transaction.date).getTime())
                                .map((result) => {
                                  const txn = result.transaction;
                                  const assignedFirm = manualAssignments[txn.id] || txn.match.firmName;
                                  const isSelected = selectedTransactionIds.has(txn.id);
                                  return (
                                    <tr key={txn.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-purple-50' : ''}`}>
                                      <td className="px-4 py-3 text-center">
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={(e) => {
                                            const newSelected = new Set(selectedTransactionIds);
                                            if (e.target.checked) {
                                              newSelected.add(txn.id);
                                            } else {
                                              newSelected.delete(txn.id);
                                            }
                                            setSelectedTransactionIds(newSelected);
                                          }}
                                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">{formatDate(txn.date)}</td>
                                      <td className="px-4 py-3 text-sm text-gray-900 max-w-md truncate" title={txn.name}>
                                        {txn.name}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-right text-emerald-600 font-semibold">
                                        {txn.isIncome ? formatCurrency(txn.amount) : '—'}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                                        {!txn.isIncome ? formatCurrency(txn.amount) : '—'}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <button
                                          onClick={() => {
                                            setSelectedTransactionForAssignment(txn.id);
                                            setCustomFirmName(assignedFirm || '');
                                            setAssignmentModalOpen(true);
                                          }}
                                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors touch-manipulation"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                          {assignedFirm ? 'Edit' : 'Assign'}
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Regular Payouts/Purchases Transactions Table */
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Firm</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Amount</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Confidence</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(() => {
                        const filteredTransactions = transactionsWithAssignments
                          .filter(txn => {
                            if (txn.pending) return false;
                            const matchesView = transactionView === 'payouts' 
                              ? txn.match.type === 'deposit'
                              : txn.match.type === 'fee';
                            const matchesDate = (() => {
                              const txnDate = new Date(txn.date);
                              const start = new Date(startDate);
                              const end = new Date(endDate);
                              return txnDate >= start && txnDate <= end;
                            })();
                            const matchesFirm = selectedFirms.length === 0 || 
                              (txn.match.firmName && selectedFirms.includes(txn.match.firmName));
                            return matchesView && matchesDate && matchesFirm;
                          })
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                        
                        if (filteredTransactions.length === 0) {
                          return (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                No {transactionView === 'payouts' ? 'payouts' : 'purchases'} found for the selected filters.
                              </td>
                            </tr>
                          );
                        }
                        
                        return filteredTransactions.map((txn) => {
                          const assignedFirm = manualAssignments[txn.id] || txn.match.firmName;
                          return (
                            <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-gray-900">{formatDate(txn.date)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 max-w-md truncate" title={txn.name}>
                                {txn.name}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {assignedFirm ? (
                                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                    {assignedFirm}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-xs">Unassigned</span>
                                )}
                              </td>
                              <td className={`px-4 py-3 text-sm text-right font-semibold ${
                                transactionView === 'payouts' ? 'text-emerald-600' : 'text-red-600'
                              }`}>
                                {formatCurrency(txn.amount)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <ConfidenceBadge confidence={txn.match.confidence} />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => {
                                    setSelectedTransactionForAssignment(txn.id);
                                    setCustomFirmName(assignedFirm || '');
                                    setAssignmentModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors touch-manipulation"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  {assignedFirm ? 'Edit' : 'Assign'}
                                </button>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <DailyPNLCalendar 
                dailyPNL={tradingStats.dailyPNL} 
                selectedMonth={calendarMonth}
                onMonthChange={setCalendarMonth}
              />
              
              <BestWorstModule stats={tradingStats.bestWorstStats} />
              
              <StreakModule stats={tradingStats.streakStats} />
              
              <DayOfWeekPatternsModule stats={tradingStats.dayOfWeekStats} />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <ActivityStatsModule stats={tradingStats.activityStats} />
              
              <PurchaseFrequencyModule stats={tradingStats.purchaseFrequencyStats} />
              
              <PayoutPerformanceModule stats={tradingStats.payoutPerformanceStats} />
            </div>
          )}

          {activeTab === 'efficiency' && (
            <div className="space-y-6">
              <ROIModule stats={tradingStats.roiStats} />
              
              <GrowthTrendsModule stats={tradingStats.growthTrends} />
              
              <FirmComparisonModule stats={tradingStats.firmComparisonStats} />
            </div>
          )}

          {/* Missing Match Results Modal - Global modal accessible from Needs Assignment tab */}
          {matchingViewOpen && missingMatchSearchResults.length > 0 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Match Transactions</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Found {missingMatchSearchResults.length} transaction{missingMatchSearchResults.length > 1 ? 's' : ''} matching ${missingMatchSearchAmount}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setMatchingViewOpen(false);
                      setMissingMatchSearchResults([]);
                      setSelectedUnmatchedTransaction(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {missingMatchSearchResults.map((result, idx) => {
                      const isSelected = selectedUnmatchedTransaction === result.transaction.id;
                      return (
                        <div key={result.transaction.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-purple-600' : 'bg-gray-300'}`} />
                                <div>
                                  <div className="font-medium text-gray-900">Transaction #{idx + 1}</div>
                                  <div className="text-sm text-gray-600">{formatDate(result.transaction.date)}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">{formatCurrency(result.transaction.amount)}</div>
                                <div className="text-xs text-gray-500">{result.transaction.isIncome ? 'Deposit' : 'Withdrawal'}</div>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-700 truncate" title={result.transaction.name}>
                              {result.transaction.name}
                            </div>
                          </div>
                          
                          <div className="p-4">
                            {!isSelected ? (
                              <button
                                onClick={() => setSelectedUnmatchedTransaction(result.transaction.id)}
                                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 touch-manipulation"
                              >
                                <Link2 className="w-4 h-4" />
                                Assign to Prop Firm
                              </button>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-purple-600">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Select a firm to assign this transaction</span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Select Existing Firm
                                    </label>
                                    <select
                                      value={manualAssignments[result.transaction.id] && perFirmBreakdown.some(f => f.firmName === manualAssignments[result.transaction.id]) ? manualAssignments[result.transaction.id] : ''}
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          saveManualAssignment(result.transaction.id, e.target.value);
                                          setSelectedUnmatchedTransaction(null);
                                        }
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                      <option value="">Choose a firm...</option>
                                      {perFirmBreakdown.map(firm => (
                                        <option key={firm.firmName} value={firm.firmName}>
                                          {firm.firmName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Or Enter Custom Firm Name
                                    </label>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={manualAssignments[result.transaction.id] && !perFirmBreakdown.some(f => f.firmName === manualAssignments[result.transaction.id]) ? manualAssignments[result.transaction.id] : ''}
                                        onChange={(e) => {
                                          if (e.target.value.trim()) {
                                            saveManualAssignment(result.transaction.id, e.target.value.trim());
                                            setSelectedUnmatchedTransaction(null);
                                          }
                                        }}
                                        placeholder="Enter firm name..."
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                      />
                                      <button
                                        onClick={() => setSelectedUnmatchedTransaction(null)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                
                                {manualAssignments[result.transaction.id] && (
                                  <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        <span className="text-sm font-medium text-emerald-900">
                                          Assigned to: {manualAssignments[result.transaction.id]}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => {
                                          removeManualAssignment(result.transaction.id);
                                          setSelectedUnmatchedTransaction(null);
                                        }}
                                        className="text-xs text-emerald-700 hover:text-emerald-900 underline"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      setMatchingViewOpen(false);
                      setMissingMatchSearchResults([]);
                      setSelectedUnmatchedTransaction(null);
                      setMissingMatchSearchAmount('');
                      setMissingMatchSearchDescription('');
                      setHasSearched(false);
                    }}
                    className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium touch-manipulation"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="space-y-6">
              {!compareMode ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                  <GitCompare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enable Comparison Mode</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Toggle comparison mode in the header to compare time periods or firms side-by-side.
                  </p>
                  <button
                    onClick={() => setCompareMode(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Enable Comparison Mode
                  </button>
                </div>
              ) : compareType === 'time' && comparisonData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Period 1</h3>
                    <div className="text-sm text-gray-600 mb-4">{formatDate(startDate)} - {formatDate(endDate)}</div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net PNL:</span>
                        <span className={`font-semibold ${displayPNL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatCurrency(displayPNL)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deposits:</span>
                        <span className="font-semibold text-emerald-600">{formatCurrency(displayDeposits)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fees:</span>
                        <span className="font-semibold text-red-600">{formatCurrency(displayFees)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Period 2</h3>
                    <div className="text-sm text-gray-600 mb-4">{formatDate(comparePeriodStartDate)} - {formatDate(comparePeriodEndDate)}</div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net PNL:</span>
                        <span className={`font-semibold ${comparisonData.netPNL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatCurrency(comparisonData.netPNL)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deposits:</span>
                        <span className="font-semibold text-emerald-600">{formatCurrency(comparisonData.deposits)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fees:</span>
                        <span className="font-semibold text-red-600">{formatCurrency(comparisonData.fees)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">PNL Difference</div>
                        <div className={`text-xl font-bold ${(displayPNL - comparisonData.netPNL) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatCurrency(displayPNL - comparisonData.netPNL)}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Deposits Change</div>
                        <div className={`text-xl font-bold ${(displayDeposits - comparisonData.deposits) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatCurrency(displayDeposits - comparisonData.deposits)}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Fees Change</div>
                        <div className={`text-xl font-bold ${(displayFees - comparisonData.fees) >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {formatCurrency(displayFees - comparisonData.fees)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : compareType === 'time' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-amber-800">Please select both start and end dates for Period 2 to compare.</p>
                </div>
              ) : compareType === 'firm' && firmComparisonData && firmComparisonData.length > 0 ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Firm Comparison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {firmComparisonData.map((firm, idx) => (
                        <div key={firm.firmName} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 truncate" title={firm.firmName}>
                              {firm.firmName}
                            </h4>
                            <ConfidenceBadge confidence={firm.confidence} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Net PNL:</span>
                              <span className={`text-sm font-semibold ${firm.netPNL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {formatCurrency(firm.netPNL)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Deposits:</span>
                              <span className="text-sm font-medium text-emerald-600">{formatCurrency(firm.deposits)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Fees:</span>
                              <span className="text-sm font-medium text-red-600">{formatCurrency(firm.fees)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Transactions:</span>
                              <span className="text-sm font-medium text-gray-900">{firm.transactionCount}</span>
                            </div>
                            {firm.fees > 0 && (
                              <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="text-sm text-gray-600">ROI:</span>
                                <span className="text-sm font-medium text-blue-600">
                                  {((firm.netPNL / firm.fees) * 100).toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Comparison Summary */}
                    {firmComparisonData.length >= 2 && (
                      <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Comparison Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Best PNL</div>
                            <div className="text-lg font-bold text-emerald-600">
                              {firmComparisonData.reduce((best, firm) => 
                                firm.netPNL > best.netPNL ? firm : best
                              ).firmName}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatCurrency(Math.max(...firmComparisonData.map(f => f.netPNL)))}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Best ROI</div>
                            <div className="text-lg font-bold text-blue-600">
                              {firmComparisonData
                                .filter(f => f.fees > 0)
                                .reduce((best, firm) => {
                                  const bestROI = (best.netPNL / best.fees) * 100;
                                  const firmROI = (firm.netPNL / firm.fees) * 100;
                                  return firmROI > bestROI ? firm : best;
                                }, firmComparisonData.find(f => f.fees > 0) || firmComparisonData[0]).firmName}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {(() => {
                                const bestROIFirm = firmComparisonData
                                  .filter(f => f.fees > 0)
                                  .reduce((best, firm) => {
                                    const bestROI = (best.netPNL / best.fees) * 100;
                                    const firmROI = (firm.netPNL / firm.fees) * 100;
                                    return firmROI > bestROI ? firm : best;
                                  }, firmComparisonData.find(f => f.fees > 0) || firmComparisonData[0]);
                                return `${((bestROIFirm.netPNL / bestROIFirm.fees) * 100).toFixed(1)}%`;
                              })()}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-600 mb-1">Most Active</div>
                            <div className="text-lg font-bold text-gray-900">
                              {firmComparisonData.reduce((most, firm) => 
                                firm.transactionCount > most.transactionCount ? firm : most
                              ).firmName}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {Math.max(...firmComparisonData.map(f => f.transactionCount))} transactions
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-amber-800">Please select at least one firm to compare.</p>
                </div>
              )}
            </div>
          )}
        </TabbedSection>

        {/* Assignment Modal - Available from all tabs */}
        {assignmentModalOpen && selectedTransactionForAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Assign to Prop Firm</h3>
                <button
                  onClick={() => {
                    setAssignmentModalOpen(false);
                    setSelectedTransactionForAssignment(null);
                    setCustomFirmName('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {(() => {
                const txn = transactions.find(t => t.id === selectedTransactionForAssignment);
                if (!txn) return null;
                
                const currentFirm = manualAssignments[selectedTransactionForAssignment] || txn.match.firmName || '';
                const isExistingFirm = currentFirm && perFirmBreakdown.some(f => f.firmName === currentFirm);
                const displayFirmName = customFirmName || currentFirm;
                
                return (
                  <>
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Transaction</div>
                      <div className="text-sm font-medium text-gray-900">{txn.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(txn.date)} • {formatCurrency(txn.amount)}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Existing Firm
                      </label>
                      <select
                        value={isExistingFirm ? displayFirmName : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            setCustomFirmName(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Choose a firm...</option>
                        {perFirmBreakdown.map(firm => (
                          <option key={firm.firmName} value={firm.firmName}>
                            {firm.firmName}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or Enter Custom Firm Name
                      </label>
                      <input
                        type="text"
                        value={!isExistingFirm ? displayFirmName : ''}
                        onChange={(e) => setCustomFirmName(e.target.value)}
                        placeholder="Enter firm name..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (customFirmName.trim()) {
                            saveManualAssignment(selectedTransactionForAssignment, customFirmName.trim());
                            setAssignmentModalOpen(false);
                            setSelectedTransactionForAssignment(null);
                            setCustomFirmName('');
                          }
                        }}
                        disabled={!customFirmName.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed touch-manipulation"
                      >
                        <Save className="w-4 h-4" />
                        Save Assignment
                      </button>
                      {manualAssignments[selectedTransactionForAssignment] && (
                        <button
                          onClick={() => {
                            removeManualAssignment(selectedTransactionForAssignment);
                            setAssignmentModalOpen(false);
                            setSelectedTransactionForAssignment(null);
                            setCustomFirmName('');
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors touch-manipulation"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Bulk Assign Modal */}
        {bulkAssignModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Assign {selectedTransactionIds.size} Transaction{selectedTransactionIds.size > 1 ? 's' : ''}
                  </h2>
                  <button
                    onClick={() => {
                      setBulkAssignModalOpen(false);
                      setBulkAssignFirmName('');
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Firm Name
                  </label>
                  <input
                    type="text"
                    value={bulkAssignFirmName}
                    onChange={(e) => setBulkAssignFirmName(e.target.value)}
                    placeholder="Enter firm name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && bulkAssignFirmName.trim()) {
                        handleBulkAssign();
                      }
                    }}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Select from existing firms or enter a new firm name
                  </p>
                </div>
                
                {allFirmNames.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or select existing firm:
                    </label>
                    <select
                      value={bulkAssignFirmName}
                      onChange={(e) => setBulkAssignFirmName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select a firm...</option>
                      {allFirmNames.map(firm => (
                        <option key={firm} value={firm}>{firm}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setBulkAssignModalOpen(false);
                    setBulkAssignFirmName('');
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAssign}
                  disabled={!bulkAssignFirmName.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Assign All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p className="mb-1">
            Report generated {formatDate(pnlData.generatedAt)} • Prop Firm PNL Tracker
          </p>
          <p>
            This dashboard is for informational purposes only and should not be used as the sole basis for financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
}