-- ============================================================
-- MFFU Plan Restructure
-- Core → removed
-- Rapid → updated prices & sizes (now has $25K option)
-- Flex → NEW plan ($25K and $50K)
-- Pro → NEW plan ($50K, $100K, $150K)
-- Data from myfundedfutures.com, March 2026
-- ============================================================

-- Remove old Core and Rapid accounts (will re-insert with correct data)
DELETE FROM public.firm_accounts
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures');

-- ─────────────────────────────────────────────
-- RAPID PLAN ($25K, $50K, $100K, $150K)
-- From site: eval EOD drawdown, no DLL, 90/10 split
-- Funded: intraday trailing, no consistency, daily payouts
-- ─────────────────────────────────────────────

INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost,
  profit_target, max_drawdown, drawdown_type, daily_loss_limit,
  max_contract_size, profit_split, min_days_to_pass, min_days_for_payout,
  news_trading, consistency_rule, algorithmic_trading, scalping_rules,
  micro_scaling,
  funded_drawdown_type, funded_consistency_rule,
  min_payout_amount, days_to_payout,
  sort_order, last_verified
) VALUES
-- Rapid $25K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'myfundedfutures'),
 'Rapid', 'evaluation', 25000, '$25,000',
 109, 0, NULL,
 1500, 1000, 'EOD', NULL,
 '3 contracts', '90/10', NULL, NULL,
 'Allowed', '50%', 'Allowed', 'Allowed (microscalping >4 ticks)',
 '10:1',
 'Trailing', 'None',
 500, 1,
 1, NOW()),

-- Rapid $50K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'myfundedfutures'),
 'Rapid', 'evaluation', 50000, '$50,000',
 157, 0, NULL,
 2000, 2000, 'EOD', NULL,
 '5 contracts', '90/10', NULL, NULL,
 'Allowed', '50%', 'Allowed', 'Allowed (microscalping >4 ticks)',
 '10:1',
 'Trailing', 'None',
 500, 1,
 2, NOW()),

-- Rapid $100K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'myfundedfutures'),
 'Rapid', 'evaluation', 100000, '$100,000',
 267, 0, NULL,
 6000, 3000, 'EOD', NULL,
 '6 contracts', '90/10', NULL, NULL,
 'Allowed', '50%', 'Allowed', 'Allowed (microscalping >4 ticks)',
 '10:1',
 'Trailing', 'None',
 500, 1,
 3, NOW()),

-- Rapid $150K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'myfundedfutures'),
 'Rapid', 'evaluation', 150000, '$150,000',
 347, 0, NULL,
 9000, 4500, 'EOD', NULL,
 '9 contracts', '90/10', NULL, NULL,
 'Allowed', '50%', 'Allowed', 'Allowed (microscalping >4 ticks)',
 '10:1',
 'Trailing', 'None',
 500, 1,
 4, NOW());


-- ─────────────────────────────────────────────
-- FLEX PLAN ($25K and $50K)
-- From screenshots: EOD drawdown, no DLL, 80/20 split
-- Funded: no consistency, 5-day payout
-- ─────────────────────────────────────────────

INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost,
  profit_target, max_drawdown, drawdown_type, daily_loss_limit,
  max_contract_size, profit_split, min_days_to_pass, min_days_for_payout,
  news_trading, consistency_rule, algorithmic_trading, scalping_rules,
  micro_scaling,
  funded_consistency_rule,
  min_payout_amount, max_payout_amount, min_profit_per_day,
  requestable_profit_pct, days_to_payout,
  sort_order, last_verified
) VALUES
-- Flex $25K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'myfundedfutures'),
 'Flex', 'evaluation', 25000, '$25,000',
 84, 0, NULL,
 1500, 1000, 'EOD', NULL,
 '3 contracts', '80/20', NULL, NULL,
 'Not allowed', '50%', 'Allowed', 'Allowed (microscalping >4 ticks)',
 '10:1',
 'None',
 250, 3000, 100,
 50, 5,
 5, NOW()),

-- Flex $50K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'myfundedfutures'),
 'Flex', 'evaluation', 50000, '$50,000',
 107, 0, NULL,
 3000, 2000, 'EOD', NULL,
 '5 contracts', '80/20', NULL, NULL,
 'Not allowed', '50%', 'Allowed', 'Allowed (microscalping >4 ticks)',
 '10:1',
 'None',
 250, 5000, 150,
 50, 5,
 6, NOW());


-- ─────────────────────────────────────────────
-- PRO PLAN ($50K, $100K, $150K)
-- From screenshots: EOD drawdown, no DLL, 80/20 split
-- $50K eval has NO consistency; $100K/$150K have 50%
-- Funded: no consistency, scaling rule, contracts increase
-- ─────────────────────────────────────────────

INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost,
  profit_target, max_drawdown, drawdown_type, daily_loss_limit,
  max_contract_size, profit_split, min_days_to_pass, min_days_for_payout,
  news_trading, consistency_rule, algorithmic_trading, scalping_rules,
  micro_scaling,
  funded_max_contract_size, funded_consistency_rule, funded_scaling_rule,
  min_payout_amount, payout_buffer, days_to_payout,
  sort_order, last_verified
) VALUES
-- Pro $50K (no eval consistency per screenshot)
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'myfundedfutures'),
 'Pro', 'evaluation', 50000, '$50,000',
 227, 0, NULL,
 4000, 2000, 'EOD', NULL,
 '3 contracts', '80/20', NULL, NULL,
 'Not allowed', NULL, 'Allowed', 'Allowed (microscalping >4 ticks)',
 '10:1',
 '5 contracts', 'None', 'Yes',
 1000, 2100, 14,
 7, NOW()),

-- Pro $100K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'myfundedfutures'),
 'Pro', 'evaluation', 100000, '$100,000',
 344, 0, NULL,
 6000, 3000, 'EOD', NULL,
 '6 contracts', '80/20', NULL, NULL,
 'Not allowed', '50%', 'Allowed', 'Allowed (microscalping >4 ticks)',
 '10:1',
 '10 contracts', 'None', 'Yes',
 1000, 3100, 14,
 8, NOW()),

-- Pro $150K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'myfundedfutures'),
 'Pro', 'evaluation', 150000, '$150,000',
 477, 0, NULL,
 9000, 4500, 'EOD', NULL,
 '9 contracts', '80/20', NULL, NULL,
 'Not allowed', '50%', 'Allowed', 'Allowed (microscalping >4 ticks)',
 '10:1',
 '15 contracts', 'None', 'Yes',
 1000, 4600, 14,
 9, NOW());
