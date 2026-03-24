'use client';

import { useState } from 'react';
import { getAllInPrice, getEvalPrice, getActivationFee, hasEvalDiscount, hasActivationDiscount, getFundedValue, type FirmAccount } from '@/lib/firms';
import { PromoCodeBadge } from '@/components/PromoCodeBadge';

function formatMoney(n: number): string {
  return '$' + n.toLocaleString();
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'profit' }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-mono px-2 py-0.5 rounded border ${
        variant === 'profit'
          ? 'bg-profit/10 border-profit/20 text-profit'
          : 'bg-terminal-bg border-terminal-border text-terminal-muted'
      }`}
    >
      {children}
    </span>
  );
}

// ─── Eval columns ───
// Price, Profit Target, Max Drawdown (+ type), DLL, Min Days, Consistency, Max Contracts, Reset Cost

function EvalView({ accounts }: { accounts: FirmAccount[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-terminal-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-terminal-border bg-terminal-card">
            <th className="text-left text-terminal-muted font-mono font-medium px-4 py-3 whitespace-nowrap">Plan</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Size</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Eval Price</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Activation</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Profit Target</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Max Drawdown</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Split</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">DLL</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Min Days</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Consistency</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Max Contracts</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Reset Cost</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a, i) => (
            <tr
              key={a.id}
              className={`border-b border-terminal-border last:border-0 ${
                i % 2 === 0 ? 'bg-terminal-bg' : 'bg-terminal-card/50'
              }`}
            >
              <td className="px-4 py-3">
                <span className="text-terminal-text font-medium">{a.plan_name}</span>
                <span className="block text-[10px] text-terminal-muted">{a.account_type}</span>
              </td>
              <td className="px-3 py-3 text-center font-mono text-terminal-text">{a.size_label}</td>
              <td className="px-3 py-3 text-center font-mono">
                {hasEvalDiscount(a) ? (
                  <>
                    <span className="text-terminal-muted line-through text-xs">{formatMoney(a.price ?? 0)}</span>
                    <span className="text-profit font-medium ml-1">{formatMoney(getEvalPrice(a))}</span>
                    {a.promo_code && (
                      <div className="mt-1"><PromoCodeBadge code={a.promo_code} /></div>
                    )}
                  </>
                ) : (
                  <span className="text-profit font-medium">{formatMoney(a.price ?? 0)}</span>
                )}
              </td>
              <td className="px-3 py-3 text-center font-mono">
                {(a.activation_fee ?? 0) === 0 && !hasActivationDiscount(a) ? (
                  <span className="text-profit font-medium">Free</span>
                ) : hasActivationDiscount(a) ? (
                  <>
                    <span className="text-terminal-muted line-through text-xs">{formatMoney(a.activation_fee ?? 0)}</span>
                    <span className="text-profit font-medium ml-1">
                      {getActivationFee(a) === 0 ? 'Free' : formatMoney(getActivationFee(a))}
                    </span>
                  </>
                ) : (
                  <span className="text-terminal-text">{formatMoney(a.activation_fee ?? 0)}</span>
                )}
              </td>
              <td className="px-3 py-3 text-center font-mono text-terminal-text">
                {a.profit_target ? formatMoney(a.profit_target) : '—'}
              </td>
              <td className="px-3 py-3 text-center font-mono text-sm">
                <div className="text-terminal-text">
                  {a.max_drawdown ? formatMoney(a.max_drawdown) : '—'}
                </div>
                {a.drawdown_type && (
                  <span className={`text-[10px] font-mono ${a.drawdown_type === 'EOD' ? 'text-profit' : 'text-accent-amber'}`}>
                    {a.drawdown_type}
                  </span>
                )}
              </td>
              <td className="px-3 py-3 text-center font-mono text-profit">
                {a.profit_split ?? '—'}
              </td>
              <td className="px-3 py-3 text-center font-mono text-terminal-text">
                {a.daily_loss_limit ? formatMoney(a.daily_loss_limit) : '—'}
              </td>
              <td className="px-3 py-3 text-center font-mono text-terminal-text">
                {a.min_days_to_pass ?? '—'}
              </td>
              <td className="px-3 py-3 text-center font-mono text-sm">
                {a.consistency_rule && a.consistency_rule.toLowerCase() !== 'none' ? (
                  <span className="text-accent-amber">{a.consistency_rule}</span>
                ) : (
                  <span className="text-profit">None</span>
                )}
              </td>
              <td className="px-3 py-3 text-center font-mono text-terminal-text">
                {a.max_contract_size ?? '—'}
              </td>
              <td className="px-3 py-3 text-center font-mono text-terminal-text">
                {a.reset_cost ? formatMoney(a.reset_cost) : 'Free'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Funded columns ───
// Drawdown Mode, Consistency, Max Contracts, Scaling Rule, Min Profit/Day, Max Payout, Days to Payout

function FundedView({ accounts }: { accounts: FirmAccount[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-terminal-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-terminal-border bg-terminal-card">
            <th className="text-left text-terminal-muted font-mono font-medium px-4 py-3 whitespace-nowrap">Plan</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Size</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Drawdown Mode</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Consistency</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Max Contracts</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Split</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Scaling Rule</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Min Profit/Day</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Max Payout</th>
            <th className="text-center text-terminal-muted font-mono font-medium px-3 py-3 whitespace-nowrap">Days to Payout</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a, i) => {
            const ddType = getFundedValue(a, 'drawdown_type', 'funded_drawdown_type') as string | null;
            const consistency = getFundedValue(a, 'consistency_rule', 'funded_consistency_rule') as string | null;
            const maxContracts = getFundedValue(a, 'max_contract_size', 'funded_max_contract_size') as string | null;
            const split = getFundedValue(a, 'profit_split', 'funded_profit_split') as string | null;
            const scalingRule = getFundedValue(a, 'scaling_rule', 'funded_scaling_rule') as string | null;

            return (
              <tr
                key={a.id}
                className={`border-b border-terminal-border last:border-0 ${
                  i % 2 === 0 ? 'bg-terminal-bg' : 'bg-terminal-card/50'
                }`}
              >
                <td className="px-4 py-3">
                  <span className="text-terminal-text font-medium">{a.plan_name}</span>
                  <span className="block text-[10px] text-terminal-muted">{a.account_type}</span>
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">{a.size_label}</td>
                <td className="px-3 py-3 text-center">
                  {ddType ? (
                    <Badge variant={a.funded_drawdown_type ? 'profit' : 'default'}>{ddType}</Badge>
                  ) : (
                    <span className="text-terminal-muted text-xs">—</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center font-mono text-sm">
                  {consistency && consistency.toLowerCase() !== 'none' ? (
                    <span className="text-accent-amber">{consistency}</span>
                  ) : (
                    <span className="text-profit">None</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text text-sm">
                  {maxContracts ?? '—'}
                </td>
                <td className="px-3 py-3 text-center font-mono text-profit text-sm">
                  {split ?? '—'}
                </td>
                <td className="px-3 py-3 text-center text-sm">
                  {scalingRule ? (
                    <span className="text-terminal-text">{scalingRule}</span>
                  ) : (
                    <span className="text-terminal-muted">—</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {a.min_profit_per_day ? formatMoney(a.min_profit_per_day) : '—'}
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {a.max_payout_amount ? formatMoney(a.max_payout_amount) : '—'}
                </td>
                <td className="px-3 py-3 text-center font-mono text-terminal-text">
                  {a.days_to_payout ? `${a.days_to_payout} day${a.days_to_payout > 1 ? 's' : ''}` : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Mobile card view ───

function MobileCard({ account, phase }: { account: FirmAccount; phase: 'eval' | 'funded' }) {
  if (phase === 'eval') {
    return (
      <div className="bg-terminal-card rounded-lg border border-terminal-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-terminal-text font-medium text-sm">{account.plan_name}</span>
            <span className="block text-[10px] text-terminal-muted">{account.size_label}</span>
          </div>
          <div className="text-right">
            {hasEvalDiscount(account) ? (
              <>
                <span className="font-mono text-terminal-muted line-through text-xs">{formatMoney(account.price ?? 0)}</span>
                <span className="font-mono text-profit font-medium text-sm ml-1">{formatMoney(getEvalPrice(account))}</span>
                {account.promo_code && (
                  <span className="block text-[10px] text-profit">{account.promo_code}</span>
                )}
              </>
            ) : (
              <span className="font-mono text-profit font-medium text-sm">{formatMoney(account.price ?? 0)}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-terminal-bg rounded px-3 py-2">
            <span className="text-terminal-muted block mb-0.5">Activation</span>
            <span className="font-mono text-terminal-text">
              {(account.activation_fee ?? 0) === 0 && !hasActivationDiscount(account)
                ? 'Free'
                : hasActivationDiscount(account)
                  ? <><span className="line-through text-terminal-muted">{formatMoney(account.activation_fee ?? 0)}</span> <span className="text-profit">{getActivationFee(account) === 0 ? 'Free' : formatMoney(getActivationFee(account))}</span></>
                  : formatMoney(account.activation_fee ?? 0)
              }
            </span>
          </div>
          <div className="bg-terminal-bg rounded px-3 py-2">
            <span className="text-terminal-muted block mb-0.5">Profit Target</span>
            <span className="font-mono text-terminal-text">{account.profit_target ? formatMoney(account.profit_target) : '—'}</span>
          </div>
          <div className="bg-terminal-bg rounded px-3 py-2">
            <span className="text-terminal-muted block mb-0.5">Max DD</span>
            <span className="font-mono text-terminal-text">{account.max_drawdown ? formatMoney(account.max_drawdown) : '—'}</span>
            {account.drawdown_type && (
              <span className={`block text-[10px] font-mono ${account.drawdown_type === 'EOD' ? 'text-profit' : 'text-accent-amber'}`}>
                {account.drawdown_type}
              </span>
            )}
          </div>
          <div className="bg-terminal-bg rounded px-3 py-2">
            <span className="text-terminal-muted block mb-0.5">DLL</span>
            <span className="font-mono text-terminal-text">{account.daily_loss_limit ? formatMoney(account.daily_loss_limit) : '—'}</span>
          </div>
          <div className="bg-terminal-bg rounded px-3 py-2">
            <span className="text-terminal-muted block mb-0.5">Min Days</span>
            <span className="font-mono text-terminal-text">{account.min_days_to_pass ?? '—'}</span>
          </div>
          <div className="bg-terminal-bg rounded px-3 py-2">
            <span className="text-terminal-muted block mb-0.5">Consistency</span>
            <span className="font-mono text-terminal-text text-[11px]">
              {account.consistency_rule && account.consistency_rule.toLowerCase() !== 'none'
                ? account.consistency_rule
                : 'None'}
            </span>
          </div>
          <div className="bg-terminal-bg rounded px-3 py-2">
            <span className="text-terminal-muted block mb-0.5">Max Contracts</span>
            <span className="font-mono text-terminal-text">{account.max_contract_size ?? '—'}</span>
          </div>
          {account.promo_code && (
            <div className="bg-accent-amber/5 rounded px-3 py-2 col-span-2 flex items-center justify-between">
              <span className="text-terminal-muted text-xs">Promo Code</span>
              <PromoCodeBadge code={account.promo_code} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Funded phase
  const ddType = getFundedValue(account, 'drawdown_type', 'funded_drawdown_type') as string | null;
  const consistency = getFundedValue(account, 'consistency_rule', 'funded_consistency_rule') as string | null;
  const maxContracts = getFundedValue(account, 'max_contract_size', 'funded_max_contract_size') as string | null;
  const scalingRule = getFundedValue(account, 'scaling_rule', 'funded_scaling_rule') as string | null;

  return (
    <div className="bg-terminal-card rounded-lg border border-terminal-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-terminal-text font-medium text-sm">{account.plan_name}</span>
          <span className="block text-[10px] text-terminal-muted">{account.size_label}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-terminal-bg rounded px-3 py-2">
          <span className="text-terminal-muted block mb-0.5">Drawdown Mode</span>
          <span className="font-mono text-terminal-text">{ddType ?? '—'}</span>
        </div>
        <div className="bg-terminal-bg rounded px-3 py-2">
          <span className="text-terminal-muted block mb-0.5">Consistency</span>
          <span className="font-mono text-terminal-text text-[11px]">
            {consistency && consistency.toLowerCase() !== 'none' ? consistency : 'None'}
          </span>
        </div>
        <div className="bg-terminal-bg rounded px-3 py-2">
          <span className="text-terminal-muted block mb-0.5">Max Contracts</span>
          <span className="font-mono text-terminal-text">{maxContracts ?? '—'}</span>
        </div>
        <div className="bg-terminal-bg rounded px-3 py-2">
          <span className="text-terminal-muted block mb-0.5">Scaling</span>
          <span className="font-mono text-terminal-text">{scalingRule ?? '—'}</span>
        </div>
        <div className="bg-terminal-bg rounded px-3 py-2">
          <span className="text-terminal-muted block mb-0.5">Min Profit/Day</span>
          <span className="font-mono text-terminal-text">{account.min_profit_per_day ? formatMoney(account.min_profit_per_day) : '—'}</span>
        </div>
        <div className="bg-terminal-bg rounded px-3 py-2">
          <span className="text-terminal-muted block mb-0.5">Days to Payout</span>
          <span className="font-mono text-terminal-text">{account.days_to_payout ? `${account.days_to_payout}d` : '—'}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main tabbed component ───

export function AccountTable({ accounts }: { accounts: FirmAccount[] }) {
  const [phase, setPhase] = useState<'eval' | 'funded'>('eval');

  if (accounts.length === 0) return null;

  return (
    <div>
      {/* Tab selector */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center rounded-lg border border-terminal-border overflow-hidden">
          <button
            onClick={() => setPhase('eval')}
            className={`px-4 py-2 text-sm font-mono font-medium transition-colors ${
              phase === 'eval'
                ? 'bg-profit text-white'
                : 'text-terminal-muted hover:text-terminal-text'
            }`}
          >
            Evaluation
          </button>
          <button
            onClick={() => setPhase('funded')}
            className={`px-4 py-2 text-sm font-mono font-medium transition-colors border-l border-terminal-border ${
              phase === 'funded'
                ? 'bg-profit text-white'
                : 'text-terminal-muted hover:text-terminal-text'
            }`}
          >
            Funded
          </button>
        </div>
        <p className="text-xs text-terminal-muted hidden sm:block">
          {phase === 'eval'
            ? 'Rules and pricing during the evaluation / challenge phase.'
            : 'Rules and payout details once you are funded.'}
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block">
        {phase === 'eval' ? (
          <EvalView accounts={accounts} />
        ) : (
          <FundedView accounts={accounts} />
        )}
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {accounts.map((a) => (
          <MobileCard key={a.id} account={a} phase={phase} />
        ))}
      </div>
    </div>
  );
}
