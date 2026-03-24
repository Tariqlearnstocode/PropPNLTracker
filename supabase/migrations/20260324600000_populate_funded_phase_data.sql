-- ============================================================
-- Populate funded-phase data from firm website research
-- Conducted March 2026
--
-- PART 1: EVAL DATA CORRECTIONS (found during research)
-- PART 2: FUNDED PHASE DATA POPULATION
--
-- Sources: Official firm websites & help centers
-- NULL = same as eval (our convention)
-- ============================================================


-- ############################################################
-- PART 1: EVAL DATA CORRECTIONS
-- ############################################################

-- ─────────────────────────────────────────────
-- TOPSTEP — funded max_drawdown differs from eval for 100K/150K
-- Source: help.topstep.com Express Funded Account Parameters
-- $50K stays $2,000; $100K drops to $3,000; $150K drops to $4,500
-- (These are Express Funded values — the drawdown shrinks)
-- ─────────────────────────────────────────────
-- No eval corrections needed — eval data confirmed accurate

-- ─────────────────────────────────────────────
-- LUCID TRADING — LucidPro eval corrections
-- Source: support.lucidtrading.com
-- LucidPro eval has $1,200 daily loss limit (was NULL)
-- LucidPro eval has NO consistency rule (was 50%)
-- LucidFlex eval consistency = 50% is correct
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET daily_loss_limit = 1200,
    consistency_rule = NULL
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'lucid-trading')
  AND plan_name = 'LucidPro';

-- ─────────────────────────────────────────────
-- MFFU — Rapid $100K and $150K max_drawdown corrections
-- Source: help.myfundedfutures.com
-- Rapid $100K: max_drawdown = $3,000 (was $2,000)
-- Rapid $150K: max_drawdown = $4,500 (was $2,000)
-- Rapid drawdown_type: EOD in eval (was Trailing — Trailing is sim funded)
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET max_drawdown = 3000,
    drawdown_type = 'EOD'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 100000;

UPDATE public.firm_accounts
SET max_drawdown = 4500,
    drawdown_type = 'EOD'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 150000;

-- Fix Rapid $50K drawdown_type too (EOD in eval, not Trailing)
UPDATE public.firm_accounts
SET drawdown_type = 'EOD'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 50000;

-- ─────────────────────────────────────────────
-- TAKEPROFITTRADER — max_contract_size corrections
-- Source: takeprofittraderhelp.zendesk.com
-- $100K: 12 contracts (was 9)
-- $150K: 15 contracts (was 12)
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET max_contract_size = '12 contracts'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'takeprofittrader')
  AND size = 100000;

UPDATE public.firm_accounts
SET max_contract_size = '15 contracts'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'takeprofittrader')
  AND size = 150000;

-- ─────────────────────────────────────────────
-- AQUA FUTURES — eval corrections
-- Source: help.aquafutures.io
-- $25K: max_drawdown = $1,500 (was $1,000)
-- $50K: max_drawdown = $2,500 (was $2,000), max_contracts = 3 (was 2)
-- ─────────────────────────────────────────────
UPDATE public.firm_accounts
SET max_drawdown = 1500
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'aqua-futures')
  AND size = 25000;

UPDATE public.firm_accounts
SET max_drawdown = 2500,
    max_contract_size = '3 contracts'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'aqua-futures')
  AND size = 50000;


-- ############################################################
-- PART 2: FUNDED PHASE DATA POPULATION
-- ############################################################

-- ═══════════════════════════════════════════════
-- 1. TOPSTEP
-- Source: help.topstep.com
-- Key changes: Trailing→EOD, consistency removed,
-- drawdown amounts change for 100K/150K
-- ═══════════════════════════════════════════════

-- $50K: drawdown stays $2,000 but type changes to EOD, no consistency
UPDATE public.firm_accounts
SET funded_drawdown_type = 'EOD',
    funded_consistency_rule = 'None',
    min_payout_amount = 125
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topstep')
  AND size = 50000;

-- $100K: drawdown changes to $3,000 EOD, no consistency
UPDATE public.firm_accounts
SET funded_max_drawdown = 3000,
    funded_drawdown_type = 'EOD',
    funded_consistency_rule = 'None',
    min_payout_amount = 125
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topstep')
  AND size = 100000;

-- $150K: drawdown changes to $4,500 EOD, no consistency
UPDATE public.firm_accounts
SET funded_max_drawdown = 4500,
    funded_drawdown_type = 'EOD',
    funded_consistency_rule = 'None',
    min_payout_amount = 125
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topstep')
  AND size = 150000;


-- ═══════════════════════════════════════════════
-- 2. LUCID TRADING
-- Source: support.lucidtrading.com
-- LucidFlex funded: no consistency, no DLL
-- LucidPro funded: 40% consistency, DLL = dynamic
-- ═══════════════════════════════════════════════

