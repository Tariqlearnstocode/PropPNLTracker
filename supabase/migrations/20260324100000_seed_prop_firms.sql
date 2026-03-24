-- ============================================================
-- Seed: 10 Prop Firms + Account Tiers
-- Data researched March 2026 from firm websites,
-- SmartPropFirm, PropFirmMatch, and help centers.
-- VERIFY before going live — prices change frequently.
-- ============================================================

-- =========================
-- 1. TOPSTEP
-- =========================
INSERT INTO public.firms (
  id, slug, name, logo_url, website, rating, category,
  founders, country, founded_year,
  max_funded_accounts, max_funded_allocation,
  platforms, payout_methods, payout_frequency,
  profit_split_note,
  support_email, support_discord, support_help_url, support_live_chat,
  inactivity_rule, copy_trading, max_before_live, clear_path_to_live,
  last_verified
) VALUES (
  gen_random_uuid(), 'topstep', 'Topstep', NULL,
  'https://www.topstep.com', 4.5, 'futures',
  'Michael Patak', 'United States', 2012,
  5, '$150,000',
  ARRAY['NinjaTrader', 'Tradovate', 'Quantower', 'Rithmic', 'TopstepX'],
  ARRAY['ACH', 'Wise', 'Wire'],
  'Weekly (every 5 days), daily after 30 winning trading days',
  '100% of first $10,000 then 90/10',
  'support@topstep.com', NULL, 'https://help.topstep.com', true,
  '30 days without trading may result in closure',
  'Allowed (own accounts only)', NULL,
  'Trading Combine → Express Funded → Live Funded',
  NOW()
);

INSERT INTO public.firm_accounts (id, firm_id, plan_name, account_type, size, size_label, price, activation_fee, reset_cost, profit_target, max_drawdown, drawdown_type, daily_loss_limit, max_contract_size, profit_split, min_days_to_pass, min_days_for_payout, news_trading, consistency_rule, algorithmic_trading, scalping_rules, last_verified) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='topstep'), 'Trading Combine', 'evaluation', 50000, '$50,000', 49, 149, NULL, 3000, 2000, 'Trailing', 1000, NULL, '90/10', 2, 5, 'Allowed', 'Best day cannot exceed 50% of profit target', 'Allowed', 'Not allowed (50%+ of winners must be 20+ seconds)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='topstep'), 'Trading Combine', 'evaluation', 100000, '$100,000', 99, 149, NULL, 6000, 4000, 'Trailing', 2000, NULL, '90/10', 2, 5, 'Allowed', 'Best day cannot exceed 50% of profit target', 'Allowed', 'Not allowed (50%+ of winners must be 20+ seconds)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='topstep'), 'Trading Combine', 'evaluation', 150000, '$150,000', 149, 149, NULL, 9000, 6000, 'Trailing', 3000, NULL, '90/10', 2, 5, 'Allowed', 'Best day cannot exceed 50% of profit target', 'Allowed', 'Not allowed (50%+ of winners must be 20+ seconds)', NOW());

-- =========================
-- 2. LUCID TRADING
-- =========================
INSERT INTO public.firms (
  id, slug, name, logo_url, website, rating, category,
  founders, country, founded_year,
  max_funded_accounts, max_funded_allocation,
  platforms, payout_methods, payout_frequency,
  profit_split_note,
  support_email, support_discord, support_help_url, support_live_chat,
  inactivity_rule, copy_trading, max_before_live, clear_path_to_live,
  last_verified
) VALUES (
  gen_random_uuid(), 'lucid-trading', 'Lucid Trading', NULL,
  'https://lucidtrading.com', 4.8, 'futures',
  'AJ Campanella', 'United States', 2025,
  NULL, '$150,000',
  ARRAY['NinjaTrader', 'Tradovate', 'TradingView', 'MotiveWave', 'Quantower', 'Sierra Chart', 'Jigsaw'],
  ARRAY['ACH', 'PayPal', 'Wire', 'Crypto (BTC/ETH/USDT/USDC)'],
  'On demand, funds arrive within 1-2 business days',
  '100% of first $10,000 then 90/10',
  'support@lucidtrading.com', NULL, 'https://support.lucidtrading.com', true,
  NULL, NULL, NULL, NULL,
  NOW()
);

