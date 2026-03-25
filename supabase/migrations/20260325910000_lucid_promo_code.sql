-- Add Lucid Trading VAULT promo code (40% off all accounts)
UPDATE public.firm_accounts
SET promo_code = 'VAULT',
    eval_discount_pct = 40
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'lucid-trading');