-- LucidFlex: eval has 50% consistency → funded has none
UPDATE public.firm_accounts
SET funded_consistency_rule = 'None',
    min_payout_amount = 500,
    max_payout_amount = 2000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'lucid-trading')
  AND plan_name = 'LucidFlex';

-- LucidPro: eval has no consistency → funded has 40%
UPDATE public.firm_accounts
SET funded_consistency_rule = '40%',
    min_payout_amount = 500,
    max_payout_amount = 2000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'lucid-trading')
  AND plan_name = 'LucidPro';


-- ═══════════════════════════════════════════════
-- 3. MYFUNDEDFUTURES (MFFU)
-- Source: help.myfundedfutures.com
-- Rapid funded: drawdown becomes intraday trailing
-- Core funded: 40% consistency (already set in migration 400000)
-- Contract limits exist for funded
-- ═══════════════════════════════════════════════

-- Rapid funded: drawdown type is intraday trailing (sim funded phase)
-- Already set funded_drawdown_type = 'RealTime' and funded_consistency_rule = 'None' in migration 400000
-- Add contract limits and payout info

UPDATE public.firm_accounts
SET funded_max_contract_size = '4 mini / 40 micro',
    min_payout_amount = 500,
    payout_buffer = 2100
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 50000;

UPDATE public.firm_accounts
SET funded_max_contract_size = '6 mini / 60 micro',
    min_payout_amount = 500,
    payout_buffer = 3100
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 100000;

UPDATE public.firm_accounts
SET funded_max_contract_size = '8 mini / 80 micro',
    min_payout_amount = 500,
    payout_buffer = 4600
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Rapid' AND size = 150000;

-- Core funded: add payout info
UPDATE public.firm_accounts
SET min_payout_amount = 500,
    payout_buffer = 2100
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'myfundedfutures')
  AND plan_name = 'Core';


-- ═══════════════════════════════════════════════
-- 4. TRADEIFY
-- Source: help.tradeify.co
-- SELECT funded: no consistency (big change from 40% eval)
-- SELECT funded drawdown decreases
-- Growth funded: keeps rules mostly same
-- ═══════════════════════════════════════════════

-- SELECT $50K: funded drawdown drops to $1,500, no consistency
UPDATE public.firm_accounts
SET funded_max_drawdown = 1500,
    funded_consistency_rule = 'None'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify')
  AND plan_name = 'SELECT' AND size = 50000;

-- SELECT $100K: funded drawdown drops to $2,000, no consistency
UPDATE public.firm_accounts
SET funded_max_drawdown = 2000,
    funded_consistency_rule = 'None'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify')
  AND plan_name = 'SELECT' AND size = 100000;

-- SELECT $150K: funded drawdown drops to $3,000, no consistency
UPDATE public.firm_accounts
SET funded_max_drawdown = 3000,
    funded_consistency_rule = 'None'
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'tradeify')
  AND plan_name = 'SELECT' AND size = 150000;

-- Growth: no funded-specific changes confirmed beyond what's already set
-- Growth profit split note says "100% first $15K then 90/10" — this is firm-level


-- ═══════════════════════════════════════════════
-- 5. ALPHA FUTURES
-- Source: help.alpha-futures.com
-- Zero qualified: 40% consistency (same as eval)
-- Standard qualified: consistency tightens to 40%, split tiered
-- Advanced qualified: NO consistency, NO DLL
-- ═══════════════════════════════════════════════

-- Standard Plan: consistency tightens from 50% to 40% when qualified
UPDATE public.firm_accounts
SET funded_consistency_rule = '40%',
    min_payout_amount = 200,
    max_payout_amount = 15000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'alpha-futures')
  AND plan_name = 'Standard Plan';

-- Advanced Plan: NO consistency when qualified (eval has 50%), NO DLL
UPDATE public.firm_accounts
SET funded_consistency_rule = 'None',
    min_payout_amount = 1000,
    max_payout_amount = 15000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'alpha-futures')
  AND plan_name = 'Advanced Plan';

-- Zero Plan: consistency stays 40%, payout info
UPDATE public.firm_accounts
SET min_payout_amount = 200
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'alpha-futures')
  AND plan_name = 'Zero Plan' AND size = 50000;

UPDATE public.firm_accounts
SET min_payout_amount = 200
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'alpha-futures')
  AND plan_name = 'Zero Plan' AND size = 100000;


-- ═══════════════════════════════════════════════
-- 6. FUNDEDNEXT FUTURES
-- Source: helpfutures.fundednext.com
-- Both Rapid and Legacy: no consistency when funded
-- Contract limits increase when funded
-- ═══════════════════════════════════════════════

-- Rapid Challenge: no consistency when funded, contract limits increase
UPDATE public.firm_accounts
SET funded_consistency_rule = 'None',
    funded_max_contract_size = '3 ES / 15 MES',
    min_payout_amount = 250
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Rapid Challenge' AND size = 25000;

