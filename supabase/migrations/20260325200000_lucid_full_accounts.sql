-- ============================================================
-- Lucid Trading: Full account lineup
-- Currently only has 2x 50K accounts (LucidFlex, LucidPro)
-- Adding: 25K, 100K, 150K for both plans + LucidDirect
-- Data from lucidtrading.com, March 2026
-- ============================================================

-- First fix existing 50K LucidPro: price was $216 in seed, website shows $185
UPDATE public.firm_accounts
SET price = 185,
    reset_cost = 120,
    daily_loss_limit = 1200,
    consistency_rule = 'None',
    last_verified = NOW()
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'lucid-trading')
  AND plan_name = 'LucidPro' AND size = 50000;

-- Fix existing 50K LucidFlex: price matches ($130), add reset cost & consistency
UPDATE public.firm_accounts
SET reset_cost = 85,
    consistency_rule = '50%',
    last_verified = NOW()
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'lucid-trading')
  AND plan_name = 'LucidFlex' AND size = 50000;


-- ─────────────────────────────────────────────
-- LUCIDPRO: Add 25K, 100K, 150K
-- EOD drawdown, no consistency, no DLL on 25K
-- ─────────────────────────────────────────────

INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost,
  profit_target, max_drawdown, drawdown_type, daily_loss_limit,
  max_contract_size, profit_split, min_days_to_pass, min_days_for_payout,
  news_trading, consistency_rule, algorithmic_trading, scalping_rules,
  sort_order, last_verified
) VALUES
-- LucidPro $25K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'lucid-trading'),
 'LucidPro', 'evaluation', 25000, '$25,000',
 135, 0, 90,
 1250, 1000, 'EOD', NULL,
 '2 minis', '90/10', 2, NULL,
 'Allowed', 'None', 'Allowed', 'Allowed (microscalping <5 sec flagged)',
 1, NOW()),

-- LucidPro $100K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'lucid-trading'),
 'LucidPro', 'evaluation', 100000, '$100,000',
 285, 0, 180,
 6000, 3000, 'EOD', 1800,
 '6 minis', '90/10', 2, NULL,
 'Allowed', 'None', 'Allowed', 'Allowed (microscalping <5 sec flagged)',
 3, NOW()),

-- LucidPro $150K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'lucid-trading'),
 'LucidPro', 'evaluation', 150000, '$150,000',
 370, 0, 245,
 9000, 4500, 'EOD', 2700,
 '10 minis', '90/10', 2, NULL,
 'Allowed', 'None', 'Allowed', 'Allowed (microscalping <5 sec flagged)',
 4, NOW());


-- ─────────────────────────────────────────────
-- LUCIDLEX: Add 25K, 100K, 150K
-- EOD drawdown, 50% consistency, no DLL
-- ─────────────────────────────────────────────

INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost,
  profit_target, max_drawdown, drawdown_type, daily_loss_limit,
  max_contract_size, profit_split, min_days_to_pass, min_days_for_payout,
  news_trading, consistency_rule, algorithmic_trading, scalping_rules,
  sort_order, last_verified
) VALUES
-- LucidFlex $25K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'lucid-trading'),
 'LucidFlex', 'evaluation', 25000, '$25,000',
 100, 0, 60,
 1250, 1000, 'EOD', NULL,
 '2 minis', '90/10', 2, NULL,
 'Allowed', '50%', 'Allowed', 'Allowed (microscalping <5 sec flagged)',
 5, NOW()),

-- LucidFlex $100K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'lucid-trading'),
 'LucidFlex', 'evaluation', 100000, '$100,000',
 225, 0, 140,
 6000, 3000, 'EOD', NULL,
 '6 minis', '90/10', 2, NULL,
 'Allowed', '50%', 'Allowed', 'Allowed (microscalping <5 sec flagged)',
 7, NOW()),

-- LucidFlex $150K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'lucid-trading'),
 'LucidFlex', 'evaluation', 150000, '$150,000',
 345, 0, 225,
 9000, 4500, 'EOD', NULL,
 '10 minis', '90/10', 2, NULL,
 'Allowed', '50%', 'Allowed', 'Allowed (microscalping <5 sec flagged)',
 8, NOW());


-- ─────────────────────────────────────────────
-- LUCIDDIRECT: Straight-to-funded (all sizes)
-- EOD drawdown, 20% consistency, price = activation
-- ─────────────────────────────────────────────

INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost,
  profit_target, max_drawdown, drawdown_type, daily_loss_limit,
  max_contract_size, profit_split, min_days_to_pass, min_days_for_payout,
  news_trading, consistency_rule, algorithmic_trading, scalping_rules,
  sort_order, last_verified
) VALUES
-- LucidDirect $25K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'lucid-trading'),
 'LucidDirect', 'direct', 25000, '$25,000',
 340, 0, NULL,
 NULL, 1000, 'EOD', NULL,
 '2 minis', '90/10', NULL, 5,
 'Allowed', '20%', 'Allowed', 'Allowed (microscalping <5 sec flagged)',
 9, NOW()),

-- LucidDirect $50K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'lucid-trading'),
 'LucidDirect', 'direct', 50000, '$50,000',
 520, 0, NULL,
 NULL, 2000, 'EOD', 1200,
 '4 minis', '90/10', NULL, 5,
 'Allowed', '20%', 'Allowed', 'Allowed (microscalping <5 sec flagged)',
 10, NOW()),

-- LucidDirect $100K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'lucid-trading'),
 'LucidDirect', 'direct', 100000, '$100,000',
 700, 0, NULL,
 NULL, 3500, 'EOD', 2100,
 '6 minis', '90/10', NULL, 5,
 'Allowed', '20%', 'Allowed', 'Allowed (microscalping <5 sec flagged)',
 11, NOW()),

-- LucidDirect $150K
(gen_random_uuid(),
 (SELECT id FROM public.firms WHERE slug = 'lucid-trading'),
 'LucidDirect', 'direct', 150000, '$150,000',
 840, 0, NULL,
 NULL, 5000, 'EOD', 3000,
 '10 minis', '90/10', NULL, 5,
 'Allowed', '20%', 'Allowed', 'Allowed (microscalping <5 sec flagged)',
 12, NOW());