INSERT INTO public.firm_accounts (id, firm_id, plan_name, account_type, size, size_label, price, activation_fee, reset_cost, profit_target, max_drawdown, drawdown_type, daily_loss_limit, max_contract_size, profit_split, min_days_to_pass, min_days_for_payout, news_trading, consistency_rule, algorithmic_trading, scalping_rules, last_verified) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='lucid-trading'), 'LucidFlex', 'evaluation', 50000, '$50,000', 130, 0, NULL, 3000, 2000, 'EOD', NULL, '4 minis', '90/10', 2, NULL, 'Allowed', 'Largest profitable day cannot exceed 50% of total profit', 'Allowed', 'Allowed (microscalping <5 sec flagged)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='lucid-trading'), 'LucidPro', 'evaluation', 50000, '$50,000', 216, 0, NULL, 3000, 2000, 'EOD', NULL, '4 minis', '90/10', 2, NULL, 'Allowed', 'Largest profitable day cannot exceed 50% of total profit', 'Allowed', 'Allowed (microscalping <5 sec flagged)', NOW());

-- =========================
-- 3. MYFUNDEDFUTURES (MFFU)
-- =========================
INSERT INTO public.firms (
  id, slug, name, logo_url, website, rating, category,
  founders, country, founded_year,
  max_funded_accounts, max_funded_allocation,
  platforms, payout_methods, payout_frequency,
  profit_split_note,
  support_email, support_discord, support_help_url, support_live_chat,
  inactivity_rule, copy_trading, max_before_live, clear_path_to_live,
  last_verified
) VALUES (
  gen_random_uuid(), 'myfundedfutures', 'MyFundedFutures', NULL,
  'https://myfundedfutures.com', 4.9, 'futures',
  'Matthew Leech, Graham Leech', 'United States', 2023,
  10, '$150,000',
  ARRAY['Tradovate', 'NinjaTrader', 'TradingView', 'Quantower', 'ATAS', 'Volumetrica'],
  ARRAY['Bank Transfer', 'Crypto (USDT/TRX)'],
  'Every 14 days',
  'Varies by plan: Rapid 90/10, Core 80/20',
  NULL, 'https://discord.gg/myfundedfutures', 'https://help.myfundedfutures.com', true,
  '1 trade per week minimum',
  'Not allowed', NULL, NULL,
  NOW()
);

INSERT INTO public.firm_accounts (id, firm_id, plan_name, account_type, size, size_label, price, activation_fee, reset_cost, profit_target, max_drawdown, drawdown_type, daily_loss_limit, max_contract_size, profit_split, min_days_to_pass, min_days_for_payout, news_trading, consistency_rule, algorithmic_trading, scalping_rules, last_verified) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='myfundedfutures'), 'Core', 'evaluation', 50000, '$50,000', 77, 0, 84, 3000, 2000, 'EOD', NULL, NULL, '80/20', 2, 5, 'Not allowed', 'Eval: no single day >50% of total profit. Funded: no single day >40% of cycle profits', 'Allowed', 'Allowed (microscalping >4 ticks)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='myfundedfutures'), 'Rapid', 'evaluation', 50000, '$50,000', 97, 0, 84, 2000, 2000, 'Trailing', NULL, NULL, '90/10', 2, 5, 'Allowed', 'Eval: no single day >50% of total profit. Funded: no consistency rule, $10K max daily profit', 'Allowed', 'Allowed (microscalping >4 ticks)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='myfundedfutures'), 'Rapid', 'evaluation', 100000, '$100,000', 172, 0, 84, 6000, 2000, 'Trailing', NULL, NULL, '90/10', 2, 5, 'Allowed', 'Eval: no single day >50% of total profit. Funded: no consistency rule, $10K max daily profit', 'Allowed', 'Allowed (microscalping >4 ticks)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='myfundedfutures'), 'Rapid', 'evaluation', 150000, '$150,000', 278, 0, 84, 9000, 2000, 'Trailing', NULL, NULL, '90/10', 2, 5, 'Allowed', 'Eval: no single day >50% of total profit. Funded: no consistency rule, $10K max daily profit', 'Allowed', 'Allowed (microscalping >4 ticks)', NOW());

