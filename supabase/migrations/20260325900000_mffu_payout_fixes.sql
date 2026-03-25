-- ============================================================
-- Fix MFFU Rapid & Pro payout data
-- - Add min_profit_per_day for Rapid & Pro (by account size)
-- - Add max_payout_amount = $100,000 for Rapid & Pro
-- ============================================================

-- ─── RAPID: min_profit_per_day by size ───

UPDATE public.firm_accounts
SET min_profit_per_day = 100
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 25000;

UPDATE public.firm_accounts
SET min_profit_per_day = 150
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 50000;

UPDATE public.firm_accounts
SET min_profit_per_day = 200
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 100000;

UPDATE public.firm_accounts
SET min_profit_per_day = 250
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 150000;

-- ─── RAPID: max_payout_amount = $100,000 ───

UPDATE public.firm_accounts
SET max_payout_amount = 100000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid';

-- ─── PRO: min_profit_per_day by size ───

UPDATE public.firm_accounts
SET min_profit_per_day = 150
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Pro' AND size = 50000;

UPDATE public.firm_accounts
SET min_profit_per_day = 200
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Pro' AND size = 100000;

UPDATE public.firm_accounts
SET min_profit_per_day = 250
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Pro' AND size = 150000;

-- ─── PRO: max_payout_amount = $100,000 ───

UPDATE public.firm_accounts
SET max_payout_amount = 100000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Pro';
