-- ============================================================
-- Add firm logos + fix MFFU min_days_to_pass
-- Logo URLs pulled from firm websites March 25, 2026
-- ============================================================

-- ─── LOGOS ───

UPDATE public.firms SET logo_url = 'https://cdn.sanity.io/images/gkapjdfy/production/f1d8783f186339d24630a93d109e7a4893b9fc2c-160x52.svg'
WHERE slug = 'topstep';

UPDATE public.firms SET logo_url = 'https://lucidtrading.com/wp-content/uploads/2025/02/Untitled-design-2025-10-22T181841.622.png'
WHERE slug = 'lucid-trading';

UPDATE public.firms SET logo_url = 'https://res.cloudinary.com/myfundedfutures/image/upload/v1731010648/Main%20website%20dev/mffu_logo_white_6494f127a4.svg'
WHERE slug = 'myfundedfutures';

UPDATE public.firms SET logo_url = 'https://cdn.prod.website-files.com/679b064a680c614548672a06/67b4273005993910d632c26d_horizontal-logo%20(1).svg'
WHERE slug = 'tradeify';

UPDATE public.firms SET logo_url = 'https://alpha-futures.com/static/media/logoSVG.a84a046ab03e105cbfda6a55bf3c7916.svg'
WHERE slug = 'alpha-futures';

UPDATE public.firms SET logo_url = 'https://dirslur24ie1a.cloudfront.net/fundednext/fundednext-futures-logo.svg'
WHERE slug = 'fundednext-futures';

UPDATE public.firms SET logo_url = 'https://takeprofittrader.com/assets/desktop-logo.svg'
WHERE slug = 'takeprofittrader';

UPDATE public.firms SET logo_url = 'https://apextraderfunding.com//app/plugins/apex-features/assets/src/images/apex-logo-light.svg'
WHERE slug = 'apex-trader-funding';

UPDATE public.firms SET logo_url = 'https://cdn.prod.website-files.com/691ed7af34e4c830258867d3/691ed7af34e4c830258867ed_49148b27e841c9f14ff5b8156505eb73_Brand%20TypeWhite.svg'
WHERE slug = 'aqua-futures';


-- ─── MFFU: min_days_to_pass = 2 for all Rapid and Flex accounts ───

UPDATE public.firm_accounts
SET min_days_to_pass = 2
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name IN ('Rapid', 'Flex')
  AND min_days_to_pass IS NULL;