-- =========================
-- 4. TRADEIFY
-- =========================
INSERT INTO public.firms (
  id, slug, name, logo_url, website, rating, category,
  founders, country, founded_year,
  max_funded_accounts, max_funded_allocation,
  platforms, payout_methods, payout_frequency,
  profit_split_note,
  support_email, support_discord, support_help_url, support_live_chat,
  inactivity_rule, copy_trading, max_before_live, clear_path_to_live,
  last_verified
) VALUES (
  gen_random_uuid(), 'tradeify', 'Tradeify', NULL,
  'https://tradeify.co', 4.8, 'futures',
  'Brett Simberkoff, Vinan Mistry', 'United States', 2022,
  5, '$150,000',
  ARRAY['Tradovate', 'NinjaTrader', 'TradingView'],
  ARRAY['ACH', 'Crypto (USDT/USDC)', 'Plane (International)'],
  'Same-day to 3 business days',
  'SELECT: 90/10. Growth: 100% first $15K then 90/10',
  'support@tradeify.co', 'https://discord.gg/tradeify', 'https://help.tradeify.co', false,
  '1 trade per week',
  'Allowed (own accounts only, max 5)', NULL, NULL,
  NOW()
);

INSERT INTO public.firm_accounts (id, firm_id, plan_name, account_type, size, size_label, price, activation_fee, reset_cost, profit_target, max_drawdown, drawdown_type, daily_loss_limit, max_contract_size, profit_split, min_days_to_pass, min_days_for_payout, news_trading, consistency_rule, algorithmic_trading, scalping_rules, last_verified) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='tradeify'), 'SELECT', 'evaluation', 50000, '$50,000', 159, 0, 95, 2500, 2000, 'EOD', NULL, '4 ES / 40 MES', '90/10', 3, NULL, 'Allowed', 'No single day can exceed 40% of total profit', 'Allowed', '50%+ of trades must be held >10 seconds', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='tradeify'), 'SELECT', 'evaluation', 100000, '$100,000', 259, 0, 95, 6000, 3000, 'EOD', NULL, '8 ES / 80 MES', '90/10', 3, NULL, 'Allowed', 'No single day can exceed 40% of total profit', 'Allowed', '50%+ of trades must be held >10 seconds', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='tradeify'), 'SELECT', 'evaluation', 150000, '$150,000', 359, 0, 95, 7500, 4500, 'EOD', NULL, '12 ES / 120 MES', '90/10', 3, NULL, 'Allowed', 'No single day can exceed 40% of total profit', 'Allowed', '50%+ of trades must be held >10 seconds', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='tradeify'), 'Growth', 'evaluation', 50000, '$50,000', 139, 0, 85, 2500, 2000, 'EOD', 1250, '4 ES / 40 MES', '90/10', 1, NULL, 'Allowed', NULL, 'Allowed', '50%+ of trades must be held >10 seconds', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='tradeify'), 'Growth', 'evaluation', 100000, '$100,000', 229, 0, 169, 5000, 3500, 'EOD', 2500, '8 ES / 80 MES', '90/10', 1, NULL, 'Allowed', NULL, 'Allowed', '50%+ of trades must be held >10 seconds', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='tradeify'), 'Growth', 'evaluation', 150000, '$150,000', 339, 0, 189, 7500, 5000, 'EOD', 3750, '12 ES / 120 MES', '90/10', 1, NULL, 'Allowed', NULL, 'Allowed', '50%+ of trades must be held >10 seconds', NOW());

