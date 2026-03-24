-- ============================================================
-- Shorten consistency_rule values to just the percentage
-- e.g. "No single day can exceed 40% of total profit" → "40%"
-- NULL stays NULL (no rule)
-- ============================================================

-- Topstep: "Best day cannot exceed 50% of profit target" → "50%"
UPDATE public.firm_accounts
SET consistency_rule = '50%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topstep');

-- Lucid: "Largest profitable day cannot exceed 50% of total profit" → "50%"
UPDATE public.firm_accounts
SET consistency_rule = '50%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'lucid-trading');

-- MFFU: "No single day >50% of total profit" → "50%"
UPDATE public.firm_accounts
SET consistency_rule = '50%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures');

-- MFFU Core funded: "No single day >40% of cycle profits" → "40%"
UPDATE public.firm_accounts
SET funded_consistency_rule = '40%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Core';

-- MFFU Rapid funded: already 'None' — leave as is

-- Tradeify SELECT: "No single day can exceed 40% of total profit" → "40%"
UPDATE public.firm_accounts
SET consistency_rule = '40%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify')
  AND plan_name = 'SELECT';

-- Tradeify Growth: NULL (no rule) — leave as is

-- Alpha Futures: "No single day can exceed 40% of total net profits (qualified accounts)" → "40%"
-- and "No single day can exceed 50% of total net profits" → "50%"
UPDATE public.firm_accounts
SET consistency_rule = '40%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'alpha-futures')
  AND plan_name = 'Zero Plan';

UPDATE public.firm_accounts
SET consistency_rule = '50%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'alpha-futures')
  AND plan_name IN ('Standard Plan', 'Advanced Plan');

-- FundedNext Rapid: "No consistency rule in Challenge phase" → NULL (no rule)
UPDATE public.firm_accounts
SET consistency_rule = NULL
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Rapid Challenge';

-- FundedNext Legacy: "Daily profit cannot exceed 40% of total profit target" → "40%"
UPDATE public.firm_accounts
SET consistency_rule = '40%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Legacy Challenge';

-- TopOne: "No single day profit can exceed 50% of total profits" → "50%"
UPDATE public.firm_accounts
SET consistency_rule = '50%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topone-trader');

-- TPT: "No single trading day may exceed 50% of total net profits" → "50%"
UPDATE public.firm_accounts
SET consistency_rule = '50%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'takeprofittrader');

-- Aqua: "No single trading day can equal or exceed 40% of total profits" → "40%"
UPDATE public.firm_accounts
SET consistency_rule = '40%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'aqua-futures');

-- Apex: "No single day profit can exceed 50% of total accumulated profit since last payout" → "50%"
UPDATE public.firm_accounts
SET consistency_rule = '50%'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'apex-trader-funding');
