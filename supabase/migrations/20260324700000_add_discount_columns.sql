-- ============================================================
-- Add discount/promo columns to firm_accounts
-- Supports both percentage-off and dollar-off for eval and activation separately
-- ============================================================

ALTER TABLE public.firm_accounts
  ADD COLUMN eval_discount_pct       integer,          -- e.g. 40 = 40% off eval price
  ADD COLUMN eval_discount_amount    numeric(10,2),    -- e.g. 50 = $50 off eval price
  ADD COLUMN activation_discount_pct integer,          -- e.g. 100 = activation fee fully waived
  ADD COLUMN activation_discount_amount numeric(10,2), -- e.g. 50 = $50 off activation
  ADD COLUMN promo_code              text,             -- e.g. 'NOFEE40'
  ADD COLUMN promo_expires           date;             -- when the promo ends (NULL = ongoing)

COMMENT ON COLUMN public.firm_accounts.eval_discount_pct IS 'Percentage discount on eval price (e.g. 40 = 40% off)';
COMMENT ON COLUMN public.firm_accounts.eval_discount_amount IS 'Dollar discount on eval price (e.g. 50 = $50 off). Use pct OR amount, not both.';
COMMENT ON COLUMN public.firm_accounts.activation_discount_pct IS 'Percentage discount on activation fee (e.g. 100 = fully waived)';
COMMENT ON COLUMN public.firm_accounts.activation_discount_amount IS 'Dollar discount on activation fee. Use pct OR amount, not both.';
COMMENT ON COLUMN public.firm_accounts.promo_code IS 'Active promo/affiliate code';
COMMENT ON COLUMN public.firm_accounts.promo_expires IS 'Promo expiration date (NULL = ongoing/unknown)';