UPDATE public.firm_accounts
SET funded_consistency_rule = 'None',
    funded_max_contract_size = '5 ES / 25 MES',
    min_payout_amount = 250,
    max_payout_amount = 1500
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Rapid Challenge' AND size = 50000;

UPDATE public.firm_accounts
SET funded_consistency_rule = 'None',
    funded_max_contract_size = '7 ES / 35 MES',
    min_payout_amount = 500,
    max_payout_amount = 2500
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Rapid Challenge' AND size = 100000;

-- Legacy Challenge: consistency removed when funded, contract limits increase
UPDATE public.firm_accounts
SET funded_consistency_rule = 'None',
    funded_max_contract_size = '3 ES / 30 MES',
    min_payout_amount = 250
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Legacy Challenge' AND size = 25000;

UPDATE public.firm_accounts
SET funded_consistency_rule = 'None',
    funded_max_contract_size = '5 ES / 50 MES',
    min_payout_amount = 250
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Legacy Challenge' AND size = 50000;

UPDATE public.firm_accounts
SET funded_consistency_rule = 'None',
    funded_max_contract_size = '7 ES / 70 MES',
    min_payout_amount = 250
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'fundednext-futures')
  AND plan_name = 'Legacy Challenge' AND size = 100000;


-- ═══════════════════════════════════════════════
-- 7. TOPONE TRADER
-- Source: help.toponetrader.com
-- NOTE: TopOne is forex/CFD, NOT futures.
-- 2-Step funded: consistency changes from 50% to 30%
-- 1-Step funded: no consistency rule
-- ═══════════════════════════════════════════════

-- 1-Step: no consistency when funded
UPDATE public.firm_accounts
SET funded_consistency_rule = 'None',
    funded_profit_split = '80/20',
    min_payout_amount = 1000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topone-trader')
  AND plan_name = '1-Step Challenge';

-- 2-Step: consistency drops from 50% to 30%
UPDATE public.firm_accounts
SET funded_consistency_rule = '30%',
    funded_profit_split = '80/20',
    min_payout_amount = 1000
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'topone-trader')
  AND plan_name = '2-Step Challenge';


-- ═══════════════════════════════════════════════
-- 8. TAKEPROFITTRADER
-- Source: takeprofittraderhelp.zendesk.com
-- PRO account: drawdown changes to intraday trailing
-- Buffer zone = max_drawdown amount
-- ═══════════════════════════════════════════════

-- $25K: buffer = $1,500
UPDATE public.firm_accounts
SET funded_drawdown_type = 'Trailing',
    payout_buffer = 1500,
    min_payout_amount = 500
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'takeprofittrader')
  AND size = 25000;

-- $50K: buffer = $2,000
UPDATE public.firm_accounts
SET funded_drawdown_type = 'Trailing',
    payout_buffer = 2000,
    min_payout_amount = 500
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'takeprofittrader')
  AND size = 50000;

-- $100K: buffer = $3,000
UPDATE public.firm_accounts
SET funded_drawdown_type = 'Trailing',
    payout_buffer = 3000,
    min_payout_amount = 500
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'takeprofittrader')
  AND size = 100000;

-- $150K: buffer = $4,500
UPDATE public.firm_accounts
SET funded_drawdown_type = 'Trailing',
    payout_buffer = 4500,
    min_payout_amount = 500
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'takeprofittrader')
  AND size = 150000;


-- ═══════════════════════════════════════════════
-- 9. AQUA FUTURES
-- Source: help.aquafutures.io
-- Funded: 40% consistency stays, payout limits per size
-- ═══════════════════════════════════════════════

-- $25K: min payout $250, max $750
UPDATE public.firm_accounts
SET min_payout_amount = 250,
    max_payout_amount = 750
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'aqua-futures')
  AND size = 25000;

-- $50K: min payout $250, max $1,500
UPDATE public.firm_accounts
SET min_payout_amount = 250,
    max_payout_amount = 1500
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'aqua-futures')
  AND size = 50000;


-- ═══════════════════════════════════════════════
-- 10. APEX TRADER FUNDING
-- Source: support.apextraderfunding.com
-- Funded: drawdown changes from Trailing to EOD static
-- Consistency stays 50%, daily loss limit same
-- Buffer = $100 above drawdown
-- ═══════════════════════════════════════════════

UPDATE public.firm_accounts
SET funded_drawdown_type = 'EOD',
    min_payout_amount = 500,
    payout_buffer = 100
WHERE firm_id = (SELECT id FROM public.firms WHERE slug = 'apex-trader-funding');


-- ═══════════════════════════════════════════════
-- Update last_verified timestamps
-- ═══════════════════════════════════════════════
UPDATE public.firm_accounts SET last_verified = NOW();