-- =========================
-- 5. ALPHA FUTURES
-- =========================
INSERT INTO public.firms (
  id, slug, name, logo_url, website, rating, category,
  founders, country, founded_year,
  max_funded_accounts, max_funded_allocation,
  platforms, payout_methods, payout_frequency,
  profit_split_note,
  support_email, support_discord, support_help_url, support_live_chat,
  inactivity_rule, copy_trading, max_before_live, clear_path_to_live,
  last_verified
) VALUES (
  gen_random_uuid(), 'alpha-futures', 'Alpha Futures', NULL,
  'https://alpha-futures.com', 4.9, 'futures',
  'George Kohler & Andrew Blaylock', 'United Kingdom', 2024,
  3, '$450,000',
  ARRAY['NinjaTrader', 'Tradovate', 'TradingView', 'Quantower'],
  ARRAY['Rise', 'ACH', 'Wise', 'SWIFT', 'Wire', 'Crypto (USDT/USDC)'],
  'Every 14 days (Standard), every 5 winning days (Advanced/Zero)',
  'Standard: 70/30 → 80/20 → 90/10 tiered. Advanced/Zero: 90/10 flat',
  'support@alpha-futures.com', 'https://discord.gg/xk35FssWWF', 'https://help.alpha-futures.com', true,
  '10 trading days inactivity',
  'Own accounts only (no group/reverse trading)',
  '$120,000', '5 payouts or $120,000',
  NOW()
);

INSERT INTO public.firm_accounts (id, firm_id, plan_name, account_type, size, size_label, price, activation_fee, reset_cost, profit_target, max_drawdown, drawdown_type, daily_loss_limit, max_contract_size, profit_split, min_days_to_pass, min_days_for_payout, news_trading, consistency_rule, algorithmic_trading, scalping_rules, last_verified) VALUES
-- Zero Plan
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='alpha-futures'), 'Zero Plan', 'evaluation', 50000, '$50,000', 99, 0, 99, 3000, 2000, 'EOD', 1000, NULL, '90/10', 1, 5, 'Allowed', 'No single day can exceed 40% of total net profits (qualified accounts)', 'Allowed (semi-automated with manual oversight)', 'Tick/micro scalping prohibited (<10 ticks AND <2 minutes)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='alpha-futures'), 'Zero Plan', 'evaluation', 100000, '$100,000', 199, 0, 199, 6000, 3000, 'EOD', 2000, NULL, '90/10', 1, 5, 'Allowed', 'No single day can exceed 40% of total net profits (qualified accounts)', 'Allowed (semi-automated with manual oversight)', 'Tick/micro scalping prohibited (<10 ticks AND <2 minutes)', NOW()),
-- Standard Plan (has activation fee on funded)
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='alpha-futures'), 'Standard Plan', 'evaluation', 50000, '$50,000', 79, 149, 59, 3000, 2000, 'EOD', 1000, NULL, '70/30', 3, 14, 'Allowed', 'No single day can exceed 50% of total net profits', 'Allowed (semi-automated with manual oversight)', 'Tick/micro scalping prohibited (<10 ticks AND <2 minutes)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='alpha-futures'), 'Standard Plan', 'evaluation', 100000, '$100,000', 119, 149, 59, 6000, 3000, 'EOD', 2000, NULL, '70/30', 3, 14, 'Allowed', 'No single day can exceed 50% of total net profits', 'Allowed (semi-automated with manual oversight)', 'Tick/micro scalping prohibited (<10 ticks AND <2 minutes)', NOW()),
-- Advanced Plan
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='alpha-futures'), 'Advanced Plan', 'evaluation', 50000, '$50,000', 139, 149, 139, 4000, 1750, 'EOD', 1000, NULL, '90/10', 3, 5, 'Allowed', 'No single day can exceed 50% of total net profits', 'Allowed (semi-automated with manual oversight)', 'Tick/micro scalping prohibited (<10 ticks AND <2 minutes)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='alpha-futures'), 'Advanced Plan', 'evaluation', 100000, '$100,000', 279, 149, 279, 8000, 3500, 'EOD', 2000, NULL, '90/10', 3, 5, 'Allowed', 'No single day can exceed 50% of total net profits', 'Allowed (semi-automated with manual oversight)', 'Tick/micro scalping prohibited (<10 ticks AND <2 minutes)', NOW());

