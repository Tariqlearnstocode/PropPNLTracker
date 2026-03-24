-- ============================================================
-- TRADEIFY + FUNDEDNEXT corrections after data verification
-- Research conducted March 24, 2026 from official websites
-- ============================================================


-- ############################################################
-- TRADEIFY CORRECTIONS
-- ############################################################

-- ─── SELECT $150K: profit target was $7,500, should be $9,000 ───
UPDATE public.firm_accounts
SET profit_target = 9000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify')
  AND plan_name = 'SELECT' AND size = 150000;

-- ─── SELECT reset costs: 100K=$155, 150K=$215 (50K=$95 is correct) ───
UPDATE public.firm_accounts
SET reset_cost = 155
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify')
  AND plan_name = 'SELECT' AND size = 100000;

UPDATE public.firm_accounts
SET reset_cost = 215
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify')
  AND plan_name = 'SELECT' AND size = 150000;

-- ─── Growth profit targets: 50K=$3,000, 100K=$6,000, 150K=$9,000 ───
UPDATE public.firm_accounts
SET profit_target = 3000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify')
  AND plan_name = 'Growth' AND size = 50000;

UPDATE public.firm_accounts
SET profit_target = 6000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify')
  AND plan_name = 'Growth' AND size = 100000;

UPDATE public.firm_accounts
SET profit_target = 9000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify')
  AND plan_name = 'Growth' AND size = 150000;

-- ─── Growth $150K reset cost: $229 (was $189) ───
UPDATE public.firm_accounts
SET reset_cost = 229
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify')
  AND plan_name = 'Growth' AND size = 150000;

-- ─── Add Lightning (Instant Funded) accounts ───
INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost, profit_target, max_drawdown,
  drawdown_type, daily_loss_limit, max_contract_size, profit_split,
  min_days_to_pass, min_days_for_payout, news_trading, consistency_rule,
  algorithmic_trading, scalping_rules, days_to_payout, last_verified
) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug = 'tradeify'),
 'Lightning', 'instant', 50000, '$50,000',
 199, 0, NULL, 2500, 2000,
 'EOD', 1250, '4', '90/10',
 NULL, NULL, 'Allowed', 'None',
 'Allowed', '50%+ of trades must be held >10 seconds', 3, NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug = 'tradeify'),
 'Lightning', 'instant', 100000, '$100,000',
 349, 0, NULL, 5000, 3500,
 'EOD', 2500, '8', '90/10',
 NULL, NULL, 'Allowed', 'None',
 'Allowed', '50%+ of trades must be held >10 seconds', 3, NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug = 'tradeify'),
 'Lightning', 'instant', 150000, '$150,000',
 499, 0, NULL, 7500, 5000,
 'EOD', 3750, '12', '90/10',
 NULL, NULL, 'Allowed', 'None',
 'Allowed', '50%+ of trades must be held >10 seconds', 3, NOW());

-- ─── Add Tradeify promo: MAR 30% off, expires 3/31/2026 ───
UPDATE public.firm_accounts
SET promo_code = 'MAR',
    eval_discount_pct = 30,
    promo_expires = '2026-03-31'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify');

-- ─── Update Tradeify platforms (WealthCharts confirmed, verify others) ───
UPDATE public.firms
SET platforms = ARRAY['Tradovate', 'NinjaTrader', 'TradingView', 'WealthCharts'],
    last_verified = NOW()
WHERE slug = 'tradeify';


-- ############################################################
-- FUNDEDNEXT FUTURES CORRECTIONS
-- ############################################################

-- ─── CRITICAL: Remove daily_loss_limit — neither plan has DLL ───
-- Official help center: "No daily loss limits are enforced"
UPDATE public.firm_accounts
SET daily_loss_limit = NULL
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures');

-- ─── Legacy $50K: profit target updated from $2,500 to $3,000 (March 2026) ───
UPDATE public.firm_accounts
SET profit_target = 3000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Legacy Challenge' AND size = 50000;

-- ─── Add Bolt Challenge (new plan type) ───
INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost, profit_target, max_drawdown,
  drawdown_type, daily_loss_limit, max_contract_size, profit_split,
  min_days_to_pass, min_days_for_payout, news_trading, consistency_rule,
  algorithmic_trading, scalping_rules, days_to_payout,
  funded_drawdown_type, funded_consistency_rule, min_payout_amount,
  last_verified
) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug = 'fundednext-futures'),
 'Bolt Challenge', 'evaluation', 25000, '$25,000',
 69, 0, 62, 1500, 1000,
 'EOD', 500, '2', '80/20',
 0, 5, 'Allowed', 'None',
 'Allowed', 'Allowed (15-20 second minimum hold)', 3,
 'EOD', 'None', 250, NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug = 'fundednext-futures'),
 'Bolt Challenge', 'evaluation', 50000, '$50,000',
 100, 0, 90, 3000, 2000,
 'EOD', 1000, '3', '80/20',
 0, 5, 'Allowed', 'None',
 'Allowed', 'Allowed (15-20 second minimum hold)', 3,
 'EOD', 'None', 250, NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug = 'fundednext-futures'),
 'Bolt Challenge', 'evaluation', 100000, '$100,000',
 170, 0, 153, 5000, 2500,
 'EOD', 2000, '5', '80/20',
 0, 5, 'Allowed', 'None',
 'Allowed', 'Allowed (15-20 second minimum hold)', 3,
 'EOD', 'None', 500, NOW());

-- ─── Add FundedNext promo: FNF30 ───
UPDATE public.firm_accounts
SET promo_code = 'FNF30',
    eval_discount_pct = 30
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures');

-- ─── Update last_verified ───
UPDATE public.firm_accounts
SET last_verified = NOW()
WHERE firm_id IN (
  SELECT id FROM public.firms WHERE slug IN ('tradeify', 'fundednext-futures')
);
