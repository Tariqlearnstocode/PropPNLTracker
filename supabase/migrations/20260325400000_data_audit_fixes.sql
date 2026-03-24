-- ============================================================
-- DATA AUDIT: Fill missing fields across all firms & accounts
-- Research conducted March 2026 from official firm websites
-- ============================================================


-- ############################################################
-- PART 0: REMOVE TOPONE TRADER (forex/CFD, not futures)
-- ############################################################

DELETE FROM public.firm_accounts
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topone-trader');

DELETE FROM public.firms WHERE slug = 'topone-trader';


-- ############################################################
-- PART 1: FIRM-LEVEL METADATA FIXES
-- ############################################################

-- ─── TOPSTEP: add max_contract_size to all accounts ───
UPDATE public.firm_accounts
SET max_contract_size = '5'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topstep')
  AND size = 50000;

UPDATE public.firm_accounts
SET max_contract_size = '10'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topstep')
  AND size = 100000;

UPDATE public.firm_accounts
SET max_contract_size = '15'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topstep')
  AND size = 150000;

-- ─── TAKEPROFITTRADER: firm metadata ───
UPDATE public.firms
SET founders = 'James Sixsmith',
    country = 'United States',
    founded_year = 2021,
    rating = 4.0,
    support_email = 'support@takeprofittrader.com',
    support_help_url = 'https://takeprofittraderhelp.zendesk.com/hc/en-us',
    last_verified = NOW()
WHERE slug = 'takeprofittrader';

-- TPT: add $75K account (missing size)
INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost, profit_target, max_drawdown,
  drawdown_type, daily_loss_limit, max_contract_size, profit_split,
  min_days_to_pass, min_days_for_payout, news_trading, consistency_rule,
  algorithmic_trading, scalping_rules, days_to_payout,
  funded_drawdown_type, payout_buffer, min_payout_amount, last_verified
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.firms WHERE slug = 'takeprofittrader'),
  '1-Step Test', 'evaluation', 75000, '$75,000',
  245, 130, 100, 4500, 3000,
  'Trailing', NULL, '9', '80/20',
  5, 5, 'Allowed', '50%',
  'Allowed (own strategy only)', 'Allowed', 1,
  'Trailing', 3000, 500, NOW()
);

-- TPT: update existing accounts with missing data
UPDATE public.firm_accounts
SET activation_fee = 130,
    days_to_payout = 1,
    consistency_rule = '50%',
    last_verified = NOW()
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'takeprofittrader');

-- ─── AQUA FUTURES: firm metadata ───
UPDATE public.firms
SET founders = 'Jason Blax',
    country = 'United Arab Emirates',
    founded_year = 2024,
    rating = 3.1,
    max_funded_accounts = 3,
    support_email = 'support@aquafutures.io',
    support_help_url = 'https://help.aquafutures.io',
    last_verified = NOW()
WHERE slug = 'aqua-futures';

-- Aqua: add $100K and $150K Beginner accounts
INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost, profit_target, max_drawdown,
  drawdown_type, daily_loss_limit, max_contract_size, profit_split,
  min_days_to_pass, min_days_for_payout, news_trading, consistency_rule,
  algorithmic_trading, scalping_rules, days_to_payout, last_verified
) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug = 'aqua-futures'),
 'Beginner Evaluation', 'evaluation', 100000, '$100,000',
 249, 0, NULL, 6000, 5000,
 'EOD', 2500, '5', '90/10',
 NULL, 7, 'Allowed', '40%',
 'Not allowed', 'Allowed (microscalping <30 sec prohibited)', 2, NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug = 'aqua-futures'),
 'Beginner Evaluation', 'evaluation', 150000, '$150,000',
 349, 0, NULL, 9000, 7500,
 'EOD', 3750, '8', '90/10',
 NULL, 7, 'Allowed', '40%',
 'Not allowed', 'Allowed (microscalping <30 sec prohibited)', 2, NOW());

-- Aqua: add Instant Funded accounts
INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost, profit_target, max_drawdown,
  drawdown_type, daily_loss_limit, max_contract_size, profit_split,
  min_days_to_pass, min_days_for_payout, news_trading, consistency_rule,
  algorithmic_trading, scalping_rules, days_to_payout, last_verified
) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug = 'aqua-futures'),
 'Instant Funded', 'instant', 25000, '$25,000',
 186, 0, NULL, 1500, 1500,
 'EOD', 750, '3', '90/10',
 NULL, 7, 'Not allowed', '20%',
 'Not allowed', 'Allowed (microscalping <30 sec prohibited)', 2, NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug = 'aqua-futures'),
 'Instant Funded', 'instant', 50000, '$50,000',
 291, 0, NULL, 3000, 3000,
 'EOD', 1500, '6', '90/10',
 NULL, 7, 'Not allowed', '20%',
 'Not allowed', 'Allowed (microscalping <30 sec prohibited)', 2, NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug = 'aqua-futures'),
 'Instant Funded', 'instant', 100000, '$100,000',
 449, 0, NULL, 6000, 6000,
 'EOD', 3000, '10', '90/10',
 NULL, 7, 'Not allowed', '20%',
 'Not allowed', 'Allowed (microscalping <30 sec prohibited)', 2, NOW());

-- ─── APEX TRADER FUNDING: firm metadata ───
UPDATE public.firms
SET founders = 'Darrell Martin',
    country = 'United States',
    founded_year = 2021,
    rating = 4.4,
    max_funded_accounts = 20,
    support_email = 'support@apextraderfunding.com',
    support_help_url = 'https://support.apextraderfunding.com/hc/en-us',
    last_verified = NOW()