-- =========================
-- 6. FUNDEDNEXT FUTURES
-- =========================
INSERT INTO public.firms (
  id, slug, name, logo_url, website, rating, category,
  founders, country, founded_year,
  max_funded_accounts, max_funded_allocation,
  platforms, payout_methods, payout_frequency,
  profit_split_note,
  support_email, support_discord, support_help_url, support_live_chat,
  inactivity_rule, copy_trading, max_before_live, clear_path_to_live,
  last_verified
) VALUES (
  gen_random_uuid(), 'fundednext-futures', 'FundedNext Futures', NULL,
  'https://fundednext.com/futures', 4.4, 'futures',
  'Abdullah Jayed', 'United Arab Emirates', 2022,
  5, '$700,000',
  ARRAY['Tradovate', 'NinjaTrader', 'TradingView'],
  ARRAY['USDT (ERC20)', 'USDT (TRC20)', 'USDC (ERC20)'],
  'Every 3 days (Rapid), every 5 days (Legacy)',
  '80/20 reward share',
  'support@fundednext.com', 'https://discord.com/invite/fundednext-945622549373526056', 'https://helpfutures.fundednext.com', true,
  '7 days for Challenge, 30 days for FundedNext accounts',
  'Not allowed', NULL, NULL,
  NOW()
);

INSERT INTO public.firm_accounts (id, firm_id, plan_name, account_type, size, size_label, price, activation_fee, reset_cost, profit_target, max_drawdown, drawdown_type, daily_loss_limit, max_contract_size, profit_split, min_days_to_pass, min_days_for_payout, news_trading, consistency_rule, algorithmic_trading, scalping_rules, last_verified) VALUES
-- Rapid Challenge
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='fundednext-futures'), 'Rapid Challenge', 'evaluation', 25000, '$25,000', 99, 0, NULL, 1500, 1000, 'EOD', NULL, '2 ES / 10 MES', '80/20', 1, 5, 'Allowed', 'No consistency rule in Challenge phase', 'Allowed', 'Allowed (15-20 second minimum hold)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='fundednext-futures'), 'Rapid Challenge', 'evaluation', 50000, '$50,000', 180, 0, NULL, 3000, 2000, 'EOD', NULL, '3 ES / 15 MES', '80/20', 1, 5, 'Allowed', 'No consistency rule in Challenge phase', 'Allowed', 'Allowed (15-20 second minimum hold)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='fundednext-futures'), 'Rapid Challenge', 'evaluation', 100000, '$100,000', 280, 0, NULL, 5000, 2500, 'EOD', NULL, '5 ES / 25 MES', '80/20', 1, 5, 'Allowed', 'No consistency rule in Challenge phase', 'Allowed', 'Allowed (15-20 second minimum hold)', NOW()),
-- Legacy Challenge
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='fundednext-futures'), 'Legacy Challenge', 'evaluation', 25000, '$25,000', 80, 0, NULL, 1250, 1000, 'EOD', NULL, '2 ES / 20 MES', '80/20', 1, 5, 'Allowed', 'Daily profit cannot exceed 40% of total profit target', 'Allowed', 'Allowed (15-20 second minimum hold)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='fundednext-futures'), 'Legacy Challenge', 'evaluation', 50000, '$50,000', 160, 0, NULL, 2500, 2000, 'EOD', NULL, '3 ES / 30 MES', '80/20', 1, 5, 'Allowed', 'Daily profit cannot exceed 40% of total profit target', 'Allowed', 'Allowed (15-20 second minimum hold)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='fundednext-futures'), 'Legacy Challenge', 'evaluation', 100000, '$100,000', 250, 0, NULL, 6000, 3000, 'EOD', NULL, '5 ES / 50 MES', '80/20', 1, 5, 'Allowed', 'Daily profit cannot exceed 40% of total profit target', 'Allowed', 'Allowed (15-20 second minimum hold)', NOW());

