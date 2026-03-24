-- ============================================================
-- Populate funded-phase and payout columns using data we
-- already know from the seed (firm-level payout_frequency,
-- profit_split_note, and consistency_rule text).
--
-- RULES:
-- - Only set values we can confidently derive from existing data
-- - Leave NULL where we don't have enough info (NULL = same as eval)
-- - No guessing — better to show "—" than show wrong data
-- ============================================================

-- ─────────────────────────────────────────────
-- TOPSTEP
-- payout_frequency: "Weekly (every 5 days), daily after 30 winning trading days"
-- profit_split_note: "100% of first $10,000 then 90/10"
-- The funded profit split is actually the same as eval (90/10 on each account)
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET days_to_payout = 5
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topstep');

-- ─────────────────────────────────────────────
-- LUCID TRADING
-- payout_frequency: "On demand, funds arrive within 1-2 business days"
-- profit_split_note: "100% of first $10,000 then 90/10"
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET days_to_payout = 2
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'lucid-trading');

-- ─────────────────────────────────────────────
-- MYFUNDEDFUTURES
-- payout_frequency: "Every 14 days"
-- Core: 80/20, Rapid: 90/10 (already correct on accounts)
-- From user screenshots:
--   Rapid funded: RealTime drawdown (eval is Trailing), no consistency rule
--   Core funded: stays EOD, has different consistency (40% vs 50%)
-- ─────────────────────────────────────────────

-- All MFFU: 14-day payout cycle
UPDATE public.firm_accounts
SET days_to_payout = 14
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures');

-- MFFU Rapid: funded drawdown changes from Trailing to RealTime
UPDATE public.firm_accounts
SET funded_drawdown_type = 'RealTime'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid';

-- MFFU Rapid: no consistency rule when funded (eval has 50% rule)
UPDATE public.firm_accounts
SET funded_consistency_rule = 'None'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid';

-- MFFU Core: funded consistency changes to 40% (eval is 50%)
UPDATE public.firm_accounts
SET funded_consistency_rule = 'No single day >40% of cycle profits'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Core';

-- Clean up the eval consistency_rule text (remove "Funded:" notes — that info is now in funded_consistency_rule)
UPDATE public.firm_accounts
SET consistency_rule = 'No single day >50% of total profit'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures');

-- ─────────────────────────────────────────────
-- TRADEIFY
-- payout_frequency: "Same-day to 3 business days"
-- profit_split_note: "SELECT: 90/10. Growth: 100% first $15K then 90/10"
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET days_to_payout = 3
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify');

-- ─────────────────────────────────────────────
-- ALPHA FUTURES
-- payout_frequency: "Every 14 days (Standard), every 5 winning days (Advanced/Zero)"
-- Standard: 70/30 → 80/20 → 90/10 tiered. Advanced/Zero: 90/10 flat
-- Standard has tiered funded split that differs from eval
-- ─────────────────────────────────────────────

-- Zero Plan + Advanced Plan: 5 winning days
UPDATE public.firm_accounts
SET days_to_payout = 5
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'alpha-futures')
  AND plan_name IN ('Zero Plan', 'Advanced Plan');

-- Standard Plan: 14 days
UPDATE public.firm_accounts
SET days_to_payout = 14
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'alpha-futures')
  AND plan_name = 'Standard Plan';

-- Standard Plan: funded split is tiered (starts 70/30 but goes up)
-- The eval profit_split already says '70/30', which is the starting tier
-- The funded split is the same tiered system, so NULL is correct (same as eval)

-- ─────────────────────────────────────────────
-- FUNDEDNEXT FUTURES
-- payout_frequency: "Every 3 days (Rapid), every 5 days (Legacy)"
-- profit_split_note: "80/20 reward share"
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET days_to_payout = 3
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Rapid Challenge';

UPDATE public.firm_accounts
SET days_to_payout = 5
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Legacy Challenge';

-- ─────────────────────────────────────────────
-- TOPONE TRADER
-- payout_frequency: "Every 14 days"
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET days_to_payout = 14
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topone-trader');

-- ─────────────────────────────────────────────
-- TAKEPROFITTRADER
-- payout_frequency: "Anytime after 5 trading days"
-- min_days_for_payout is already 5 on all accounts
-- days_to_payout: they process quickly, but we don't have exact days — leave NULL
-- ─────────────────────────────────────────────
-- No update needed — we don't have exact processing time

-- ─────────────────────────────────────────────
-- AQUA FUTURES
-- payout_frequency: "On-demand with 48-hour processing"
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET days_to_payout = 2
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'aqua-futures');

-- ─────────────────────────────────────────────
-- APEX TRADER FUNDING
-- payout_frequency: "Twice monthly (1st-5th, 15th-19th)"
-- That's roughly every 15 days, but it's calendar-based not rolling
-- We'll set 15 as an approximation since it's the closest integer
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET days_to_payout = 15
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'apex-trader-funding');
