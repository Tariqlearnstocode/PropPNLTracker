-- ============================================================
-- Add funded-phase rules and payout detail columns
--
-- The existing columns (profit_target, max_drawdown, drawdown_type,
-- daily_loss_limit, max_contract_size, consistency_rule, etc.)
-- represent EVALUATION rules.
--
-- Funded-phase rules often differ (e.g. MFFU Rapid: EOD eval →
-- RealTime funded, consistency rule in eval but not funded).
--
-- If a funded_* column is NULL, it means "same as eval."
-- ============================================================

-- ---------- FUNDED-PHASE RULES ----------

ALTER TABLE public.firm_accounts
  ADD COLUMN funded_max_drawdown      numeric(10,2),
  ADD COLUMN funded_drawdown_type     text CHECK (funded_drawdown_type IN ('EOD', 'Trailing', 'Static', 'Intraday', 'RealTime')),
  ADD COLUMN funded_daily_loss_limit  numeric(10,2),
  ADD COLUMN funded_max_contract_size text,
  ADD COLUMN funded_consistency_rule  text,
  ADD COLUMN funded_scaling_rule      text,
  ADD COLUMN funded_profit_split      text;

-- Also need to allow 'RealTime' in the eval drawdown_type check
-- (some firms use RealTime even in eval)
ALTER TABLE public.firm_accounts
  DROP CONSTRAINT IF EXISTS firm_accounts_drawdown_type_check;

ALTER TABLE public.firm_accounts
  ADD CONSTRAINT firm_accounts_drawdown_type_check
  CHECK (drawdown_type IN ('EOD', 'Trailing', 'Static', 'Intraday', 'RealTime'));

-- ---------- PAYOUT DETAILS (per-plan, not firm-level) ----------

ALTER TABLE public.firm_accounts
  ADD COLUMN min_payout_amount        numeric(10,2),    -- e.g. $500 (MFFU Rapid) or $250 (MFFU Flex)
  ADD COLUMN max_payout_amount        numeric(10,2),    -- e.g. $3,000 cap (MFFU Flex) or NULL if unlimited
  ADD COLUMN payout_buffer            numeric(10,2),    -- e.g. $2,100 buffer requirement (MFFU Rapid)
  ADD COLUMN requestable_profit_pct   smallint,         -- e.g. 50 means 50% of profits requestable
  ADD COLUMN min_profit_per_day       numeric(10,2),    -- e.g. $100/day min (MFFU Flex)
  ADD COLUMN days_to_payout           smallint,         -- e.g. 1 (daily) or 5 (weekly)
  ADD COLUMN payout_frequency_note    text;             -- human-readable override, e.g. "Daily after first trade day"

-- ---------- SCALING RULE (eval-phase, was missing) ----------

ALTER TABLE public.firm_accounts
  ADD COLUMN scaling_rule             text;             -- e.g. "Yes" or details, NULL = no scaling rule

-- ---------- MICRO SCALING ----------

ALTER TABLE public.firm_accounts
  ADD COLUMN micro_scaling            text;             -- e.g. "10:1" or NULL

-- ---------- COMMENT UPDATES ----------

COMMENT ON COLUMN public.firm_accounts.profit_target IS 'Evaluation phase profit target';
COMMENT ON COLUMN public.firm_accounts.max_drawdown IS 'Evaluation phase max drawdown';
COMMENT ON COLUMN public.firm_accounts.drawdown_type IS 'Evaluation phase drawdown mode (EOD, Trailing, RealTime, etc.)';
COMMENT ON COLUMN public.firm_accounts.daily_loss_limit IS 'Evaluation phase daily loss limit';
COMMENT ON COLUMN public.firm_accounts.max_contract_size IS 'Evaluation phase max position size';
COMMENT ON COLUMN public.firm_accounts.consistency_rule IS 'Evaluation phase consistency rule';
COMMENT ON COLUMN public.firm_accounts.profit_split IS 'Evaluation phase profit split (if different from funded)';

COMMENT ON COLUMN public.firm_accounts.funded_max_drawdown IS 'Funded phase max drawdown (NULL = same as eval)';
COMMENT ON COLUMN public.firm_accounts.funded_drawdown_type IS 'Funded phase drawdown mode (NULL = same as eval)';
COMMENT ON COLUMN public.firm_accounts.funded_daily_loss_limit IS 'Funded phase daily loss limit (NULL = same as eval)';
COMMENT ON COLUMN public.firm_accounts.funded_max_contract_size IS 'Funded phase max position size (NULL = same as eval)';
COMMENT ON COLUMN public.firm_accounts.funded_consistency_rule IS 'Funded phase consistency rule (NULL = same as eval, use "None" for explicitly no rule)';
COMMENT ON COLUMN public.firm_accounts.funded_scaling_rule IS 'Funded phase scaling rule (NULL = same as eval)';
COMMENT ON COLUMN public.firm_accounts.funded_profit_split IS 'Funded phase profit split (NULL = same as eval)';

COMMENT ON COLUMN public.firm_accounts.min_payout_amount IS 'Minimum payout request amount';
COMMENT ON COLUMN public.firm_accounts.max_payout_amount IS 'Maximum payout request amount (NULL = unlimited)';
COMMENT ON COLUMN public.firm_accounts.payout_buffer IS 'Required buffer above drawdown to request payout';
COMMENT ON COLUMN public.firm_accounts.requestable_profit_pct IS 'Percentage of profits that can be requested per payout';
COMMENT ON COLUMN public.firm_accounts.min_profit_per_day IS 'Minimum profit per day requirement for payout eligibility';
COMMENT ON COLUMN public.firm_accounts.days_to_payout IS 'Days from request to receiving payout';