-- =========================
-- 7. TOPONE TRADER
-- =========================
INSERT INTO public.firms (
  id, slug, name, logo_url, website, rating, category,
  founders, country, founded_year,
  max_funded_accounts, max_funded_allocation,
  platforms, payout_methods, payout_frequency,
  profit_split_note,
  support_email, support_discord, support_help_url, support_live_chat,
  inactivity_rule, copy_trading, max_before_live, clear_path_to_live,
  last_verified
) VALUES (
  gen_random_uuid(), 'topone-trader', 'TopOne Trader', NULL,
  'https://www.toponetrader.com', 4.5, 'futures',
  NULL, 'United States', 2023,
  NULL, '$200,000',
  ARRAY['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradeLocker', 'Match Trader'],
  ARRAY['Bank Transfer', 'Crypto'],
  'Every 14 days',
  'Up to 90% profit split',
  'support@toponetrader.com', NULL, 'https://help.toponetrader.com', true,
  NULL, 'Not allowed', NULL, NULL,
  NOW()
);

INSERT INTO public.firm_accounts (id, firm_id, plan_name, account_type, size, size_label, price, activation_fee, reset_cost, profit_target, max_drawdown, drawdown_type, daily_loss_limit, max_contract_size, profit_split, min_days_to_pass, min_days_for_payout, news_trading, consistency_rule, algorithmic_trading, scalping_rules, last_verified) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='topone-trader'), '1-Step Challenge', 'evaluation', 50000, '$50,000', 59, 0, NULL, 5000, 3500, 'Trailing', 2000, NULL, '75/25', 3, 14, 'Allowed', 'No single day profit can exceed 50% of total profits', 'Allowed', 'Tick scalping prohibited, holds must exceed 5 minutes', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='topone-trader'), '2-Step Challenge', 'evaluation', 50000, '$50,000', 89, 0, NULL, 5000, 4000, 'Static', 2000, NULL, '80/20', 3, 14, 'Allowed', 'No single day profit can exceed 50% of total profits. 30% once funded', 'Allowed', 'Tick scalping prohibited, holds must exceed 5 minutes', NOW());

-- =========================
-- 8. TAKEPROFITTRADER
-- =========================
INSERT INTO public.firms (
  id, slug, name, logo_url, website, rating, category,
  founders, country, founded_year,
  max_funded_accounts, max_funded_allocation,
  platforms, payout_methods, payout_frequency,
  profit_split_note,
  support_email, support_discord, support_help_url, support_live_chat,
  inactivity_rule, copy_trading, max_before_live, clear_path_to_live,
  last_verified
) VALUES (
  gen_random_uuid(), 'takeprofittrader', 'TakeProfitTrader', NULL,
  'https://takeprofittrader.com', 4.4, 'futures',
  'James Sixsmith', 'United States', 2022,
  5, '$150,000',
  ARRAY['TradingView', 'NinjaTrader', 'Tradovate', 'MotiveWave', 'Quantower', 'Jigsaw', 'Bookmap', 'MultiCharts', 'R|Trader'],
  ARRAY['Plaid', 'PayPal', 'Wise'],
  'Anytime after 5 trading days',
  'PRO: 80/20, PRO+: 90/10',
  'support@takeprofittrader.com', NULL, 'https://takeprofittraderhelp.zendesk.com', true,
  '7 days without a trade',
  'Allowed (max 5 accounts)', NULL, NULL,
  NOW()
);