WHERE slug = 'apex-trader-funding';

-- Apex: update existing accounts with missing data
-- All accounts: 0 min trading days, 50% consistency on payouts
UPDATE public.firm_accounts
SET min_days_to_pass = 0,
    consistency_rule = '50%',
    funded_consistency_rule = '50%',
    last_verified = NOW()
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'apex-trader-funding');

-- Apex: add $250K account
INSERT INTO public.firm_accounts (
  id, firm_id, plan_name, account_type, size, size_label,
  price, activation_fee, reset_cost, profit_target, max_drawdown,
  drawdown_type, daily_loss_limit, max_contract_size, profit_split,
  min_days_to_pass, min_days_for_payout, news_trading, consistency_rule,
  algorithmic_trading, scalping_rules, days_to_payout,
  funded_drawdown_type, funded_consistency_rule, payout_buffer, min_payout_amount,
  last_verified
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.firms WHERE slug = 'apex-trader-funding'),
  '1-Step Evaluation', 'evaluation', 250000, '$250,000',
  417, 0, 80, 15000, 12500,
  'Trailing', 5000, '25', '90/10',
  0, 5, 'Allowed (one direction only during news)', '50%',
  'Not allowed', 'Flipping allowed max 2 of 10 trading days', 15,
  'EOD', '50%', 100, 500, NOW()
);


-- ############################################################
-- PART 2: FUNDEDNEXT FUTURES — fill missing account data
-- ############################################################

-- Rapid Challenge: add daily_loss_limit and reset_cost
UPDATE public.firm_accounts
SET daily_loss_limit = 1000, reset_cost = 90
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Rapid Challenge' AND size = 25000;

UPDATE public.firm_accounts
SET daily_loss_limit = 2000, reset_cost = 165
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Rapid Challenge' AND size = 50000;

UPDATE public.firm_accounts
SET daily_loss_limit = 2500, reset_cost = 255
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Rapid Challenge' AND size = 100000;

-- Legacy Challenge: add daily_loss_limit and reset_cost
UPDATE public.firm_accounts
SET daily_loss_limit = 1000, reset_cost = 72
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Legacy Challenge' AND size = 25000;

UPDATE public.firm_accounts
SET daily_loss_limit = 2000, reset_cost = 144
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Legacy Challenge' AND size = 50000;

UPDATE public.firm_accounts
SET daily_loss_limit = 3000, reset_cost = 225
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Legacy Challenge' AND size = 100000;

-- FundedNext: update min_days_to_pass (Rapid = 0, Legacy = 5)
UPDATE public.firm_accounts
SET min_days_to_pass = 0
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Rapid Challenge';

UPDATE public.firm_accounts
SET min_days_to_pass = 5
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Legacy Challenge';

-- FundedNext: funded drawdown type is EOD trailing for all
UPDATE public.firm_accounts
SET funded_drawdown_type = 'EOD'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND funded_drawdown_type IS NULL;

-- FundedNext: update all accounts last_verified
UPDATE public.firm_accounts
SET last_verified = NOW()
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures');


-- ############################################################
-- PART 3: TRADEIFY — SELECT plan has no DLL (confirmed)
-- ############################################################

-- SELECT eval has NO daily loss limit (research confirms "None")
-- Growth eval already has DLL set — confirmed correct
-- No changes needed — NULL is correct for SELECT DLL


-- ############################################################
-- PART 4: NORMALIZE funded_max_contract_size (same as max_contract_size migration)
-- ############################################################

UPDATE public.firm_accounts
SET funded_max_contract_size = split_part(funded_max_contract_size, ' ', 1)
WHERE funded_max_contract_size ~ '^\d+\s+mini'
   OR funded_max_contract_size ~ '^\d+\s+micro'
   OR funded_max_contract_size ~ '^\d+\s+contract';

-- Handle "X ES / Y MES" and "X mini / Y micro" patterns → just X
UPDATE public.firm_accounts
SET funded_max_contract_size = split_part(funded_max_contract_size, ' ', 1)
WHERE funded_max_contract_size ~ '^\d+\s+(ES|mini)\s*/';


-- ############################################################
-- PART 5: SHORTEN consistency_rule text to just percentages
-- ############################################################

-- Standardize long consistency text to short form
UPDATE public.firm_accounts
SET consistency_rule = '50%'
WHERE consistency_rule ILIKE '%50%'
  AND consistency_rule NOT LIKE '50%';

UPDATE public.firm_accounts
SET consistency_rule = '40%'
WHERE consistency_rule ILIKE '%40%'
  AND consistency_rule NOT LIKE '40%';

UPDATE public.firm_accounts
SET consistency_rule = '30%'
WHERE consistency_rule ILIKE '%30%'
  AND consistency_rule NOT LIKE '30%';

UPDATE public.firm_accounts
SET consistency_rule = '20%'
WHERE consistency_rule ILIKE '%20%'
  AND consistency_rule NOT LIKE '20%';

UPDATE public.firm_accounts
SET consistency_rule = 'None'
WHERE consistency_rule ILIKE '%no consistency%';

-- Funded consistency normalization
UPDATE public.firm_accounts
SET funded_consistency_rule = '40%'
WHERE funded_consistency_rule ILIKE '%40%'
  AND funded_consistency_rule NOT LIKE '40%';

UPDATE public.firm_accounts
SET funded_consistency_rule = '30%'
WHERE funded_consistency_rule ILIKE '%30%'
  AND funded_consistency_rule NOT LIKE '30%';


-- ############################################################
-- PART 6: UPDATE last_verified on all records
-- ############################################################

UPDATE public.firms SET last_verified = NOW();
UPDATE public.firm_accounts SET last_verified = NOW();
