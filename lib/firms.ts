// ============================================================
// Prop Firm Types & Helpers
// Safe to import from both server and client components
// ============================================================

// ---------- TYPES ----------

export interface Firm {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  rating: number | null;
  category: 'futures' | 'forex' | 'crypto' | 'multi';

  // Company info
  founders: string | null;
  country: string | null;
  founded_year: number | null;

  // Allocation limits
  max_funded_accounts: number | null;
  max_funded_allocation: string | null;

  // Platforms
  platforms: string[];

  // Payout info
  payout_methods: string[];
  payout_frequency: string | null;
  profit_split_note: string | null;

  // Support
  support_email: string | null;
  support_discord: string | null;
  support_help_url: string | null;
  support_live_chat: boolean;

  // Firm-wide rules
  inactivity_rule: string | null;
  copy_trading: string | null;
  max_before_live: string | null;
  clear_path_to_live: string | null;

  // Meta
  is_active: boolean;
  last_verified: string | null;
  created_at: string;
  updated_at: string;
}

export interface FirmAccount {
  id: string;
  firm_id: string;

  // Plan identification
  plan_name: string;
  account_type: 'evaluation' | 'funded' | 'instant' | 'direct';
  size: number;
  size_label: string;

  // Pricing
  price: number | null;
  activation_fee: number;
  reset_cost: number | null;

  // Eval-phase targets & limits
  profit_target: number | null;
  max_drawdown: number | null;
  drawdown_type: 'EOD' | 'Trailing' | 'Static' | 'Intraday' | 'RealTime' | null;
  daily_loss_limit: number | null;
  max_contract_size: string | null;

  // Eval-phase profit split
  profit_split: string | null;

  // Eval-phase rules
  consistency_rule: string | null;
  scaling_rule: string | null;
  micro_scaling: string | null;

  // Funded-phase rules (NULL = same as eval)
  funded_max_drawdown: number | null;
  funded_drawdown_type: 'EOD' | 'Trailing' | 'Static' | 'Intraday' | 'RealTime' | null;
  funded_daily_loss_limit: number | null;
  funded_max_contract_size: string | null;
  funded_consistency_rule: string | null;
  funded_scaling_rule: string | null;
  funded_profit_split: string | null;

  // Payout details (per-plan)
  min_payout_amount: number | null;
  max_payout_amount: number | null;
  payout_buffer: number | null;
  requestable_profit_pct: number | null;
  min_profit_per_day: number | null;
  days_to_payout: number | null;
  payout_frequency_note: string | null;

  // Time rules
  min_days_to_pass: number | null;
  min_days_for_payout: number | null;

  // Trading rules (account-specific)
  news_trading: string | null;
  algorithmic_trading: string | null;
  scalping_rules: string | null;

  // Discounts & promos
  eval_discount_pct: number | null;
  eval_discount_amount: number | null;
  activation_discount_pct: number | null;
  activation_discount_amount: number | null;
  promo_code: string | null;
  promo_expires: string | null;

  // Display
  sort_order: number;

  // Meta
  is_active: boolean;
  last_verified: string | null;
  created_at: string;
  updated_at: string;
}

/** Firm with its accounts joined */
export interface FirmWithAccounts extends Firm {
  firm_accounts: FirmAccount[];
}

// ---------- HELPERS ----------

export function getCategoryLabel(category: Firm['category']): string {
  switch (category) {
    case 'futures':
      return 'Futures';
    case 'forex':
      return 'Forex';
    case 'crypto':
      return 'Crypto';
    case 'multi':
      return 'Multi-Asset';
  }
}

export function getAllInPrice(account: FirmAccount): number {
  return (account.price ?? 0) + (account.activation_fee ?? 0);
}

/** Get discounted eval price (or original if no discount) */
export function getEvalPrice(account: FirmAccount): number {
  const base = account.price ?? 0;
  if (account.eval_discount_pct) return Math.round(base * (1 - account.eval_discount_pct / 100));
  if (account.eval_discount_amount) return Math.max(0, base - account.eval_discount_amount);
  return base;
}

/** Get discounted activation fee (or original if no discount) */
export function getActivationFee(account: FirmAccount): number {
  const base = account.activation_fee ?? 0;
  if (account.activation_discount_pct) return Math.round(base * (1 - account.activation_discount_pct / 100));
  if (account.activation_discount_amount) return Math.max(0, base - account.activation_discount_amount);
  return base;
}

/** Check if account has any active discount */
export function hasDiscount(account: FirmAccount): boolean {
  return !!(account.eval_discount_pct || account.eval_discount_amount ||
            account.activation_discount_pct || account.activation_discount_amount);
}

/** Check if eval price specifically is discounted */
export function hasEvalDiscount(account: FirmAccount): boolean {
  return !!(account.eval_discount_pct || account.eval_discount_amount);
}

/** Check if activation fee is discounted */
export function hasActivationDiscount(account: FirmAccount): boolean {
  return !!(account.activation_discount_pct || account.activation_discount_amount);
}

export function getPDRatio(account: FirmAccount): number | null {
  if (!account.profit_target || !account.max_drawdown || account.max_drawdown === 0) return null;
  return Math.round((account.profit_target / account.max_drawdown) * 100) / 100;
}

/** Get funded-phase value, falling back to eval if NULL */
export function getFundedValue<K extends keyof FirmAccount>(
  account: FirmAccount,
  evalKey: K,
  fundedKey: keyof FirmAccount
): FirmAccount[K] {
  const funded = account[fundedKey];
  if (funded !== null && funded !== undefined) return funded as FirmAccount[K];
  return account[evalKey];
}

/** Check if funded rules differ from eval for a given account */
export function hasFundedDifferences(account: FirmAccount): boolean {
  return (
    account.funded_max_drawdown !== null ||
    account.funded_drawdown_type !== null ||
    account.funded_daily_loss_limit !== null ||
    account.funded_max_contract_size !== null ||
    account.funded_consistency_rule !== null ||
    account.funded_scaling_rule !== null ||
    account.funded_profit_split !== null
  );
}