INSERT INTO public.firm_accounts (id, firm_id, plan_name, account_type, size, size_label, price, activation_fee, reset_cost, profit_target, max_drawdown, drawdown_type, daily_loss_limit, max_contract_size, profit_split, min_days_to_pass, min_days_for_payout, news_trading, consistency_rule, algorithmic_trading, scalping_rules, last_verified) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='takeprofittrader'), '1-Step Test', 'evaluation', 25000, '$25,000', 150, 0, 100, 1500, 1500, 'EOD', NULL, '3 contracts', '80/20', 5, 5, 'Allowed', 'No single trading day may exceed 50% of total net profits', 'Allowed (own strategy only)', 'Allowed', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='takeprofittrader'), '1-Step Test', 'evaluation', 50000, '$50,000', 200, 0, 100, 3000, 2000, 'EOD', NULL, '6 contracts', '80/20', 5, 5, 'Allowed', 'No single trading day may exceed 50% of total net profits', 'Allowed (own strategy only)', 'Allowed', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='takeprofittrader'), '1-Step Test', 'evaluation', 100000, '$100,000', 275, 0, 100, 6000, 4000, 'EOD', NULL, '9 contracts', '80/20', 5, 5, 'Allowed', 'No single trading day may exceed 50% of total net profits', 'Allowed (own strategy only)', 'Allowed', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='takeprofittrader'), '1-Step Test', 'evaluation', 150000, '$150,000', 360, 0, 100, 9000, 4500, 'EOD', NULL, '12 contracts', '80/20', 5, 5, 'Allowed', 'No single trading day may exceed 50% of total net profits', 'Allowed (own strategy only)', 'Allowed', NOW());

-- =========================
-- 9. AQUA FUTURES
-- =========================
INSERT INTO public.firms (
  id, slug, name, logo_url, website, rating, category,
  founders, country, founded_year,
  max_funded_accounts, max_funded_allocation,
  platforms, payout_methods, payout_frequency,
  profit_split_note,
  support_email, support_discord, support_help_url, support_live_chat,
  inactivity_rule, copy_trading, max_before_live, clear_path_to_live,
  last_verified
) VALUES (
  gen_random_uuid(), 'aqua-futures', 'Aqua Futures', NULL,
  'https://www.aquafutures.io', 3.1, 'futures',
  NULL, 'United Arab Emirates', 2024,
  NULL, '$450,000',
  ARRAY['Quantower', 'Volumetrica'],
  ARRAY['Bank Transfer', 'Crypto (USDC/USDT)'],
  'On-demand with 48-hour processing',
  '100% of first $15,000 lifetime, 90% thereafter',
  'support@aquafunded.com', 'https://discord.gg/aquafutures', 'https://help.aquafutures.io', true,
  NULL, 'Not allowed', NULL, NULL,
  NOW()
);

INSERT INTO public.firm_accounts (id, firm_id, plan_name, account_type, size, size_label, price, activation_fee, reset_cost, profit_target, max_drawdown, drawdown_type, daily_loss_limit, max_contract_size, profit_split, min_days_to_pass, min_days_for_payout, news_trading, consistency_rule, algorithmic_trading, scalping_rules, last_verified) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='aqua-futures'), 'Beginner Evaluation', 'evaluation', 25000, '$25,000', 114, 0, NULL, 1500, 1000, 'EOD', 625, '1 contract', '90/10', NULL, 7, 'Allowed', 'No single trading day can equal or exceed 40% of total profits', 'Not allowed', 'Allowed (microscalping <30 sec prohibited)', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='aqua-futures'), 'Beginner Evaluation', 'evaluation', 50000, '$50,000', 164, 0, NULL, 3000, 2000, 'EOD', 1250, '2 contracts', '90/10', NULL, 7, 'Allowed', 'No single trading day can equal or exceed 40% of total profits', 'Not allowed', 'Allowed (microscalping <30 sec prohibited)', NOW());

