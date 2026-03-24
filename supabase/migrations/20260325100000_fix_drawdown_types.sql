-- ============================================================
-- Fix eval drawdown types for TPT, Topstep, and MFFU Rapid
-- ============================================================

-- 1. TPT (Take Profit Trader): EOD → Trailing
UPDATE public.firm_accounts
SET drawdown_type = 'Trailing'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'takeprofittrader');

-- 2. Topstep: Trailing → EOD
UPDATE public.firm_accounts
SET drawdown_type = 'EOD'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topstep');

-- 3. MFFU Rapid: EOD → Trailing (Flex and Pro stay EOD)
UPDATE public.firm_accounts
SET drawdown_type = 'Trailing'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid';
