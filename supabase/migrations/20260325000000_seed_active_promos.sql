-- ============================================================
-- Seed active promo codes (March 2026)
-- Run AFTER migration 800000 (MFFU plan restructure)
-- ============================================================

-- ─────────────────────────────────────────────
-- TAKEPROFITTRADER — NOFEE40
-- 40% off eval, activation fee waived (all accounts)
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET eval_discount_pct = 40,
    activation_discount_pct = 100,
    promo_code = 'NOFEE40'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'takeprofittrader');

-- ─────────────────────────────────────────────
-- MYFUNDEDFUTURES — Rapid plan promos
-- Different codes per size (from site checkout page)
-- $25K: $109 → $87 w/ RAPID25K
-- $50K: $157 → $97 w/ RAPID97
-- $100K: $267 → $213.60 w/ RAPID (20% off)
-- $150K: $347 → $277.60 w/ RAPID (20% off)
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET eval_discount_amount = 22,
    promo_code = 'RAPID25K'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 25000;

UPDATE public.firm_accounts
SET eval_discount_amount = 60,
    promo_code = 'RAPID97'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 50000;

UPDATE public.firm_accounts
SET eval_discount_pct = 20,
    promo_code = 'RAPID'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size IN (100000, 150000);

-- ─────────────────────────────────────────────
-- MYFUNDEDFUTURES — STEADY ($35 off 25K Flex)
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET eval_discount_amount = 35,
    promo_code = 'STEADY'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Flex' AND size = 25000;

-- ─────────────────────────────────────────────
-- MYFUNDEDFUTURES — PRO (50% off eval for all Pro accounts)
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET eval_discount_pct = 50,
    promo_code = 'PRO'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Pro';

-- ─────────────────────────────────────────────
-- TOPSTEP — ALEXGOLD ($26 off eval, all accounts)
-- Expires 4/1/26
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET eval_discount_amount = 26,
    promo_code = 'ALEXGOLD',
    promo_expires = '2026-04-01'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topstep');