-- =========================
-- 10. APEX TRADER FUNDING
-- =========================
INSERT INTO public.firms (
  id, slug, name, logo_url, website, rating, category,
  founders, country, founded_year,
  max_funded_accounts, max_funded_allocation,
  platforms, payout_methods, payout_frequency,
  profit_split_note,
  support_email, support_discord, support_help_url, support_live_chat,
  inactivity_rule, copy_trading, max_before_live, clear_path_to_live,
  last_verified
) VALUES (
  gen_random_uuid(), 'apex-trader-funding', 'Apex Trader Funding', NULL,
  'https://apextraderfunding.com', 4.5, 'futures',
  'Darrell Martin', 'United States', 2021,
  20, NULL,
  ARRAY['Rithmic', 'NinjaTrader', 'Tradovate', 'WealthCharts'],
  ARRAY['ACH', 'Wire Transfer'],
  'Twice monthly (1st-5th, 15th-19th)',
  '100% of first $25,000 per account, then 90/10',
  'support@apextraderfunding.com', NULL, 'https://support.apextraderfunding.com', false,
  NULL, 'Not allowed', NULL, NULL,
  NOW()
);

INSERT INTO public.firm_accounts (id, firm_id, plan_name, account_type, size, size_label, price, activation_fee, reset_cost, profit_target, max_drawdown, drawdown_type, daily_loss_limit, max_contract_size, profit_split, min_days_to_pass, min_days_for_payout, news_trading, consistency_rule, algorithmic_trading, scalping_rules, last_verified) VALUES
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='apex-trader-funding'), '1-Step Evaluation', 'evaluation', 25000, '$25,000', 118, 0, 80, 1500, 1250, 'Trailing', 500, '4 contracts', '90/10', 0, 5, 'Allowed (one direction only during news)', 'No single day profit can exceed 50% of total accumulated profit since last payout', 'Not allowed', 'Flipping allowed max 2 of 10 trading days', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='apex-trader-funding'), '1-Step Evaluation', 'evaluation', 50000, '$50,000', 131, 0, 80, 2500, 2500, 'Trailing', 1000, '10 contracts', '90/10', 0, 5, 'Allowed (one direction only during news)', 'No single day profit can exceed 50% of total accumulated profit since last payout', 'Not allowed', 'Flipping allowed max 2 of 10 trading days', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='apex-trader-funding'), '1-Step Evaluation', 'evaluation', 100000, '$100,000', 207, 0, 80, 5000, 5000, 'Trailing', 2000, '14 contracts', '90/10', 0, 5, 'Allowed (one direction only during news)', 'No single day profit can exceed 50% of total accumulated profit since last payout', 'Not allowed', 'Flipping allowed max 2 of 10 trading days', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='apex-trader-funding'), '1-Step Evaluation', 'evaluation', 150000, '$150,000', 297, 0, 80, 7500, 7500, 'Trailing', 3000, '17 contracts', '90/10', 0, 5, 'Allowed (one direction only during news)', 'No single day profit can exceed 50% of total accumulated profit since last payout', 'Not allowed', 'Flipping allowed max 2 of 10 trading days', NOW()),
(gen_random_uuid(), (SELECT id FROM public.firms WHERE slug='apex-trader-funding'), '1-Step Evaluation', 'evaluation', 300000, '$300,000', 517, 0, 80, 20000, 15000, 'Trailing', 6000, '35 contracts', '90/10', 0, 5, 'Allowed (one direction only during news)', 'No single day profit can exceed 50% of total accumulated profit since last payout', 'Not allowed', 'Flipping allowed max 2 of 10 trading days', NOW());
