-- ============================================================
-- Update Trustpilot scores from live Trustpilot pages
-- Pulled March 24, 2026 directly from trustpilot.com
-- ============================================================

-- Topstep: 4.5 → 3.4 (13,721 reviews)
UPDATE public.firms SET rating = 3.4 WHERE slug = 'topstep';

-- Lucid Trading: 4.8 → 4.7 (2,678 reviews)
UPDATE public.firms SET rating = 4.7 WHERE slug = 'lucid-trading';

-- MyFundedFutures: 4.9 — no change (16,734 reviews)
-- UPDATE public.firms SET rating = 4.9 WHERE slug = 'myfundedfutures';

-- Tradeify: 4.8 → 4.6 (2,390 reviews)
UPDATE public.firms SET rating = 4.6 WHERE slug = 'tradeify';

-- Alpha Futures: 4.9 — no change (3,241 reviews)
-- UPDATE public.firms SET rating = 4.9 WHERE slug = 'alpha-futures';

-- FundedNext: 4.4 → 4.5 (62,639 reviews)
UPDATE public.firms SET rating = 4.5 WHERE slug = 'fundednext-futures';

-- Take Profit Trader: 4.4 — no change (8,743 reviews)
-- UPDATE public.firms SET rating = 4.4 WHERE slug = 'takeprofittrader';

-- Aqua Futures: 3.1 — no change (128 reviews)
-- UPDATE public.firms SET rating = 3.1 WHERE slug = 'aqua-futures';

-- Apex Trader Funding: 4.4 — no change (18,075 reviews)
-- UPDATE public.firms SET rating = 4.4 WHERE slug = 'apex-trader-funding';
