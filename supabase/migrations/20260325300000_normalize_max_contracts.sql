-- ============================================================
-- Normalize max_contract_size to just a number
-- "3 contracts" → "3", "4 minis" → "4", "2 ES / 10 MES" → "2"
-- Also normalize funded_max_contract_size
-- ============================================================

-- Standard "N contracts" format
UPDATE public.firm_accounts
SET max_contract_size = regexp_replace(max_contract_size, '\s*contracts?$', '')
WHERE max_contract_size ~ '^\d+\s+contracts?$';

-- "N minis" format (Lucid)
UPDATE public.firm_accounts
SET max_contract_size = regexp_replace(max_contract_size, '\s*minis?$', '')
WHERE max_contract_size ~ '^\d+\s+minis?$';

-- "N ES / M MES" format — take the ES number (the standard contract count)
UPDATE public.firm_accounts
SET max_contract_size = split_part(max_contract_size, ' ', 1)
WHERE max_contract_size ~ '^\d+\s+ES\s*/\s*\d+\s+MES$';

-- Same for funded_max_contract_size
UPDATE public.firm_accounts
SET funded_max_contract_size = regexp_replace(funded_max_contract_size, '\s*contracts?$', '')
WHERE funded_max_contract_size ~ '^\d+\s+contracts?$';

UPDATE public.firm_accounts
SET funded_max_contract_size = regexp_replace(funded_max_contract_size, '\s*minis?$', '')
WHERE funded_max_contract_size ~ '^\d+\s+minis?$';

UPDATE public.firm_accounts
SET funded_max_contract_size = split_part(funded_max_contract_size, ' ', 1)
WHERE funded_max_contract_size ~ '^\d+\s+ES\s*/\s*\d+\s+MES$';
